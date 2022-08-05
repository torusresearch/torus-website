<template>
  <v-container fluid fill-height text-center>
    <v-layout class="redirect-container" :class="$vuetify.breakpoint.xsOnly ? 'redirect-container--mobile' : ''" row wrap align-center>
      <v-flex text-center>
        <div v-if="isCustomVerifier" class="text_2--text font-weight-bold text-body-2 mb-10">
          {{ t('login.constructYourKey') }}
          <a :href="dappUrl" class="torusBrand1--text" target="_blank" rel="noreferrer noopener">{{ dappName }}</a>
        </div>
        <BoxLoader :white-label="whiteLabel" :is-custom-verifier="isCustomVerifier" />
      </v-flex>
      <div class="footer">
        <div class="powered-by">{{ t('login.selfCustodial') }}</div>
        <img height="26" :src="require(`@/assets/images/web3auth.svg`)" alt="Web3Auth" />
      </div>
    </v-layout>
  </v-container>
</template>

<script>
import { safeatob } from '@toruslabs/openlogin-utils'
import log from 'loglevel'

import BoxLoader from '../../components/helpers/BoxLoader'
import { OpenLoginHandler } from '../../handlers/Auth'

export default {
  name: 'Start',
  components: { BoxLoader },
  data() {
    return {
      whiteLabel: undefined,
      isCustomVerifier: false,
      iframeOrigin: {
        href: '',
        hostname: '',
      },
    }
  },
  computed: {
    dappName() {
      return this.isCustomVerifier ? this.whiteLabel?.name || this.iframeOrigin.hostname : 'Web3Auth'
    },
    dappUrl() {
      return this.isCustomVerifier ? this.whiteLabel?.url || this.iframeOrigin.href : 'https://app.tor.us'
    },
  },
  async created() {
    try {
      const { loginProvider, state, skipTKey, ...rest } = this.$route.query
      const stateParams = JSON.parse(safeatob(state))

      log.info('logging in with', loginProvider, state, skipTKey, rest)
      const { whiteLabel, loginConfig = {}, origin } = stateParams
      this.whiteLabel = whiteLabel
      this.iframeOrigin = origin
      this.isCustomVerifier = Object.keys(loginConfig).length > 0

      const openLoginHandler = OpenLoginHandler.getInstance(whiteLabel, loginConfig)
      await openLoginHandler.init()
      await openLoginHandler.openLoginInstance.login({
        loginProvider,
        getWalletKey: true,
        appState: state,
        skipTKey: skipTKey === 'true',
        extraLoginOptions: {
          ...rest,
        },
      })
    } catch (error) {
      log.info(error, 'something went wrong')
    }
  },
}
</script>

<style lang="scss" scoped>
@import 'Start.scss';
</style>
