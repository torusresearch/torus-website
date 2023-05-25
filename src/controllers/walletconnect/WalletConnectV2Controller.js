import SignClient from '@walletconnect/sign-client'
import { getAccountsFromNamespaces, getChainsFromNamespaces, getSdkError, parseAccountId, parseChainId } from '@walletconnect/utils'
import { isAddress, isHexString, toQuantity } from 'ethers'
import log from 'loglevel'
import pify from 'pify'

import config from '../../config'
import createRandomId from '../../utils/random-id'
import { getIFrameOrigin, isMain } from '../../utils/utils'

class WalletConnectV2Controller {
  constructor(options) {
    this.walletConnector = undefined
    this.provider = options.provider
    this.network = options.network
    this.selectedAddress = ''
    this.store = options.store
  }

  async init(options) {
    // for plugin
    const walletUrl = isMain ? window.location.origin : getIFrameOrigin()
    this.walletConnector = await SignClient.init({
      projectId: config.walletConnectProjectId,
      metadata: {
        name: 'Torus Wallet',
        description: 'Wallet connect for torus wallet',
        url: walletUrl, // different urls for different hosted environments
        icons: [`${walletUrl}/favicon.png`],
      },
    })
    this.setStoreSession()
    this._setupListeners()
    if (options?.uri) {
      await this.walletConnector.pair({ uri: options.uri })
    } else if (this.sessionConfig.connectedTopic()) {
      await this._rehydrateConnection()
    }
  }

  async _onSessionApprove(proposal) {
    // Get required proposal data
    const { id, params } = proposal
    const { requiredNamespaces, relays } = params

    const namespaces = {
      eip155: {
        accounts: [],
        methods: [],
        events: [],
      },
    }
    Object.keys(requiredNamespaces).forEach((key) => {
      if (key !== 'eip155') return
      const accounts = []
      requiredNamespaces[key].chains.map(async (chain) => {
        const isChainSupported = await this._isChainIdSupported(chain)
        if (!isChainSupported) {
          await this.walletConnector.reject({
            id,
            reason: getSdkError('UNSUPPORTED_CHAINS', `${chain} is not supported`),
          })
        }
        accounts.push(`${chain}:${this.selectedAddress}`)
      })
      namespaces[key] = {
        accounts,
        methods: requiredNamespaces[key].methods,
        events: requiredNamespaces[key].events,
      }
    })

    if (!namespaces.eip155) {
      await this.walletConnector.reject({
        id,
        reason: getSdkError('UNSUPPORTED_CHAINS'),
      })
      return
    }

    const { acknowledged } = await this.walletConnector.approve({
      id,
      relayProtocol: relays[0].protocol,
      namespaces,
    })
    await acknowledged()
  }

  _setupListeners() {
    this.walletConnector.on('session_proposal', async (proposal) => {
      if (!this.walletConnector) return
      log.info('SESSION PROPOSAL', proposal)
      await this._onSessionApprove(proposal).catch((error_) => {
        log.error('error wc approval', error_)
        const response = { id: proposal.id, jsonrpc: '2.0', error: getSdkError('SESSION_SETTLEMENT_FAILED') }
        this.walletConnector.respond({
          topic: proposal.params.pairingTopic,
          response,
        })
      })
      this.setStoreSession()
    })
    this.walletConnector.on('session_update', (payload) => {
      if (!this.walletConnector) return
      log.info('SESSION UPDATE', payload)
      this.setStoreSession()
    })
    this.walletConnector.on('session_request', async (requestEvent) => {
      if (!this.walletConnector) return
      log.info('SESSION REQUEST', requestEvent)
      await this.onSessionRequest(requestEvent)
    })
    this.walletConnector.on('connect', (payload) => {
      if (!this.walletConnector) return
      log.info('SESSION CONNECT', payload)
      this.setStoreSession()
    })
    this.walletConnector.on('session_delete', (payload) => {
      log.info('DISCONNECT', payload)
      this.walletConnector = undefined
      this.store.putState({})
    })
  }

  get sessionConfig() {
    return {
      currentChainId: isHexString(this.network.getProviderConfig().chainId)
        ? Number.parseInt(this.network.getProviderConfig().chainId, 16)
        : this.network.getProviderConfig().chainId,
      currentAccounts: [this.selectedAddress],
      connectedTopic: () => {
        if (this.walletConnector?.session?.length) {
          // currently we are supporting only 1 active session
          const lastKeyIndex = this.walletConnector.session.keys.length - 1
          return this.walletConnector.session.get(this.walletConnector.session.keys[lastKeyIndex])?.topic
        }
        return undefined
      },
    }
  }

  async _isChainIdSupported(chain) {
    const parsedChain = parseChainId(chain)
    const chainIDNum = Number.parseInt(parsedChain.reference, 10)
    const networkDetails = Object.values(this.network.supportedNetworks).find((network) => {
      if (network.chainId === chainIDNum) {
        return true
      }
      return false
    })

    if (!networkDetails) {
      return false
    }

    return true
  }

