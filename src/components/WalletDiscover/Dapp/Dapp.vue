<template>
  <v-card class="dapp-card d-flex align-center" :class="{ 'theme--dark': $vuetify.theme.isDark }">
    <img width="57" height="57" :src="`${getSrc()}`" alt="Dapp Logo" />
    <div class="d-flex align-start dapp-info flex-column">
      <p class="dapp-title">{{ dapp.title }}</p>
      <p class="dapp-category">{{ dapp.category }}</p>
      <div v-if="!isSupportedNetwork()" class="dapp-chip">
        <p class="dapp-chip-text">{{ dapp.network }}</p>
      </div>
      <NetworkDisplay
        v-if="isSupportedNetwork()"
        :network="dapp.network"
        :show-icon="false"
        :store-network-type="{ host: dapp.network, networkName: '', chainId: '' }"
      ></NetworkDisplay>
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
      default: () => undefined,
    },
  },
  data() {
    return {
      isLoadingDapps: true,
      errorText: '',
    }
  },
  computed: {},
  mounted() {},
  methods: {
    getSrc() {
      return this.dapp?.logo?.[0].url || ''
    },
    isSupportedNetwork() {
      return !!SUPPORTED_NETWORK_TYPES[this.dapp.network]?.host
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'Dapp.scss';
</style>
