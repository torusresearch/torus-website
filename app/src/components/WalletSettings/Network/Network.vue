<template>
  <div :class="$vuetify.breakpoint.xsOnly ? '' : 'py-4 px-12'">
    <v-form ref="networkForm" v-model="formValid" lazy-validation @submit.prevent="">
      <span class="subtitle-2">Select Network</span>
      <v-flex>
        <v-select
          id="select-network"
          class="select-network-container"
          outlined
          :items="networks"
          item-text="networkName"
          item-value="host"
          v-model="selectedNetwork"
          @change="changeNetwork"
          return-object
          append-icon="$vuetify.icons.select"
        ></v-select>
      </v-flex>

      <template v-if="isRPCSelected">
        <v-flex xs12>
          <v-text-field placeholder="Enter Network Name" :rules="[rules.required]" outlined v-model="rpc.networkName"></v-text-field>
        </v-flex>

        <v-flex xs12>
          <v-text-field placeholder="Enter RPC URL" :rules="[rules.required]" outlined v-model="rpc.host"></v-text-field>
        </v-flex>

        <v-flex xs12>
          <v-text-field placeholder="Enter Chain id" outlined v-model="rpc.chainId"></v-text-field>
        </v-flex>

        <v-flex xs12 class="text-right">
          <v-tooltip bottom :disabled="formValid">
            <template v-slot:activator="{ on }">
              <span v-on="on">
                <v-btn :disabled="!formValid" depressed color="primary" @click="setRPC">Save</v-btn>
              </span>
            </template>
            <span>Resolve the errors</span>
          </v-tooltip>
        </v-flex>
      </template>
    </v-form>
  </div>
</template>

<script>
const { RPC, RPC_DISPLAY_NAME, SUPPORTED_NETWORK_TYPES } = require('../../../utils/enums')

export default {
  name: 'networkSettings',
  data() {
    return {
      selectedNetwork: {},
      networks: [
        ...Object.values(SUPPORTED_NETWORK_TYPES),
        {
          networkName: RPC_DISPLAY_NAME,
          host: RPC,
          chainId: ''
        }
      ],
      rpc: { chainId: '', networkName: '', host: '' },
      formValid: true,
      rules: {
        required: value => !!value || 'Required'
      }
    }
  },
  computed: {
    isRPCSelected() {
      return this.selectedNetwork.host === RPC
    }
  },
  methods: {
    changeNetwork(value) {
      if (value && value.host !== RPC) this.$store.dispatch('setProviderType', { network: this.selectedNetwork })
    },
    setRPC() {
      if (this.$refs.networkForm.validate()) {
        // this.selectedNetwork = RPC
        this.$store.dispatch('setProviderType', { network: this.rpc, type: RPC })
      }
    }
  },
  mounted() {
    this.selectedNetwork = this.$store.state.networkType
    this.rpc = this.$store.state.networkType
  }
}
</script>
