import { normalize as normalizeAddress } from '@metamask/eth-sig-util'
import BigNumber from 'bignumber.js'
import log from 'loglevel'

import { COINGECKO_PLATFORMS_CHAIN_CODE_MAP, COINGECKO_SUPPORTED_CURRENCIES } from '../utils/enums'
import { idleTimeTracker } from '../utils/utils'
import { ObservableStore } from './utils/ObservableStore'

// By default, poll every 10 minutes
const DEFAULT_INTERVAL = 600 * 1000

/**
 * A controller that polls for token exchange
 * rates based on a user's current token list
 */
class TokenRatesController {
  /**
   * Creates a TokenRatesController
   *
   * @param {Object} [config] - Options to configure controller
   */
  constructor({ interval = DEFAULT_INTERVAL, currency, tokensStore, getChainId } = {}) {
    this.store = new ObservableStore()
    this.currency = currency
    this.interval = interval
    this.tokensStore = tokensStore
    this.getChainId = getChainId
  }

  /**
   * Updates exchange rates for all tokens
   */
  async updateExchangeRates() {
    const contractExchangeRates = {}
    const currentChainId = typeof this.getChainId === 'function' ? this.getChainId() : null // hex string
    const currentChainIdNumber = Number.parseInt(currentChainId, 16)
    const platform = COINGECKO_PLATFORMS_CHAIN_CODE_MAP[currentChainIdNumber]?.platform
    const nativeCurrency = this.currency ? this.currency.getState().nativeCurrency.toLowerCase() : 'eth'
    const supportedCurrency = COINGECKO_SUPPORTED_CURRENCIES.has(nativeCurrency)
      ? nativeCurrency
      : this.currency?.getState().commonDenomination.toLowerCase() || 'eth'
    const uniqueTokens = [...new Set(this._tokens.map((token) => token.tokenAddress))]
    const pairs = uniqueTokens.join(',')
    const query = `contract_addresses=${pairs}&vs_currencies=${supportedCurrency}`
    let conversionFactor = 1
    if (supportedCurrency !== nativeCurrency) {
      conversionFactor = this.currency?.getState().commonDenominatorPrice || 1
    }
    if (uniqueTokens.length > 0 && platform) {
      try {
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/token_price/${platform}?${query}`)
        const prices = await response.json()
        uniqueTokens.forEach((token) => {
          const price = prices[token.toLowerCase()]
          contractExchangeRates[normalizeAddress(token)] =
            price && conversionFactor ? new BigNumber(price[supportedCurrency]).div(conversionFactor).toNumber() : 0
        })
        this.store.putState({ contractExchangeRates })
      } catch (error) {
        log.warn('MetaMask - TokenRatesController exchange rate fetch failed.', error)
      }
    }
  }

  /**
   * @type {Number}
   */
  set interval(interval) {
    if (this._handle) clearInterval(this._handle)
    if (!interval) {
      return
    }
    this._handle = setInterval(() => {
      if (!idleTimeTracker.checkIfIdle()) {
        this.updateExchangeRates()
      }
    }, interval)
  }

  set tokensStore(tokensStore) {
    if (this._tokensStore) this._tokensStore.unsubscribe()
    if (!tokensStore) {
      return
    }
    this._tokensStore = tokensStore
    this.tokens = Object.values(tokensStore.getState()).flat()
    tokensStore.subscribe((state) => {
      this.tokens = Object.values(state).flat()
      // const tokenAddresses = tokens.map(x => x.tokenAddress)
      // const presentAddresses = (this._tokens && this._tokens.map(x => x.tokenAddress)) || []
      // if (tokenAddresses.sort().toString() !== presentAddresses.sort().toString()) this.tokens = tokens
    })
  }

  /**
   * @type {Array}
   */
  set tokens(tokens) {
    this._tokens = tokens
    this.updateExchangeRates()
  }
}

export default TokenRatesController
