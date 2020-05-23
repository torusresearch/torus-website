<template>
  <div :class="[{ 'background-login': !loggedIn }, 'default']">
    <template v-if="!loginInProgress">
      <v-layout wrap fill-height align-center justify-center class="login-panel-left" :class="$vuetify.theme.dark ? 'torus-dark' : ''">
        <v-flex xs12 sm8 md6>
          <v-layout v-if="!isLogout" wrap>
            <v-flex v-if="$vuetify.breakpoint.xsOnly" xs12>
              <v-carousel
                v-model="selectedCarouselItem"
                class="mobile-carousel"
                vertical
                interval="7000"
                hide-delimiters
                :touch="{ up: scrollUp, down: scrollDown }"
                next-icon="$vuetify.icons.login_more"
                prev-icon="$vuetify.icons.login_more"
              >
                <v-carousel-item reverse-transition="fade-transition" transition="fade-transition">
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
                    <v-flex xs10 sm8 ml-auto mr-auto mt-8>
                      <div class="headline font-weight-light text_2--text">{{ t('login.signUpIn') }}</div>
                    </v-flex>
                    <v-flex xs10 sm8 ml-auto mt-2 mr-auto>
                      <v-btn
                        id="loginBtn"
                        :color="$vuetify.theme.dark ? '' : 'white'"
                        block
                        :class="$vuetify.theme.dark ? 'torus-dark' : ''"
                        class="body-1 font-weight-bold card-shadow-v8 text_2--text login-btn-google gmt-login gmt-login-google"
                        @click="startLogin(GOOGLE)"
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
                        <v-flex v-for="verifier in loginButtonsMobile" :key="verifier" xs6 px-1 mt-2>
                          <v-btn
                            class="login-btn login-btn--mobile gmt-login"
                            :class="[{ active: verifier === activeButton, isDark: $vuetify.theme.dark }, `gmt-login-${verifier}`]"
                            type="button"
                            :title="`${t('login.loginWith')} ${verifier}`"
                            @click="startLogin(verifier)"
                            @mouseover="loginBtnHover(verifier)"
                          >
                            <img :src="require(`../../assets/img/icons/login-${verifier}.svg`)" :alt="`${verifier} Icon`" />
                          </v-btn>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <v-flex mb-6 xs10 sm8 ml-auto mr-auto mt-12>
                      <span class="body-1 text_2--text">
                        {{ t('login.acceptTerms') }}
                        <a href="https://docs.tor.us/legal/terms-and-conditions" target="_blank" rel="noreferrer noopener">
                          <span class="torusBrand1--text">{{ t('login.termsAndConditions') }}</span>
                        </a>
                      </span>
                    </v-flex>
                  </v-layout>
                </v-carousel-item>
                <v-carousel-item reverse-transition="fade-transition" transition="fade-transition">
                  <v-carousel cycle height="650" interval="7000" :show-arrows="false" hide-delimiters :touch="{ up: scrollUp, down: scrollDown }">
                    <v-layout class="login-panel-right login-panel-right--mobile">
                      <v-flex xs10 text-center mx-auto>
                        <v-carousel-item v-for="slide in 3" :key="slide" reverse-transition="fade-transition" transition="fade-transition">
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
                        </v-carousel-item>
                      </v-flex>
                    </v-layout>
                  </v-carousel>
                </v-carousel-item>
              </v-carousel>
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
                      <span v-else-if="activeButton === FACEBOOK" class="verifier-title__facebook">Facebook</span>
                      <span v-else-if="activeButton === REDDIT" class="verifier-title__reddit">Reddit</span>
                      <span v-else-if="activeButton === TWITCH" class="verifier-title__twitch">Twitch</span>
                      <span v-else-if="activeButton === DISCORD" class="verifier-title__discord">Discord</span>
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
                    :key="verifier"
                    class="login-btn gmt-login"
                    :class="[{ active: verifier === activeButton, isDark: $vuetify.theme.dark }, `gmt-login-${verifier}`]"
                    type="button"
                    :title="`${t('login.loginWith')} ${verifier}`"
                    @click="startLogin(verifier)"
                    @mouseover="activeButton = verifier"
                  >
                    <img v-if="verifier === activeButton" :src="require(`../../assets/img/icons/login-${verifier}.svg`)" :alt="`${verifier} Icon`" />
                    <v-icon v-else :class="$vuetify.theme.dark ? 'white--text' : 'loginBtnGray--text'">{{ `$vuetify.icons.${verifier}` }}</v-icon>
                  </v-btn>
                </v-flex>
                <v-flex mb-6 xs10 sm8 ml-auto mr-auto mt-12>
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
  </div>
</template>

<script>
import log from 'loglevel'
import { mapActions, mapState } from 'vuex'

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
import { DISCORD, FACEBOOK, GOOGLE, REDDIT, TWITCH } from '../../utils/enums'

export default {
  name: 'Login',
  components: { WalletLoginLoader, WalletLoginLoaderMobile },
  data() {
    return {
      isLogout: false,
      GOOGLE,
      FACEBOOK,
      REDDIT,
      TWITCH,
      DISCORD,
      loginButtons: [GOOGLE, FACEBOOK, REDDIT, TWITCH, DISCORD],
      loginButtonsMobile: [FACEBOOK, REDDIT, TWITCH, DISCORD],
      activeButton: GOOGLE,
      selectedCarouselItem: 0,
      loginInProgress: false,
      snackbar: false,
      snackbarText: '',
      snackbarColor: 'error',
    }
  },
  computed: mapState({
    selectedAddress: 'selectedAddress',
    loggedIn: (state) => state.selectedAddress !== '' && !this.loginInProgress,
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
  }),
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
  },
  methods: {
    ...mapActions({
      triggerLogin: 'triggerLogin',
    }),
    async startLogin(verifier) {
      try {
        this.loginInProgress = true
        await this.triggerLogin({ verifier, calledFromEmbed: false })
      } catch (error) {
        log.error(error)
        this.snackbar = true
        this.snackbarColor = 'error'
        this.snackbarText = this.t('login.loginError')
      } finally {
        this.loginInProgress = false
      }
    },
    returnHome() {
      this.$router.push({ path: '/' }).catch((_) => {})
      this.isLogout = false
    },
    loginBtnHover(verifier) {
      if (!this.$vuetify.breakpoint.xsOnly) this.activeButton = verifier
    },
    scrollUp() {
      this.selectedCarouselItem = 1
    },
    scrollDown() {
      this.selectedCarouselItem = 0
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'Login.scss';
</style>
