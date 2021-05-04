import randomId from '@chaitanyapotti/random-id'
import Torus from '@toruslabs/torus.js'
import { hashPersonalMessage } from 'ethereumjs-util'
import log from 'loglevel'

import setupMultiplex from './controllers/utils/setupMultiplex'
import onloadTorus from './onload'
import { fakeStream, selectChainId } from './utils/utils'

// Make this a class. Use ES6 class
class TorusExtended extends Torus {
  constructor() {
    super()
    this.instanceId = randomId()
    this.setupMultiplex = setupMultiplex
    this.openLogin = null
  }

  updateStaticData(payload) {
    log.info('STATIC DATA:', payload)
    const publicConfigOutStream = (this.metamaskMux && this.metamaskMux.getStream('publicConfig')) || fakeStream
    // JSON.stringify is used here even though the stream is in object mode
    // because it is parsed in the dapp context, this behavior emulates nonobject mode
    // for compatibility reasons when using pump
    if (payload.selectedAddress) {
      publicConfigOutStream.write(JSON.stringify({ selectedAddress: payload.selectedAddress }))
    } else if (payload.networkId) {
      publicConfigOutStream.write(JSON.stringify({ networkVersion: payload.networkId }))
      if (payload.networkId !== 'loading') {
        publicConfigOutStream.write(
          JSON.stringify({ chainId: selectChainId(payload.networkId.toString(), this.torusController.networkController.networkStore) })
        )
      }
    } else if (payload.isUnlocked) {
      publicConfigOutStream.write(JSON.stringify({ isUnlocked: payload.isUnlocked }))
    }
  }

  hashMessage(message) {
    const bufferedMessage = Buffer.from(message)
    return hashPersonalMessage(bufferedMessage).toString('hex')
  }
}

/* Inialize torus object on load */
const torus = onloadTorus(new TorusExtended())

export default torus
