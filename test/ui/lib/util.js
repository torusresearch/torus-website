import { addHexPrefix, BN, isValidAddress as isValidAddressUtil, isValidChecksumAddress, stripHexPrefix, toChecksumAddress } from 'ethereumjs-util'
import abi from 'human-standard-token-abi'
import { DateTime } from 'luxon'

import hexToBn from './hex-to-bn'

const MIN_GAS_PRICE_GWEI_BN = new BN(1)
const GWEI_FACTOR = new BN(1e9)
const MIN_GAS_PRICE_BN = MIN_GAS_PRICE_GWEI_BN.mul(GWEI_FACTOR)

// formatData :: ( date: <Unix Timestamp> ) -> String
// eslint-disable-next-line quotes
function formatDate(date, format = "M/d/y 'at' T") {
  return DateTime.fromMillis(date).toFormat(format)
}

const valueTable = {
  wei: '1000000000000000000',
  kwei: '1000000000000000',
  mwei: '1000000000000',
  gwei: '1000000000',
  szabo: '1000000',
  finney: '1000',
  ether: '1',
}
const bnTable = {}
for (const currency in valueTable) {
  bnTable[currency] = new BN(valueTable[currency], 10)
}

function valuesFor(object) {
  if (!object) return []
  return Object.keys(object).map((key) => object[key])
}

function addressSummary(address, firstSegLength = 10, lastSegLength = 4, includeHex = true) {
  if (!address) return ''
  let checked = checksumAddress(address)
  if (!includeHex) {
    checked = stripHexPrefix(checked)
  }
  return checked ? `${checked.slice(0, firstSegLength)}...${checked.slice(checked.length - lastSegLength)}` : '...'
}

function miniAddressSummary(address) {
  if (!address) return ''
  const checked = checksumAddress(address)
  return checked ? `${checked.slice(0, 4)}...${checked.slice(-4)}` : '...'
}

function isValidAddress(address) {
  const prefixed = addHexPrefix(address)
  if (address === '0x0000000000000000000000000000000000000000') return false
  return (isAllOneCase(prefixed) && isValidAddressUtil(prefixed)) || isValidChecksumAddress(prefixed)
}

function isValidENSAddress(address) {
  return address.match(/^.{7,}\.(eth|test)$/)
}

function isInvalidChecksumAddress(address) {
  const prefixed = addHexPrefix(address)
  if (address === '0x0000000000000000000000000000000000000000') return false
  return !isAllOneCase(prefixed) && !isValidChecksumAddress(prefixed) && isValidAddressUtil(prefixed)
}

function isAllOneCase(address) {
  if (!address) return true
  const lower = address.toLowerCase()
  const upper = address.toUpperCase()
  return address === lower || address === upper
}

// Takes wei Hex, returns wei BN, even if input is null
function numericBalance(balance) {
  if (!balance) return new BN(0, 16)
  const stripped = stripHexPrefix(balance)
  return new BN(stripped, 16)
}

// Takes  hex, returns [beforeDecimal, afterDecimal]
function parseBalance(balance) {
  let afterDecimal
  const wei = numericBalance(balance)
  const weiString = wei.toString()
  const trailingZeros = /0+$/

  const beforeDecimal = weiString.length > 18 ? weiString.slice(0, -18) : '0'
  afterDecimal = `000000000000000000${wei}`.slice(-18).replace(trailingZeros, '')
  if (afterDecimal === '') {
    afterDecimal = '0'
  }
  return [beforeDecimal, afterDecimal]
}

// Takes wei hex, returns an object with three properties.
// Its "formatted" property is what we generally use to render values.
function formatBalance(balance, decimalsToKeep, needsParse = true, ticker = 'ETH') {
  const parsed = needsParse ? parseBalance(balance) : balance.split('.')
  const beforeDecimal = parsed[0]
  let afterDecimal = parsed[1]
  let formatted = 'None'
  if (decimalsToKeep === undefined) {
    if (beforeDecimal === '0') {
      if (afterDecimal !== '0') {
        const sigFigs = afterDecimal.match(/^0*(.{2})/) // default: grabs 2 most significant digits
        if (sigFigs) {
          afterDecimal = sigFigs[0]
        }
        formatted = `0.${afterDecimal} ${ticker}`
      }
    } else {
      formatted = `${beforeDecimal}.${afterDecimal.slice(0, 3)} ${ticker}`
    }
  } else {
    afterDecimal += new Array(decimalsToKeep).join('0')
    formatted = `${beforeDecimal}.${afterDecimal.slice(0, decimalsToKeep)} ${ticker}`
  }
  return formatted
}

function generateBalanceObject(formattedBalance, decimalsToKeep = 1) {
  let balance = formattedBalance.split(' ')[0]
  const label = formattedBalance.split(' ')[1]
  const beforeDecimal = balance.split('.')[0]
  const afterDecimal = balance.split('.')[1]
  const shortBalance = shortenBalance(balance, decimalsToKeep)

  if (beforeDecimal === '0' && afterDecimal.slice(0, 5) === '00000') {
    // eslint-disable-next-line eqeqeq
    if (afterDecimal == 0) {
      balance = '0'
    } else {
      balance = '<1.0e-5'
    }
  } else if (beforeDecimal !== '0') {
    balance = `${beforeDecimal}.${afterDecimal.slice(0, decimalsToKeep)}`
  }

  return { balance, label, shortBalance }
}

