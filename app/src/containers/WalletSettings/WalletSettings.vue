<template>
  <v-layout mt-1 wrap class="wallet-settings">
    <v-flex xs12 sm8 px-4>
      <v-expansion-panels multiple>
        <!-- Privacy and security settings -->
        <v-expansion-panel>
          <v-expansion-panel-header id="privacy-panel-header" :class="$vuetify.breakpoint.xsOnly ? 'pa-0' : ''" expand-icon="$vuetify.icons.select">
            <v-icon :small="$vuetify.breakpoint.xsOnly" class="d-inline-flex mr-4 text_2--text shrink" v-text="'$vuetify.icons.lock'" />
            <div class="grow text_1--text font-weight-bold" :class="$vuetify.breakpoint.xsOnly ? 'subtitle-1' : 'title'">
              Privacy and Security
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content class="privacy-security-container">
            <div :class="$vuetify.breakpoint.xsOnly ? '' : 'py-0 px-12'">
              <v-list>
                <v-list-item id="private-key-btn" @click="privateKeyDialog = true">
                  <v-list-item-action class="mr-4">
                    <v-icon :small="$vuetify.breakpoint.xsOnly" class="mr-4 text_2--text" v-text="'$vuetify.icons.key'" />
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title class="text_1--text">Private Key</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item id="dapp-permisson-btn" @click="dappPermissionDialog = true">
                  <v-list-item-action class="mr-4">
                    <v-icon :size="$vuetify.breakpoint.xsOnly ? 12 : 16" class="mr-4 text_2--text" v-text="'$vuetify.icons.list'" />
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title class="text_1--text">DApp Permission</v-list-item-title>
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
          <v-expansion-panel-header id="network-panel-header" :class="$vuetify.breakpoint.xsOnly ? 'pa-0' : ''" expand-icon="$vuetify.icons.select">
            <v-icon :small="$vuetify.breakpoint.xsOnly" class="d-inline-flex mr-4 text_2--text shrink" v-text="'$vuetify.icons.globe'" />
            <div class="grow text_1--text font-weight-bold" :class="$vuetify.breakpoint.xsOnly ? 'subtitle-1' : 'title'">
              Network
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div :class="$vuetify.breakpoint.xsOnly ? '' : 'py-4 px-12'">
              <v-form ref="form" v-model="formValid" lazy-validation @submit.prevent="">
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
          </v-expansion-panel-content>
        </v-expansion-panel>

        <!-- Display Settings -->
        <v-expansion-panel>
          <v-expansion-panel-header id="display-panel-header" :class="$vuetify.breakpoint.xsOnly ? 'pa-0' : ''" expand-icon="$vuetify.icons.select">
            <v-icon :small="$vuetify.breakpoint.xsOnly" class="d-inline-flex mr-4 text_2--text shrink" v-text="'$vuetify.icons.server'" />
            <div class="grow text_1--text font-weight-bold" :class="$vuetify.breakpoint.xsOnly ? 'subtitle-1' : 'title'">
              Display
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div :class="$vuetify.breakpoint.xsOnly ? '' : 'py-4 px-12'">
              <div class="body-2 text_1--text mb-1 px-1">Select Theme</div>
              <v-layout wrap>
                <v-flex xs12 sm4 px-1 mb-1 v-for="theme in themes" :key="`${theme.name}`">
                  <v-btn
                    @click="selectTheme(theme.name)"
                    depressed
                    block
                    class="theme-btn"
                    :class="`${theme.name}-color`"
                    :style="themeBtnStyle(theme)"
                  >
                    {{ theme.label }}
                  </v-btn>
                </v-flex>
              </v-layout>
              <v-flex class="pt-4 text-right">
                <v-btn color="primary" depressed class="px-12 py-1 mt-4" @click="saveTheme()">Save</v-btn>
              </v-flex>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-flex>
    <v-snackbar v-model="snackbar" :color="snackbarColor">
      {{ snackbarText }}
      <v-btn dark text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
  </v-layout>
</template>

//
<script>
import themes from '../../plugins/themes'
import PrivateKeys from '../../components/WalletSettings/PrivateKeys'
import DappPermissions from '../../components/WalletSettings/DappPermissions'
import log from 'loglevel'

const { RPC, RPC_DISPLAY_NAME, SUPPORTED_NETWORK_TYPES } = require('../../utils/enums')

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
      },
      themes: themes,
      snackbar: false,
      snackbarText: '',
      snackbarColor: 'success'
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
      // this.selectedNetwork = RPC
      this.$store.dispatch('setProviderType', { network: this.rpc, type: RPC })
    },
    selectTheme(themeName) {
      this.$store.dispatch('setTheme', themeName)
    },
    saveTheme() {
      this.$store
        .dispatch('setUserTheme')
        .then(() => {
          this.snackbar = true
          this.snackbarColor = 'success'
          this.snackbarText = 'Successfully saved theme'
        })
        .catch(err => {
          this.snackbar = true
          this.snackbarColor = 'error'
          this.snackbarText = err
        })
    },
    themeBtnStyle(theme) {
      return {
        color: theme.theme.primary,
        backgroundColor: theme.theme.background_body_1,
        borderColor: theme.theme.primary,
        borderWidth: '1px',
        borderStyle: 'solid'
      }
    }
  },
  mounted() {
    this.selectedNetwork = this.$store.state.networkType
    this.rpc = this.$store.state.networkType
  }
}
//
</script>

<style lang="scss" scoped>
@import 'WalletSettings.scss';
</style>
