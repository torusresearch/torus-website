import assert from 'assert'
import BigNumber from 'bignumber.js'
import { addHexPrefix, BN, privateToAddress, pubToAddress, stripHexPrefix } from 'ethereumjs-util'
import log from 'loglevel'
import { isAddress, toChecksumAddress } from 'web3-utils'

import config from '../config'
import languages from '../plugins/locales'
import {
  ACCOUNT_TYPE,
  ACTIVE,
  ACTIVITY_ACTION_RECEIVE,
  ACTIVITY_ACTION_SEND,
  ALLOWED_VERIFIERS,
  APPLE,
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
  MATIC_CHAIN_ID,
  MATIC_CODE,
  MERCURYO,
  MOONPAY,
  MUMBAI_CHAIN_ID,
  MUMBAI_CODE,
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
  SIMPLEX,
  SUPPORTED_NETWORK_TYPES,
  SVG,
  THEME_DARK_BLACK_NAME,
  TWITTER,
  WECHAT,
  WEIBO,
  WYRE,
  XANPOOL,
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
 * Checks whether a storage type is available or not
 * For more info on how this works, please refer to MDN documentation
 * https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API#Feature-detecting_localStorage
 *
 * @method storageAvailable
 * @param {String} type the type of storage ('localStorage', 'sessionStorage')
 * @returns {Boolean} a boolean indicating whether the specified storage is available or not
 */
export function storageAvailable(type) {
  let storage
  try {
    storage = window[type]
    const x = '__storage_test__'
    storage.setItem(x, x)
    storage.removeItem(x)
    return true
  } catch (error) {
    return (
      error &&
      // everything except Firefox
      (error.code === 22 ||
        // Firefox
        error.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        error.name === 'QuotaExceededError' ||
        // Firefox
        error.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length > 0
    )
  }
}

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

export function validateVerifierId(selectedTypeOfLogin, value) {
  if (selectedTypeOfLogin === ETH) {
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

export const paymentProviders = {
  [SIMPLEX]: {
    line1: 'Credit/ Debit Card',
    line2: '5% or 10 USD',
    line3: '$20,000/day, $50,000/mo',
    line4: 'ETH, BNB',
    status: ACTIVE,
    logoExtension: PNG,
    supportPage: 'https://www.simplex.com/support/',
    minOrderValue: 50,
    maxOrderValue: 20_000,
    validCurrencies: ['USD', 'EUR'],
    validCryptoCurrencies: ['ETH', 'BNB'],
    includeFees: true,
    api: true,
    enforceMax: true,
  },
  [MOONPAY]: {
    line1: 'Credit/ Debit Card/ Apple Pay',
    line2: '4.5% or 5 USD',
    line3: '2,000€/day, 10,000€/mo',
    line4: 'ETH, DAI, TUSD, USDC, USDT, BNB, BUSD',
    status: ACTIVE,
    logoExtension: SVG,
    supportPage: 'https://help.moonpay.io/en/',
    minOrderValue: 24.99,
    maxOrderValue: 50_000,
    validCurrencies: ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'SGD', 'RUB'],
    validCryptoCurrencies: ['ETH', 'DAI', 'TUSD', 'USDC', 'USDT', 'BNB_BSC', 'BUSD_BSC'],
    includeFees: true,
    api: true,
    enforceMax: false,
  },
  [WYRE]: {
    line1: 'Apple Pay/ Debit/ Credit Card',
    line2: '4.9% + 30¢ or 5 USD',
    line3: '$250/day',
    line4: 'ETH, DAI, USDT, USDC',
    status: ACTIVE,
    logoExtension: SVG,
    supportPage: 'https://support.sendwyre.com/en/',
    minOrderValue: 5,
    maxOrderValue: 500,
    validCurrencies: ['USD', 'AUD', 'CAD', 'GBP', 'EUR'],
    validCryptoCurrencies: ['ETH', 'DAI', 'USDC', 'USDT'],
    includeFees: false,
    api: true,
    enforceMax: false,
  },
  [RAMPNETWORK]: {
    line1: 'Debit Card/ <br>Apple Pay/ Bank transfer',
    line2: '0.49% - 2.9%',
    line3: '5,000€/purchase, 20,000€/mo',
    line4: 'ETH, DAI, USDC, BNB',
    status: ACTIVE,
    logoExtension: SVG,
    supportPage: 'https://instant.ramp.network/',
    minOrderValue: 50,
    maxOrderValue: 20_000,
    validCurrencies: ['EUR', 'GBP', 'USD'],
    validCryptoCurrencies: ['ETH', 'DAI', 'USDC', 'BSC_BNB'],
    includeFees: true,
    api: true,
    receiveHint: 'walletTopUp.receiveHintRamp',
    enforceMax: false,
  },
  [XANPOOL]: {
    line1: 'PayNow/ InstaPay/ FPS/ GoJekPay/ UPI/ PromptPay/ <br>ViettelPay/ DuitNow',
    line2: '2.5% buying, 3% selling',
    line3: '$2,500 / day',
    line4: 'ETH, USDT',
    status: ACTIVE,
    logoExtension: SVG,
    supportPage: 'mailto:support@xanpool.com',
    minOrderValue: 100,
    maxOrderValue: 2500,
    validCurrencies: ['SGD', 'HKD', 'MYR', 'PHP', 'INR', 'VND', 'THB', 'IDR'],
    validCryptoCurrencies: ['ETH', 'USDT'],
    includeFees: true,
    api: true,
    sell: true,
    enforceMax: false,
  },
  [MERCURYO]: {
    line1: 'Credit/ Debit Card/ Apple Pay',
    line2: '3.95% or 4 USD',
    line3: '10,000€/day, 25,000€/mo',
    line4: 'ETH, DAI, BAT, OKB, USDT',
    status: ACTIVE,
    logoExtension: SVG,
    supportPage: 'mailto:support@mercuryo.io',
    minOrderValue: 30,
    maxOrderValue: 5000,
    validCurrencies: ['USD', 'EUR', 'RUB', 'TRY', 'GBP', 'UAH'],
    validCryptoCurrencies: ['ETH', 'DAI', 'BAT', 'USDT', 'OKB'],
    includeFees: true,
    api: true,
    enforceMax: false,
  },
}

export function getPaymentProviders(theme) {
  return Object.keys(paymentProviders).map((x) => {
    const item = paymentProviders[x]
    return {
      ...item,
      name: x,
      logo: theme === THEME_DARK_BLACK_NAME ? `${x}-logo-white.${item.logoExtension}` : `${x}-logo.${item.logoExtension}`,
      link: `/wallet/topup/${x}`,
    }
  })
}

export function formatTxMetaForRpcResult(txMeta) {
  return {
    blockHash: txMeta.txReceipt ? txMeta.txReceipt.blockHash : null,
    blockNumber: txMeta.txReceipt ? txMeta.txReceipt.blockNumber : null,
    from: txMeta.txParams.from,
    gas: txMeta.txParams.gas,
    gasPrice: txMeta.txParams.gasPrice,
    hash: txMeta.hash,
    input: txMeta.txParams.data || '0x',
    nonce: txMeta.txParams.nonce,
    to: txMeta.txParams.to,
    transactionIndex: txMeta.txReceipt ? txMeta.txReceipt.transactionIndex : null,
    value: txMeta.txParams.value || '0x0',
    v: txMeta.v,
    r: txMeta.r,
    s: txMeta.s,
  }
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
  [XDAI_CODE.toString()]: XDAI_CHAIN_ID,
}

export function selectChainId(network, store) {
  const networkId = store.getState()
  return standardNetworkId[network] || networkId.toString().startsWith('0x') ? networkId : `0x${Number.parseInt(networkId, 10).toString(16)}`
}

export const isMain = window.self === window.top

export const getIFrameOrigin = () => {
  const originHref = window.location.ancestorOrigins?.length > 0 ? window.location.ancestorOrigins[0] : document.referrer
  return originHref
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
  userLanguage = Object.prototype.hasOwnProperty.call(languages, userLanguage[0]) ? userLanguage[0] : 'en'
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
  const hashParameters = hash.split('&').reduce((result, item) => {
    const [part0, part1] = item.split('=')
    result[part0] = part1
    return result
  }, {})
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

export async function validateContractAddress(web3, address) {
  if (isAddress(address)) {
    const contractCode = await web3.eth.getCode(address)
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
