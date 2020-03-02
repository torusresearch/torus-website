import ObservableStore from 'obs-store'
import log from 'loglevel'
import { normalize as normalizeAddress } from 'eth-sig-util'

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
    const pairs = this._tokens.map(token => token.tokenAddress).join(',')
    const query = `contract_addresses=${pairs}&vs_currencies=${nativeCurrency}`
    if (this._tokens.length > 0) {
      try {
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/token_price/ethereum?${query}`)
        const prices = await response.json()
        this._tokens.forEach(token => {
          const price = prices[token.tokenAddress.toLowerCase()]
          contractExchangeRates[normalizeAddress(token.tokenAddress)] = price ? price[nativeCurrency] : 0
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
    this._handle && clearInterval(this._handle)
    if (!interval) {
      return
    }
    this._handle = setInterval(() => {
      this.updateExchangeRates()
    }, interval)
  }
  /**
   * @type {Array}
   */
  set tokensStore(tokensStore) {
    this._tokensStore && this._tokensStore.unsubscribe()
    if (!tokensStore) {
      return
    }
    this._tokensStore = tokensStore
    this.tokens = tokensStore.getState().tokens
    tokensStore.subscribe(({ tokens = [] }) => {
      const tokenAddresses = tokens.map(x => x.tokenAddress)
      const presentAddresses = (this._tokens && this._tokens.map(x => x.tokenAddress)) || []
      if (tokenAddresses.sort().toString() !== presentAddresses.sort().toString()) this.tokens = tokens
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
