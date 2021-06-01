<template>
  <v-container class="pa-0">
    <PopupLogin :login-dialog="loginDialog" @closeDialog="cancelLogin" />
    <PopupWidget v-if="torusWidgetVisibility" :login-dialog="loginDialog || loginInProgress" :logged-in="loggedIn" @onLogin="startLogin" />
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'

import PopupLogin from '../../containers/Popup/PopupLogin'
import PopupWidget from '../../containers/Popup/PopupWidget'

export default {
  name: 'Popup',
  components: { PopupLogin, PopupWidget },
  computed: mapState({
    loggedIn: (state) => state.selectedAddress !== '',
    loginDialog: (state) => state.embedState.isOAuthModalVisible,
    torusWidgetVisibility: (state) => state.embedState.torusWidgetVisibility,
    loginInProgress: (state) => state.embedState.loginInProgress,
  }),
  mounted() {
    window.$crisp.push(['do', 'chat:hide'])
  },
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
