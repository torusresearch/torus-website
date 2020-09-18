import BigNumber from 'bignumber.js'
import contracts from 'eth-contract-metadata'
import log from 'loglevel'
import ObservableStore from 'obs-store'
import SINGLE_CALL_BALANCES_ABI from 'single-call-balance-checker-abi'
import Web3 from 'web3'
import { toChecksumAddress, toHex } from 'web3-utils'

import { MAINNET } from '../utils/enums'
// By default, poll every 3 minutes
const DEFAULT_INTERVAL = 180 * 1000

const SINGLE_CALL_BALANCES_ADDRESS = '0xb1f8e55c7f64d203c1400b9d8555d050f94adf39'

function getObjectFromArrayBasedonKey(oldArray, key) {
  return oldArray.reduce((acc, x) => {
    acc[x[key]] = x
    return acc
  }, {})
}

const mergeTokenArrays = (oldArray, newArray) => {
  const oldMap = getObjectFromArrayBasedonKey(oldArray || [], 'tokenAddress')
  const newMap = getObjectFromArrayBasedonKey(newArray || [], 'tokenAddress')
  const finalArr = newArray
  Object.keys(oldMap).forEach((x) => {
    if (!newMap[x] && oldMap[x].isEtherscan) finalArr.push(oldMap[x])
  })
  return finalArr
}

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
    this.detectedTokensStore = new ObservableStore({})
    this._provider = provider
    this.web3 = new Web3(this._provider)
    this.selectedAddress = ''
  }

  /**
   * For each token in eth-contract-metadata, find check selectedAddress balance.
   *
   */
  async detectNewTokens() {
    const userAddress = this.selectedAddress
    if (!userAddress) return
    if (this.network.getNetworkNameFromNetworkCode() !== MAINNET) {
      this.detectedTokensStore.updateState({ [userAddress]: [] })
      return
    }
    const tokensToDetect = []
    for (const contractAddress in contracts) {
      if (contracts[contractAddress].erc20) {
        tokensToDetect.push(contractAddress)
      }
    }
    if (tokensToDetect.length > 0) {
      const web3Instance = this.web3
      const ethContract = new web3Instance.eth.Contract(SINGLE_CALL_BALANCES_ABI, SINGLE_CALL_BALANCES_ADDRESS)
      ethContract.methods.balances([userAddress], tokensToDetect).call({ from: userAddress }, (error, result) => {
        if (error) {
          log.warn('MetaMask - DetectTokensController single call balance fetch failed', error)
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
        const currentTokens = this.detectedTokensStore.getState()[userAddress] || []
        this.detectedTokensStore.updateState({ [userAddress]: mergeTokenArrays(currentTokens, nonZeroTokens) })
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
  async detectEtherscanTokenBalance(data = [], userAddress) {
    const nonZeroTokens = this.detectedTokensStore.getState()[userAddress] || []
    data.forEach((x) => {
      const index = nonZeroTokens.findIndex((element) => element.tokenAddress.toLowerCase() === x.contractAddress.toLowerCase())
      if (index === -1) {
        nonZeroTokens.push({
          ...x,
          decimals: x.tokenDecimal,
          erc20: true,
          logo: 'eth.svg',
          name: x.name,
          symbol: x.ticker,
          tokenAddress: toChecksumAddress(x.contractAddress),
          balance: `0x${new BigNumber(x.balance).times(new BigNumber(10).pow(new BigNumber(x.tokenDecimal))).toString(16)}`,
          isEtherscan: true,
        })
      } else if (nonZeroTokens[index].isEtherscan) {
        nonZeroTokens[index] = {
          ...nonZeroTokens[index],
          balance: `0x${new BigNumber(x.balance).times(new BigNumber(10).pow(new BigNumber(x.tokenDecimal))).toString(16)}`,
        }
      }
    })
    this.detectedTokensStore.updateState({ [userAddress]: nonZeroTokens })
  }

  async refreshTokenBalances() {
    const userAddress = this.selectedAddress
    if (userAddress === '') return
    if (this.network.store.getState().provider.type !== MAINNET) {
      this.detectedTokensStore.updateState({ [userAddress]: [] })
      return
    }
    const oldTokens = this.detectedTokensStore.getState()[userAddress] || []
    const tokenAddresses = oldTokens.map((x) => x.tokenAddress)
    if (tokenAddresses.length > 0) {
      const web3Instance = this.web3
      const ethContract = new web3Instance.eth.Contract(SINGLE_CALL_BALANCES_ABI, SINGLE_CALL_BALANCES_ADDRESS)
      ethContract.methods.balances([userAddress], tokenAddresses).call({ from: userAddress }, (error, result) => {
        if (error) {
          log.warn('MetaMask - DetectTokensController single call balance fetch failed', error)
          return
        }
        const nonZeroTokens = []
        tokenAddresses.forEach((_, index) => {
          const balance = toHex(result[index])
          if (balance && balance !== '0x0') {
            nonZeroTokens.push({ ...oldTokens[index], balance })
          }
        })
        const currentTokens = this.detectedTokensStore.getState()[userAddress] || []
        this.detectedTokensStore.updateState({ [userAddress]: mergeTokenArrays(currentTokens, nonZeroTokens) })
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
