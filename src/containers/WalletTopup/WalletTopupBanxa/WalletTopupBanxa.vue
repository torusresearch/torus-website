<template>
  <WalletTopupBase
    selected-provider="banxa"
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
          .dispatch('fetchBanxaQuote', payload)
          .then((result) => {
            const { spot_price, prices } = result.data
            self.currencyRate = 1 / Number(spot_price)
            self.cryptoCurrencyValue = prices[0].coin_amount
            self.currentOrder = prices[0]
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
      callback(
        this.$store.dispatch('fetchBanxaOrder', {
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
@import 'WalletTopupBanxa.scss';
</style>
