import { addHexPrefix, isValidAddress } from 'ethereumjs-util'

/**
@module
*/
export { getFinalStates, normalizeTxParameters as normalizeTxParams, validateFrom, validateRecipient, validateTxParameters as validateTxParams }

// functions that handle normalizing of that key in txParams
const normalizers = {
  from: (from, LowerCase = true) => (LowerCase ? addHexPrefix(from).toLowerCase() : addHexPrefix(from)),
  to: (to, LowerCase = true) => (LowerCase ? addHexPrefix(to).toLowerCase() : addHexPrefix(to)),
  nonce: (nonce) => addHexPrefix(nonce),
  customNonceValue: (nonce) => addHexPrefix(nonce),
  value: (value) => addHexPrefix(value),
  data: (data) => addHexPrefix(data),
  gas: (gas) => addHexPrefix(gas),
  gasPrice: (gasPrice) => addHexPrefix(gasPrice),
  isWalletConnectRequest: (isWalletConnectRequest) => isWalletConnectRequest,
}

/**
 * normalizes txParams
 * @param txParams {object}
 * @returns {object} normalized txParams
 */
function normalizeTxParameters(txParameters, LowerCase) {
  // apply only keys in the normalizers
  const normalizedTxParameters = {}
  for (const key in normalizers) {
    if (txParameters[key]) normalizedTxParameters[key] = normalizers[key](txParameters[key], LowerCase)
  }
  return normalizedTxParameters
}

/**
 * validates txParams
 * @param txParams {object}
 */
function validateTxParameters(txParameters) {
  validateFrom(txParameters)
  validateRecipient(txParameters)
  if ('value' in txParameters) {
    const value = txParameters.value.toString()
    if (value.includes('-')) {
      throw new Error(`Invalid transaction value of ${txParameters.value} not a positive number.`)
    }

    if (value.includes('.')) {
      throw new Error(`Invalid transaction value of ${txParameters.value} number must be in wei`)
    }
  }
}

/**
 * validates the from field in  txParams
 * @param txParams {object}
 */
function validateFrom(txParameters) {
  if (!(typeof txParameters.from === 'string')) throw new Error(`Invalid from address ${txParameters.from} not a string`)
  if (!isValidAddress(txParameters.from)) throw new Error('Invalid from address')
}

/**
 * validates the to field in  txParams
 * @param txParams {object}
 */
function validateRecipient(txParameters) {
  if (txParameters.to === '0x' || txParameters.to === null) {
    if (txParameters.data) {
      delete txParameters.to
    } else {
      throw new Error('Invalid recipient address')
    }
  } else if (txParameters.to !== undefined && !isValidAddress(txParameters.to)) {
    throw new Error('Invalid recipient address')
  }
  return txParameters
}

/**
 * @returns an {array} of states that can be considered final
 */
function getFinalStates() {
  return [
    'rejected', // the user has responded no!
    'confirmed', // the tx has been included in a block.
    'failed', // the tx failed for some reason, included on tx data.
    'dropped', // the tx nonce was already used
  ]
}
