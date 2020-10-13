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
              <span v-if="$vuetify.breakpoint.xsOnly">
                {{ t('dappLogin.yourDigital') }}
                <img
                  :src="require(`../../../assets/images/login-verifiers-${$vuetify.theme.dark ? 'dark' : 'light'}.gif`)"
                  alt="Login Verifier Icon"
                />
              </span>
              <span v-else>
                {{ t('dappLogin.yourDigital') }}
                <span v-if="activeButton === GOOGLE_VERIFIER" class="font-weight-bold">
                  <span class="verifier-title__google-blue">G</span>
                  <span class="verifier-title__google-red">o</span>
                  <span class="verifier-title__google-yellow">o</span>
                  <span class="verifier-title__google-blue">g</span>
                  <span class="verifier-title__google-green">l</span>
                  <span class="verifier-title__google-red">e</span>
                </span>
                <span
                  v-else-if="activeButton"
                  class="text-capitalize font-weight-bold"
                  :class="[
                    `verifier-title__${activeButtonDetails.name.toLowerCase()}`,
                    { 'white--text': activeButtonDetails.hasLightLogo && $vuetify.theme.dark },
                  ]"
                >
                  {{ activeButtonDetails.name }}
                </span>
              </span>
            </div>
          </div>
          <div class="login-btns-container mx-6">
            <v-btn
              v-for="verifier in mainButtonsLong"
              :key="verifier.verifier"
              block
              large
              :color="$vuetify.theme.dark ? '' : 'white'"
              :class="[$vuetify.theme.dark ? 'torus-dark' : '', `login-btn-google`]"
              class="text_2--text login-btn-long mb-2"
              @mouseover="loginBtnHover(verifier.verifier)"
              @click="startLogin(verifier.verifier)"
            >
              <img
                v-if="verifier.verifier === activeButton || $vuetify.breakpoint.xsOnly"
                :src="
                  verifier.logoHover ||
                  require(`../../../assets/img/icons/login-${verifier.name.toLowerCase()}${
                    verifier.hasLightLogo && $vuetify.theme.dark ? '-light' : ''
                  }.svg`)
                "
                :alt="`${verifier.name} Icon`"
              />
              <img v-else-if="$vuetify.theme.isDark && verifier.logoLight" :src="verifier.logoLight" :alt="`${verifier.name} Icon`" />
              <img v-else-if="!$vuetify.theme.isDark && verifier.logoDark" :src="verifier.logoDark" :alt="`${verifier.name} Icon`" />
              <v-icon v-else size="26" class="text_3--text">
                {{ `$vuetify.icons.${verifier.name.toLowerCase()}` }}
              </v-icon>
              <span class="ml-4">{{ formatDescription(verifier) }}</span>
            </v-btn>
            <v-layout wrap mx-n1>
              <v-flex v-for="verifier in mainButtons" :key="verifier.verifier" xs4 px-1>
                <v-btn
                  block
                  class="login-btn active mb-2"
                  type="button"
                  :title="`${t('login.loginWith')} ${verifier.name}`"
                  @mouseover="loginBtnHover(verifier.verifier)"
                  @click="startLogin(verifier.verifier)"
                >
                  <img
                    v-if="verifier.verifier === activeButton || $vuetify.breakpoint.xsOnly"
                    :src="
                      verifier.logoHover ||
                      require(`../../../assets/img/icons/login-${verifier.name.toLowerCase()}${
                        verifier.hasLightLogo && $vuetify.theme.dark ? '-light' : ''
                      }.svg`)
                    "
                    :alt="`${verifier.name} Icon`"
                  />
                  <img v-else-if="$vuetify.theme.isDark && verifier.logoLight" :src="verifier.logoLight" :alt="`${verifier.name} Icon`" />
                  <img v-else-if="!$vuetify.theme.isDark && verifier.logoDark" :src="verifier.logoDark" :alt="`${verifier.name} Icon`" />
                  <v-icon v-else size="32" class="text_3--text">
                    {{ `$vuetify.icons.${verifier.name.toLowerCase()}` }}
                  </v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
            <v-flex xs12 mt-2 mb-4 class="text-center">
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
                  @mouseover="loginBtnHover(verifier.verifier)"
                  @click="startLogin(verifier.verifier)"
                >
                  <img
                    v-if="verifier.verifier === activeButton || $vuetify.breakpoint.xsOnly"
                    :src="
                      verifier.logoHover ||
                      require(`../../../assets/img/icons/login-${verifier.name.toLowerCase()}${
                        verifier.hasLightLogo && $vuetify.theme.dark ? '-light' : ''
                      }.svg`)
                    "
                    :alt="`${verifier.name} Icon`"
                  />
                  <img v-else-if="$vuetify.theme.isDark && verifier.logoLight" :src="verifier.logoLight" :alt="`${verifier.name} Icon`" />
                  <img v-else-if="!$vuetify.theme.isDark && verifier.logoDark" :src="verifier.logoDark" :alt="`${verifier.name} Icon`" />
                  <v-icon v-else size="26" class="text_3--text">
                    {{ `$vuetify.icons.${verifier.name.toLowerCase()}` }}
                  </v-icon>
                  <span class="ml-4">
                    {{ formatDescription(verifier) }}
                  </span>
                </v-btn>
              </div>
            </v-flex>
          </div>
          <div class="d-flex align-center px-6 mb-7">
            <v-spacer></v-spacer>
            <v-btn x-small :class="{ 'has-more': viewMoreOptions }" class="view-option-selector" @click="viewMoreOptions = !viewMoreOptions">
              <span class="body-2">{{ viewMoreOptions ? t('dappLogin.viewLess') : t('dappLogin.viewMore') }}</span>
              <v-icon>$vuetify.icons.select</v-icon>
            </v-btn>
          </div>
          <div v-if="!canHideDisclaimer1 && !viewMoreOptions" class="text_3--text mb-4 px-6 footer-notes">
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
            <v-divider v-if="!whiteLabel.isActive" class="mx-3" vertical></v-divider>
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

