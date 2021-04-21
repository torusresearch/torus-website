<template>
  <v-container fill-height text-center>
    <v-layout class="redirect-container" :class="$vuetify.breakpoint.xsOnly ? 'redirect-container--mobile' : ''" row wrap align-center>
      <v-flex text-center>
        <!-- <BeatLoader
          margin="24px 4px 0"
          size="12px"
          :color="$vuetify.theme.dark ? $vuetify.theme.themes.dark.torusBrand1 : $vuetify.theme.themes.light.torusBrand1"
        /> -->
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { BroadcastChannel } from 'broadcast-channel'
import { BN } from 'ethereumjs-util'
import log from 'loglevel'

// import BeatLoader from 'vue-spinner/src/BeatLoader'
import torus from '../../torus'
import { ACCOUNT_TYPE, POPUP_RESULT } from '../../utils/enums'
import { broadcastChannelOptions } from '../../utils/utils'

export default {
  name: 'End',
  // components: { BeatLoader },
  async mounted() {
    try {
      const openLogin = await torus.getOpenLoginInstance()
      const { state } = openLogin
      log.info(state, 'state')
      const allInfo = state.store.getStore()
      log.info('allInfo', allInfo)
      const keys = []
      let postboxKey
      if (state.walletKey) {
        keys.push({
          privKey: state.walletKey,
          accountType: ACCOUNT_TYPE.NORMAL,
          ethAddress: torus.generateAddressFromPrivKey(new BN(state.walletKey, 'hex')),
        })
      }
      if (state.tKey) {
        keys.push({
          privKey: state.tKey,
          accountType: ACCOUNT_TYPE.THRESHOLD,
          ethAddress: torus.generateAddressFromPrivKey(new BN(state.tKey, 'hex')),
        })
      }
      if (state.oAuthPrivateKey) {
        postboxKey = {
          privKey: state.oAuthPrivateKey,
          ethAddress: torus.generateAddressFromPrivKey(new BN(state.oAuthPrivateKey, 'hex')),
        }
      }
      const userInfo = {
        name: allInfo.name, // first + last name
        profileImage: allInfo.profileImage, // image url
        email: allInfo.email,
        verifier: allInfo.aggregateVerifier, // enum like GOOGLE
        verifierId: allInfo.verifierId, // usually email or facebook id
        verifierParams: { verifier_id: allInfo.verifierId }, // general params
        typeOfLogin: allInfo.typeOfLogin,
      }
      const { appState } = allInfo
      log.info(appState, 'appState')
      const parsedAppState = JSON.parse(atob(decodeURIComponent(decodeURIComponent(appState))))
      log.info(parsedAppState.instanceId, keys, userInfo, postboxKey)
      const bc = new BroadcastChannel(`redirect_openlogin_channel_${parsedAppState.instanceId}`, broadcastChannelOptions)
      await bc.postMessage({
        data: { type: POPUP_RESULT, userInfo, keys, postboxKey },
      })
      bc.close()
      log.info(bc)
      log.info('posted info', POPUP_RESULT)
    } catch (error) {
      log.info(error, 'something went wrong')
    }
  },
}
</script>

<style lang="scss" scoped>
@import 'End.scss';
</style>
