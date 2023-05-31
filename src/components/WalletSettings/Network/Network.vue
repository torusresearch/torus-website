<template>
  <div :class="$vuetify.breakpoint.xsOnly ? 'pt-5' : 'py-5 px-4'">
    <v-form ref="networkForm" v-model="formValid" lazy-validation @submit.prevent="">
      <template v-if="!addCustomNetwork">
        <div class="body-2 mb-2">{{ t('walletSettings.selectNetwork') }}</div>
        <v-layout wrap class="network-setting">
          <v-flex xs12>
            <v-menu transition="slide-y-transition" offset-y>
              <template #activator="{ on }">
                <v-btn class="select-coin" label :outlined="$vuetify.theme.dark" v-on="on">
                  <span class="select-coin-name">{{ selectedNetwork.networkName }}</span>
                  <div class="flex-grow-1 text-right pr-2">
                    <v-icon right>$vuetify.icons.select</v-icon>
                  </div>
                </v-btn>
              </template>
              <v-list class="select-item-list overflow-y-auto" style="max-height: 240px">
                <v-list-item
                  v-for="host in defaultNetworks"
                  :key="supportedNetworks[host].networkName"
                  class="select-coin-eth"
                  @click="selectedItemChanged(supportedNetworks[host])"
                >
                  <v-list-item-content>
                    <v-list-item-title class="body-2">{{ supportedNetworks[host].networkName }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-subheader v-if="customNetworks.length > 0" class="subheading">
                  {{ t('walletSettings.customNetwork') }}
                </v-subheader>
                <v-list-item
                  v-for="host in customNetworks"
                  :key="supportedNetworks[host].networkName"
                  @click="selectedItemChanged(supportedNetworks[host])"
                >
                  <v-list-item-content>
                    <v-list-item-title class="body-2">{{ supportedNetworks[host].networkName }}</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-icon>
                    <v-btn
                      v-if="supportedNetworks[host].id"
                      color="text_3"
                      icon
                      small
                      :aria-label="`Edit ${supportedNetworks[host].networkName}`"
                      @click.stop="editNetwork(supportedNetworks[host])"
                    >
                      {{ t('walletSettings.editNetwork') }}
                    </v-btn>
                  </v-list-item-icon>
                  <v-list-item-icon>
                    <v-btn
                      v-if="supportedNetworks[host].id"
                      class="delete-btn"
                      color="text_2"
                      icon
                      small
                      :aria-label="`Delete ${supportedNetworks[host].networkName}`"
                      @click.stop="deleteNetwork(supportedNetworks[host])"
                    >
                      <v-icon x-small>$vuetify.icons.trash</v-icon>
                    </v-btn>
                  </v-list-item-icon>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-flex>
        </v-layout>
        <v-flex class="ml-auto text-right">
          <v-spacer></v-spacer>
          <v-btn
            id="add-custom-network"
            large
            class="torus-btn1"
            :class="$store.state.whiteLabel.isActive ? 'white--text' : 'torusBrand1--text'"
            :color="$store.state.whiteLabel.isActive ? 'torusBrand1' : ''"
            type="button"
            @click="toggleNetworkView"
          >
            {{ t('walletSettings.addCustomNetwork') }}
          </v-btn>
        </v-flex>
      </template>
      <template v-else>
        <v-flex xs12>
          <v-btn text class="caption text_3--text mb-2 plain" x-small @click="toggleNetworkView">{{ t('walletSettings.back') }}</v-btn>
          <v-text-field
            v-model="rpc.networkName"
            :placeholder="t('walletSettings.enterNetworkName')"
            :rules="[rules.required]"
            outlined
          ></v-text-field>
        </v-flex>

        <v-flex xs12>
          <v-text-field v-model="rpc.host" :placeholder="t('walletSettings.enterRpc')" :rules="[rules.required]" outlined></v-text-field>
        </v-flex>

        <v-flex xs12>
          <v-text-field
            v-model="rpc.chainId"
            :rules="[rules.required, rules.requiredHex]"
            :placeholder="t('walletSettings.enterChainId')"
            outlined
          ></v-text-field>
        </v-flex>

        <v-flex xs12>
          <v-text-field v-model="rpc.ticker" :placeholder="t('walletSettings.enterSymbol')" outlined></v-text-field>
        </v-flex>

        <v-flex xs12>
          <v-text-field v-model="rpc.blockExplorer" :placeholder="t('walletSettings.enterBlockExplorer')" outlined></v-text-field>
        </v-flex>

        <v-flex xs12 :class="!$vuetify.breakpoint.xsOnly ? 'pl-2' : ''">
          <v-layout>
            <v-spacer></v-spacer>
            <v-flex xs4>
              <v-tooltip bottom :disabled="formValid">
                <template #activator="{ on }">
                  <span v-on="on">
                    <v-btn
                      v-if="isEdit"
                      large
                      class="torus-btn1 py-1"
                      :class="$store.state.whiteLabel.isActive ? 'white--text' : 'torusBrand1--text'"
                      :color="$store.state.whiteLabel.isActive ? 'torusBrand1' : ''"
                      block
                      :disabled="!formValid"
                      depressed
                      @click="updateRPC"
                    >
                      {{ t('walletSettings.save') }}
                    </v-btn>
                    <v-btn
                      v-else
                      large
                      class="torus-btn1 py-1"
                      :class="$store.state.whiteLabel.isActive ? 'white--text' : 'torusBrand1--text'"
                      :color="$store.state.whiteLabel.isActive ? 'torusBrand1' : ''"
                      block
                      :disabled="!formValid"
                      depressed
                      @click="setRPC"
                    >
                      {{ t('walletSettings.save') }}
                    </v-btn>
                  </span>
                </template>
                <span>{{ t('walletSettings.resolveErrors') }}</span>
              </v-tooltip>
            </v-flex>
          </v-layout>
        </v-flex>
      </template>
    </v-form>
  </div>
</template>

<script>
import { BroadcastChannel } from '@toruslabs/broadcast-channel'
import { utils } from 'ethers'
import log from 'loglevel'
import { mapGetters, mapState } from 'vuex'

import { RPC, SUPPORTED_NETWORK_TYPES } from '../../../utils/enums'
import { broadcastChannelOptions, getDefaultNetwork } from '../../../utils/utils'

export default {
  name: 'NetworkSettings',
  data() {
    return {
      rpc: { chainId: '', networkName: '', host: '', blockExplorer: '', ticker: '' },
      formValid: true,
      rules: {
        required: (value) => !!value || 'Required',
        requiredHex: (value) => (!!value && utils.isHexString(value)) || 'Please enter chainId in hex format for ex: "0x1"',
      },
      addCustomNetwork: false,
      isEdit: false,
      defaultNetworks: Object.keys(SUPPORTED_NETWORK_TYPES),
    }
  },
  computed: {
    ...mapGetters(['supportedNetworks']),
    ...mapState(['networkType']),
    networks() {
      return Object.values(this.supportedNetworks)
    },
    isRPCSelected() {
      return this.selectedNetwork.host === RPC
    },
    customNetworks() {
      return Object.keys(this.supportedNetworks).filter((n) => !Object.keys(SUPPORTED_NETWORK_TYPES).includes(n))
    },
    selectedNetwork() {
      return this.networkType
    },
  },
  methods: {
    showNotification(success) {
      this.$store.dispatch(
        success ? 'setSuccessMessage' : 'setErrorMessage',
        success ? 'walletSettings.updatedProvider' : 'walletSettings.somethingWrong'
      )
    },
    changeNetwork(value) {
      log.info(value)
      if (value && value.host !== RPC) {
        const payload = { network: value }
        this.$store
          .dispatch('setProviderType', payload)
          .then(() => {
            this.sendToIframe(payload)
            this.showNotification(true)
          })
          .catch((error) => {
            this.showNotification(false)
            log.error(error)
          })
      }
    },
    setRPC() {
      if (this.$refs.networkForm.validate()) {
        const payload = { network: this.rpc, type: RPC }
        this.$store
          .dispatch('setProviderType', payload)
          .then(() => {
            this.toggleNetworkView()
            this.showNotification(true)
            this.sendToIframe(payload)
          })
          .catch((error) => {
            this.showNotification(false)
            log.error(error)
          })
      }
    },
    updateRPC() {
      if (this.$refs.networkForm.validate()) {
        const payload = { network: this.rpc, type: RPC }
        this.$store
          .dispatch('updateCustomNetwork', this.rpc)
          .then(() => {
            this.isEdit = false
            this.toggleNetworkView()
            this.showNotification(true)
            this.sendToIframe(payload)
          })
          .catch((error) => {
            this.showNotification(false)
            log.error(error)
          })
      }
    },
    async sendToIframe(payload) {
      const urlInstance = this.$route.query.instanceId
      if (urlInstance && urlInstance !== '') {
        const providerChangeChannel = new BroadcastChannel(`provider_change_${urlInstance}`, broadcastChannelOptions)
        await providerChangeChannel.postMessage({
          data: {
            name: 'provider_change',
            payload,
          },
        })
        providerChangeChannel.close()
      }
    },
    toggleNetworkView(network) {
      this.addCustomNetwork = !this.addCustomNetwork
      this.rpc = network || { chainId: '', networkName: '', host: '', blockExplorer: '', ticker: '' }
    },
    selectedItemChanged(item) {
      this.changeNetwork(item)
    },
    editNetwork(network) {
      this.isEdit = true
      this.toggleNetworkView(network)
    },
    deleteNetwork(network) {
      if (network) {
        this.$store
          .dispatch('deleteCustomNetwork', network.id)
          .then(() => {
            if (network.id === this.selectedNetwork.id) {
              this.changeNetwork(getDefaultNetwork())
            }
            this.showNotification(true)
          })
          .catch((error) => {
            this.showNotification(false)
            log.error(error)
          })
      }
    },
  },
}
</script>
<style lang="scss" scoped>
@import 'Network.scss';
</style>
