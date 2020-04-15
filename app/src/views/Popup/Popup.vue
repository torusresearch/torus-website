<template>
  <v-container>
    <PopupLogin v-if="!loggedIn && !loginInProgress" :login-dialog="loginDialog" @closeDialog="loginDialog = false" />
    <PopupWidget :login-in-progress="loginInProgress" :logged-in="loggedIn" @onLogin="loginDialog = true" />
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

import PopupLogin from '../../components/Popup/PopupLogin'
import PopupWidget from '../../components/Popup/PopupWidget'

export default {
  name: 'Popup',
  components: { PopupLogin, PopupWidget },
  data() {
    return {
      loginDialog: false,
    }
  },
  computed: mapState({
    loginInProgress: 'loginInProgress',
    loggedIn: (state) => state.selectedAddress !== '' && !state.loginInProgress,
  }),
}
</script>

<style lang="scss" scoped>
@import 'Popup.scss';
</style>
