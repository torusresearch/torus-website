import { ObservableStore } from '@metamask/obs-store'
import EthQuery from 'eth-query'
import { isHexString } from 'ethereumjs-util'
import { cloneDeep } from 'lodash'
import log from 'loglevel'
import pify from 'pify'

import {
  calculateTimeEstimate,
  fetchEthGasPriceEstimate as defaultFetchEthGasPriceEstimate,
  fetchGasEstimates as defaultFetchGasEstimates,
  fetchLegacyGasPriceEstimates as defaultFetchLegacyGasPriceEstimates,
} from './gas-util'

const GAS_FEE_API = 'https://mock-gas-server.herokuapp.com/'
export const LEGACY_GAS_PRICES_API_URL = 'https://api.metaswap.codefi.network/gasPrices'

/**
 * Indicates which type of gasEstimate the controller is currently returning.
 * This is useful as a way of asserting that the shape of gasEstimates matches
 * expectations. NONE is a special case indicating that no previous gasEstimate
 * has been fetched.
 */
export const GAS_ESTIMATE_TYPES = {
  // Fee Market describes the way gas is set after the london hardfork, and was
  // defined by EIP-1559.
  FEE_MARKET: 'fee-market',
  // Legacy describes gasPrice estimates from before london hardfork, when the
  // user is connected to mainnet and are presented with fast/average/slow
  // estimate levels to choose from.
  LEGACY: 'legacy',
  // EthGasPrice describes a gasPrice estimate received from eth_gasPrice. Post
  // london this value should only be used for legacy type transactions when on
  // networks that support EIP-1559. This type of estimate is the most accurate
  // to display on custom networks that don't support EIP-1559.
  ETH_GASPRICE: 'eth_gasPrice',
  // NoEstimate describes the state of the controller before receiving its first
  // estimate.
  NONE: 'none',
}

const defaultState = {
  gasFeeEstimates: {},
  estimatedGasFeeTimeBounds: {},
  gasEstimateType: GAS_ESTIMATE_TYPES.NONE,
}

/**
 * Controller that retrieves gas fee estimate data and polls for updated data on a set interval
 */
class GasFeeController {
  /**
   * Creates a GasFeeController instance
   *
   */
  constructor({
    interval = 30_000,
    fetchGasEstimates = defaultFetchGasEstimates,
    fetchEthGasPriceEstimate = defaultFetchEthGasPriceEstimate,
    fetchLegacyGasPriceEstimates = defaultFetchLegacyGasPriceEstimates,
    getCurrentNetworkEIP1559Compatibility,
    getCurrentAccountEIP1559Compatibility,
    getChainId,
    getCurrentNetworkLegacyGasAPICompatibility,
    getProvider,
    legacyAPIEndpoint = LEGACY_GAS_PRICES_API_URL,
    EIP1559APIEndpoint = GAS_FEE_API,
  }) {
    this.store = new ObservableStore(cloneDeep(defaultState))
    this.intervalDelay = interval
    this.fetchGasEstimates = fetchGasEstimates
    this.fetchEthGasPriceEstimate = fetchEthGasPriceEstimate
    this.fetchLegacyGasPriceEstimates = fetchLegacyGasPriceEstimates
    this.getProvider = getProvider

    this.getCurrentNetworkEIP1559Compatibility = getCurrentNetworkEIP1559Compatibility
    this.getCurrentNetworkLegacyGasAPICompatibility = getCurrentNetworkLegacyGasAPICompatibility
    this.getCurrentAccountEIP1559Compatibility = getCurrentAccountEIP1559Compatibility
    this.EIP1559APIEndpoint = EIP1559APIEndpoint
    this.legacyAPIEndpoint = legacyAPIEndpoint
    this.getChainId = getChainId
    this.currentChainId = this.getChainId()
    const provider = getProvider()
    this.ethQuery = pify(new EthQuery(provider))
  }

  get state() {
    return this.store.getState()
  }

  async onNetworkStateChange() {
    const newProvider = this.getProvider()
    const newChainId = this.getChainId()
    this.ethQuery = pify(new EthQuery(newProvider))
    if (this.currentChainId !== newChainId) {
      this.currentChainId = newChainId
      await this.resetPolling()
    }
  }

