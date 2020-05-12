<template>
  <v-container class="pa-0">
    <PopupLogin :login-dialog="loginDialog" @closeDialog="cancelLogin" />
    <PopupWidget v-if="torusWidgetVisibility" :login-dialog="loginDialog" :logged-in="loggedIn" @onLogin="startLogin" />
    <PopupTopup :is-topup-modal-visible="isTopupModalVisible" />
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'

import PopupLogin from '../../containers/Popup/PopupLogin'
import PopupTopup from '../../containers/Popup/PopupTopup'
import PopupWidget from '../../containers/Popup/PopupWidget'

export default {
  name: 'Popup',
  components: { PopupLogin, PopupWidget, PopupTopup },
  computed: mapState({
    loggedIn: (state) => state.selectedAddress !== '',
    loginDialog: (state) => state.embedState.isOAuthModalVisible,
    torusWidgetVisibility: (state) => state.embedState.torusWidgetVisibility,
    isTopupModalVisible: (state) => state.embedState.isTopupModalVisible,
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
