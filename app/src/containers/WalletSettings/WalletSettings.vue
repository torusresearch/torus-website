<template>
  <v-layout mt-1 wrap class="wallet-settings">
    <v-flex xs12 sm8 px-4>
      <v-expansion-panels multiple>
        <!-- Privacy and security settings -->
        <v-expansion-panel>
          <v-expansion-panel-header :class="$vuetify.breakpoint.xsOnly ? 'pa-0' : ''" expand-icon="$vuetify.icons.select">
            <img
              :width="$vuetify.breakpoint.xsOnly ? '16' : ''"
              class="d-inline-flex mr-4 shrink"
              :src="require(`../../../public/img/icons/lock.svg`)"
            />
            <div class="grow font-weight-bold" :class="$vuetify.breakpoint.xsOnly ? 'subtitle-1' : 'headline'">
              Privacy and Security
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div :class="$vuetify.breakpoint.xsOnly ? '' : 'py-6 px-12'">
              <v-list>
                <v-list-item @click="privateKeyDialog = true">
                  <v-list-item-avatar class="mr-4">
                    <img :src="require(`../../../public/img/icons/key.svg`)" class=" mr-4" />
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>Private Key</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item @click="dappPermissionDialog = true">
                  <v-list-item-avatar class="mr-4">
                    <img :src="require(`../../../public/img/icons/list.svg`)" class=" mr-4" />
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>DApp Permission</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>

              <v-dialog v-model="privateKeyDialog" max-width="1000" :fullscreen="$vuetify.breakpoint.xsOnly">
                <private-keys @onClose="privateKeyDialog = false" />
              </v-dialog>
              <v-dialog v-model="dappPermissionDialog" max-width="1000" :fullscreen="$vuetify.breakpoint.xsOnly">
                <dapp-permissions @onClose="dappPermissionDialog = false" />
              </v-dialog>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <!-- Network Settigs -->
        <v-expansion-panel>
          <v-expansion-panel-header :class="$vuetify.breakpoint.xsOnly ? 'pa-0' : ''" expand-icon="$vuetify.icons.select">
            <img
              :width="$vuetify.breakpoint.xsOnly ? '16' : ''"
              class="d-inline-flex mr-4 shrink collpase-icon"
              :src="require(`../../../public/img/icons/globe.svg`)"
            />
            <div class="grow font-weight-bold" :class="$vuetify.breakpoint.xsOnly ? 'subtitle-1' : 'headline'">
              Network
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div :class="$vuetify.breakpoint.xsOnly ? '' : 'py-6 px-12'">
              <v-form ref="form" v-model="formValid" lazy-validation @submit.prevent="">
                <span class="subtitle-2">Select Network</span>
                <v-flex>
                  <v-select
                    outlined
                    :items="networks"
                    item-text="name"
                    item-value="value"
                    v-model="selectedNetwork"
                    @change="changeNetwork"
                    append-icon="$vuetify.icons.select"
                  ></v-select>
                </v-flex>

                <template v-if="isRPCSelected">
                  <v-flex xs12>
                    <v-text-field placeholder="Enter Network Name" :rules="[rules.required]" outlined v-model="rpc.networkName"></v-text-field>
                  </v-flex>

                  <v-flex xs12>
                    <v-text-field placeholder="Enter RPC URL" :rules="[rules.required]" outlined v-model="rpc.networkUrl"></v-text-field>
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
          </v-expansion-panel-content>
        </v-expansion-panel>

        <!-- Display Settings -->
        <v-expansion-panel>
          <v-expansion-panel-header :class="$vuetify.breakpoint.xsOnly ? 'pa-0' : ''" expand-icon="$vuetify.icons.select">
            <img
              :width="$vuetify.breakpoint.xsOnly ? '16' : ''"
              class="d-inline-flex mr-4 shrink collpase-icon"
              :src="require(`../../../public/img/icons/server.svg`)"
            />
            <div class="grow font-weight-bold" :class="$vuetify.breakpoint.xsOnly ? 'subtitle-1' : 'headline'">
              Display
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div :class="$vuetify.breakpoint.xsOnly ? '' : 'py-6 px-12'">
              <div class="body-2 mb-1 px-1">Select Theme</div>
              <v-layout wrap>
                <v-flex xs12 sm4 px-1 mb-1>
                  <v-btn light outlined block color="primary" class="btn-default" @click="selectTheme('default')">Default</v-btn>
                </v-flex>
                <v-flex xs12 sm4 px-1 mb-1>
                  <v-btn dark depressed block class="btn-cerulean" @click="selectTheme('cerulean-blue')">Cerulean Blue</v-btn>
                </v-flex>
                <v-flex xs12 sm4 px-1 mb-1>
                  <v-btn dark depressed block class="btn-shuttle-grey" @click="selectTheme('shuttle-grey')">Shuttle Grey</v-btn>
                </v-flex>
              </v-layout>
              <v-flex class="pt-12 text-right">
                <v-btn color="primary" depressed class="px-12 py-1 mt-4">Save</v-btn>
              </v-flex>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-flex>
  </v-layout>
</template>

//
<script>
import { lightBlue, ceruleanBlue, shuttleGrey } from '../../plugins/themes'
import PrivateKeys from '../../components/WalletSettings/PrivateKeys'
import DappPermissions from '../../components/WalletSettings/DappPermissions'

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
} = require('../../utils/enums')

export default {
  name: 'walletSettings',
  components: {
    PrivateKeys,
    DappPermissions
  },
  data() {
    return {
      privateKeyDialog: false,
      dappPermissionDialog: false,
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
    selectTheme(value) {
      let selectedTheme = lightBlue
      let isDark = false
      if (value === 'cerulean-blue') {
        selectedTheme = ceruleanBlue
        isDark = true
      } else if (value === 'shuttle-grey') {
        selectedTheme = shuttleGrey
        isDark = true
      }

      this.$vuetify.theme.dark = isDark
      if (isDark) {
        this.$vuetify.theme.themes.dark.background = selectedTheme.background
        console.log(this.$vuetify.theme.themes.dark)
      } else {
        this.$vuetify.theme.themes.light.background = selectedTheme.background
        console.log(this.$vuetify.theme.themes.light)
      }
    }
  },
  mounted() {
    this.selectedNetwork = this.$store.state.networkType
    this.rpc = this.$store.state.rpcDetails
  }
}
//
</script>

<style lang="scss" scoped>
@import 'WalletSettings.scss';
</style>
