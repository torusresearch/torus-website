<template>
  <div :class="$vuetify.breakpoint.xsOnly ? '' : 'py-4 px-12'">
    <v-form ref="networkForm" v-model="formValid" lazy-validation @submit.prevent="">
      <span class="subtitle-2">{{ t('walletSettings.selectNetwork') }}</span>
      <v-layout wrap>
        <v-flex xs12 md6>
          <v-select
            id="select-network"
            v-model="selectedNetwork"
            class="select-network-container"
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
        <v-flex xs12 md6>
          <v-text-field
            v-model="rpc.networkName"
            :placeholder="t('walletSettings.enterNetworkName')"
            :rules="[rules.required]"
            outlined
          ></v-text-field>
        </v-flex>

        <v-flex xs12 md6>
          <v-text-field v-model="rpc.host" :placeholder="t('walletSettings.enterRpc')" :rules="[rules.required]" outlined></v-text-field>
        </v-flex>

        <v-flex xs12 md6>
          <v-text-field v-model="rpc.chainId" :placeholder="t('walletSettings.enterChainId')" outlined></v-text-field>
        </v-flex>

        <v-flex xs12 sm4 :class="!$vuetify.breakpoint.xsOnly ? 'pl-2' : ''">
          <v-tooltip bottom :disabled="formValid">
            <template v-slot:activator="{ on }">
              <span v-on="on">
                <v-btn block :disabled="!formValid" depressed color="primary" @click="setRPC">
                  {{ t('walletSettings.save') }}
                </v-btn>
              </span>
            </template>
            <span>{{ t('walletSettings.resolveErrors') }}</span>
          </v-tooltip>
        </v-flex>
      </template>
    </v-form>
  </div>
</template>

<script>
import { BroadcastChannel } from 'broadcast-channel'
import log from 'loglevel'

import { broadcastChannelOptions } from '../../../utils/utils'

const { RPC, RPC_DISPLAY_NAME, SUPPORTED_NETWORK_TYPES } = require('../../../utils/enums')

export default {
  name: 'NetworkSettings',
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
  mounted() {
    this.selectedNetwork = this.$store.state.networkType
    this.rpc = { ...this.$store.state.networkType }
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
          .catch(error => {
            this.showNotification(false)
            log.error(error)
          })
      }
    },
    setRPC() {
      if (this.$refs.networkForm.validate()) {
        // this.selectedNetwork = RPC
        const payload = { network: this.rpc, type: RPC }
        this.$store
          .dispatch('setProviderType', payload)
          .then(() => {
            this.showNotification(true)
            this.sendToIframe(payload)
          })
          .catch(error => {
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
            payload
          }
        })
        providerChangeChannel.close()
      }
    }
  }
}
</script>
