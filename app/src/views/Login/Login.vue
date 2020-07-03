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
                        <img :src="require(`../../assets/images/login-verifiers.gif`)" alt="Login Verifiers" />
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
                      class="body-1 font-weight-bold card-shadow-v8 text_2--text login-btn-google gmt-login gmt-login-google"
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
                      <v-flex v-for="verifier in loginButtonsMobile" :key="verifier.typeOfLogin" xs6 px-1 mt-2>
                        <v-btn
                          class="login-btn login-btn--mobile gmt-login"
                          :class="[{ isDark: $vuetify.theme.dark }, `gmt-login-${verifier.typeOfLogin}`]"
                          type="button"
                          :title="`${t('login.loginWith')} ${verifier.name}`"
                          @click="startLogin(verifier.verifier)"
                        >
                          <img :src="require(`../../assets/img/icons/login-${verifier.typeOfLogin}.svg`)" :alt="`${verifier.typeOfLogin} Icon`" />
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
                    <div v-for="verifier in loginButtonsMobileLong" :key="verifier.typeOfLogin" class="mt-4">
                      <v-btn
                        :id="`${verifier.typeOfLogin}LoginBtn`"
                        :color="$vuetify.theme.dark ? '' : 'white'"
                        block
                        :class="[$vuetify.theme.dark ? 'torus-dark' : '', `login-btn-${verifier.typeOfLogin}`]"
                        class="body-1 font-weight-bold card-shadow-v8 text_2--text login-btn-long"
                        @click="startLogin(verifier.verifier)"
                      >
                        <v-icon class="mr-4">{{ `$vuetify.icons.${verifier.typeOfLogin}` }}</v-icon>
                        {{ t(verifier.description) }}
                      </v-btn>
                    </div>
                  </v-flex>
                  <v-flex xs10 sm8 ml-auto mr-auto my-6>
                    <span class="body-1 text_2--text">
                      {{ t('login.acceptTerms') }}
                      <a href="https://docs.tor.us/legal/terms-and-conditions" target="_blank" rel="noreferrer noopener">
                        <span class="torusBrand1--text">{{ t('login.termsAndConditions') }}</span>
                      </a>
                    </span>
                  </v-flex>
                </v-layout>
              </section>
              <section>
                <v-carousel cycle height="650" interval="7000" :show-arrows="false" hide-delimiters>
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
                <v-flex class="mb-2" xs10 sm8 ml-auto mr-auto>
                  <div class="verifier-title font-weight-bold" :class="[$vuetify.breakpoint.xsOnly ? 'display-1' : 'display-2']">
                    <span class="text_2--text">
                      {{ t('login.your') }}
                      <span v-if="activeButton === GOOGLE">
                        <span class="verifier-title__google-blue">G</span>
                        <span class="verifier-title__google-red">o</span>
                        <span class="verifier-title__google-yellow">o</span>
                        <span class="verifier-title__google-blue">g</span>
                        <span class="verifier-title__google-green">l</span>
                        <span class="verifier-title__google-red">e</span>
                      </span>
                      <span v-else-if="activeButton" class="text-capitalize" :class="`verifier-title__${activeButton}`">{{ activeButton }}</span>
                    </span>
                  </div>
                  <div class="font-weight-bold text_2--text" :class="[$vuetify.breakpoint.xsOnly ? 'headline' : 'display-2']">
                    {{ t('login.digitalWallet') }}
                  </div>
                </v-flex>
                <v-flex xs10 sm8 ml-auto mr-auto :class="[$vuetify.breakpoint.xsOnly ? 'mt-8' : 'mt-11']">
                  <div class="headline font-weight-light" :class="$vuetify.theme.dark ? '' : 'text_2--text'">{{ t('login.signUpIn') }}</div>
                </v-flex>
                <v-flex xs10 sm8 ml-auto mr-auto mt-4>
                  <v-btn
                    v-for="verifier in loginButtons"
                    :key="verifier.typeOfLogin"
                    class="login-btn gmt-login"
                    :class="[{ active: verifier.name === activeButton, isDark: $vuetify.theme.dark }, `gmt-login-${verifier.typeOfLogin}`]"
                    type="button"
                    :title="`${t('login.loginWith')} ${verifier.name}`"
                    @click="startLogin(verifier.verifier)"
                    @mouseover="activeButton = verifier.name"
                  >
                    <img
                      v-if="verifier.name === activeButton"
                      :src="require(`../../assets/img/icons/login-${verifier.typeOfLogin}.svg`)"
                      :alt="`${verifier.name} Icon`"
                    />
                    <v-icon v-else :class="$vuetify.theme.dark ? 'white--text' : 'loginBtnGray--text'">
                      {{ `$vuetify.icons.${verifier.typeOfLogin}` }}
                    </v-icon>
                  </v-btn>
                </v-flex>
                <v-flex v-if="loginButtonsLong.length > 0" xs10 sm8 ml-auto mr-auto mt-4 class="text-center">
                  <div class="d-flex align-center mb-4">
                    <v-divider></v-divider>
                    <div :class="$vuetify.breakpoint.xsOnly ? 'px-5' : 'px-4'">
                      <div class="body-2 text_2--text">{{ t('login.or') }}</div>
                    </div>
                    <v-divider></v-divider>
                  </div>
                  <div v-for="verifier in loginButtonsLong" :key="verifier.typeOfLogin" class="mt-2">
                    <v-btn
                      id="emailLoginBtn"
                      :color="$vuetify.theme.dark ? '' : 'white'"
                      block
                      :class="$vuetify.theme.dark ? 'torus-dark' : ''"
                      class="body-1 font-weight-bold card-shadow-v8 text_2--text login-btn-long"
                      @click="startLogin(verifier.verifier)"
                    >
                      <v-icon class="mr-4">{{ `$vuetify.icons.${verifier.typeOfLogin}` }}</v-icon>
                      {{ t(verifier.description) }}
                    </v-btn>
                  </div>
                </v-flex>
                <v-flex mb-6 xs10 sm8 ml-auto mr-auto mt-2>
                  <span class="body-1 text_2--text">
                    {{ t('login.acceptTerms') }}
                    <a href="https://docs.tor.us/legal/terms-and-conditions" target="_blank" rel="noreferrer noopener">
                      <span class="torusBrand1--text">{{ t('login.termsAndConditions') }}</span>
                    </a>
                  </span>
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
              <div class="text-center subtitle-1 font-weight-bold">{{ t('login.beenLoggedOut') }}</div>
            </v-flex>
            <v-flex xs12 mt-4>
              <div class="text-center">
                <v-btn
                  :color="$vuetify.theme.dark ? '' : 'white'"
                  :class="$vuetify.theme.dark ? 'torus-dark' : 'card-shadow-v8'"
                  :depressed="$vuetify.theme.dark"
                  class="px-12 pa-3 font-weight-bold body-1 text-uppercase torusBrand1--text logout-btn"
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
                    <div class="body-1 text_2--text">{{ t(`login.slide${slide}Subtitle1`) }}</div>
                    <div class="body-1 text_2--text">{{ t(`login.slide${slide}Subtitle2`) }}</div>
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
    <!-- TODO trigger sendLink  -->
    <PasswordlessLogin
      :passwordless-login-dialog="passwordlessLoginDialog"
      :passwordless-email-sent="passwordlessEmailSent"
      @cancel="
        passwordlessLoginDialog = false
        passwordlessEmailSent = false
      "
      @sendLink="passwordlessEmailSent = true"
    />
  </div>
