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
    try {
      if (this.walletConnector) {
        await this.walletConnector.killSession()
        this.walletConnector = undefined
      }
    } catch (error) {
      log.error(error)
    } finally {
      this.store.putState({})
    }
  }

  async init(options) {
    // options includes the uri
    // To kill session if the user scans a new uri
    if (this.walletConnector?.uri !== options?.uri && this.walletConnector?.killSession) this.walletConnector.killSession()
    this.walletConnector = new WalletConnect(options)
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
      this.walletConnector.approveSession(this.sessionConfig)
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
      // As wallet connect signTypeData is of type object,
      // and metamask eth_signTypeData is of type array,
      // so we explicitly modify the rpc method here.
      // Ref Issue -- https://github.com/MetaMask/metamask-mobile/issues/4441
      if (payload.method === 'eth_signTypedData') {
        const data = payload.params && payload.params[1] && JSON.parse(payload.params[1])
        if (typeof data === 'object' && !Array.isArray(data)) payload.method = 'eth_signTypedData_v4'
      }

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
    try {
      this.walletConnector?.updateSession(this.sessionConfig)
      if (this.walletConnector) this.setStoreSession()
    } catch (error) {
      log.error(error)
    }
  }

  getPeerMetaURL() {
    return this.walletConnector?.peerMeta?.url
  }
}

export default WalletConnectV1Controller
