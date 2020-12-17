<template>
  <WalletTopupBase
    selected-provider="mercuryo"
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
          .dispatch('fetchMercuryoQuote', payload)
          .then((result) => {
            const { fiat_amount, amount } = result.data
            self.currencyRate = Number.parseFloat(amount) / Number.parseFloat(fiat_amount)
            self.cryptoCurrencyValue = amount
            self.currentOrder = result.data
          })
          .catch((error) => log.error(error))
      }, 0)()
    },
    sendOrder(callback) {
      const { selectedAddress } = this.$route.query
      callback(
        this.$store.dispatch('fetchMercuryoOrder', { currentOrder: this.currentOrder, selectedAddress: selectedAddress || this.selectedAddress })
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
@import 'WalletTopupMercuryo.scss';
</style>
