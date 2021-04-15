import { ObservableStore } from '@metamask/obs-store'
import log from 'loglevel'

import config from '../config'

// every ten minutes
const POLLING_INTERVAL = 600000

class CurrencyController {
  /**
   * Controller responsible for managing data associated with the currently selected currency.
   *
   * @typedef {Object} CurrencyController
   * @param {object} opts Overrides the defaults for the initial state of this.store
   * @property {array} opts.initState  initializes the the state of the CurrencyController. Can contain an
   * currentCurrency, conversionRate and conversionDate properties
   * @property {string} currentCurrency A 2-4 character shorthand that describes a specific currency, currently
   * selected by the user
   * @property {number} conversionRate The conversion rate from ETH to the selected currency.
   * @property {string} conversionDate The date at which the conversion rate was set. Expressed in in milliseconds
   * since midnight of January 1, 1970
   * @property {number} conversionInterval The id of the interval created by the scheduleConversionInterval method.
   * Used to clear an existing interval on subsequent calls of that method.
   * @property {string} nativeCurrency The ticker/symbol of the native chain currency
   *
   */
  constructor(options = {}) {
    const initState = {
      currentCurrency: 'usd',
      conversionRate: 0,
      conversionDate: 'N/A',
      nativeCurrency: 'ETH',
      ...options.initState,
    }
    this.store = new ObservableStore(initState)
  }

  get state() {
    return this.store.getState()
  }

  //
  // PUBLIC METHODS
  //

  /**
   * A getter for the nativeCurrency property
   *
   * @returns {string} A 2-4 character shorthand that describes the specific currency
   *
   */
  getNativeCurrency() {
    return this.store.getState().nativeCurrency
  }

  /**
   * A setter for the nativeCurrency property
   *
   * @param {string} nativeCurrency The new currency to set as the nativeCurrency in the store
   *
   */
  setNativeCurrency(nativeCurrency) {
    this.store.updateState({
      nativeCurrency,
      ticker: nativeCurrency,
    })
  }

  /**
   * A getter for the currentCurrency property
   *
   * @returns {string} A 2-4 character shorthand that describes a specific currency, currently selected by the user
   *
   */
  getCurrentCurrency() {
    return this.store.getState().currentCurrency
  }

  /**
   * A setter for the currentCurrency property
   *
   * @param {string} currentCurrency The new currency to set as the currentCurrency in the store
   *
   */
  setCurrentCurrency(currentCurrency) {
    this.store.updateState({ currentCurrency })
  }

  /**
   * A getter for the conversionRate property
   *
   * @returns {string} The conversion rate from ETH to the selected currency.
   *
   */
  getConversionRate() {
    return this.store.getState().conversionRate
  }

  /**
   * A setter for the conversionRate property
   *
   * @param {number} conversionRate The new rate to set as the conversionRate in the store
   *
   */
  setConversionRate(conversionRate) {
    this.store.updateState({ conversionRate })
  }

  /**
   * A getter for the conversionDate property
   *
   * @returns {string} The date at which the conversion rate was set. Expressed in milliseconds since midnight of
   * January 1, 1970
   *
   */
  getConversionDate() {
    return this.store.getState().conversionDate
  }

  /**
   * A setter for the conversionDate property
   *
   * @param {number} conversionDate The date, expressed in milliseconds since midnight of January 1, 1970, that the
   * conversionRate was set
   *
   */
  setConversionDate(conversionDate) {
    this.store.updateState({ conversionDate })
  }

  /**
   * Updates the conversionRate and conversionDate properties associated with the currentCurrency. Updated info is
   * fetched from an external API
   *
   */
  async updateConversionRate() {
    let currentCurrency
    let nativeCurrency
    try {
      currentCurrency = this.getCurrentCurrency()
      nativeCurrency = this.getNativeCurrency()
      // select api
      // let apiUrl
      // if (nativeCurrency === 'ETH') {
      //   // ETH
      //   apiUrl = `https://api.infura.io/v1/ticker/eth${currentCurrency.toLowerCase()}`
      // } else {
      // ETC
      const apiUrl = `${config.api}/currency?fsym=${nativeCurrency.toUpperCase()}&tsyms=${currentCurrency.toUpperCase()}`
      // }
      // attempt request
      let response
      try {
        response = await fetch(apiUrl)
      } catch (error) {
        log.error(error, 'CurrencyController - Failed to request currency from cryptocompare')
        return
      }
      // parse response
      let rawResponse
      let parsedResponse
      try {
        rawResponse = await response.text()
        parsedResponse = JSON.parse(rawResponse)
      } catch {
        log.error(new Error(`CurrencyController - Failed to parse response "${rawResponse}"`))
        return
      }
      // set conversion rate
      // if (nativeCurrency === 'ETH') {
      // ETH
      //   this.setConversionRate(Number(parsedResponse.bid))
      //   this.setConversionDate(Number(parsedResponse.timestamp))
      // } else
      if (parsedResponse[currentCurrency.toUpperCase()]) {
        // ETC
        this.setConversionRate(Number(parsedResponse[currentCurrency.toUpperCase()]))
        this.setConversionDate(Number.parseInt(Date.now() / 1000, 10))
      } else {
        this.setConversionRate(0)
        this.setConversionDate('N/A')
      }
    } catch (error) {
      // reset current conversion rate
      log.warn('Torus - Failed to query currency conversion:', nativeCurrency, currentCurrency, error)
      this.setConversionRate(0)
      this.setConversionDate('N/A')
      // throw error
      log.error(error, `CurrencyController - Failed to query rate for currency "${currentCurrency}"`)
    }
  }

  /**
   * Creates a new poll, using setInterval, to periodically call updateConversionRate. The id of the interval is
   * stored at the controller's conversionInterval property. If it is called and such an id already exists, the
   * previous interval is clear and a new one is created.
   *
   */
  scheduleConversionInterval() {
    if (this.conversionInterval) {
      clearInterval(this.conversionInterval)
    }
    this.conversionInterval = setInterval(() => {
      this.updateConversionRate()
    }, POLLING_INTERVAL)
  }
}

export default CurrencyController
