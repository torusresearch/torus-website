import { addHexPrefix } from 'ethereumjs-util'
import EthQuery from 'ethjs-query'
import { cloneDeep } from 'lodash'
import log from 'loglevel'

import { BnMultiplyByFraction, bnToHex, hexToBn } from '../../utils/utils'

/**
tx-gas-utils are gas utility methods for Transaction manager
its passed ethquery
and used to do things like calculate gas of a tx.
@param {Object} provider - A network provider.
*/

class TxGasUtil {
  constructor(provider) {
    this.query = new EthQuery(provider)
  }

  /**
    @param txMeta {Object} - the txMeta object
    @returns {object} the txMeta object with the gas written to the txParams
  */
  async analyzeGasUsage(txMeta) {
    const block = await this.query.getBlockByNumber('latest', false)
    // fallback to block gasLimit
    log.error('blockGasLimit', block)
    const blockGasLimitBN = hexToBn(block.gasLimit)
    const saferGasLimitBN = BnMultiplyByFraction(blockGasLimitBN, 19, 20)
    let estimatedGasHex = bnToHex(saferGasLimitBN)
    let simulationFails

    try {
      estimatedGasHex = await this.estimateTxGas(txMeta, block.gasLimit)
    } catch (error) {
      log.warn(error)
      simulationFails = {
        reason: error.message,
        errorKey: error.errorKey,
        debug: { blockNumber: block.number, blockGasLimit: block.gasLimit },
      }
    }
    return { blockGasLimit: block.gasLimit, estimatedGasHex, simulationFails }
  }

  /**
    Estimates the tx's gas usage
    @param txMeta {Object} - the txMeta object
    @returns {string} the estimated gas limit as a hex string
  */
  async estimateTxGas(txMeta) {
    const txParams = cloneDeep(txMeta.txParams)

    // `eth_estimateGas` can fail if the user has insufficient balance for the
    // value being sent, or for the gas cost. We don't want to check their
    // balance here, we just want the gas estimate. The gas price is removed
    // to skip those balance checks. We check balance elsewhere. We also delete
    // maxFeePerGas and maxPriorityFeePerGas to support EIP-1559 txs.
    delete txParams.gasPrice
    delete txParams.maxFeePerGas
    delete txParams.maxPriorityFeePerGas

    return this.query.estimateGas(txParams)
  }

  /**
    Adds a gas buffer with out exceeding the block gas limit

    @param initialGasLimitHex {string} - the initial gas limit to add the buffer too
    @param blockGasLimitHex {string} - the block gas limit
    @returns {string} the buffered gas limit as a hex string
  */
  addGasBuffer(initialGasLimitHex, blockGasLimitHex, multiplier = 1.5) {
    const initialGasLimitBn = hexToBn(initialGasLimitHex)
    const blockGasLimitBn = hexToBn(blockGasLimitHex)
    const upperGasLimitBn = blockGasLimitBn.muln(0.9)
    const bufferedGasLimitBn = initialGasLimitBn.muln(multiplier)

    // if initialGasLimit is above blockGasLimit, dont modify it
    if (initialGasLimitBn.gt(upperGasLimitBn)) return bnToHex(initialGasLimitBn)
    // if bufferedGasLimit is below blockGasLimit, use bufferedGasLimit
    if (bufferedGasLimitBn.lt(upperGasLimitBn)) return bnToHex(bufferedGasLimitBn)
    // otherwise use blockGasLimit
    return bnToHex(upperGasLimitBn)
  }

  async getBufferedGasLimit(txMeta, multiplier) {
    const { blockGasLimit, estimatedGasHex, simulationFails } = await this.analyzeGasUsage(txMeta)

    // add additional gas buffer to our estimation for safety
    const gasLimit = this.addGasBuffer(addHexPrefix(estimatedGasHex), blockGasLimit, multiplier)
    return { gasLimit, simulationFails }
  }
}

export default TxGasUtil
