const ObservableStore = require('obs-store')
const extend = require('xtend')
const log = require('loglevel')
const { handleEvent } = require('../utils/utils')

const POLLING_INTERVAL = 10 * 60 * 1000

export default class InfuraController {
  constructor(opts = {}) {
    const initState = extend(
      {
        infuraNetworkStatus: {}
      },
      opts.initState
    )
    this.store = new ObservableStore(initState)
  }

  async checkNetworkStatus() {
    handleEvent(window, 'online', this.store.updateState({ infuraNetworkStatus: true }))
    handleEvent(window, 'offline', this.store.updateState({ infuraNetworkStatus: false }))
  }
  /**
   * Check Infura Network Status
   */
  async checkInfuraNetworkStatus() {
    const response = await fetch('https://api.infura.io/v1/status/metamask')
    const parsedResponse = await response.json()
    this.store.updateState({
      infuraNetworkStatus: parsedResponse.mainnet === 'ok'
    })
    return parsedResponse
  }

  /**
   * Schedule Infura Network Check
   */
  scheduleInfuraNetworkCheck() {
    if (this.conversionInterval) {
      clearInterval(this.conversionInterval)
    }
    this.conversionInterval = setInterval(() => {
      log.info('Polling network status...')
      this.checkInfuraNetworkStatus().catch(log.warn)
      this.checkNetworkStatus()
    }, POLLING_INTERVAL)
  }
}
