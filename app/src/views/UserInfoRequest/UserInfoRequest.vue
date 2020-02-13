<template>
  <v-container pa-0>
    <template v-if="type === 'none'">
      <user-info-screen-loader />
    </template>
    <template v-else>
      <permission-confirm @triggerSign="triggerSign" @triggerDeny="triggerDeny" />
      <!-- <v-layout align-center mx-6 mb-6>
        <div class="text-black font-weight-bold headline float-left">{{ t('dappInfo.permission') }}</div>
        <img :src="require('../../../public/img/icons/lock.svg')" width="16" class="ml-2" />
      </v-layout>
      <v-layout wrap>
        <v-flex xs12 mb-2 mx-6>
          <div class="subtitle-2 text_2--text">{{ t('dappInfo.requestFrom') }}:</div>

          <v-card flat class="grey lighten-3">
            <v-card-text>
              <div class="subtitle-2 primary--text request-from">
                <a :href="originHref" target="_blank">{{ origin }}</a>
                <a :href="originHref" target="_blank" class="float-right">
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
                <div class="caption text_2--text">{{ t('dappInfo.toAccessGoogle') }}</div>
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
      </v-layout> -->
    </template>
  </v-container>
</template>

<script>
import { BroadcastChannel } from 'broadcast-channel'
import { UserInfoScreenLoader } from '../../content-loader'
import { broadcastChannelOptions } from '../../utils/utils'
import PermissionConfirm from '../../components/Confirm/PermissionConfirm'
import log from 'loglevel'

export default {
  name: 'userInfoRequest',
  components: {
    UserInfoScreenLoader,
    PermissionConfirm
  },
  data() {
    return {
      origin: '',
      originHref: '',
      type: 'none',
      message: ''
    }
  },
  methods: {
    async triggerSign(event) {
      var bc = new BroadcastChannel(
        `user_info_request_channel_${new URLSearchParams(window.location.search).get('instanceId')}`,
        broadcastChannelOptions
      )
      await bc.postMessage({
        data: { type: 'confirm-user-info-request', approve: true }
      })
      bc.close()
    },
    async triggerDeny(event) {
      var bc = new BroadcastChannel(
        `user_info_request_channel_${new URLSearchParams(window.location.search).get('instanceId')}`,
        broadcastChannelOptions
      )
      await bc.postMessage({ data: { type: 'deny-user-info-request', approve: false } })
      bc.close()
    }
  },
  mounted() {
    var bc = new BroadcastChannel(
      `user_info_request_channel_${new URLSearchParams(window.location.search).get('instanceId')}`,
      broadcastChannelOptions
    )
    bc.onmessage = async ev => {
      const { payload, origin } = ev.data || {}
      let url = { hostname: '', href: '' }
      try {
        url = new URL(origin)
      } catch (err) {
        log.error(err)
      }
      this.originHref = url.href
      this.origin = url.hostname // origin of tx: website url
      this.type = 'userInfo'
      this.message = payload && payload.message ? payload.message : ''
      bc.close()
    }
    bc.postMessage({ data: 'popup-loaded' })
  }
}
</script>

<style lang="scss" scoped>
@import 'UserInfoRequest.scss';
</style>
