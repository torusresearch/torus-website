import randomId from '@chaitanyapotti/random-id'
import Torus from '@toruslabs/torus.js'
import { hashPersonalMessage } from 'ethereumjs-util'

import onloadTorus from './onload'

// Make this a class. Use ES6 class
class TorusExtended extends Torus {
  constructor() {
    super()
    this.instanceId = randomId()
    this.openLogin = null
  }

  hashMessage(message) {
    const bufferedMessage = Buffer.from(message)
    return hashPersonalMessage(bufferedMessage).toString('hex')
  }
}

/* Inialize torus object on load */
const torus = onloadTorus(new TorusExtended())

export default torus
