<template>
  <WalletTopupBase
    selectedProvider="coindirect"
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
          .dispatch('fetchCoindirectQuote', payload)
          .then(result => {
            console.log(result)
            self.currencyRate = 1 / parseFloat(result.netPrice)
            self.cryptoCurrencyValue = result.amountOut
            self.currentOrder = result
          })
          .catch(err => log.error(err))
      }, 0)()
    },
    sendOrder() {
      this.$store.dispatch('fetchCoindirectOrder', { currentOrder: this.currentOrder })
    }
  },
  mounted() {
    // let redirectURL = window.location.origin + '/wallet/history'
    // let redirectURL = 'http://coindirect-api.tor.us/transaction'
    // this.url =
    //   this.path +
    //   '&email=' +
    //   this.$store.state.userInfo.email +
    //   '&merchantId=' +
    //   this.merchantId +
    //   '&to=' +
    //   this.currencyCode +
    //   '&address=' +
    //   this.$store.state.selectedAddress +
    //   '&url=' +
    //   encodeURIComponent(redirectURL) +
    //   '&colorCode=' +
    //   encodeURIComponent(this.$vuetify.theme.themes.light.primary)
    // this.loaded = true
    // log.info('this is', this)
  }
}
</script>
<style lang="scss" scoped>
@import 'WalletTopupCoinDirect.scss';
</style>
