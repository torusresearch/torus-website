<template>
  <div class="wallet-activity">
    <v-layout mt-3 wrap>
      <v-flex xs12 px-4 mb-4>
        <div class="text-black font-weight-bold headline float-left">{{ t('walletActivity.transactionActivities') }}</div>
        <div class="float-right" :class="$vuetify.breakpoint.xsOnly ? 'mt-4' : ''">
          <v-select
            id="transaction-selector"
            v-model="selectedAction"
            class="pt-0 mt-0 ml-2 subtitle-2 nav-selector transaction"
            height="25px"
            hide-details
            :menu-props="{ bottom: true, offsetY: true }"
            :items="actionTypes"
            append-icon="$vuetify.icons.select"
            aria-label="Filter Transacation Type"
          />
          <v-select
            id="period-selector"
            v-model="selectedPeriod"
            class="pt-0 mt-0 ml-2 subtitle-2 nav-selector period"
            height="25px"
            hide-details
            :menu-props="{ bottom: true, offsetY: true }"
            :items="periods"
            append-icon="$vuetify.icons.select"
            aria-label="Filter Transacation Period"
          />
        </div>
      </v-flex>
      <v-flex xs12 px-4 mb-4>
        <TxHistoryTable
          :selected-action="selectedAction"
          :selected-period="selectedPeriod"
          :loading-transactions="loadingPastTransactions || loadingOrders || loadingUserTransactions"
          :transactions="calculateFinalTransactions()"
        />
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import log from 'loglevel'
import { fromWei, isAddress, toBN, toChecksumAddress } from 'web3-utils'

import TxHistoryTable from '../../components/WalletHistory/TxHistoryTable'
import config from '../../config'
import torus from '../../torus'
import {
  ACTIVITY_ACTION_ALL,
  ACTIVITY_ACTION_RECEIVE,
  ACTIVITY_ACTION_SEND,
  ACTIVITY_ACTION_TOPUP,
  ACTIVITY_PERIOD_ALL,
  ACTIVITY_PERIOD_MONTH_ONE,
  ACTIVITY_PERIOD_MONTH_SIX,
  ACTIVITY_PERIOD_WEEK_ONE,
  ACTIVITY_STATUS_PENDING,
  ACTIVITY_STATUS_SUCCESSFUL,
  ACTIVITY_STATUS_UNSUCCESSFUL,
  COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM,
  CONTRACT_TYPE_ERC20,
  CONTRACT_TYPE_ERC721,
  TOKEN_METHOD_TRANSFER_FROM
} from '../../utils/enums'
import { patch } from '../../utils/httpHelpers'
import { addressSlicer, formatDate, getEtherScanHashLink, getEthTxStatus, significantDigits } from '../../utils/utils'

