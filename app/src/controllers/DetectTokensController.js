import BigNumber from 'bignumber.js'
import contracts from 'eth-contract-metadata'
import { warn } from 'loglevel'
import ObservableStore from 'obs-store'
import SINGLE_CALL_BALANCES_ABI from 'single-call-balance-checker-abi'
import Web3 from 'web3'
import { toHex } from 'web3-utils'

import { MAINNET } from '../utils/enums'
// By default, poll every 3 minutes
const DEFAULT_INTERVAL = 180 * 1000

const SINGLE_CALL_BALANCES_ADDRESS = '0xb1f8e55c7f64d203c1400b9d8555d050f94adf39'
/**
 * A controller that polls for token exchange
 * rates based on a user's current token list
 */
class DetectTokensController {
  /**
   * Creates a DetectTokensController
   *
   * @param {Object} [config] - Options to configure controller
   */
  constructor({ interval = DEFAULT_INTERVAL, network, provider } = {}) {
    this.interval = interval
    this.network = network
    this.detectedTokensStore = new ObservableStore({ tokens: [] })
    this._provider = provider
    this.web3 = new Web3(this._provider)
    this.selectedAddress = ''
  }

  /**
   * For each token in eth-contract-metadata, find check selectedAddress balance.
   *
   */
  async detectNewTokens() {
    if (this.network.getNetworkNameFromNetworkCode() !== MAINNET || this.selectedAddress === '') {
      this.detectedTokensStore.putState({ tokens: [] })
      return
    }
    const tokensToDetect = []
    // eslint-disable-next-line no-restricted-syntax
    for (const contractAddress in contracts) {
      if (contracts[contractAddress].erc20) {
        tokensToDetect.push(contractAddress)
      }
    }
    if (tokensToDetect.length > 0) {
      const web3Instance = this.web3
      const ethContract = new web3Instance.eth.Contract(SINGLE_CALL_BALANCES_ABI, SINGLE_CALL_BALANCES_ADDRESS)
      ethContract.methods.balances([this.selectedAddress], tokensToDetect).call({ from: this.selectedAddress }, (error, result) => {
        if (error) {
          warn('MetaMask - DetectTokensController single call balance fetch failed', error)
          return
        }
        const nonZeroTokens = []
        tokensToDetect.forEach((tokenAddress, index) => {
          const balance = toHex(result[index])
          if (balance && balance !== '0x0') {
            // do sth else here
            nonZeroTokens.push({ ...contracts[tokenAddress], tokenAddress, balance })
            // this._preferences.addToken(tokenAddress, contracts[tokenAddress].symbol, contracts[tokenAddress].decimals)
          }
        })
        this.detectedTokensStore.putState({ tokens: nonZeroTokens })
      })
    }
  }

  /**
   * Find if selectedAddress has tokens with contract in contractAddress.
   *
   * @param {string} contractAddress Hex address of the token contract to explore.
   * @returns {boolean} If balance is detected, token is added.
   *
   */
  async detectEtherscanTokenBalance(contractAddress, data = {}) {
    const nonZeroTokens = this.detectedTokensStore.getState().tokens
    const index = nonZeroTokens.findIndex((element) => element.tokenAddress.toLowerCase() === contractAddress.toLowerCase())
    if (index === -1) {
      nonZeroTokens.push({
        ...data,
        tokenAddress: contractAddress,
        balance: `0x${new BigNumber(data.balance).times(new BigNumber(10).pow(new BigNumber(data.decimals))).toString(16)}`,
      })
      this.detectedTokensStore.putState({ tokens: nonZeroTokens })
    }
  }

  async refreshTokenBalances() {
    if (this.network.store.getState().provider.type !== MAINNET || this.selectedAddress === '') {
      this.detectedTokensStore.putState({ tokens: [] })
      return
    }
    const oldTokens = this.detectedTokensStore.getState().tokens
    const tokenAddresses = oldTokens.map((x) => x.tokenAddress)
    if (tokenAddresses.length > 0) {
      const web3Instance = this.web3
      const ethContract = new web3Instance.eth.Contract(SINGLE_CALL_BALANCES_ABI, SINGLE_CALL_BALANCES_ADDRESS)
      ethContract.methods.balances([this.selectedAddress], tokenAddresses).call({ from: this.selectedAddress }, (error, result) => {
        if (error) {
          warn('MetaMask - DetectTokensController single call balance fetch failed', error)
          return
        }
        const nonZeroTokens = []
        tokenAddresses.forEach((tokenAddress, index) => {
          const balance = toHex(result[index])
          if (balance && balance !== '0x0') {
            nonZeroTokens.push({ ...oldTokens[index], balance })
          }
        })
        this.detectedTokensStore.putState({ tokens: nonZeroTokens })
      })
    }
  }

  /**
   * Restart token detection polling period and call detectNewTokens
   * in case of address change or user session initialization.
   *
   */
  restartTokenDetection() {
    if (!this.selectedAddress) {
      return
    }
    // this.detectedTokensStore.putState({ tokens: [] })
    this.detectNewTokens()
    this.interval = DEFAULT_INTERVAL
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
      this.detectNewTokens()
      this.refreshTokenBalances()
    }, interval)
  }

  /**
   * In setter when isUnlocked is updated to true, detectNewTokens and restart polling
   * @type {Object}
   */
  startTokenDetection(selectedAddress) {
    this.selectedAddress = selectedAddress
    this.restartTokenDetection()
  }
}

export default DetectTokensController
