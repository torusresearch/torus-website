import SignClient from '@walletconnect/sign-client'
import log from 'loglevel'

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
      await this.walletConnector.killSession()
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
      projectId: options.projectId,
      relayUrl: options.WalletConnectRelayUrl,
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
    await this.walletConnector.pair({ uri: options.uri })
  }

  setStoreSession() {
    this.store.putState({ ...JSON.parse(JSON.stringify(this.walletConnector.session)), uri: this.walletConnector.uri })
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
      const supportedMethods = requiredNamespaces[key].methods.map((method) => !!SAFE_METHODS.includes(method))
      const supportedEvents = requiredNamespaces[key].events.map((event) => !!SUPPORTED_WALLET_EVENTS.includes(event))
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
    this.walletConnector.on('session_proposal', (err, proposal) => {
      if (!this.walletConnector) return
      log.info('SESSION PROPOSAL', err, proposal)
      this.onSessionApprove(proposal)
      this.setStoreSession()
    })
    this.walletConnector.on('session_update', (err, payload) => {
      if (!this.walletConnector) return
      log.info('SESSION UPDATE', err, payload)
      this.setStoreSession()
    })
    this.walletConnector.on('session_request', async (err, requestEvent) => {
      if (!this.walletConnector) return
      log.info('SESSION REQUEST', err, requestEvent)
      const { params } = requestEvent
      const { topic, request } = params
      if (err) {
        log.info(`CALL REQUEST INTERNAL, ERROR ${err.message}`)
        const response = { id: request.id, error: { message: `Failed or Rejected Request ${err.message}` } }
        await this.walletConnector.respond({
          topic,
          response,
        })
      }
      await this.onSessionRequest(requestEvent)
    })
    this.walletConnector.on('connect', (err, payload) => {
      if (!this.walletConnector) return
      log.info('SESSION UPDATE', err, payload)
      this.setStoreSession()
    })
    this.walletConnector.on('disconnect', (err, payload) => {
      log.info('DISCONNECT', err, payload)
      this.walletConnector = undefined
      this.store.putState({})
    })
  }

  get _sessionConfig() {
    return {
      currentChainId: this.network.getProviderConfig().chainId,
      currnentAccounts: [this.selectedAddress],
    }
  }

  setSelectedAddress(address) {
    // disconnect if address is not the same which was allowed
    // if (address !== this.selectedAddress) {
    //   this.disconnect()
    // }

    if (address !== this.selectedAddress) {
      this.selectedAddress = address
    }
    // eslint-disable-next-line no-console
    console.log('new address', address, this.walletConnector?.session)
  }

  updateSession() {
    // eslint-disable-next-line no-console
    console.log('new network and session', this._sessionConfig.currentChainId, this.walletConnector?.session)
    // this.walletConnector?.updateSession(this.sessionConfig)
    // if (this.walletConnector) this.setStoreSession()
  }

  getPeerMetaURL() {
    return this.walletConnector?.metadata?.url
  }
}

export default WalletConnectV2Controller
