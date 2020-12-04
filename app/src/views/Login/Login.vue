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
                        <img
                          :src="require(`../../assets/images/login-verifiers-${$vuetify.theme.dark ? 'dark' : 'light'}.gif`)"
                          alt="Login Verifiers"
                        />
                      </span>
                    </div>
                    <div class="font-weight-bold headline text_2--text">
                      {{ t('login.digitalWallet') }}
                    </div>
                  </v-flex>
                  <v-flex v-if="showGoogleLogin" xs10 sm8 ml-auto mt-2 mr-auto>
                    <v-btn
                      id="loginBtn"
                      :color="$vuetify.theme.dark ? '' : 'white'"
                      block
                      :class="$vuetify.theme.dark ? 'torus-dark' : ''"
                      class="text-body-1 font-weight-bold card-shadow-v8 text_2--text login-btn-google gmt-login gmt-login-google"
                      @click="startLogin(GOOGLE_VERIFIER)"
                    >
                      <img
                        class="mr-5"
                        src="../../assets/img/icons/login-google.svg"
                        :class="$vuetify.theme.dark ? 'torus-dark' : ''"
                        alt="Google Icon"
                      />
                      {{ t('login.signIn') }} Google
                    </v-btn>
                  </v-flex>
                  <v-flex xs10 sm8 ml-auto mr-auto>
                    <v-layout wrap mx-n1>
                      <v-flex v-for="verifier in loginButtonsMobile" :key="verifier.verifier" xs6 px-1 mt-2>
                        <v-btn
                          class="login-btn login-btn--mobile gmt-login"
                          :class="[{ isDark: $vuetify.theme.dark }, `gmt-login-${verifier.name.toLowerCase()}`]"
                          type="button"
                          :title="`${t('login.loginWith')} ${verifier.name}`"
                          @click="startLogin(verifier.verifier)"
                        >
                          <img
                            :src="
                              require(`../../assets/img/icons/login-${verifier.name.toLowerCase()}${
                                $vuetify.theme.isDark && verifier.hasLightLogo ? '-light' : ''
                              }.svg`)
                            "
                            :alt="`${verifier.name} Icon`"
                          />
                        </v-btn>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex v-if="loginButtonsMobileLong.length > 0" xs10 sm8 ml-auto mr-auto mt-4 class="text-center">
                    <div class="d-flex align-center">
                      <v-divider></v-divider>
                      <div :class="$vuetify.breakpoint.xsOnly ? 'px-5' : 'px-4'">
                        <div class="body-2 text_2--text">{{ t('login.or') }}</div>
                      </div>
                      <v-divider></v-divider>
                    </div>
                    <div v-for="verifier in loginButtonsMobileLong" :key="verifier.verifier" class="mt-4">
                      <v-btn
                        :id="`${verifier.name}LoginBtn`"
                        :color="$vuetify.theme.dark ? '' : 'white'"
                        block
                        :class="[$vuetify.theme.dark ? 'torus-dark' : '', `login-btn-${verifier.name.toLowerCase()}`]"
                        class="text-body-1 font-weight-bold card-shadow-v8 text_2--text login-btn-long"
                        @click="startLogin(verifier.verifier)"
                      >
                        <v-icon class="mr-4">{{ `$vuetify.icons.${verifier.name.toLowerCase()}` }}</v-icon>
                        {{ formatDescription(verifier) }}
                      </v-btn>
                    </div>
                  </v-flex>
                  <v-flex xs10 sm8 ml-auto mr-auto mb-6 class="footer-notes">
                    <div class="text_3--text mb-4">
                      <div class="text_2--text mb-2 font-weight-bold">{{ t('login.note') }}:</div>
                      <div class="mb-2">{{ t('login.dataPrivacy') }}</div>
                      <span>{{ t('dappLogin.termsAuth01') }}</span>
                      <br />
                      <span>{{ t('dappLogin.termsAuth02') }}</span>
                      <a
                        class="privacy-learn-more text_3--text"
                        href="https://docs.tor.us/how-torus-works/oauth2-vs-proxy-sign-in"
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {{ t('dappLogin.termsLearnMore') }}
                      </a>
                    </div>
                    <v-divider class="mb-2"></v-divider>
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
                <v-carousel height="650" interval="7000" :show-arrows="false" hide-delimiters>
                  <v-carousel-item v-for="slide in 3" :key="slide" reverse-transition="fade-transition" transition="fade-transition">
                    <v-layout align-center fill-height px-10>
                      <v-flex class="text-center">
                        <img
                          class="mb-6 login-panel-right__image"
                          :src="require(`../../assets/images/login-bg-${$vuetify.theme.dark ? 'dark-' : ''}${slide}.svg`)"
                          alt="Login Carousel"
                        />
                        <div class="headline mb-3 text_2--text">{{ t(`login.slide${slide}Title`) }}</div>
                        <div class="caption text_2--text">{{ t(`login.slide${slide}Subtitle1`) }}</div>
                        <div class="caption text_2--text">{{ t(`login.slide${slide}Subtitle2`) }}</div>
                        <v-btn
                          class="learn-more-btn mt-6"
                          :class="{ isDark: $vuetify.theme.dark, isMobile: $vuetify.breakpoint.xsOnly }"
                          href="https://tor.us"
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          {{ t('login.visitOurWebsite') }}
                        </v-btn>
                      </v-flex>
                    </v-layout>
                  </v-carousel-item>
                </v-carousel>
              </section>
              <v-icon v-if="scrollOnTop" class="more-icon">$vuetify.icons.login_more</v-icon>
            </v-flex>
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
                <v-flex xs10 sm8 mx-auto mt-4>
                  <div :style="{ maxWidth: '380px' }">
                    <v-btn
                      v-for="verifier in loginButtons"
                      :key="verifier.verifier"
                      class="login-btn gmt-login"
                      :class="[
                        { active: verifier.verifier === activeButton, isDark: $vuetify.theme.dark },
                        `gmt-login-${verifier.name.toLowerCase()}`,
                      ]"
                      type="button"
                      :title="`${t('login.loginWith')} ${verifier.name}`"
                      @click="startLogin(verifier.verifier)"
                      @mouseover="activeButton = verifier.verifier"
                    >
                      <img
                        v-if="verifier.verifier === activeButton"
                        :src="
                          require(`../../assets/img/icons/login-${verifier.name.toLowerCase()}${
                            verifier.hasLightLogo && $vuetify.theme.dark ? '-light' : ''
                          }.svg`)
                        "
                        :alt="`${verifier.name} Icon`"
                      />
                      <v-icon v-else class="text_3--text">
                        {{ `$vuetify.icons.${verifier.name.toLowerCase()}` }}
                      </v-icon>
                    </v-btn>
                  </div>
                </v-flex>
                <v-flex v-if="loginButtonsLong.length > 0" xs10 sm8 ml-auto mr-auto mt-4 class="text-center">
                  <div class="d-flex align-center mb-4" :style="{ maxWidth: '372px' }">
                    <v-divider></v-divider>
                    <div :class="$vuetify.breakpoint.xsOnly ? 'px-5' : 'px-4'">
                      <div class="body-2 text_2--text">{{ t('login.or') }}</div>
                    </div>
                    <v-divider></v-divider>
                  </div>
                  <div v-for="verifier in loginButtonsLong" :key="verifier.verifier" class="mt-2" :style="{ maxWidth: '372px' }">
                    <v-btn
                      id="emailLoginBtn"
                      :color="$vuetify.theme.dark ? '' : 'white'"
                      block
                      :class="$vuetify.theme.dark ? 'torus-dark' : ''"
                      class="text-body-1 font-weight-bold card-shadow-v8 text_2--text login-btn-long"
                      @click="startLogin(verifier.verifier)"
                      @mouseover="activeButton = verifier.verifier"
                    >
                      <img
                        v-if="verifier.verifier === activeButton"
                        height="24"
                        class="mr-4"
                        :src="require(`../../assets/img/icons/login-${verifier.name.toLowerCase()}.svg`)"
                        :alt="`${verifier.name} Icon`"
                      />
                      <v-icon v-else class="mr-4">{{ `$vuetify.icons.${verifier.name.toLowerCase()}` }}</v-icon>
                      {{ formatDescription(verifier) }}
                    </v-btn>
                  </div>
                </v-flex>
                <v-flex xs10 sm8 ml-auto mr-auto mb-6 class="footer-notes" :class="{ 'not-sm': !$vuetify.breakpoint.xsOnly }">
                  <div class="text_3--text mb-6">
                    <div class="text_2--text mb-2 font-weight-bold">{{ t('login.note') }}:</div>
                    <div class="mb-2">{{ t('login.dataPrivacy') }}</div>
                    <span>{{ t('dappLogin.termsAuth01') }}</span>
                    <br />
                    <span>{{ t('dappLogin.termsAuth02') }}</span>
                    <a
                      class="privacy-learn-more text_3--text"
                      href="https://docs.tor.us/how-torus-works/oauth2-vs-proxy-sign-in"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {{ t('dappLogin.termsLearnMore') }}
                    </a>
                  </div>
                  <v-divider class="mb-2"></v-divider>
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
              <v-carousel cycle height="650" interval="7000" :show-arrows="false">
                <v-carousel-item v-for="slide in 3" :key="slide" reverse-transition="fade-transition" transition="fade-transition">
                  <div class="d-flex flex-column fill-height justify-end pb-12">
                    <div class="text-center">
                      <img
                        class="mb-7 login-panel-right__image"
                        :src="require(`../../assets/images/login-bg-${$vuetify.theme.dark ? 'dark-' : ''}${slide}.svg`)"
                        alt="Login Carousel"
                      />
                    </div>
                    <div class="display-1 mb-3 font-weight-medium text_2--text">{{ t(`login.slide${slide}Title`) }}</div>
                    <div class="text-body-1 text_2--text">{{ t(`login.slide${slide}Subtitle1`) }}</div>
                    <div class="text-body-1 text_2--text">{{ t(`login.slide${slide}Subtitle2`) }}</div>
                    <div class="mb-5">
                      <v-btn
                        class="learn-more-btn gmt-learn-more text_2--text"
                        :class="{ isDark: $vuetify.theme.dark }"
                        href="https://tor.us"
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {{ t('login.visitOurWebsite') }}
                      </v-btn>
                    </div>
                  </div>
                </v-carousel-item>
              </v-carousel>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </template>
    <template v-else>
      <component :is="activeLoader"></component>
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
import { handleRedirectParameters } from '../../utils/utils'

