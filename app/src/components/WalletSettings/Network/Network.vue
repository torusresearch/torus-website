<template>
  <div :class="$vuetify.breakpoint.xsOnly ? '' : 'py-4 px-12'">
    <v-form ref="networkForm" v-model="formValid" lazy-validation @submit.prevent="">
      <span class="subtitle-2">Select Network</span>
      <v-layout wrap>
        <v-flex xs12 md6>
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
      </v-layout>

      <template v-if="isRPCSelected">
        <v-flex xs12 md6>
          <v-text-field placeholder="Enter Network Name" :rules="[rules.required]" outlined v-model="rpc.networkName"></v-text-field>
        </v-flex>

        <v-flex xs12 md6>
          <v-text-field placeholder="Enter RPC URL" :rules="[rules.required]" outlined v-model="rpc.host"></v-text-field>
        </v-flex>

        <v-flex xs12 md6>
          <v-text-field placeholder="Enter Chain id" outlined v-model="rpc.chainId"></v-text-field>
        </v-flex>

        <v-flex xs12 md6>
          <v-layout wrap>
            <v-flex xs8 v-if="!$vuetify.breakpoint.xsOnly" class="pr-2">
              <notification
                :alert-show="updateProviderRPCAlert"
                :alert-text="updateProviderAlertText"
                :alert-type="updateProviderAlertType"
                @closeAlert="closeAlert"
              />
            </v-flex>
            <v-flex xs12 sm4 :class="!$vuetify.breakpoint.xsOnly ? 'pl-2' : ''">
              <v-tooltip bottom :disabled="formValid">
                <template v-slot:activator="{ on }">
                  <span v-on="on">
                    <v-btn block :disabled="!formValid" depressed color="primary" @click="setRPC">Save</v-btn>
                  </span>
                </template>
                <span>Resolve the errors</span>
              </v-tooltip>
            </v-flex>
            <v-flex xs12 v-if="$vuetify.breakpoint.xsOnly" class="mt-2">
              <notification
                :alert-show="updateProviderRPCAlert"
                :alert-text="updateProviderAlertText"
                :alert-type="updateProviderAlertType"
                @closeAlert="closeAlert"
              />
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
import Notification from '../../helpers/Notification'
import { broadcastChannelOptions } from '../../../utils/utils'

const { RPC, RPC_DISPLAY_NAME, SUPPORTED_NETWORK_TYPES } = require('../../../utils/enums')

export default {
  name: 'networkSettings',
  components: { Notification },
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
      },
      updateProviderRPCAlert: false,
      updateProviderAlertText: '',
      updateProviderAlertType: 'success'
    }
  },
  computed: {
    isRPCSelected() {
      return this.selectedNetwork.host === RPC
    }
  },
  methods: {
    closeAlert() {
      this.updateProviderRPCAlert = false
    },
    showNotification(success) {
      this.updateProviderRPCAlert = this.isRPCSelected
      this.updateProviderAlertType = success ? 'success' : 'error'
      this.updateProviderAlertText = success ? 'Updated Network Provider' : 'Something went wrong'
    },
    changeNetwork(value) {
      if (value && value.host !== RPC) {
        const payload = { network: this.selectedNetwork }
        this.$store
          .dispatch('setProviderType', payload)
          .then(resp => this.sendToIframe(payload))
          .catch(err => log.error(err))
      }
    },
    setRPC() {
      if (this.$refs.networkForm.validate()) {
        // this.selectedNetwork = RPC
        const payload = { network: this.rpc, type: RPC }
        this.$store
          .dispatch('setProviderType')
          .then(resp => {
            this.showNotification(true)
            this.sendToIframe(payload)
          })
          .catch(err => {
            this.showNotification(false)
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
            payload: payload
          }
        })
        providerChangeChannel.close()
      }
    }
  },
  mounted() {
    this.selectedNetwork = this.$store.state.networkType
    this.rpc = { ...this.$store.state.networkType }
  }
}
</script>
