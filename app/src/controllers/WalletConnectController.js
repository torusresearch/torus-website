import WalletConnect from '@walletconnect/client'
import log from 'loglevel'
import ObservableStore from 'obs-store'

class WalletConnectController {
  constructor(options) {
    this.walletConnector = undefined
    this.provider = options.provider
    this.network = options.network
    this.selectedAddress = ''
    this.store = new ObservableStore({})
  }

  async disconnect() {
    this.walletConnector.killSession({ message: 'User disconnected' })
    this.walletConnector = undefined
    this.store.putState({})
  }

  async init(options) {
    // options includes the uri
    log.info(options, 'wc init options')
    // TODO: set origin if wallet connect in store.js
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
    this.store.putState(JSON.parse(JSON.stringify(this.walletConnector.session)))
  }

  _setupListeners() {
    this.walletConnector.on('session_request', (err, payload) => {
      log.info('SESSION REQUEST', err, payload)
      this.walletConnector.approveSession(this.sessionConfig)
      this.setStoreSession()
    })
    this.walletConnector.on('session_update', (err, payload) => {
      log.info('SESSION UPDATE', err, payload)
      this.setStoreSession()
    })
    this.walletConnector.on('call_request', (err, payload) => {
      log.info('CALL REQUEST', err, payload)
      if (err) {
        log.info(`CALL REQUEST INTERNAL, ERROR ${err.message}`)
        this.walletConnector.rejectRequest({ id: payload.id, error: { message: `Failed or Rejected Request ${err.message}` } })
      }
      payload.params[0].isWalletConnectRequest = 'true'
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
    const a = {
      chainId: this.network.getProviderConfig().chainId,
      accounts: [this.selectedAddress],
    }
    log.info(a, 'session config')
    return a
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
}

export default WalletConnectController
