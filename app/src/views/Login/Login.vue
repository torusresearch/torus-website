<template>
  <div :class="[{ 'background-login': !loggedIn }, 'default']">
    <template v-if="!loginInProgress">
      <v-layout wrap fill-height align-center justify-center class="login-panel-left">
        <v-flex xs12 sm8 md6>
          <v-layout v-if="!isLogout" wrap>
            <v-flex class="mb-5" xs9 sm7 ml-auto mr-auto>
              <img width="180" :src="require(`../../../public/images/torus-logo-${$vuetify.theme.dark ? 'white' : 'blue'}.svg`)" />
            </v-flex>
            <v-flex class="mb-2" xs9 sm7 ml-auto mr-auto>
              <span :class="$vuetify.theme.dark ? '' : 'text_2--text'" class="display-1 font-weight-bold">{{ t('login.welcome') }} Torus</span>
            </v-flex>
            <v-flex :class="$vuetify.theme.dark ? '' : 'text_1--text'" class="body-2" mb-8 xs9 sm7 ml-auto mr-auto>
              <span>{{ t('login.message') }}</span>
            </v-flex>
            <v-flex xs9 sm7 ml-auto mb-2 mr-auto>
              <vue-telegram-login
                mode="callback"
                telegram-login="torustestbot"
                @callback="
                  (user) => {
                    triggerLogin({ verifier: TELEGRAM, calledFromEmbed: false, telegramUser: user })
                  }
                "
              />
            </v-flex>
            <v-flex class="caption" mb-6 xs9 sm7 ml-auto mr-auto>
              <span class="text_2--text body-1">
                {{ t('login.acceptTerms') }}
                <a href="https://docs.tor.us/legal/terms-and-conditions" target="_blank">
                  <span class="primary--text">{{ t('login.termsAndConditions') }}</span>
                </a>
              </span>
            </v-flex>
          </v-layout>
          <v-layout v-else wrap align-center justify-center align-content-center>
            <v-flex xs12 text-center mb-12>
              <img width="180" :src="require(`../../../public/images/torus-logo-${$vuetify.theme.dark ? 'white' : 'blue'}.svg`)" />
            </v-flex>
            <v-flex xs12 text-center>
              <img width="200px" height="auto" :src="require(`../../../public/images/logout${$vuetify.theme.dark ? '-dark' : ''}.svg`)" />
            </v-flex>
            <v-flex xs12>
              <div class="text-center subtitle-1 font-weight-bold">{{ t('login.beenLoggedOut') }}</div>
            </v-flex>
            <v-flex xs12 mt-4>
              <div class="text-center">
                <v-btn
                  :color="$vuetify.theme.dark ? '' : 'white'"
                  :class="$vuetify.theme.dark ? 'torus-dark' : 'card-shadow-v8'"
                  :depressed="$vuetify.theme.dark"
                  class="px-12 pa-3 font-weight-bold body-1 text-uppercase primary--text logout-btn"
                  type="button"
                  @click="returnHome"
                >
                  {{ t('login.returnHome') }}
                </v-btn>
              </div>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex
          v-if="$vuetify.breakpoint.smAndUp"
          xs12
          sm4
          md6
          fill-height
          class="login-panel-right"
          :class="$vuetify.theme.dark ? 'torus-dark' : ''"
        >
          <v-layout class="pb-8" wrap fill-height align-end>
            <v-flex class="mb-3 text-center" xs9 sm8 md10 ml-auto mr-auto>
              <div class="right-panel-header white--text font-weight-bold mb-2">{{ t('login.frictionless') }}</div>
              <div class="body-2 right-panel-subheader white--text mx-auto">
                {{ t('login.simpleSecure') }}
              </div>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </template>
    <template v-else>
      <component :is="activeLoader"></component>
    </template>
  </div>
</template>

<script>
import { vueTelegramLogin } from 'vue-telegram-login'
import { mapActions, mapState } from 'vuex'

import {
  WalletActivityLoader,
  WalletActivityLoaderMobile,
  WalletCollectiblesLoader,
  WalletCollectiblesLoaderMobile,
  WalletHomeLoader,
  WalletHomeLoaderMobile,
  WalletLoginLoader,
  WalletLoginLoaderMobile,
  WalletSettingsLoader,
  WalletSettingsLoaderMobile,
  WalletTopupLoader,
  WalletTopupLoaderMobile,
  WalletTransferLoader,
  WalletTransferLoaderMobile,
} from '../../content-loader'
import { DISCORD, FACEBOOK, GOOGLE, REDDIT, TELEGRAM, TWITCH } from '../../utils/enums'

export default {
  name: 'Login',
  components: { WalletLoginLoader, WalletLoginLoaderMobile, vueTelegramLogin },
  data() {
    return {
      isLogout: false,
      FACEBOOK,
      GOOGLE,
      TWITCH,
      TELEGRAM,
      REDDIT,
      DISCORD,
    }
  },
  computed: mapState({
    selectedAddress: 'selectedAddress',
    loggedIn: (state) => state.selectedAddress !== '' && !state.loginInProgress,
    loginInProgress: 'loginInProgress',
    activeLoader() {
      const redirectPath = this.$route.query.redirect

      if (redirectPath === '/wallet/transfer') {
        return this.$vuetify.breakpoint.xsOnly ? WalletTransferLoaderMobile : WalletTransferLoader
      }
      if (redirectPath === '/wallet/topup') {
        return this.$vuetify.breakpoint.xsOnly ? WalletTopupLoaderMobile : WalletTopupLoader
      }
      if (redirectPath === '/wallet/history') {
        return this.$vuetify.breakpoint.xsOnly ? WalletActivityLoaderMobile : WalletActivityLoader
      }
      if (redirectPath === '/wallet/settings') {
        return this.$vuetify.breakpoint.xsOnly ? WalletSettingsLoaderMobile : WalletSettingsLoader
      }
      if (/^\/wallet\/home\/collectibles/.test(redirectPath)) {
        return this.$vuetify.breakpoint.xsOnly ? WalletCollectiblesLoaderMobile : WalletCollectiblesLoader
      }
      return this.$vuetify.breakpoint.xsOnly ? WalletHomeLoaderMobile : WalletHomeLoader
    },
  }),
  watch: {
    selectedAddress(newAddress, oldAddress) {
      if (newAddress !== oldAddress && newAddress !== '') {
        let redirectPath = this.$route.query.redirect
        if (redirectPath === undefined || (redirectPath && redirectPath.includes('index.html'))) redirectPath = '/wallet'
        this.$router.push(redirectPath).catch((_) => {})
      }
    },
  },
  mounted() {
    if (this.selectedAddress !== '') this.$router.push(this.$route.query.redirect || '/wallet').catch((_) => {})
  },
  created() {
    this.isLogout = this.$route.name !== 'login'
  },
  methods: {
    ...mapActions({
      triggerLogin: 'triggerLogin',
    }),
    returnHome() {
      this.$router.push({ path: '/' }).catch((_) => {})
      this.isLogout = false
      // window.location.href = process.env.BASE_URL
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'Login.scss';
</style>
