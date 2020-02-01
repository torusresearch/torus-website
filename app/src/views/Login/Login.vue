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
              <v-btn
                id="loginBtn"
                :color="$vuetify.theme.dark ? '' : 'white'"
                block
                :class="$vuetify.theme.dark ? 'torus-dark' : ''"
                class="body-1 font-weight-bold card-shadow-v8 text_2--text login-btn"
                @click="triggerLogin({ verifier: GOOGLE, calledFromEmbed: false })"
              >
                <img
                  :src="require(`../../../public/img/icons/google${$vuetify.theme.dark ? '-dark' : ''}.svg`)"
                  :class="$vuetify.theme.dark ? 'mr-4 torus-dark' : 'mr-6'"
                />
                {{ t('login.signIn') }} Google
              </v-btn>
            </v-flex>
            <v-flex xs9 sm7 ml-auto mr-auto mb-3>
              <v-layout wrap class="other-login-container">
                <v-flex xs6 px-1>
                  <v-btn
                    :large="!$vuetify.breakpoint.xsOnly"
                    :color="$vuetify.theme.dark ? '' : 'white'"
                    :class="$vuetify.theme.dark ? 'torus-dark' : 'card-shadow-v8'"
                    :depressed="$vuetify.theme.dark"
                    block
                    class="other-login-btn"
                    type="button"
                    :title="`${t('login.loginWith')} Torus`"
                    @click="triggerLogin({ verifier: TORUS, calledFromEmbed: false })"
                  >
                    <img height="32" :src="require(`../../../public/img/icons/facebook${$vuetify.theme.dark ? '-dark' : ''}.svg`)" />
                  </v-btn>
                </v-flex>
                <v-flex xs6 px-1>
                  <v-btn
                    :large="!$vuetify.breakpoint.xsOnly"
                    :color="$vuetify.theme.dark ? '' : 'white'"
                    :class="$vuetify.theme.dark ? 'torus-dark' : 'card-shadow-v8'"
                    :depressed="$vuetify.theme.dark"
                    block
                    class="other-login-btn"
                    type="button"
                    :title="`${t('login.loginWith')} Facebook`"
                    @click="triggerLogin({ verifier: FACEBOOK, calledFromEmbed: false })"
                  >
                    <img height="32" :src="require(`../../../public/img/icons/facebook${$vuetify.theme.dark ? '-dark' : ''}.svg`)" />
                  </v-btn>
                </v-flex>
                <v-flex xs6 px-1>
                  <v-btn
                    :large="!$vuetify.breakpoint.xsOnly"
                    :color="$vuetify.theme.dark ? '' : 'white'"
                    :class="$vuetify.theme.dark ? 'torus-dark' : 'card-shadow-v8'"
                    :depressed="$vuetify.theme.dark"
                    block
                    class="other-login-btn"
                    type="button"
                    :title="`${t('login.loginWith')} Reddit`"
                    @click="triggerLogin({ verifier: REDDIT, calledFromEmbed: false })"
                  >
                    <img height="32" :src="require(`../../../public/img/icons/reddit${$vuetify.theme.dark ? '-dark' : ''}.svg`)" />
                  </v-btn>
                </v-flex>
                <v-flex xs6 px-1>
                  <v-btn
                    :large="!$vuetify.breakpoint.xsOnly"
                    :color="$vuetify.theme.dark ? '' : 'white'"
                    :class="$vuetify.theme.dark ? 'torus-dark' : 'card-shadow-v8'"
                    :depressed="$vuetify.theme.dark"
                    block
                    class="other-login-btn"
                    type="button"
                    :title="`${t('login.loginWith')} Twitch`"
                    @click="triggerLogin({ verifier: TWITCH, calledFromEmbed: false })"
                  >
                    <img height="32" :src="require(`../../../public/img/icons/twitch${$vuetify.theme.dark ? '-dark' : ''}.svg`)" />
                  </v-btn>
                </v-flex>
                <v-flex xs6 px-1>
                  <v-btn
                    :large="!$vuetify.breakpoint.xsOnly"
                    :color="$vuetify.theme.dark ? '' : 'white'"
                    :class="$vuetify.theme.dark ? 'torus-dark' : 'card-shadow-v8'"
                    :depressed="$vuetify.theme.dark"
                    block
                    class="other-login-btn"
                    type="button"
                    :title="`${t('login.loginWith')} Discord`"
                    @click="triggerLogin({ verifier: DISCORD, calledFromEmbed: false })"
                  >
                    <img height="32" :src="require(`../../../public/img/icons/discord${$vuetify.theme.dark ? '-dark' : ''}.svg`)" />
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs9 sm7 ml-auto mb-2 mr-auto>
              <v-btn
                id="torusLogin"
                :large="!$vuetify.breakpoint.xsOnly"
                :color="$vuetify.theme.dark ? '' : 'white'"
                :class="$vuetify.theme.dark ? 'torus-dark' : 'card-shadow-v8'"
                :depressed="$vuetify.theme.dark"
                block
                class="body-1 font-weight-bold card-shadow-v8 text_2--text torus-login-btn"
                type="button"
                :title="`${t('login.loginWith')} Torus`"
                @click="triggerLogin({ verifier: TORUS, calledFromEmbed: false, loginType: 'torusEmailLogin' })"
              >
                <img height="24" :src="require('../../../public/images/email.svg')" :class="$vuetify.theme.dark ? 'ml-4 mr-4 torus-dark' : 'mr-6'" />
                Sign up/in with Email
              </v-btn>
            </v-flex>
            <v-flex xs9 sm7 ml-auto mb-2 mr-auto>
              <v-btn
                id="torusLogin"
                :large="!$vuetify.breakpoint.xsOnly"
                :color="$vuetify.theme.dark ? '' : 'white'"
                :class="$vuetify.theme.dark ? 'torus-dark' : 'card-shadow-v8'"
                :depressed="$vuetify.theme.dark"
                block
                class="body-1 font-weight-bold card-shadow-v8 text_2--text torus-login-btn"
                type="button"
                :title="`${t('login.loginWith')} Torus`"
                @click="triggerLogin({ verifier: TORUS, calledFromEmbed: false, loginType: 'torusPhoneLogin' })"
              >
                <img
                  height="24"
                  :src="require('../../../public/images/phone-icon.svg')"
                  :class="$vuetify.theme.dark ? 'ml-4 mr-4 torus-dark' : 'mr-6'"
                />
                Sign up/in with Phone
              </v-btn>
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
      <component v-bind:is="activeLoader"></component>
    </template>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import {
  WalletLoginLoader,
  WalletLoginLoaderMobile,
  WalletHomeLoader,
  WalletHomeLoaderMobile,
  WalletCollectiblesLoader,
  WalletCollectiblesLoaderMobile,
  WalletTransferLoader,
  WalletTransferLoaderMobile,
  WalletTopupLoader,
  WalletTopupLoaderMobile,
  WalletActivityLoader,
  WalletActivityLoaderMobile,
  WalletSettingsLoader,
  WalletSettingsLoaderMobile
} from '../../content-loader'
import { GOOGLE, FACEBOOK, REDDIT, TWITCH, DISCORD, TORUS } from '../../utils/enums'
import config from '../../config'

