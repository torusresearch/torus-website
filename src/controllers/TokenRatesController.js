import { ObservableStore } from '@metamask/obs-store'
import { normalize as normalizeAddress } from 'eth-sig-util'
import log from 'loglevel'

// By default, poll every 3 minutes
const DEFAULT_INTERVAL = 180 * 1000

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
  constructor({ interval = DEFAULT_INTERVAL, currency, tokensStore } = {}) {
    this.store = new ObservableStore()
    this.currency = currency
    this.interval = interval
    this.tokensStore = tokensStore
  }

  /**
   * Updates exchange rates for all tokens
   */
  async updateExchangeRates() {
    const contractExchangeRates = {}
    const nativeCurrency = this.currency ? this.currency.getState().nativeCurrency.toLowerCase() : 'eth'
    const uniqueTokens = [...new Set(this._tokens.map((token) => token.tokenAddress))]
    const pairs = uniqueTokens.join(',')
    const query = `contract_addresses=${pairs}&vs_currencies=${nativeCurrency}`
    if (uniqueTokens.length > 0) {
      try {
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/token_price/ethereum?${query}`)
        const prices = await response.json()
        uniqueTokens.forEach((token) => {
          const price = prices[token.toLowerCase()]
          contractExchangeRates[normalizeAddress(token)] = price ? price[nativeCurrency] : 0
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
      this.updateExchangeRates()
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
