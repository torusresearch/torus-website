<template>
  <div>
    <template v-if="type === 'none'">
      <ChangeProviderScreenLoader />
    </template>
    <template v-else>
      <div class="provider-change-header text-left pa-6" :class="{ 'v-theme--dark': isDarkMode }">
        <img class="home-link mr-1" alt="Torus Logo" :height="getLogo.isExternal ? 50 : 20" :src="getLogo.logo" />
        <div class="headline text-text_2">{{ $t('dappInfo.permission') }}</div>
      </div>
      <div class="text-center mx-6 mb-3 mt-5">
        <span class="headline text-text_2">
          {{ headline }}
        </span>
        <!-- <br />
          <v-btn small text class="caption text-torusBrand1" @click="editPermissions">
            Edit permissions
          </v-btn> -->
      </div>
      <v-divider class="mx-6"></v-divider>
      <div wrap class="align-center ma-6">
        <div class="mb-2">
          <div class="caption mb-2 text-text_2">{{ $t('dappProvider.requestFrom') }}:</div>

          <div class="d-flex request-from pa-3 align-center">
            <a
              :href="origin.href"
              target="_blank"
              rel="noreferrer noopener"
              class="text-caption text-decoration-none font-weight-medium text-torusBrand1"
            >
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
              <img :src="require('../../assets/img/icons/open-in-new-grey.svg')" class="card-upper-icon" alt="Open Link Icon" />
            </v-btn>
          </div>
        </div>
        <div class="mt-4">
          <div class="caption mb-2 text-text_2">{{ $t('dappPermission.currentNetwork') }}</div>

          <div class="caption text-text_2 request-from pa-3">
            <span>{{ currentNetwork.networkName || currentNetwork.host }}</span>
          </div>
        </div>
        <div class="mt-8">
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
        </div>
      </div>
    </template>
  </div>
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
