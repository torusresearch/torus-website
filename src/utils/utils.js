import { concatSig } from '@metamask/eth-sig-util'
import * as rskUtils from '@rsksmart/rsk-utils'
import assert from 'assert'
import BigNumber from 'bignumber.js'
import { addHexPrefix, BN, ecsign, keccak, privateToAddress, pubToAddress, stripHexPrefix } from 'ethereumjs-util'
import log from 'loglevel'
import { isAddress, isHexStrict, toChecksumAddress } from 'web3-utils'

import config from '../config'
import { languageMap } from '../plugins/i18n-setup'
import { supportedFiatCurrencies } from '../supportedCurrencies'
import {
  ACCOUNT_TYPE,
  ACTIVE,
  ACTIVITY_ACTION_RECEIVE,
  ACTIVITY_ACTION_SEND,
  ALLOWED_VERIFIERS,
  APPLE,
  ARBITRUM_MAINNET_CHAIN_ID,
  ARBITRUM_MAINNET_CODE,
  ARBITRUM_TESTNET_CHAIN_ID,
  ARBITRUM_TESTNET_CODE,
  AVALANCHE_MAINNET,
  AVALANCHE_MAINNET_CHAIN_ID,
  AVALANCHE_MAINNET_CODE,
  AVALANCHE_TESTNET_CHAIN_ID,
  AVALANCHE_TESTNET_CODE,
  BSC_MAINNET,
  BSC_MAINNET_CHAIN_ID,
  BSC_MAINNET_CODE,
  BSC_TESTNET_CHAIN_ID,
  BSC_TESTNET_CODE,
  CONTRACT_TYPE_ERC20,
  CONTRACT_TYPE_ERC721,
  CONTRACT_TYPE_ERC1155,
  DISCORD,
  EMAIL_PASSWORD,
  ENVIRONMENT_TYPE_FULLSCREEN,
  ENVIRONMENT_TYPE_NOTIFICATION,
  ENVIRONMENT_TYPE_POPUP,
  ETH,
  getIpfsEndpoint,
  GITHUB,
  GOERLI,
  GOERLI_CHAIN_ID,
  GOERLI_CODE,
  GOERLI_DISPLAY_NAME,
  GOOGLE,
  JWT,
  KAKAO,
  KOVAN,
  KOVAN_CHAIN_ID,
  KOVAN_CODE,
  KOVAN_DISPLAY_NAME,
  LINE,
  LINKEDIN,
  MAINNET,
  MAINNET_CHAIN_ID,
  MAINNET_CODE,
  MAINNET_DISPLAY_NAME,
  MATIC,
  MATIC_CHAIN_ID,
  MATIC_CODE,
  MERCURYO,
  MOONPAY,
  MUMBAI_CHAIN_ID,
  MUMBAI_CODE,
  OKC_MAINNET_CHAIN_ID,
  OKC_MAINNET_CODE,
  OKC_TESTNET_CHAIN_ID,
  OKC_TESTNET_CODE,
  OPTIMISM_MAINNET_CHAIN_ID,
  OPTIMISM_MAINNET_CODE,
  OPTIMISM_TESTNET_CHAIN_ID,
  OPTIMISM_TESTNET_CODE,
  PASSWORDLESS,
  PLATFORM_BRAVE,
  PLATFORM_CHROME,
  PLATFORM_EDGE,
  PLATFORM_FIREFOX,
  PLATFORM_OPERA,
  PNG,
  RAMPNETWORK,
  REDDIT,
  RINKEBY,
  RINKEBY_CHAIN_ID,
  RINKEBY_CODE,
  RINKEBY_DISPLAY_NAME,
  ROPSTEN,
  ROPSTEN_CHAIN_ID,
  ROPSTEN_CODE,
  ROPSTEN_DISPLAY_NAME,
  RSK_MAINNET_CHAIN_ID,
  RSK_MAINNET_CODE,
  RSK_TESTNET_CHAIN_ID,
  RSK_TESTNET_CODE,
  SIMPLEX,
  SUPPORTED_NETWORK_TYPES,
  SVG,
  TEST_CHAINS,
  TEST_CHAINS_NUMERIC_IDS,
  THEME_DARK_BLACK_NAME,
  TRANSAK,
  TWITTER,
  WECHAT,
  WEIBO,
  WYRE,
  XANPOOL,
  // XDAI,
  XDAI_CHAIN_ID,
  XDAI_CODE,
} from './enums'

const networkToNameMap = {
  [ROPSTEN]: ROPSTEN_DISPLAY_NAME,
  [RINKEBY]: RINKEBY_DISPLAY_NAME,
  [KOVAN]: KOVAN_DISPLAY_NAME,
  [MAINNET]: MAINNET_DISPLAY_NAME,
  [GOERLI]: GOERLI_DISPLAY_NAME,
  [ROPSTEN_CODE]: ROPSTEN_DISPLAY_NAME,
  [RINKEBY_CODE]: RINKEBY_DISPLAY_NAME,
  [KOVAN_CODE]: KOVAN_DISPLAY_NAME,
  [GOERLI_CODE]: GOERLI_DISPLAY_NAME,
}

export class UserError extends Error {}

export const getNetworkDisplayName = (key) => networkToNameMap[key]

/**
 * Used to determine the window type through which the app is being viewed.
 *  - 'popup' refers to the extension opened through the browser app icon (in top right corner in chrome and firefox)
 *  - 'responsive' refers to the main browser window
 *  - 'notification' refers to the popup that appears in its own window when taking action outside of metamask
 *
 * @returns {string} A single word label that represents the type of window through which the app is being viewed
 *
 */
