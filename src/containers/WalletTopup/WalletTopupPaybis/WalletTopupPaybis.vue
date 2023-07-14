<template>
  <WalletTopupBase
    selected-provider="paybis"
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
  computed: mapState(['selectedAddress', 'networkType']),
  methods: {
    fetchQuote(payload) {
      const self = this
      this.fetchQuoteError = ''
      this.fetchingQuote = true
      throttle(() => {
        self.$store
          .dispatch('fetchPaybisQuote', payload)
          .then((result) => {
            log.info(result)
            const { paymentMethods, currencyCodeFrom, currencyCodeTo, id: quoteId } = result.data
            // get credit card payment or the first one
            let details = paymentMethods.find((method) => method.id === 'exchanga-credit-card')
            if (!details) details = paymentMethods[0]
            self.cryptoCurrencyValue = details.amountTo.amount
            self.currencyRate =
              Number.parseFloat(details.amountToEquivalent.amount) > 0
                ? Number.parseFloat(details.amountTo.amount) / Number.parseFloat(details.amountToEquivalent.amount)
                : 0
            self.currentOrder = {
              quoteId,
              target: currencyCodeTo,
              from: currencyCodeFrom,
              fiatAmount: details.amountFrom.amount,
              targetAmount: details.amountTo.amount,
            }
            this.fetchingQuote = false
            this.fetchQuoteError = ''
          })
          .catch(async (error) => {
            this.fetchQuoteError = await cleanTopupQuoteError(error)
            log.error(this.fetchQuoteError)
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
        this.$store.dispatch('fetchPaybisOrder', {
          currentOrder: this.currentOrder,
          selectedAddress: selectedAddress || this.selectedAddress,
        })
      )
    },
    clearQuote(payload) {
      this.cryptoCurrencyValue = 0
      this.currencyRate = 0
      this.quoteId = ''
      this.fetchQuote(payload)
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'WalletTopupPaybis.scss';
</style>
