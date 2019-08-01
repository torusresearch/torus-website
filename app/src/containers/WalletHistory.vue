<template>
  <div>
    <v-layout mt-6 wrap>
      <v-flex xs12 px-4 mb-4>
        <div class="text-black font-weight-bold headline float-left">Transaction Activities</div>
        <div class="float-right" :class="$vuetify.breakpoint.xsOnly ? 'mt-4' : ''">
          <v-select
            class="pt-0 mt-0 ml-2 subtitle-2 nav-selector transaction"
            height="25px"
            hide-details
            :items="actionTypes"
            v-model="selectedAction"
            append-icon="$vuetify.icons.select"
          />
          <v-select
            class="pt-0 mt-0 ml-2 subtitle-2 nav-selector period"
            height="25px"
            hide-details
            :items="periods"
            v-model="selectedPeriod"
            append-icon="$vuetify.icons.select"
          />
        </div>
      </v-flex>
      <v-flex xs12 px-4 mb-4>
        <tx-history-table
          v-if="!$vuetify.breakpoint.xsOnly"
          :headers="headers"
          :selectedAction="selectedAction"
          :selectedPeriod="selectedPeriod"
          :transactions="getTransactions()"
        />
        <tx-history-table-mobile
          v-if="$vuetify.breakpoint.xsOnly"
          :headers="headers"
          :selectedAction="selectedAction"
          :selectedPeriod="selectedPeriod"
          :transactions="getTransactions()"
        />
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
// The color of dropdown icon requires half day work in modifying v-select
import log from 'loglevel'
import config from '../config'
import TxHistoryTable from '../components/TxHistoryTable.vue'
import TxHistoryTableMobile from '../components/TxHistoryTableMobile.vue'
import { getPastOrders } from '../plugins/simplex'
import { addressSlicer, significantDigits, getEtherScanHashLink, getStatus, getEthTxStatus } from '../utils/utils'
import torus from '../torus'
import { patch } from '../utils/httpHelpers'
const web3Utils = torus.web3.utils

