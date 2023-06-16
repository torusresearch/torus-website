import { PollingBlockTracker } from 'eth-block-tracker'
// import log from 'loglevel'

export default class EthereumBlockTracker extends PollingBlockTracker {
  async _fetchLatestBlock() {
    const req = {
      jsonrpc: '2.0',
      id: Math.random().toString(36).slice(2),
      method: 'eth_blockNumber',
      params: [],
    }
    if (this._setSkipCacheFlag) {
      req.skipCache = true
    }

    // log.info('Making request', req)
    const res = await this._provider.sendAsync(req)
    // log.info('Got response', res)
    if (res.error) {
      throw new Error(`PollingBlockTracker - encountered error fetching block:\n${res.error.message}`)
    }
    return res
  }
}
