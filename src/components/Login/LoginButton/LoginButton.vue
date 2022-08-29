<template>
  <button
    v-ripple="{ center: true }"
    class="gmt-login login-btn"
    :disabled="disabled"
    :class="buttonClass"
    :style="buttonStyles"
    @mouseover="onMouseover"
    @click="onClick"
  >
    <img
      v-if="(active || $vuetify.display.xs) && buttonType !== 'submit' && !isExistingLogin"
      :src="loginConfigItem.logoHover || require(`../../../assets/img/icons/login-${iconName}${hasLightLogo && isDarkMode ? '-light' : ''}.svg`)"
      :alt="`${loginConfigItem.name} Icon`"
      :class="{ 'mr-3': isLong }"
    />
    <img
      v-else-if="(isDarkMode || isExistingLogin) && loginConfigItem.logoLight && buttonType !== 'submit'"
      :src="loginConfigItem.logoLight"
      :alt="`${loginConfigItem.name} Icon`"
      :class="{ 'mr-3': isLong }"
    />
    <img
      v-else-if="!isDarkMode && loginConfigItem.logoDark && buttonType !== 'submit'"
      :src="loginConfigItem.logoDark"
      :alt="`${loginConfigItem.name} Icon`"
      :class="{ 'mr-3': isLong }"
    />
    <v-icon v-else-if="buttonType !== 'submit'" :class="[{ 'mr-3': isLong }, isExistingLogin ? 'text-white' : 'text-text_3']">
      {{ `$${iconName}` }}
    </v-icon>

    <div v-if="isLong" class="login-btn__text" :class="{ 'login-btn__text--existing': isExistingLogin }">
      <div>{{ formatDescription }}</div>
      <div v-if="email" class="font-weight-bold last-login-email">
        {{ email }}
      </div>
    </div>
  </button>
</template>

<script>
import config from '../../../config'
import { capitalizeFirstLetter } from '../../../utils/utils'

export default {
  props: {
    loginConfigItem: {
      type: Object,
      default() {
        return {}
      },
    },
    active: {
      type: Boolean,
      default: false,
    },
    isLong: {
      type: Boolean,
      default: false,
    },
    noIcon: {
      type: Boolean,
      default: false,
    },
    buttonType: {
      type: String,
      default: 'button',
    },
    isPopup: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    isExistingLogin: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      default: '',
    },
  },
  computed: {
    formatDescription() {
      if (this.isExistingLogin) return this.$t('dappLogin.continueWith', { verifier: capitalizeFirstLetter(this.loginConfigItem.name) })
      const name = this.loginConfigItem.name.charAt(0).toUpperCase() + this.loginConfigItem.name.slice(1)
      const params = { verifier: name }
      return this.loginConfigItem.description ? this.$t(this.loginConfigItem.description, params) : this.$t('dappLogin.continue', params)
    },
    iconName() {
      const normalVerifier = config.loginConfig[this.loginConfigItem.verifier]
      if (normalVerifier) return this.loginConfigItem.name.toLowerCase()
      return this.loginConfigItem.typeOfLogin.toLowerCase()
    },
    hasLightLogo() {
      return config.loginsWithLightLogo.includes(this.iconName)
    },
    buttonClass() {
      return [
        { active: this.active, 'v-theme--dark': this.isDarkMode, 'is-long': this.isLong, 'is-popup': this.isPopup, 'no-icon': this.noIcon },
        `gmt-login-${this.iconName}`,
        this.isExistingLogin ? 'text-white' : 'text-text_2',
      ]
    },
    buttonStyles() {
      return {
        background: this.isExistingLogin ? 'rgb(var(--v-theme-torusBrand1))' : undefined,
      }
    },
    isDarkMode() {
      return this.$vuetify.theme.name === 'dark'
    },
  },
  methods: {
    onMouseover() {
      this.$emit('mouseover')
    },
    onClick() {
      this.$emit('click')
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'LoginButton.scss';
</style>
