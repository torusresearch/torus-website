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
      v-if="(active || $vuetify.breakpoint.xsOnly) && buttonType !== 'submit' && !isExistingLogin"
      :src="
        loginConfigItem.logoHover || require(`../../../assets/img/icons/login-${iconName}${hasLightLogo && $vuetify.theme.dark ? '-light' : ''}.svg`)
      "
      :alt="`${loginConfigItem.name} Icon`"
      :class="{ 'mr-3': isLong }"
    />
    <img
      v-else-if="($vuetify.theme.isDark || isExistingLogin) && loginConfigItem.logoLight && buttonType !== 'submit'"
      :src="loginConfigItem.logoLight"
      :alt="`${loginConfigItem.name} Icon`"
      :class="{ 'mr-3': isLong }"
    />
    <img
      v-else-if="!$vuetify.theme.isDark && loginConfigItem.logoDark && buttonType !== 'submit'"
      :src="loginConfigItem.logoDark"
      :alt="`${loginConfigItem.name} Icon`"
      :class="{ 'mr-3': isLong }"
    />
    <v-icon v-else-if="buttonType !== 'submit'" :class="[{ 'mr-3': isLong }, isExistingLogin ? 'white--text' : 'text_3--text']">
      {{ `$vuetify.icons.${iconName}` }}
    </v-icon>

    <div v-if="isLong" class="button-text">
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
      let finalDesc = ''
      if (this.isExistingLogin) {
        finalDesc = this.t('dappLogin.continueWith').replace(/{verifier}/gi, capitalizeFirstLetter(this.loginConfigItem.name))
      } else {
        finalDesc = this.loginConfigItem.description ? this.t(this.loginConfigItem.description) : this.t('dappLogin.continue')
      }
      return finalDesc.replace(/{verifier}/gi, this.loginConfigItem.name.charAt(0).toUpperCase() + this.loginConfigItem.name.slice(1))
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
        { active: this.active, 'theme--dark': this.$vuetify.theme.dark, 'is-long': this.isLong, 'is-popup': this.isPopup, 'no-icon': this.noIcon },
        `gmt-login-${this.iconName}`,
        this.isExistingLogin ? 'white--text' : 'text_2--text',
      ]
    },
    buttonStyles() {
      return {
        background: this.isExistingLogin ? 'var(--v-torusBrand1-base)' : undefined,
      }
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
