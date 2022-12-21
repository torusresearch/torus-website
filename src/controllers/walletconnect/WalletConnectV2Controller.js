import SignClient from '@walletconnect/sign-client'
import { getAccountsFromNamespaces, getChainsFromNamespaces, parseAccountId, parseChainId } from '@walletconnect/utils'
import log from 'loglevel'
import { isHexStrict } from 'web3-utils'

import { SAFE_METHODS, SUPPORTED_WALLET_EVENTS } from '../../utils/enums'

class WalletConnectV2Controller {
  constructor(options) {
    this.walletConnector = undefined
    this.provider = options.provider
    this.network = options.network
    this.selectedAddress = ''
    this.store = options.store
  }

  async disconnect() {
    if (this.walletConnector) {
      await this.walletConnector.disconnect({
        topic: this._sessionConfig.connectedTopic,
      })
      this.walletConnector = undefined
    }
    this.store.putState({})
  }

  async init(options) {
    // options includes the uri
    // To kill session if the user scans a new uri
    if (this.walletConnector?.uri !== options?.uri && this.walletConnector?.disconnect) this.walletConnector.disconnect()
    this.walletConnector = await SignClient.init({
      logger: 'debug',
      projectId: '04309ed1007e77d1f119b85205bb779d',
      metadata: {
        name: 'Torus Wallet',
        description: 'Wallet connect for torus wallet',
        url: 'https://app.tor.us',
        icons: ['https://app.tor.us/favicon.ico'],
      },
    })
    log.info(this.walletConnector)
    this.setStoreSession()
    this._setupListeners()
    if (options?.uri) {
      await this.walletConnector.pair({ uri: options.uri })
    }
  }

  setStoreSession() {
    if (this.walletConnector?.session?.values) {
      const sessionData = JSON.stringify(this.walletConnector.session.values)
      this.store.putState({
        sessionData,
      })
    } else {
      this.store.putState({})
    }
  }

  onSessionRequest = async (requestEvent) => {
    // eslint-disable-next-line no-console
    console.log('session_request', requestEvent)
    const { params } = requestEvent
    const { topic, request } = params
    // const requestSession = this.walletConnector.session.get(topic)

    request.isWalletConnectRequest = 'true'
    this.provider.send(request, async (error, res) => {
      if (error) {
        log.info(`FAILED REJECT REQUEST, ERROR ${error.message}`)
        const response = { id: request.id, error: { message: `Failed or Rejected Request ${error.message}` } }
        await this.walletConnector.respond({
          topic,
          response,
        })
      } else if (res.error) {
        log.info(`FAILED REJECT REQUEST, ERROR ${JSON.stringify(res.error)}`)
        const response = { id: request.id, error: { message: `Failed or Rejected Request ${JSON.stringify(res.error)}` } }
        await this.walletConnector.respond({
          topic,
          response,
        })
      } else {
        log.info(`SUCCEEDED APPROVE REQUEST, RESULT ${JSON.stringify(res)}`)
        const response = { id: request.id, result: res.result }
        await this.walletConnector.respond({
          topic,
          response,
        })
      }
    })
  }

  async onSessionApprove(proposal) {
    // Get required proposal data
    const { id, params } = proposal
    const { requiredNamespaces, relays } = params

    const namespaces = {}
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
      await this.onSessionApprove(proposal)
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

  get _sessionConfig() {
    return {
      currentChainId: isHexStrict(this.network.getProviderConfig().chainId)
        ? Number.parseInt(this.network.getProviderConfig().chainId, 16)
        : this.network.getProviderConfig().chainId,
      currentAccounts: [this.selectedAddress],
      connectedTopic: this.walletConnector?.session?.values?.[0]?.topic, // currently we are supporting only 1 active session
    }
  }

  setSelectedAddress(address) {
    if (!this.walletConnector) return
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
      this.disconnect()
    } else {
      this.selectedAddress = address
    }
  }

  updateSession() {
    if (!this.walletConnector) return
    const sessionData = this.walletConnector?.session?.values || []
    const allChains = []
    for (const session of sessionData) {
      const chains = getChainsFromNamespaces(session.namespaces)
      allChains.push(...chains)
    }

    let chainAllowed = false
    for (const chain of allChains) {
      const parsedId = parseChainId(chain)
      if (Number.parseInt(parsedId.reference, 10) === this._sessionConfig.currentChainId) {
        chainAllowed = true
        break
      }
    }
    if (!chainAllowed) {
      this.disconnect()
    }
  }

  getPeerMetaURL() {
    return this.walletConnector?.session?.values[0]?.peer?.metadata?.url
  }
}

export default WalletConnectV2Controller
