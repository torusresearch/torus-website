import { stripHexPrefix } from '@ethereumjs/util'
import BN from 'bn.js'

/**
 * Returns a [BinaryNumber]{@link BN} representation of the given hex value
 * @param {string} hex
 * @return {any}
 */
export default function hexToBn(hex) {
  return new BN(stripHexPrefix(hex), 16)
}
