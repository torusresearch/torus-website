<template>
  <WalletTopupBase
    selectedProvider="wyre"
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
          .dispatch('fetchWyreQuote', payload)
          .then(result => {
            // self.currencyRate = result[payload.selectedCryptoCurrency + payload.selectedCurrency] || 0
            // self.cryptoCurrencyValue = ((payload.fiatValue - 0.3) / 1.029) * self.currencyRate
            // self.currentOrder = { ...payload, fiatValue: (payload.fiatValue - 0.3) / 1.029 }
            self.currencyRate = parseFloat(result.data.exchangeRate)
            self.cryptoCurrencyValue = result.data.destAmount
            self.currentOrder = result.data
          })
          .catch(err => log.error(err))
      }, 0)()
    },
    sendOrder(cb) {
      cb(this.$store.dispatch('fetchWyreOrder', { currentOrder: this.currentOrder }))
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'WalletTopupWyre.scss';
</style>
