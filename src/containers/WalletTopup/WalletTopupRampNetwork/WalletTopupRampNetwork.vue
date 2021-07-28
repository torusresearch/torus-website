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
import throttle from 'lodash.throttle'
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
            const asset = result.assets.find((item) => item.symbol === payload.selectedCryptoCurrency)

            const fiat = payload.fiatValue
            const feeRate = asset.maxFeePercent[payload.selectedCurrency] / 100
            const rate = asset.price[payload.selectedCurrency]
            const fiatWithoutFee = fiat / (1 + feeRate) // Final amount of fiat that will be converted to crypto
            const cryptoValue = fiatWithoutFee / rate // Final Crypto amount

            self.cryptoCurrencyValue = cryptoValue
            self.cryptoCurrencySymbol = asset.symbol
            self.currencyRate = 1 / asset.price[payload.selectedCurrency]
            self.currentOrder = {
              cryptoCurrencyValue: Math.trunc(cryptoValue * 10 ** asset.decimals),
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