export const getEnvironmentType = (url = window.location.href) => {
  if (url.match(/popup.html(?:#.*)*$/)) {
    return ENVIRONMENT_TYPE_POPUP
  }
  if (url.match(/home.html(?:\?.+)*$/) || url.match(/home.html(?:#.*)*$/)) {
    return ENVIRONMENT_TYPE_FULLSCREEN
  }
  return ENVIRONMENT_TYPE_NOTIFICATION
}

/**
 * Returns the platform (browser) where the extension is running.
 *
 * @returns {string} the platform ENUM
 *
 */
export const getPlatform = (_) => {
  const ua = navigator.userAgent
  if (ua.search('Firefox') !== -1) {
    return PLATFORM_FIREFOX
  }
  if (window && window.chrome && window.chrome.ipcRenderer) {
    return PLATFORM_BRAVE
  }
  if (ua.search('Edge') !== -1) {
    return PLATFORM_EDGE
  }
  if (ua.search('OPR') !== -1) {
    return PLATFORM_OPERA
  }
  return PLATFORM_CHROME
}

/**
 * Checks whether a given balance of ETH, represented as a hex string, is sufficient to pay a value plus a gas fee
 *
 * @param {object} txParams Contains data about a transaction
 * @param {string} txParams.gas The gas for a transaction
 * @param {string} txParams.gasPrice The price per gas for the transaction
 * @param {string} txParams.value The value of ETH to send
 * @param {string} hexBalance A balance of ETH represented as a hex string
 * @returns {boolean} Whether the balance is greater than or equal to the value plus the value of gas times gasPrice
 *
 */
export function sufficientBalance(txParameters, hexBalance) {
  // validate hexBalance is a hex string
  assert.strictEqual(typeof hexBalance, 'string', 'sufficientBalance - hexBalance is not a hex string')
  assert.strictEqual(hexBalance.slice(0, 2), '0x', 'sufficientBalance - hexBalance is not a hex string')

  const balance = hexToBn(hexBalance)
  const value = hexToBn(txParameters.value)
  const gasLimit = hexToBn(txParameters.gas)
  const gasPrice = hexToBn(txParameters.gasPrice)

  const maxCost = value.add(gasLimit.mul(gasPrice))
  return balance.gte(maxCost)
}

/**
 * Converts a BN object to a hex string with a '0x' prefix
 *
 * @param {BN} inputBn The BN to convert to a hex string
 * @returns {string} A '0x' prefixed hex string
 *
 */
export function bnToHex(inputBn) {
  return addHexPrefix(inputBn.toString(16))
}

/**
 * Converts a hex string to a BN object
 *
 * @param {string} inputHex A number represented as a hex string
 * @returns {Object} A BN object
 *
 */
export function hexToBn(inputHex) {
  if (BN.isBN(inputHex)) return inputHex
  return new BN(stripHexPrefix(inputHex), 16)
}

/**
 * Used to multiply a BN by a fraction
 *
 * @param {BN} targetBN The number to multiply by a fraction
 * @param {number|string} numerator The numerator of the fraction multiplier
 * @param {number|string} denominator The denominator of the fraction multiplier
 * @returns {BN} The product of the multiplication
 *
 */
export function BnMultiplyByFraction(targetBN, numerator, denominator) {
  const numberBN = new BN(numerator)
  const denomBN = new BN(denominator)
  return targetBN.mul(numberBN).div(denomBN)
}

/**
 * Converts a hex-encoded string to a text string.
 *
 * @param {string} hex Hex string to be converted
 * @returns {string} Text converted from the hex string
 */
export function hexToText(hex) {
  try {
    const stripped = stripHexPrefix(hex)
    const buff = Buffer.from(stripped, 'hex')
    return buff.toString('utf8')
  } catch (error) {
    log.error(error)
    return hex
  }
}

export function addressSlicer(address = '') {
  if (address.length < 11) {
    return address
  }
  if (typeof address !== 'string') return ''
  return `${address.slice(0, 5)}...${address.slice(-5)}`
}

export function significantDigits(number, perc = false, length_ = 2) {
  let input = !BigNumber.isBigNumber(number) ? new BigNumber(number) : number
  if (input.isZero()) return input
  if (perc) {
    input = input.times(new BigNumber(100))
  }
  let depth
  if (input.gte(new BigNumber(1))) {
    depth = length_
  } else {
    depth = length_ - 1 + Math.ceil(Math.log10(new BigNumber('1').div(input).toNumber()))
  }
  const shift = new BigNumber(10).pow(new BigNumber(depth))
  const roundedNumber = Math.round(shift.times(input).toNumber()) / shift
  return roundedNumber
}

export function areProviderConfigsEqual(config1, config2) {
  if (config1.chainId !== config2.chainId) return false
  if (config1.host !== config2.host) return false
  if (config1.rpcUrl !== config2.rpcUrl) return false
  return true
}

export function formatCurrencyNumber(amount, decimalCount = 2, decimal = '.', thousands = ',') {
  try {
    let amt = amount
    let decimals = decimalCount
    decimals = Math.abs(decimals)
    decimals = Number.isNaN(decimals) ? 2 : decimals

    const negativeSign = amt < 0 ? '-' : ''

    const i = Number.parseInt((amt = Math.abs(Number(amount) || 0).toFixed(decimals)), 10).toString()
    const j = i.length > 3 ? i.length % 3 : 0

    return `${
      negativeSign +
      (j ? i.slice(0, j) + thousands : '') +
      i.slice(j).replace(/(\d{3})(?=\d)/g, `$1${thousands}`) +
      (decimals
        ? decimal +
          Math.abs(amount - i)
            .toFixed(decimals)
            .slice(2)
        : '')
    }`
  } catch (error) {
    log.error(error)
  }
  return null
}

export async function isSmartContractAddress(address, web3) {
  const code = await web3.eth.getCode(address)
  // Geth will return '0x', and ganache-core v2.2.1 will return '0x0'
  const codeIsEmpty = !code || code === '0x' || code === '0x0'
  return !codeIsEmpty
}

export function getEtherScanHashLink(txHash, network) {
  if (!SUPPORTED_NETWORK_TYPES[network]) return ''
  return `${SUPPORTED_NETWORK_TYPES[network].blockExplorer}/tx/${txHash}`
}

export function getEtherScanAddressLink(address, network) {
  if (!SUPPORTED_NETWORK_TYPES[network]) return ''
  return `${SUPPORTED_NETWORK_TYPES[network].blockExplorer}/address/${address}`
}

export const statusObject = {
  SENT_TO_SIMPLEX: 'pending',
  DENIED_SIMPLEX: 'rejected',
  payment_request_submitted: 'processing',
  pending_simplexcc_approval: 'processing',
  PROCESSING_SIMPPLEX: 'processing',
  SUCCESS_SIMPLEX: 'success',
  payment_simplexcc_approved: 'success',
  pending_simplexcc_payment_to_partner: 'success',
}

export function getStatus(status) {
  return statusObject[status] || 'pending'
}

export async function getEthTxStatus(hash, web3) {
  const receipt = await web3.eth.getTransactionReceipt(hash)
  if (receipt === null) return 'pending'
  if (receipt && receipt.status) return 'confirmed'
  if (receipt && !receipt.status) return 'rejected'
  return undefined
}

export const broadcastChannelOptions = {
  // type: 'localstorage', // (optional) enforce a type, oneOf['native', 'idb', 'localstorage', 'node']
  webWorkerSupport: false, // (optional) set this to false if you know that your channel will never be used in a WebWorker (increases performance)
}

export function validateVerifierId(selectedTypeOfLogin, value, chainId) {
  if (selectedTypeOfLogin === ETH) {
    const parsedChainId = Number.parseInt(chainId, isHexStrict(chainId) ? 16 : 10)
    if (parsedChainId === RSK_MAINNET_CODE || parsedChainId === RSK_TESTNET_CODE) {
      return isAddressByChainId(value, chainId) || 'walletSettings.invalidEth'
    }
    return isAddress(value) || 'walletSettings.invalidEth'
  }
  if (selectedTypeOfLogin === GOOGLE) {
    return (
      /^(([^\s"(),.:;<>@[\\\]]+(\.[^\s"(),.:;<>@[\\\]]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([\dA-Za-z-]+\.)+[A-Za-z]{2,}))$/.test(value) ||
      'walletSettings.invalidEmail'
    )
  }
  if (selectedTypeOfLogin === REDDIT) {
    return (/^[\w-]+$/.test(value) && !/\s/.test(value) && value.length >= 3 && value.length <= 20) || 'walletSettings.invalidReddit'
  }
  if (selectedTypeOfLogin === DISCORD) {
    return (/^\d*$/.test(value) && value.length === 18) || 'walletSettings.invalidDiscord'
  }

  if (selectedTypeOfLogin === TWITTER) {
    return /^@(\w){1,15}$/.test(value) || 'walletSettings.invalidTwitter'
  }

  if (selectedTypeOfLogin === GITHUB) {
    return /^(?!.*(-{2}))(?!^-.*$)(?!^.*-$)[\w-]{1,39}$/.test(value) || 'walletSettings.invalidGithub'
  }

  return true
}

export function formatDate(inputDate) {
  const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const date = new Date(inputDate)
  const day = date.getDate()
  const month = monthList[date.getMonth()]
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

export function formatTime(time) {
  return new Date(time).toTimeString().slice(0, 8)
}

export const paymentProviders = {
  [SIMPLEX]: {
    line1: 'Credit/ Debit Card',
    line2: '5% or 10 USD',
    line3: '$20,000/day, $50,000/mo',
    status: ACTIVE,
    logoExtension: PNG,
    supportPage: 'https://www.simplex.com/support/',
    minOrderValue: 50,
    maxOrderValue: 20_000,
    validCurrencies: supportedFiatCurrencies(SIMPLEX),
    // Disable simplex until API is fixed
    validCryptoCurrenciesByChain: {
      // TODO constantize cryptos e.g. {[ETH]: sdfsaf, [USDC]: {}}
      [MAINNET]: [
        { value: 'AAVE', display: 'AAVE' },
        { value: 'BAT', display: 'BAT' },
        { value: 'BUSD', display: 'BUSD' },
        { value: 'DAI', display: 'DAI' },
        { value: 'ETH', display: 'ETH' },
        { value: 'MKR', display: 'MKR' },
        { value: 'MATIC-ERC20', display: 'MATIC' },
        { value: 'USDT', display: 'USDT' },
        { value: 'USDC', display: 'USDC' },
      ],
      // BUSD? BUSD-BSC? BUSD-SC?
      // USDC-SC or USDC?
      [BSC_MAINNET]: [
        { value: 'BNB', display: 'BNB' },
        { value: 'BUSD-SC', display: 'BUSD' },
        { value: 'CAKE', display: 'CAKE' },
        { value: 'USDC-SC', display: 'USDC' },
      ],
      [MATIC]: [
        { value: 'MATIC', display: 'MATIC' },
        { value: 'USDC-MATIC', display: 'USDC' },
      ],
      // AVAXC or AVAX-C?
      [AVALANCHE_MAINNET]: [{ value: 'AVAX-C', display: 'AVAX' }],
    },
    includeFees: true,
    api: true,
    enforceMax: true,
  },
  [MOONPAY]: {
    line1: 'Credit/ Debit Card/ Apple Pay',
    line2: '4.5% or 5 USD',
    line3: '2,000€/day, 10,000€/mo',
    status: ACTIVE,
    logoExtension: SVG,
    supportPage: 'https://help.moonpay.io/en/',
    minOrderValue: 24.99,
    maxOrderValue: 50_000,
    validCurrencies: supportedFiatCurrencies(MOONPAY),
    validCryptoCurrenciesByChain: {
      [MAINNET]: [
        { value: 'aave', display: 'AAVE' },
        { value: 'bat', display: 'BAT' },
        { value: 'dai', display: 'DAI' },
        { value: 'eth', display: 'ETH' },
        { value: 'mkr', display: 'MKR' },
        { value: 'matic', display: 'MATIC' },
        { value: 'usdt', display: 'USDT' },
        { value: 'usdc', display: 'USDC' },
      ],
      [MATIC]: [
        { value: 'eth_polygon', display: 'ETH' },
        { value: 'matic_polygon', display: 'MATIC' },
        { value: 'usdc_polygon', display: 'USDC' },
      ],
      [BSC_MAINNET]: [
        { value: 'bnb_bsc', display: 'BNB' },
        { value: 'busd_bsc', display: 'BUSD' },
      ],
      [AVALANCHE_MAINNET]: [{ value: 'avax_cchain', display: 'AVAX' }],
    },
    includeFees: true,
    api: true,
    enforceMax: false,
  },
  [WYRE]: {
    line1: 'Apple Pay/ Debit/ Credit Card',
    line2: '4.9% + 30¢ or 5 USD',
    line3: '$250/day',
    status: ACTIVE,
    logoExtension: SVG,
    supportPage: 'https://support.sendwyre.com/en/',
    minOrderValue: 5,
    maxOrderValue: 500,
    validCurrencies: supportedFiatCurrencies(WYRE),
    validCryptoCurrenciesByChain: {
      [MAINNET]: [
        { value: 'AAVE', display: 'AAVE' },
        { value: 'BAT', display: 'BAT' },
        { value: 'BUSD', display: 'BUSD' },
        { value: 'DAI', display: 'DAI' },
        { value: 'ETH', display: 'ETH' },
        { value: 'MKR', display: 'MKR' },
        { value: 'UNI', display: 'UNI' },
        { value: 'USDC', display: 'USDC' },
        { value: 'USDT', display: 'USDT' },
      ],
      [MATIC]: [{ value: 'MUSDC', display: 'USDC' }],
      // AVAXC? or AVAX?
      [AVALANCHE_MAINNET]: [{ value: 'AVAXC', display: 'AVAXC' }],
    },
    includeFees: false,
    api: true,
    enforceMax: false,
  },
  [RAMPNETWORK]: {
    line1: 'Debit Card/ <br>Apple Pay/ Bank transfer',
    line2: '0.49% - 2.9%',
    line3: '5,000€/purchase, 20,000€/mo',
    status: ACTIVE,
    logoExtension: SVG,
    supportPage: 'https://instant.ramp.network/',
    minOrderValue: 50,
    maxOrderValue: 20_000,
    validCurrencies: supportedFiatCurrencies(RAMPNETWORK),
    validCryptoCurrenciesByChain: {
      [MAINNET]: [
        { value: 'ETH', display: 'ETH' },
        { value: 'DAI', display: 'DAI' },
        { value: 'USDC', display: 'USDC' },
        { value: 'USDT', display: 'USDT' },
      ],
      [MATIC]: [
        { value: 'MATIC_DAI', display: 'DAI' },
        { value: 'MATIC_MATIC', display: 'MATIC' },
        { value: 'MATIC_USDC', display: 'USDC' },
      ],
      // what about AVAXC?
      [AVALANCHE_MAINNET]: [{ value: 'AVAX', display: 'AVAX' }],
      // Temporary unavailable
      // [XDAI]: [{ value: 'XDAI_XDAI', display: 'XDAI' }],
    },
    includeFees: true,
    api: true,
    receiveHint: 'walletTopUp.receiveHintRamp',
    enforceMax: false,
  },
  [XANPOOL]: {
    line1: 'PayNow/ InstaPay/ FPS/ GoJekPay/ UPI/ PromptPay/ <br>ViettelPay/ DuitNow',
    line2: '2.5% buying, 3% selling',
    line3: '$2,500 / day',
    status: ACTIVE,
    logoExtension: SVG,
    supportPage: 'mailto:support@xanpool.com',
    minOrderValue: 100,
    maxOrderValue: 2500,
    validCurrencies: supportedFiatCurrencies(XANPOOL),
    validCryptoCurrenciesByChain: {
      [MAINNET]: [
        { value: 'ETH', display: 'ETH' },
        { value: 'USDT', display: 'USDT' },
      ],
    },
    includeFees: true,
    api: true,
    sell: true,
    enforceMax: false,
  },
  [MERCURYO]: {
    line1: 'Credit/ Debit Card/ Apple Pay',
    line2: '3.95% or 4 USD',
    line3: '10,000€/day, 25,000€/mo',
    status: ACTIVE,
    logoExtension: SVG,
    supportPage: 'mailto:support@mercuryo.io',
    minOrderValue: 30,
    maxOrderValue: 5000,
    validCurrencies: supportedFiatCurrencies(MERCURYO),
    validCryptoCurrenciesByChain: {
      [MAINNET]: [
        { value: 'ETH', display: 'ETH' },
        { value: 'BAT', display: 'BAT' },
        { value: 'USDT', display: 'USDT' },
        { value: 'DAI', display: 'DAI' },
      ],
      [BSC_MAINNET]: [
        { value: 'BNB', display: 'BNB' },
        { value: 'BUSD', display: 'BUSD' },
        { value: '1INCH', display: '1INCH' },
      ],
    },
    includeFees: true,
    api: true,
    enforceMax: false,
  },
  [TRANSAK]: {
    line1: 'Apple & Google Pay / Credit/Debit Card<br/>Bangkok Bank Mobile & iPay<br/>Bank Transfer (sepa/gbp) / SCB Mobile & Easy',
    line2: '0.99% - 5.5% or 5 USD',
    line3: '$5,000/day, $28,000/mo',
    status: ACTIVE,
    logoExtension: SVG,
    supportPage: 'https://support.transak.com/hc/en-US',
    minOrderValue: 30,
    maxOrderValue: 500,
    validCurrencies: supportedFiatCurrencies(TRANSAK),
    validCryptoCurrenciesByChain: {
      [MAINNET]: [
        { value: 'AAVE', display: 'AAVE' },
        { value: 'DAI', display: 'DAI' },
        { value: 'ETH', display: 'ETH' },
        { value: 'USDC', display: 'USDC' },
        { value: 'USDT', display: 'USDT' },
        { value: 'CHAIN', display: 'CHAIN' },
      ],
      [MATIC]: [
        { value: 'AAVE', display: 'AAVE' },
        { value: 'DAI', display: 'DAI' },
        { value: 'MATIC', display: 'MATIC' },
        { value: 'USDC', display: 'USDC' },
        { value: 'USDT', display: 'USDT' },
        { value: 'WETH', display: 'WETH' },
        { value: 'CHAIN', display: 'CHAIN' },
      ],
      [BSC_MAINNET]: [
        { value: 'BNB', display: 'BNB' },
        { value: 'BUSD', display: 'BUSD' },
      ],
      [AVALANCHE_MAINNET]: [{ value: 'AVAX', display: 'AVAX' }],
    },
    includeFees: true,
    api: true,
    enforceMax: true,
  },
}

/**
 * {
 *   [MAINNET]: [SIMPLEX, TRANSAK, WYRE, ...],
 *   [BSC_MAINNET]: [SIMPLEX, ...],
 *   ...
 * }
 */
export const SUPPORTED_PROVIDERS_PER_NETWORK = (() => {
  const supportedProvidersPerNetwork = Object.keys(SUPPORTED_NETWORK_TYPES).reduce((acc, networkName) => {
    const supportedPaymentProviders = Object.entries(paymentProviders)
      .filter(([_, paymentProvider]) => {
        const paymentProviderSupportedNetworks = Object.keys(paymentProvider.validCryptoCurrenciesByChain)
        return paymentProviderSupportedNetworks.includes(networkName)
      })
      .map(([key]) => key)

    return {
      ...acc,
      [networkName]: supportedPaymentProviders,
    }
  }, {})

  return supportedProvidersPerNetwork
})()

export function getPaymentProviders(networkId, theme) {
  const network = Object.values(SUPPORTED_NETWORK_TYPES).find(({ chainId }) => chainId === Number.parseInt(networkId, 10))
  const supportedProviders = SUPPORTED_PROVIDERS_PER_NETWORK[network?.host] ?? []
  return supportedProviders.map((x) => {
    const item = paymentProviders[x]
    return {
      ...item,
      name: x,
      logo: theme === THEME_DARK_BLACK_NAME ? `${x}-logo-white.${item.logoExtension}` : `${x}-logo.${item.logoExtension}`,
      link: `/wallet/topup/${x}`,
    }
  })
}

export function capitalizeFirstLetter(string) {
  if (!string) return string
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const standardNetworkId = {
  [MAINNET_CODE.toString()]: MAINNET_CHAIN_ID,
  [ROPSTEN_CODE.toString()]: ROPSTEN_CHAIN_ID,
  [RINKEBY_CODE.toString()]: RINKEBY_CHAIN_ID,
  [KOVAN_CODE.toString()]: KOVAN_CHAIN_ID,
  [GOERLI_CODE.toString()]: GOERLI_CHAIN_ID,
  [MATIC_CODE.toString()]: MATIC_CHAIN_ID,
  [MUMBAI_CODE.toString()]: MUMBAI_CHAIN_ID,
  [BSC_MAINNET_CODE.toString()]: BSC_MAINNET_CHAIN_ID,
  [BSC_TESTNET_CODE.toString()]: BSC_TESTNET_CHAIN_ID,
  [OKC_MAINNET_CODE.toString()]: OKC_MAINNET_CHAIN_ID,
  [OKC_TESTNET_CODE.toString()]: OKC_TESTNET_CHAIN_ID,
  [XDAI_CODE.toString()]: XDAI_CHAIN_ID,
  [RSK_MAINNET_CODE.toString()]: RSK_MAINNET_CHAIN_ID,
  [RSK_TESTNET_CODE.toString()]: RSK_TESTNET_CHAIN_ID,
  [ARBITRUM_MAINNET_CODE.toString()]: ARBITRUM_MAINNET_CHAIN_ID,
  [ARBITRUM_TESTNET_CODE.toString()]: ARBITRUM_TESTNET_CHAIN_ID,
  [OPTIMISM_MAINNET_CODE.toString()]: OPTIMISM_MAINNET_CHAIN_ID,
  [OPTIMISM_TESTNET_CODE.toString()]: OPTIMISM_TESTNET_CHAIN_ID,
  [AVALANCHE_MAINNET_CODE.toString()]: AVALANCHE_MAINNET_CHAIN_ID,
  [AVALANCHE_TESTNET_CODE.toString()]: AVALANCHE_TESTNET_CHAIN_ID,
}

export const isMain = window.self === window.top

export const getIFrameOrigin = () => {
  const originHref = window.location.ancestorOrigins?.length > 0 ? window.location.ancestorOrigins[0] : document.referrer
  if (!originHref) return originHref
  const url = new URL(originHref)
  return url.origin
}

export const getIFrameOriginObject = () => {
  try {
    const url = new URL(getIFrameOrigin())
    return { href: url.href, hostname: url.hostname }
  } catch {
    return { href: window.location.href, hostname: window.location.hostname }
  }
}

export const fakeStream = {
  write: () => {},
}

export function formatSmallNumbers(number, currency = 'usd', noTilde = false) {
  const finalNumber = BigNumber.isBigNumber(number) ? number.toNumber() : number
  if (!Number.isFinite(finalNumber)) return ''
  const value = currency.toLowerCase() === 'usd' ? Number(finalNumber).toFixed(2) : Number(finalNumber).toFixed(5)
  const tilde = value > 0 ? '~ ' : ''
  return `${currency.toLowerCase() === 'usd' || noTilde ? '' : tilde}${Number(value)} ${currency.toUpperCase()}`
}

export const getUserLanguage = () => {
  let userLanguage = window.navigator.userLanguage || window.navigator.language || 'en-US'
  userLanguage = userLanguage.split('-')
  userLanguage = Object.prototype.hasOwnProperty.call(languageMap, userLanguage[0]) ? userLanguage[0] : 'en'
  return userLanguage
}

export const formatPastTx = (x, lowerCaseSelectedAddress) => {
  let totalAmountString = ''
  if (x.type === CONTRACT_TYPE_ERC721 || x.type === CONTRACT_TYPE_ERC1155) totalAmountString = x.symbol
  else if (x.type === CONTRACT_TYPE_ERC20) totalAmountString = formatSmallNumbers(Number.parseFloat(x.total_amount), x.symbol, true)
  else totalAmountString = formatSmallNumbers(Number.parseFloat(x.total_amount), x.type_name, true)
  const currencyAmountString =
    x.type === CONTRACT_TYPE_ERC721 || x.type === CONTRACT_TYPE_ERC1155 || x.isEtherscan
      ? ''
      : formatSmallNumbers(Number.parseFloat(x.currency_amount), x.selected_currency, true)
  const finalObject = {
    id: x.created_at.toString(),
    date: new Date(x.created_at),
    from: x.from,
    slicedFrom: typeof x.from === 'string' ? addressSlicer(x.from) : '',
    to: x.to,
    slicedTo: typeof x.to === 'string' ? addressSlicer(x.to) : '',
    action: lowerCaseSelectedAddress === x.to?.toLowerCase() || '' ? ACTIVITY_ACTION_RECEIVE : ACTIVITY_ACTION_SEND,
    totalAmount: x.total_amount,
    totalAmountString,
    currencyAmount: x.currency_amount,
    currencyAmountString,
    amount: `${totalAmountString} / ${currencyAmountString}`,
    status: x.status,
    etherscanLink: getEtherScanHashLink(x.transaction_hash, x.network || MAINNET),
    networkType: x.network,
    ethRate:
      Number.parseFloat(x?.total_amount) && Number.parseFloat(x?.currency_amount)
        ? `1 ${x.symbol} = ${significantDigits(Number.parseFloat(x.currency_amount) / Number.parseFloat(x.total_amount))}`
        : '',
    currencyUsed: x.selected_currency,
    type: x.type,
    type_name: x.type_name,
    type_image_link: x.type_image_link,
    transaction_hash: x.transaction_hash,
    isEtherscan: x.isEtherscan,
    transaction_category: x.transaction_category,
    input: x.input || '',
    contract_address: x.contract_address || '',
    token_id: x.token_id || '',
    nonce: x.nonce || '',
    is_cancel: !!x.is_cancel || false,
    gas: x.gas || '',
    gasPrice: x.gasPrice || '',
  }
  return finalObject
}

export const padUrlString = (url) => (url.href.endsWith('/') ? url.href : `${url.href}/`)

function caseSensitiveField(field, isCaseSensitive) {
  return isCaseSensitive ? field : field.toLowerCase()
}

export const getVerifierId = (userInfo, typeOfLogin, verifierIdField, isVerifierIdCaseSensitive = true) => {
  const { name, sub } = userInfo
  if (verifierIdField) return caseSensitiveField(userInfo[verifierIdField], isVerifierIdCaseSensitive)
  switch (typeOfLogin) {
    case PASSWORDLESS:
    case EMAIL_PASSWORD:
      return caseSensitiveField(name, isVerifierIdCaseSensitive)
    case GITHUB:
    case TWITTER:
    case WEIBO:
    case APPLE:
    case LINKEDIN:
    case LINE:
    case WECHAT:
    case KAKAO:
    case JWT:
      return caseSensitiveField(sub, isVerifierIdCaseSensitive)
    default:
      throw new Error('Invalid login type')
  }
}

export const handleRedirectParameters = (hash, queryParameters) => {
  const hashParameters = Object.fromEntries(new URLSearchParams(hash))
  log.info(hashParameters, queryParameters)
  let instanceParameters = {}
  let error = ''
  if (!queryParameters.preopenInstanceId) {
    if (Object.keys(hashParameters).length > 0 && hashParameters.state) {
      instanceParameters = JSON.parse(atob(decodeURIComponent(decodeURIComponent(hashParameters.state)))) || {}
      error = hashParameters.error_description || hashParameters.error || error
    } else if (Object.keys(queryParameters).length > 0 && queryParameters.state) {
      instanceParameters = JSON.parse(atob(decodeURIComponent(decodeURIComponent(queryParameters.state)))) || {}
      if (queryParameters.error) error = queryParameters.error
    }
  }
  return { error, instanceParameters, hashParameters }
}

export function generateAddressFromPubKey(point) {
  return pubToAddress(point.encode('arr'))
}

export function generateAddressFromPrivateKey(privKey) {
  return toChecksumAddress(privateToAddress(Buffer.from(privKey, 'hex')).toString('hex'))
}

export function toChecksumAddressByChainId(address, chainId) {
  const parsedChainId = Number.parseInt(chainId, isHexStrict(chainId) ? 16 : 10)
  if (!isAddressByChainId(address, chainId)) return address
  if (parsedChainId === RSK_MAINNET_CODE || parsedChainId === RSK_TESTNET_CODE) {
    return rskUtils.toChecksumAddress(address, chainId)
  }
  return toChecksumAddress(address)
}

export function isAddressByChainId(address, chainId) {
  const parsedChainId = Number.parseInt(chainId, isHexStrict(chainId) ? 16 : 10)
  if (parsedChainId === RSK_MAINNET_CODE || parsedChainId === RSK_TESTNET_CODE) {
    return rskUtils.isValidChecksumAddress(address, chainId)
  }
  return isAddress(address)
}

export function downloadItem(filename, text) {
  const element = document.createElement('a')
  element.setAttribute('href', `data:application/json;charset=utf-8,${encodeURIComponent(text)}`)
  element.setAttribute('download', filename)
  element.style.display = 'none'
  document.body.append(element)
  element.click()
  element.remove()
}

export function derivePubKeyXFromPolyID(polyID) {
  return polyID.split('|')[0]
}

export function passwordValidation(v) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,}$/.test(v)
}

export function padPrivateKey(privKey) {
  return privKey.padStart(64, 0)
}

export function getUserEmail(userInfo, loginConfig, walletDisplay) {
  const currentConfig = loginConfig[userInfo.verifier]
  const verifierName = currentConfig?.name || ''
  const typeOfLoginDisplay = verifierName.charAt(0).toUpperCase() + verifierName.slice(1)
  return (userInfo.typeOfLogin !== APPLE && userInfo.email) || userInfo.name || `${typeOfLoginDisplay} ${walletDisplay}`
}

export const isPwa = navigator.standalone || matchMedia('(display-mode: standalone)').matches || document.referrer.includes('android-app://')

export const isPopup = () => {
  const queryParameters = new URLSearchParams(window.location.search)
  const instanceId = queryParameters.get('instanceId')
  return !!instanceId
}

export function apiStreamSupported() {
  return navigator?.mediaDevices?.getUserMedia !== undefined
}

export async function requestQuota() {
  return new Promise((resolve, reject) => {
    if (navigator.webkitPersistentStorage?.requestQuota) navigator.webkitPersistentStorage.requestQuota(1024 * 1024 * 10, resolve, reject)
    else resolve()
  })
}

export function getUserIcon(accountType, typeOfLogin) {
  if (accountType === ACCOUNT_TYPE.THRESHOLD) {
    return 'wallet'
  }
  if (accountType === ACCOUNT_TYPE.IMPORTED) {
    return 'person_circle'
  }
  if (accountType === ACCOUNT_TYPE.TKEY_SEED_PHRASE) {
    return 'tkey_seed_phrase'
  }
  if (accountType === ACCOUNT_TYPE.APP_SCOPED) {
    return 'device_tablet'
  }
  if (!typeOfLogin) return 'person_circle'
  return typeOfLogin.toLowerCase()
}

export function thirdPartyAuthenticators(loginConfig) {
  const finalAauthenticators = Object.values(loginConfig)
    .reduce((authenticators, authenticator) => {
      if (Object.prototype.hasOwnProperty.call(authenticator, 'jwtParameters')) {
        authenticators.push(capitalizeFirstLetter(authenticator.name))
      }
      return authenticators
    }, [])
    .sort((a, b) => {
      if (a > b) return 1
      if (a < b) return -1
      return 0
    })

  return finalAauthenticators.join(', ')
}

export function getVerifierOptions() {
  try {
    const verifiers = JSON.parse(JSON.stringify(ALLOWED_VERIFIERS))
    return verifiers.filter((verifier) => {
      if (config.ethTransferOnly) {
        if (verifier.value === ETH) return true
      } else {
        return true
      }
      return false
    })
  } catch {
    return []
  }
}

export async function validateContractAddress(web3, address, chainId) {
  if (isAddressByChainId(address, chainId)) {
    const contractCode = await web3.eth.getCode(address.toLowerCase())
    // user account address will return 0x for networks , except ganache returns 0x0
    if (contractCode === '0x' || contractCode === '0x0') {
      return false
    }
    return true
  }
  return false
}

export async function validateImageUrl(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = url
    if (img.complete) {
      resolve(true)
    } else {
      img.addEventListener('load', () => {
        resolve(true)
      })
      img.addEventListener('error', () => {
        reject()
      })
    }
  })
}

export function sanitizeNftMetdataUrl(url) {
  let finalUri = url
  if (url.startsWith('ipfs')) {
    const ipfsPath = url.split('ipfs://')[1]
    finalUri = getIpfsEndpoint(ipfsPath)
  }
  return finalUri
}

export function getChainType(chainId) {
  if (chainId === MAINNET_CHAIN_ID || chainId === Number.parseInt(MAINNET_CHAIN_ID, 16)) {
    return 'mainnet'
  }
  if (TEST_CHAINS.includes(chainId) || TEST_CHAINS_NUMERIC_IDS.includes(chainId)) {
    return 'testnet'
  }
  return 'custom'
}

export const GAS_LIMITS = {
  // maximum gasLimit of a simple send
  SIMPLE: addHexPrefix((21_000).toString(16)),
  // a base estimate for token transfers.
  BASE_TOKEN_ESTIMATE: addHexPrefix((100_000).toString(16)),
}

export function gasTiming(maxPriorityFeePerGas, gasFees, t, translateKey) {
  const {
    gasFeeEstimates: { low, medium, high },
  } = gasFees
  if (Number(maxPriorityFeePerGas) >= Number(medium.suggestedMaxPriorityFeePerGas)) {
    // High+ is very likely, medium is likely
    if (Number(maxPriorityFeePerGas) < Number(high.suggestedMaxPriorityFeePerGas)) {
      const finalTranslateKey = translateKey || 'walletTransfer.transferLessThan'
      // medium
      return t(finalTranslateKey, {
        time: translateKey ? `< ${toHumanReadableTime(low.maxWaitTimeEstimate, t)}` : toHumanReadableTime(low.maxWaitTimeEstimate, t),
      })
    }
    const finalTranslateKey = translateKey || 'walletTransfer.transferLessThan'

    // high
    return t(finalTranslateKey).replace(
      /{time}/gi,
      translateKey ? `< ${toHumanReadableTime(high.minWaitTimeEstimate, t)}` : toHumanReadableTime(high.minWaitTimeEstimate, t)
    )
  }
  const finalTranslateKey = translateKey || 'walletTransfer.transferApprox'

  return t(finalTranslateKey).replace(
    /{time}/gi,
    translateKey ? `~ ${toHumanReadableTime(low.maxWaitTimeEstimate, t)}` : toHumanReadableTime(low.maxWaitTimeEstimate, t)
  )
}

const SECOND_CUTOFF = 90
function toHumanReadableTime(milliseconds, t) {
  const seconds = Math.ceil((milliseconds || 1) / 1000)
  if (seconds <= SECOND_CUTOFF) {
    return t('walletTransfer.fee-edit-time-sec', { time: seconds })
  }
  return t('walletTransfer.fee-edit-time-min', { time: Math.ceil(seconds / 60) })
}

export function bnGreaterThan(a, b) {
  if (a === null || a === undefined || b === null || b === undefined) {
    return null
  }
  return new BigNumber(a, 10).gt(b, 10)
}

export function bnLessThan(a, b) {
  if (a === null || a === undefined || b === null || b === undefined) {
    return null
  }
  return new BigNumber(a, 10).lt(b, 10)
}

export function bnGreaterThanEqualTo(a, b) {
  if (a === null || a === undefined || b === null || b === undefined) {
    return null
  }
  return new BigNumber(a, 10).gte(b, 10)
}

export function bnLessThanEqualTo(a, b) {
  if (a === null || a === undefined || b === null || b === undefined) {
    return null
  }
  return new BigNumber(a, 10).lte(b, 10)
}

export function bnEqualTo(a, b) {
  if (a === null || a === undefined || b === null || b === undefined) {
    return null
  }
  return new BigNumber(a, 10).isEqualTo(b, 10)
}

export function waitForMs(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 *
 * @param {*} chainId in numeric format
 * @returns fungible token standard ie erc20, bep20
 */
export function getFungibleTokenStandard(chainId) {
  switch (chainId) {
    case MATIC_CODE:
    case MUMBAI_CODE:
    case MAINNET_CODE:
      return 'ERC20'
    case BSC_TESTNET_CODE:
    case BSC_MAINNET_CODE:
      return 'BEP20'
    default:
      return 'ERC20'
  }
}

export function getTorusMessage(message) {
  const prefix = Buffer.from(`\u0019${window.location.hostname} Signed Message:\n${message.length.toString()}`, 'utf8')
  return Buffer.concat([prefix, message])
}

export function generateTorusAuthHeaders(privateKey, publicAddress) {
  let challenge = Date.now()
  challenge = ((challenge - (challenge % 1000)) / 1000).toString()
  const message = getTorusMessage(Buffer.from(challenge, 'utf8'))
  const hash = keccak(message)
  const messageSig = ecsign(hash, Buffer.from(privateKey, 'hex'))
  const signature = concatSig(messageSig.v, messageSig.r, messageSig.s)
  const authHeaders = {
    'Auth-Challenge': challenge,
    'Auth-Signature': signature,
    'Auth-Public-Address': publicAddress,
  }
  return authHeaders
}

// will return isIdle to true if not activity is detected for 10 minutes.
export const idleTimeTracker = ((activityThresholdTime) => {
  let isIdle = false
  let idleTimeout = null
  window.addEventListener('load', resetTimer)
  document.addEventListener('mousemove', resetTimer)
  document.addEventListener('keydown', resetTimer)
  function resetTimer() {
    if (idleTimeout) {
      clearTimeout(idleTimeout)
    }
    isIdle = false
    idleTimeout = setTimeout(() => {
      isIdle = true
    }, activityThresholdTime * 1000)
  }

  function checkIfIdle() {
    return isIdle
  }
  return {
    checkIfIdle,
  }
})(600)
