<template>
  <v-chip v-if="selectedNetwork !== ''" small class="caption network-chip" :class="!isUrlNetwork ? `network-chip--${host} text-capitalize` : ''">
    <v-icon size="12" v-text="'$vuetify.icons.network'"></v-icon>
    <span>{{ selectedNetwork }}</span>
  </v-chip>
</template>

<script>
import { SUPPORTED_NETWORK_TYPES } from '../../../utils/enums'

export default {
  props: ['network', 'storeNetworkType'],
  computed: {
    selectedNetwork() {
      let finalNetwork = ''
      if (this.network && typeof this.network === 'string' && SUPPORTED_NETWORK_TYPES[this.network]) {
        return SUPPORTED_NETWORK_TYPES[this.network].networkName
      }
      if (this.network.networkName) return this.network.networkName
      if (this.storeNetworkType) finalNetwork = !this.storeNetworkType.networkName ? this.storeNetworkType.host : this.storeNetworkType.networkName
      return finalNetwork
    },
    host() {
      return this.storeNetworkType.host
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
