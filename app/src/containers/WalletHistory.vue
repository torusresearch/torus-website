<template>
  <v-layout mt-5 row wrap align-start justify-center align-content-start>
    <v-flex xs12 sm5>
      <span>
        <span class="spanWrapSvgStyle">
          <img :src="require('../../public/images/coins.svg')" alt="Wallet" class="svg-setting-small" />
        </span>
        <span class="text-bluish headline">My Transactions</span>
      </span>
    </v-flex>
    <v-flex xs12 sm5 class="text-sm-right">
      <div>Total Portfolio Value</div>
      <div>
        <span>
          <span class="text-bluish headline spanWrapSvgStyle">{{ totalPortfolioValue }}</span>
          <v-select
            class="select-width d-inline-flex ml-2 spanWrapSvgStyle"
            single-line
            solo
            flat
            :items="supportedCurrencies"
            :value="selectedCurrency"
            label
            @change="onCurrencyChange"
          ></v-select>
        </span>
      </div>
    </v-flex>
    <v-flex xs12>
      <tx-history-table :headers="headers" :transactions="getTransactions()" />
    </v-flex>
    <v-flex xs12 mt-5>
      <v-layout row wrap>
        <v-flex offset-xs10 xs2 align-self-center class="hidden-xs-only">
          <img :src="require('../../public/images/torus_logo.png')" />
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
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
      pastOrders: []
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

/deep/.v-text-field--solo .v-input__slot,
.v-text-field--outline .v-input__slot {
  min-height: auto !important;
  display: flex !important;
  align-items: flex-end !important;
  border-radius: 17px !important;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.16) !important;
  margin-top: 20px !important;
  margin-bottom: 0px !important;
}

/deep/.v-text-field.v-text-field--solo .v-input__control {
  min-height: auto !important;
}
</style>
