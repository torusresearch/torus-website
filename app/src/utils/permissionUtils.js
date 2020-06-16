import { keccak256 } from 'ethereumjs-util'

import { TORUS_METHOD_PREFIX, WALLET_METHOD_PREFIX } from './enums'

// Custom permissions specifications
const permissionsSpec = {
  // Connext prefixed messages
  eth_sign_indra_prefix_message: (request) => {
    const { method, params } = request
    // ignore if not eth_sign
    if (method !== 'eth_sign') {
      return false
    }
    const data = params[1]
    const { customMessage, customPrefix } = params[2] || {}

    if (customPrefix !== '\u0015Indra Signed Message:\n') {
      return false
    }
    if (customPrefix && customMessage) {
      const hashBuffer = keccak256(Buffer.from(`${customPrefix}${customMessage.length.toString()}${customMessage}`, 'utf-8'))
      const hash = `0x${hashBuffer.toString('hex').toLowerCase()}`
      if (hash !== data.toLowerCase()) {
        throw new Error(`Message data ${data.toLowerCase()} does not match derived hash ${hash}`)
      }
      return true
    }
    return false
  },
  eth_sign_torus_prefix_message: (request) => {
    const { method, origin, params } = request
    // ignore if not eth_sign
    if (method !== 'eth_sign') {
      return false
    }
    // ignore if does not originate from authorised domain
    if (!/.+\.tor\.us$/.test(origin)) {
      return false
    }
    const data = params[1]
    const { customMessage, customPrefix } = params[2] || {}

    if (customPrefix !== '\u0019Torus Signed Message:\n') {
      return false
    }

    if (customPrefix && customMessage) {
      const hashBuffer = keccak256(Buffer.from(`${customPrefix}${customMessage.length.toString()}${customMessage}`, 'utf-8'))
      const hash = `0x${hashBuffer.toString('hex').toLowerCase()}`
      if (hash !== data.toLowerCase()) {
        throw new Error(`Message data ${data.toLowerCase()} does not match derived hash ${hash}`)
      }
      return true
    }
    return false
  },
}

export const addInternalMethodPrefix = (method) => `${WALLET_METHOD_PREFIX}_${method}`

export const addTorusMethodPrefix = (method) => `${TORUS_METHOD_PREFIX}_${method}`

export const prettyPrintData = (data) => {
  let finalString = ''
  Object.keys(data).forEach((x) => {
    finalString = `${finalString}\n${x}: ${data[x]}`
  })
  return finalString
}

export const isErrorObject = (error) => error && error.stack && error.message

export function evaluatePermissions(request, permissions) {
  for (const permission of permissions) {
    const spec = permissionsSpec[permission.type]
    if (spec) {
      return spec(request)
    }
  }
  return false
}
