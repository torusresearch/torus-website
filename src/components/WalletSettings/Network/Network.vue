<template>
  <div :class="$vuetify.display.xs ? 'pt-5' : 'py-5 px-4'">
    <v-form ref="networkForm" v-model="formValid" lazy-validation @submit.prevent="">
      <div class="body-2 mb-2">{{ $t('walletSettings.selectNetwork') }}</div>
      <v-row wrap>
        <v-col cols="12">
          <v-select
            id="select-network"
            v-model="selectedNetwork"
            class="select-network-container gmt-network-change"
            variant="outlined"
            :items="networks"
            item-title="networkName"
            item-value="host"
            return-object
            append-icon="$select"
            aria-label="Select Network"
            @change="changeNetwork"
          ></v-select>
        </v-col>
      </v-row>

      <template v-if="isRPCSelected">
        <v-col cols="12">
          <v-text-field
            v-model="rpc.networkName"
            :placeholder="$t('walletSettings.enterNetworkName')"
            :rules="[rules.required]"
            variant="outlined"
          ></v-text-field>
        </v-col>

        <v-col cols="12">
          <v-text-field v-model="rpc.rpcUrl" :placeholder="$t('walletSettings.enterRpc')" :rules="[rules.required]" variant="outlined"></v-text-field>
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

        <v-col cols="12" :class="!$vuetify.display.xs ? 'pl-2' : ''">
          <v-row>
            <v-spacer></v-spacer>
            <v-col cols="4">
              <v-tooltip location="bottom" :disabled="formValid">
                <template #activator="{ on }">
                  <span v-on="on">
                    <v-btn
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

import { RPC, RPC_DISPLAY_NAME } from '../../../utils/enums'
import { broadcastChannelOptions } from '../../../utils/utils'

export default {
  name: 'NetworkSettings',
  data() {
    return {
      selectedNetwork: null,
      rpc: { chainId: '', networkName: '', host: '', blockExplorer: '', ticker: '' },
      formValid: true,
      rules: {
        required: (value) => !!value || 'Required',
        requiredHex: (value) => (!!value && isHexStrict(value)) || 'Please enter chainId in hex format for ex: "0x1"',
      },
    }
  },
  computed: {
    ...mapGetters(['supportedNetworks']),
    ...mapState(['networkType', 'whiteLabel']),
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
    this.rpc = { ...this.networkType, chainId: `0x${Number(this.networkType.chainId).toString(16)}` }
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
  },
}
</script>
