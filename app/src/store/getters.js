import { hexToNumberString } from 'web3-utils'
import { MAINNET } from '../utils/enums'
import { formatCurrencyNumber, significantDigits } from '../utils/utils'

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
  let currencyMultiplier = 1
  if (selectedCurrency !== 'ETH') currencyMultiplier = currencyData[selectedCurrency.toLowerCase()] || 1
  let full = [
    {
      balance: weiBalance[selectedAddress],
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
  let totalPortfolioValue = 0
  const finalBalancesArray = full.map(x => {
    const computedBalance = parseFloat(hexToNumberString(x.balance)) / 10 ** parseFloat(x.decimals) || 0
    let tokenRateMultiplier = 1
    if (x.tokenAddress !== '0x') tokenRateMultiplier = tokenRates[x.tokenAddress.toLowerCase()] || 0
    const currencyRate = currencyMultiplier * tokenRateMultiplier
    let currencyBalance = significantDigits(computedBalance * currencyRate || 0, false, 3)
    totalPortfolioValue += currencyBalance
    if (selectedCurrency !== 'ETH') currencyBalance = formatCurrencyNumber(currencyBalance)
    return {
      ...x,
      id: x.symbol,
      computedBalance: computedBalance,
      formattedBalance: `${x.symbol} ${significantDigits(computedBalance || 0, false, 3)}`,
      currencyBalance: `${selectedCurrency} ${currencyBalance}`,
      currencyRateText: `1 ${x.symbol} = ${significantDigits(currencyRate || 0)} ${selectedCurrency}`
    }
  })
  totalPortfolioValue = significantDigits(totalPortfolioValue, false, 3) || 0
  if (selectedCurrency !== 'ETH') totalPortfolioValue = formatCurrencyNumber(totalPortfolioValue)
  return { finalBalancesArray, totalPortfolioValue }
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
