<template>
  <div :class="$vuetify.display.xsOnly ? 'pt-5' : 'py-5'">
    <v-form ref="networkForm" v-model="formValid" lazy-validation @submit.prevent="">
      <template v-if="!addCustomNetwork">
        <div class="body-2 mb-2">{{ $t('walletSettings.selectNetwork') }}</div>
        <v-row wrap class="network-setting">
          <v-col cols="12">
            <v-menu location="bottom">
              <template #activator="{ props }">
                <v-btn class="select-coin" label :variant="isDarkMode ? 'outlined' : 'elevated'" v-bind="props">
                  <span class="select-coin-name">{{ selectedNetwork.networkName }}</span>
                  <div class="flex-grow-1 text-right pr-2">
                    <v-icon end>$select</v-icon>
                  </div>
                </v-btn>
              </template>
              <v-list class="select-item-list overflow-y-auto" :style="{ maxHeight: '240px' }">
                <v-list-item
                  v-for="host in defaultNetworks"
                  :key="supportedNetworks[host].networkName"
                  class="select-coin-eth"
                  @click="selectedItemChanged(supportedNetworks[host])"
                >
                  <v-list-item-title class="body-2">{{ supportedNetworks[host].networkName }}</v-list-item-title>
                </v-list-item>
                <v-list-subheader v-if="customNetworks.length > 0" class="subheading">
                  {{ $t('walletSettings.customNetwork') }}
                </v-list-subheader>
                <v-list-item
                  v-for="host in customNetworks"
                  :key="supportedNetworks[host].networkName"
                  @click="selectedItemChanged(supportedNetworks[host])"
                >
                  <v-list-item-title class="body-2">{{ supportedNetworks[host].networkName }}</v-list-item-title>
                  <v-btn
                    v-if="supportedNetworks[host].id"
                    color="text_3"
                    icon
                    size="small"
                    :aria-label="`Edit ${supportedNetworks[host].networkName}`"
                    @click.stop="editNetwork(supportedNetworks[host])"
                  >
                    {{ $t('walletSettings.editNetwork') }}
                  </v-btn>
                  <v-btn
                    v-if="supportedNetworks[host].id"
                    class="delete-btn"
                    color="text_2"
                    icon
                    size="small"
                    :aria-label="`Delete ${supportedNetworks[host].networkName}`"
                    @click.stop="deleteNetwork(supportedNetworks[host])"
                  >
                    <v-icon size="x-small">$trash</v-icon>
                  </v-btn>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
        <v-col class="ml-auto text-right">
          <v-spacer></v-spacer>
          <v-btn
            id="add-custom-network"
            large
            class="torus-btn1"
            :class="whiteLabel.isActive ? 'text-white' : 'text-torusBrand1'"
            :color="whiteLabel.isActive ? 'torusBrand1' : ''"
            type="button"
            @click="toggleNetworkView"
          >
            {{ $t('walletSettings.addCustomNetwork') }}
          </v-btn>
        </v-col>
      </template>
      <template v-else>
        <v-col cols="12">
          <v-btn variant="text" class="caption text-text_3 mb-2 plain" size="x-small" @click="toggleNetworkView">
            {{ $t('walletSettings.back') }}
          </v-btn>
          <v-text-field
            v-model="rpc.networkName"
            :placeholder="$t('walletSettings.enterNetworkName')"
            :rules="[rules.required]"
            variant="outlined"
          ></v-text-field>
        </v-col>

        <v-col cols="12">
          <v-text-field v-model="rpc.host" :placeholder="$t('walletSettings.enterRpc')" :rules="[rules.required]" variant="outlined"></v-text-field>
        </v-col>

        <v-col cols="12">
          <v-text-field
            v-model="rpc.chainId"
            :rules="[rules.required, rules.requiredHex]"
            :placeholder="$t('walletSettings.enterChainId')"
            variant="outlined"
          ></v-text-field>
        </v-col>

        <v-col cols="12">
          <v-text-field v-model="rpc.ticker" :placeholder="$t('walletSettings.enterSymbol')" variant="outlined"></v-text-field>
        </v-col>

        <v-col cols="12">
          <v-text-field v-model="rpc.blockExplorer" :placeholder="$t('walletSettings.enterBlockExplorer')" variant="outlined"></v-text-field>
        </v-col>

        <v-col cols="12" :class="!$vuetify.display.xsOnly ? 'pl-2' : ''">
          <v-row>
            <v-spacer></v-spacer>
            <v-col cols="4">
              <v-tooltip location="bottom" :disabled="formValid">
                <template #activator="{ props }">
                  <span v-bind="props">
                    <v-btn
                      v-if="isEdit"
                      size="large"
                      class="torus-btn1 py-1"
                      :class="whiteLabel.isActive ? 'text-white' : 'text-torusBrand1'"
                      :color="whiteLabel.isActive ? 'torusBrand1' : ''"
                      block
                      :disabled="!formValid"
                      depressed
                      @click="updateRPC"
                    >
                      {{ $t('walletSettings.save') }}
                    </v-btn>
                    <v-btn
                      v-else
                      size="large"
                      class="torus-btn1 py-1"
                      :class="whiteLabel.isActive ? 'text-white' : 'text-torusBrand1'"
                      :color="whiteLabel.isActive ? 'torusBrand1' : ''"
                      block
                      :disabled="!formValid"
                      depressed
                      @click="setRPC"
                    >
                      {{ $t('walletSettings.save') }}
                    </v-btn>
                  </span>
                </template>
                <span>{{ $t('walletSettings.resolveErrors') }}</span>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-col>
      </template>
    </v-form>
  </div>
</template>

<script>
import { BroadcastChannel } from '@toruslabs/broadcast-channel'
import log from 'loglevel'
import { mapGetters, mapState } from 'vuex'
import { isHexStrict } from 'web3-utils'

import { MAINNET, RPC, SUPPORTED_NETWORK_TYPES } from '../../../utils/enums'
import { broadcastChannelOptions } from '../../../utils/utils'

export default {
  name: 'NetworkSettings',
  data() {
    return {
      rpc: { chainId: '', networkName: '', host: '', blockExplorer: '', ticker: '' },
      formValid: true,
      rules: {
        required: (value) => !!value || 'Required',
        requiredHex: (value) => (!!value && isHexStrict(value)) || 'Please enter chainId in hex format for ex: "0x1"',
      },
      addCustomNetwork: false,
      isEdit: false,
      defaultNetworks: Object.keys(SUPPORTED_NETWORK_TYPES),
    }
  },
  computed: {
    ...mapGetters(['supportedNetworks']),
    ...mapState(['networkType', 'whiteLabel']),
    networks() {
      return [...Object.values(this.supportedNetworks)]
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
    isDarkMode() {
      return this.$vuetify.theme.name === 'dark'
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
              this.changeNetwork(SUPPORTED_NETWORK_TYPES[MAINNET])
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