</template>

<script>
import log from 'loglevel'
import { mapActions, mapGetters, mapState } from 'vuex'

import PasswordlessLogin from '../../components/helpers/PasswordLessLogin'
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
import { GOOGLE, GOOGLE_VERIFIER, PASSWORDLESS } from '../../utils/enums'

export default {
  name: 'Login',
  components: { WalletLoginLoader, WalletLoginLoaderMobile, PasswordlessLogin },
  data() {
    return {
      isLogout: false,
      GOOGLE,
      GOOGLE_VERIFIER,
      PASSWORDLESS,
      activeButton: GOOGLE,
      loginInProgress: false,
      snackbar: false,
      snackbarText: '',
      snackbarColor: 'error',
      passwordlessLoginDialog: false,
      passwordlessEmailSent: false,
      scrollOnTop: true,
    }
  },
  computed: {
    ...mapState({
      selectedAddress: 'selectedAddress',
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
      return this.loginButtonsArray.filter((button) => !button.description && button.typeOfLogin !== PASSWORDLESS)
    },
    loginButtonsMobile() {
      return this.loginButtonsArray.filter((button) => button.typeOfLogin !== GOOGLE && !button.description && button.typeOfLogin !== PASSWORDLESS)
    },
    loginButtonsLong() {
      return this.loginButtonsArray.filter((button) => button.description && button.typeOfLogin !== PASSWORDLESS)
    },
    loginButtonsMobileLong() {
      return this.loginButtonsArray.filter((button) => button.typeOfLogin !== GOOGLE && button.description && button.typeOfLogin !== PASSWORDLESS)
    },
    showGoogleLogin() {
      return this.loginConfig[GOOGLE_VERIFIER].showOnModal
    },
  },
  watch: {
    selectedAddress(newAddress, oldAddress) {
      if (newAddress !== oldAddress && newAddress !== '') {
        let redirectPath = this.$route.query.redirect
        if (redirectPath === undefined || (redirectPath && redirectPath.includes('index.html'))) redirectPath = '/wallet'
        this.$router.push(redirectPath).catch((_) => {})
      }
    },
  },
  mounted() {
    if (this.selectedAddress !== '') this.$router.push(this.$route.query.redirect || '/wallet').catch((_) => {})

    this.isLogout = this.$route.name !== 'login'

    this.scroll()
  },
  methods: {
    ...mapActions({
      triggerLogin: 'triggerLogin',
    }),
    async startLogin(verifier) {
      if (verifier === PASSWORDLESS) {
        this.passwordlessLoginDialog = true
        return
      }
      try {
        this.loginInProgress = true
        await this.triggerLogin({ verifier, calledFromEmbed: false })
      } catch (error) {
        log.error(error)
        this.snackbar = true
        this.snackbarColor = 'error'
        this.snackbarText = error.message.includes('email_verified') ? 'Please verify your email first' : this.t('login.loginError')
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
