<template>
  <v-flex xs10 sm12 ml-auto mr-auto>
    <!-- <div
      v-if="(mainButtonsLong.length > 0 || mainButtons.length > 0) && !$vuetify.breakpoint.xsOnly && !isPopup"
      class="headline font-weight-regular mb-2"
      :class="$vuetify.theme.dark ? '' : 'text_2--text'"
    >
      {{ t('login.signUpIn') }}
    </div> -->
    <div :style="{ maxWidth: '372px' }">
      <LoginButton
        v-for="verifier in mainButtonsLong"
        :key="verifier.verifier"
        :verifier="verifier"
        :active="verifier.verifier === activeButton"
        :block="true"
        :is-long="true"
        :is-popup="isPopup"
        @mouseover="loginBtnHover(verifier.verifier)"
        @click="triggerLogin(verifier.verifier)"
      />
    </div>
    <v-layout wrap :style="{ maxWidth: '380px' }" mx-n1>
      <v-flex
        v-for="verifier in mainButtons"
        :key="verifier.verifier"
        px-1
        :class="!viewMoreOptions || isPopup || $vuetify.breakpoint.xsOnly ? 'xs4' : 'xs2'"
      >
        <LoginButton
          :verifier="verifier"
          :active="verifier.verifier === activeButton"
          :block="true"
          @mouseover="loginBtnHover(verifier.verifier)"
          @click="triggerLogin(verifier.verifier)"
        />
      </v-flex>
    </v-layout>
    <div v-if="loginButtonsLong.length > 0" :style="{ maxWidth: '372px' }">
      <div v-if="mainButtonsLong.length > 0 || mainButtons.length > 0" class="d-flex align-center mb-4 mt-2">
        <v-divider />
        <div :class="$vuetify.breakpoint.xsOnly ? 'px-5' : 'px-4'">
          <div class="body-2 text_2--text">{{ t('login.or') }}</div>
        </div>
        <v-divider />
      </div>
      <div v-for="verifier in loginButtonsLong" :key="verifier.verifier" class="mb-2">
        <v-form
          v-if="verifier.verifier === HOSTED_EMAIL_PASSWORDLESS_VERIFIER"
          ref="passwordlessEmailForm"
          v-model="passwordlessEmailFormValid"
          @submit.prevent="triggerLogin(verifier.verifier, passwordlessEmail)"
        >
          <v-text-field
            v-model="passwordlessEmail"
            class="passwordless-email mb-2"
            :rules="[rules.email]"
            :placeholder="t('login.enterYourEmail')"
            outlined
          />
          <LoginButton
            :verifier="verifier"
            :active="verifier.verifier === activeButton"
            :block="true"
            :is-long="true"
            :disabled="!passwordlessEmailFormValid"
            button-type="submit"
            @mouseover="loginBtnHover(verifier.verifier)"
          />
        </v-form>
        <LoginButton
          v-else
          :verifier="verifier"
          :active="verifier.verifier === activeButton"
          :block="true"
          :is-long="true"
          :is-popup="isPopup"
          @mouseover="loginBtnHover(verifier.verifier)"
          @click="triggerLogin(verifier.verifier)"
        />
      </div>
    </div>
    <div class="d-flex align-center" :style="{ maxWidth: '372px' }">
      <v-spacer></v-spacer>
      <v-btn x-small :class="{ 'has-more': viewMoreOptions }" class="view-option-selector" @click="viewMoreOptions = !viewMoreOptions">
        <span class="body-2">{{ viewMoreOptions ? t('dappLogin.viewLess') : t('dappLogin.viewMore') }}</span>
        <v-icon>$vuetify.icons.select</v-icon>
      </v-btn>
    </div>
  </v-flex>
</template>

<script>
import { HOSTED_EMAIL_PASSWORDLESS_VERIFIER } from '../../../utils/enums'
import LoginButton from '../LoginButton'

export default {
  components: { LoginButton },
  props: {
    activeButton: {
      type: String,
      default: '',
    },
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
  },
  data() {
    return {
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
      return this.loginButtonsArray.filter(
        (button) =>
          ((this.$vuetify.breakpoint.xsOnly && button.showOnMobile) || (!this.$vuetify.breakpoint.xsOnly && button.showOnDesktop)) &&
          button.mainOption &&
          button.description !== ''
      )
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
    this.chooseAndSetActiveButton()
    this.animateVerifier()
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
    animateVerifier() {
      const verifiers = this.loginButtonsArray.filter((button) => button.showOnMobile)
      if (verifiers.length > 0) {
        let counter = 0

        clearInterval(this.activeMobileButtonInterval)
        this.activeMobileButtonInterval = setInterval(() => {
          if (counter >= verifiers.length) {
            counter = 0
          }
          this.setActiveMobileBtn(verifiers[counter].verifier)
          counter += 1
        }, 1000)
      }
    },
    loginBtnHover(verifier) {
      if (!this.$vuetify.breakpoint.xsOnly) this.setActiveBtn(verifier)
    },
    setActiveBtn(verifier) {
      this.$emit('setActiveBtn', verifier)
    },
    setActiveMobileBtn(verifier) {
      this.$emit('setActiveMobileBtn', verifier)
    },
    triggerLogin(verifier, email) {
      this.$emit('triggerLogin', verifier, email)
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'LoginButtons.scss';
</style>
