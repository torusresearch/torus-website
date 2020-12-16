<template>
  <div v-if="showLoginTkey" class="container d-flex">
    <span class="caption">
      {{ t('dappCreateTkey.linkDesc1') }}
      <a @click="openOnboarding">{{ t('dappCreateTkey.linkDesc2') }}</a>
      {{ t('dappCreateTkey.linkDesc3') }}
    </span>
    <v-spacer />
    <v-btn x-small icon class="ml-3" @click="showLoginTkey = false">
      <v-icon class="white--text" small>$vuetify.icons.close</v-icon>
    </v-btn>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      showLoginTkey: true,
    }
  },
  methods: {
    ...mapActions(['showWalletPopup']),
    openOnboarding() {
      this.showWalletPopup({ path: 'tkey' })
      this.showLoginTkey = false
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'DappCreateTkey.scss';
</style>
