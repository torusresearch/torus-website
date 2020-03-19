<template>
  <v-container px-0 py-6>
    <template v-if="type === 'none'">
      <ChangeProviderScreenLoader />
    </template>
    <template v-else>
      <!-- <permission-confirm @triggerSign="triggerSign" @triggerDeny="triggerDeny" /> -->
      <v-layout wrap align-center mx-6 mb-6>
        <v-flex xs12 class="font-weight-bold headline float-left">{{ t('dappInfo.permission') }}</v-flex>
        <v-flex xs12>
          <NetworkDisplay :store-network-type="currentNetwork"></NetworkDisplay>
        </v-flex>
      </v-layout>
      <v-layout wrap>
        <v-flex xs12 mb-2 mx-6>
          <div class="subtitle-2 text_2--text">{{ t('dappProvider.requestFrom') }}:</div>

          <v-card flat class="grey lighten-3">
            <v-card-text>
              <div class="subtitle-2 torus_brand1--text request-from">
                <a :href="origin.href" target="_blank">{{ origin.hostname }}</a>
                <a :href="origin.href" target="_blank" class="float-right">
                  <img :src="require('../../../public/img/icons/open-in-new-grey.svg')" class="card-upper-icon" />
                </a>
              </div>
            </v-card-text>
          </v-card>
        </v-flex>

        <v-flex xs12 my-4 mx-6 class="note-list">
          <div class="d-flex mb-2">
            <div class="mr-5 note-list__icon">
              <img :src="require(`../../../public/img/icons/check-circle-primary.svg`)" width="12" />
            </div>
            <div class="caption text_2--text">
              {{ t('dappProvider.toChangeNetwork') }}
              <span class="text-capitalize">{{ type === 'rpc' ? `${network.networkName} : ${network.host}` : network.host }}</span>
            </div>
          </div>
        </v-flex>

        <v-layout px-6 mx-3>
          <v-flex xs6>
            <v-btn block text large class="text_2--text" @click="triggerDeny">{{ t('dappProvider.cancel') }}</v-btn>
          </v-flex>
          <v-flex xs6>
            <v-btn block depressed large color="torus_brand1" class="ml-2" @click="triggerSign">{{ t('dappProvider.confirm') }}</v-btn>
          </v-flex>
        </v-layout>
      </v-layout>
    </template>
  </v-container>
</template>

<script>
import { BroadcastChannel } from 'broadcast-channel'

import NetworkDisplay from '../../components/helpers/NetworkDisplay'
import { ChangeProviderScreenLoader } from '../../content-loader'
import { broadcastChannelOptions } from '../../utils/utils'
// import PermissionConfirm from '../../components/Confirm/PermissionConfirm'

export default {
  name: 'Confirm',
  components: {
    ChangeProviderScreenLoader,
    NetworkDisplay
    // PermissionConfirm
  },
  data() {
    return {
      origin: { href: '', hostname: '' },
      type: 'none',
      network: {},
      currentNetwork: {},
      channel: ''
    }
  },
  mounted() {
    this.channel = `torus_provider_change_channel_${new URLSearchParams(window.location.search).get('instanceId')}`
    const bc = new BroadcastChannel(this.channel, broadcastChannelOptions)
    bc.addEventListener('message', async ev => {
      const {
        payload: { network, type },
        origin,
        currentNetwork
      } = ev.data || {}
      this.origin = origin // origin of tx: website url
      this.network = network
      this.type = type
      this.currentNetwork = currentNetwork

      bc.close()
    })
    bc.postMessage({ data: { type: 'popup-loaded' } })
  },
  methods: {
    async triggerSign() {
      const bc = new BroadcastChannel(this.channel, broadcastChannelOptions)
      await bc.postMessage({
        data: { type: 'provider-change-result', approve: true }
      })
      bc.close()
    },
    async triggerDeny() {
      const bc = new BroadcastChannel(this.channel, broadcastChannelOptions)
      await bc.postMessage({ data: { type: 'provider-change-result', approve: false } })
      bc.close()
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'ProviderChange.scss';
</style>
