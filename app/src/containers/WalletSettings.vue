<template>
  <v-container fill-height>
    <v-layout row wrap align-start justify-center align-content-start>
      <v-flex xs12 sm3 align-self-center>
        <span class="body-2">Selected Network</span>
      </v-flex>
      <v-flex xs12 sm3>
        <v-select :items="networks" v-model="selectedNetwork" @change="changeNetwork" label="Network"></v-select>
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
export default {
  name: 'walletSettings',
  data() {
    return {
      selectedNetwork: '',
      networks: ['mainnet', 'rinkeby', 'ropsten', 'kovan']
    }
  },
  methods: {
    changeNetwork(value) {
      this.$store.dispatch('setProviderType', { network: this.selectedNetwork })
    }
  },
  mounted() {
    this.selectedNetwork = localStorage.getItem('torus_network_type') || 'mainnet'
  }
}
</script>
