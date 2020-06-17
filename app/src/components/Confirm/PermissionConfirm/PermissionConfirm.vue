<template>
  <v-container px-0 py-6 class="permission-container">
    <v-layout wrap>
      <v-flex class="card-shadow text-center" py-6 mb-4 xs12>
        <img src="../../../assets/images/security.svg" alt="Security Icon" />
        <div :class="$vuetify.theme.dark ? 'text_3--text' : 'text_2--text'" class="headline font-weight-bold">
          {{ t('dappPermission.permission') }}
        </div>
      </v-flex>
      <v-flex mb-4 mx-6 xs12>
        <div :class="$vuetify.theme.dark ? 'text_3--text' : 'text_2--text'" class="caption mb-2">{{ t('dappPermission.toAllow') }}:</div>

        <v-card class="card-shadow px-3 py-4 mb-8">
          <div :class="$vuetify.theme.dark ? 'text_3--text' : 'text_2--text'" class="caption permission-note">
            {{ permissionDescription(permissionType, permissionDomain) }}
          </div>
        </v-card>

        <v-layout px-2>
          <v-flex xs6>
            <v-btn block text large :class="$vuetify.theme.dark ? 'text_3--text' : 'text_2--text'" @click="triggerCancel">
              {{ t('dappPermission.cancel') }}
            </v-btn>
          </v-flex>
          <v-flex xs6>
            <v-btn block depressed large color="torusBrand1" class="ml-2 white--text" @click="triggerAllow">{{ t('dappPermission.allow') }}</v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { BroadcastChannel } from 'broadcast-channel'
import log from 'loglevel'
import { mapState } from 'vuex'

import config from '../../../config'
import { permissionsDesc } from '../../../utils/permissionUtils'
import { broadcastChannelOptions } from '../../../utils/utils'

export default {
  name: 'PermissionConfirm',
  data() {
    return {
      logosUrl: config.logosUrl,
      permissionMessage: '',
      permissionType: '',
      permissionDomain: '',
    }
  },
  computed: {
    ...mapState({
      networkType: 'networkType',
      whiteLabel: 'whiteLabel',
      supportedNetworks: 'supportedNetworks',
      selectedNetwork(state) {
        let finalNetwork = ''

        if (this.network) {
          return this.supportedNetworks[this.network].networkName
        }

        finalNetwork = !state.networkType.networkName ? state.networkType.host : state.networkType.networkName
        return finalNetwork
      },
    }),
  },
  mounted() {
    this.channel = `torus_permission_channel_${new URLSearchParams(window.location.search).get('instanceId')}`
    const bc = new BroadcastChannel(this.channel, broadcastChannelOptions)
    bc.addEventListener('message', async (ev) => {
      const {
        payload: { permissionType = '', permissionMessage = '', permissionDomain = '' },
        origin = '',
        whiteLabel,
      } = ev.data
      log.info('PERMISSION data', ev)
      this.origin = origin // origin of tx: website url
      this.type = 'torus-request-permission'
      this.permissionMessage = permissionMessage
      this.permissionType = permissionType
      this.permissionDomain = permissionDomain
      this.$store.commit('setWhiteLabel', whiteLabel)
      bc.close()
    })
    bc.postMessage({ data: { type: 'popup-loaded' } })
  },
  methods: {
    permissionDescription(permissionType, domain) {
      return permissionsDesc[permissionType](domain)
    },
    async triggerAllow() {
      const bc = new BroadcastChannel(this.channel, broadcastChannelOptions)
      await bc.postMessage({ data: { type: this.type, approve: true } })
      bc.close()
    },
    async triggerCancel() {
      const bc = new BroadcastChannel(this.channel, broadcastChannelOptions)
      await bc.postMessage({ data: { type: this.type, approve: false } })
      bc.close()
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'PermissionConfirm.scss';
</style>
