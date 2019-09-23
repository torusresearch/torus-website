<template>
  <v-layout wrap class="wallet-topup-moonpay">
    <span>
      Moonpay is a secure way to buy cryptocurrency with your credit card. Start by entering a amount below to get a quote before making a purchase
    </span>

    <div style="height:500px; width:100%">
      <iframe v-if="loaded" :src="url" height="100%" width="100%" style="border:none"></iframe>
    </div>
  </v-layout>
</template>

<script>
import config from '../../../config'
const { moonpayLiveAPIKEY, moonpayHost } = config

export default {
  data() {
    return {
      url: '',
      loaded: false,
      currencyCode: 'eth',
      path: moonpayHost,
      apiKey: moonpayLiveAPIKEY,
      // Modify before deploying.
      redirectURL: ''
    }
  },
  methods: {
    runMoonPaySafariFix() {
      var isSafari = navigator.userAgent.indexOf('Safari') > -1
      if (!isSafari) {
        return
      }
      var isChrome = navigator.userAgent.indexOf('Chrome') > -1
      if (isChrome) {
        return
      }
      if (!document.cookie.match(/^(.*;)?\s*moonpay-fixed\s*=\s*[^;]+(.*)?$/)) {
        document.cookie = 'moonpay-fixed=fixed; expires=Tue, 19 Jan 2038 03:14:07 UTC; path=/'
        window.location.replace('https://buy.moonpay.io/safari_fix')
      }
    }
  },
  mounted() {
    this.runMoonPaySafariFix()

    /**
     * iframe init for moon pay.
     */
    this.redirectURL = 'javascript:window.top.location.href="' + window.location.origin + '/wallet/history"'
    this.url =
      this.path +
      'apiKey=' +
      this.apiKey +
      '&currencyCode=' +
      this.currencyCode +
      '&walletAddress=' +
      this.$store.state.selectedAddress +
      '&email=' +
      this.$store.state.userInfo.email +
      '&redirectURL=' +
      this.redirectURL +
      '&colorCode=' +
      encodeURIComponent(this.$vuetify.theme.themes.light.primary) +
      '&externalCustomerId=' +
      this.$store.state.selectedAddress

    this.loaded = true
    // log.info('this is', this)
  }
}
</script>
