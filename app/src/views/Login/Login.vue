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
              <span class="display-2 font-weight-bold">Welcome to Torus</span>
            </v-flex>
            <v-flex class="body-1" mb-6 xs9 sm7 ml-auto mr-auto>
              <span>You are just one step away from getting your digital wallet for your cryptocurrencies</span>
            </v-flex>
            <v-flex xs9 sm7 ml-auto mb-2 mr-auto>
              <v-btn
                id="loginBtn"
                color="white"
                large
                :block="$vuetify.breakpoint.xsOnly"
                class="body-2 login-btn"
                @click="triggerLogin({ verifier: GOOGLE, calledFromEmbed: false })"
              >
                <img :src="require('../../../public/img/icons/google.svg')" class="mr-2" />
                Sign in with Google
              </v-btn>
            </v-flex>
            <v-flex class="body-1" mb-2 xs9 sm7 ml-auto mr-auto>
              <span>Or, use another account:</span>
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
                    title="Login with Facebook"
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
                    title="Login with Torus"
                    @click="triggerLogin({ verifier: TORUS, calledFromEmbed: false })"
                  >
                    <img width="32" :src="require('../../../public/img/icons/torus.svg')" />
                  </v-btn>
                </v-flex>
                <v-flex xs3 px-1>
                  <v-btn
                    :large="!$vuetify.breakpoint.xsOnly"
                    outlined
                    block
                    class="other-login-btn"
                    type="button"
                    title="Login with Reddit"
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
                    title="Login with Twitch"
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
                    title="Login with Discord"
                    @click="triggerLogin({ verifier: DISCORD, calledFromEmbed: false })"
                  >
                    <img width="24" :src="require('../../../public/img/icons/discord.svg')" />
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex class="caption" mb-6 xs9 sm7 ml-auto mr-auto>
              <span>
                By clicking Login, you accept our
                <a href="https://docs.tor.us/legal/terms-and-conditions" target="_blank">
                  <span class="primary--text">Terms and Conditions</span>
                </a>
              </span>
            </v-flex>
            <v-flex class="caption" xs9 sm7 ml-auto mr-auto>
              <span>
                Note : For first time users, kindly
                <span class="primary--text">enable Pop-ups</span>
                to gain access to your Torus Wallet
              </span>
            </v-flex>
          </v-layout>
          <v-layout v-else wrap align-center justify-center align-content-center>
            <v-flex text-center>
              <img width="200px" height="auto" :src="require('../../../public/images/blublu-cross-arms.png')" />
            </v-flex>
            <v-flex xs12 mt-10>
              <div class="text-center headline font-weight-bold">You have been logged out</div>
            </v-flex>
            <v-flex xs12 mt-4>
              <div class="text-center">
                <v-btn large depressed color="primary" class="px-12 title" type="button" @click="returnHome">
                  Return Home
                </v-btn>
              </div>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12 md6 fill-height class="hidden-sm-and-down login-panel-right">
          <v-layout class="pb-8" wrap fill-height align-end>
            <v-flex class="mb-3 text-center" xs9 sm7 ml-auto mr-auto>
              <div class="display-1 white--text font-weight-bold">Frictionless Logins</div>
              <div class="display-1 white--text mb-3">for DApps</div>
              <div class="caption white--text">
                A simple and secure gateway to the decentralized ecosystem via OAuth logins
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
  WalletHomeLoader,
  WalletCollectiblesLoader,
  WalletTransferLoader,
  WalletTopupLoader,
  WalletActivityLoader,
  WalletSettingsLoader
} from '../../content-loader'
import { GOOGLE, TORUS, FACEBOOK, REDDIT, TWITCH, DISCORD } from '../../utils/enums'
import config from '../../config'

export default {
  name: 'login',
  components: { WalletLoginLoader },
  data() {
    return {
      isLogout: false,
      FACEBOOK: FACEBOOK,
      GOOGLE: GOOGLE,
      TORUS: TORUS,
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
        return WalletTransferLoader
      } else if (redirectPath === '/wallet/topup') {
        return WalletTopupLoader
      } else if (redirectPath === '/wallet/history') {
        return WalletActivityLoader
      } else if (redirectPath === '/wallet/settings') {
        return WalletSettingsLoader
      } else if (/^\/wallet\/home\/collectibles/.test(redirectPath)) {
        return WalletCollectiblesLoader
      } else {
        return WalletHomeLoader
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
