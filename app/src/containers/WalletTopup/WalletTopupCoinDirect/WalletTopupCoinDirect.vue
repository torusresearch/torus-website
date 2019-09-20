<template>
  <v-layout wrap>
    <span>Coindirect is the easiest and most trusted place to buy, sell, and convert your cryptocurrency in Singapore.</span>

    <div style="height:500px; width:100%">
      <iframe v-if="loaded" :src="url" height="100%" width="100%" style="border:none"></iframe>
    </div>
  </v-layout>
</template>

<script>
import config from '../../../config'
const { coindirectTestHost, coindirectLiveHost, coindirectTestMerchantID, coindirectLiveMerchantID } = config

export default {
  data() {
    return {
      url: '',
      loaded: false,
      currencyCode: 'eth',
      path: coindirectTestHost,
      merchantId: coindirectTestMerchantID,
      // Modify before deploying.
      redirectURL: ''
    }
  },
  mounted() {
    // let redirectURL = window.location.origin + '/wallet/history'
    let redirectURL = 'http://coindirect-api.tor.us/transaction'
    this.url =
      this.path +
      '&email=' +
      this.$store.state.userInfo.email +
      '&merchantId=' +
      this.merchantId +
      '&to=' +
      this.currencyCode +
      '&address=' +
      this.$store.state.selectedAddress +
      '&url=' +
      encodeURIComponent(redirectURL)

    this.loaded = true
    // log.info('this is', this)
  }
}
</script>
<style lang="scss" scoped>
@import 'WalletTopupCoinDirect.scss';
</style>
