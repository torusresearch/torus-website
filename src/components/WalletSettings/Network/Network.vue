<template>
  <div :class="$vuetify.breakpoint.xsOnly ? 'pt-5' : 'py-5 px-4'">
    <v-form ref="networkForm" v-model="formValid" lazy-validation @submit.prevent="">
      <template v-if="!addCustomNetwork">
        <div class="body-2 mb-2">{{ t('walletSettings.selectNetwork') }}</div>
        <v-layout wrap class="network-setting">
          <v-flex xs12>
            <!-- <v-select
              id="select-network"
              v-model="selectedNetwork"
              class="select-network-container gmt-network-change"
              outlined
              :items="networks"
              item-text="networkName"
              item-value="host"
              return-object
              append-icon="$vuetify.icons.select"
              aria-label="Select Network"
              @change="changeNetwork"
            ></v-select> -->
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
                  v-for="network in defaultNetworks"
                  :key="supportedNetworks[network].networkName"
                  class="select-coin-eth"
                  @click="selectedItemChanged(supportedNetworks[network])"
                >
                  <!-- <v-list-item-icon class="mr-1">
                    <img
                      :src="`${logosUrl}/${token.logo}`"
                      height="20px"
                      :onerror="`if (!this.src.includes('images/token-${$vuetify.theme.dark ? 'dark' : 'light'}.svg')) this.src = '/images/token-${
                        $vuetify.theme.dark ? 'dark' : 'light'
                      }.svg';`"
                      :alt="supportedNetworks[network].host"
                    />
                  </v-list-item-icon> -->
                  <v-list-item-content>
                    <v-list-item-title class="body-2">{{ supportedNetworks[network].networkName }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <!-- <v-divider class="mx-3"></v-divider> -->
                <v-subheader v-if="customNetworks.length > 0" class="subheading">
                  {{ t('walletSettings.customNetwork') }}
                </v-subheader>
                <v-list-item v-for="network in customNetworks" :key="supportedNetworks[network].networkName">
                  <!-- <v-list-item-icon class="ml-8 mr-1">
                    <img
                      :src="`${logosUrl}/${token.logo}`"
                      height="20px"
                      :onerror="`if (!this.src.includes('images/token-${$vuetify.theme.dark ? 'dark' : 'light'}.svg')) this.src = '/images/token-${
                        $vuetify.theme.dark ? 'dark' : 'light'
                      }.svg';`"
                      :alt="supportedNetworks[network].host"
                    />
                  </v-list-item-icon> -->
                  <v-list-item-content @click="selectedItemChanged(supportedNetworks[network])">
                    <v-list-item-title class="body-2">{{ supportedNetworks[network].networkName }}</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-icon>
                    <v-btn
                      color="text_3"
                      icon
                      small
                      :aria-label="`Edit ${supportedNetworks[network].networkName}`"
                      @click="editNetwork(supportedNetworks[network])"
                    >
                      {{ t('walletSettings.editNetwork') }}
                    </v-btn>
                  </v-list-item-icon>
                  <v-list-item-icon>
                    <v-btn
                      class="delete-btn"
                      color="text_2"
                      icon
                      small
                      :aria-label="`Delete ${supportedNetworks[network].networkName}`"
                      @click="deleteNetwork(supportedNetworks[network])"
                    >
                      <v-icon x-small>$vuetify.icons.trash</v-icon>
                    </v-btn>
                  </v-list-item-icon>
                </v-list-item>
                <!-- <v-divider class="mx-3"></v-divider> -->
                <!-- <v-subheader v-if="collectibles.length > 0" class="body-2">
                  <v-icon small left class="mr-2">$vuetify.icons.collectibles</v-icon>
                  {{ t('walletTransfer.collectibles') }}
                </v-subheader>
                <v-list-item v-for="collectible in collectibles" :key="collectible.address" @click="selectedItemChanged(collectible.address)">
                  <v-list-item-icon class="ml-8 mr-1">
                    <img
                      :src="collectible.logo"
                      height="20px"
                      :alt="collectible.name"
                      onerror="if (!this.src.includes('/images/nft-placeholder.svg')) this.src = '/images/nft-placeholder.svg';"
                    />
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title class="body-2">{{ collectible.name }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item> -->
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
          <div class="caption text_3--text mb-2 plain" @click="toggleNetworkView">Back</div>
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
          <v-text-field v-model="rpc.chainId" :placeholder="t('walletSettings.enterChainId')" outlined></v-text-field>
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
import log from 'loglevel'
import { mapState } from 'vuex'

import { RPC, SUPPORTED_NETWORK_TYPES } from '../../../utils/enums'
import { broadcastChannelOptions } from '../../../utils/utils'

export default {
  name: 'NetworkSettings',
  data() {
    return {
      selectedNetwork: {},
      rpc: { chainId: '', networkName: '', host: '', blockExplorer: '', ticker: '' },
      formValid: true,
      rules: {
        required: (value) => !!value || 'Required',
      },
      addCustomNetwork: false,
      isEdit: false,
      defaultNetworks: Object.keys(SUPPORTED_NETWORK_TYPES),
    }
  },
  computed: {
    ...mapState(['networkType', 'supportedNetworks']),
    networks() {
      return [...Object.values(this.supportedNetworks)]
    },
    isRPCSelected() {
      return this.selectedNetwork.host === RPC
    },
    customNetworks() {
      return Object.keys(this.supportedNetworks).filter((n) => !Object.keys(SUPPORTED_NETWORK_TYPES).includes(n))
    },
  },
  mounted() {
    this.selectedNetwork = this.networkType
  },
  methods: {
    showNotification(success) {
      this.$store.dispatch(
        success ? 'setSuccessMessage' : 'setErrorMessage',
        success ? 'walletSettings.updatedProvider' : 'walletSettings.somethingWrong'
      )
    },
    changeNetwork(value) {
      if (value && value.host !== RPC) {
        const payload = { network: this.selectedNetwork }
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
            this.selectedNetwork = this.networks.find((x) => x.host === this.rpc.host)
            this.updateData()
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
      // this.isEdit = false
      // log.info(this.$refs.networkForm.validate())
      if (this.$refs.networkForm.validate()) {
        const payload = { network: this.rpc, type: RPC }
        this.$store
          .dispatch('updateCustomNetwork', this.rpc)
          .then(() => {
            this.selectedNetwork = this.networks.find((x) => x.host === this.rpc.host)
            this.updateData()
            this.isEdit = false
            this.showNotification(true)
            this.sendToIframe(payload)
          })
          .catch((error) => {
            this.showNotification(false)
            log.error(error)
          })
      }
      // log.info(SUPPORTED_NETWORK_TYPES)
      // if (this.$refs.networkForm.validate()) {
      //   const payload = { network: this.rpc, type: RPC }
      //   this.$store
      //     .dispatch('setProviderType', payload)
      //     .then(() => {
      //       this.selectedNetwork = this.networks.find((x) => x.host === this.rpc.host)
      //       this.updateData()
      //       this.showNotification(true)
      //       this.sendToIframe(payload)
      //     })
      //     .catch((error) => {
      //       this.showNotification(false)
      //       log.error(error)
      //     })
      // }
    },
    async sendToIframe(payload) {
      const urlInstance = new URLSearchParams(window.location.search).get('instanceId')
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
    toggleNetworkView() {
      this.addCustomNetwork = !this.addCustomNetwork
      this.rpc = { chainId: '', networkName: '', host: '', blockExplorer: '', ticker: '' }
      // log.info(this.supportedNetworks)
      // log.info(this.customNetworks)
    },
    selectedItemChanged(item) {
      this.selectedNetwork = item
      this.changeNetwork(item)
    },
    updateData() {
      this.toggleNetworkView()
    },
    editNetwork(network) {
      this.isEdit = true
      this.toggleNetworkView()
      this.rpc = network
      // log.info(network)
    },
    deleteNetwork(network) {
      // debugger
      if (network) {
        this.$store
          .dispatch('deleteCustomNetwork', network.id)
          .then(() => {
            this.showNotification(true)
            log.info(this.supportedNetworks)
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
