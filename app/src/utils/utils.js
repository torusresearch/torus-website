const ethUtil = require('ethereumjs-util')
const assert = require('assert')
const BN = ethUtil.BN
const BigNumber = require('bignumber.js')
const {
  ENVIRONMENT_TYPE_POPUP,
  ENVIRONMENT_TYPE_NOTIFICATION,
  ENVIRONMENT_TYPE_FULLSCREEN,
  PLATFORM_FIREFOX,
  PLATFORM_OPERA,
  PLATFORM_CHROME,
  PLATFORM_EDGE,
  PLATFORM_BRAVE,
  ETH,
  GOOGLE,
  REDDIT,
  DISCORD,
  SIMPLEX,
  MOONPAY,
  COINDIRECT,
  WYRE,
  CRYPTO,
  THEME_DARK_BLACK_NAME,
  INACTIVE,
  ACTIVE,
  PNG,
  SVG
} = require('./enums')
const log = require('loglevel')
const { isAddress } = require('web3-utils')

/**
 * Checks whether a storage type is available or not
 * For more info on how this works, please refer to MDN documentation
 * https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API#Feature-detecting_localStorage
 *
 * @method storageAvailable
 * @param {String} type the type of storage ('localStorage', 'sessionStorage')
 * @returns {Boolean} a boolean indicating whether the specified storage is available or not
 */
function storageAvailable(type) {
  var storage
  try {
    storage = window[type]
    var x = '__storage_test__'
    storage.setItem(x, x)
    storage.removeItem(x)
    return true
  } catch (e) {
    return (
      e &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    )
  }
}

/**
 * Generates an example stack trace
 *
 * @returns {string} A stack trace
 *
 */
