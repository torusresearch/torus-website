<template>
  <v-layout>
    <v-flex xs12 text-center>
      <v-dialog :value="loginDialog && showModal" max-width="375" persistent>
        <v-card class="login-dialog-container">
          <v-layout wrap>
            <v-flex text-center class="login-header" xs12 pt-8 pb-6 px-6>
              <img class="home-link mr-1" alt="Torus Logo" :height="getLogo.isExternal ? '50' : '30'" :src="getLogo.logo" />
              <v-btn class="close-btn" icon aria-label="Close Login Modal" @click="closeDialog">
                <v-icon>$vuetify.icons.close</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
          <v-layout wrap pa-6>
            <v-flex xs12>
              <div class="verifier-title headline torus_text--text font-weight-bold">
                <span v-if="$vuetify.breakpoint.xsOnly">
                  {{ t('login.your') }}
                  <img
                    :src="require(`../../../assets/images/login-verifiers-${$vuetify.theme.dark ? 'dark' : 'light'}.gif`)"
                    alt="Login Verifier Icon"
                  />
                </span>
                <span v-else>
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
              <div class="font-weight-bold verifier-subtitle torus_text--text">
                {{ t('login.digitalWallet') }}
              </div>
            </v-flex>
            <v-flex xs12 mt-7>
              <div class="body-1 torus_text--text">{{ t('login.signUpIn') }}</div>
            </v-flex>
            <v-flex xs12>
              <v-layout wrap mx-n1>
                <v-flex v-for="verifier in loginButtons" :key="verifier.typeOfLogin" xs4 px-1 mt-2>
                  <v-btn
                    block
                    class="login-btn"
                    :class="{ active: verifier.name === activeButton }"
                    type="button"
                    :title="`${t('login.loginWith')} ${verifier.name}`"
                    @mouseover="loginBtnHover(verifier.name)"
                    @click="startLogin(verifier.verifier)"
                  >
                    <img
                      v-if="verifier.name === activeButton || $vuetify.breakpoint.xsOnly"
                      :src="verifier.logoHover || require(`../../../assets/img/icons/login-${verifier.typeOfLogin}.svg`)"
                      :alt="`${verifier.name} Icon`"
                    />
                    <img v-else-if="$vuetify.theme.isDark && verifier.logoLight" :src="verifier.logoLight" :alt="`${verifier.name} Icon`" />
                    <img v-else-if="!$vuetify.theme.isDark && verifier.logoDark" :src="verifier.logoDark" :alt="`${verifier.name} Icon`" />
                    <v-icon v-else size="30" :class="$vuetify.theme.dark ? 'white--text' : 'loginBtnGray--text'">
                      {{ `$vuetify.icons.${verifier.typeOfLogin}` }}
                    </v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex v-if="loginButtonsLong.length > 0" xs12 mt-4 class="text-center">
              <div class="d-flex align-center">
                <v-divider></v-divider>
                <div :class="$vuetify.breakpoint.xsOnly ? 'px-5' : 'px-4'">
                  <div class="body-2 text_2--text">{{ t('login.or') }}</div>
                </div>
                <v-divider></v-divider>
              </div>
              <div v-for="verifier in loginButtonsLong" :key="verifier.typeOfLogin" class="mt-4">
                <v-btn
                  :id="`${verifier.typeOfLogin}LoginBtn`"
                  :color="$vuetify.theme.dark ? '' : 'white'"
                  block
                  :class="[$vuetify.theme.dark ? 'torus-dark' : '', `login-btn-${verifier.typeOfLogin}`]"
                  class="body-1 font-weight-bold card-shadow-v8 text_2--text login-btn-long"
                  @click="startLogin(verifier.verifier)"
                >
                  <img
                    v-if="$vuetify.theme.isDark && verifier.logoLight"
                    class="mr-4"
                    height="20"
                    :src="verifier.logoLight"
                    :alt="`${verifier.name} Icon`"
                  />
                  <img
                    v-else-if="!$vuetify.theme.isDark && verifier.logoDark"
                    class="mr-4"
                    height="20"
                    :src="verifier.logoDark"
                    :alt="`${verifier.name} Icon`"
                  />
                  <v-icon v-else class="mr-4">{{ `$vuetify.icons.${verifier.typeOfLogin}` }}</v-icon>
                  {{ t(verifier.description) }}
                </v-btn>
              </div>
            </v-flex>
            <v-flex xs12 mb-6 class="footer-notes">
              <div v-if="!canHideDisclaimer1" class="text_3--text mb-4">
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
              <v-divider class="mb-4"></v-divider>
              <div class="d-flex justify-center footer-links">
                <div class="mr-4">
                  <a :href="tncLink" target="_blank" rel="noreferrer noopener">
                    {{ t('dappLogin.termsConditions') }}
                  </a>
                </div>
                <div class="mr-4">
                  <a :href="privacyPolicy" target="_blank" rel="noreferrer noopener">
                    {{ t('dappLogin.privacyPolicy') }}
                  </a>
                </div>
                <div class="mr-4">
                  <a :href="contactLink" target="_blank" rel="noreferrer noopener">
                    {{ t('dappLogin.contactUs') }}
                  </a>
                </div>
              </div>
            </v-flex>
          </v-layout>
        </v-card>
      </v-dialog>
      <PasswordlessLogin
        :passwordless-login-dialog="passwordlessLoginDialog"
        :passwordless-email-sent="passwordlessEmailSent"
        @cancel="
          passwordlessLoginDialog = false
          passwordlessEmailSent = false
        "
        @sendLink="passwordlessEmailSent = true"
      />
    </v-flex>
  </v-layout>
</template>

<script>
import log from 'loglevel'
import { mapActions, mapGetters, mapState } from 'vuex'

import PasswordlessLogin from '../../../components/helpers/PasswordLessLogin'
import { GITHUB, GOOGLE, PASSWORDLESS, TWITTER } from '../../../utils/enums'

export default {
  name: 'PopupLogin',
  components: { PasswordlessLogin },
  props: {
    loginDialog: {
      type: Boolean,
      dafault: false,
    },
  },
  data() {
    return {
      GOOGLE,
      PASSWORDLESS,
      showModal: true,
      activeButton: '',
      passwordlessLoginDialog: false,
      passwordlessEmailSent: false,
    }
  },
  computed: {
    ...mapGetters(['loginButtonsArray', 'getLogo']),
    ...mapState(['whiteLabel']),
    loginButtons() {
      return this.loginButtonsArray.filter((button) => !button.description && button.typeOfLogin !== PASSWORDLESS)
    },
    loginButtonsLong() {
      return this.loginButtonsArray.filter((button) => button.description && button.typeOfLogin !== PASSWORDLESS)
    },
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
  },
  mounted() {
    this.activeButton = (this.loginButtons.concat(this.loginButtonsLong)[0] || { typeOfLogin: GOOGLE }).typeOfLogin
  },
  methods: {
    loginBtnHover(verifier) {
      if (!this.$vuetify.breakpoint.xsOnly) this.activeButton = verifier
    },
    async startLogin(verifier) {
      if (verifier === PASSWORDLESS) {
        this.passwordlessLoginDialog = true
        return
      }
      try {
        this.showModal = false
        await this.triggerLogin({ verifier, calledFromEmbed: true })
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
