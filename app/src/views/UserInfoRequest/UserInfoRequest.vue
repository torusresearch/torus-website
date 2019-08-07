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
                <div class="caption torus_text--text text--lighten-3">To access your Email, Photo and Name</div>
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
    <!-- <template>
      <v-card flat :color="$vuetify.theme.torus_bcg" class="fill-height" style="width: 100%;">
        <v-card-text>
          <v-layout wrap align-start justify-center>
            <v-flex xs12 mt-4 sm7>
              <div class="headline mb-12">Confirm User Info Access</div>
              <p class="mb-4 subheading">
                From:
                <span class="text-bluish">{{ origin }}</span>
              </p>
              <div>
                <p>{{ origin }} wants to access your Google email, profile information</p>
              </div>
            </v-flex>
            <v-flex xs12 sm5 class="bcg">
              <img src="images/signature.png" />
            </v-flex>
          </v-layout>
          <div class="hide-xs mt-12">
            <v-layout wrap align-center justify-center>
              <v-flex xs12 sm4 class="text-center">
                <v-btn block text large class="grey--text" @click="triggerDeny">Reject</v-btn>
              </v-flex>
              <v-flex xs12 sm4 class="text-center">
                <v-btn block depressed large color="primary" class="ml-2" @click="triggerSign">Approve</v-btn>
              </v-flex>
              <v-flex sm4 class="text-center" pt-1>
                <img src="images/torus_logo.png" class="bcg-logo" />
              </v-flex>
            </v-layout>
          </div>
        </v-card-text>
      </v-card>
      <v-card class="higherZ hidden-sm-and-up" flat :color="$vuetify.theme.torus_bcg">
        <v-card-text>
          <v-layout wrap align-center>
            <v-flex xs6 sm4>
              <v-btn block text large class="grey--text" @click="triggerDeny">Reject</v-btn>
            </v-flex>
            <v-flex xs6 sm4>
              <v-btn block depressed large color="primary" class="ml-2" @click="triggerSign">Approve</v-btn>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </template> -->
  </v-container>
</template>

<script>
import BroadcastChannel from 'broadcast-channel'
import PageLoader from '../../components/helpers/PageLoader'

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
      var bc = new BroadcastChannel(`user_info_request_channel_${new URLSearchParams(window.location.search).get('instanceId')}`)
      bc.postMessage({
        data: { type: 'confirm-user-info-request', approve: true }
      })
      bc.close()
      window.close()
    },
    triggerDeny(event) {
      var bc = new BroadcastChannel(`user_info_request_channel_${new URLSearchParams(window.location.search).get('instanceId')}`)
      bc.postMessage({ data: { type: 'deny-user-info-request', approve: false } })
      bc.close()
      window.close()
    }
  },
  mounted() {
    var bc = new BroadcastChannel(`user_info_request_channel_${new URLSearchParams(window.location.search).get('instanceId')}`)
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
