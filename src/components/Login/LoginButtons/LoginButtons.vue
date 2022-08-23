<template>
  <v-col class="login-buttons" :class="isPopup ? 'is-popup xs-12' : 'xs10 sm12'" :style="{ maxWidth: isPopup ? 'unset' : '380px' }">
    <v-row v-if="lastLoginConfigItem || mainButtonsLong.length > 0" dense>
      <v-col v-if="lastLoginConfigItem" cols="12">
        <LoginButton
          :login-config-item="lastLoginConfigItem"
          :email="lastLoginVerifierId"
          :is-existing-login="true"
          :is-long="true"
          :is-popup="isPopup"
          @click="loginExisting"
        />
      </v-col>
      <v-col v-for="loginConfigItem in mainButtonsLong" :key="loginConfigItem.verifier" cols="12">
        <LoginButton
          :login-config-item="loginConfigItem"
          :active="loginConfigItem.verifier === activeButton"
          :is-long="true"
          :is-popup="isPopup"
          @mouseover="loginBtnHover(loginConfigItem.verifier)"
          @click="triggerLogin(loginConfigItem.verifier)"
        />
      </v-col>
    </v-row>
    <v-row v-if="mainButtons.length > 0" dense>
      <v-col v-for="loginConfigItem in mainButtons" :key="loginConfigItem.verifier" cols="4">
        <LoginButton
          :login-config-item="loginConfigItem"
          :active="loginConfigItem.verifier === activeButton"
          :is-popup="isPopup"
          @mouseover="loginBtnHover(loginConfigItem.verifier)"
          @click="triggerLogin(loginConfigItem.verifier)"
        />
      </v-col>
    </v-row>
    <div
      v-if="(lastLoginConfigItem || mainButtonsLong.length > 0 || mainButtons.length > 0) && loginButtonsLong.length > 0"
      class="d-flex or-container align-center"
    >
      <v-divider />
      <div :class="$vuetify.display.xsOnly ? 'px-5' : 'px-4'">
        <div class="text_2--text">{{ $t('login.or') }}</div>
      </div>
      <v-divider />
    </div>
    <v-row v-if="loginButtonsLong.length > 0" dense>
      <v-col v-for="loginConfigItem in loginButtonsLong" :key="loginConfigItem.verifier" cols="12">
        <v-form
          v-if="loginConfigItem.verifier === HOSTED_EMAIL_PASSWORDLESS_VERIFIER"
          ref="passwordlessEmailForm"
          v-model="passwordlessEmailFormValid"
          @submit.prevent="triggerLogin(loginConfigItem.verifier, passwordlessEmail)"
        >
          <v-text-field
            v-model="passwordlessEmail"
            :height="textFieldHeight"
            class="passwordless-email"
            :rules="[rules.email]"
            :placeholder="$t('login.enterYourEmail')"
            outlined
          />
          <LoginButton
            :login-config-item="loginConfigItem"
            :active="loginConfigItem.verifier === activeButton"
            :is-long="true"
            :no-icon="true"
            :is-popup="isPopup"
            :disabled="!passwordlessEmailFormValid"
            button-type="submit"
            @mouseover="loginBtnHover(loginConfigItem.verifier)"
          />
        </v-form>
        <LoginButton
          v-else
          :login-config-item="loginConfigItem"
          :active="loginConfigItem.verifier === activeButton"
          :is-long="true"
          :is-popup="isPopup"
          @mouseover="loginBtnHover(loginConfigItem.verifier)"
          @click="triggerLogin(loginConfigItem.verifier)"
        />
      </v-col>
    </v-row>
    <div class="d-flex align-center mt-4" :style="{ maxWidth: isPopup ? 'unset' : '380px' }">
      <v-spacer></v-spacer>
      <v-btn :class="{ 'has-more': viewMoreOptions }" class="view-option-selector" @click="viewMoreOptions = !viewMoreOptions">
        <span class="selector-text">{{ viewMoreOptions ? $t('dappLogin.viewLess') : $t('dappLogin.viewMore') }}</span>
        <v-icon>$vuetify.icons.select</v-icon>
      </v-btn>
    </div>
  </v-col>
</template>

<script>
import { HOSTED_EMAIL_PASSWORDLESS_VERIFIER } from '../../../utils/enums'
import LoginButton from '../LoginButton'

