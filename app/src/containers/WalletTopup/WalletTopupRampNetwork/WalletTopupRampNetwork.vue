<template>
  <v-layout wrap class="wallet-topup-rampnetwork">
    <span>Ramp Network is a secure way to buy cryptocurrency with simple bank transfer.</span>

    <div class="mt-3 text-right link-container">
      <v-btn depressed color="primary" @click="showWidget">Buy</v-btn>
    </div>
  </v-layout>
</template>

<script>
import { post } from '../../../utils/httpHelpers'
import config from '../../../config'
import log from 'loglevel'
import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk'

export default {
  methods: {
    showWidget() {
      console.log(arguments)
      new RampInstantSDK({
        hostAppName: 'Tor.us',
        hostLogoUrl: 'https://tor.us/assets/img/torus-logo.svg',
        userAddress: this.$store.state.selectedAddress
      })
        //.on('*', event => console.log(event))
        .show()
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'WalletTopupRampNetwork.scss';
</style>
