import { ObservableStore } from '@metamask/obs-store'
import SignClient from '@walletconnect/sign-client'
import log from 'loglevel'

class WalletConnectV2Controller {
  constructor(options) {
    this.walletConnector = undefined
    this.provider = options.provider
    this.network = options.network
    this.selectedAddress = ''
    this.store = new ObservableStore({})
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
    this.store.putState({ uri: this.walletConnector.uri })
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
      const accounts = []
      requiredNamespaces[key].chains.map((chain) => {
        // TODO: fix this check
        if (chain === 'eip155') {
          accounts.push(`${chain}:${this.selectedAddress}`)
        }
      })
      namespaces[key] = {
        accounts,
        methods: requiredNamespaces[key].methods,
        events: requiredNamespaces[key].events,
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
      // this.setStoreSession()
    })
    this.walletConnector.on('session_update', (err, payload) => {
      if (!this.walletConnector) return
      log.info('SESSION UPDATE', err, payload)
      //   this.setStoreSession()
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

  get sessionConfig() {
    return {
      chainId: this.network.getProviderConfig().chainId,
      accounts: [this.selectedAddress],
    }
  }

  setSelectedAddress(address) {
    if (address !== this.selectedAddress) {
      this.selectedAddress = address
      this.updateSession()
    }
  }

  updateSession() {
    this.walletConnector?.updateSession(this.sessionConfig)
    if (this.walletConnector) this.setStoreSession()
  }

  getPeerMetaURL() {
    return this.walletConnector?.peerMeta?.url
  }
}

export default WalletConnectV2Controller
