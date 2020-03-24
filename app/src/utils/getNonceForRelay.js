// Enforce use of strict verion of JavaScript

/**
 * Function to get nonce constructed from block number and timestamp
 * @function getNonceForRelay
 * @returns {hex string} Nonce
 */
async function getNonceForRelay(web3) {
  const block = await web3.eth.getBlockNumber()
  const timestamp = new Date().getTime()

  /** @notice Some Utility functions used by getNonceForRelay */
  const hex = value => web3.utils.toHex(value)
  const pad = value => web3.utils.padLeft(value, 32)
  const toHex = value => pad(hex(value))
  return `0x${toHex(block).slice(2)}${toHex(timestamp).slice(2)}`
}
module.exports = getNonceForRelay
