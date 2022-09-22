<template>
  <v-container fluid class="fill-height text-center">
    <v-row wrap align="center" class="fill-height redirect-container" :class="$vuetify.display.xs ? 'redirect-container--mobile' : ''">
      <v-col class="text-center">
        <BoxLoader v-if="loading" :white-label="whiteLabel" :is-custom-verifier="isCustomVerifier" />
        <div v-else>
          <div class="text-h5 font-weight-bold mb-8">{{ $t('login.selectAnAccount') }}</div>
          <div class="account-list mb-8">
            <v-checkbox
              v-for="(app, address) in accounts"
              :key="address"
              v-model="selectedAccount"
              :value="address"
              messages=""
              :class="[selectedAccount === address ? 'selected' : '', isDarkMode ? 'dark-theme' : '']"
              class="account-item-checkbox mb-2"
              true-icon="$checkbox_marked"
              false-icon="$checkbox_blank"
              color="text_2--text"
              hide-details
              :readonly="selectedAccount === address"
              :ripple="false"
            >
              <template #label>
                <div class="d-flex flex-column ml-2">
                  <div class="account-app font-weight-bold">{{ app }}</div>
                  <div class="account-address text_2--text">{{ address }}</div>
                </div>
              </template>
            </v-checkbox>
          </div>
          <v-btn id="less-details-link" large color="white" variant="text" class="px-8 white--text gmt-wallet-transfer" @click="continueToApp">
            {{ $t('login.continueToApp') }}
          </v-btn>
        </div>
      </v-col>
      <div class="footer">
        <div class="powered-by">{{ $t('login.selfCustodial') }}</div>
        <img height="26" :src="require(`@/assets/images/web3auth.svg`)" alt="Web3Auth" />
      </div>
    </v-row>
  </v-container>
</template>

<script>
import { BroadcastChannel } from '@toruslabs/broadcast-channel'
import { safeatob } from '@toruslabs/openlogin-utils'
import log from 'loglevel'

import BoxLoader from '../../components/helpers/BoxLoader'
import { OpenLoginHandler } from '../../handlers/Auth'
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
  computed: {
    isDarkMode() {
      return this.$vuetify.theme.current.dark
    },
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

      let resultParams = {
        store: {},
      }
      const sessionId = hashUrl.searchParams.get('sessionId') || ''
      const sessionNamespace = hashUrl.searchParams.get('sessionNamespace') || ''
      if (result) {
        resultParams = JSON.parse(safeatob(result))
        loginError = resultParams.error
        const appStateParams = JSON.parse(safeatob(resultParams.store.appState))
        whiteLabel = appStateParams.whiteLabel || {}
        loginConfig = appStateParams.loginConfig || {}
        this.isCustomVerifier = Object.keys(loginConfig).length > 0
      }

      this.whiteLabel = whiteLabel

      const openLoginHandler = OpenLoginHandler.getInstance(whiteLabel, loginConfig, sessionNamespace)
      await openLoginHandler.openLoginInstance._syncState({
        ...resultParams,
        store: {
          ...resultParams.store,
          sessionId,
          sessionNamespace,
        },
      })
      const { state } = openLoginHandler.openLoginInstance

      const { keys, postboxKey } = openLoginHandler.getKeysInfo()
      const { keys: extraKeys, userDapps } = await openLoginHandler.getUserDapps(postboxKey)
      const userInfo = openLoginHandler.getUserInfo()
      keys.push(...extraKeys)

      // keys
      const walletKey = keys.find((k) => k.accountType === ACCOUNT_TYPE.NORMAL)
      if (walletKey) {
        const typeOfLoginDisplay = userInfo.typeOfLogin.charAt(0).toUpperCase() + userInfo.typeOfLogin.slice(1)
        const accountDisplay = (userInfo.typeOfLogin !== APPLE && userInfo.email) || userInfo.name
        this.accounts[walletKey.ethAddress] = `${typeOfLoginDisplay} ${this.$t('accountMenu.account')} ${accountDisplay}`
      }
      const tKey = keys.find((k) => k.accountType === ACCOUNT_TYPE.THRESHOLD)
      if (tKey) {
        this.accounts[tKey.ethAddress] = `OpenLogin ${this.$t('accountMenu.wallet')}`
      }

      // derive app scoped keys from tkey
      this.accounts = { ...this.accounts, ...userDapps }

      // set default selected account
      this.selectedAccount = Object.keys(this.accounts)[0] ?? ''

      // broadcast channel ID
      const { appState } = state.store.getStore()
      const parsedAppState = JSON.parse(safeatob(decodeURIComponent(decodeURIComponent(appState))))
      this.channelId = parsedAppState.instanceId

      // prepare data
      this.broadcastData = {
        type: POPUP_RESULT,
        userInfo,
        keys,
        postboxKey,
        userDapps,
        error: loginError,
        sessionId: openLoginHandler.getSessionId(),
        sessionNamespace: openLoginHandler.getSessionNamespace(),
      }

      // if there are no app accounts to choose, continue
      if (Object.keys(userDapps).length === 0 || parsedAppState.origin.hostname === window.location.hostname) {
        await this.continueToApp()
      }
    } catch (error) {
      log.error(error, 'something went wrong')
    }
    this.loading = false
  },
  methods: {
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
        // converting reactivity proxy object to POJO.
        await bc.postMessage({ data: JSON.parse(JSON.stringify(this.broadcastData)) })
        bc.close()
        log.info('posted info')
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
