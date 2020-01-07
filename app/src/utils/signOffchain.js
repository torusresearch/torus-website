'use strict' // Enforce use of strict verion of JavaScript

const web3 = require('web3')

/** @notice Some Utility functions used by signOffchain */
const hex = value => web3.utils.toHex(value)
const pad = value => web3.utils.padLeft(value, 64)
const toHex = value => pad(hex(value))

/**
 * Creates input data, hashes it, then signs over it with all the given EOA
 * @notice Created changing https://github.com/torusresearch/torus-wallet/blob/b555729452e55614605c2b21aee986e0c299d5d2/utils/utilities.js#L39
 * to use web3
 * @function signOffchain
 * @param {EOA} signers
 * @param {*} from
 * @param {*} to
 * @param {*} value
 * @param {*} data
 * @param {*} nonce
 * @param {*} gasPrice
 * @param {*} gasLimit
 * @returns {hex} Signatures for the wallet to verify
 */
async function signOffchain(signers, from, to, value, data, nonce, gasPrice, gasLimit) {
  const input =
    '0x' +
    [
      '0x19',
      '0x00',
      from, // Must be Hex string
      to, // Must be Hex string
      toHex(value), // cannot be hex, as this converts it to hex
      data,
      nonce, // Shoul nonce be like this or below, since multisig executor uses the one below
      // toHex(nonce))
      toHex(gasPrice), // cannot be hex, as this converts it to hex
      toHex(gasLimit) // cannot be hex, as this converts it to hex
    ]
      .map(hex => hex.slice(2)) // Removes all the 0x
      .join('')

  const signedData = web3.utils.sha3(input)
  const signatures = signers.map(signer => signer.sign(signedData).signature)
  const signature = '0x' + signatures.map(signature => signature.substring(2)).join('')

  return signature
}

module.exports = signOffchain
