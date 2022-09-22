<template>
  <WalletTopupBase
    selected-provider="moonpay"
    :crypto-currency-value="cryptoCurrencyValue"
    :currency-rate="currencyRate"
    :fetch-quote-error="fetchQuoteError"
    :fetching-quote="fetchingQuote"
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
import cleanTopupQuoteError from '../../../utils/cleanTopupQuoteError'

export default {
  components: {
    WalletTopupBase,
  },
  data() {
    return {
      cryptoCurrencyValue: 0,
      currencyRate: 0,
      currentOrder: {},
      fetchQuoteError: '',
      fetchingQuote: false,
    }
  },
  computed: mapState(['selectedAddress']),
  methods: {
    fetchQuote(payload) {
      const self = this
      this.fetchQuoteError = ''
      this.fetchingQuote = true
      throttle(() => {
        self.$store
          .dispatch('fetchMoonpayQuote', payload)
          .then((result) => {
            self.cryptoCurrencyValue = result.quoteCurrencyAmount
            self.currencyRate = result.quoteCurrencyAmount / result.totalAmount
            self.currentOrder = result
            this.fetchingQuote = false
            this.fetchQuoteError = ''
          })
          .catch(async (error) => {
            this.fetchQuoteError = await cleanTopupQuoteError(error)
            log.error(error)

            this.cryptoCurrencyValue = 0
            this.currencyRate = 0
            this.currentOrder = {}
            this.fetchingQuote = false
          })
      }, 0)()
    },
    sendOrder(callback) {
      const { selectedAddress } = this.$route.query
      callback(
        this.$store.dispatch('fetchMoonpayOrder', {
          currentOrder: this.currentOrder,
          colorCode: this.$vuetify.theme.current.colors.torusBrand1.torusBrand1,
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
@import 'WalletTopupMoonpay.scss';
</style>
