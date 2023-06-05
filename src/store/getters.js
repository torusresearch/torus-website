import BigNumber from 'bignumber.js'

import fallBackLogoLight from '../assets/images/exchangaweb3-logo-dark.svg'
import fallBackLogoDark from '../assets/images/exchangaweb3-logo-light.svg'
import fallBackIconDark from '../assets/img/icons/torus-icon-light.svg'
import config from '../config'
import { ETH, SUPPORTED_NETWORK_TYPES, THEME_DARK_BLACK_NAME, THEME_LIGHT_BLUE_NAME } from '../utils/enums'
import { significantDigits } from '../utils/utils'

const getLogo = (state) => {
  const { whiteLabel, theme } = state
  const { logoDark, logoLight, isActive } = whiteLabel
  let finalLogo = theme === THEME_DARK_BLACK_NAME ? fallBackLogoLight : fallBackLogoDark
  let isExternal = false
  if (isActive) {
    if (theme === THEME_DARK_BLACK_NAME && logoLight) {
      finalLogo = logoLight
      isExternal = true
    }
    if (theme === THEME_LIGHT_BLUE_NAME && logoDark) {
      finalLogo = logoDark
      isExternal = true
    }
  }
  return { logo: finalLogo, isExternal }
}

const getIcon = (state) => {
  const { whiteLabel } = state
  const { logoLight, isActive } = whiteLabel
  const finalLogo = logoLight || fallBackIconDark
  const isExternal = isActive && logoLight
  return { logo: finalLogo, isExternal }
}

const unApprovedTransactions = (state) => {
  const transactions = []
  for (const id in state.transactions) {
    if (state.transactions[id].status === 'unapproved') {
      transactions.push(state.transactions[id])
    }
  }
  return transactions
}

const currencyMultiplier = (state) => {
  const currencyMultiplierNumber =
    state.selectedCurrency === state.networkType.ticker ? 1 : state.currencyData[state.selectedCurrency.toLowerCase()] || 1
  return new BigNumber(currencyMultiplierNumber)
}

const tokenBalances = (state) => {
  const { finalBalancesArray, totalPortfolioValueReturn } = calculateBalances(state, state.selectedAddress)
  return { finalBalancesArray, totalPortfolioValue: totalPortfolioValueReturn }
}

const collectibleBalances = (state) => {
  const { assets, selectedAddress } = state || {}
  return assets[selectedAddress] || []
}

const walletBalances = (state) => {
  const walletsFinal = Object.keys(state.wallet).reduce((accts, y) => {
    const { finalBalancesArray, totalPortfolioValueReturn } = calculateBalances(state, y)
    const { accountType } = state.wallet[y]
    accts.push({ address: y, accountType, finalBalancesArray, totalPortfolioValue: totalPortfolioValueReturn })
    return accts
  }, [])

  return walletsFinal
}

const loginButtonsArray = (state) => {
  const loginButtons = Object.entries(state.embedState.loginConfig)
    .reduce((newArray, [key, value]) => {
      value.verifier = key
      value.name = value.name || value.typeOfLogin
      if (value.showOnModal) newArray.push(value)
      return newArray
    }, [])
    .sort((a, b) => {
      const aPriority = a.priority >= 0 ? a.priority : 99
      const bPriority = b.priority >= 0 ? b.priority : 99
      return aPriority - bPriority
    })

  return loginButtons
}

const supportedCurrencies = (state) => {
  const returnArr = config.supportedCurrencies
  const { ticker } = state.networkType
  if (ticker !== 'ETH') {
    const findTicker = returnArr.indexOf(ticker)
    // make sure network ticker is on first of list if already existing
    if (findTicker >= 0) returnArr.splice(findTicker, 1)
    returnArr.unshift(ticker)
  }
  return returnArr
}

const filteredContacts = (state) =>
  state.contacts.filter((contact) => {
    if (config.ethTransferOnly) {
      if (contact.verifier === ETH) return true
    } else {
      return true
    }
    return false
  })

function calculateBalances(state, y) {
  const { weiBalance, tokenData: tokenDataState, tokenRates: tokenRatesState, selectedCurrency, networkType } = state || {}
  const tokenData = tokenDataState
  const tokenRates = tokenRatesState
  const formatter = selectedCurrency === networkType.ticker ? 3 : 2
  let full = []
  if (!networkType?.isErc20) {
    full.push({
      balance: weiBalance[y] || '0',
      decimals: 18,
      erc20: false,
      logo: networkType.logo,
      name: networkType.tickerName || '',
      symbol: networkType.ticker,
      tokenAddress: '0x',
    })
  }
  if (tokenData && tokenData[y] && Object.keys(tokenData[y]).length > 0) {
    full = [...full, ...tokenData[y].filter((x) => x.network === networkType.host)]
  }
  let totalPortfolioValue = new BigNumber(0)

  const finalBalancesArray = full.map((x) => {
    const computedBalance = new BigNumber(x.balance).dividedBy(new BigNumber(10).pow(new BigNumber(x.decimals))) || new BigNumber(0)
    let tokenRateMultiplierNumber = 1
    if (x.tokenAddress !== '0x') tokenRateMultiplierNumber = tokenRates[x.tokenAddress.toLowerCase()] || 0
    const tokenRateMultiplier = new BigNumber(tokenRateMultiplierNumber)
    const currencyRate = currencyMultiplier(state).times(tokenRateMultiplier)
    const currencyBalance = computedBalance.times(currencyRate) || new BigNumber(0)
    totalPortfolioValue = totalPortfolioValue.plus(currencyBalance)
    return {
      ...x,
      id: x.symbol,
      computedBalance,
      computedBalanceRounded: significantDigits(computedBalance, false, formatter + 1),
      formattedBalance: `${x.symbol} ${significantDigits(computedBalance, false, formatter + 1)}`,
      currencyBalanceRounded: significantDigits(currencyBalance, false, formatter + 1),
      currencyBalance: `${selectedCurrency} ${significantDigits(currencyBalance, false, formatter + 1)}`,
      currencyRateText: `1 ${x.symbol} = ${currencyRate.toFormat(formatter)} ${selectedCurrency}`,
    }
  })
  const totalPortfolioValueReturn = significantDigits(totalPortfolioValue, false, formatter + 1)
  return { finalBalancesArray, totalPortfolioValueReturn }
}

const userDapps = (state) => state.userDapps

const supportedNetworks = (state) => ({ ...state.customNetworks, ...SUPPORTED_NETWORK_TYPES })

export default {
  unApprovedTransactions,
  tokenBalances,
  collectibleBalances,
  walletBalances,
  currencyMultiplier,
  loginButtonsArray,
  getLogo,
  getIcon,
  supportedCurrencies,
  filteredContacts,
  userDapps,
  supportedNetworks,
}
