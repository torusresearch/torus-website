<template>
  <div class="d-inline-flex network-chip align-center" :class="!isUrlNetwork ? `network-chip--${host} text-capitalize` : ''">
    <v-icon v-text="'$vuetify.icons.network'"></v-icon>
    <span class="network-chip__name text-clamp-one" :class="{ 'network-chip__name--mobile': $vuetify.breakpoint.xsOnly }">{{ selectedNetwork }}</span>
  </div>
  <!-- <v-chip v-if="selectedNetwork !== ''" small class="network-chip" :class="!isUrlNetwork ? `network-chip--${host} text-capitalize` : ''">
    <div class="d-flex align-center">
      <v-icon class="mr-1" size="12" v-text="'$vuetify.icons.network'"></v-icon>
      <span :class="{ caption: !$vuetify.breakpoint.xsOnly, caption: $vuetify.breakpoint.xsOnly }">{{ selectedNetwork }}</span>
    </div>
  </v-chip> -->
</template>

<script>
import { SUPPORTED_NETWORK_TYPES } from '../../../utils/enums'

export default {
  props: ['network'],
  computed: {
    selectedNetwork() {
      let finalNetwork = ''

      if (this.network) {
        return SUPPORTED_NETWORK_TYPES[this.network].networkName
      }

      finalNetwork =
        !this.$store.state.networkType.networkName || this.$store.state.networkType.networkName === ''
          ? this.$store.state.networkType.host
          : this.$store.state.networkType.networkName
      return finalNetwork
    },
    host() {
      return this.$store.state.networkType.host
    },
    isUrlNetwork() {
      // Checks if input is a url including localhost, ip address and domain name
      return /^((?:http(s)?:\/\/)?([\w.-]+(?:\.[\w\.-]+)+|localhost?)[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+)$/.test(this.selectedNetwork)
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'NetworkDisplay.scss';
</style>
