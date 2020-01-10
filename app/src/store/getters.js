import { MAINNET } from '../utils/enums'
import { significantDigits } from '../utils/utils'
import BigNumber from 'bignumber.js'

const unApprovedTransactions = state => {
  const transactions = []
  for (let id in state.transactions) {
    if (state.transactions[id].status === 'unapproved') {
      transactions.push(state.transactions[id])
    }
  }
  return transactions
}
const tokenBalances = state => {
  let { weiBalance, tokenData, tokenRates, currencyData, selectedCurrency, networkType, selectedAddress } = state || {}
  if (networkType.host !== MAINNET) {
    tokenData = {}
    tokenRates = {}
  }
  let currencyMultiplierNum = 1
  const formatter = selectedCurrency !== 'ETH' ? 2 : 3
  if (selectedCurrency !== 'ETH') currencyMultiplierNum = currencyData[selectedCurrency.toLowerCase()] || 1
  const currencyMultiplier = new BigNumber(currencyMultiplierNum)
  let full = [
    {
      balance: weiBalance[selectedAddress] || '0',
      decimals: 18,
      erc20: false,
      logo: 'eth.svg',
      name: 'Ethereum',
      symbol: 'ETH',
      tokenAddress: '0x'
    }
  ]
  // because vue/babel is stupid
  if (tokenData && tokenData[selectedAddress] && Object.keys(tokenData[selectedAddress]).length > 0) {
    full = [...full, ...tokenData[selectedAddress]]
  }
  let totalPortfolioValue = new BigNumber(0)
  const finalBalancesArray = full.map(x => {
    const computedBalance = new BigNumber(x.balance).dividedBy(new BigNumber(10).pow(new BigNumber(x.decimals))) || new BigNumber(0)
    let tokenRateMultiplierNum = 1
    if (x.tokenAddress !== '0x') tokenRateMultiplierNum = tokenRates[x.tokenAddress.toLowerCase()] || 0
    const tokenRateMultiplier = new BigNumber(tokenRateMultiplierNum)
    const currencyRate = currencyMultiplier.times(tokenRateMultiplier)
    let currencyBalance = computedBalance.times(currencyRate) || new BigNumber(0)
    totalPortfolioValue = totalPortfolioValue.plus(currencyBalance)
    return {
      ...x,
      id: x.symbol,
      computedBalance: computedBalance,
      formattedBalance: `${x.symbol} ${significantDigits(computedBalance, false, formatter + 1)}`,
      currencyBalance: `${selectedCurrency} ${significantDigits(currencyBalance, false, formatter + 1)}`,
      currencyRateText: `1 ${x.symbol} = ${currencyRate.toFormat(formatter)} ${selectedCurrency}`
    }
  })
  const totalPortfolioValueReturn = significantDigits(totalPortfolioValue, false, formatter + 1)
  return { finalBalancesArray, totalPortfolioValue: totalPortfolioValueReturn }
}

const collectibleBalances = state => {
  let { networkType, assets, selectedAddress } = state || {}
  if (networkType.host !== MAINNET) {
    assets[selectedAddress] = []
  }
  return assets[selectedAddress] || []
}

export default {
  unApprovedTransactions,
  tokenBalances,
  collectibleBalances
}
