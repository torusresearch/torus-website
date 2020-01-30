<template>
  <WalletTopupBase
    selectedProvider="rampnetwork"
    @fetchQuote="fetchQuote"
    @sendOrder="sendOrder"
    :cryptoCurrencyValue="cryptoCurrencyValue"
    :currencyRate="currencyRate"
  />
</template>

<script>
import throttle from 'lodash.throttle'
import WalletTopupBase from '../../../components/WalletTopup/WalletTopupBase'
import log from 'loglevel'

export default {
  components: {
    WalletTopupBase
  },
  data() {
    return {
      cryptoCurrencyValue: 0,
      currencyRate: 0,
      currentOrder: {}
    }
  },
  methods: {
    fetchQuote(payload) {
      const self = this
      throttle(() => {
        self.$store
          .dispatch('fetchRampNetworkQuote', payload)
          .then(result => {
            let asset = result.assets.find(asset => asset.symbol === payload.selectedCryptoCurrency)

            let fiat = payload.fiatValue
            let fee = asset.maxFeePercent[payload.selectedCurrency] / 100
            let rate = asset.price[payload.selectedCurrency]
            let finalFiatValue = fiat - fiat * fee // Real amount of fiat that will be converted to crypto
            let cryptoValue = finalFiatValue / rate // Final Crypto Value

            self.cryptoCurrencyValue = cryptoValue
            self.cryptoCurrencySymbol = asset.symbol
            self.currencyRate = asset.price[payload.selectedCurrency]
            self.currentOrder = {
              cryptoCurrencyValue: cryptoValue * Math.pow(10, asset.decimals),
              cryptoCurrencySymbol: asset.symbol
            }
          })
          .catch(err => log.error(err))
      }, 0)()
    },
    sendOrder(cb) {
      cb(this.$store.dispatch('fetchRampNetworkOrder', { currentOrder: this.currentOrder, colorCode: this.$vuetify.theme.themes.light.primary }))
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'WalletTopupRampNetwork.scss';
</style>