export default {
  name: 'Login',
  components: { WalletLoginLoader, WalletLoginLoaderMobile },
  data() {
    return {
      isLogout: false,
      GOOGLE,
      GOOGLE_VERIFIER,
      activeButton: '',
      loginInProgress: false,
      snackbar: false,
      snackbarText: '',
      snackbarColor: 'error',
      scrollOnTop: true,
    }
  },
  computed: {
    ...mapState({
      selectedAddress: 'selectedAddress',
      tKeyOnboardingComplete: 'tKeyOnboardingComplete',
      loginConfig: (state) => state.embedState.loginConfig,
      tKeyExists: 'tKeyExists',
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
    loginButtonsMobile() {
      return this.loginButtonsArray.filter((button) => button.showOnMobile && button.typeOfLogin !== GOOGLE && !button.torusDescription)
    },
    loginButtonsLong() {
      return this.loginButtonsArray.filter((button) => button.showOnDesktop && button.torusDescription)
    },
    loginButtonsMobileLong() {
      return this.loginButtonsArray.filter((button) => button.showOnMobile && button.typeOfLogin !== GOOGLE && button.torusDescription)
    },
    showGoogleLogin() {
      return this.loginConfig[GOOGLE_VERIFIER].showOnModal && this.loginConfig[GOOGLE_VERIFIER].showOnMobile
    },
    activeButtonDetails() {
      return this.loginButtonsArray.find((x) => x.verifier === this.activeButton)
    },
  },
  watch: {
    selectedAddress(newAddress, oldAddress) {
      if (newAddress !== oldAddress && newAddress !== '') {
        let redirectPath = this.$route.query.redirect
        if (!this.tKeyOnboardingComplete && !this.tKeyExists) redirectPath = `/tkey?redirect=${redirectPath || '/wallet/home'}`
        else if (redirectPath === undefined || (redirectPath && redirectPath.includes('index.html'))) redirectPath = '/wallet/home'

        this.$router.push(redirectPath).catch((_) => {})
      }
    },
  },
  async mounted() {
    if (this.selectedAddress !== '') this.$router.push(this.$route.query.redirect || '/wallet').catch((_) => {})

    this.isLogout = this.$route.name !== 'login'

    if (this.loginButtons.length > 0) this.activeButton = this.loginButtons[0].verifier
    else if (this.loginButtonsLong.length > 0) this.activeButton = this.loginButtonsLong[0].verifier

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
      this.snackbarText = error.message.includes('email_verified') ? this.t('login.errorVerifyEmail') : this.t('login.loginError')
    } finally {
      this.loginInProgress = false
    }
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
        this.snackbarText = error.message.includes('email_verified') ? this.t('login.errorVerifyEmail') : this.t('login.loginError')
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
    formatDescription(verifier) {
      const finalDesc = verifier.torusDescription ? this.t(verifier.torusDescription) : this.t('dappLogin.continue')
      return finalDesc.replace(/{verifier}/gi, verifier.name.charAt(0).toUpperCase() + verifier.name.slice(1))
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'Login.scss';
</style>
