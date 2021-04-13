<template>
  <div :class="[{ 'background-login': !loggedIn }, 'default']">
    <template v-if="!loginInProgress">
      <v-layout wrap fill-height align-center justify-center class="login-panel-left" :class="$vuetify.theme.dark ? 'torus-dark' : ''">
        <v-flex xs12 sm8 md6>
          <v-layout v-if="!isLogout" wrap>
            <v-flex v-if="$vuetify.breakpoint.xsOnly" class="mobile-login-container" xs12>
              <section class="py-12">
                <v-layout wrap>
                  <v-flex class="mb-5" xs10 sm8 ml-auto mr-auto>
                    <img
                      width="180"
                      :src="require(`../../assets/images/torus-logo-${$vuetify.theme.dark ? 'white' : 'blue'}.svg`)"
                      alt="Torus Logo"
                    />
                  </v-flex>
                  <v-flex class="mb-2" xs10 sm8 ml-auto mr-auto>
                    <div class="verifier-title font-weight-bold display-1">
                      <span class="text_2--text">
                        {{ t('login.your') }}
                        <template v-if="activeMobileButton">
                          <span v-if="activeMobileButton === GOOGLE_VERIFIER">
                            <span class="verifier-title__google-blue">G</span>
                            <span class="verifier-title__google-red">o</span>
                            <span class="verifier-title__google-yellow">o</span>
                            <span class="verifier-title__google-blue">g</span>
                            <span class="verifier-title__google-green">l</span>
                            <span class="verifier-title__google-red">e</span>
                          </span>
                          <span
                            v-else
                            class="text-capitalize"
                            :class="[
                              `verifier-title__${activeMobileButtonDetails.name.toLowerCase()}`,
                              { 'white--text': activeMobileButtonDetails.hasLightLogo && $vuetify.theme.dark },
                            ]"
                          >
                            {{ activeMobileButtonDetails.name }}
                          </span>
                        </template>
                      </span>
                    </div>
                    <div class="font-weight-bold headline text_2--text">
                      {{ t('login.digitalWallet') }}
                    </div>
                  </v-flex>
                  <LoginButtons :active="activeButton" @setActiveBtn="(verifier) => (activeButton = verifier)" @triggerLogin="startLogin" />
                  <v-flex xs10 sm8 ml-auto mr-auto mb-6 class="footer-notes">
                    <div class="text_3--text mb-4">
                      <div class="text_2--text mb-2 font-weight-bold">{{ t('login.note') }}:</div>
                      <div class="mb-2">{{ t('login.dataPrivacy') }}</div>
                      <div v-if="thirdPartyAuthenticators.length > 0">
                        <span>{{ t('dappLogin.termsAuth01') }}</span>
                        <br />
                        <span>{{ thirdPartyAuthenticators }}.</span>
                        <a
                          class="privacy-learn-more text_3--text"
                          href="https://docs.tor.us/how-torus-works/oauth2-vs-proxy-sign-in"
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          {{ t('dappLogin.termsLearnMore') }}
                        </a>
                      </div>
                    </div>
                    <v-divider class="mb-2" />
                    <div class="d-flex justify-center footer-links">
                      <div class="mx-2">
                        <a href="https://docs.tor.us/legal/terms-and-conditions" target="_blank" rel="noreferrer noopener">
                          {{ t('dappLogin.termsConditions') }}
                        </a>
                      </div>
                      <div class="mx-2">
                        <a href="https://docs.tor.us/legal/privacy-policy" target="_blank" rel="noreferrer noopener">
                          {{ t('dappLogin.privacyPolicy') }}
                        </a>
                      </div>
                      <div class="mx-2">
                        <a href="https://t.me/TorusLabs" target="_blank" rel="noreferrer noopener">
                          {{ t('dappLogin.contactUs') }}
                        </a>
                      </div>
                    </div>
                  </v-flex>
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
                  <img width="180" :src="require(`../../assets/images/torus-logo-${$vuetify.theme.dark ? 'white' : 'blue'}.svg`)" alt="Torus Logo" />
                </v-flex>
                <v-flex xs10 sm8 ml-auto mr-auto>
                  <div class="verifier-title font-weight-bold" :class="[$vuetify.breakpoint.xsOnly ? 'display-1' : 'display-2']">
                    <span class="text_2--text">
                      {{ t('login.your') }}
                      <span v-if="activeButton === GOOGLE_VERIFIER">
                        <span class="verifier-title__google-blue">G</span>
                        <span class="verifier-title__google-red">o</span>
                        <span class="verifier-title__google-yellow">o</span>
                        <span class="verifier-title__google-blue">g</span>
                        <span class="verifier-title__google-green">l</span>
                        <span class="verifier-title__google-red">e</span>
                      </span>
                      <span
                        v-else-if="activeButton"
                        class="text-capitalize"
                        :class="[
                          `verifier-title__${activeButtonDetails.name.toLowerCase()}`,
                          { 'white--text': activeButtonDetails.hasLightLogo && $vuetify.theme.dark },
                        ]"
                      >
                        {{ activeButtonDetails.name }}
                      </span>
                    </span>
                  </div>
                  <div class="font-weight-bold text_2--text" :class="[$vuetify.breakpoint.xsOnly ? 'headline' : 'display-2']">
                    {{ t('login.digitalWallet') }}
                  </div>
                </v-flex>
                <v-flex xs10 sm8 ml-auto mr-auto :class="[$vuetify.breakpoint.xsOnly ? 'mt-8' : 'mt-10']">
                  <div class="headline font-weight-regular" :class="$vuetify.theme.dark ? '' : 'text_2--text'">{{ t('login.signUpIn') }}</div>
                </v-flex>
                <v-flex xs8 mx-auto mt-4>
                  <LoginButtons :active="activeButton" @setActiveBtn="(verifier) => (activeButton = verifier)" @triggerLogin="startLogin" />
                </v-flex>
                <v-flex xs10 sm8 ml-auto mr-auto mb-6 class="footer-notes" :class="{ 'not-sm': !$vuetify.breakpoint.xsOnly }">
                  <div class="text_3--text mb-6">
                    <div class="text_2--text mb-2 font-weight-bold">{{ t('login.note') }}:</div>
                    <div class="mb-2">{{ t('login.dataPrivacy') }}</div>
                    <div v-if="thirdPartyAuthenticators.length > 0">
                      <span>{{ t('dappLogin.termsAuth01') }}</span>
                      <br />
                      <span>{{ thirdPartyAuthenticators }}.</span>
                      <a
                        class="privacy-learn-more text_3--text"
                        href="https://docs.tor.us/how-torus-works/oauth2-vs-proxy-sign-in"
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {{ t('dappLogin.termsLearnMore') }}
                      </a>
                    </div>
                  </div>
                  <v-divider class="mb-2" />
                  <div class="d-flex footer-links">
                    <div class="mr-4">
                      <a href="https://docs.tor.us/legal/terms-and-conditions" target="_blank" rel="noreferrer noopener">
                        {{ t('dappLogin.termsConditions') }}
                      </a>
                    </div>
                    <div class="mr-4">
                      <a href="https://docs.tor.us/legal/privacy-policy" target="_blank" rel="noreferrer noopener">
                        {{ t('dappLogin.privacyPolicy') }}
                      </a>
                    </div>
                    <div class="mr-4">
                      <a href="https://t.me/TorusLabs" target="_blank" rel="noreferrer noopener">
                        {{ t('dappLogin.contactUs') }}
                      </a>
                    </div>
                  </div>
                </v-flex>
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
import LoginSlide from '../../components/Login/LoginSlide'
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
import { GOOGLE, GOOGLE_VERIFIER } from '../../utils/enums'
import { handleRedirectParameters, thirdPartyAuthenticators } from '../../utils/utils'

