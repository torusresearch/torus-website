<template>
  <div :class="[{ 'background-login': !loggedIn }, 'default']">
    <template v-if="!loginInProgress">
      <v-layout wrap fill-height align-center justify-center class="login-panel-left" :class="$vuetify.theme.dark ? 'torus-dark' : ''">
        <v-flex xs12 sm8 md6>
          <v-layout v-if="!isLogout" wrap>
            <v-flex v-if="$vuetify.breakpoint.xsOnly" class="mobile-login-container" xs12>
              <section class="py-10 py-sm-12">
                <v-layout wrap>
                  <v-flex class="mb-8" xs10 ml-auto mr-auto>
                    <img
                      height="25"
                      :src="require(`../../assets/images/torus-logo-${$vuetify.theme.dark ? 'white' : 'blue'}.svg`)"
                      alt="Torus Logo"
                    />
                  </v-flex>
                  <LoginTitle class="mb-6" />
                  <v-flex xs10 mx-auto mt-4>
                    <LoginButtons :login-buttons-array="loginButtonsArray" :last-login-info="lastLoginInfo" @triggerLogin="startLogin" />
                  </v-flex>
                  <LoginFooter :authenticators="thirdPartyAuthenticators" />
                </v-layout>
              </section>
              <section>
                <LoginSlide
                  :show-spring-festival="showSpringFestival"
                  @change="
                    (current) => {
                      currentCarousel = current
                    }
                  "
                />
              </section>
              <v-icon v-if="scrollOnTop" class="more-icon" aria-label="Scroll for more information" role="image">$vuetify.icons.login_more</v-icon>
            </v-flex>
            <!-- Desktop -->
            <v-flex v-else xs12>
              <v-layout wrap>
                <v-flex mt-4 mb-10 xs10 sm8 ml-auto mr-auto>
                  <img height="25" :src="require(`../../assets/images/torus-logo-${$vuetify.theme.dark ? 'white' : 'blue'}.svg`)" alt="Torus Logo" />
                </v-flex>
                <LoginTitle />
                <!-- <v-flex xs10 sm8 ml-auto mr-auto :class="[$vuetify.breakpoint.xsOnly ? 'mt-8' : 'mt-10']">
                  <div class="headline font-weight-regular" :class="$vuetify.theme.dark ? '' : 'text_2--text'">{{ t('login.signUpIn') }}</div>
                </v-flex> -->
                <v-flex xs8 mx-auto mt-4>
                  <LoginButtons :login-buttons-array="loginButtonsArray" :last-login-info="lastLoginInfo" @triggerLogin="startLogin" />
                </v-flex>
                <LoginFooter :authenticators="thirdPartyAuthenticators" />
              </v-layout>
            </v-flex>
          </v-layout>
          <v-layout v-else wrap align-center justify-center align-content-center>
            <v-flex xs12 text-center mb-12>
              <img width="180" :src="require(`../../assets/images/torus-logo-${$vuetify.theme.dark ? 'white' : 'blue'}.svg`)" alt="Torus Logo" />
            </v-flex>
            <v-flex xs12 text-center>
              <img
                width="200px"
                height="auto"
                :src="require(`../../assets/images/logout${$vuetify.theme.dark ? '-dark' : ''}.svg`)"
                alt="Logout Image"
              />
            </v-flex>
            <v-flex xs12>
              <div class="text-center text-subtitle-1 font-weight-bold">{{ t('login.beenLoggedOut') }}</div>
            </v-flex>
            <v-flex xs12 mt-4>
              <div class="text-center">
                <v-btn
                  :color="$vuetify.theme.dark ? '' : 'white'"
                  :class="$vuetify.theme.dark ? 'torus-dark' : 'card-shadow-v8'"
                  :depressed="$vuetify.theme.dark"
                  class="px-12 pa-3 font-weight-bold text-body-1 text-uppercase torusBrand1--text logout-btn"
                  type="button"
                  @click="returnHome"
                >
                  {{ t('login.returnHome') }}
                </v-btn>
              </div>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex v-if="$vuetify.breakpoint.smAndUp" sm4 md6 fill-height class="login-panel-right" :class="$vuetify.theme.dark ? 'torus-dark' : ''">
          <v-layout wrap fill-height align-center>
            <v-flex xs12 text-center>
              <LoginSlide
                :show-spring-festival="showSpringFestival"
                @change="
                  (current) => {
                    currentCarousel = current
                  }
                "
              />
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </template>
    <template v-else>
      <v-container class="spinner" fluid :class="$vuetify.theme.dark ? 'torus-dark' : ''">
        <BoxLoader :force-spinner="true" />
        <p class="bottom-text text-body-1 text-center font-weight-medium">
          {{ t('login.loader') }}
        </p>
      </v-container>
    </template>
    <v-snackbar v-model="snackbar" :color="snackbarColor">
      {{ snackbarText }}
      <v-btn dark text @click="snackbar = false">{{ t('walletTopUp.close') }}</v-btn>
    </v-snackbar>
  </div>
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
      wallet: 'wallet',
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
    if (this.selectedAddress !== '' && Object.keys(this.wallet) > 0) this.$router.push(this.$route.query.redirect || '/wallet').catch((_) => {})

    this.isLogout = this.$route.name !== 'login'
    // if (!this.isLogout) {
    //   // auto login if openlogin session is available
    //   this.loginInProgress = true
    //   try {
    //     const { state } = await getOpenLoginInstance()
    //     if (state.walletKey || state.tKey) {
    //       log.info('auto-login with openlogin session')
    //       await this.autoLogin({ openloginState: state, calledFromEmbed: false })
    //     }
    //   } catch (error) {
    //     log.error(error)
    //   } finally {
    //     this.loginInProgress = false
    //   }
    // }

    this.scroll()
  },
  methods: {
    ...mapActions({
      triggerLogin: 'triggerLogin',
      handleLogin: 'handleLogin',
      autoLogin: 'autoLogin',
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
        this.snackbarText = error.message?.includes('email_verified') ? this.t('login.errorVerifyEmail') : this.t('login.loginError')
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
