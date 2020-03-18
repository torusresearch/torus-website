<template>
  <WalletTopupBase
    selected-provider="moonpay"
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

import WalletTopupBase from '../../../components/WalletTopup/WalletTopupBase'

export default {
  components: {
    WalletTopupBase
  },
  data() {
    return {
      cryptoCurrencyValue: 0,
      currencyRate: 0,
      currentOrder: {}
    }
  },
  methods: {
    fetchQuote(payload) {
      const self = this
      throttle(() => {
        self.$store
          .dispatch('fetchMoonpayQuote', payload)
          .then(result => {
            self.cryptoCurrencyValue = result.quoteCurrencyAmount
            self.currencyRate = result.quoteCurrencyAmount / result.totalAmount
            self.currentOrder = result
          })
          .catch(error => log.error(error))
      }, 0)()
    },
    sendOrder(callback) {
      callback(
        this.$store.dispatch('fetchMoonpayOrder', { currentOrder: this.currentOrder, colorCode: this.$vuetify.theme.themes.light.torus_brand1.base })
      )
    },
    clearQuote(payload) {
      this.cryptoCurrencyValue = 0
      this.currencyRate = 0
      this.currentOrder = {}
      this.fetchQuote(payload)
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'WalletTopupMoonpay.scss';
</style>
