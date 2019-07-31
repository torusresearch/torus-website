<template>
  <div :class="[{ 'background-login': !loggedIn }, 'default']">
    <v-container fill-height align-content-center>
      <template v-if="gapiLoaded">
        <template v-if="!loginInProgress">
          <v-layout v-if="!isLogout" wrap align-center justify-center align-content-center>
            <v-flex xs12 m-0>
              <div class="text-center login-title">Welcome to Torus</div>
            </v-flex>
            <v-flex xs12>
              <div class="text-center login-subtitle">
                You are just one step away from getting your digital wallet for your cryptocurrencies
              </div>
            </v-flex>
            <v-flex xs12 mt-10>
              <div class="text-center">
                <v-btn id="flexiBtn" large color="primary" class="flexiBtn px-12" type="button" @click="triggerLogin({ calledFromEmbed: false })">
                  Login
                </v-btn>
                <small class="d-block text-gray mt-2">
                  By clicking Login, you accept our
                  <br />
                  <a href="https://docs.tor.us/legal/terms-and-conditions" target="_blank">
                    <span class="text-primary">Terms and Conditions</span>
                  </a>
                </small>
              </div>
            </v-flex>
            <v-flex xs12 mt-10>
              <small class="text-gray text-center d-block">
                Note : For first time users, kindly
                <a href="#">
                  <span class="text-primary">enable Pop-ups</span>
                </a>
                to
                <br />
                gain access to your Torus Wallet
              </small>
            </v-flex>
            <v-flex mt-10 text-center>
              <img width="200px" height="auto" :src="require('../../public/images/torus-people.png')" class="ml-2" />
              <p class="m-0">
                <small class="text-gray">The Decentralized Web Awaits</small>
              </p>
            </v-flex>
          </v-layout>
          <v-layout v-else wrap align-center justify-center align-content-center>
            <v-flex text-center>
              <img width="200px" height="auto" :src="require('../../public/images/torus-people-colored.svg')" />
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
import PageLoader from '../components/PageLoader.vue'

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

    if (this.selectedAddress !== '') this.$router.push(this.$route.query.redirect || 'wallet')
  },
  created() {
    this.isLogout = this.$route.name !== 'login'
  }
}
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}
#flexiBtn.btnStyle {
  width: 172px;
  height: 48px;
  border-radius: 12px;
}

.background-login {
  position: relative;
  background-image: url('/images/footer_waves.png');
  background-repeat: no-repeat;
  background-position: center bottom;
  @extend .default;

  @media only screen and (min-width: 1264px) {
    background-size: 100%;
  }
}

.text-primary {
  color: #5495f7;
}

.text-gray {
  color: #5c6c7f;
}

.fix-size {
  height: 69px;
}

.login {
  &-title {
    color: #5495f7;
    font-size: 3rem !important;
    font-weight: bold;
  }
  &-subtitle {
    font-size: 1.5rem !important;
    font-weight: 500;
    margin: 0 auto;
    max-width: 514px;
  }
}

.default {
  height: 100%;
}

body,
html {
  height: 100%;
  overflow-y: hidden;
}
</style>
