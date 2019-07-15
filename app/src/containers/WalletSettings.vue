<template>
  <v-layout mt-5 row wrap align-start justify-center align-content-start>
    <v-flex xs12 sm8>
      <span>
        <v-icon alt="Account" :color="$vuetify.theme.torus_blue" size="28">settings</v-icon>
        <span class="text-bluish headline">Settings</span>
      </span>
    </v-flex>
    <v-flex xs12 sm8 mt-3 mb-3>
      <div class="d-flex" style="align-items:center;">
        <span class="body-2">Selected Network</span>
        <v-select
          single-line
          solo
          text
          :items="networks"
          item-text="name"
          item-value="value"
          id="selectBox"
          class="set-size setheight"
          v-model="selectedNetwork"
          @change="changeNetwork"
          label="Network"
        ></v-select>
      </div>
    </v-flex>
    <v-flex xs12 sm8>
      <template v-if="isRPCSelected">
        <v-card text :color="$vuetify.theme.torus_bcg" class="fill-height">
          <v-form ref="form" v-model="formValid" lazy-validation @submit.prevent="">
            <v-layout row wrap align-center justify-center align-content-start>
              <v-flex xs12 sm6 align-self-center>
                <span class="body-2">Enter Network Name</span>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                  placeholder="Enter Network Name"
                  aria-label="network name"
                  v-model="rpc.networkName"
                  solo
                  text
                  required
                  :rules="[rules.required]"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <span class="body-2">Enter RPC URL</span>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                  id="amount"
                  placeholder="Enter RPC URL"
                  aria-label="rpc url"
                  solo
                  text
                  required
                  v-model="rpc.networkUrl"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <span class="body-2">Enter Chain Id</span>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field id="amount" placeholder="Enter chain Id" aria-label="chain Id" solo text required v-model="rpc.chainId"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-layout row wrap>
                  <v-flex class="text-xs-left" id="flexibtn">
                    <v-tooltip bottom :disabled="formValid">
                      <template v-slot:activator="{ on }">
                        <span v-on="on">
                          <v-btn id="flexibtn" :disabled="!formValid" outlined large class="btnStyle" @click="setRPC">Confirm</v-btn>
                        </span>
                      </template>
                      <span>Resolve the errors</span>
                    </v-tooltip>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card>
      </template>
    </v-flex>
    <v-flex xs12 sm8 mb-5>
      <v-expansion-panel>
        <v-expansion-panel-content class="bodyBackground">
          <template v-slot:header>
            <div class="body-2">Frequently Asked Questions</div>
          </template>
          <v-card text :color="$vuetify.theme.torus_bcg">
            <v-card-text class="pt-0">
              Learn how to
              <a href="https://docs.tor.us" target="_blank" rel="noreferrer noopener">
                <span class="font-italic" style="text-decoration: underline;">Get Started</span>
              </a>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-flex>
    <v-flex xs12>
      <v-layout row wrap>
        <v-flex offset-xs10 xs2 align-self-center class="hidden-xs-only">
          <img :src="require('../../public/images/torus_logo.png')" />
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
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
      ],
      rpc: { chainId: '', networkName: '', networkUrl: '' },
      formValid: true,
      rules: {
        required: value => !!value || 'Required'
      }
    }
  },
  computed: {
    isRPCSelected() {
      return this.selectedNetwork === RPC
    }
  },
  methods: {
    changeNetwork(value) {
      if (value !== RPC) this.$store.dispatch('setProviderType', { network: this.selectedNetwork })
    },
    setRPC() {
      this.selectedNetwork = RPC
      this.$store.dispatch('setProviderType', { network: this.rpc, type: RPC })
    }
  },
  mounted() {
    this.selectedNetwork = this.$store.state.networkType
    this.rpc = this.$store.state.rpcDetails
  }
}
</script>

<style lang="scss" scoped>
::v-deep .v-text-field--solo .v-input__slot,
.v-text-field--outline .v-input__slot {
  min-height: auto !important;
  display: flex !important;
  align-items: flex-end !important;
  border-radius: 17px !important;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.16) !important;
  margin-top: 20px !important;
  margin-bottom: 0px !important;
}

::v-deep .v-text-field.v-text-field--solo .v-input__control {
  min-height: auto !important;
}

::v-deep .v-expansion-panel {
  box-shadow: none !important;
}

::v-deep .v-expansion-panel__container {
  background-color: var(--v-torus_bcg-base) !important;
}

::v-deep .v-expansion-panel__header {
  padding-left: 0;
  padding-right: 10px;
}

%rounded {
  border-radius: 45px;
}

.set-size {
  max-width: 400px;
}

#flexibtn .btnStyle {
  width: 141px;
  height: 41px;
  border: #fff;
  background-color: #fff !important;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  @extend %rounded;
}
</style>
