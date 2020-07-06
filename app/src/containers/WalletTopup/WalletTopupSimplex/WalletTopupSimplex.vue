<template>
  <WalletTopupBase
    selected-provider="simplex"
    :crypto-currency-value="cryptoCurrencyValue"
    :currency-rate="currencyRate"
    @fetchQuote="fetchQuote"
    @sendOrder="sendOrder"
    @clearQuote="clearQuote"
  />
</template>

<script>
import throttle from 'lodash.throttle'
import log from 'loglevel'
import { mapState } from 'vuex'

import WalletTopupBase from '../../../components/WalletTopup/WalletTopupBase'

export default {
  components: {
    WalletTopupBase,
  },
  data() {
    return {
      cryptoCurrencyValue: 0,
      currencyRate: 0,
      currentOrder: {},
    }
  },
  computed: mapState(['selectedAddress']),
  methods: {
    fetchQuote(payload) {
      const self = this
      throttle(() => {
        self.$store
          .dispatch('fetchSimplexQuote', payload)
          .then((result) => {
            self.cryptoCurrencyValue = result.result.digital_money.amount
            self.currencyRate = result.result.digital_money.amount / result.result.fiat_money.total_amount
            self.currentOrder = result.result
          })
          .catch((error) => log.error(error))
      }, 0)()
    },
    sendOrder(callback) {
      const { selectedAddress } = this.$route.query
      callback(
        this.$store.dispatch('fetchSimplexOrder', { currentOrder: this.currentOrder, selectedAddress: selectedAddress || this.selectedAddress })
      )
    },
    clearQuote(payload) {
      this.cryptoCurrencyValue = 0
      this.currencyRate = 0
      this.currentOrder = {}
      this.fetchQuote(payload)
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'WalletTopupSimplex.scss';
</style>
