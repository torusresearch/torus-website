<template>
  <div class="wallet-activity">
    <v-layout mt-3 wrap>
      <v-flex xs12 px-4 mb-4>
        <div class="text-black font-weight-bold headline float-left">{{ t('walletActivity.transactionActivities') }}</div>
        <div class="float-right" :class="$vuetify.breakpoint.xsOnly ? 'mt-4' : ''">
          <v-select
            id="transaction-selector"
            class="pt-0 mt-0 ml-2 subtitle-2 nav-selector transaction"
            height="25px"
            hide-details
            :menu-props="{ bottom: true, offsetY: true }"
            :items="actionTypes"
            v-model="selectedAction"
            append-icon="$vuetify.icons.select"
            aria-label="Filter Transacation Type"
          />
          <v-select
            id="period-selector"
            class="pt-0 mt-0 ml-2 subtitle-2 nav-selector period"
            height="25px"
            hide-details
            :menu-props="{ bottom: true, offsetY: true }"
            :items="periods"
            v-model="selectedPeriod"
            append-icon="$vuetify.icons.select"
            aria-label="Filter Transacation Period"
          />
        </div>
      </v-flex>
      <v-flex xs12 px-4 mb-4>
        <tx-history-table :selectedAction="selectedAction" :selectedPeriod="selectedPeriod" :transactions="calculateFinalTransactions()" />
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
// The color of dropdown icon requires half day work in modifying v-select
import log from 'loglevel'
import { toChecksumAddress, toBN, fromWei } from 'web3-utils'
import config from '../../config'
import TxHistoryTable from '../../components/WalletHistory/TxHistoryTable'
import { getPastOrders } from '../../plugins/simplex'
import { addressSlicer, significantDigits, getEtherScanHashLink, getStatus, getEthTxStatus, formatDate } from '../../utils/utils'
import torus from '../../torus'
import { patch } from '../../utils/httpHelpers'
import {
  WYRE,
  ACTIVITY_ACTION_ALL,
  ACTIVITY_ACTION_SEND,
  ACTIVITY_ACTION_RECEIVE,
  ACTIVITY_ACTION_TOPUP,
  ACTIVITY_PERIOD_ALL,
  ACTIVITY_PERIOD_WEEK_ONE,
  ACTIVITY_PERIOD_MONTH_ONE,
  ACTIVITY_PERIOD_MONTH_SIX,
  ACTIVITY_STATUS_SUCCESSFUL,
  ACTIVITY_STATUS_UNSUCCESSFUL,
  SUPPORTED_NETWORK_TYPES,
  ACTIVITY_STATUS_PENDING,
  CONTRACT_TYPE_ERC721,
  CONTRACT_TYPE_ERC20
} from '../../utils/enums'

