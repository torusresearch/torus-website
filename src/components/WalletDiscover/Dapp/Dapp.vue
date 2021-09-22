<template>
  <v-card class="dapp-card d-flex align-center" :class="{ 'theme--dark': $vuetify.theme.isDark }" @click="navigateToDapp">
    <img width="57" height="57" :src="`${getSrc}`" alt="Dapp Logo" />
    <div class="d-flex align-start dapp-info flex-column">
      <span class="d-flex flex-row justify-space-between align-center title-row">
        <p class="dapp-title">{{ dapp.title }}</p>
        <div v-if="showNetwork" class="net-chip">
          <div v-if="!isSupportedNetwork" class="dapp-chip">
            <p class="dapp-chip-text">{{ dapp.network }}</p>
          </div>
          <NetworkDisplay
            v-else
            :network="dapp.network"
            :show-icon="false"
            :store-network-type="{ host: dapp.network, networkName: '', chainId: '' }"
          ></NetworkDisplay>
        </div>
      </span>
      <p class="dapp-category">{{ dapp.category }}</p>
      <p class="dapp-desc">{{ dapp.desc }}</p>
    </div>
  </v-card>
</template>

<script>
import { SUPPORTED_NETWORK_TYPES } from '../../../utils/enums'
import NetworkDisplay from '../../helpers/NetworkDisplay'

export default {
  components: { NetworkDisplay },
  props: {
    dapp: {
      type: Object,
      required: true,
    },
    showNetwork: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    getSrc() {
      return this.dapp?.logo?.[0].url || ''
    },
    isSupportedNetwork() {
      return !!SUPPORTED_NETWORK_TYPES[this.dapp.network]?.host
    },
  },
  methods: {
    navigateToDapp() {
      // open dapp homepage on click
      window.location.href = this.dapp.url
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'Dapp.scss';
</style>
