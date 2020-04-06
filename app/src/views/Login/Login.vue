<template>
  <div :class="[{ 'background-login': !loggedIn }, 'default']">
    <template v-if="!loginInProgress">
      <v-layout wrap fill-height align-center justify-center class="login-panel-left" :class="$vuetify.theme.dark ? 'torus-dark' : ''">
        <v-flex xs12 sm8 md6>
          <v-layout v-if="!isLogout" wrap>
            <v-flex class="mb-5" xs10 sm8 ml-auto mr-auto>
              <img width="180" :src="require(`../../../public/images/torus-logo-${$vuetify.theme.dark ? 'white' : 'blue'}.svg`)" />
            </v-flex>
            <v-flex class="mb-2" xs10 sm8 ml-auto mr-auto>
              <div
                class="verifier-title font-weight-bold"
                :class="[$vuetify.theme.dark ? '' : 'text_2--text', $vuetify.breakpoint.xsOnly ? 'display-1' : 'display-2']"
              >
                <span>
                  Your
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
              <div
                class="font-weight-bold"
                :class="[$vuetify.theme.dark ? '' : 'text_2--text', $vuetify.breakpoint.xsOnly ? 'headline' : 'display-2']"
              >
                digital wallet in one-click
              </div>
            </v-flex>
            <v-flex xs10 sm8 ml-auto mr-auto :class="[$vuetify.breakpoint.xsOnly ? 'mt-8' : 'mt-11']">
              <div class="headline font-weight-light" :class="$vuetify.theme.dark ? '' : 'text_2--text'">Sign up/in with</div>
            </v-flex>
            <v-flex v-if="$vuetify.breakpoint.xsOnly" xs10 sm8 ml-auto mt-2 mr-auto>
              <v-btn
                id="loginBtn"
                :color="$vuetify.theme.dark ? '' : 'white'"
                block
                :class="$vuetify.theme.dark ? 'torus-dark' : ''"
                class="body-1 font-weight-bold card-shadow-v8 text_2--text login-btn-google"
                @click="triggerLogin({ verifier: GOOGLE, calledFromEmbed: false })"
              >
                <img class="mr-5" :src="require(`../../../public/img/icons/login-google.svg`)" :class="$vuetify.theme.dark ? 'torus-dark' : ''" />
                {{ t('login.signIn') }} Google
              </v-btn>
            </v-flex>
            <v-flex v-if="$vuetify.breakpoint.xsOnly" xs10 sm8 ml-auto mr-auto>
              <v-layout wrap mx-n1>
                <v-flex v-for="verifier in loginButtonsMobile" :key="verifier" xs4 px-1 mt-2>
                  <v-btn
                    class="login-btn login-btn--mobile"
                    :class="{ active: verifier === activeButton }"
                    type="button"
                    :title="`${t('login.loginWith')} ${verifier}`"
                    @click="triggerLogin({ verifier: verifier, calledFromEmbed: false })"
                    @mouseover="activeButton = verifier"
                  >
                    <img :src="require(`../../../public/img/icons/login-${verifier}.svg`)" />
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex v-if="!$vuetify.breakpoint.xsOnly" xs10 sm8 ml-auto mr-auto mt-4>
              <v-btn
                v-for="verifier in loginButtons"
                :key="verifier"
                class="login-btn"
                :class="{ active: verifier === activeButton }"
                type="button"
                :title="`${t('login.loginWith')} ${verifier}`"
                @click="triggerLogin({ verifier: verifier, calledFromEmbed: false })"
                @mouseover="activeButton = verifier"
              >
                <img v-if="verifier === activeButton" :src="require(`../../../public/img/icons/login-${verifier}.svg`)" />
                <img v-else :src="require(`../../../public/img/icons/login-${verifier}-${$vuetify.theme.dark ? 'white' : 'grey'}.svg`)" />
              </v-btn>
            </v-flex>
            <v-flex mb-6 xs10 sm8 ml-auto mr-auto mt-12>
              <span class="body-1" :class="$vuetify.theme.dark ? '' : 'text_2--text'">
                {{ t('login.acceptTerms') }}
                <a href="https://docs.tor.us/legal/terms-and-conditions" target="_blank">
                  <span class="torusBrand1--text">{{ t('login.termsAndConditions') }}</span>
                </a>
              </span>
            </v-flex>
          </v-layout>
          <v-layout v-else wrap align-center justify-center align-content-center>
            <v-flex xs12 text-center mb-12>
              <img width="180" :src="require(`../../../public/images/torus-logo-${$vuetify.theme.dark ? 'white' : 'blue'}.svg`)" />
            </v-flex>
            <v-flex xs12 text-center>
              <img width="200px" height="auto" :src="require(`../../../public/images/logout${$vuetify.theme.dark ? '-dark' : ''}.svg`)" />
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
              <v-carousel cycle height="650" interval="4000" :show-arrows="false" hide-delimiters>
                <v-carousel-item v-for="slide in slides" :key="slide.id">
                  <img
                    class="mb-7 login-panel-right__image"
                    :src="require(`../../../public/images/login-bg-${$vuetify.theme.dark ? 'dark-' : ''}${slide.id}.png`)"
                  />
                  <div class="display-1 mb-3" :class="$vuetify.theme.dark ? '' : 'text_2--text'">{{ slide.title }}</div>
                  <div class="body-1" :class="$vuetify.theme.dark ? '' : 'text_2--text'">{{ slide.sub_title1 }}</div>
                  <div class="body-1" :class="$vuetify.theme.dark ? '' : 'text_2--text'">{{ slide.sub_title2 }}</div>
                  <v-btn class="learn-more-btn" :class="{ isDark: $vuetify.theme.dark }" :href="slide.link" target="_blank">Learn More</v-btn>
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
  </div>
</template>

<script>
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
      slides: [
        {
          id: 1,
          title: 'Send and receive digital currencies via email',
          sub_title1: 'Transacting on blockchain has never been easier.',
          sub_title2: 'An email is all you need to get started.',
          link: 'https://www.google.com',
        },
        {
          id: 2,
          title: 'Purchase digital currencies globally with credit card',
          sub_title1: 'Choose from a range providers',
          sub_title2: 'Get currencies at one of the most competitive rates',
          link: 'https://www.google.com',
        },
        {
          id: 3,
          title: 'Interact with thousands of apps on the blockchain',
          sub_title1: 'From Finance, Games, Exchanges and more',
          sub_title2: 'Access the decentralised world with Torus',
          link: 'https://www.google.com',
        },
      ],
    }
  },
  computed: mapState({
    selectedAddress: 'selectedAddress',
    loggedIn: (state) => state.selectedAddress !== '' && !state.loginInProgress,
    loginInProgress: 'loginInProgress',
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
  },
  created() {
    this.isLogout = this.$route.name !== 'login'
  },
  methods: {
    ...mapActions({
      triggerLogin: 'triggerLogin',
    }),
    returnHome() {
      this.$router.push({ path: '/' }).catch((_) => {})
      this.isLogout = false
      // window.location.href = process.env.BASE_URL
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'Login.scss';
</style>
