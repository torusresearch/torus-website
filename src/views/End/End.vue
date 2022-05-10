<template>
  <v-container fluid fill-height text-center>
    <v-layout class="redirect-container" :class="$vuetify.breakpoint.xsOnly ? 'redirect-container--mobile' : ''" row wrap align-center>
      <v-flex text-center>
        <BoxLoader :white-label="whiteLabel" />
      </v-flex>
      <div class="footer">
        <div class="powered-by">{{ t('login.selfCustodial') }}</div>
        <img height="26" :src="require(`@/assets/images/web3auth.svg`)" alt="Web3Auth" />
      </div>
    </v-layout>
  </v-container>
</template>

<script>
import { BroadcastChannel } from '@toruslabs/broadcast-channel'
import { safeatob } from '@toruslabs/openlogin-utils'
import Torus from '@toruslabs/torus.js'
import { BN } from 'ethereumjs-util'
import log from 'loglevel'

import BoxLoader from '../../components/helpers/BoxLoader'
import { getOpenLoginInstance } from '../../openlogin'
import { ACCOUNT_TYPE, POPUP_RESULT } from '../../utils/enums'
import { broadcastChannelOptions } from '../../utils/utils'

export default {
  name: 'End',
  components: { BoxLoader },
  async created() {
    try {
      const { hash } = this.$route
      const hashUrl = new URL(`${window.location.origin}?${hash.slice(1)}`)
      const result = hashUrl.searchParams.get('result')
      let whiteLabel = {}
      let loginConfig = {}

      let loginError = ''

      if (result) {
        const resultParams = JSON.parse(safeatob(result))
        loginError = resultParams.error
        const appStateParams = JSON.parse(safeatob(resultParams.store.appState))
        whiteLabel = appStateParams.whiteLabel || {}
        loginConfig = appStateParams.loginConfig || {}
      }

      this.whiteLabel = whiteLabel

      const torus = new Torus()
      const openLogin = await getOpenLoginInstance(whiteLabel, loginConfig)
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
      if (state.tKey && state.tKey !== state.walletKey) {
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
        data: { type: POPUP_RESULT, userInfo, keys, postboxKey, error: loginError },
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
