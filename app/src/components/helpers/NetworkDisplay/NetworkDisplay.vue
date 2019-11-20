<template>
  <v-chip
    v-if="selectedNetwork !== ''"
    small
    class="caption network-chip black--text"
    :class="!isUrlNetwork ? `network-chip--${host} text-capitalize` : ''"
  >
    <v-icon size="12" class="black--text" v-text="'$vuetify.icons.network'"></v-icon>
    <span>{{ selectedNetwork }}</span>
  </v-chip>
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
  },
  created() {
    console.log('network', this.network)
  }
}
</script>

<style lang="scss" scoped>
@import 'NetworkDisplay.scss';
</style>
