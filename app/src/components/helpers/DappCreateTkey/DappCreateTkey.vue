<template>
  <div v-if="!tKeyExists && showLoginTkey" class="container d-flex">
    <span class="caption">
      {{ t('dappCreateTkey.linkDesc1') }}
      <a @click="goToTkeyOnboarding">{{ t('dappCreateTkey.linkDesc2') }}</a>
      {{ t('dappCreateTkey.linkDesc3') }}
    </span>
    <v-spacer />
    <v-btn x-small icon class="ml-3" @click="showLoginTkey = false">
      <v-icon class="white--text" small>$vuetify.icons.close</v-icon>
    </v-btn>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      showLoginTkey: true,
    }
  },
  computed: {
    ...mapState(['tKeyExists']),
  },
  methods: {
    goToTkeyOnboarding() {
      this.$router.push({ name: 'tkeyCreate' }).catch((_) => {})
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'DappCreateTkey.scss';
</style>
