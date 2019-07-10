<template>
  <div :class="[{ 'background-login': !loggedIn }, 'default']">
    <v-container fill-height align-content-center>
      <template v-if="gapiLoaded">
        <template v-if="!loginInProgress">
          <v-layout row wrap align-center justify-center align-content-center>
            <v-flex d-flex xs12 class="fix-size">
              <img :src="require('../../public/images/torus-logo-white.svg')" alt="logo" />
            </v-flex>
            <v-flex xs12 mt-3>
              <div class="text-xs-center headline text-capitalize white--text">The decentralized web awaits</div>
            </v-flex>
            <v-flex xs12 mt-5>
              <div class="text-xs-center">
                <v-btn id="flexiBtn" class="white--text btnStyle" outlined large @click="triggerLogin({ calledFromEmbed: false })">Login</v-btn>
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
      gapiLoaded: false
    }
  },
  methods: {
    ...mapActions({
      triggerLogin: 'triggerLogin'
    })
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
  }
}
</script>

<style lang="scss">
#flexiBtn.btnStyle {
  width: 172px;
  height: 48px;
  border-radius: 12px;
}

.background-login {
  position: relative;
  background-image: url(../assets/background_login.png);
  background-repeat: no-repeat;
  background-position: center;
  @extend .default;
}

.fix-size {
  height: 69px;
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