export default {
  name: 'login',
  components: { WalletLoginLoader, WalletLoginLoaderMobile },
  data() {
    return {
      isLogout: false,
      FACEBOOK: FACEBOOK,
      GOOGLE: GOOGLE,
      TWITCH: TWITCH,
      REDDIT: REDDIT,
      DISCORD: DISCORD,
      TORUS: TORUS
    }
  },
  methods: {
    ...mapActions({
      triggerLogin: 'triggerLogin'
    }),
    returnHome() {
      // this.$router.push({ path: '/' }).catch(err => {})
      // this.isLogout = false
      window.location.href = process.env.BASE_URL
    }
  },
  computed: mapState({
    selectedAddress: 'selectedAddress',
    loggedIn: state => {
      return state.selectedAddress !== '' && !state.loginInProgress
    },
    loginInProgress: 'loginInProgress',
    activeLoader() {
      const redirectPath = this.$route.query.redirect

      if (redirectPath === '/wallet/transfer') {
        return this.$vuetify.breakpoint.xsOnly ? WalletTransferLoaderMobile : WalletTransferLoader
      } else if (redirectPath === '/wallet/topup') {
        return this.$vuetify.breakpoint.xsOnly ? WalletTopupLoaderMobile : WalletTopupLoader
      } else if (redirectPath === '/wallet/history') {
        return this.$vuetify.breakpoint.xsOnly ? WalletActivityLoaderMobile : WalletActivityLoader
      } else if (redirectPath === '/wallet/settings') {
        return this.$vuetify.breakpoint.xsOnly ? WalletSettingsLoaderMobile : WalletSettingsLoader
      } else if (/^\/wallet\/home\/collectibles/.test(redirectPath)) {
        return this.$vuetify.breakpoint.xsOnly ? WalletCollectiblesLoaderMobile : WalletCollectiblesLoader
      } else {
        return this.$vuetify.breakpoint.xsOnly ? WalletHomeLoaderMobile : WalletHomeLoader
      }
    }
  }),
  watch: {
    selectedAddress: function(newAddress, oldAddress) {
      if (newAddress !== oldAddress && newAddress !== '') {
        let redirectPath = this.$route.query.redirect
        if (redirectPath === undefined || (redirectPath && redirectPath.includes('index.html'))) redirectPath = '/wallet'
        this.$router.push(redirectPath).catch(err => {})
      }
    }
  },
  mounted() {
    if (this.selectedAddress !== '') this.$router.push(this.$route.query.redirect || '/wallet').catch(err => {})
  },
  created() {
    this.isLogout = this.$route.name !== 'login'
  }
}
</script>

<style lang="scss" scoped>
@import 'Login.scss';
</style>
