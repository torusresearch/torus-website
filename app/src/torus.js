import randomId from 'random-id'
import Torus from '@toruslabs/torus.js'
import config from './config.js'
import onloadTorus from './onload.js'
import { post } from './utils/httpHelpers.js'

var log = require('loglevel')
const setupMultiplex = require('./utils/setupMultiplex').default
const ethUtil = require('ethereumjs-util')

// Make this a class. Use ES6
class TorusExtended extends Torus {
  constructor() {
    super()
    this.instanceId = randomId()
    this.setupMultiplex = setupMultiplex
  }
  continueEnable(selectedAddress) {
    log.info('ENABLE WITH: ', selectedAddress)
    var oauthStream = this.communicationMux.getStream('oauth')
    oauthStream.write({ selectedAddress: selectedAddress })
  }
  updateStaticData(payload) {
    log.info('STATIC DATA:', payload)
    var publicConfigOutStream = this.metamaskMux.getStream('publicConfig')
    // JSON.stringify is used here even though the stream is in object mode
    // because it is parsed in the dapp context, this behavior emulates nonobject mode
    // for compatibility reasons when using pump
    if (payload.selectedAddress) {
      publicConfigOutStream.write(JSON.stringify({ selectedAddress: payload.selectedAddress }))
    } else if (payload.networkId) {
      publicConfigOutStream.write(JSON.stringify({ networkVersion: payload.networkId }))
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
        .catch(err => {
          log.error(err)
          reject(err)
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
