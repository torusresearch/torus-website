/* eslint-disable no-restricted-syntax */
import BigNumber from 'bignumber.js'

import { MAINNET } from '../utils/enums'
import { significantDigits } from '../utils/utils'

const unApprovedTransactions = (state) => {
  const transactions = []
  for (const id in state.transactions) {
    if (state.transactions[id].status === 'unapproved') {
      transactions.push(state.transactions[id])
    }
  }
  return transactions
}
const tokenBalances = (state) => {
  const { weiBalance, tokenData: tokenDataState, tokenRates: tokenRatesState, currencyData, selectedCurrency, networkType, selectedAddress } =
    state || {}
  let tokenData = tokenDataState
  let tokenRates = tokenRatesState
  if (networkType.host !== MAINNET) {
    tokenData = {}
    tokenRates = {}
  }
  let currencyMultiplierNumber = 1
  const formatter = selectedCurrency !== 'ETH' ? 2 : 3
  if (selectedCurrency !== 'ETH') currencyMultiplierNumber = currencyData[selectedCurrency.toLowerCase()] || 1
  const currencyMultiplier = new BigNumber(currencyMultiplierNumber)
  let full = [
    {
      balance: weiBalance[selectedAddress] || '0',
      decimals: 18,
      erc20: false,
      logo: 'eth.svg',
      name: 'Ethereum',
      symbol: 'ETH',
      tokenAddress: '0x',
    },
  ]
  // because vue/babel is stupid
  if (tokenData && tokenData[selectedAddress] && Object.keys(tokenData[selectedAddress]).length > 0) {
    full = [...full, ...tokenData[selectedAddress]]
  }
  let totalPortfolioValue = new BigNumber(0)
  const finalBalancesArray = full.map((x) => {
    const computedBalance = new BigNumber(x.balance).dividedBy(new BigNumber(10).pow(new BigNumber(x.decimals))) || new BigNumber(0)
    let tokenRateMultiplierNumber = 1
    if (x.tokenAddress !== '0x') tokenRateMultiplierNumber = tokenRates[x.tokenAddress.toLowerCase()] || 0
    const tokenRateMultiplier = new BigNumber(tokenRateMultiplierNumber)
    const currencyRate = currencyMultiplier.times(tokenRateMultiplier)
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
  return { finalBalancesArray, totalPortfolioValue: totalPortfolioValueReturn }
}

const collectibleBalances = (state) => {
  const { networkType, assets, selectedAddress } = state || {}
  if (networkType.host !== MAINNET) {
    assets[selectedAddress] = []
  }
  return assets[selectedAddress] || []
}

const currencyMultiplier = (state) => {
  const currencyMultiplierNumber = state.selectedCurrency !== 'ETH' ? state.currencyData[state.selectedCurrency.toLowerCase()] || 1 : 1
  return new BigNumber(currencyMultiplierNumber)
}

const walletBalances = (state) => {
  const walletsFinal = Object.keys(state.wallet).reduce((accts, x) => {
    const computedBalance = new BigNumber(state.weiBalance[x]).dividedBy(new BigNumber(10).pow(new BigNumber(18))) || new BigNumber(0)
    const tokenRateMultiplier = new BigNumber(1)
    const currencyRate = new BigNumber(currencyMultiplier(state)).times(tokenRateMultiplier)
    const currencyBalance = computedBalance.times(currencyRate) || new BigNumber(0)

    if (typeof state.wallet[x] === 'string') {
      accts.push({ address: x, balance: `${significantDigits(currencyBalance, false, 3)} ${state.selectedCurrency}` })
    } else {
      accts.push({ address: x, balance: `${significantDigits(currencyBalance, false, 3)} ${state.selectedCurrency}`, ...state.wallet[x] })
    }

    return accts
  }, [])

  return walletsFinal
}

export default {
  unApprovedTransactions,
  tokenBalances,
  collectibleBalances,
  walletBalances,
  currencyMultiplier,
}
