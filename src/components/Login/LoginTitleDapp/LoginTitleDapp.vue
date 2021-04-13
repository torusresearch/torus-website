<template>
  <div class="headline verifier-title font-weight-regular text_2--text">
    <span>
      {{ t('dappLogin.yourDigital') }}
      <span v-if="activeButtonDetails.verifier === GOOGLE_VERIFIER" :class="{ 'font-weight-bold': !$vuetify.breakpoint.xsOnly }">
        <span class="verifier-title__google-blue">G</span>
        <span class="verifier-title__google-red">o</span>
        <span class="verifier-title__google-yellow">o</span>
        <span class="verifier-title__google-blue">g</span>
        <span class="verifier-title__google-green">l</span>
        <span class="verifier-title__google-red">e</span>
      </span>
      <span
        v-else
        class="text-capitalize"
        :class="[
          `verifier-title__${activeButtonDetails.name.toLowerCase()}`,
          { 'white--text': activeButtonDetails.hasLightLogo && $vuetify.theme.dark },
          { 'font-weight-bold': !$vuetify.breakpoint.xsOnly },
        ]"
      >
        {{ activeButtonDetails.name }}
      </span>
    </span>
  </div>
</template>

<script>
import { GOOGLE_VERIFIER } from '../../../utils/enums'

export default {
  props: {
    activeButtonDetails: {
      type: Object,
      default() {
        return {
          verifier: '',
        }
      },
    },
  },
  data() {
    return {
      GOOGLE_VERIFIER,
    }
  },
}
</script>

<style lang="scss" scoped>
@import 'LoginTitleDapp.scss';
</style>
