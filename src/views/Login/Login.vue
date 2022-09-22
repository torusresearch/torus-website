<template>
  <v-container
    :fluid="$vuetify.display.lgAndDown"
    class="login-panel-left pa-0 d-flex flex-nowrap fill-height align-center justify-center"
    :class="[isDarkMode ? 'torus-dark' : '', { spinner: loginInProgress }]"
  >
    <template v-if="!loginInProgress">
      <div style="max-width: 600px">
        <v-row v-if="!isLogout" wrap>
          <v-col v-if="$vuetify.display.xsOnly" class="mobile-login-container" cols="12">
            <section class="py-10 py-sm-12">
              <v-row wrap>
                <v-col class="mb-2 ml-auto mr-auto" cols="10">
                  <img height="25" :src="require(`../../assets/images/torus-logo-${isDarkMode ? 'white' : 'blue'}.svg`)" alt="Torus Logo" />
                </v-col>
                <LoginTitle class="mb-3" />
                <v-col cols="10" class="mx-auto py-0">
                  <LoginButtons :login-buttons-array="loginButtonsArray" :last-login-info="lastLoginInfo" @triggerLogin="startLogin" />
                </v-col>
              </v-row>
              <section>
                <LoginSlide
                  :show-spring-festival="showSpringFestival"
                  @change="
                    (current) => {
                      currentCarousel = current
                    }
                  "
                />
                <LoginFooter :authenticators="thirdPartyAuthenticators" />
              </section>
            </section>

            <v-icon v-if="scrollOnTop" class="more-icon" aria-label="Scroll for more information" role="image">$vuetify.icons.login_more</v-icon>
          </v-col>
          <!-- Desktop -->
          <v-col v-else cols="12">
            <v-row wrap class="inner-left-panel">
              <v-col class="mt-4 mb-10 ml-auto mr-auto" cols="10" sm="8">
                <img
                  height="25"
                  class="mb-2"
                  :src="require(`../../assets/images/torus-logo-${isDarkMode ? 'white' : 'blue'}.svg`)"
                  alt="Torus Logo"
                />
              </v-col>
              <LoginTitle />
              <!-- <v-col cols="10" sm="8" class="ml-auto mr-auto" :class="[$vuetify.display.xsOnly ? 'mt-8' : 'mt-10']">
                  <div class="headline font-weight-regular" :class="isDarkMode ? '' : 'text_2--text'">{{ $t('login.signUpIn') }}</div>
                </v-col> -->
              <v-col cols="2" sm="4" class="mx-auto">
                <LoginButtons :login-buttons-array="loginButtonsArray" :last-login-info="lastLoginInfo" @triggerLogin="startLogin" />
              </v-col>
              <LoginFooter :authenticators="thirdPartyAuthenticators" />
            </v-row>
          </v-col>
        </v-row>
        <v-row v-else wrap class="align-center justify-center align-content-center">
          <v-col cols="12" class="text-center mb-12">
            <img width="180" :src="require(`../../assets/images/torus-logo-${isDarkMode ? 'white-new' : 'blue'}.svg`)" alt="Torus Logo" />
          </v-col>
          <v-col cols="12" class="text-center">
            <img width="200px" height="auto" :src="require(`../../assets/images/logout${isDarkMode ? '-dark' : ''}.svg`)" alt="Logout Image" />
          </v-col>
          <v-col cols="12">
            <div class="text-center text-subtitle-1 font-weight-bold">{{ $t('login.beenLoggedOut') }}</div>
          </v-col>
          <v-col cols="12" class="mt-4">
            <div class="text-center">
              <v-btn
                :color="isDarkMode ? '' : 'white'"
                :class="isDarkMode ? 'torus-dark' : 'card-shadow-v8'"
                :depressed="isDarkMode"
                class="px-12 pa-3 font-weight-bold text-body-1 text-uppercase text-torusBrand1 logout-btn"
                type="button"
                @click="returnHome"
              >
                {{ $t('login.returnHome') }}
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </div>
      <div v-if="$vuetify.display.smAndUp" sm4 md6 fill-height class="login-panel-right flex-grow-1" :class="isDarkMode ? 'torus-dark' : ''">
        <v-row wrap fill-height align-center>
          <v-col cols="12" class="text-center">
            <LoginSlide
              :show-spring-festival="showSpringFestival"
              @change="
                (current) => {
                  currentCarousel = current
                }
              "
            />
          </v-col>
        </v-row>
      </div>
    </template>
    <template v-else>
      <BoxLoader :force-spinner="true" />
      <p class="bottom-text text-body-1 text-center font-weight-medium">
        {{ $t('login.loader') }}
      </p>
    </template>
    <v-snackbar v-model="snackbar" :color="snackbarColor">
      {{ snackbarText }}
      <v-btn dark text @click="snackbar = false">{{ $t('walletTopUp.close') }}</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import log from 'loglevel'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'

