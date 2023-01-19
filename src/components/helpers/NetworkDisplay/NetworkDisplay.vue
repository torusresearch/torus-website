<template>
  <div v-if="!isNetworkPill" class="d-flex network-chip align-center" :class="[chipClass, minimal ? 'network-chip--minimal' : '']">
    <v-icon v-if="showIcon" left>$vuetify.icons.network</v-icon>
    <span class="network-chip__name text-clamp-one" :class="{ 'network-chip__name--mobile': $vuetify.breakpoint.xsOnly }">
      {{ $vuetify.breakpoint.xsOnly && !minimal ? shortSelectedNetwork : selectedNetwork }}
    </span>
  </div>
  <div v-else>
    <v-menu transition="slide-y-transition" class="select-menu" offset-y rounded="lg">
      <template #activator="{ on }">
        <div class="d-flex network-chip align-center" :class="[chipClass, minimal ? 'network-chip--minimal' : '']" v-on="on">
          <v-icon v-if="showIcon" left>$vuetify.icons.network</v-icon>
          <span class="network-chip__name text-clamp-one row-pointer" :class="{ 'network-chip__name--mobile': $vuetify.breakpoint.xsOnly }">
            {{ $vuetify.breakpoint.xsOnly && !minimal ? shortSelectedNetwork : selectedNetwork }}
          </span>
          <v-icon right>$vuetify.icons.selectNew</v-icon>
        </div>
      </template>
      <v-list class="select-item-list overflow-y-auto" style="max-height: 240px">
        <v-list-item
          v-for="networkInfo in supportedNetworks"
          :key="networkInfo.networkName"
          class="select-coin-eth"
          @click="changeNetwork(networkInfo)"
        >
          <v-list-item-content>
            <v-list-item-title class="body-2">
              <!-- <v-icon>$vuetify.icons.network</v-icon> -->
              {{ networkInfo.networkName }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
// import { debug } from 'console'
import log from 'loglevel'
import { mapGetters } from 'vuex'

import { MAINNET, RPC, SUPPORTED_NETWORK_TYPES } from '../../../utils/enums'
import { broadcastChannelOptions } from '../../../utils/utils'

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
    isNetworkPill: {
      type: Boolean,
      default: false,
    },
    isPlain: {
      type: Boolean,
      default: false,
    },
    minimal: {
      type: Boolean,
      default: false,
    },
    showIcon: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapGetters(['supportedNetworks']),
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
      return this.storeNetworkType.host || this.selectedNetwork
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
  methods: {
    showNotification(success) {
      this.$store.dispatch(
        success ? 'setSuccessMessage' : 'setErrorMessage',
        success ? 'walletSettings.updatedProvider' : 'walletSettings.somethingWrong'
      )
    },
    changeNetwork(value) {
      if (value && value.host !== RPC) {
        const payload = { network: value }
        this.$store
          .dispatch('setProviderType', payload)
          .then(() => {
            this.sendToIframe(payload)
            this.showNotification(true)
          })
          .catch((error) => {
            this.showNotification(false)
            log.error(error)
          })
      }
    },
    async sendToIframe(payload) {
      const urlInstance = this.$route.query.instanceId
      if (urlInstance && urlInstance !== '') {
        const providerChangeChannel = new BroadcastChannel(`provider_change_${urlInstance}`, broadcastChannelOptions)
        await providerChangeChannel.postMessage({
          data: {
            name: 'provider_change',
            payload,
          },
        })
        providerChangeChannel.close()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'NetworkDisplay.scss';
</style>
