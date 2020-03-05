import randomId from '@chaitanyapotti/random-id'
import Torus from '@toruslabs/torus.js'
import * as ethUtil from 'ethereumjs-util'
import log from 'loglevel'

import config from './config'
import onloadTorus from './onload'
import { post } from './utils/httpHelpers'
import setupMultiplex from './utils/setupMultiplex'
import { fakeStream, selectChainId } from './utils/utils'

// Make this a class. Use ES6
class TorusExtended extends Torus {
  constructor() {
    super()
    this.instanceId = randomId()
    this.setupMultiplex = setupMultiplex
  }

  continueEnable(selectedAddress) {
    log.info('ENABLE WITH: ', selectedAddress)
    const oauthStream = this.communicationMux.getStream('oauth')
    oauthStream.write({ selectedAddress })
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
        publicConfigOutStream.write(JSON.stringify({ chainId: selectChainId(payload.networkId.toString(), this.torusController.provider) }))
      }
    } else if (payload.isUnlocked) {
      publicConfigOutStream.write(JSON.stringify({ isUnlocked: payload.isUnlocked }))
    }
  }

  getMessageForSigning(publicAddress) {
    return new Promise((resolve, reject) => {
      post(`${config.api}/auth/message`, {
        public_address: publicAddress
      })
        .then(response => {
          const { message } = response || {}
          resolve(message)
        })
        .catch(error => {
          log.error(error)
          reject(error)
        })
    })
  }

  hashMessage(message) {
    const bufferedMessage = Buffer.from(message)
    return ethUtil.hashPersonalMessage(bufferedMessage)
  }
}

/* Inialize torus object on load */
const torus = onloadTorus(new TorusExtended())

export default torus