import BoxLoader from '../../components/helpers/BoxLoader'
import LoginButtons from '../../components/Login/LoginButtons'
import LoginFooter from '../../components/Login/LoginFooter'
import LoginSlide from '../../components/Login/LoginSlide'
import LoginTitle from '../../components/Login/LoginTitle'
import config from '../../config'
import { thirdPartyAuthenticators } from '../../utils/utils'

export default {
  name: 'Login',
  components: { LoginButtons, LoginFooter, LoginSlide, LoginTitle, BoxLoader },
  data() {
    return {
      isLogout: false,
      loginInProgress: false,
      snackbar: false,
      snackbarText: '',
      snackbarColor: 'error',
      scrollOnTop: true,
      currentCarousel: config.showSpringFestival ? 0 : -1,
      showSpringFestival: config.showSpringFestival,
    }
  },
  computed: {
    ...mapState({
      selectedAddress: 'selectedAddress',
      loginConfig: (state) => state.embedState.loginConfig,
      userInfo: 'userInfo',
      lastLoginInfo: 'lastLoginInfo',
    }),
    ...mapGetters(['loginButtonsArray']),
    loggedIn() {
      return this.selectedAddress !== '' && !this.loginInProgress
    },
    thirdPartyAuthenticators() {
      return thirdPartyAuthenticators(this.loginConfig)
    },
    lastLoginProvider() {
      return 'google'
    },
    isDarkMode() {
      return this.$vuetify.theme.current.dark
    },
  },
  watch: {
    selectedAddress(newAddress, oldAddress) {
      if (newAddress !== oldAddress && newAddress !== '') {
        let redirectPath = this.$route.query.redirect
        if (redirectPath === undefined || (redirectPath && redirectPath.includes('index.html'))) redirectPath = '/wallet/home'

        this.$router.push(redirectPath).catch((_) => {})
      }
    },
  },
  async mounted() {
    if (this.selectedAddress !== '') this.$router.push(this.$route.query.redirect || '/wallet').catch((_) => {})

    this.isLogout = this.$route.name !== 'login'
    this.scroll()
  },
  methods: {
    ...mapActions({
      triggerLogin: 'triggerLogin',
    }),
    ...mapMutations(['setUserInfo']),
    async startLogin(verifier, email) {
      try {
        log.info('starting login with', { verifier, email })
        this.loginInProgress = true
        await this.triggerLogin({ verifier, calledFromEmbed: false, login_hint: email })
      } catch (error) {
        log.error(error)
        this.snackbar = true
        this.snackbarColor = 'error'
        this.snackbarText = error.message?.includes('email_verified') ? this.$t('login.errorVerifyEmail') : this.$t('login.loginError')
      } finally {
        this.loginInProgress = false
      }
    },
    returnHome() {
      this.$router.push({ path: '/' }).catch((_) => {})
      this.isLogout = false
    },
    scroll() {
      window.addEventListener('scroll', () => {
        this.scrollOnTop = window.pageYOffset < 40
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'Login.scss';
</style>
