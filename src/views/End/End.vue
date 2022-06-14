<template>
  <v-container fluid fill-height text-center>
    <v-layout class="redirect-container" :class="$vuetify.breakpoint.xsOnly ? 'redirect-container--mobile' : ''" row wrap align-center>
      <v-flex text-center>
        <BoxLoader v-if="loading" :white-label="whiteLabel" :is-custom-verifier="isCustomVerifier" />
        <div v-else>
          <div class="text-h5 font-weight-bold mb-8">{{ t('login.selectAnAccount') }}</div>
          <div class="account-list mb-8">
            <v-checkbox
              v-for="(app, address) in accounts"
              :key="address"
              :input-value="selectedAccount === address"
              messages=""
              :class="[selectedAccount === address ? 'selected' : '', $vuetify.theme.dark ? 'dark-theme' : '']"
              class="account-item-checkbox mb-2"
              on-icon="$vuetify.icons.checkbox_marked"
              off-icon="$vuetify.icons.checkbox_blank"
              color="text_2--text"
              hide-details
              :readonly="selectedAccount === address"
              :ripple="false"
              @click="selectAccount(address)"
            >
              <template #label>
                <div class="d-flex flex-column ml-2">
                  <div class="account-app font-weight-bold">{{ app }}</div>
                  <div class="account-address text_2--text">{{ address }}</div>
                </div>
              </template>
            </v-checkbox>
          </div>
          <v-btn id="less-details-link" large color="white" text class="px-8 white--text gmt-wallet-transfer" @click="continueToApp">
            {{ t('login.continueToApp') }}
          </v-btn>
        </div>
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
import log from 'loglevel'

import BoxLoader from '../../components/helpers/BoxLoader'
import { getKeysInfo, getOpenLoginInstance, getUserInfo } from '../../openlogin'
import { ACCOUNT_TYPE, APPLE, POPUP_RESULT } from '../../utils/enums'
import { broadcastChannelOptions } from '../../utils/utils'

export default {
  name: 'End',
  components: { BoxLoader },
  data() {
    return {
      loading: false,
      selectedAccount: '',
      broadcastData: {},
      channelId: '',
      accounts: {},
      isCustomVerifier: false,
    }
  },
  async created() {
    this.loading = true
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
        this.isCustomVerifier = Object.keys(loginConfig).length > 0
      }

      this.whiteLabel = whiteLabel

      const openLogin = await getOpenLoginInstance(whiteLabel, loginConfig)
      const { state } = openLogin
      log.info(state, 'state')

      const { keys, postboxKey, userDapps } = await getKeysInfo(state)
      const userInfo = getUserInfo(state)

      // keys
      const walletKey = keys.find((k) => k.accountType === ACCOUNT_TYPE.NORMAL)
      if (walletKey) {
        const typeOfLoginDisplay = userInfo.typeOfLogin.charAt(0).toUpperCase() + userInfo.typeOfLogin.slice(1)
        const accountDisplay = (userInfo.typeOfLogin !== APPLE && userInfo.email) || userInfo.name
        this.accounts[walletKey.ethAddress] = `${typeOfLoginDisplay} ${this.t('accountMenu.account')} ${accountDisplay}`
      }
      const tKey = keys.find((k) => k.accountType === ACCOUNT_TYPE.THRESHOLD)
      if (tKey) {
        this.accounts[tKey.ethAddress] = `OpenLogin ${this.t('accountMenu.wallet')}`
      }

      // derive app scoped keys from tkey
      this.accounts = { ...this.accounts, ...userDapps }

      // set default selected account
      this.selectedAccount = Object.keys(this.accounts)[0] ?? ''

      // broadcast channel ID
      const { appState } = state.store.getStore()
      log.info(appState, 'appState')
      const parsedAppState = JSON.parse(safeatob(decodeURIComponent(decodeURIComponent(appState))))
      log.info(parsedAppState.instanceId, keys, userInfo, postboxKey)
      this.channelId = parsedAppState.instanceId

      // prepare data
      this.broadcastData = { type: POPUP_RESULT, userInfo, keys, postboxKey, userDapps, error: loginError }

      // if there are no app accounts to choose, continue
      if (Object.keys(userDapps).length === 0) {
        await this.continueToApp()
      }
    } catch (error) {
      log.error(error, 'something went wrong')
    }
    this.loading = false
  },
  methods: {
    selectAccount(address) {
      this.selectedAccount = address
    },
    async continueToApp() {
      this.loading = true
      try {
        // move selected key to the first position of keys
        const { keys } = this.broadcastData
        const id = keys.findIndex((k) => k.ethAddress === this.selectedAccount)
        if (id > -1) {
          const selectedKey = keys[id]
          keys.splice(id, 1)
          keys.unshift(selectedKey)
        }

        const bc = new BroadcastChannel(`redirect_openlogin_channel_${this.channelId}`, broadcastChannelOptions)
        await bc.postMessage({ data: this.broadcastData })
        bc.close()
        log.info(bc)
        log.info('posted info', POPUP_RESULT)
      } catch (error) {
        log.error(error, 'something went wrong')
      }
      this.loading = false
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'End.scss';
</style>
