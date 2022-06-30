<template>
  <v-container class="pa-0">
    <PopupLogin :login-dialog="loginDialog" session-id="sessionId" @closeDialog="cancelLogin" />
    <WalletConnect :show-from-embed="showWalletConnect" />
    <PopupWidget
      v-if="torusWidgetVisibility && !showWalletConnect"
      :login-dialog="loginDialog || loginInProgress"
      :logged-in="loggedIn"
      @onLogin="startLogin"
    />
  </v-container>
</template>

<script>
import log from 'loglevel'
import { mapActions, mapMutations, mapState } from 'vuex'

import WalletConnect from '../../components/helpers/WalletConnect'
import PopupLogin from '../../containers/Popup/PopupLogin'
import PopupWidget from '../../containers/Popup/PopupWidget'
import { getOpenLoginInstance, getSessionId } from '../../openlogin'
import { apiStreamSupported } from '../../utils/utils'

export default {
  name: 'Popup',
  components: { PopupLogin, PopupWidget, WalletConnect },
  data() {
    return {
      sessionId: '',
    }
  },
  computed: mapState({
    loggedIn: (state) => state.selectedAddress !== '',
    loginDialog: (state) => state.embedState.isOAuthModalVisible,
    torusWidgetVisibility: (state) => state.embedState.torusWidgetVisibility,
    loginInProgress: (state) => state.embedState.loginInProgress,
    showWalletConnect: (state) => {
      const canConnect = state.embedState.showWalletConnect && apiStreamSupported && state.selectedAddress !== ''
      return canConnect
    },
    apiStreamSupported() {
      return apiStreamSupported()
    },
  }),
  async mounted() {
    window.$crisp.push(['do', 'chat:hide'])

    // auto login if openlogin session is available
    this.setLoginInProgress(true)
    try {
      const { state } = await getOpenLoginInstance()
      this.sessionId = getSessionId(state)
      if (state.walletKey || state.tKey) {
        log.info('auto-login with openlogin session')
        await this.autoLogin({ openloginState: state, calledFromEmbed: true })
      }
    } catch (error) {
      log.error(error)
      this.setOAuthModalStatus(false)
    } finally {
      this.setLoginInProgress(false)
    }
  },
  methods: {
    ...mapActions({
      cancelLogin: 'cancelLogin',
      startLogin: 'startLogin',
      autoLogin: 'autoLogin',
    }),
    ...mapMutations({
      setLoginInProgress: 'setLoginInProgress',
      setOAuthModalStatus: 'setOAuthModalStatus',
    }),
  },
}
</script>

<style lang="scss" scoped>
@import 'Popup.scss';
</style>
