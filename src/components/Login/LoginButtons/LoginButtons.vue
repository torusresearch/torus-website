<template>
  <v-flex class="login-buttons" :class="isPopup ? 'is-popup xs-12' : 'xs10 sm12'" ml-auto mr-auto>
    <div :style="{ maxWidth: isPopup ? 'unset' : '372px' }">
      <v-btn
        v-if="hasExistingAccount && existingLoginTypeAvailable"
        large
        color="torusBrand1"
        class="white--text font-weight-regular btn-existing mb-2"
        :class="$vuetify.breakpoint.xsOnly ? 'body-2' : 'headline'"
        block
        @click="loginExisting"
      >
        <v-icon class="text_3--text mr-3" color="white">
          {{ `$vuetify.icons.${lastLoginIcon}` }}
        </v-icon>
        <div>
          {{ t('dappLogin.continueWith').replace(/\{verifier\}/gi, capitalizeFirstLetter(existingLoginTypeAvailable.name)) }}
          <div v-if="lastLoginVerifierId" class="font-weight-bold last-login-email">
            {{ lastLoginVerifierId }}
          </div>
        </div>
      </v-btn>
      <LoginButton
        v-for="loginConfigItem in mainButtonsLong"
        :key="loginConfigItem.verifier"
        :login-config-item="loginConfigItem"
        :active="loginConfigItem.verifier === activeButton"
        :is-long="true"
        :is-popup="isPopup"
        @mouseover="loginBtnHover(loginConfigItem.verifier)"
        @click="triggerLogin(loginConfigItem.verifier)"
      />
    </div>
    <v-layout class="buttons-container" wrap :style="{ maxWidth: isPopup ? 'unset' : '380px' }">
      <v-flex
        v-for="loginConfigItem in mainButtons"
        :key="loginConfigItem.verifier"
        :class="[!viewMoreOptions || isPopup || $vuetify.breakpoint.xsOnly ? 'xs4' : 'xs2']"
      >
        <LoginButton
          :login-config-item="loginConfigItem"
          :active="loginConfigItem.verifier === activeButton"
          @mouseover="loginBtnHover(loginConfigItem.verifier)"
          @click="triggerLogin(loginConfigItem.verifier)"
        />
      </v-flex>
    </v-layout>
    <div v-if="loginButtonsLong.length > 0" :style="{ maxWidth: isPopup ? 'unset' : '372px' }">
      <div v-if="mainButtonsLong.length > 0 || mainButtons.length > 0" class="d-flex or-container align-center">
        <v-divider />
        <div :class="$vuetify.breakpoint.xsOnly ? 'px-5' : 'px-4'">
          <div class="text_2--text">{{ t('login.or') }}</div>
        </div>
        <v-divider />
      </div>
      <div v-for="loginConfigItem in loginButtonsLong" :key="loginConfigItem.verifier" class="buttons-bottom-container">
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
            :placeholder="t('login.enterYourEmail')"
            outlined
          />
          <LoginButton
            :login-config-item="loginConfigItem"
            :active="loginConfigItem.verifier === activeButton"
            :is-long="true"
            :disabled="!passwordlessEmailFormValid"
            :no-icon="true"
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
      </div>
    </div>
    <div class="d-flex align-center" :style="{ maxWidth: isPopup ? 'unset' : '372px' }">
      <v-spacer></v-spacer>
      <v-btn :class="{ 'has-more': viewMoreOptions }" class="view-option-selector" @click="viewMoreOptions = !viewMoreOptions">
        <span class="selector-text">{{ viewMoreOptions ? t('dappLogin.viewLess') : t('dappLogin.viewMore') }}</span>
        <v-icon>$vuetify.icons.select</v-icon>
      </v-btn>
    </div>
  </v-flex>
</template>

<script>
import log from 'loglevel'

import { HOSTED_EMAIL_PASSWORDLESS_VERIFIER } from '../../../utils/enums'
import { capitalizeFirstLetter } from '../../../utils/utils'
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
      if (this.hasExistingAccount) return []
      return this.loginButtonsArray.filter(
        (button) =>
          ((this.$vuetify.breakpoint.xsOnly && button.showOnMobile) || (!this.$vuetify.breakpoint.xsOnly && button.showOnDesktop)) &&
          button.mainOption &&
          !!button.description
      )
    },
    mainButtons() {
      return this.loginButtonsArray.filter((button) => {
        const descCheck = (this.hasExistingAccount || !button.description) && button.verifier !== HOSTED_EMAIL_PASSWORDLESS_VERIFIER
        if (this.viewMoreOptions) {
          return ((this.$vuetify.breakpoint.xsOnly && button.showOnMobile) || (!this.$vuetify.breakpoint.xsOnly && button.showOnDesktop)) && descCheck
        }
        return (!this.$vuetify.breakpoint.xsOnly || button.showOnMobile) && button.mainOption && descCheck
      })
    },
    loginButtonsLong() {
      const buttons = this.loginButtonsArray.filter(
        (button) =>
          ((this.$vuetify.breakpoint.xsOnly && button.showOnMobile) || (!this.$vuetify.breakpoint.xsOnly && button.showOnDesktop)) &&
          !button.mainOption &&
          !!button.description
      )
      return buttons
    },
    allActiveButtons() {
      return [...this.mainButtonsLong, ...this.mainButtons, ...this.loginButtonsLong]
    },
    textFieldHeight() {
      if (this.$vuetify.breakpoint.height >= 1440) return '3.47vh'
      if (this.$vuetify.breakpoint.height >= 1080) return '4.6vh'
      return '40'
    },
    hasExistingAccount() {
      return this.lastLoginInfo.typeOfLogin && this.lastLoginInfo.verifierId
    },
    existingLoginTypeAvailable() {
      const existingVerifier = this.lastLoginInfo.aggregateVerifier || this.lastLoginInfo.verifier
      const available = this.loginButtonsArray.find((button) => (button.linkedVerifier || button.verifier) === existingVerifier)
      log.info('existingLoginTypeAvailable', available)
      return available
    },
    lastLoginIcon() {
      return this.lastLoginInfo.typeOfLogin.toLowerCase()
    },
    lastLoginVerifierId() {
      const { email } = this.lastLoginInfo
      return email || ''
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
  beforeDestroy() {
    clearInterval(this.activeMobileButtonInterval)
  },
  mounted() {
    log.info(this.loginButtonsArray)
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
      if (!this.$vuetify.breakpoint.xsOnly) this.setActiveBtn(verifier)
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
      this.$emit('triggerLogin', verifier, email)
    },
    capitalizeFirstLetter(text) {
      return capitalizeFirstLetter(text)
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'LoginButtons.scss';
</style>
