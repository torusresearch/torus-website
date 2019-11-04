<template>
  <WalletTopupBase
    selectedProvider="moonpay"
    @fetchQuote="fetchQuote"
    @sendOrder="sendOrder"
    :cryptoCurrencyValue="cryptoCurrencyValue"
    :currencyRate="currencyRate"
  />
</template>

<script>
import throttle from 'lodash.throttle'
import WalletTopupBase from '../../../components/WalletTopup/WalletTopupBase'
import log from 'loglevel'

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
          .catch(err => log.error(err))
      }, 0)()
    },
    sendOrder() {
      this.$store.dispatch('fetchMoonpayOrder', { currentOrder: this.currentOrder, colorCode: this.$vuetify.theme.themes.light.primary })
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'WalletTopupMoonpay.scss';
</style>