  async _checkIfChainIdAllowed(chainId) {
    const sessionData = this.walletConnector?.session?.values || []
    const allChains = []
    for (const session of sessionData) {
      const chains = getChainsFromNamespaces(session.namespaces)
      allChains.push(...chains)
    }

    let chainAllowed = false
    for (const chain of allChains) {
      const parsedId = parseChainId(chain)
      if (Number.parseInt(parsedId.reference, 10) === chainId) {
        chainAllowed = true
        break
      }
    }
    return chainAllowed
  }

  async _processChainUpdate(chainId) {
    if (!this._checkIfChainIdAllowed(chainId)) {
      await this.disconnect()
    }
  }

  async _processAccountUpdate(address) {
    const sessionData = this.walletConnector?.session?.values || []
    const allAccounts = []
    for (const session of sessionData) {
      const accounts = getAccountsFromNamespaces(session.namespaces)
      allAccounts.push(...accounts)
    }

    let accountAllowed = false
    for (const account of allAccounts) {
      const parsedAccount = parseAccountId(account)
      if (parsedAccount.address?.toLowerCase() === address?.toLowerCase()) {
        accountAllowed = true
        break
      }
    }
    if (!accountAllowed) {
      await this.disconnect()
    }
  }

  async _rehydrateConnection() {
    if (!this.sessionConfig.connectedTopic()) return
    const { currentChainId } = this.sessionConfig
    if (!currentChainId) return
    if (!this.selectedAddress) return

    await this._processChainUpdate(currentChainId)
    await this._processAccountUpdate(this.selectedAddress)
  }

  setStoreSession() {
    if (this.sessionConfig.connectedTopic()) {
      const sessionData = JSON.stringify(this.walletConnector.session.values)
      this.store.putState({
        sessionData,
      })
    } else {
      this.store.putState({})
    }
  }

  onSessionRequest = async (requestEvent) => {
    const { params, topic, id } = requestEvent
    const { request, chainId } = params
    request.isWalletConnectRequest = 'true'
    request.id = id
    const { currentChainId } = this.sessionConfig
    const parsedChainIdParams = parseChainId(chainId)
    const incomingChainId = isHexString(parsedChainIdParams.reference)
      ? Number.parseInt(parsedChainIdParams.reference, 16)
      : Number.parseInt(parsedChainIdParams.reference, 10)
    const promisifiedProvider = pify(this.provider)
    if (currentChainId !== incomingChainId) {
      try {
        const res = await promisifiedProvider.send({
          id: createRandomId(),
          isWalletConnectRequest: true,
          method: 'wallet_switchEthereumChain',
          params: {
            chainId: toQuantity(incomingChainId),
          },
        })

        if (res?.error) {
          log.error(`FAILED REJECT REQUEST, ERROR ${JSON.stringify(res.error)}`)
          const response = { id, jsonrpc: '2.0', error: getSdkError('USER_REJECTED_METHODS') }
          await this.walletConnector.respond({
            topic,
            response,
          })
          return
        }
      } catch (error) {
        log.error(`FAILED CHAIN SWITCH REQUEST, ERROR ${error.message}`)
        const response = { id, jsonrpc: '2.0', error: getSdkError('USER_REJECTED_CHAINS') }
        await this.walletConnector.respond({
          topic,
          response,
        })
        return
      }
    }

    if (request.method === 'eth_signTypedData') {
      const data = isAddress(request.params[0]) ? request.params[1] : request.params[0]
      if (typeof data === 'object' && !Array.isArray(data)) request.method = 'eth_signTypedData_v4'
    }

    try {
      const res = await promisifiedProvider.send(request)
      if (res?.error) {
        log.error(`FAILED REJECT REQUEST, ERROR ${JSON.stringify(res.error)}`)
        const response = { id, jsonrpc: '2.0', error: getSdkError('USER_REJECTED_METHODS') }
        await this.walletConnector.respond({
          topic,
          response,
        })
      } else {
        log.info(`SUCCEEDED APPROVE REQUEST, RESULT ${JSON.stringify(res)}`)
        const response = { id, jsonrpc: '2.0', result: res.result }
        await this.walletConnector.respond({
          topic,
          response,
        })
      }
    } catch (error) {
      log.error(`FAILED REJECT REQUEST, ERROR ${error.message}`)
      const response = { id, jsonrpc: '2.0', error: getSdkError('USER_REJECTED_METHODS') }
      await this.walletConnector.respond({
        topic,
        response,
      })
    }
  }

  setSelectedAddress(address) {
    this.selectedAddress = address
    this._processAccountUpdate(address)
  }

  updateSession() {
    if (!this.walletConnector) return
    this._processChainUpdate(this.sessionConfig.currentChainId)
  }

  getPeerMetaURL() {
    return this.walletConnector?.session?.values[0]?.peer?.metadata?.url
  }

  async disconnect() {
    if (this.walletConnector && this.sessionConfig.connectedTopic()) {
      await this.walletConnector.disconnect({
        topic: this.sessionConfig.connectedTopic(),
      })
      this.walletConnector = undefined
    }
    this.store.putState({})
  }
}

export default WalletConnectV2Controller
