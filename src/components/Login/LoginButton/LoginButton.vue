<template>
  <button
    v-ripple="{ center: true }"
    class="gmt-login login-btn text_2--text"
    :disabled="disabled"
    :type="buttonType"
    :class="[
      { active, 'theme--dark': $vuetify.theme.dark },
      `gmt-login-${iconName}`,
      { 'is-long': isLong },
      { 'is-popup': isPopup },
      { 'no-icon': noIcon },
    ]"
    @mouseover="onMouseover"
    @click="onClick"
  >
    <img
      v-if="(active || $vuetify.breakpoint.xsOnly) && buttonType !== 'submit'"
      :src="verifier.logoHover || require(`../../../assets/img/icons/login-${iconName}${hasLightLogo && $vuetify.theme.dark ? '-light' : ''}.svg`)"
      :alt="`${verifier.name} Icon`"
      :class="{ 'mr-3': isLong }"
    />
    <img
      v-else-if="$vuetify.theme.isDark && verifier.logoLight && buttonType !== 'submit'"
      :src="verifier.logoLight"
      :alt="`${verifier.name} Icon`"
      :class="{ 'mr-3': isLong }"
    />
    <img
      v-else-if="!$vuetify.theme.isDark && verifier.logoDark && buttonType !== 'submit'"
      :src="verifier.logoDark"
      :alt="`${verifier.name} Icon`"
      :class="{ 'mr-3': isLong }"
    />
    <v-icon v-else-if="buttonType !== 'submit'" class="text_3--text" :class="{ 'mr-3': isLong }">
      {{ `$vuetify.icons.${iconName}` }}
    </v-icon>
    <span v-if="isLong">{{ formatDescription }}</span>
  </button>
</template>

<script>
import config from '../../../config'

export default {
  props: {
    verifier: {
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
  },
  computed: {
    formatDescription() {
      const finalDesc = this.verifier.description ? this.t(this.verifier.description) : this.t('dappLogin.continue')
      return finalDesc.replace(/{verifier}/gi, this.verifier.name.charAt(0).toUpperCase() + this.verifier.name.slice(1))
    },
    iconName() {
      const normalVerifier = config.loginConfig[this.verifier.verifier]
      if (normalVerifier) return this.verifier.name.toLowerCase()
      return this.verifier.typeOfLogin.toLowerCase()
    },
    hasLightLogo() {
      return config.loginsWithLightLogo.includes(this.iconName)
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