export default {
  name: 'Login',
  components: { LoginButtons, LoginSlide, WalletLoginLoader, WalletLoginLoaderMobile },
  data() {
    return {
      isLogout: false,
      GOOGLE,
      GOOGLE_VERIFIER,
      activeButton: '',
      activeMobileButton: '',
      activeMobileButtonInterval: null,
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
    loginButtons() {
      return this.loginButtonsArray.filter((button) => button.showOnDesktop && !button.torusDescription)
    },
    loginButtonsLong() {
      return this.loginButtonsArray.filter((button) => button.showOnDesktop && button.torusDescription)
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

    if (this.loginButtons.length > 0) this.activeButton = this.loginButtons[0].verifier
    else if (this.loginButtonsLong.length > 0) this.activeButton = this.loginButtonsLong[0].verifier

    this.animateVerifier()
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
    async startLogin(verifier) {
      try {
        this.loginInProgress = true
        await this.triggerLogin({ verifier, calledFromEmbed: false })
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
    animateVerifier() {
      const verifiers = this.loginButtonsArray.filter((button) => button.showOnMobile)
      if (verifiers.length > 0) {
        let counter = 0

        clearInterval(this.activeMobileButtonInterval)
        this.activeMobileButtonInterval = setInterval(() => {
          if (counter >= verifiers.length) {
            counter = 0
          }
          this.activeMobileButton = verifiers[counter].verifier
          counter += 1
        }, 1000)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'Login.scss';
</style>
