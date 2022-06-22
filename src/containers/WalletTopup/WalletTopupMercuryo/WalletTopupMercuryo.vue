<template>
  <WalletTopupBase
    selected-provider="mercuryo"
    :crypto-currency-value="cryptoCurrencyValue"
    :currency-rate="currencyRate"
    :fetching-quote="fetchingQuote"
    :fetch-quote-error="fetchQuoteError"
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
      fetchingQuote: false,
      fetchQuoteError: '',
    }
  },
  computed: mapState(['selectedAddress']),
  methods: {
    fetchQuote(payload) {
      const self = this
      throttle(() => {
        this.fetchQuoteError = ''
        this.fetchingQuote = true
        self.$store
          .dispatch('fetchMercuryoQuote', payload)
          .then((result) => {
            const { fiat_amount, amount } = result.data
            self.currencyRate = Number.parseFloat(amount) / Number.parseFloat(fiat_amount)
            self.cryptoCurrencyValue = amount
            self.currentOrder = result.data
            this.fetchingQuote = false
            this.fetchQuoteError = ''
          })
          .catch(async (error) => {
            if ('json' in error) {
              const result = await error.json()
              const { data } = result
              if (data?.code === 400_005) {
                const { selectedCurrency } = payload
                this.fetchQuoteError =
                  `Purchase limit of ${data.data[selectedCurrency].min} ${selectedCurrency}` +
                  ` to ${data.data[selectedCurrency].max} ${selectedCurrency} is required.`
              } else if (data?.code === 400_001) {
                this.fetchQuoteError = data.data.from[0]
              } else {
                this.fetchQuoteError = 'Unknown error'
              }
            } else {
              this.fetchQuoteError = 'Unknown error'
            }
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