export default {
  components: { LoginButton },
  props: {
    isPopup: {
      type: Boolean,
      default: false,
    },
    loginButtonsArray: {
      type: Array,
      default() {
        return []
      },
    },
    lastLoginInfo: {
      type: Object,
      default() {
        return {
          typeOfLogin: '',
          verifierId: '',
          aggregateVerifier: '',
          verifier: '',
          email: '',
        }
      },
    },
  },
  data() {
    return {
      activeButton: '',
      viewMoreOptions: false,
      activeMobileButtonInterval: null,
      HOSTED_EMAIL_PASSWORDLESS_VERIFIER,
      passwordlessEmailFormValid: false,
      passwordlessEmail: '',
      rules: {
        email: (value) =>
          /^(([^\s"(),.:;<>@[\\\]]+(\.[^\s"(),.:;<>@[\\\]]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([\dA-Za-z-]+\.)+[A-Za-z]{2,}))$/.test(value) ||
          'Invalid email',
      },
    }
  },
  computed: {
    mainButtonsLong() {
      if (this.lastLoginConfigItem) return []
      return this.loginButtonsArray.filter(
        (button) =>
          ((this.$vuetify.display.xsOnly && button.showOnMobile) || (!this.$vuetify.display.xsOnly && button.showOnDesktop)) &&
          button.mainOption &&
          !!button.description
      )
    },
    mainButtons() {
      return this.loginButtonsArray.filter((button) => {
        const descCheck = (this.lastLoginConfigItem || !button.description) && button.verifier !== HOSTED_EMAIL_PASSWORDLESS_VERIFIER
        if (this.viewMoreOptions) {
          return ((this.$vuetify.display.xsOnly && button.showOnMobile) || (!this.$vuetify.display.xsOnly && button.showOnDesktop)) && descCheck
        }
        return (!this.$vuetify.display.xsOnly || button.showOnMobile) && button.mainOption && descCheck
      })
    },
    loginButtonsLong() {
      const buttons = this.loginButtonsArray.filter(
        (button) =>
          ((this.$vuetify.display.xsOnly && button.showOnMobile) || (!this.$vuetify.display.xsOnly && button.showOnDesktop)) &&
          !button.mainOption &&
          !!button.description
      )
      return buttons
    },
    allActiveButtons() {
      return [...this.mainButtonsLong, ...this.mainButtons, ...this.loginButtonsLong]
    },
    textFieldHeight() {
      if (this.$vuetify.display.height >= 1440) return '3.47vh'
      if (this.$vuetify.display.height >= 1080) return '4.6vh'
      return '40'
    },
    lastLoginVerifierId() {
      const { email } = this.lastLoginInfo
      return email || ''
    },
    lastLoginConfigItem() {
      const existingVerifier = this.lastLoginInfo.aggregateVerifier || this.lastLoginInfo.verifier
      const config = this.loginButtonsArray.find((button) => (button.linkedVerifier || button.verifier) === existingVerifier)
      return config
    },
  },
  watch: {
    loginButtonsArray(newValue, oldValue) {
      if (newValue !== oldValue && newValue.length > 0) {
        this.chooseAndSetActiveButton()
      }
    },
    viewMoreOptions(newValue, oldValue) {
      if (newValue !== oldValue && !this.$vuetify.display.xsOnly) {
        this.chooseAndSetActiveButton()
      }
    },
  },
  beforeDestroy() {
    clearInterval(this.activeMobileButtonInterval)
  },
  mounted() {
    this.chooseAndSetActiveButton()
  },
  methods: {
    chooseAndSetActiveButton() {
      // if present in any visible ones, don't do anything
      // else, set it to first of main buttons long
      // if not present, set it to first of main buttons long
      if (this.activeButton && this.allActiveButtons.some((x) => x.verifier === this.activeButton)) {
        return
      }
      if (this.mainButtonsLong.length > 0) this.setActiveBtn(this.mainButtonsLong[0].verifier)
      else if (this.mainButtons.length > 0) this.setActiveBtn(this.mainButtons[0].verifier)
      else if (this.loginButtonsLong.length > 0) this.setActiveBtn(this.loginButtonsLong[0].verifier)
    },
    loginBtnHover(verifier) {
      if (!this.$vuetify.display.xsOnly) this.setActiveBtn(verifier)
    },
    loginExisting() {
      const existingVerifier = this.lastLoginInfo.aggregateVerifier || this.lastLoginInfo.verifier
      const targetLogin = this.loginButtonsArray.find((login) => (login.linkedVerifier || login.verifier) === existingVerifier)
      this.triggerLogin(targetLogin.verifier, this.lastLoginInfo.verifierId)
    },
    setActiveBtn(verifier) {
      this.activeButton = verifier
    },
    triggerLogin(verifier, email) {
      this.$emi$t('triggerLogin', verifier, email)
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'LoginButtons.scss';
</style>
