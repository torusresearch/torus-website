import BigNumber from 'bignumber.js'
import isEqual from 'lodash.isequal'
import log from 'loglevel'
import ObservableStore from 'obs-store'
import SINGLE_CALL_BALANCES_ABI from 'single-call-balance-checker-abi'
import Web3 from 'web3'
import { toChecksumAddress, toHex } from 'web3-utils'

import TokenHandler from '../handlers/Token/TokenHandler'
import contracts from '../utils/contractMetadata'
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
    if (!newMap[x] && (oldMap[x].isEtherscan || !!oldMap[x].customTokenId)) finalArr.push(oldMap[x])
  })
  return finalArr
}

const mergeCustomTokenArrays = (oldArray, newArray) => {
  const oldMap = getObjectFromArrayBasedonKey(oldArray || [], 'tokenAddress')
  const finalArr = []
  // if customtokenid is present and oldarray customtokenid is not present, add it
  Object.keys(oldMap).forEach((x) => {
    if (!oldMap[x].customTokenId) finalArr.push(oldMap[x])
  })
  finalArr.push(...newArray)
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
  constructor({ interval = DEFAULT_INTERVAL, network, provider, preferencesStore } = {}) {
    this.interval = interval
    this.network = network
    this.detectedTokensStore = new ObservableStore({})
    this._provider = provider
    this.web3 = new Web3(this._provider)
    this.selectedAddress = ''
    this.preferencesStore = preferencesStore
    this.selectedCustomTokens = []
  }

  /**
   * For each token in @metamask/contract-metadata, find check selectedAddress balance.
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
            nonZeroTokens.push({ ...contracts[tokenAddress], tokenAddress, balance, network: MAINNET })
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
          network: MAINNET,
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
    if (this.network.getNetworkNameFromNetworkCode() !== MAINNET) {
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
            nonZeroTokens.push({ ...oldTokens[index], balance, network: MAINNET })
          }
        })
        const currentTokens = this.detectedTokensStore.getState()[userAddress] || []
        this.detectedTokensStore.updateState({ [userAddress]: mergeTokenArrays(currentTokens, nonZeroTokens) })
      })
    }
  }

  async getCustomTokenBalances(customTokens) {
    const userAddress = this.selectedAddress
    if (userAddress === '') return
    this.selectedCustomTokens = customTokens.map((x) => x.token_address)
    const localNetwork = this.network.getNetworkNameFromNetworkCode()
    const currentNetworkTokens = customTokens.reduce((acc, x) => {
      if (x.network === localNetwork) acc.push(x)
      return acc
    }, [])
    let nonZeroTokens = await Promise.all(
      currentNetworkTokens.map(async (x) => {
        try {
          const tokenInstance = new TokenHandler({
            address: x.token_address,
            decimals: x.decimals,
            name: x.token_name,
            symbol: x.token_symbol,
            web3: this.web3,
          })
          const balance = await tokenInstance.getUserBalance(userAddress)
          return {
            decimals: tokenInstance.decimals,
            erc20: true,
            logo: 'eth.svg',
            name: tokenInstance.name,
            symbol: tokenInstance.symbol,
            tokenAddress: toChecksumAddress(tokenInstance.address),
            balance: `0x${balance}`,
            customTokenId: x.id,
            network: localNetwork,
          }
        } catch (error) {
          log.warn('Invalid contract address while fetching', error)
          return undefined
        }
      })
    )
    nonZeroTokens = nonZeroTokens.filter((x) => x)
    const currentTokens = this.detectedTokensStore.getState()[userAddress] || []
    this.detectedTokensStore.updateState({ [userAddress]: mergeCustomTokenArrays(currentTokens, nonZeroTokens) })
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
    if (this._preferencesStore) {
      const userState = this._preferencesStore.getState()[this.selectedAddress]
      const { customTokens } = userState || {}
      this.getCustomTokenBalances(customTokens)
    }
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
      if (this._preferencesStore) {
        const userState = this._preferencesStore.getState()[this.selectedAddress]
        const { customTokens = [] } = userState || {}
        this.getCustomTokenBalances(customTokens)
      }
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

  set preferencesStore(preferencesStore) {
    if (this._preferencesStore) this._preferencesStore.unsubscribe()
    if (!preferencesStore) {
      return
    }
    this._preferencesStore = preferencesStore
    // set default maybe
    preferencesStore.subscribe((state) => {
      const { selectedAddress } = state
      if (!selectedAddress) return
      const { customTokens = [] } = state[selectedAddress]
      if (
        !isEqual(
          this.selectedCustomTokens,
          customTokens.map((x) => x.token_address)
        )
      ) {
        this.getCustomTokenBalances(customTokens)
      }
    })
  }
}

export default DetectTokensController