function shortenBalance(balance, decimalsToKeep = 1) {
  let truncatedValue
  const convertedBalance = Number.parseFloat(balance)
  if (convertedBalance > 1000000) {
    truncatedValue = (balance / 1000000).toFixed(decimalsToKeep)
    return `${truncatedValue}m`
  }
  if (convertedBalance > 1000) {
    truncatedValue = (balance / 1000).toFixed(decimalsToKeep)
    return `${truncatedValue}k`
  }
  if (convertedBalance === 0) {
    return '0'
  }
  if (convertedBalance < 0.001) {
    return '<0.001'
  }
  if (convertedBalance < 1) {
    const stringBalance = convertedBalance.toString()
    if (stringBalance.split('.')[1].length > 3) {
      return convertedBalance.toFixed(3)
    }
    return stringBalance
  }
  return convertedBalance.toFixed(decimalsToKeep)
}

function dataSize(data) {
  const size = data ? stripHexPrefix(data).length : 0
  return `${size} bytes`
}

// Takes a BN and an ethereum currency name,
// returns a BN in wei
function normalizeToWei(amount, currency) {
  try {
    return amount.mul(bnTable.wei).div(bnTable[currency])
  } catch {}
  return amount
}

function normalizeEthStringToWei(string) {
  const parts = string.split('.')
  let eth = new BN(parts[0], 10).mul(bnTable.wei)
  if (parts[1]) {
    let decimal = parts[1]
    while (decimal.length < 18) {
      decimal += '0'
    }
    if (decimal.length > 18) {
      decimal = decimal.slice(0, 18)
    }
    const decimalBN = new BN(decimal, 10)
    eth = eth.add(decimalBN)
  }
  return eth
}

const multiple = new BN('10000', 10)
function normalizeNumberToWei(n, currency) {
  const enlarged = n * 10000
  const amount = new BN(String(enlarged), 10)
  return normalizeToWei(amount, currency).div(multiple)
}

function readableDate(ms) {
  const date = new Date(ms)
  const month = date.getMonth()
  const day = date.getDate()
  const year = date.getFullYear()
  const hours = date.getHours()
  const minutes = `0${date.getMinutes()}`
  const seconds = `0${date.getSeconds()}`

  const dateString = `${month}/${day}/${year}`
  const time = `${hours}:${minutes.slice(-2)}:${seconds.slice(-2)}`
  return `${dateString} ${time}`
}

function isHex(string) {
  return Boolean(string.match(/^(0x)?[\dA-Fa-f]+$/))
}

function bnMultiplyByFraction(targetBN, numerator, denominator) {
  const numberBN = new BN(numerator)
  const denomBN = new BN(denominator)
  return targetBN.mul(numberBN).div(denomBN)
}

function getTxFeeBn(gas, gasPrice = MIN_GAS_PRICE_BN.toString(16)) {
  const gasBn = hexToBn(gas)
  const gasPriceBn = hexToBn(gasPrice)
  const txFeeBn = gasBn.mul(gasPriceBn)

  return txFeeBn.toString(16)
}

function getContractAtAddress(tokenAddress) {
  return global.eth.contract(abi).at(tokenAddress)
}

function exportAsFile(filename, data, type = 'text/csv') {
  // source: https://stackoverflow.com/a/33542499 by Ludovic Feltz
  const blob = new Blob([data], { type })
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveBlob(blob, filename)
  } else {
    const element = window.document.createElement('a')
    element.target = '_blank'
    element.href = window.URL.createObjectURL(blob)
    element.download = filename
    document.body.append(element)
    element.click()
    element.remove()
  }
}

function allNull(object) {
  return Object.entries(object).every(([_, value]) => value === null)
}

function getTokenAddressFromTokenObject(token) {
  return Object.values(token)[0].address.toLowerCase()
}

/**
 * Safely checksumms a potentially-null address
 *
 * @param {String} [address] - address to checksum
 * @returns {String} - checksummed address
 */
function checksumAddress(address) {
  return address ? toChecksumAddress(address) : ''
}

function addressSlicer(address = '') {
  if (address.length < 11) {
    return address
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export {
  valuesFor,
  addressSummary,
  miniAddressSummary,
  isAllOneCase,
  isValidAddress,
  isValidENSAddress,
  numericBalance,
  parseBalance,
  formatBalance,
  generateBalanceObject,
  dataSize,
  readableDate,
  normalizeToWei,
  normalizeEthStringToWei,
  normalizeNumberToWei,
  valueTable,
  bnTable,
  isHex,
  formatDate,
  bnMultiplyByFraction,
  getTxFeeBn,
  shortenBalance,
  getContractAtAddress,
  exportAsFile,
  isInvalidChecksumAddress,
  allNull,
  getTokenAddressFromTokenObject,
  checksumAddress,
  addressSlicer,
}
