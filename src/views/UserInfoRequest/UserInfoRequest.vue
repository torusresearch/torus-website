<template>
  <v-container pa-0>
    <template v-if="type === 'none'">
      <UserInfoScreenLoader />
    </template>
    <template v-else>
      <v-layout py-6 class="elevation-1">
        <v-flex xs12 text-center>
          <img class="home-link mr-1" alt="Torus Logo" width="70" :height="getLogo.isExternal ? 'inherit' : '17'" :src="getLogo.logo" />
          <div class="display-1 text_2--text">{{ t('dappInfo.permission') }}</div>
        </v-flex>
      </v-layout>
      <v-layout wrap align-center mx-8 my-6>
        <v-flex class="text-center" xs12>
          <span class="headline text_2--text">{{ t('dappPermission.allowAccess').replace(/{host}/gi, origin.hostname) }}</span>
        </v-flex>
        <v-flex v-if="message" class="text-center" xs12>
          <span class="headline text_2--text">{{ message }}</span>
        </v-flex>
      </v-layout>
      <v-divider class="mx-6"></v-divider>
      <v-layout wrap align-center mx-6 my-6>
        <v-flex xs12 mb-2>
          <div class="caption mb-2 text_2--text">{{ t('dappProvider.requestFrom') }}:</div>

          <v-card flat class="lighten-3" :class="$vuetify.theme.isDark ? '' : 'grey'">
            <v-card-text>
              <div class="d-flex request-from align-center">
                <a :href="origin.href" target="_blank" rel="noreferrer noopener" class="caption font-weight-medium torusBrand1--text">
                  {{ origin.hostname }}
                </a>
                <v-btn
                  x-small
                  :color="$vuetify.theme.isDark ? 'torusBlack2' : 'white'"
                  class="link-icon ml-auto"
                  :href="origin.href"
                  target="_blank"
                  rel="noreferrer noopener"
                  :aria-label="`Open ${origin.hostname} Link`"
                >
                  <img src="../../assets/img/icons/open-in-new-grey.svg" class="card-upper-icon" alt="Link Icon" />
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs12 mt-8>
          <v-layout mx-n2>
            <v-flex xs6 px-2>
              <v-btn block text large class="text_2--text" @click="triggerDeny">{{ t('dappProvider.cancel') }}</v-btn>
            </v-flex>
            <v-flex xs6 px-2>
              <v-btn block depressed large class="torus-btn1 white--text" color="torusBrand1" @click="triggerSign">
                {{ t('dappProvider.confirm') }}
              </v-btn>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </template>
  </v-container>
</template>

<script>
import { BroadcastChannel } from 'broadcast-channel'
import { mapGetters } from 'vuex'

import { UserInfoScreenLoader } from '../../content-loader'
import { POPUP_LOADED, POPUP_RESULT } from '../../utils/enums'
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
      typeOfLogin: '',
      channel: '',
    }
  },
  computed: {
    ...mapGetters(['getLogo']),
    accessText() {
      return this.t(`dappInfo.toAccess${capitalizeFirstLetter(this.typeOfLogin)}`)
    },
  },
  mounted() {
    this.channel = `user_info_request_channel_${new URLSearchParams(window.location.search).get('instanceId')}`
    const bc = new BroadcastChannel(this.channel, broadcastChannelOptions)
    bc.addEventListener('message', async (ev) => {
      const {
        payload: { typeOfLogin = '', message = '' },
        origin = '',
        whiteLabel,
      } = ev.data
      this.origin = origin // origin of tx: website url
      this.type = 'userInfo'
      this.typeOfLogin = typeOfLogin
      this.message = message
      this.$store.commit('setWhiteLabel', whiteLabel)
      bc.close()
    })
    bc.postMessage({ data: { type: POPUP_LOADED } })
  },
  methods: {
    async triggerSign() {
      const bc = new BroadcastChannel(this.channel, broadcastChannelOptions)
      await bc.postMessage({ data: { type: POPUP_RESULT, approve: true } })
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
@import 'UserInfoRequest.scss';
</style>
