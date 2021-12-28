<template>
  <WalletTopupBase
    selected-provider="banxa"
    :crypto-currency-value="cryptoCurrencyValue"
    :currency-rate="currencyRate"
    @fetchQuote="fetchQuote"
    @sendOrder="sendOrder"
    @clearQuote="clearQuote"
  />
</template>

<script>
import { throttle } from 'lodash'
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
          .dispatch('fetchBanxaQuote', payload)
          .then((result) => {
            log.info('Nel: Banxa', result)
            const { spot_price, prices } = result.data
            self.currencyRate = 1 / Number(spot_price)
            self.cryptoCurrencyValue = prices[0].coin_amount
            self.currentOrder = prices[0]
          })
          .catch((error) => log.error(error))
      }, 0)()
    },
    sendOrder(callback) {
      const { selectedAddress } = this.$route.query
      callback(
        this.$store.dispatch('fetchBanxaOrder', {
          currentOrder: this.currentOrder,
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
@import 'WalletTopupBanxa.scss';
</style>
