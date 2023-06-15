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
import { BANXA_NETWORK_MAP } from '../../../utils/enums'

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
      payload.blockchain = BANXA_NETWORK_MAP[this.networkType.host]
      throttle(() => {
        self.$store
          .dispatch('fetchPaybisQuote', payload)
          .then((result) => {
            log.info(result)
            const { paymentMethods } = result.data
            // get credit card payment or the first one
            let details = paymentMethods.find((method) => method.id === 'exchanga-credit-card')
            if (!details) details = paymentMethods[0]
            self.cryptoCurrencyValue = details.amountTo.amount
            self.currencyRate = details.amountTo.amount / details.amountToEquivalent.amount
            self.currentOrder = details.id
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
          blockchain: BANXA_NETWORK_MAP[this.networkType.host],
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
@import 'WalletTopupPaybis.scss';
</style>
