<template>
  <div>
    <v-layout mt-5 wrap row>
      <v-flex xs12 px-3 mb-3>
        <div class="text-black font-weight-bold headline left">Transaction Activities</div>
        <div class="right">
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
      <v-flex xs12 px-3 mb-3>
        <tx-history-table :headers="headers" :selectedAction="selectedAction" :selectedPeriod="selectedPeriod" :transactions="getTransactions()" />
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
// The color of dropdown icon requires half day work in modifying v-select
import config from '../config'
import TxHistoryTable from '../components/TxHistoryTable.vue'
import { getPastOrders } from '../plugins/simplex'
import { addressSlicer, significantDigits, getEtherScanHashLink, getStatus } from '../utils/utils'
import torus from '../torus'
const web3Utils = torus.web3.utils

export default {
  name: 'walletHistory',
  components: { TxHistoryTable },
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
      selectedPeriod: 'Period'
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
    }
  },
  methods: {
    onSelectType() {},
    onSelectPeriod() {},
    onCurrencyChange(value) {
      this.$store.dispatch('setSelectedCurrency', value)
    },
    getTransactions() {
      const { networkId, transactions, networkType } = this.$store.state || {}
      const finalTransactions = []
      for (let tx in transactions) {
        const txOld = transactions[tx]
        if (txOld.metamaskNetworkId.toString() === networkId.toString()) {
          const txObj = {}
          txObj.id = txOld.time
          txObj.action = 'Sending'
          txObj.date = new Date(txOld.time).toDateString().substring(4)
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
          finalTransactions.push(txObj)
        }
      }
      if (this.pastOrders.length > 0) finalTransactions.push(...this.pastOrders)
      return finalTransactions
    }
  },
  mounted() {
    const publicAddress = this.$store.state.selectedAddress
    getPastOrders({}, { public_address: publicAddress })
      .then(response => {
        this.pastOrders = response.result.reduce((acc, x) => {
          if (!(x.status === 'SENT_TO_SIMPLEX' && new Date() - new Date(x.createdAt) > 86400 * 1000))
            acc.push({
              id: x.createdAt,
              date: new Date(x.createdAt).toDateString().substring(4),
              from: 'Simplex',
              slicedFrom: 'Simplex',
              to: publicAddress,
              slicedTo: addressSlicer(publicAddress),
              totalAmount: x.requested_digital_amount.amount,
              totalAmountString: `${significantDigits(x.requested_digital_amount.amount)} ${x.requested_digital_amount.currency}`,
              currencyAmount: x.fiat_total_amount.amount,
              currencyAmountString: `${significantDigits(x.fiat_total_amount.amount)} ${x.fiat_total_amount.currency}`,
              status: getStatus(x.status),
              etherscanLink: ''
            })
          return acc
          // }
        }, [])
      })
      .catch(err => console.log(err))
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
