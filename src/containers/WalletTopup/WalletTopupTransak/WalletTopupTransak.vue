<template>
  <WalletTopupBase
    selected-provider="transak"
    :crypto-currency-value="cryptoCurrencyValue"
    :currency-rate="currencyRate"
    @fetchQuote="fetchQuote"
    @sendOrder="sendOrder"
    @clearQuote="clearQuote"
  />
</template>

<script>
import { throttle } from 'lodash-es'
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
          .dispatch('fetchTransakQuote', payload)
          .then((result) => {
            self.cryptoCurrencyValue = result.response.cryptoAmount
            self.currencyRate = result.response.conversionPrice
            self.currentOrder = result.response
          })
          .catch((error) => log.error(error))
      }, 0)()
    },
    sendOrder(callback) {
      const { selectedAddress } = this.$route.query
      callback(
        this.$store.dispatch('fetchTransakOrder', {
          currentOrder: this.currentOrder,
          colorCode: this.$vuetify.theme.currentTheme.torusBrand1,
          selectedAddress: selectedAddress || this.selectedAddress,
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
@import 'WalletTopupTransak.scss';
</style>
