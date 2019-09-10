<template>
  <v-layout wrap>
    <span>
      Coindirect is the easiest and most trusted place to buy, sell, and convert your cryptocurrency in Singapore.
    </span>

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
      path: coindirectLiveHost,
      merchantId: coindirectLiveMerchantID,
      // Modify before deploying.
      redirectURL: ''
    }
  },
  mounted() {
    //merchantId=82y58W8S302f28h&to=eth&address=0x67Cb438A35427a7dB62e69ec091B2372b68DEB8a
    let redirectURL = window.location.origin + '/wallet/history'

    this.url =
      this.path +
      'merchantId=' +
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
