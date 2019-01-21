const createKeccakHash = require('keccak')

/**
 * Returns checksumed address based on EIP-55
 * @param {string} address
 */
function toChecksumAddress(address) {
  if (address == null) return ''
  // eslint-disable-next-line no-param-reassign
  address = address.toLowerCase().replace('0x', '')
  var hash = createKeccakHash('keccak256')
    .update(address)
    .digest('hex')
  var ret = '0x'

  for (var i = 0; i < address.length; i++) {
    if (parseInt(hash[i], 16) >= 8) {
      ret += address[i].toUpperCase()
    } else {
      ret += address[i]
    }
  }

  return ret
}

export default toChecksumAddress
