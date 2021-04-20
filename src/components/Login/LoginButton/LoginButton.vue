<template>
  <v-btn
    class="gmt-login text_2--text"
    :class="[{ active, isDark: $vuetify.theme.dark }, `gmt-login-${verifier.name.toLowerCase()}`, { 'is-long': isLong }]"
    :type="buttonType"
    :block="block"
    :disabled="disabled"
    @mouseover="onMouseover"
    @click="onClick"
  >
    <img
      v-if="(active || $vuetify.breakpoint.xsOnly) && buttonType !== 'submit'"
      :src="
        verifier.logoHover ||
        require(`../../../assets/img/icons/login-${verifier.name.toLowerCase()}${verifier.hasLightLogo && $vuetify.theme.dark ? '-light' : ''}.svg`)
      "
      :alt="`${verifier.name} Icon`"
    />
    <img
      v-else-if="$vuetify.theme.isDark && verifier.logoLight && buttonType !== 'submit'"
      :src="verifier.logoLight"
      :alt="`${verifier.name} Icon`"
    />
    <img v-else-if="!$vuetify.theme.isDark && verifier.logoDark && buttonType !== 'submit'" :src="verifier.logoDark" :alt="`${verifier.name} Icon`" />
    <v-icon v-else-if="buttonType !== 'submit'" size="26" class="text_3--text">
      {{ `$vuetify.icons.${verifier.name.toLowerCase()}` }}
    </v-icon>
    <span v-if="isLong">{{ formatDescription }}</span>
  </v-btn>
</template>

<script>
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
    block: {
      type: Boolean,
      default: false,
    },
    isLong: {
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
