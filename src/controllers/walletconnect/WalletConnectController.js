import { ObservableStore } from '../utils/ObservableStore'
import WalletConnectV1Controller from './WalletConnectV1Controller'
import WalletConnectV2Controller from './WalletConnectV2Controller'

class WalletConnectController {
  constructor(options) {
    this.walletConnectorController = undefined
    this.provider = options.provider
    this.network = options.network
    this.store = new ObservableStore({})
    this.selectedAddress = ''
  }

  async init(options) {
    const uri = options?.uri || options.session?.uri
    const sessionV2Data = options?.session?.sessionData
    if (uri) {
      // Example url:
      // "wc:cad627c2-02ac-462c-a3ae-737b82f0b927@1?bridge=https%3A%2F%2Fb.bridge.
      // walletconnect.org&key=ab2d17eecdd56673dfce4efbdb3f8ab9e63e2df6a4d20cf99cdde910906a906d"
      const splitByQueryParams = uri.split('?')
      if (splitByQueryParams.length !== 2) {
        throw new Error('Invalid wallet connect url')
      }
      const splitByVersion = splitByQueryParams[0].split('@')
      if (splitByVersion.length !== 2) {
        throw new Error('Invalid wallet connect url')
      }
      if (!splitByVersion[1]) {
        throw new Error('Invalid wallet connect url')
      }
      const version = Number.parseInt(splitByVersion[1], 10)
      if (version === 1) {
        this.walletConnectorController = new WalletConnectV1Controller({
          provider: this.provider,
          network: this.network,
          store: this.store,
        })
      } else {
        this.walletConnectorController = new WalletConnectV2Controller({
          provider: this.provider,
          network: this.network,
          store: this.store,
        })
      }
    } else if (sessionV2Data) {
      this.walletConnectorController = new WalletConnectV2Controller({
        provider: this.provider,
        network: this.network,
        store: this.store,
      })
    }
    this.walletConnectorController.setSelectedAddress(this.selectedAddress)
    await this.walletConnectorController.init(options)
  }

  setSelectedAddress(address) {
    this.selectedAddress = address
    this.walletConnectorController?.setSelectedAddress(address)
  }

  updateSession() {
    this.walletConnectorController?.updateSession()
  }

  getPeerMetaURL() {
    return this.walletConnectorController?.getPeerMetaURL()
  }

  async disconnect() {
    if (this.walletConnectorController) {
      await this.walletConnectorController.disconnect()
    }
    this.store.putState({})
    this.walletConnectorController = undefined
  }
}

export default WalletConnectController
