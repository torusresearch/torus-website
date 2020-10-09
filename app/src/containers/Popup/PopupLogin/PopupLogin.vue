<template>
  <v-layout>
    <v-flex xs12 text-center>
      <v-dialog class="login-dialog-modal" :value="loginDialog && showModal" :fullscreen="$vuetify.breakpoint.width < 385" max-width="375" persistent>
        <v-card class="login-dialog-container">
          <div class="px-6 pt-10 mb-8">
            <v-btn class="close-btn" icon aria-label="Close Login Modal" @click="closeDialog">
              <v-icon>$vuetify.icons.close</v-icon>
            </v-btn>
            <div class="display-1 text_2--text">
              <span>{{ t('dappLogin.signIn') }}</span>
            </div>
            <div class="headline font-weight-regular text_2--text">{{ t('dappLogin.yourDigital') }}</div>
          </div>
          <div :class="{ 'has-more': viewMoreOptions }" class="login-btns-container mx-6">
            <v-btn
              v-for="verifier in mainButtonsLong"
              :key="verifier.verifier"
              block
              large
              :color="$vuetify.theme.dark ? '' : 'white'"
              :class="[$vuetify.theme.dark ? 'torus-dark' : '', `login-btn-google`]"
              class="text_2--text login-btn-long mb-2"
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
              <img
                v-else
                class="mr-3"
                :src="require(`../../../assets/img/icons/login-${verifier.name.toLowerCase()}.svg`)"
                :alt="`${verifier.name} Icon`"
              />
              {{ formatDescription(verifier) }}
            </v-btn>
            <v-layout wrap mx-n1>
              <v-flex v-for="verifier in mainButtons" :key="verifier.verifier" xs4 px-1>
                <v-btn
                  block
                  class="login-btn active"
                  type="button"
                  :title="`${t('login.loginWith')} ${verifier.name}`"
                  @click="startLogin(verifier.verifier)"
                >
                  <img v-if="$vuetify.theme.isDark && verifier.logoLight" height="20" :src="verifier.logoLight" :alt="`${verifier.name} Icon`" />
                  <img v-else-if="!$vuetify.theme.isDark && verifier.logoDark" height="20" :src="verifier.logoDark" :alt="`${verifier.name} Icon`" />
                  <img v-else :src="require(`../../../assets/img/icons/login-${verifier.name.toLowerCase()}.svg`)" :alt="`${verifier.name} Icon`" />
                </v-btn>
              </v-flex>
            </v-layout>
            <v-flex xs12 mt-4 class="text-center">
              <div class="d-flex align-center mb-4">
                <v-divider></v-divider>
                <div :class="$vuetify.breakpoint.xsOnly ? 'px-5' : 'px-4'">
                  <div class="body-2 text_2--text">{{ t('login.or') }}</div>
                </div>
                <v-divider></v-divider>
              </div>
              <div v-for="verifier in loginButtonsLong" :key="verifier.verifier" class="mb-2">
                <v-btn
                  :id="`${verifier.name}LoginBtn`"
                  :color="$vuetify.theme.dark ? '' : 'white'"
                  block
                  :class="[$vuetify.theme.dark ? 'torus-dark' : '', `login-btn-${verifier.name.toLowerCase()}`]"
                  class="text_2--text login-btn-long"
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
                  <img
                    v-else
                    class="mr-4"
                    height="20"
                    :src="
                      verifier.logoHover ||
                      require(`../../../assets/img/icons/login-${verifier.name.toLowerCase()}${
                        $vuetify.theme.isDark && verifier.hasLightLogo ? '-light' : ''
                      }.svg`)
                    "
                    :alt="`${verifier.name} Icon`"
                  />
                  <span>
                    {{ formatDescription(verifier) }}
                  </span>
                </v-btn>
              </div>
            </v-flex>
          </div>
          <div class="d-flex align-center px-6 mb-10">
            <v-spacer></v-spacer>
            <a :class="{ 'has-more': viewMoreOptions }" class="view-option-selector" @click="viewMoreOptions = !viewMoreOptions">
              <span class="body-2 torusBrand1--text">{{ viewMoreOptions ? t('dappLogin.viewLess') : t('dappLogin.viewMore') }}</span>
              <v-icon class="torusBrand1--text">$vuetify.icons.select</v-icon>
            </a>
          </div>
          <div v-if="!canHideDisclaimer1 && !viewMoreOptions" class="text_3--text mb-10 px-6 footer-notes">
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
          <div class="d-flex justify-center caption footer-links pt-3 pb-4" :class="{ smallScreen: $vuetify.breakpoint.width < 385 }">
            <div>
              <a class="text-decoration-none text_2--text" :href="tncLink" target="_blank" rel="noreferrer noopener">
                {{ t('dappLogin.termsConditions') }}
              </a>
            </div>
            <v-divider class="mx-3" vertical></v-divider>
            <div class="d-flex align-center">
              <span class="text_2--text mr-1">{{ t('dappLogin.poweredBy') }}</span>
              <img alt="Torus Logo" height="10" :src="getLogo.logo" />
            </div>
          </div>
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
import { GITHUB, GOOGLE_VERIFIER, PASSWORDLESS, TWITTER } from '../../../utils/enums'

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
      GOOGLE_VERIFIER,
      PASSWORDLESS,
      showModal: true,
      passwordlessLoginDialog: false,
      passwordlessEmailSent: false,
      viewMoreOptions: false,
    }
  },
  computed: {
    ...mapGetters(['loginButtonsArray', 'getLogo']),
    ...mapState({
      whiteLabel: 'whiteLabel',
      loginConfig: (state) => state.embedState.loginConfig,
    }),
    mainButtonsLong() {
      return this.loginButtonsArray.filter((button) => button.mainOption && button.description !== '')
    },
    mainButtons() {
      return this.loginButtonsArray.filter((button) => button.mainOption && button.description === '')
    },
    loginButtonsLong() {
      const buttons = this.loginButtonsArray.filter((button) => !button.mainOption)
      return this.viewMoreOptions ? buttons : buttons.slice(0, 1)
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
    showGoogleLogin() {
      return this.loginConfig[GOOGLE_VERIFIER].showOnModal
    },
  },
  methods: {
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
    formatDescription(verifier) {
      const finalDesc = verifier.description ? this.t(verifier.description) : this.t('dappLogin.continue')
      return finalDesc.replace(/{verifier}/gi, verifier.name.charAt(0).toUpperCase() + verifier.name.slice(1))
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'PopupLogin.scss';
</style>
