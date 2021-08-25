import Connector from '@walletconnect/core'
import * as cryptoLib from '@walletconnect/iso-crypto'

import WalletConnectNoopStorage from './WalletConnectNoopStorage'

class WalletConnect extends Connector {
  constructor(connectorOpts, pushServerOpts) {
    super({
      cryptoLib,
      connectorOpts,
      pushServerOpts,
      sessionStorage: new WalletConnectNoopStorage(),
    })
  }
}

export default WalletConnect
