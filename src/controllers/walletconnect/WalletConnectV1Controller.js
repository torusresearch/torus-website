import log from 'loglevel'

import WalletConnect from './WalletConnect'

class WalletConnectV1Controller {
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
    if (this.walletConnector?.uri !== options?.uri && this.walletConnector?.killSession) this.walletConnector.killSession()
    this.walletConnector = new WalletConnect(options)
    log.info(this.walletConnector)
    if (!this.walletConnector.connected) {
      await this.walletConnector.createSession()
    }
    this.setStoreSession()
    this._setupListeners()
  }

  setStoreSession() {
    this.store.putState({ ...JSON.parse(JSON.stringify(this.walletConnector.session)), uri: this.walletConnector.uri })
  }

  _setupListeners() {
    this.walletConnector.on('session_request', (err, payload) => {
      if (!this.walletConnector) return
      log.info('SESSION REQUEST', err, payload)
      this.walletConnector.approveSession(this._sessionConfig)
      this.setStoreSession()
    })
    this.walletConnector.on('session_update', (err, payload) => {
      if (!this.walletConnector) return
      log.info('SESSION UPDATE', err, payload)
      this.setStoreSession()
    })
    this.walletConnector.on('call_request', (err, payload) => {
      if (!this.walletConnector) return
      log.info('CALL REQUEST', err, payload)
      if (err) {
        log.info(`CALL REQUEST INTERNAL, ERROR ${err.message}`)
        this.walletConnector.rejectRequest({ id: payload.id, error: { message: `Failed or Rejected Request ${err.message}` } })
      }
      payload.isWalletConnectRequest = 'true'
      this.provider.send(payload, (error, res) => {
        if (error) {
          log.info(`FAILED REJECT REQUEST, ERROR ${error.message}`)
          this.walletConnector.rejectRequest({ id: payload.id, error: { message: `Failed or Rejected Request ${error.message}` } })
        } else if (res.error) {
          log.info(`FAILED REJECT REQUEST, ERROR ${JSON.stringify(res.error)}`)
          this.walletConnector.rejectRequest({ id: payload.id, error: { message: `Failed or Rejected Request ${JSON.stringify(res.error)}` } })
        } else {
          log.info(`SUCCEEDED APPROVE REQUEST, RESULT ${JSON.stringify(res)}`)
          this.walletConnector.approveRequest({ id: payload.id, result: res.result })
        }
      })
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
    this.walletConnector?.updateSession(this._sessionConfig)
    if (this.walletConnector) this.setStoreSession()
  }

  getPeerMetaURL() {
    return this.walletConnector?.peerMeta?.url
  }
}

export default WalletConnectV1Controller