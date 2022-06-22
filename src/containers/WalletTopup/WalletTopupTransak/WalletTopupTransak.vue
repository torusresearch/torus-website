<template>
  <WalletTopupBase
    selected-provider="transak"
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
import { AVALANCHE_MAINNET, BSC_MAINNET, MAINNET, MATIC } from '../../../utils/enums'

const TRANSAK_NETWORK_MAP = {
  [MAINNET]: 'ethereum',
  [BSC_MAINNET]: 'bsc',
  [MATIC]: 'polygon',
  [AVALANCHE_MAINNET]: 'avaxcchain',
}

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
      payload.network = TRANSAK_NETWORK_MAP[this.networkType.host]
      throttle(() => {
        self.$store
          .dispatch('fetchTransakQuote', payload)
          .then((result) => {
            self.cryptoCurrencyValue = result.response.cryptoAmount
            self.currencyRate = result.response.conversionPrice
            self.currentOrder = result.response
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
        this.$store.dispatch('fetchTransakOrder', {
          currentOrder: this.currentOrder,
          colorCode: this.$vuetify.theme.currentTheme.torusBrand1,
          selectedAddress: selectedAddress || this.selectedAddress,
          network: TRANSAK_NETWORK_MAP[this.networkType.host],
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
