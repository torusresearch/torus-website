<template>
  <v-btn
    class="gmt-login text_2--text"
    :class="[{ active, isDark: $vuetify.theme.dark }, `gmt-login-${verifier.name.toLowerCase()}`, { 'is-long': isLong }]"
    type="button"
    :block="block"
    @mouseover="onMouseover"
    @click="onClick"
  >
    <img
      v-if="active || $vuetify.breakpoint.xsOnly"
      :src="
        require(`../../../assets/img/icons/login-${verifier.name.toLowerCase()}${verifier.hasLightLogo && $vuetify.theme.dark ? '-light' : ''}.svg`)
      "
      :alt="`${verifier.name} Icon`"
    />
    <v-icon v-else class="text_3--text">
      {{ `$vuetify.icons.${verifier.name.toLowerCase()}` }}
    </v-icon>
    <span v-if="isLong" class="ml-2">{{ formatDescription }}</span>
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
  },
  computed: {
    formatDescription() {
      const finalDesc = this.verifier.torusDescription ? this.t(this.verifier.torusDescription) : this.t('dappLogin.continue')
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
