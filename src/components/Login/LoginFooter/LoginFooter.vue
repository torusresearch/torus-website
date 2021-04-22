<template>
  <v-flex xs10 sm8 ml-auto mr-auto mb-6 class="footer-notes" :class="{ 'not-sm': !$vuetify.breakpoint.xsOnly }">
    <div class="text_3--text mb-4 mb-sm-6">
      <div class="text_2--text mb-2 font-weight-bold">{{ t('login.note') }}:</div>
      <div class="mb-2">{{ t('login.dataPrivacy') }}</div>
      <div v-if="authenticators.length > 0">
        <span>{{ t('dappLogin.termsAuth01') }}</span>
        <br />
        <span>{{ authenticators }}.</span>
        <a
          class="privacy-learn-more text_3--text ml-1 text-decoration-none"
          href="https://docs.tor.us/key-infrastructure/role-of-torus-nodes/oauth2-vs-proxy-sign-in"
          target="_blank"
          rel="noreferrer noopener"
        >
          {{ t('dappLogin.termsLearnMore') }}
        </a>
      </div>
    </div>
    <v-divider class="mb-2" />
    <div class="d-flex footer-links">
      <div class="mr-4">
        <a class="text-decoration-none" href="https://docs.tor.us/legal/terms-and-conditions" target="_blank" rel="noreferrer noopener">
          {{ t('dappLogin.termsConditions') }}
        </a>
      </div>
      <div class="mr-4">
        <a class="text-decoration-none" href="https://docs.tor.us/legal/privacy-policy" target="_blank" rel="noreferrer noopener">
          {{ t('dappLogin.privacyPolicy') }}
        </a>
      </div>
      <div class="mr-4">
        <a class="text-decoration-none" href="https://t.me/TorusLabs" target="_blank" rel="noreferrer noopener">
          {{ t('dappLogin.contactUs') }}
        </a>
      </div>
    </div>
  </v-flex>
</template>

<script>
export default {
  props: {
    authenticators: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'LoginFooter.scss';
</style>
