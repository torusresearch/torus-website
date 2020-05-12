<template>
  <WalletTopupBase
    selected-provider="xanpool"
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
  name: 'WalletTopupXanpool',
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
  methods: {
    fetchQuote(payload) {
      const self = this
      throttle(() => {
        self.$store
          .dispatch('fetchXanpoolQuote', payload)
          .then((result) => {
            self.cryptoCurrencyValue = result.crypto
            self.currencyRate = 1 / result.cryptoPrice
            self.currentOrder = { ...result, ...payload }
          })
          .catch((error) => {
            log.error(error)
            // eslint-disable-next-line no-param-reassign
            const result = {
              crypto: 0.201,
              fiat: 50,
              cryptoPrice: 248.11277752218885,
              cryptoPriceUsd: 173.41430400000002,
              fxRate: 0.6989333871952302,
              total: 0.196,
              serviceCharge: 0.005,
              referralDiscount: 0,
              levelDiscount: 0,
              levelDiscountInUsd: 0,
              referralDiscountInXlp: 0,
              referralDiscountInUsd: 0,
              payoutServiceCharge: 0,
              earnedXlp: 372.2036307846649,
              processingTime: '5-30 minutes',
              currency: 'SGD',
            }
            // self.cryptoCurrencyValue = result.quoteCurrencyAmount
            // self.currencyRate = result.quoteCurrencyAmount / result.totalAmount
            // self.currentOrder = result
            self.cryptoCurrencyValue = result.crypto
            self.currencyRate = 1 / result.cryptoPrice
            self.currentOrder = { ...result, ...payload }
          })
      }, 0)()
    },
    sendOrder(callback) {
      callback(
        this.$store.dispatch('fetchXanpoolOrder', {
          currentOrder: this.currentOrder,
          selectedAddress: this.$store.state.selectedAddress,
        })
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
@import 'WalletTopupXanpool.scss';
</style>
