import { parseUri } from '@walletconnect/utils'

import WalletConnectV1Controller from './WalletConnectV1Controller'
import WalletConnectV2Controller from './WalletConnectV2Controller'

class WalletConnectController {
  constructor(options) {
    this.walletConnectorController = undefined
    this.provider = options.provider
    this.network = options.network
  }

  async disconnect() {
    if (!this.walletConnectorController) return
    await this.walletConnectorController.disconnect()
    this.walletConnectorController = undefined
  }

  async init(options) {
    const wc = parseUri(options.uri)
    if (wc.version === 1) {
      this.walletConnectorController = new WalletConnectV1Controller({
        provider: this.provider,
        network: this.network,
      })
    } else {
      this.walletConnectorController = new WalletConnectV2Controller({
        provider: this.provider,
        network: this.network,
      })
    }
    await this.walletConnectorController.init(options)
  }
}

export default WalletConnectController
