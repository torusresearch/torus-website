<template>
  <div :class="[{ 'background-login': !loggedIn }, 'default']">
    <v-container fill-height align-content-center>
      <template v-if="gapiLoaded">
        <template v-if="!loginInProgress">
          <v-layout v-if="!isLogout" wrap align-center justify-center align-content-center>
            <v-flex xs12 m-0>
              <div class="text-center font-weight-bold primary--text" :class="$vuetify.breakpoint.xsOnly ? 'display-1' : 'display-2'">
                Welcome to Torus
              </div>
            </v-flex>
            <v-flex xs12>
              <div class="text-center login-subtitle font-weight-medium" :class="$vuetify.breakpoint.xsOnly ? 'subtitle-1 pa-2' : 'headline'">
                You are just one step away from getting your digital wallet for your cryptocurrencies
              </div>
            </v-flex>
            <v-flex xs12 mt-5>
              <div class="text-center">
                <v-btn
                  :large="!$vuetify.breakpoint.xsOnly"
                  depressed
                  color="primary"
                  class="flexiBtn px-12"
                  type="button"
                  @click="triggerLogin({ calledFromEmbed: false })"
                >
                  Login
                </v-btn>
                <small class="d-block text-gray mt-2">
                  By clicking Login, you accept our
                  <br />
                  <a href="https://docs.tor.us/legal/terms-and-conditions" target="_blank">
                    <span class="primary--text">Terms and Conditions</span>
                  </a>
                </small>
              </div>
            </v-flex>
            <v-flex xs12 mt-5>
              <small class="text-gray text-center d-block">
                Note : For first time users, kindly
                <a href="#">
                  <span class="primary--text">enable Pop-ups</span>
                </a>
                to
                <br />
                gain access to your Torus Wallet
              </small>
            </v-flex>
            <v-flex mt-5 text-center>
              <img :width="$vuetify.breakpoint.xsOnly ? '150px' : '200px'" height="auto" :src="require('../../../public/images/torus-people.png')" />
              <p class="m-0">
                <small class="text-gray">The Decentralized Web Awaits</small>
              </p>
            </v-flex>
          </v-layout>
          <v-layout v-else wrap align-center justify-center align-content-center>
            <v-flex text-center>
              <img width="200px" height="auto" :src="require('../../../public/images/torus-people-colored.svg')" />
            </v-flex>
            <v-flex xs12 mt-10>
              <div class="text-center headline font-weight-bold">You have been logged out</div>
            </v-flex>
            <v-flex xs12 mt-8>
              <div class="text-center">
                <v-btn large depressed color="primary" class="px-12 title" type="button" @click="returnHome">
                  Return Home
                </v-btn>
              </div>
              <div class="text-center torus_text--text text--lighten-4 body-2 mt-6" @click="triggerLogin({ calledFromEmbed: false })">
                Login Again
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

export default {
  name: 'login',
  components: { PageLoader },
  data() {
    return {
      gapiLoaded: false,
      isLogout: false
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
      if (newAddress !== oldAddress && newAddress !== '') this.$router.push(this.$route.query.redirect || 'wallet')
    }
  },
  mounted() {
    // setup google auth sdk
    const interval = setInterval(() => {
      if (window.gapi) {
        window.gapi.load('auth2', () => {
          window.auth2 = window.gapi.auth2.init({
            client_id: '876733105116-i0hj3s53qiio5k95prpfmj0hp0gmgtor.apps.googleusercontent.com'
          })
          this.gapiLoaded = true
          clearInterval(interval)
        })
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
