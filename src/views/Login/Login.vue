<template>
  <div :class="[{ 'background-login': !loggedIn }, 'default']">
    <template v-if="!loginInProgress">
      <v-layout wrap fill-height align-center justify-center class="login-panel-left" :class="$vuetify.theme.dark ? 'torus-dark' : ''">
        <v-flex xs12 sm8 md6>
          <v-layout v-if="!isLogout" wrap>
            <v-flex v-if="$vuetify.breakpoint.xsOnly" class="mobile-login-container" xs12>
              <section class="py-10 py-sm-12">
                <v-layout wrap>
                  <v-flex class="mb-6" xs10 sm8 ml-auto mr-auto>
                    <img
                      height="25"
                      :src="require(`../../assets/images/torus-logo-${$vuetify.theme.dark ? 'white' : 'blue'}.svg`)"
                      alt="Torus Logo"
                    />
                  </v-flex>
                  <LoginTitle v-if="activeMobileButton" :active-button-details="activeMobileButtonDetails" class="mb-6" />
                  <LoginButtons
                    :login-buttons-array="loginButtonsArray"
                    @setActiveMobileBtn="(verifier) => (activeMobileButton = verifier)"
                    @triggerLogin="startLogin"
                  />
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
              <v-icon v-if="scrollOnTop" class="more-icon">$vuetify.icons.login_more</v-icon>
            </v-flex>
            <!-- Desktop -->
            <v-flex v-else xs12>
              <v-layout wrap>
                <v-flex class="mb-5" xs10 sm8 ml-auto mr-auto>
                  <img height="25" :src="require(`../../assets/images/torus-logo-${$vuetify.theme.dark ? 'white' : 'blue'}.svg`)" alt="Torus Logo" />
                </v-flex>
                <LoginTitle v-if="activeButton" :active-button-details="activeButtonDetails" />
                <!-- <v-flex xs10 sm8 ml-auto mr-auto :class="[$vuetify.breakpoint.xsOnly ? 'mt-8' : 'mt-10']">
                  <div class="headline font-weight-regular" :class="$vuetify.theme.dark ? '' : 'text_2--text'">{{ t('login.signUpIn') }}</div>
                </v-flex> -->
                <v-flex xs8 mx-auto mt-4>
                  <LoginButtons
                    :login-buttons-array="loginButtonsArray"
                    :active-button="activeButton"
                    @setActiveBtn="(verifier) => (activeButton = verifier)"
                    @triggerLogin="startLogin"
                  />
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
      <component :is="activeLoader" />
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

import LoginButtons from '../../components/Login/LoginButtons'
import LoginFooter from '../../components/Login/LoginFooter'
import LoginSlide from '../../components/Login/LoginSlide'
import LoginTitle from '../../components/Login/LoginTitle'
import config from '../../config'
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
import { HandlerFactory as createHandler } from '../../handlers/Auth'
import { handleRedirectParameters, thirdPartyAuthenticators } from '../../utils/utils'

export default {
  name: 'Login',
  components: { LoginButtons, LoginFooter, LoginSlide, LoginTitle, WalletLoginLoader, WalletLoginLoaderMobile },
  data() {
    return {
      isLogout: false,
      activeButton: '',
      activeMobileButton: '',
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
      tKeyOnboardingComplete: 'tKeyOnboardingComplete',
      loginConfig: (state) => state.embedState.loginConfig,
    }),
    ...mapGetters(['loginButtonsArray']),
    loggedIn() {
      return this.selectedAddress !== '' && !this.loginInProgress
    },
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
    activeButtonDetails() {
      return this.loginButtonsArray.find((x) => x.verifier === this.activeButton)
    },
    activeMobileButtonDetails() {
      return this.loginButtonsArray.find((x) => x.verifier === this.activeMobileButton)
    },
    thirdPartyAuthenticators() {
      return thirdPartyAuthenticators(this.loginConfig)
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

    try {
      const hash = this.$router.currentRoute.hash.slice(1)
      const queryParameters = this.$router.currentRoute.query
      const { error, instanceParameters, hashParameters } = handleRedirectParameters(hash, queryParameters)
      if (error) throw new Error(error)
      const { verifier: returnedVerifier } = instanceParameters
      if (returnedVerifier) this.loginInProgress = true
      else return
      const { access_token: accessToken, id_token: idToken } = hashParameters
      const currentVeriferConfig = this.loginConfig[returnedVerifier]
      const { typeOfLogin, clientId, jwtParameters } = currentVeriferConfig
      const loginHandler = createHandler({
        typeOfLogin,
        clientId,
        verifier: returnedVerifier,
        redirect_uri: '',
        preopenInstanceId: '',
        jwtParameters: jwtParameters || {},
      })
      const userInfo = await loginHandler.getUserInfo({ accessToken, idToken })
      const { profileImage, name, email, verifierId, typeOfLogin: returnTypeOfLogin } = userInfo
      this.setUserInfo({
        profileImage,
        name,
        email,
        verifierId,
        verifier: returnedVerifier,
        verifierParams: { verifier_id: verifierId },
        typeOfLogin: returnTypeOfLogin,
      })
      await this.handleLogin({ calledFromEmbed: false, oAuthToken: idToken || accessToken })
    } catch (error) {
      log.error(error)
      this.snackbar = true
      this.snackbarColor = 'error'
      this.snackbarText = error.message?.includes('email_verified') ? this.t('login.errorVerifyEmail') : this.t('login.loginError')
    } finally {
      this.loginInProgress = false
    }
  },
  beforeDestroy() {
    clearInterval(this.activeMobileButtonInterval)
  },
  methods: {
    ...mapActions({
      triggerLogin: 'triggerLogin',
      handleLogin: 'handleLogin',
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