import { GITHUB, GOOGLE_VERIFIER, TWITTER } from '../../../utils/enums'

export default {
  name: 'PopupLogin',
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
      viewMoreOptions: false,
    }
  },
  computed: {
    ...mapGetters(['loginButtonsArray', 'getLogo']),
    ...mapState({
      whiteLabel: 'whiteLabel',
    }),
    mainButtonsLong() {
      return this.loginButtonsArray.filter((button) => {
        return (
          ((this.$vuetify.breakpoint.xsOnly && button.showOnMobile) || (!this.$vuetify.breakpoint.xsOnly && button.showOnDesktop)) &&
          button.mainOption &&
          button.description !== ''
        )
      })
    },
    mainButtons() {
      return this.loginButtonsArray.filter((button) => {
        if (this.viewMoreOptions) {
          return (
            ((this.$vuetify.breakpoint.xsOnly && button.showOnMobile) || (!this.$vuetify.breakpoint.xsOnly && button.showOnDesktop)) &&
            button.description === ''
          )
        }
        return (!this.$vuetify.breakpoint.xsOnly || button.showOnMobile) && button.mainOption && button.description === ''
      })
    },
    loginButtonsLong() {
      return this.loginButtonsArray.filter(
        (button) =>
          ((this.$vuetify.breakpoint.xsOnly && button.showOnMobile) || (!this.$vuetify.breakpoint.xsOnly && button.showOnDesktop)) &&
          !button.mainOption &&
          button.description !== ''
      )
    },
    allActiveButtons() {
      return [...this.mainButtonsLong, ...this.mainButtons, ...this.loginButtonsLong]
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
    activeButtonDetails() {
      return this.loginButtonsArray.find((x) => x.verifier === this.activeButton)
    },
  },
  watch: {
    loginButtonsArray(newValue, oldValue) {
      if (newValue !== oldValue && newValue.length > 0) {
        this.chooseAndSetActiveButton()
      }
    },
    viewMoreOptions(newValue, oldValue) {
      if (newValue !== oldValue && !this.$vuetify.breakpoint.xsOnly) {
        this.chooseAndSetActiveButton()
      }
    },
  },
  mounted() {
    this.chooseAndSetActiveButton()
  },
  methods: {
    chooseAndSetActiveButton() {
      // if present in any visible ones, don't do anything
      // else, set it to first of main buttons long
      // if not present, set it to first of main buttons long
      if (this.activeButton && this.allActiveButtons.find((x) => x.verifier === this.activeButton)) {
        return
      }
      if (this.mainButtonsLong.length > 0) this.activeButton = this.mainButtonsLong[0].verifier
      else if (this.mainButtons.length > 0) this.activeButton = this.mainButtons[0].verifier
      else if (this.loginButtonsLong.length > 0) this.activeButton = this.loginButtonsLong[0].verifier
    },
    loginBtnHover(verifier) {
      if (!this.$vuetify.breakpoint.xsOnly) this.activeButton = verifier
    },
    async startLogin(verifier) {
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
