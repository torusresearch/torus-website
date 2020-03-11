<template>
  <v-layout wrap class="wallet-topup-crypto">
    <span>
      Crypto.com is a secure way to buy cryptocurrency with your credit card. Start by installing their application
    </span>

    <div class="mt-3 text-right link-container">
      <a href="https://mco.onelink.me/PSQc/torus" target="_blank" class="v-btn v-btn--depressed theme--light v-size--default primary">
        <v-btn depressed color="primary" @click="postCryptoRequest">Continue</v-btn>
      </a>
    </div>
  </v-layout>
</template>

<script>
import log from 'loglevel'

import config from '../../../config'
import { post } from '../../../utils/httpHelpers'

export default {
  methods: {
    postCryptoRequest() {
      post(
        `${config.cryptoApiHost}/transaction`,
        {},
        {
          headers: {
            Authorization: `Bearer ${this.$store.state.jwtToken}`
          }
        }
      )
        .then(response => log.info(response))
        .catch(error => log.error(error))
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'WalletTopupCrypto.scss';
</style>
