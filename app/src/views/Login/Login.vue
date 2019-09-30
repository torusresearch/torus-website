<template>
  <div :class="[{ 'background-login': !loggedIn }, 'default']">
    <template v-if="!isLogout">
      <template v-if="!loginInProgress">
        <template v-if="gapiLoaded">
          <v-layout wrap fill-height align-center justify-center class="login-panel-left">
            <v-flex xs12 md6>
              <v-layout wrap>
                <v-flex class="mb-5" xs9 sm7 ml-auto mr-auto>
                  <img width="117" :src="require('../../../public/images/torus-logo-blue.svg')" />
                </v-flex>
                <v-flex class="mb-3" xs9 sm7 ml-auto mr-auto>
                  <span class="display-2 font-weight-bold">Welcome to Torus</span>
                </v-flex>
                <v-flex class="body-1" mb-6 xs9 sm7 ml-auto mr-auto>
                  <span>You are just one step away from getting your digital wallet for your cryptocurrencies</span>
                </v-flex>
                <v-flex xs9 sm7 ml-auto mb-1 mr-auto>
                  <v-btn
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
                <v-flex xs9 sm7 ml-auto mb-1 mr-auto>
                  <v-btn
                    :large="!$vuetify.breakpoint.xsOnly"
                    depressed
                    color="primary"
                    class="flexiBtn px-12"
                    type="button"
                    @click="triggerLogin({ verifier: FACEBOOK, calledFromEmbed: false })"
                  >
                    Login With Facebook
                  </v-btn>
                </v-flex>
                <v-flex xs9 sm7 ml-auto mb-1 mr-auto>
                  <v-btn
                    :large="!$vuetify.breakpoint.xsOnly"
                    depressed
                    color="primary"
                    class="flexiBtn px-12"
                    type="button"
                    @click="triggerLogin({ verifier: REDDIT, calledFromEmbed: false })"
                  >
                    Login With Reddit
                  </v-btn>
                </v-flex>
                <v-flex xs9 sm7 ml-auto mb-1 mr-auto>
                  <v-btn
                    :large="!$vuetify.breakpoint.xsOnly"
                    depressed
                    color="primary"
                    class="flexiBtn px-12"
                    type="button"
                    @click="triggerLogin({ verifier: TWITCH, calledFromEmbed: false })"
                  >
                    Login With Twitch
                  </v-btn>
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
            </v-flex>
            <v-flex xs12 md6 fill-height class="hidden-sm-and-down login-panel-right">
              <v-layout class="pb-8" wrap fill-height align-end>
                <v-flex class="mb-3 text-center" xs9 sm7 ml-auto mr-auto>
                  <div class="display-1 white--text font-weight-bold">Frictionless Logins</div>
                  <div class="display-1 white--text mb-3">for DApps</div>
                  <div class="caption white--text">
                    A simple and secure gateway to the decentralized ecosystem via Google OAuth logins
                  </div>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </template>
        <template v-else>
          <v-container fill-height align-content-center>
            <page-loader />
          </v-container>
        </template>
      </template>
      <template v-else>
        <v-container fill-height align-content-center>
          <page-loader />
        </v-container>
      </template>
    </template>
    <v-container v-else fill-height align-content-center>
      <template v-if="gapiLoaded">
        <template v-if="!loginInProgress">
          <v-layout wrap align-center justify-center align-content-center>
            <v-flex text-center>
              <img width="200px" height="auto" :src="require('../../../public/images/torus-people-colored.svg')" />
            </v-flex>
            <v-flex xs12 mt-10>
              <div class="text-center headline font-weight-bold">You have been logged out</div>
            </v-flex>
            <v-flex xs12 mt-8>
              <div class="text-center">
                <v-btn large depressed color="primary" class="px-12 title" type="button" @click="returnHome">Return Home</v-btn>
              </div>
            </v-flex>
          </v-layout>
        </template>
        <template v-else>
          <page-loader />
        </template>
      </template>
      <template v-else>
        <page-loader />
      </template>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import PageLoader from '../../components/helpers/PageLoader'
import { GOOGLE, FACEBOOK, REDDIT, TWITCH } from '../../utils/enums'
import config from '../../config'

export default {
  name: 'login',
  components: { PageLoader },
  data() {
    return {
      gapiLoaded: false,
      fbLoaded: false,
      isLogout: false,
      FACEBOOK: FACEBOOK,
      GOOGLE: GOOGLE,
      TWITCH: TWITCH,
      REDDIT: REDDIT
    }
  },
  methods: {
    ...mapActions({
      triggerLogin: 'triggerLogin'
    }),
    returnHome() {
      this.$router.push({ path: '/' })
      this.isLogout = false
    }
  },
  computed: mapState({
    selectedAddress: 'selectedAddress',
    loggedIn: state => {
      return state.selectedAddress !== '' && !state.loginInProgress
    },
    loginInProgress: 'loginInProgress'
  }),
  watch: {
    selectedAddress: function(newAddress, oldAddress) {
      if (newAddress !== oldAddress && newAddress !== '') {
        let redirectPath = this.$route.query.redirect
        if (redirectPath === undefined || (redirectPath && redirectPath.includes('index.html'))) redirectPath = '/wallet'
        this.$router.push(redirectPath)
      }
    }
  },
  mounted() {
    // setup google auth sdk
    const googleInterval = setInterval(() => {
      if (window.gapi) {
        window.gapi.load('auth2', () => {
          window.auth2 = window.gapi.auth2.init({
            client_id: config.GOOGLE_CLIENT_ID
          })
          this.gapiLoaded = true
          clearInterval(googleInterval)
        })
      }
    }, 2000)

    // setup facebook auth sdk
    const facebookInterval = setInterval(() => {
      if (window.FB) {
        window.FB.init({
          appId: config.FACEBOOK_APP_ID,
          version: 'v4.0'
        })
        window.FBInitialized = true
        this.fbLoaded = true
        clearInterval(facebookInterval)
      }
    }, 2000)

    if (this.selectedAddress !== '') this.$router.push(this.$route.query.redirect || '/wallet')
  },
  created() {
    this.isLogout = this.$route.name !== 'login'
  }
}
</script>

<style lang="scss" scoped>
@import 'Login.scss';
</style>
