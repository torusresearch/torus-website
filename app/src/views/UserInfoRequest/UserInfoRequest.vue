<template>
  <v-container px-0 py-6>
    <template v-if="type === 'none'">
      <UserInfoScreenLoader />
    </template>
    <template v-else>
      <!-- <permission-confirm @triggerSign="triggerSign" @triggerDeny="triggerDeny" /> -->
      <v-layout align-center mx-6 mb-6>
        <div class="text-black font-weight-bold headline float-left">{{ t('dappInfo.permission') }}</div>
        <img :src="require('../../../public/img/icons/lock.svg')" width="16" class="ml-2" />
      </v-layout>
      <v-layout wrap>
        <v-flex xs12 mb-2 mx-6>
          <div class="subtitle-2 text_2--text">{{ t('dappInfo.requestFrom') }}:</div>

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
            <div class="caption text_2--text">{{ accessText }}</div>
          </div>
          <div v-if="message !== ''" class="d-flex mb-2">
            <div class="mr-5 note-list__icon">
              <img :src="require(`../../../public/img/icons/check-circle-primary.svg`)" width="12" />
            </div>
            <div class="caption text_2--text">{{ message }}</div>
          </div>
        </v-flex>

        <v-layout px-6 mx-3>
          <v-flex xs6>
            <v-btn block text large class="text_2--text" @click="triggerDeny">{{ t('dappInfo.cancel') }}</v-btn>
          </v-flex>
          <v-flex xs6>
            <v-btn block depressed large color="torus_brand1" class="ml-2" @click="triggerSign">{{ t('dappInfo.confirm') }}</v-btn>
          </v-flex>
        </v-layout>
      </v-layout>
    </template>
  </v-container>
</template>

<script>
import { BroadcastChannel } from 'broadcast-channel'

import { UserInfoScreenLoader } from '../../content-loader'
// import PermissionConfirm from '../../components/Confirm/PermissionConfirm'
import { broadcastChannelOptions, capitalizeFirstLetter } from '../../utils/utils'

export default {
  name: 'UserInfoRequest',
  components: {
    UserInfoScreenLoader,
    // PermissionConfirm
  },
  data() {
    return {
      origin: { hostname: '', href: '' },
      type: 'none',
      message: '',
      verifier: '',
      channel: '',
    }
  },
  computed: {
    accessText() {
      return this.t(`dappInfo.toAccess${capitalizeFirstLetter(this.verifier)}`)
    },
  },
  mounted() {
    this.channel = `user_info_request_channel_${new URLSearchParams(window.location.search).get('instanceId')}`
    const bc = new BroadcastChannel(this.channel, broadcastChannelOptions)
    bc.addEventListener('message', async (ev) => {
      const {
        payload: { verifier = '', message = '' },
        origin = '',
      } = ev.data
      this.origin = origin // origin of tx: website url
      this.type = 'userInfo'
      this.verifier = verifier
      this.message = message
      bc.close()
    })
    bc.postMessage({ data: { type: 'popup-loaded' } })
  },
  methods: {
    async triggerSign() {
      const bc = new BroadcastChannel(this.channel, broadcastChannelOptions)
      await bc.postMessage({ data: { type: 'user-info-request-result', approve: true } })
      bc.close()
    },
    async triggerDeny() {
      const bc = new BroadcastChannel(this.channel, broadcastChannelOptions)
      await bc.postMessage({ data: { type: 'user-info-request-result', approve: false } })
      bc.close()
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'UserInfoRequest.scss';
</style>
