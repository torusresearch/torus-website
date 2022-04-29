<template>
  <v-flex xs10 sm8 ml-auto mr-auto mb-6 class="footer-notes" :class="{ 'not-sm': !$vuetify.breakpoint.xsOnly }">
    <div class="text_3--text mb-4 mb-sm-6">
      <div class="mb-2">
        <span class="text_2--text">{{ t('login.selfCustodial') }}</span>
        <br />
        <img src="../../../assets/images/web3auth-dark.svg" alt="web3auth logo" />
        <br />
        <a class="text_3--text" href="https://docs.web3auth.io/" target="_blank" rel="noreferrer noopener">
          {{ t('login.howWorks') }}
        </a>
      </div>
      <div class="mb-2">{{ t('login.dataPrivacy') }}</div>
    </div>
    <v-divider class="mb-2" />
    <div class="d-flex footer-links mb-8 mb-sm-10">
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
    <div class="caption text_2--text font-italic">{{ t('dappLogin.version').replace(/\{version\}/gi, appVersion) }}</div>
  </v-flex>
</template>

<script>
import config from '../../../config'

export default {
  props: {
    authenticators: {
      type: String,
      default: '',
    },
  },
  computed: {
    appVersion() {
      return config.appVersion.replace('v', '')
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'LoginFooter.scss';
</style>
