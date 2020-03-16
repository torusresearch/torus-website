<template>
  <v-chip v-if="selectedNetwork !== ''" small class="caption network-chip" :class="!isUrlNetwork ? `network-chip--${host} text-capitalize` : ''">
    <v-icon size="12" v-text="'$vuetify.icons.network'"></v-icon>
    <span>{{ selectedNetwork }}</span>
  </v-chip>
</template>

<script>
import { MAINNET, SUPPORTED_NETWORK_TYPES } from '../../../utils/enums'

export default {
  props: {
    network: {
      type: String,
      default: ''
    },
    storeNetworkType: {
      type: Object,
      default() {
        return { host: MAINNET, networkName: '', chainId: '' }
      }
    }
  },
  computed: {
    selectedNetwork() {
      if (this.network && SUPPORTED_NETWORK_TYPES[this.network]) {
        return SUPPORTED_NETWORK_TYPES[this.network].networkName
      }

      if (this.storeNetworkType) {
        const { host, networkName } = this.storeNetworkType
        return networkName || host
      }

      return ''
    },
    host() {
      return this.storeNetworkType.host
    },
    isUrlNetwork() {
      // Checks if input is a url including localhost, ip address and domain name
      return /^((?:http(s)?:\/\/)?([\w-.]+(?:\.[\w-.]+)+|localhost?)[\w!#$&'()*+,./:;=?@[\]~-]+)$/.test(this.selectedNetwork)
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'NetworkDisplay.scss';
</style>
