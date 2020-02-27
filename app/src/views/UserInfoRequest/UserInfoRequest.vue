<template>
  <v-container pa-0>
    <template v-if="type === 'none'">
      <user-info-screen-loader />
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
              <div class="subtitle-2 primary--text request-from">
                <a :href="origin.href" target="_blank">{{ origin.hostname }}</a>
                <a :href="origin.href" target="_blank" class="float-right">
                  <img :src="require('../../../public/img/icons/open-in-new-grey.svg')" class="card-upper-icon" />
                </a>
              </div>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs12 mb-4 mx-6>
          <v-list class="note-list">
            <v-list-item class="pa-0">
              <v-list-item-icon class="mr-1">
                <img :src="require(`../../../public/img/icons/check-circle-primary.svg`)" width="12" />
              </v-list-item-icon>
              <v-list-item-content class="pa-1">
                <div class="caption text_2--text">{{ accessText }}</div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="pa-0" v-if="message !== ''">
              <v-list-item-icon class="mr-1">
                <img :src="require(`../../../public/img/icons/check-circle-primary.svg`)" width="12" />
              </v-list-item-icon>
              <v-list-item-content class="pa-1">
                <div class="caption text_2--text">{{ message }}</div>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-flex>

        <v-layout px-6 mx-3>
          <v-flex xs6>
            <v-btn block text large class="text_2--text" @click="triggerDeny">{{ t('dappInfo.cancel') }}</v-btn>
          </v-flex>
          <v-flex xs6>
            <v-btn block depressed large color="primary" class="ml-2" @click="triggerSign">{{ t('dappInfo.confirm') }}</v-btn>
          </v-flex>
        </v-layout>
      </v-layout>
    </template>
  </v-container>
</template>

<script>
import { BroadcastChannel } from 'broadcast-channel'
import log from 'loglevel'

import { UserInfoScreenLoader } from '../../content-loader'
// import PermissionConfirm from '../../components/Confirm/PermissionConfirm'
import { broadcastChannelOptions, capitalizeFirstLetter } from '../../utils/utils'

export default {
  name: 'userInfoRequest',
  components: {
    UserInfoScreenLoader
    // PermissionConfirm
  },
  data() {
    return {
      origin: { hostname: '', href: '' },
      type: 'none',
      message: '',
      verifier: '',
      channel: ''
    }
  },
  computed: {
    accessText() {
      return this.t(`dappInfo.toAccess${capitalizeFirstLetter(this.verifier)}`)
    }
  },
  methods: {
    async triggerSign(event) {
      const bc = new BroadcastChannel(this.channel, broadcastChannelOptions)
      await bc.postMessage({ data: { type: 'user-info-request-result', approve: true } })
      bc.close()
    },
    async triggerDeny(event) {
      const bc = new BroadcastChannel(this.channel, broadcastChannelOptions)
      await bc.postMessage({ data: { type: 'user-info-request-result', approve: false } })
      bc.close()
    }
  },
  mounted() {
    this.channel = `user_info_request_channel_${new URLSearchParams(window.location.search).get('instanceId')}`
    const bc = new BroadcastChannel(this.channel, broadcastChannelOptions)
    bc.onmessage = async ev => {
      const {
        payload: { verifier = '', message = '' },
        origin = ''
      } = ev.data
      this.origin = origin // origin of tx: website url
      this.type = 'userInfo'
      this.verifier = verifier
      this.message = message
      bc.close()
    }
    bc.postMessage({ data: { type: 'popup-loaded' } })
  }
}
</script>

<style lang="scss" scoped>
@import 'UserInfoRequest.scss';
</style>
