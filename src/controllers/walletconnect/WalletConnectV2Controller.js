import SignClient from '@walletconnect/sign-client'
import { getAccountsFromNamespaces, getChainsFromNamespaces, getSdkError, parseAccountId, parseChainId } from '@walletconnect/utils'
import log from 'loglevel'
import { isHexStrict } from 'web3-utils'

import config from '../../config'
import { SAFE_METHODS, SUPPORTED_WALLET_EVENTS } from '../../utils/enums'
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
      requiredNamespaces[key].chains.map((chain) => {
        accounts.push(`${chain}:${this.selectedAddress}`)
      })
      const supportedMethods = requiredNamespaces[key].methods.filter((method) => !!SAFE_METHODS.includes(method))
      const supportedEvents = requiredNamespaces[key].events.filter((event) => !!SUPPORTED_WALLET_EVENTS.includes(event))
      namespaces[key] = {
        accounts,
        methods: supportedMethods,
        events: supportedEvents,
      }
    })

    if (!namespaces.eip155) {
      await this.walletConnector.reject({
        id,
        reason: getSdkError('UNSUPPORTED_CHAINS'),
      })
      return
    }
    if (requiredNamespaces.eip155?.accounts?.length && namespaces.eip155.accounts.length === 0) {
      await this.walletConnector.reject({
        id,
        reason: getSdkError('UNSUPPORTED_ACCOUNTS'),
      })
      return
    }

    if (requiredNamespaces.eip155?.methods?.length && namespaces.eip155.methods.length < requiredNamespaces.eip155.methods.length) {
      await this.walletConnector.reject({
        id,
        reason: getSdkError('UNSUPPORTED_METHODS'),
      })
      return
    }

    if (requiredNamespaces.eip155?.events?.length && namespaces.eip155.events.length < requiredNamespaces.eip155.events.length) {
      await this.walletConnector.reject({
        id,
        reason: getSdkError('UNSUPPORTED_EVENTS'),
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
    this.walletConnector.on('disconnect', (payload) => {
      log.info('DISCONNECT', payload)
      this.walletConnector = undefined
      this.store.putState({})
    })
  }

  get sessionConfig() {
    return {
      currentChainId: isHexStrict(this.network.getProviderConfig().chainId)
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
    const incomingChainId = isHexStrict(parsedChainIdParams.reference)
      ? Number.parseInt(parsedChainIdParams.reference, 16)
      : Number.parseInt(parsedChainIdParams.reference, 10)
    // TODO: Create a UX flow to prompt user to switch chain, if requested chain is supported
    // currently we just throws an error and expect the dapp to switch chain.
    if (currentChainId !== incomingChainId) {
      const error = {
        code: 4002,
        message: `Failed or Rejected Request, request contains request id ${incomingChainId},
          whereas current selected chainId is ${currentChainId}`,
      }

      const response = { id, jsonrpc: '2.0', error }

      await this.walletConnector.respond({
        topic,
        response,
      })
      return
    }
    this.provider.send(request, async (error, res) => {
      if (error) {
        log.error(`FAILED REJECT REQUEST, ERROR ${error.message}`)
        const response = { id, jsonrpc: '2.0', error: getSdkError('USER_REJECTED_METHODS') }
        await this.walletConnector.respond({
          topic,
          response,
        })
      } else if (res.error) {
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
    })
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
