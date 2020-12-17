<template>
  <div :class="$vuetify.breakpoint.xsOnly ? 'pt-5' : 'py-5 px-4'">
    <v-form ref="networkForm" v-model="formValid" lazy-validation @submit.prevent="">
      <div class="body-2 mb-2">{{ t('walletSettings.selectNetwork') }}</div>
      <v-layout wrap>
        <v-flex xs12>
          <v-select
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
          ></v-select>
        </v-flex>
      </v-layout>

      <template v-if="isRPCSelected">
        <v-flex xs12>
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
import { BroadcastChannel } from 'broadcast-channel'
import log from 'loglevel'
import { mapState } from 'vuex'

import { RPC, RPC_DISPLAY_NAME } from '../../../utils/enums'
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
    }
  },
  computed: {
    ...mapState(['networkType', 'supportedNetworks']),
    networks() {
      return [
        ...Object.values(this.supportedNetworks),
        {
          networkName: RPC_DISPLAY_NAME,
          host: RPC,
          chainId: '',
          blockExplorer: '',
          ticker: '',
        },
      ]
    },
    isRPCSelected() {
      return this.selectedNetwork.host === RPC
    },
  },
  mounted() {
    this.selectedNetwork = this.networkType
    this.rpc = { ...this.networkType }
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
  },
}
</script>
