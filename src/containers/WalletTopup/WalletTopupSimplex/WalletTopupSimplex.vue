<template>
  <WalletTopupBase
    selected-provider="simplex"
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
          .dispatch('fetchSimplexQuote', payload)
          .then((result) => {
            log.info('result', result)
            if (result.error) {
              this.fetchQuoteError = result.result.error
              this.fetchingQuote = false
              this.cryptoCurrencyValue = 0
              this.currencyRate = 0
              this.currentOrder = {}
            } else {
              self.cryptoCurrencyValue = result.result.digital_money.amount
              self.currencyRate = result.result.digital_money.amount / result.result.fiat_money.total_amount
              self.currentOrder = result.result
              this.fetchingQuote = false
              this.fetchQuoteError = ''
            }
          })
          .catch(async (error) => {
            this.fetchQuoteError = await cleanTopupQuoteError(error)
            log.error(error)
            this.fetchingQuote = false

            this.cryptoCurrencyValue = 0
            this.currencyRate = 0
            this.currentOrder = {}
          })
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
