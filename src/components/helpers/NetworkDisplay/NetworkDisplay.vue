<template>
  <div class="d-flex network-chip align-center" :class="[chipClass, minimal ? 'network-chip--minimal' : '']">
    <v-icon v-text="'$vuetify.icons.network'"></v-icon>
    <span class="network-chip__name text-clamp-one" :class="{ 'network-chip__name--mobile': $vuetify.breakpoint.xsOnly }">
      {{ $vuetify.breakpoint.xsOnly && !minimal ? shortSelectedNetwork : selectedNetwork }}
    </span>
  </div>
</template>

<script>
import { MAINNET, SUPPORTED_NETWORK_TYPES } from '../../../utils/enums'

export default {
  props: {
    network: {
      type: String,
      default: '',
    },
    storeNetworkType: {
      type: Object,
      default() {
        return { host: MAINNET, networkName: '', chainId: '' }
      },
    },
    isPlain: {
      type: Boolean,
      default: false,
    },
    minimal: {
      type: Boolean,
      default: false,
    },
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
    shortSelectedNetwork() {
      return this.selectedNetwork.replace(' Network', '')
    },
    host() {
      return this.storeNetworkType.host
    },
    isUrlNetwork() {
      // Checks if input is a url including localhost, ip address and domain name
      return /^((?:http(s)?:\/\/)?([\w-.]+(?:\.[\w-.]+)+|localhost?)[\w!#$&'()*+,./:;=?@[\]~-]+)$/.test(this.selectedNetwork)
    },
    chipClass() {
      const classArray = []
      if (!this.isUrlNetwork) {
        classArray.push(`network-chip--${this.host.toLowerCase()}`, 'text-capitalize')
      }
      if (this.$vuetify.theme.isDark) classArray.push('theme--dark')

      if (this.isPlain) {
        classArray.push('is-plain')
      }
      return classArray
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'NetworkDisplay.scss';
</style>
