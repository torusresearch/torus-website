<template>
  <div :class="[{ 'background-login': !loggedIn }, 'default']">
    <template v-if="!loginInProgress">
      <v-layout wrap fill-height align-center justify-center class="login-panel-left">
        <v-flex xs12 md6>
          <v-layout v-if="!isLogout" wrap>
            <v-flex class="mb-5" xs9 sm7 ml-auto mr-auto>
              <img width="117" :src="require('../../../public/images/torus-logo-blue.svg')" />
            </v-flex>
            <v-flex class="mb-3" xs9 sm7 ml-auto mr-auto>
              <span class="display-2 font-weight-bold">{{ t('login.welcome') }} Torus</span>
            </v-flex>
            <v-flex class="body-1" mb-6 xs9 sm7 ml-auto mr-auto>
              <span>{{ t('login.message') }}</span>
            </v-flex>
            <v-flex xs9 sm7 ml-auto mb-2 mr-auto>
              <v-btn
                id="loginBtn"
                color="white"
                large
                block
                light
                class="body-2 login-btn"
                @click="triggerLogin({ verifier: GOOGLE, calledFromEmbed: false })"
              >
                <img :src="require('../../../public/img/icons/google.svg')" class="mr-2" />
                {{ t('login.signIn') }} Google
              </v-btn>
            </v-flex>
            <v-flex class="body-1" mb-2 xs9 sm7 ml-auto mr-auto>
              <span>{{ t('login.otherAccount') }}:</span>
            </v-flex>
            <v-flex xs9 sm7 ml-auto mr-auto mb-2>
              <v-layout wrap class="other-login-container">
                <v-flex xs3 px-1>
                  <v-btn
                    :large="!$vuetify.breakpoint.xsOnly"
                    outlined
                    block
                    class="other-login-btn"
                    type="button"
                    :title="`${t('login.loginWith')} Facebook`"
                    @click="triggerLogin({ verifier: FACEBOOK, calledFromEmbed: false })"
                  >
                    <img width="24" :src="require('../../../public/img/icons/facebook.svg')" />
                  </v-btn>
                </v-flex>
                <v-flex xs3 px-1>
                  <v-btn
                    :large="!$vuetify.breakpoint.xsOnly"
                    outlined
                    block
                    class="other-login-btn"
                    type="button"
                    :title="`${t('login.loginWith')} Reddit`"
                    @click="triggerLogin({ verifier: REDDIT, calledFromEmbed: false })"
                  >
                    <img width="32" :src="require('../../../public/img/icons/reddit.svg')" />
                  </v-btn>
                </v-flex>
                <v-flex xs3 px-1>
                  <v-btn
                    :large="!$vuetify.breakpoint.xsOnly"
                    outlined
                    block
                    class="other-login-btn"
                    type="button"
                    :title="`${t('login.loginWith')} Twitch`"
                    @click="triggerLogin({ verifier: TWITCH, calledFromEmbed: false })"
                  >
                    <img width="24" :src="require('../../../public/img/icons/twitch.svg')" />
                  </v-btn>
                </v-flex>
                <v-flex xs3 px-1>
                  <v-btn
                    :large="!$vuetify.breakpoint.xsOnly"
                    outlined
                    block
                    class="other-login-btn"
                    type="button"
                    :title="`${t('login.loginWith')} Discord`"
                    @click="triggerLogin({ verifier: DISCORD, calledFromEmbed: false })"
                  >
                    <img width="24" :src="require('../../../public/img/icons/discord.svg')" />
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex class="caption" mb-6 xs9 sm7 ml-auto mr-auto>
              <span>
                {{ t('login.acceptTerms') }}
                <a href="https://docs.tor.us/legal/terms-and-conditions" target="_blank">
                  <span class="primary--text">{{ t('login.termsAndConditions') }}</span>
                </a>
              </span>
            </v-flex>
          </v-layout>
          <v-layout v-else wrap align-center justify-center align-content-center>
            <v-flex text-center>
              <img width="200px" height="auto" :src="require('../../../public/images/blublu-cross-arms.png')" />
            </v-flex>
            <v-flex xs12 mt-10>
              <div class="text-center headline font-weight-bold">{{ t('login.beenLoggedOut') }}</div>
            </v-flex>
            <v-flex xs12 mt-4>
              <div class="text-center">
                <v-btn large depressed color="primary" class="px-12 title" type="button" @click="returnHome">
                  {{ t('login.returnHome') }}
                </v-btn>
              </div>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12 md6 fill-height class="hidden-sm-and-down login-panel-right">
          <v-layout class="pb-8" wrap fill-height align-end>
            <v-flex class="mb-3 text-center" xs9 sm7 ml-auto mr-auto>
              <div class="display-1 white--text font-weight-bold">{{ t('login.frictionless') }}</div>
              <div class="display-1 white--text mb-3">{{ t('login.forDapps') }}</div>
              <div class="caption white--text">
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
import { GOOGLE, FACEBOOK, REDDIT, TWITCH, DISCORD } from '../../utils/enums'
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
      DISCORD: DISCORD
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
