const ObservableStore = require('obs-store')
const extend = require('xtend')
const log = require('loglevel')

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
    log.info('Polling network status...')
  }

  /**
   * Check Infura Network Status
   */
  async checkInfuraNetworkStatus() {
    const response = await fetch('https://api.infura.io/v1/status/metamask')
    const parsedResponse = await response.json()
    this.store.updateState({
      infuraNetworkStatus: parsedResponse.mainnet === 'ok' ? true : false
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
      this.checkInfuraNetworkStatus().catch(log.warn)
    }, POLLING_INTERVAL)
  }
}
