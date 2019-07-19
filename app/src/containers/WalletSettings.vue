<template>
  <v-layout mt-3 row wrap class="wallet-settings">
    <v-flex xs12 sm8 px-3>
      <!-- Privacy and security settings -->
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <div class="expasion-header-content">
              <div class="title">
                <img :src="require(`../../public/img/icons/lock.svg`)" class="inline-small collpase-icon" />
                <div class="d-inline ml-4 text-black font-weight-bold headline">Privacy and Security</div>
              </div>

              <img :src="require(`../../public/img/icons/chevron-big-down.svg`)" class="inline-small chevron-icon" />
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content class="py-4 px-5">
            <div class="mt-2">
              <v-dialog v-model="privateKeyDialog" max-width="1000">
                <template v-slot:activator="{ on }">
                  <v-btn text class="icon-button py-2" v-on="on">
                    <img :src="require(`../../public/img/icons/key.svg`)" class="inline-small mr-3" />
                    Private Key
                  </v-btn>
                </template>
                <private-keys @onClose="privateKeyDialog = false" />
              </v-dialog>
            </div>
            <div class="mb-3">
              <v-dialog v-model="dappPermissionDialog" max-width="1000">
                <template v-slot:activator="{ on }">
                  <v-btn text class="icon-button py-2" v-on="on">
                    <img :src="require(`../../public/img/icons/list.svg`)" class="inline-small mr-3" />
                    Deep Permission
                  </v-btn>
                </template>
                <wallet-settings-permission @onClose="dappPermissionDialog = false" />
              </v-dialog>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>

      <!-- Network Settigs -->
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <div class="expasion-header-content">
              <div class="title">
                <img :src="require(`../../public/img/icons/globe.svg`)" class="inline-small collpase-icon" />
                <div class="d-inline ml-4 text-black font-weight-bold headline">Network</div>
              </div>

              <img :src="require(`../../public/img/icons/chevron-big-down.svg`)" class="inline-small chevron-icon" />
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content class="py-4 px-5">
            <v-form ref="inputForm" class="px-3">
              <v-flex mb-5>
                <v-select
                  class="custom-text-input"
                  single-line
                  solo
                  text
                  :items="networks"
                  item-text="name"
                  item-value="value"
                  v-model="selectedNetwork"
                  @change="changeNetwork"
                  label="Select Import Type"
                  append-icon="$vuetify.icons.dropdown"
                ></v-select>
              </v-flex>

              <v-flex xs12 mb-3>
                <v-text-field class="custom-text-input" placeholder="Enter Network Name" solo v-model="networkName"></v-text-field>
              </v-flex>

              <v-flex xs12 mb-3>
                <v-text-field class="custom-text-input" placeholder="Enter RPC URL" solo v-model="rpcValue"></v-text-field>
              </v-flex>
            </v-form>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>

      <!-- Display Settings -->
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <div class="expasion-header-content">
              <div class="title">
                <img :src="require(`../../public/img/icons/server.svg`)" class="inline-small collpase-icon" />
                <div class="d-inline ml-4 text-black font-weight-bold headline">Display</div>
              </div>

              <img :src="require(`../../public/img/icons/chevron-big-down.svg`)" class="inline-small chevron-icon" />
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content class="py-4 px-5">
            <p>Select Theme</p>
            <div class="theme-options mb-5">
              <v-btn class="btn-theme btn-default" @click.prevent="seletecTheme('default')">Default</v-btn>

              <v-btn class="btn-theme btn-cerulean" @click.prevent="seletecTheme('cerulean')">Cerulean Blue</v-btn>

              <v-btn class="btn-theme btn-shuttle-grey" @click.prevent="seletecTheme('grey')">Shuttle Grey</v-btn>
            </div>

            <v-flex class="pt-5 save-container">
              <v-btn color="primary" class="px-5 py-1 mt-3">Save</v-btn>
            </v-flex>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-flex>
  </v-layout>
</template>

//
<script>
import PrivateKeys from '../components/PrivateKeys'
import WalletSettingsPermission from './WalletSettingsPermission'

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
  components: {
    PrivateKeys,
    WalletSettingsPermission
  },
  data() {
    return {
      privateKeyDialog: false,
      dappPermissionDialog: false,
      selectedNetwork: '',
      networkName: '',
      rpcValue: '',
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
      },
      themeSelected: ''
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
    },
    seletecTheme(value) {
      this.themeSelected = value
    }
  },
  mounted() {
    this.selectedNetwork = this.$store.state.networkType
    this.rpc = this.$store.state.rpcDetails
  }
}
//
</script>

<style lang="scss">
.wallet-settings {
  .chevron-icon {
    transition: ease 0.2s;
  }

  .v-expansion-panel--active {
    .chevron-icon {
      transform: rotate(180deg);
      transition: ease 0.2s;
    }
  }

  .v-expansion-panel {
    background-color: transparent !important;
    border-radius: 0;

    &::before {
      box-shadow: none !important;
      border-bottom: 1px solid #979797;
      border-radius: 0;
    }
  }

  .expasion-header-content {
    align-items: center;
    display: flex;
    justify-content: space-between;
    width: 100%;

    .title {
      align-items: center;
      display: flex;
    }
  }

  .icon-button {
    background-color: transparent;
    box-shadow: none !important;
    height: auto !important;
  }

  .custom-text-input {
    .v-input__slot {
      background: transparent !important;
      box-shadow: none !important;
      border: 1px solid #d3d5e2 !important;
    }
  }

  .btn-theme {
    border-radius: 3px;
    box-shadow: none !important;
    height: 43px !important;
    width: 163px;
  }
  .btn-default {
    color: #5495f7;
    background-color: white;
    border: 1px solid #5495f7;
  }

  .btn-cerulean {
    background-color: #295dab !important;
    border: 1px solid #295dab;

    .v-btn__content {
      color: white;
    }
  }

  .btn-shuttle-grey {
    background-color: #5c6c7f !important;
    border: 1px solid #5c6c7f;

    .v-btn__content {
      color: white;
    }
  }

  .theme-options {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .save-container {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>
