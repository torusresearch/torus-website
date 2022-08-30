<template>
  <v-container class="px-0 py-0">
    <template v-if="type === 'none'">
      <ChangeProviderScreenLoader />
    </template>
    <template v-else>
      <v-row pa-6 class="provider-change-header" :class="{ 'v-theme--dark': isDarkMode }">
        <v-col class="text-left" cols="12">
          <img class="home-link mr-1" alt="Torus Logo" :height="getLogo.isExternal ? 50 : 20" :src="getLogo.logo" />
          <div class="headline text-text_2">{{ $t('dappInfo.permission') }}</div>
        </v-col>
      </v-row>
      <v-row wrap class="align-center mx-6 mb-3 mt-5">
        <v-col class="text-center">
          <span class="headline text-text_2">
            {{ headline }}
          </span>
          <!-- <br />
          <v-btn small text class="caption torusBrand1--text" @click="editPermissions">
            Edit permissions
          </v-btn> -->
        </v-col>
      </v-row>
      <v-divider class="mx-6"></v-divider>
      <v-row wrap class="align-center ma-6">
        <v-col cols="12" class="mb-2">
          <div class="caption mb-2 text-text_2">{{ $t('dappProvider.requestFrom') }}:</div>

          <v-card flat class="lighten-3" :class="isDarkMode ? '' : 'grey'">
            <v-card-text>
              <div class="d-flex request-from align-center">
                <a :href="origin.href" target="_blank" rel="noreferrer noopener" class="caption font-weight-medium torusBrand1--text">
                  {{ origin.hostname }}
                </a>
                <v-btn
                  size="x-small"
                  :color="isDarkMode ? 'torusBlack2' : 'white'"
                  class="link-icon ml-auto"
                  :href="origin.href"
                  target="_blank"
                  rel="noreferrer noopener"
                  :aria-label="`Open ${origin.hostname} Link`"
                >
                  <img src="../../assets/img/icons/open-in-new-grey.svg" class="card-upper-icon" alt="Open Link Icon" />
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" class="mt-4">
          <div class="caption mb-2 text-text_2">{{ $t('dappPermission.currentNetwork') }}</div>

          <v-card flat class="lighten-3" :class="isDarkMode ? '' : 'grey'">
            <v-card-text>
              <div class="caption text-text_2 request-from">
                <span>{{ currentNetwork.networkName || currentNetwork.host }}</span>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" class="mt-8">
          <v-row class="mx-n2">
            <v-col cols="6" class="px-2">
              <v-btn block variant="text" size="large" class="text-text_2" @click="triggerDeny">{{ $t('dappProvider.cancel') }}</v-btn>
            </v-col>
            <v-col cols="6" class="px-2">
              <v-btn block depressed size="large" class="torus-btn1 text-white" color="torusBrand1" @click="triggerSign">
                {{ $t('dappProvider.confirm') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script>
import { BroadcastChannel } from '@toruslabs/broadcast-channel'
import { mapGetters } from 'vuex'

import { ChangeProviderScreenLoader } from '../../content-loader'
import { POPUP_LOADED, POPUP_RESULT, RPC, SUPPORTED_NETWORK_TYPES } from '../../utils/enums'
import { broadcastChannelOptions } from '../../utils/utils'

export default {
  name: 'Confirm',
  components: {
    ChangeProviderScreenLoader,
  },
  data() {
    return {
      origin: { href: '', hostname: '' },
      type: 'none',
      network: {},
      currentNetwork: {},
      channel: '',
    }
  },
  computed: {
    ...mapGetters(['getLogo']),
    headline() {
      return this.$t('dappPermission.allowNetworkChange', {
        host: this.origin.hostname,
        network:
          (SUPPORTED_NETWORK_TYPES[this.network.host] && SUPPORTED_NETWORK_TYPES[this.network.host].networkName) ||
          this.network.networkName ||
          this.network.host,
      })
    },
    isDarkMode() {
      return this.$vuetify.theme.name === 'dark'
    },
  },
  created() {
    this.channel = `torus_provider_change_channel_${this.$route.query.instanceId}`
    const bc = new BroadcastChannel(this.channel, broadcastChannelOptions)
    bc.addEventListener('message', async (ev) => {
      const {
        payload: { network, type },
        origin,
        currentNetwork,
        whiteLabel,
      } = ev.data || {}
      this.origin = origin // origin of tx: website url
      this.network = network
      this.type = type || SUPPORTED_NETWORK_TYPES[network.host] ? '' : RPC
      this.currentNetwork = currentNetwork

      this.$store.commit('setWhiteLabel', whiteLabel)

      bc.close()
    })
    bc.postMessage({ data: { type: POPUP_LOADED } })
  },
  methods: {
    async triggerSign() {
      const bc = new BroadcastChannel(this.channel, broadcastChannelOptions)
      await bc.postMessage({
        data: { type: POPUP_RESULT, approve: true },
      })
      bc.close()
    },
    async triggerDeny() {
      const bc = new BroadcastChannel(this.channel, broadcastChannelOptions)
      await bc.postMessage({ data: { type: POPUP_RESULT, approve: false } })
      bc.close()
    },
    editPermissions() {
      this.$router.push({ path: '/wallet/settings' }).catch((_) => {})
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'ProviderChange.scss';
</style>
