<template>
  <v-card
    class="dapp-card align-center"
    :class="{ 'theme--dark': $vuetify.theme.isDark, 'has-network': showNetwork }"
    @click="navigateToDapp"
    @keydown.enter="navigateToDapp"
  >
    <div class="d-flex">
      <img
        width="48"
        height="48"
        :src="`${getSrc}`"
        alt="Dapp Logo"
        :onerror="`if (!this.src.includes('images/dapp-${$vuetify.theme.dark ? 'dark' : 'light'}.svg')) this.src = '/images/dapp-${
          $vuetify.theme.dark ? 'dark' : 'light'
        }.svg';`"
      />
      <div class="d-flex align-start dapp-info flex-column">
        <p class="dapp-title">{{ dapp.title }}</p>
        <p class="dapp-category">{{ dapp.category }}</p>
        <p class="dapp-desc">{{ dapp.desc }}</p>
      </div>
    </div>
    <template v-if="showNetwork">
      <div v-if="!isSupportedNetwork" class="dapp-chip">
        <p class="dapp-chip-text">{{ dapp.network }}</p>
      </div>
      <NetworkDisplay
        v-else
        :network="dapp.network"
        :show-icon="false"
        :store-network-type="{ host: dapp.network, networkName: '', chainId: '' }"
      ></NetworkDisplay>
    </template>
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
