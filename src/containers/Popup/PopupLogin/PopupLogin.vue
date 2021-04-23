<template>
  <v-layout>
    <v-flex xs12 text-center>
      <v-dialog class="login-dialog-modal" :value="loginDialog && showModal" max-width="375" persistent>
        <v-card class="login-dialog-container">
          <div class="login-header px-6 py-8 mb-5">
            <v-btn class="close-btn" icon aria-label="Close Login Modal" @click="closeDialog">
              <v-icon>$vuetify.icons.close</v-icon>
            </v-btn>
            <div class="display-1 text_2--text">
              <span>{{ t('dappLogin.signIn') }}</span>
            </div>
            <div class="headline verifier-title font-weight-regular text_2--text">
              <LoginTitleDapp v-if="$vuetify.breakpoint.xsOnly && activeMobileButton" :active-button-details="activeMobileButtonDetails" />
              <LoginTitleDapp v-if="!$vuetify.breakpoint.xsOnly && activeButton" :active-button-details="activeButtonDetails" />
            </div>
          </div>
          <div class="mx-sm-6">
            <LoginButtons
              :login-buttons-array="loginButtonsArray"
              :is-popup="true"
              :active-button="activeButton"
              @setActiveBtn="(verifier) => (activeButton = verifier)"
              @setActiveMobileBtn="(verifier) => (activeMobileButton = verifier)"
              @triggerLogin="startLogin"
            />
          </div>
          <div
            v-if="!canHideDisclaimer1 && !viewMoreOptions && thirdPartyAuthenticators.length > 0"
            class="text_3--text px-6 footer-notes mt-5"
            :class="$vuetify.breakpoint.xsOnly ? 'pb-13' : 'mb-4'"
          >
            <span>{{ t('dappLogin.termsAuth01') }}</span>
            <br />
            <span>{{ thirdPartyAuthenticators }}.</span>
            <a
              class="privacy-learn-more text_3--text"
              href="https://docs.tor.us/key-infrastructure/role-of-torus-nodes/oauth2-vs-proxy-sign-in"
              target="_blank"
              rel="noreferrer noopener"
            >
              {{ t('dappLogin.termsLearnMore') }}
            </a>
          </div>
          <div class="d-flex justify-center caption footer-links pt-3 pb-4 px-6" :class="{ smallScreen: $vuetify.breakpoint.width < 385 }">
            <div>
              <a class="text-decoration-none text_2--text" :href="tncLink" target="_blank" rel="noreferrer noopener">
                {{ t('dappLogin.termsConditions') }}
              </a>
            </div>
            <v-spacer></v-spacer>
            <div v-if="!whiteLabel.isActive" class="d-flex align-center">
              <span class="text_2--text mr-1">{{ t('dappLogin.poweredBy') }}</span>
              <img alt="Torus Logo" height="10" :src="getLogo.logo" />
            </div>
          </div>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-layout>
</template>

<script>
import log from 'loglevel'
import { mapActions, mapGetters, mapState } from 'vuex'

import LoginButtons from '../../../components/Login/LoginButtons'
import LoginTitleDapp from '../../../components/Login/LoginTitleDapp'
import { GITHUB, GOOGLE_VERIFIER, TWITTER } from '../../../utils/enums'
import { thirdPartyAuthenticators } from '../../../utils/utils'

export default {
  name: 'PopupLogin',
  components: { LoginButtons, LoginTitleDapp },
  props: {
    loginDialog: {
      type: Boolean,
      dafault: false,
    },
  },
  data() {
    return {
      GOOGLE_VERIFIER,
      showModal: true,
      activeButton: '',
      activeMobileButton: '',
      activeMobileButtonInterval: null,
      viewMoreOptions: false,
    }
  },
  computed: {
    ...mapGetters(['loginButtonsArray', 'getLogo']),
    ...mapState({
      whiteLabel: 'whiteLabel',
      loginConfig: (state) => state.embedState.loginConfig,
    }),
    localeSelected() {
      return this.$vuetify.lang.current
    },
    tncLink() {
      let finalLink = 'https://docs.tor.us/legal/terms-and-conditions'
      const { isActive, tncLink } = this.whiteLabel
      if (isActive && tncLink) {
        finalLink = tncLink[this.localeSelected] || tncLink[Object.keys(tncLink)[0]]
      }
      return finalLink
    },
    privacyPolicy() {
      let finalLink = 'https://docs.tor.us/legal/privacy-policy'
      const { isActive, privacyPolicy } = this.whiteLabel
      if (isActive && privacyPolicy) {
        finalLink = privacyPolicy[this.localeSelected] || privacyPolicy[Object.keys(privacyPolicy)[0]]
      }
      return finalLink
    },
    contactLink() {
      let finalLink = 'https://t.me/TorusLabs'
      const { isActive, contactLink } = this.whiteLabel
      if (isActive && contactLink) {
        finalLink = contactLink[this.localeSelected] || contactLink[Object.keys(contactLink)[0]]
      }
      return finalLink
    },
    canHideDisclaimer1() {
      const { isActive, disclaimerHide } = this.whiteLabel
      const isUsingSpecialLogin = this.loginButtonsArray.some((x) => x.jwtParameters && x.showOnModal)
      return disclaimerHide && !isUsingSpecialLogin && isActive
    },
    canHideDisclaimer2() {
      const { isActive, disclaimerHide } = this.whiteLabel
      const isUsingSpecialLogin = this.loginButtonsArray.some((x) => (x.typeOfLogin === GITHUB || x.typeOfLogin === TWITTER) && x.showOnModal)
      return disclaimerHide && !isUsingSpecialLogin && isActive
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
  methods: {
    async startLogin(verifier, email) {
      try {
        this.showModal = false
        await this.triggerLogin({ verifier, calledFromEmbed: true, login_hint: email })
      } catch (error) {
        log.error(error)
        this.closeDialog()
      } finally {
        this.showModal = true
      }
    },
    closeDialog() {
      this.$emit('closeDialog')
    },
    ...mapActions({
      triggerLogin: 'triggerLogin',
    }),
  },
}
</script>

<style lang="scss" scoped>
@import 'PopupLogin.scss';
</style>
