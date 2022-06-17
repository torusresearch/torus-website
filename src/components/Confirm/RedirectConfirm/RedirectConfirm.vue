<template>
  <v-card class="text-center">
    <v-layout class="redirect-container pt-16" align-center>
      <div class="body px-4" align-center>
        <img height="86" class="mb-16" :src="require(`@/assets/images/torus-icon-blue.svg`)" alt="torus-icon" />
        <div class="font-weight-bold text-h5 pb-3">{{ t('redirect.headerText') }}</div>
        <div class="text-body-1 pb-7">{{ description }}</div>
        <v-btn plain text small color="torusBrand1" class="v-btn--active text-h6" :href="redirectUrl">
          {{ linkTitle }}
        </v-btn>
      </div>
      <div class="footer px-4">
        <div class="text-body-1 pb-1">{{ footerHeaderText }}</div>
        <div class="text-body-2">{{ footerBodyText }}</div>
        <div class="d-inline-flex">
          <div class="text-body-2">{{ t('redirect.questionsNote') }}</div>
          <v-btn active plain x-small text color="torusBrand1" class="v-btn--active text-body-2" :href="questionRedirectLink" target="_blank">
            {{ t('redirect.learnMore') }}
          </v-btn>
        </div>
      </div>
    </v-layout>
  </v-card>
</template>

<script>
export default {
  name: 'RedirectConfirm',
  components: {},
  props: {
    description: {
      type: String,
      default: '',
    },
    redirectUrl: {
      type: String,
      default: undefined,
    },
    linkTitle: {
      type: String,
      default: '',
    },
    questionRedirectLink: {
      type: String,
      default: '',
    },
    footerHeaderText: {
      type: String,
      default: '',
    },
    footerBodyText: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'RedirectConfirm.scss';
</style>
