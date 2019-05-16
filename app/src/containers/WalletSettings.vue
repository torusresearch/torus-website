<template>
  <v-container fill-height>
    <v-layout row wrap align-start justify-center align-content-start>
      <v-flex xs12 sm3 align-self-center>
        <span class="body-2">Selected Network</span>
      </v-flex>
      <v-flex xs12 sm3>
        <v-select
          single-line
          solo
          flat
          :items="networks"
          item-text="name"
          item-value="value"
          id="selectBox"
          class="setheight"
          v-model="selectedNetwork"
          @change="changeNetwork"
          label="Network"
        ></v-select>
      </v-flex>
      <v-flex xs12>
        <v-layout row wrap>
          <v-flex offset-xs10 xs2 align-self-center class="hidden-xs-only">
            <img :src="require('../../public/images/torus_logo.png')" />
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
const {
  ROPSTEN,
  RINKEBY,
  KOVAN,
  MAINNET,
  LOCALHOST,
  GOERLI,
  RPC,
  ROPSTEN_DISPLAY_NAME,
  RINKEBY_DISPLAY_NAME,
  KOVAN_DISPLAY_NAME,
  MAINNET_DISPLAY_NAME,
  LOCALHOST_DISPLAY_NAME,
  GOERLI_DISPLAY_NAME,
  RPC_DISPLAY_NAME
} = require('../utils/enums')

export default {
  name: 'walletSettings',
  data() {
    return {
      selectedNetwork: '',
      networks: [
        {
          name: MAINNET_DISPLAY_NAME,
          value: MAINNET
        },
        {
          name: ROPSTEN_DISPLAY_NAME,
          value: ROPSTEN
        },
        {
          name: RINKEBY_DISPLAY_NAME,
          value: RINKEBY
        },
        {
          name: KOVAN_DISPLAY_NAME,
          value: KOVAN
        },
        {
          name: GOERLI_DISPLAY_NAME,
          value: GOERLI
        },
        {
          name: LOCALHOST_DISPLAY_NAME,
          value: LOCALHOST
        },
        {
          name: RPC_DISPLAY_NAME,
          value: RPC
        }
      ]
    }
  },
  methods: {
    changeNetwork(value) {
      if (value !== RPC) this.$store.dispatch('setProviderType', { network: this.selectedNetwork })
    }
  },
  mounted() {
    this.selectedNetwork = localStorage.getItem('torus_network_type') || MAINNET
  }
}
</script>

<style lang="scss">
.v-text-field--solo .v-input__slot,
.v-text-field--outline .v-input__slot {
  min-height: auto !important;
  display: flex !important;
  align-items: flex-end !important;
  border-radius: 17px !important;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.16);
  margin-top: 20px;
  margin-bottom: 0px;
}

.v-text-field.v-text-field--solo .v-input__control {
  min-height: auto !important;
}
</style>
