import { ObservableStore } from '@metamask/obs-store'
import { parseUri } from '@walletconnect/utils'

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
      const wc = parseUri(uri)
      if (wc.version === 1) {
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
    this.selectedAddress = ''
  }
}

export default WalletConnectController
