<template>
  <v-container fill-height text-center>
    <v-layout class="redirect-container" :class="$vuetify.breakpoint.xsOnly ? 'redirect-container--mobile' : ''" row wrap align-center>
      <v-flex text-center>
        <BoxLoader v-if="loading" />
        <div>
          <div class="text-h5 font-weight-bold mb-8">Select an account to continue</div>
          <div class="px-3 mb-3 account-list mb-8">
            <v-checkbox
              v-for="(app, address) in userDapps"
              :key="address"
              :input-value="selectedAccount === address"
              messages=""
              :class="selectedAccount === address ? 'selected' : ''"
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
            {{ 'Continue to app' || t('end.continueToApp') }}
          </v-btn>
        </div>
      </v-flex>
      <div class="footer">
        <div class="powered-by">{{ t('login.secured-by') }}</div>
        <img height="26" :src="require(`@/assets/images/web3auth.svg`)" alt="Web3Auth" />
      </div>
    </v-layout>
  </v-container>
</template>

<script>
import { BroadcastChannel } from '@toruslabs/broadcast-channel'
import { subkey } from '@toruslabs/openlogin-subkey'
import { safeatob } from '@toruslabs/openlogin-utils'
import Torus from '@toruslabs/torus.js'
import { BN } from 'ethereumjs-util'
import log from 'loglevel'

import BoxLoader from '../../components/helpers/BoxLoader'
import config from '../../config'
import { getOpenLoginInstance } from '../../openlogin'
import { ACCOUNT_TYPE, POPUP_RESULT } from '../../utils/enums'
import { get } from '../../utils/httpHelpers'
import { broadcastChannelOptions } from '../../utils/utils'

export default {
  name: 'End',
  components: { BoxLoader },
  data() {
    return {
      wallets: [
        {
          app: 'Ladder Caster',
          address: '0xCC00De14EaF13008EBdC12C18a4679E837ab8E50',
        },
        {
          app: '100thieves',
          address: '0xCC00De14EaF13008EBdC12C18a4679E837ab8E51',
        },
        {
          app: 'Web3auth',
          address: '0xCC00De14EaF13008EBdC12C18a4679E837ab8E52',
        },
      ],
      selectedAccount: '',
      loading: false,
      broadcastData: {},
      channelId: '',
      userDapps: {},
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
      }

      const torus = new Torus()
      const openLogin = await getOpenLoginInstance(whiteLabel, loginConfig)
      const { state } = openLogin
      log.info(state, 'state')

      // keys
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

      // derive app scoped keys from tkey
      const userDapps = {}
      try {
        const tkey = state.tKey || state.walletKey
        const ethAddress = torus.generateAddressFromPrivKey(new BN(tkey, 'hex'))
        const response = await get(`${config.developerDashboardUrl}/projects/user-projects?chain_namespace=evm&public_address=${ethAddress}`)
        log.info(response, 'user projects from developer dashboard')
        response.user_projects.forEach((project) => {
          const subKey = subkey(tkey, Buffer.from(project.project_id, 'base64'))
          const subAddress = torus.generateAddressFromPrivKey(subKey)
          userDapps[subAddress] = project.name
          keys.push({ ethAddress: subAddress, privKey: subKey, accountType: ACCOUNT_TYPE.APP_SCOPED })
        })
      } catch (error) {
        log.error('Failed to derive app-scoped keys', error)
      }
      this.userDapps = userDapps

      // set default selected account
      this.selectedAccount = Object.keys(this.userDapps)[0] ?? ''

      // user info
      const allInfo = state.store.getStore()
      log.info('allInfo', allInfo)
      const userInfo = {
        name: allInfo.name, // first + last name
        profileImage: allInfo.profileImage, // image url
        email: allInfo.email,
        verifier: allInfo.aggregateVerifier, // enum like GOOGLE
        verifierId: allInfo.verifierId, // usually email or facebook id
        verifierParams: { verifier_id: allInfo.verifierId }, // general params
        typeOfLogin: allInfo.typeOfLogin,
      }

      // broadcast channel ID
      const { appState } = allInfo
      log.info(appState, 'appState')
      const parsedAppState = JSON.parse(safeatob(decodeURIComponent(decodeURIComponent(appState))))
      log.info(parsedAppState.instanceId, keys, userInfo, postboxKey)
      this.channelId = parsedAppState.instanceId
      // debugger

      // prepare data
      this.broadcastData = { type: POPUP_RESULT, userInfo, keys, postboxKey, userDapps, error: loginError }
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
        const selectedKey = keys[id]
        keys.splice(id, 1)
        keys.unshift(selectedKey)

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
