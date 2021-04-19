<template>
  <v-flex class="mb-2 mb-sm-0" xs10 sm8 ml-auto mr-auto>
    <div class="verifier-title font-weight-bold" :class="[$vuetify.breakpoint.xsOnly ? 'display-1' : 'display-2']">
      <span class="text_2--text">
        {{ t('login.your') }}
        <span v-if="activeButtonDetails.verifier === GOOGLE_VERIFIER">
          <span class="verifier-title__google-blue">G</span>
          <span class="verifier-title__google-red">o</span>
          <span class="verifier-title__google-yellow">o</span>
          <span class="verifier-title__google-blue">g</span>
          <span class="verifier-title__google-green">l</span>
          <span class="verifier-title__google-red">e</span>
        </span>
        <span
          v-else-if="activeButtonDetails.verifier"
          class="text-capitalize"
          :class="[
            `verifier-title__${activeButtonDetails.name.toLowerCase()}`,
            { 'white--text': activeButtonDetails.hasLightLogo && $vuetify.theme.dark },
          ]"
        >
          {{ activeButtonDetails.name }}
        </span>
      </span>
    </div>
    <div class="font-weight-bold text_2--text" :class="[$vuetify.breakpoint.xsOnly ? 'headline' : 'display-2']">
      {{ t('login.digitalWallet') }}
    </div>
  </v-flex>
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
@import 'LoginTitle.scss';
</style>
