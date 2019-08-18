<template>
  <v-container py-6 px-0>
    <template v-if="type === 'none'">
      <page-loader />
    </template>
    <template v-else>
      <v-layout align-center mx-6 mb-6>
        <div class="text-black font-weight-bold headline float-left">Permission</div>
        <img :src="require('../../../public/img/icons/lock.svg')" width="16" class="ml-2" />
      </v-layout>
      <v-layout wrap>
        <v-flex xs12 mb-2 mx-6>
          <div class="subtitle-2 grey--text">Request from:</div>

          <v-card flat class="grey lighten-3">
            <v-card-text>
              <div class="subtitle-2 blue--text">{{ origin }}</div>
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
                <div class="caption torus_text--text text--lighten-3">To access your Google Email, Photo and Name</div>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-flex>

        <v-layout px-6 mx-3>
          <v-flex xs6>
            <v-btn block text large class="grey--text" @click="triggerDeny">Cancel</v-btn>
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
import BroadcastChannel from 'broadcast-channel'
import PageLoader from '../../components/helpers/PageLoader'
import { broadcastChannelOptions } from '../../utils/utils'

export default {
  name: 'userInfoRequest',
  components: {
    PageLoader
  },
  data() {
    return {
      origin: '',
      type: 'none'
    }
  },
  methods: {
    triggerSign(event) {
      var bc = new BroadcastChannel(
        `user_info_request_channel_${new URLSearchParams(window.location.search).get('instanceId')}`,
        broadcastChannelOptions
      )
      bc.postMessage({
        data: { type: 'confirm-user-info-request', approve: true }
      })
      bc.close()
      window.close()
    },
    triggerDeny(event) {
      var bc = new BroadcastChannel(
        `user_info_request_channel_${new URLSearchParams(window.location.search).get('instanceId')}`,
        broadcastChannelOptions
      )
      bc.postMessage({ data: { type: 'deny-user-info-request', approve: false } })
      bc.close()
      window.close()
    }
  },
  mounted() {
    var bc = new BroadcastChannel(
      `user_info_request_channel_${new URLSearchParams(window.location.search).get('instanceId')}`,
      broadcastChannelOptions
    )
    bc.onmessage = async ev => {
      const { payload, origin } = ev.data || {}
      let url = { hostname: '' }
      try {
        url = new URL(origin)
      } catch (err) {
        console.log(err)
      }
      this.origin = url.hostname // origin of tx: website url
      this.type = 'userInfo'
      bc.close()
    }
    bc.postMessage({ data: 'popup-loaded' })
  }
}
</script>

<style lang="scss" scoped>
@import 'UserInfoRequest.scss';
</style>
