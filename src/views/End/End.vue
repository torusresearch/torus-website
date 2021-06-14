<template>
  <v-container fill-height text-center>
    <v-layout class="redirect-container" :class="$vuetify.breakpoint.xsOnly ? 'redirect-container--mobile' : ''" row wrap align-center>
      <v-flex text-center>
        <BoxLoader />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { safeatob } from '@toruslabs/openlogin-utils'
import Torus from '@toruslabs/torus.js'
import { BroadcastChannel } from 'broadcast-channel'
import { BN } from 'ethereumjs-util'
import log from 'loglevel'
import { mapState } from 'vuex'

import BoxLoader from '../../components/helpers/BoxLoader'
import { getOpenLoginInstance } from '../../openlogin'
import { ACCOUNT_TYPE, POPUP_RESULT } from '../../utils/enums'
import { broadcastChannelOptions } from '../../utils/utils'

export default {
  name: 'End',
  components: { BoxLoader },
  computed: {
    ...mapState({
      whiteLabel: 'whiteLabel',
    }),
  },
  async mounted() {
    try {
      const { hash } = this.$route
      const hashUrl = new URL(`${window.location.origin}?${hash.slice(1)}`)
      const result = hashUrl.searchParams.get('result')
      let { whiteLabel } = this

      if (result) {
        const resultParams = JSON.parse(safeatob(result))
        const appStateParams = JSON.parse(safeatob(resultParams.store.appState))
        whiteLabel = appStateParams.whiteLabel ? appStateParams.whiteLabel : this.whiteLabel
      }

      const torus = new Torus()
      const openLogin = await getOpenLoginInstance(whiteLabel)
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
      const parsedAppState = JSON.parse(safeatob(decodeURIComponent(decodeURIComponent(appState))))
      log.info(parsedAppState.instanceId, keys, userInfo, postboxKey)
      // debugger
      const bc = new BroadcastChannel(`redirect_openlogin_channel_${parsedAppState.instanceId}`, broadcastChannelOptions)
      await bc.postMessage({
        data: { type: POPUP_RESULT, userInfo, keys, postboxKey },
      })
      bc.close()
      log.info(bc)
      log.info('posted info', POPUP_RESULT)
    } catch (error) {
      log.error(error, 'something went wrong')
    }
  },
}
</script>

<style lang="scss" scoped>
@import 'End.scss';
</style>
