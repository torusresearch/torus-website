<template>
  <WalletTopupBase
    selected-provider="rampnetwork"
    :crypto-currency-value="cryptoCurrencyValue"
    :currency-rate="currencyRate"
    @fetchQuote="fetchQuote"
    @sendOrder="sendOrder"
    @clearQuote="clearQuote"
  />
</template>

<script>
import BigNumber from 'bignumber.js'
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
          .dispatch('fetchRampNetworkQuote', payload)
          .then((result) => {
            const { asset } = result

            self.cryptoCurrencyValue = new BigNumber(result.cryptoAmount).div(new BigNumber(10).pow(asset.decimals)).toNumber()
            self.cryptoCurrencySymbol = asset.symbol
            self.currencyRate = 1 / result.assetExchangeRate
            self.currentOrder = {
              cryptoCurrencyValue: result.cryptoAmount,
              cryptoCurrencySymbol: asset.symbol,
            }
          })
          .catch((error) => log.error(error))
      }, 0)()
    },
    sendOrder(callback) {
      const { selectedAddress } = this.$route.query
      callback(
        this.$store.dispatch('fetchRampNetworkOrder', {
          currentOrder: this.currentOrder,
          colorCode: this.$vuetify.theme.currentTheme.torusBrand1,
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
@import 'WalletTopupRampNetwork.scss';
</style>