  async resetPolling() {
    this.stopPolling()
    await this.getGasFeeEstimatesAndStartPolling()
  }

  async fetchGasFeeEstimates(options) {
    return this._fetchGasFeeEstimateData(options)
  }

  async getGasFeeEstimatesAndStartPolling() {
    await this._fetchGasFeeEstimateData()
    this._startPolling()
  }

  /**
   * Gets and sets gasFeeEstimates in state
   *
   * @returns GasFeeEstimates
   */
  async _fetchGasFeeEstimateData(options = {}) {
    const { shouldUpdateState = true } = options
    let isEIP1559Compatible
    const isLegacyGasAPICompatible = this.getCurrentNetworkLegacyGasAPICompatibility()

    let chainId = this.getChainId()
    if (typeof chainId === 'string' && isHexString(chainId)) {
      chainId = Number.parseInt(chainId, 16)
    }
    try {
      isEIP1559Compatible = await this.getEIP1559Compatibility()
      // log.info('eip1559 compatible', isEIP1559Compatible)
    } catch (error) {
      log.warn(error)
      isEIP1559Compatible = false
    }

    let newState = cloneDeep(defaultState)

    try {
      if (isEIP1559Compatible) {
        // TODO: kovan is not working due to a bug in metamask api
        const estimates = await this.fetchGasEstimates(this.EIP1559APIEndpoint.replace('<chain_id>', `${chainId}`))
        const { suggestedMaxPriorityFeePerGas, suggestedMaxFeePerGas } = estimates.medium
        const estimatedGasFeeTimeBounds = this.getTimeEstimate(suggestedMaxPriorityFeePerGas, suggestedMaxFeePerGas)
        newState = {
          gasFeeEstimates: estimates,
          estimatedGasFeeTimeBounds,
          gasEstimateType: GAS_ESTIMATE_TYPES.FEE_MARKET,
        }
      } else if (isLegacyGasAPICompatible) {
        const estimates = await this.fetchLegacyGasPriceEstimates(this.legacyAPIEndpoint.replace('<chain_id>', `${chainId}`))
        newState = {
          gasFeeEstimates: estimates,
          estimatedGasFeeTimeBounds: {},
          gasEstimateType: GAS_ESTIMATE_TYPES.LEGACY,
        }
      } else {
        throw new Error('Main gas fee/price estimation failed. Use fallback')
      }
    } catch {
      try {
        const estimates = await this.fetchEthGasPriceEstimate(this.ethQuery)
        newState = {
          gasFeeEstimates: estimates,
          estimatedGasFeeTimeBounds: {},
          gasEstimateType: GAS_ESTIMATE_TYPES.ETH_GASPRICE,
        }
      } catch (error) {
        throw new Error(`Gas fee/price estimation failed. Message: ${error.message}`)
      }
    }
    if (shouldUpdateState) {
      this.store.updateState(newState)
    }

    return newState
  }

  disconnectPoller() {
    this.stopPolling()
  }

  stopPolling() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
    this.resetState()
  }

  /**
   * Prepare to discard this controller.
   *
   * This stops any active polling.
   */
  destroy() {
    this.stopPolling()
  }

  async _startPolling() {
    this._poll()
  }

  async _poll() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
    this.intervalId = setInterval(async () => {
      await this._fetchGasFeeEstimateData()
    }, this.intervalDelay)
  }

  resetState() {
    this.store.putState(cloneDeep(defaultState))
  }

  async getEIP1559Compatibility() {
    const currentNetworkIsEIP1559Compatible = await this.getCurrentNetworkEIP1559Compatibility()
    const currentAccountIsEIP1559Compatible = this.getCurrentAccountEIP1559Compatibility?.() ?? true

    return currentNetworkIsEIP1559Compatible && currentAccountIsEIP1559Compatible
  }

  getTimeEstimate(maxPriorityFeePerGas, maxFeePerGas) {
    if (!this.state.gasFeeEstimates || this.state.gasEstimateType !== GAS_ESTIMATE_TYPES.FEE_MARKET) {
      return {}
    }
    return calculateTimeEstimate(maxPriorityFeePerGas, maxFeePerGas, this.state.gasFeeEstimates)
  }
}

export default GasFeeController
