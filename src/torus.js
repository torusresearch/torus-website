import randomId from '@chaitanyapotti/random-id'
import Torus from '@toruslabs/torus.js'
import { hashPersonalMessage } from 'ethereumjs-util'

import onloadTorus from './onload'

// Make this a class. Use ES6 class
class TorusExtended extends Torus {
  constructor() {
    super({ enableOneKey: true })
    this.instanceId = randomId()
  }

  hashMessage(message) {
    const bufferedMessage = Buffer.from(message)
    return hashPersonalMessage(bufferedMessage).toString('hex')
  }

  async getPublicAddress(endpoints, torusNodePubs, { v1Verifier, v2Verifier, verifierId }, isExtended) {
    try {
      const existingV1User = await super.getUserTypeAndAddress(endpoints, torusNodePubs, { verifier: v1Verifier, verifierId })
      if (existingV1User.typeOfUser === 'v1') {
        if (!isExtended) return existingV1User.address
        return existingV1User
      }
      // we don't support v2 users with v1 verifiers so get or assign the key for v2 user on v2 `verifier`
      const v2User = await super.getUserTypeAndAddress(endpoints, torusNodePubs, { verifier: v2Verifier, verifierId }, true)
      if (!isExtended) return v2User.address
      return v2User
    } catch (error) {
      if (error?.message.includes('Verifier + VerifierID has not yet been assigned')) {
        // if user doesn't have key then assign it with v2 verifier
        const newV2User = await super.getUserTypeAndAddress(endpoints, torusNodePubs, { verifier: v2Verifier, verifierId }, true)
        if (!isExtended) return newV2User.address
        return newV2User
      }
      throw error
    }
  }
}

/* Inialize torus object on load */
const torus = onloadTorus(new TorusExtended())

export default torus