export default {
  name: 'walletHistory',
  components: { TxHistoryTable, TxHistoryTableMobile },
  data() {
    return {
      supportedCurrencies: ['ETH', ...config.supportedCurrencies],
      headers: [
        {
          text: 'Date',
          align: 'left',
          value: 'date'
        },
        { text: 'From', value: 'slicedFrom', align: 'center' },
        { text: 'To', value: 'slicedTo', align: 'center' },
        { text: 'Amount', value: 'totalAmountString', align: 'center' },
        { text: 'Value', value: 'currencyAmountString', align: 'center' },
        { text: 'Status', value: 'status', align: 'center' }
      ],
      pastOrders: [],
      actionTypes: ['All Transactions', 'Top-up', 'Sending', 'Received'],
      selectedAction: 'All Transactions',
      periods: ['Period', 'Last Week', 'Last Month'],
      selectedPeriod: 'Period',
      pastTx: []
    }
  },
  computed: {
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
    }
  },
  methods: {
    onSelectType() {},
    onSelectPeriod() {},
    onCurrencyChange(value) {
      this.$store.dispatch('setSelectedCurrency', { selectedCurrency: value })
    },
    getTransactions() {
      const { networkId, transactions, networkType } = this.$store.state || {}
      const finalTransactions = []
      for (let tx in transactions) {
        const txOld = transactions[tx]
        if (txOld.metamaskNetworkId.toString() === networkId.toString()) {
          const txObj = {}
          txObj.id = txOld.time
          txObj.action = this.wallets.indexOf(txOld.txParams.to) >= 0 ? 'Received' : 'Sending'
          txObj.date = new Date(txOld.time)
          txObj.from = txOld.txParams.from
          txObj.slicedFrom = addressSlicer(txOld.txParams.from)
          txObj.to = txOld.txParams.to
          txObj.slicedTo = addressSlicer(txOld.txParams.to)
          txObj.totalAmount = web3Utils.fromWei(
            web3Utils.toBN(txOld.txParams.value).add(web3Utils.toBN(txOld.txParams.gas).mul(web3Utils.toBN(txOld.txParams.gasPrice)))
          )
          txObj.totalAmountString = `${significantDigits(txObj.totalAmount)} ETH`
          txObj.currencyAmount = this.getCurrencyMultiplier * txObj.totalAmount
          txObj.currencyAmountString = `${significantDigits(txObj.currencyAmount)} ${this.selectedCurrency}`
          txObj.amount = `${txObj.totalAmountString} / ${txObj.currencyAmountString}`
          txObj.status = txOld.status
          txObj.etherscanLink = getEtherScanHashLink(txOld.hash, networkType)
          txObj.networkType = networkType
          txObj.ethRate = significantDigits(parseFloat(txObj.currencyAmount) / parseFloat(txObj.totalAmount))
          txObj.currencyUsed = this.selectedCurrency
          finalTransactions.push(txObj)
        }
      }
      if (this.pastOrders.length > 0) finalTransactions.push(...this.pastOrders)
      if (this.pastTx.length > 0) finalTransactions.push(...this.pastTx)
      return finalTransactions
    }
  },
  mounted() {
    const { selectedAddress: publicAddress, pastTransactions, jwtToken, networkType } = this.$store.state
    getPastOrders({}, { public_address: publicAddress })
      .then(response => {
        this.pastOrders = response.result.reduce((acc, x) => {
          if (!(x.status === 'SENT_TO_SIMPLEX' && new Date() - new Date(x.createdAt) > 86400 * 1000)) {
            const totalAmountString = `${significantDigits(x.requested_digital_amount.amount)} ${x.requested_digital_amount.currency}`
            const currencyAmountString = `${significantDigits(x.fiat_total_amount.amount)} ${x.fiat_total_amount.currency}`
            acc.push({
              id: x.createdAt,
              date: new Date(x.createdAt),
              from: 'Simplex',
              slicedFrom: 'Simplex',
              action: 'Top-up',
              to: publicAddress,
              slicedTo: addressSlicer(publicAddress),
              totalAmount: x.requested_digital_amount.amount,
              totalAmountString,
              currencyAmount: x.fiat_total_amount.amount,
              currencyAmountString,
              amount: `${totalAmountString} / ${currencyAmountString}`,
              status: getStatus(x.status),
              etherscanLink: ''
            })
          }

          return acc
          // }
        }, [])
      })
      .catch(err => console.log(err))
    pastTransactions.forEach(async x => {
      if (x.network !== networkType) return
      let status = x.status
      if (x.status !== 'confirmed') {
        status = await getEthTxStatus(x.transaction_hash, torus.web3)
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

      const totalAmountString = `${significantDigits(parseFloat(x.total_amount))} ETH`
      const currencyAmountString = `${significantDigits(parseFloat(x.currency_amount))} ${x.selected_currency}`
      const finalObj = {
        id: x.created_at,
        date: new Date(x.created_at),
        from: x.from,
        slicedFrom: addressSlicer(x.from),
        to: x.to,
        slicedTo: addressSlicer(x.to),
        action: this.wallets.indexOf(x.to) >= 0 ? 'Received' : 'Sending',
        totalAmount: x.total_amount,
        totalAmountString: totalAmountString,
        currencyAmount: x.currency_amount,
        currencyAmountString: currencyAmountString,
        amount: `${totalAmountString} / ${currencyAmountString}`,
        status: status,
        etherscanLink: getEtherScanHashLink(x.transaction_hash, x.network),
        networkType: x.network,
        ethRate: significantDigits(parseFloat(x.currency_amount) / parseFloat(x.total_amount)),
        currencyUsed: x.selected_currency
      }
      this.pastTx.push(finalObj)
    })
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/nav-selector.mixin';
@mixin svg-size($args...) {
  @each $name, $size in keywords($args) {
    .svg-setting-#{$name} {
      width: $size;
      height: $size;
    }
  }
}

@include svg-size($tiny: 18px, $small: 24px, $medium: 38px, $large: 80px);

%justify-align {
  justify-content: start;
  align-items: center;
}

.spanWrapSvgStyle {
  display: inline-flex;
  @extend %justify-align;
}

.text-bluish {
  color: var(--v-torus_blue-base);
}

.select-width {
  width: 80px;
}

::v-deep .v-text-field--solo .v-input__slot,
.v-text-field--outline .v-input__slot {
  min-height: auto !important;
  display: flex !important;
  align-items: flex-end !important;
  border-radius: 17px !important;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.16) !important;
  margin-top: 20px !important;
  margin-bottom: 0px !important;
}

::v-deep .v-text-field.v-text-field--solo .v-input__control {
  min-height: auto !important;
}

/* NEW UI */
::v-deep .nav-selector {
  @include navSelector();
  &.transaction {
    max-width: 150px;
  }
  &.period {
    max-width: 110px;
  }
}
</style>
