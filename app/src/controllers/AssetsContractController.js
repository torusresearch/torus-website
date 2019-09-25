/**
 * Assets contract
 *
 * Controller that interacts with contracts on mainnet through web3
 */

const ObservableStore = require('obs-store')
const log = require('loglevel')
const BN = require('ethereumjs-util').BN
const Web3 = require('web3')
const abiERC20 = require('human-standard-token-abi')
const abiERC721 = require('human-standard-collectible-abi')
const abiSingleCallBalancesContract = require('single-call-balance-checker-abi')

export default class AssetContractController {
  /**
   * Creates a AssetsContractController instance
   *
   */
  constructor(opts = {}) {
    this._provider = opts.provider

    this.store = new ObservableStore(initState)
    this.web3 = new Web3(this._provider)
  }
}