function getStack() {
  const stack = new Error('Stack trace generator - not an error').stack
  return stack
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
const getEnvironmentType = (url = window.location.href) => {
  if (url.match(/popup.html(?:#.*)*$/)) {
    return ENVIRONMENT_TYPE_POPUP
  } else if (url.match(/home.html(?:\?.+)*$/) || url.match(/home.html(?:#.*)*$/)) {
    return ENVIRONMENT_TYPE_FULLSCREEN
  } else {
    return ENVIRONMENT_TYPE_NOTIFICATION
  }
}

/**
 * Returns the platform (browser) where the extension is running.
 *
 * @returns {string} the platform ENUM
 *
 */
const getPlatform = _ => {
  const ua = navigator.userAgent
  if (ua.search('Firefox') !== -1) {
    return PLATFORM_FIREFOX
  } else {
    if (window && window.chrome && window.chrome.ipcRenderer) {
      return PLATFORM_BRAVE
    } else if (ua.search('Edge') !== -1) {
      return PLATFORM_EDGE
    } else if (ua.search('OPR') !== -1) {
      return PLATFORM_OPERA
    } else {
      return PLATFORM_CHROME
    }
  }
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
function sufficientBalance(txParams, hexBalance) {
  // validate hexBalance is a hex string
  assert.strictEqual(typeof hexBalance, 'string', 'sufficientBalance - hexBalance is not a hex string')
  assert.strictEqual(hexBalance.slice(0, 2), '0x', 'sufficientBalance - hexBalance is not a hex string')

  const balance = hexToBn(hexBalance)
  const value = hexToBn(txParams.value)
  const gasLimit = hexToBn(txParams.gas)
  const gasPrice = hexToBn(txParams.gasPrice)

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
function bnToHex(inputBn) {
  return ethUtil.addHexPrefix(inputBn.toString(16))
}

/**
 * Converts a hex string to a BN object
 *
 * @param {string} inputHex A number represented as a hex string
 * @returns {Object} A BN object
 *
 */
function hexToBn(inputHex) {
  return new BN(ethUtil.stripHexPrefix(inputHex), 16)
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
function BnMultiplyByFraction(targetBN, numerator, denominator) {
  const numBN = new BN(numerator)
  const denomBN = new BN(denominator)
  return targetBN.mul(numBN).div(denomBN)
}

function applyListeners(listeners, emitter) {
  Object.keys(listeners).forEach(key => {
    emitter.on(key, listeners[key])
  })
}

function removeListeners(listeners, emitter) {
  Object.keys(listeners).forEach(key => {
    emitter.removeListener(key, listeners[key])
  })
}

/**
 * Converts a hex-encoded string to a text string.
 *
 * @param {string} hex Hex string to be converted
 * @returns {string} Text converted from the hex string
 */
function hexToText(hex) {
  try {
    const stripped = ethUtil.stripHexPrefix(hex)
    const buff = Buffer.from(stripped, 'hex')
    return buff.toString('utf8')
  } catch (e) {
    return hex
  }
}

function addressSlicer(address = '') {
  if (address.length < 11) {
    return address
  }
  return `${address.slice(0, 5)}...${address.slice(-5)}`
}

function significantDigits(number, perc = false, len = 2) {
  let input = !BigNumber.isBigNumber(number) ? new BigNumber(number) : number
  if (input.isZero()) return input
  if (perc) {
    input = input.times(new BigNumber(100))
  }
  let depth
  if (input.gte(new BigNumber(1))) {
    depth = 2
  } else {
    depth = len - 1 + Math.ceil(Math.log10(new BigNumber('1').div(input).toNumber()))
  }
  const shift = new BigNumber(10).pow(new BigNumber(depth))
  const roundedNum = Math.round(shift.times(input).toNumber()) / shift
  return roundedNum
}

function formatCurrencyNumber(amount, decimalCount = 2, decimal = '.', thousands = ',') {
  try {
    let amt = amount
    let decimals = decimalCount
    decimals = Math.abs(decimals)
    decimals = isNaN(decimals) ? 2 : decimals

    const negativeSign = amt < 0 ? '-' : ''

    const i = parseInt((amt = Math.abs(Number(amount) || 0).toFixed(decimals)), 10).toString()
    const j = i.length > 3 ? i.length % 3 : 0

    return `${negativeSign +
      (j ? i.substr(0, j) + thousands : '') +
      i.substr(j).replace(/(\d{3})(?=\d)/g, `$1${thousands}`) +
      (decimals
        ? decimal +
          Math.abs(amount - i)
            .toFixed(decimals)
            .slice(2)
        : '')}`
  } catch (e) {
    log.error(e)
  }
  return null
}

async function isSmartContractAddress(address, web3) {
  const code = await web3.eth.getCode(address)
  // Geth will return '0x', and ganache-core v2.2.1 will return '0x0'
  const codeIsEmpty = !code || code === '0x' || code === '0x0'
  return !codeIsEmpty
}

function getEtherScanHashLink(txHash, network = null) {
  const localNetwork = network === null ? 'mainnet' : network
  return network === 'mainnet' ? `https://etherscan.io/tx/${txHash}` : `https://${localNetwork}.etherscan.io/tx/${txHash}`
}

const statusObj = {
  SENT_TO_SIMPLEX: 'pending',
  DENIED_SIMPLEX: 'rejected',
  payment_request_submitted: 'processing',
  pending_simplexcc_approval: 'processing',
  PROCESSING_SIMPPLEX: 'processing',
  SUCCESS_SIMPLEX: 'success',
  payment_simplexcc_approved: 'success',
  pending_simplexcc_payment_to_partner: 'success'
}

function getStatus(status) {
  return statusObj[status] || 'pending'
}

async function getEthTxStatus(hash, web3) {
  const receipt = await web3.eth.getTransactionReceipt(hash)
  if (receipt === null) return 'pending'
  else if (receipt && receipt.status) return 'confirmed'
  else if (receipt && !receipt.status) return 'rejected'
}

function extractHostname(url) {
  var hostname
  // find & remove protocol (http, ftp, etc.) and get hostname
  if (!url) return ''
  if (url.indexOf('//') > -1) {
    hostname = url.split('/')[2]
  } else {
    hostname = url.split('/')[0]
  }

  // find & remove port number
  hostname = hostname.split(':')[0]
  // find & remove "?"
  hostname = hostname.split('?')[0]

  return hostname
}

const broadcastChannelOptions = {
  // type: 'localstorage', // (optional) enforce a type, oneOf['native', 'idb', 'localstorage', 'node']
  webWorkerSupport: false // (optional) set this to false if you know that your channel will never be used in a WebWorker (increases performance)
}

function validateVerifierId(selectedVerifier, value) {
  if (selectedVerifier === ETH) {
    return isAddress(value) || 'Invalid ETH Address'
  } else if (selectedVerifier === GOOGLE) {
    return (
      // eslint-disable-next-line max-len
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        value
      ) || 'Invalid Email Address'
    )
  } else if (selectedVerifier === REDDIT) {
    return (/^[\w-]+$/.test(value) && !/\s/.test(value) && value.length >= 3 && value.length <= 20) || 'Invalid reddit username'
  } else if (selectedVerifier === DISCORD) {
    return (/^[0-9]*$/.test(value) && value.length === 18) || 'Invalid Discord ID'
  }

  return true
}

function formatDate(date) {
  const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const day = date.getDate()
  const month = monthList[date.getMonth()]
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

const paymentProviders = {
  [SIMPLEX]: {
    line1: 'Credit / Debit Card',
    line2: '5% or 10 USD',
    line3: '$20,000/day, $50,000/mo',
    line4: 'ETH',
    status: ACTIVE,
    logoExtension: PNG,
    supportPage: 'https://www.simplex.com/support/',
    minOrderValue: 50,
    maxOrderValue: 20000,
    validCurrencies: ['USD', 'EUR'],
    validCryptoCurrencies: ['ETH'],
    includeFees: true,
    api: true
  },
  [MOONPAY]: {
    line1: 'Credit / Debit Card / Apple Pay',
    line2: '4.5% or 5 USD',
    line3: '2,000€/day, 10,000€/mo',
    line4: 'ETH, DAI, TUSD, USDC, USDT',
    status: ACTIVE,
    logoExtension: SVG,
    supportPage: 'https://help.moonpay.io/en/',
    minOrderValue: 24.99,
    maxOrderValue: 2000,
    validCurrencies: ['USD', 'EUR', 'GBP'],
    validCryptoCurrencies: ['ETH', 'DAI', 'TUSD', 'USDC', 'USDT'],
    includeFees: true,
    api: true
  },
  [WYRE]: {
    line1: 'Apple Pay/Debit Card',
    line2: '1.5% + 30¢',
    line3: '$250/day',
    line4: 'ETH, DAI, WETH, USDC',
    status: ACTIVE,
    logoExtension: SVG,
    supportPage: 'https://support.sendwyre.com/en/',
    minOrderValue: 20,
    maxOrderValue: 250,
    validCurrencies: ['USD'],
    validCryptoCurrencies: ['ETH', 'DAI', 'USDC'],
    includeFees: false,
    api: true
  },
  [COINDIRECT]: {
    line1: 'Credit / Debit Card',
    line2: '2.99%',
    line3: 'N/A',
    line4: 'ETH, DAI, USDT',
    status: ACTIVE,
    logoExtension: SVG,
    supportPage: 'https://help.coindirect.com/hc/en-us',
    minOrderValue: 20,
    maxOrderValue: 1000,
    validCurrencies: ['EUR'],
    validCryptoCurrencies: ['ETH', 'DAI', 'USDT'],
    includeFees: true,
    api: true
  }
  // [CRYPTO]: {
  //   line1: 'Credit Card',
  //   line2: 'Varies',
  //   line3: 'N/A',
  //   line4: 'ETH, tokens',
  //   status: ACTIVE,
  //   logoExtension: PNG,
  //   supportPage: 'https://help.crypto.com/en/',
  //   minOrderValue: 10,
  //   maxOrderValue: 1000,
  //   validCurrencies: ['USD'],
  //   validCryptoCurrencies: ['ETH'],
  //   includeFees: true,
  //   api: false
  // }
}

function getPaymentProviders(theme) {
  return Object.keys(paymentProviders).map(x => {
    const item = paymentProviders[x]
    return {
      ...item,
      name: x,
      logo: theme === THEME_DARK_BLACK_NAME ? `${x}-logo-white.${item.logoExtension}` : `${x}-logo.${item.logoExtension}`,
      link: `/wallet/topup/${x}`
    }
  })
}

function formatTxMetaForRpcResult(txMeta) {
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
    s: txMeta.s
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

module.exports = {
  removeListeners,
  applyListeners,
  getPlatform,
  getStack,
  getEnvironmentType,
  sufficientBalance,
  hexToBn,
  bnToHex,
  BnMultiplyByFraction,
  hexToText,
  addressSlicer,
  significantDigits,
  isSmartContractAddress,
  extractHostname,
  formatCurrencyNumber,
  getEtherScanHashLink,
  getStatus,
  getEthTxStatus,
  broadcastChannelOptions,
  storageAvailable,
  validateVerifierId,
  formatDate,
  paymentProviders,
  getPaymentProviders,
  formatTxMetaForRpcResult,
  capitalizeFirstLetter
}
