<template>
  <v-container py-6 px-0>
    <template v-if="type === 'none'">
      <popup-screen-loader />
    </template>
    <template v-else>
      <v-layout wrap align-center mx-6 mb-6>
        <v-flex xs12 class="text_1--text font-weight-bold headline float-left">Permission</v-flex>
        <v-flex xs12>
          <network-display></network-display>
        </v-flex>
      </v-layout>
      <v-layout wrap>
        <v-flex xs12 mb-2 mx-6>
          <div class="subtitle-2 text_2--text">Request from:</div>

          <v-card flat class="background lighten-3">
            <v-card-text>
              <div class="subtitle-2 primary--text">{{ origin }}</div>
            </v-card-text>
            <img :src="require('../../../public/img/icons/open-in-new-grey.svg')" class="card-upper-icon" />
          </v-card>
        </v-flex>

        <v-flex xs12 mb-4 mx-6>
          <v-list class="note-list">
            <v-list-item class="pa-0">
              <v-list-item-icon class="mr-1">
                <img :src="require(`../../../public/img/icons/check-circle-primary.svg`)" width="12" />
              </v-list-item-icon>
              <v-list-item-content class="pa-1">
                <div class="caption text_2--text">
                  To change your network to
                  <span class="text-capitalize">{{ type && type === 'rpc' ? `${rpcNetwork.networkName} : ${rpcNetwork.host}` : network.host }}</span>
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-flex>

        <v-layout px-6 mx-3>
          <v-flex xs6>
            <v-btn block text large class="text_2--text" @click="triggerDeny">Cancel</v-btn>
          </v-flex>
          <v-flex xs6>
            <v-btn block depressed large color="primary" class="ml-2" @click="triggerSign">Confirm</v-btn>
          </v-flex>
        </v-layout>
      </v-layout>
    </template>
  </v-container>
</template>

<script>
import { BroadcastChannel } from 'broadcast-channel'
import { PopupScreenLoader } from '../../content-loader'
import NetworkDisplay from '../../components/helpers/NetworkDisplay'
import { broadcastChannelOptions } from '../../utils/utils'
import log from 'loglevel'

export default {
  name: 'confirm',
  components: {
    PopupScreenLoader,
    NetworkDisplay
  },
  data() {
    return {
      origin: '',
      type: 'none',
      network: '',
      rpcNetwork: {},
      payload: {}
    }
  },
  methods: {
    async triggerSign(event) {
      var bc = new BroadcastChannel(
        `torus_provider_change_channel_${new URLSearchParams(window.location.search).get('instanceId')}`,
        broadcastChannelOptions
      )
      await bc.postMessage({
        data: { type: 'confirm-provider-change', payload: this.payload, approve: true }
      })
      bc.close()
      window.close()
    },
    async triggerDeny(event) {
      var bc = new BroadcastChannel(
        `torus_provider_change_channel_${new URLSearchParams(window.location.search).get('instanceId')}`,
        broadcastChannelOptions
      )
      await bc.postMessage({ data: { type: 'deny-provider-change', approve: false } })
      bc.close()
      window.close()
    }
  },
  mounted() {
    var bc = new BroadcastChannel(
      `torus_provider_change_channel_${new URLSearchParams(window.location.search).get('instanceId')}`,
      broadcastChannelOptions
    )
    bc.onmessage = async ev => {
      const {
        payload: { network, type },
        origin
      } = ev.data || {}
      this.payload = { network, type }
      let url = { hostname: '' }
      try {
        url = new URL(origin)
      } catch (err) {
        log.error(err)
      }
      this.origin = url.hostname // origin of tx: website url
      if (type && type === 'rpc') {
        this.rpcNetwork = network
        this.type = type
      } else {
        this.network = network
        this.type = 'non-rpc'
      }
      bc.close()
    }
    bc.postMessage({ data: 'popup-loaded' })
  }
}
</script>

<style lang="scss" scoped>
@import 'ProviderChange.scss';
</style>