export default {
  name: 'walletHistory',
  components: { TxHistoryTable },
  data() {
    return {
      supportedCurrencies: ['ETH', ...config.supportedCurrencies],
      pastOrders: [],
      selectedAction: ACTIVITY_ACTION_ALL,
      selectedPeriod: ACTIVITY_PERIOD_ALL,
      paymentTx: [],
      pastTx: []
    }
  },
  computed: {
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
      return Object.keys(this.$store.state.wallet).filter(acc => acc !== this.selectedAddress)
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
      return activity.type_name === 'n/a' || activity.type === 'n/a'
        ? `${activity.action === ACTIVITY_ACTION_SEND ? this.t('walletActivity.sent') : this.t('walletActivity.received')} ${
            activity.type_name !== 'n/a' ? activity.type_name : activity.type.toUpperCase()
          }`
        : activity.type_name || activity.type
        ? `${activity.action === ACTIVITY_ACTION_SEND ? this.t('walletActivity.sent') : this.t('walletActivity.received')} ${activity.type_name}`
        : `${this.t(activity.action) + ' ' + activity.from} `
    },
    getIcon(activity) {
      if (activity.action === ACTIVITY_ACTION_TOPUP) {
        return `provider-${activity.from.toLowerCase()}.svg`
      } else if (activity.action === ACTIVITY_ACTION_SEND || activity.action === ACTIVITY_ACTION_RECEIVE) {
        if (activity.type === CONTRACT_TYPE_ERC721) {
          return activity.type_image_link // will be an opensea image url
        } else if (activity.type === CONTRACT_TYPE_ERC20) {
          return `logos/${activity.type_image_link}`
        } else {
          return `$vuetify.icons.coins_${activity.action.split('.')[1].toLowerCase()}`
        }
      }
    },
    formatDate(date) {
      return formatDate(date)
    },
    formatTime(time) {
      return time.toTimeString().substring(0, 8)
    },
    calculateFinalTransactions() {
      let finalTx = this.paymentTx
      const pastTx = this.pastTx
      const transactions = this.calculateTransactions()
      finalTx = [...transactions, ...finalTx, ...pastTx]
      finalTx = finalTx.reduce((acc, x) => {
        x.actionIcon = this.getIcon(x)
        x.actionText = this.getActionText(x)
        x.statusText = this.getStatusText(x.status)
        x.dateFormatted = this.formatDate(x.date)
        x.timeFormatted = this.formatTime(x.date)
        if (x.etherscanLink === '' || acc.findIndex(y => y.etherscanLink === x.etherscanLink) === -1) acc.push(x)
        return acc
      }, [])
      const sortedTx = finalTx.sort((a, b) => b.date - a.date) || []
      // log.info('sorted tx is', sortedTx)
      return sortedTx
    },
    async calculatePastTransactions() {
      const { selectedAddress: publicAddress, pastTransactions, jwtToken, networkType } = this.$store.state
      const pastTx = []
      for (let index = 0; index < pastTransactions.length; index++) {
        const x = pastTransactions[index]
        if (x.network !== networkType.host) continue
        let status = x.status
        if (
          x.status !== 'confirmed' &&
          (publicAddress.toLowerCase() === x.from.toLowerCase() || publicAddress.toLowerCase() === x.to.toLowerCase())
        ) {
          status = await getEthTxStatus(x.transaction_hash, torus.web3)
          if (publicAddress.toLowerCase() === x.from.toLowerCase()) this.patchTx(x, status, jwtToken)
        }
        const totalAmountString = x.type === CONTRACT_TYPE_ERC721 ? x.type_name : `${significantDigits(parseFloat(x.total_amount))} ETH`
        const currencyAmountString = `${significantDigits(parseFloat(x.currency_amount))} ${x.selected_currency}`
        const finalObj = {
          id: x.created_at.toString(),
          date: new Date(x.created_at),
          from: x.from,
          slicedFrom: addressSlicer(x.from),
          to: x.to,
          slicedTo: addressSlicer(x.to),
          action: this.wallets.indexOf(x.to) >= 0 ? ACTIVITY_ACTION_RECEIVE : ACTIVITY_ACTION_SEND,
          totalAmount: x.total_amount,
          totalAmountString: totalAmountString,
          currencyAmount: x.currency_amount,
          currencyAmountString: currencyAmountString,
          amount: `${totalAmountString} / ${currencyAmountString}`,
          status: status,
          etherscanLink: getEtherScanHashLink(x.transaction_hash, x.network),
          networkType: x.network,
          ethRate: significantDigits(parseFloat(x.currency_amount) / parseFloat(x.total_amount)),
          currencyUsed: x.selected_currency,
          type: x.type,
          type_name: x.type_name,
          type_image_link: x.type_image_link
        }
        pastTx.push(finalObj)
      }
      console.log(pastTx)
      this.pastTx = pastTx
    },
    calculateTransactions() {
      const { networkId, transactions, networkType } = this.$store.state || {}
      const finalTransactions = []
      for (let tx in transactions) {
        const txOld = transactions[tx]
        if (txOld.metamaskNetworkId.toString() === networkId.toString()) {
          const txObj = {}
          txObj.id = txOld.time.toString()
          txObj.action = this.wallets.indexOf(txOld.txParams.to) >= 0 ? ACTIVITY_ACTION_RECEIVE : ACTIVITY_ACTION_SEND
          txObj.date = new Date(txOld.time)
          txObj.from = toChecksumAddress(txOld.txParams.from)
          txObj.slicedFrom = addressSlicer(txOld.txParams.from)
          txObj.to = toChecksumAddress(txOld.txParams.to)
          txObj.slicedTo = addressSlicer(txOld.txParams.to)
          txObj.totalAmount = fromWei(toBN(txOld.txParams.value).add(toBN(txOld.txParams.gas).mul(toBN(txOld.txParams.gasPrice))))
          txObj.totalAmountString = `${significantDigits(txObj.totalAmount)} ETH`
          txObj.currencyAmount = this.getCurrencyMultiplier * txObj.totalAmount
          txObj.currencyAmountString = `${significantDigits(txObj.currencyAmount)} ${this.selectedCurrency}`
          txObj.amount = `${txObj.totalAmountString} / ${txObj.currencyAmountString}`
          txObj.status = txOld.status
          txObj.etherscanLink = getEtherScanHashLink(txOld.hash, networkType.host)
          txObj.networkType = networkType.host
          txObj.ethRate = significantDigits(parseFloat(txObj.currencyAmount) / parseFloat(txObj.totalAmount))
          txObj.currencyUsed = this.selectedCurrency
          finalTransactions.push(txObj)
        }
      }
      return finalTransactions
    },
    patchTx(x, status, jwtToken) {
      // patch tx
      patch(
        `${config.api}/transaction`,
        {
          id: x.id,
          status: status
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json; charset=utf-8'
          }
        }
      )
        .then(response => log.info('successfully patched', response))
        .catch(err => log.error('unable to patch tx', err))
    }
  },
  mounted() {
    const { selectedAddress: publicAddress, jwtToken } = this.$store.state
    getPastOrders(
      {},
      {
        Authorization: `Bearer ${jwtToken}`
      }
    )
      .then(response => {
        this.paymentTx = response.data.reduce((acc, x) => {
          let action = ''
          if (ACTIVITY_ACTION_TOPUP.indexOf(x.action.toLowerCase()) > -1) action = ACTIVITY_ACTION_TOPUP
          else if (ACTIVITY_ACTION_SEND.indexOf(x.action.toLowerCase()) > -1) action = ACTIVITY_ACTION_SEND
          else if (ACTIVITY_ACTION_RECEIVE.indexOf(x.action.toLowerCase()) > -1) action = ACTIVITY_ACTION_RECEIVE

          acc.push({
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

          return acc
          // }
        }, [])
      })
      .catch(err => log.error(err))
    this.calculatePastTransactions()
  }
}
</script>

<style lang="scss" scoped>
@import 'WalletHistory.scss';
</style>