export default {
  name: 'WalletHistory',
  components: { TxHistoryTable },
  data() {
    return {
      supportedCurrencies: ['ETH', ...config.supportedCurrencies],
      pastOrders: [],
      selectedAction: ACTIVITY_ACTION_ALL,
      selectedPeriod: ACTIVITY_PERIOD_ALL,
      paymentTx: [],
      pastTx: [],
      loadingPastTransactions: true,
      loadingOrders: true
    }
  },
  computed: {
    loadingUserTransactions() {
      return this.$store.state.loadingUserTransactions
    },
    actionTypes() {
      return [
        {
          text: this.t(ACTIVITY_ACTION_ALL),
          value: ACTIVITY_ACTION_ALL
        },
        {
          text: this.t(ACTIVITY_ACTION_SEND),
          value: ACTIVITY_ACTION_SEND
        },
        {
          text: this.t(ACTIVITY_ACTION_RECEIVE),
          value: ACTIVITY_ACTION_RECEIVE
        },
        {
          text: this.t(ACTIVITY_ACTION_TOPUP),
          value: ACTIVITY_ACTION_TOPUP
        }
      ]
    },
    periods() {
      return [
        {
          text: this.t(ACTIVITY_PERIOD_ALL),
          value: ACTIVITY_PERIOD_ALL
        },
        {
          text: this.t(ACTIVITY_PERIOD_WEEK_ONE),
          value: ACTIVITY_PERIOD_WEEK_ONE
        },
        {
          text: this.t(ACTIVITY_PERIOD_MONTH_ONE),
          value: ACTIVITY_PERIOD_MONTH_ONE
        },
        {
          text: this.t(ACTIVITY_PERIOD_MONTH_SIX),
          value: ACTIVITY_PERIOD_MONTH_SIX
        }
      ]
    },
    totalPortfolioValue() {
      return this.$store.getters.tokenBalances.totalPortfolioValue || '0'
    },
    selectedCurrency() {
      return this.$store.state.selectedCurrency
    },
    getCurrencyMultiplier() {
      const { selectedCurrency, currencyData } = this.$store.state || {}
      let currencyMultiplier = 1
      if (selectedCurrency !== 'ETH') currencyMultiplier = currencyData[selectedCurrency.toLowerCase()] || 1
      return currencyMultiplier
    },
    wallets() {
      return Object.keys(this.$store.state.wallet).filter(accumulator => accumulator !== this.selectedAddress)
    },
    pastTransactions() {
      return this.$store.state.pastTransactions
    }
  },
  watch: {
    pastTransactions() {
      this.calculatePastTransactions()
    }
  },
  mounted() {
    this.calculatePaymentTransactions()
    this.calculatePastTransactions()
  },
  methods: {
    onCurrencyChange(value) {
      this.$store.dispatch('setSelectedCurrency', { selectedCurrency: value, origin: 'history' })
    },
    getStatusText(status) {
      switch (status) {
        case 'rejected':
        case 'denied':
        case 'unapproved':
        case 'failed':
          return ACTIVITY_STATUS_UNSUCCESSFUL
        case 'confirmed':
        case 'completed':
        case 'complete':
        case 'success':
          return ACTIVITY_STATUS_SUCCESSFUL
        case 'pending':
        case 'submitted':
        case 'processing':
          return ACTIVITY_STATUS_PENDING
        default:
          return ''
      }
    },
    getActionText(activity) {
      // Handling tx from common-api schema and /tx schema separately.
      if (activity.type_name === 'n/a' || activity.type === 'n/a') {
        return `${activity.action === ACTIVITY_ACTION_SEND ? this.t('walletActivity.sent') : this.t('walletActivity.received')} ${
          activity.type_name !== 'n/a' ? activity.type_name : activity.type.toUpperCase()
        }`
      }
      if (activity.type_name || activity.type) {
        return `${activity.action === ACTIVITY_ACTION_SEND ? this.t('walletActivity.sent') : this.t('walletActivity.received')} ${
          activity.type === 'eth' ? activity.type_name.toUpperCase() : activity.type_name
        }`
      }
      return `${`${this.t(activity.action)} ${activity.from}`} `
    },
    getIcon(activity) {
      if (activity.action === ACTIVITY_ACTION_TOPUP) {
        return `provider-${activity.from.toLowerCase()}.svg`
      }
      if (activity.action === ACTIVITY_ACTION_SEND || activity.action === ACTIVITY_ACTION_RECEIVE) {
        if (activity.type === CONTRACT_TYPE_ERC721) {
          return activity.type_image_link // will be an opensea image url
        }
        if (activity.type === CONTRACT_TYPE_ERC20) {
          return `logos/${activity.type_image_link === 'n/a' ? 'eth.svg' : activity.type_image_link}`
        }
        const action = activity.action.split('.')
        return action.length >= 1 ? `$vuetify.icons.coins_${activity.action.split('.')[1].toLowerCase()}` : ''
      }
      return ''
    },
    formatDate(date) {
      return formatDate(date)
    },
    formatTime(time) {
      return time.toTimeString().slice(0, 8)
    },
    calculateFinalTransactions() {
      let finalTx = this.paymentTx
      const { pastTx } = this
      const transactions = this.calculateTransactions()
      finalTx = [...transactions, ...finalTx, ...pastTx]
      finalTx = finalTx.reduce((accumulator, x) => {
        x.actionIcon = this.getIcon(x)
        x.actionText = this.getActionText(x)
        x.statusText = this.getStatusText(x.status)
        x.dateFormatted = this.formatDate(x.date)
        x.timeFormatted = this.formatTime(x.date)
        if (x.etherscanLink === '' || accumulator.findIndex(y => y.etherscanLink === x.etherscanLink) === -1) accumulator.push(x)
        return accumulator
      }, [])
      const sortedTx = finalTx.sort((a, b) => b.date - a.date) || []
      log.info('sorted tx is', sortedTx)
      // debugger
      return sortedTx
    },
    async calculatePastTransactions() {
      const { selectedAddress: publicAddress, pastTransactions, jwtToken, networkType } = this.$store.state
      const pastTx = []
      for (const x of pastTransactions) {
        // eslint-disable-next-line no-continue
        if (x.network !== networkType.host) continue
        let { status } = x
        if (
          x.status !== 'confirmed' &&
          !x.transaction_hash.includes('PENDING_') &&
          (publicAddress.toLowerCase() === x.from.toLowerCase() || publicAddress.toLowerCase() === x.to.toLowerCase())
        ) {
          // eslint-disable-next-line no-await-in-loop
          status = await getEthTxStatus(x.transaction_hash, torus.web3)
          if (publicAddress.toLowerCase() === x.from.toLowerCase()) this.patchTx(x, status, jwtToken)
        }
        let totalAmountString = ''
        if (x.type === CONTRACT_TYPE_ERC721) totalAmountString = x.symbol
        else if (x.type === CONTRACT_TYPE_ERC20) totalAmountString = `${significantDigits(parseFloat(x.total_amount))} ${x.symbol}`
        else totalAmountString = `${significantDigits(parseFloat(x.total_amount))} ETH`
        const currencyAmountString =
          x.type === CONTRACT_TYPE_ERC721 ? '' : `${significantDigits(parseFloat(x.currency_amount))} ${x.selected_currency}`
        const finalObject = {
          id: x.created_at.toString(),
          date: new Date(x.created_at),
          from: x.from,
          slicedFrom: addressSlicer(x.from),
          to: x.to,
          slicedTo: addressSlicer(x.to),
          action: this.wallets.includes(x.to) ? ACTIVITY_ACTION_RECEIVE : ACTIVITY_ACTION_SEND,
          totalAmount: x.total_amount,
          totalAmountString,
          currencyAmount: x.currency_amount,
          currencyAmountString,
          amount: `${totalAmountString} / ${currencyAmountString}`,
          status,
          etherscanLink: getEtherScanHashLink(x.transaction_hash, x.network),
          networkType: x.network,
          ethRate: `1 ${x.symbol} = ${significantDigits(parseFloat(x.currency_amount) / parseFloat(x.total_amount))}`,
          currencyUsed: x.selected_currency,
          type: x.type,
          type_name: x.type_name,
          type_image_link: x.type_image_link
        }
        pastTx.push(finalObject)
      }

      this.loadingPastTransactions = false
      this.pastTx = pastTx
    },
    calculateTransactions() {
      const { networkId, transactions, networkType, tokenRates, assets, selectedAddress } = this.$store.state || {}
      const finalTransactions = []
      for (const tx in transactions) {
        const txOld = transactions[tx]
        if (txOld.metamaskNetworkId.toString() === networkId.toString()) {
          const { methodParams, contractParams, txParams, transactionCategory } = txOld
          let amountTo
          let amountValue
          let totalAmountString
          let totalAmount
          let finalTo
          let tokenRate = 1

          if (contractParams.erc721) {
            // Handling cryptokitties
            if (contractParams.isSpecial) {
              ;[amountTo, amountValue] = methodParams || []
            } else {
              // Rest of the 721s
              ;[, amountTo, amountValue] = methodParams || []
            }

            const { name = '' } = contractParams

            // Get asset name of the 721
            const contract = assets[selectedAddress].find(x => x.name.toLowerCase() === name.toLowerCase()) || {}
            log.info(contract, amountValue)
            if (contract) {
              const assetObject = contract.assets.find(x => x.tokenId.toString() === amountValue.value.toString()) || {}
              log.info(assetObject)
              totalAmountString = (assetObject && assetObject.name) || ''
              finalTo = amountTo && isAddress(amountTo.value) && toChecksumAddress(amountTo.value)
            }
          } else if (contractParams.erc20) {
            // ERC20 transfer
            tokenRate = contractParams.erc20 ? tokenRates[txParams.to] : 1
            if (methodParams && Array.isArray(methodParams)) {
              if (transactionCategory === TOKEN_METHOD_TRANSFER_FROM || transactionCategory === COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM) {
                ;[, amountTo, amountValue] = methodParams || []
              } else {
                ;[amountTo, amountValue] = methodParams || []
              }
            }
            totalAmount = amountValue && amountValue.value ? fromWei(toBN(amountValue.value)) : fromWei(toBN(txParams.value))
            totalAmountString = `${significantDigits(parseFloat(totalAmount))} ${contractParams.symbol}`
            finalTo = amountTo && isAddress(amountTo.value) && toChecksumAddress(amountTo.value)
          } else {
            tokenRate = 1
            totalAmount = fromWei(toBN(txParams.value))
            totalAmountString = `${significantDigits(parseFloat(totalAmount))} ETH`
            finalTo = toChecksumAddress(txOld.txParams.to)
          }
          const txObject = {}
          txObject.id = txOld.time.toString()
          txObject.action = this.wallets.includes(txOld.txParams.to) ? ACTIVITY_ACTION_RECEIVE : ACTIVITY_ACTION_SEND
          txObject.date = new Date(txOld.time)
          txObject.from = toChecksumAddress(txOld.txParams.from)
          txObject.slicedFrom = addressSlicer(txOld.txParams.from)
          txObject.to = finalTo
          txObject.slicedTo = addressSlicer(finalTo)
          txObject.totalAmount = totalAmount
          txObject.totalAmountString = totalAmountString
          txObject.currencyAmount = this.getCurrencyMultiplier * txObject.totalAmount * tokenRate
          txObject.currencyAmountString = contractParams.erc721 ? '' : `${significantDigits(txObject.currencyAmount)} ${this.selectedCurrency}`
          txObject.amount = `${txObject.totalAmountString} / ${txObject.currencyAmountString}`
          txObject.status = txOld.status
          txObject.etherscanLink = getEtherScanHashLink(txOld.hash, networkType.host)
          txObject.networkType = networkType.host
          txObject.ethRate = `1 ${(contractParams && contractParams.symbol) || 'ETH'} = ${significantDigits(
            parseFloat(txObject.currencyAmount) / parseFloat(txObject.totalAmount)
          )}`
          txObject.currencyUsed = this.selectedCurrency
          txObject.type = 'eth'
          if (contractParams && contractParams.erc20) txObject.type = 'erc20'
          else if (contractParams && contractParams.erc721) txObject.type = 'erc721'
          txObject.type_name = contractParams && contractParams.name ? contractParams.name : 'n/a'
          txObject.type_image_link = contractParams && contractParams.logo ? contractParams.logo : 'n/a'
          finalTransactions.push(txObject)
        }
      }
      return finalTransactions
    },
    calculatePaymentTransactions() {
      const { paymentTx: response } = this.$store.state || {}
      this.paymentTx = response.reduce((accumulator, x) => {
        let action = ''
        if (ACTIVITY_ACTION_TOPUP.includes(x.action.toLowerCase())) action = ACTIVITY_ACTION_TOPUP
        else if (ACTIVITY_ACTION_SEND.includes(x.action.toLowerCase())) action = ACTIVITY_ACTION_SEND
        else if (ACTIVITY_ACTION_RECEIVE.includes(x.action.toLowerCase())) action = ACTIVITY_ACTION_RECEIVE

        accumulator.push({
          id: x.id,
          date: new Date(x.date),
          from: x.from,
          slicedFrom: x.slicedFrom,
          action,
          to: x.to,
          slicedTo: x.slicedTo,
          totalAmount: x.totalAmount,
          totalAmountString: x.totalAmountString,
          currencyAmount: x.currencyAmount,
          currencyAmountString: x.currencyAmountString,
          amount: x.amount,
          ethRate: x.ethRate,
          status: x.status.toLowerCase(),
          etherscanLink: x.etherscanLink || '',
          currencyUsed: x.currencyUsed
        })

        return accumulator
        // }
      }, [])
      this.loadingOrders = false
    },
    patchTx(x, status, jwtToken) {
      // patch tx
      // console.log(x)
      const transactionsAPI = `${config.api}/transaction${x.relayer ? 'SCW' : ''}`

      patch(
        transactionsAPI,
        {
          id: x.id,
          status
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json; charset=utf-8'
          }
        }
      )
        .then(response => log.info('successfully patched', response))
        .catch(error => log.error('unable to patch tx', error))
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'WalletHistory.scss';
</style>
