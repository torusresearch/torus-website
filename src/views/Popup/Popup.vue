<template>
  <v-container class="pa-0">
    <PopupLogin :login-dialog="loginDialog" @closeDialog="cancelLogin" />
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
// import log from 'loglevel'
import { mapActions, mapState } from 'vuex'

import WalletConnect from '../../components/helpers/WalletConnect'
import PopupLogin from '../../containers/Popup/PopupLogin'
import PopupWidget from '../../containers/Popup/PopupWidget'
import { apiStreamSupported } from '../../utils/utils'

export default {
  name: 'Popup',
  components: { PopupLogin, PopupWidget, WalletConnect },
  computed: mapState({
    loggedIn: (state) => state.selectedAddress !== '' && state.wallet[state.selectedAddress] !== undefined,
    loginDialog: (state) => state.embedState.isOAuthModalVisible,
    torusWidgetVisibility: (state) => state.embedState.torusWidgetVisibility,
    loginInProgress: (state) => state.embedState.loginInProgress,
    showWalletConnect: (state) => {
      const loggedIn = state.selectedAddress !== '' && state.wallet[state.selectedAddress] !== undefined
      const canConnect = state.embedState.showWalletConnect && apiStreamSupported && loggedIn
      return canConnect
    },
    apiStreamSupported() {
      return apiStreamSupported()
    },
  }),
  methods: {
    ...mapActions({
      cancelLogin: 'cancelLogin',
      startLogin: 'startLogin',
    }),
  },
}
</script>

<style lang="scss" scoped>
@import 'Popup.scss';
</style>
