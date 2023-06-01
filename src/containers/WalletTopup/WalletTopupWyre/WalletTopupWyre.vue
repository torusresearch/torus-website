<template>
  <WalletTopupBase
    selected-provider="wyre"
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
import { WYRE_NETWORK_MAP } from '../../../utils/enums'

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
      payload.network = WYRE_NETWORK_MAP[this.networkType.host]
      throttle(() => {
        self.$store
          .dispatch('fetchWyreQuote', payload)
          .then((result) => {
            self.currencyRate = Number.parseFloat(result.data.exchangeRate)
            self.cryptoCurrencyValue = result.data.destAmount
            self.currentOrder = result.data
            this.fetchingQuote = false
            this.fetchQuoteError = ''
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
      const network = WYRE_NETWORK_MAP[this.networkType.host]
      callback(
        this.$store.dispatch('fetchWyreOrder', { currentOrder: this.currentOrder, selectedAddress: selectedAddress || this.selectedAddress, network })
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
@import 'WalletTopupWyre.scss';
</style>
