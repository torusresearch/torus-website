<template>
  <v-container fluid fill-height text-center>
    <v-layout class="redirect-container" :class="$vuetify.breakpoint.xsOnly ? 'redirect-container--mobile' : ''" row wrap align-center>
      <v-flex text-center>
        <BoxLoader :white-label="whiteLabel" :is-custom-verifier="isCustomVerifier" />

        <i18n v-if="isCustomVerifier" tag="div" path="login.constructYourKeyCustom" class="text_2--text font-weight-bold text-body-2 mt-4">
          <a :href="dappUrl" class="torusBrand1--text" target="_blank" rel="noreferrer noopener">{{ dappName }}</a>
        </i18n>
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
import { FORCE_POPUP_LOGIN_MODE } from '../../utils/enums'
import { isMobileOrTablet } from '../../utils/utils'

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
    let isPopupMode = false
    try {
      const { loginProvider, state, mfaLevel, sessionNamespace, ...rest } = this.$route.query
      const stateParams = JSON.parse(safeatob(state))
      log.info('logging in with', loginProvider, state, rest, mfaLevel)
      const { whiteLabel = {}, loginConfig = {}, origin } = stateParams
      this.iframeOrigin = origin
      this.isCustomVerifier = Object.keys(loginConfig).length > 0

      if (!whiteLabel.isActive) {
        if (!whiteLabel.theme) whiteLabel.theme = {}
        whiteLabel.theme.isDark = this.$vuetify.theme.dark
        whiteLabel.theme.colors = { torusBrand1: this.$vuetify.theme.currentTheme.torusBrand1 }
        whiteLabel.defaultLanguage = this.$i18n.locale
      }
      this.whiteLabel = whiteLabel

      const openLoginHandler = await OpenLoginHandler.getInstance(whiteLabel, loginConfig, sessionNamespace)
      if (FORCE_POPUP_LOGIN_MODE.includes(loginProvider) && isMobileOrTablet()) {
        isPopupMode = true
        openLoginHandler.openLoginInstance.options.uxMode = 'popup'
      }
      const data = await openLoginHandler.openLoginInstance.login({
        loginProvider,
        getWalletKey: true,
        appState: state,
        mfaLevel,
        extraLoginOptions: {
          ...rest,
        },
        curve: 'secp256k1',
      })
      if (isPopupMode && data) {
        // changing this back to redirect for other login providers.
        openLoginHandler.openLoginInstance.options.uxMode = 'redirect'
        this.$router.push({
          name: 'end',
          query: {},
        })
      }
    } catch (error) {
      log.info(error, 'something went wrong')
      if (isPopupMode) {
        this.$router.push({
          name: 'end',
          query: {},
          hash: `#error=${error.message || 'something went wrong, please try again later'}`,
        })
      }
    }
  },
}
</script>

<style lang="scss" scoped>
@import 'Start.scss';
</style>
