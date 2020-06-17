import { keccak256 } from 'ethereumjs-util'

import { TORUS_METHOD_PREFIX, WALLET_METHOD_PREFIX } from './enums'

export const ETH_SIGN_INDRA_PREFIX_MESSAGE = 'eth_sign_indra_prefix_message'
export const ETH_SIGN_TORUS_PREFIX_MESSAGE = 'eth_sign_torus_prefix_message'

// Custom permissions specifications
export const permissionsSpec = {
  // Connext prefixed messages
  [ETH_SIGN_INDRA_PREFIX_MESSAGE]: (request, permission) => {
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
    if (origin !== permission.domain) {
      return false
    }
    if (customPrefix && customMessage) {
      const hashBuffer = keccak256(Buffer.from(`${customPrefix}${customMessage.length.toString()}${customMessage}`, 'utf-8'))
      const hash = hashBuffer.toString('hex').toLowerCase()
      if (hash !== Buffer.from(data).toString('hex').toLowerCase()) {
        throw new Error(`Message data ${Buffer.from(data).toString('hex').toLowerCase()} does not match derived hash ${hash}`)
      }
      return true
    }
    return false
  },
  [ETH_SIGN_TORUS_PREFIX_MESSAGE]: (request, permission) => {
    const { method, origin, params } = request
    // ignore if not eth_sign
    if (method !== 'eth_sign') {
      return false
    }
    // ignore if does not originate from authorised domain
    if (!(/.+\.tor\.us$/.test(origin) || origin === permission.domain)) {
      return false
    }
    const data = params[1]
    const { customMessage, customPrefix } = params[2] || {}

    if (customPrefix !== '\u0019Torus Signed Message:\n') {
      return false
    }

    if (customPrefix && customMessage) {
      const hashBuffer = keccak256(Buffer.from(`${customPrefix}${customMessage.length.toString()}${customMessage}`, 'utf-8'))
      const hash = hashBuffer.toString('hex').toLowerCase()
      if (hash !== Buffer.from(data).toString('hex').toLowerCase()) {
        throw new Error(`Message data ${Buffer.from(data).toString('hex').toLowerCase()} does not match derived hash ${hash}`)
      }
      return true
    }
    return false
  },
}

// Custom permission descriptions
export const permissionsDesc = {
  [ETH_SIGN_INDRA_PREFIX_MESSAGE]: (domain) =>
    `Allow this site (${domain}) to sign Connext messages on your behalf. This does not allow the site to make Ethereum transactions.`,
  [ETH_SIGN_TORUS_PREFIX_MESSAGE]: (domain) =>
    `Allow this site (${domain}) to sign Torus messages on your behalf. This does not allow the site to make Ethereum transactions.`,
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
    if (spec && spec(request, permission)) {
      return true
    }
  }
  return false
}
