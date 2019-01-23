<template>
  <div>
    <div v-if="popupVisible">
      <Confirm />
    </div>
    <div v-else>
      <button v-on:click="triggerLogin" id="googleAuthBtnf">Google</button>
      <input id="email" />
    </div>
  </div>
</template>

<script>
import torusUtils from '@/utils/torusUtils'
import { mapActions } from 'vuex'
import * as log from 'loglevel'
import Confirm from './Confirm.vue'

export default {
  name: 'popup',
  components: {
    Confirm
  },
  data: function () {
    return {
      torusNodeEndpoints: [
        'https://binancelabs.torusnode.com/jrpc',
        'https://waseda.torusnode.com/jrpc',
        'https://vgr.torusnode.com/jrpc',
        'https://torus.torusnode.com/jrpc',
        'https://etc.torusnode.com/jrpc'
      ]
    }
  },
  computed: {
    popupVisible () { return this.$store.state.popupVisible }
  },
  methods: {
    ...mapActions({
      updateEmail: 'updateEmail',
      updateIdToken: 'updateIdToken',
      addWallet: 'addWallet',
      removeWallet: 'removeWallet',
      updateBalance: 'updateBalance',
      updateLoginStatus: 'updateLoginStatus',
      updateSelectedAddress: 'updateSelectedAddress',
      updateNetworkId: 'updateNetworkId',
      triggerLogin: 'triggerLogin'
    }),
  },
  mounted () {
    // setup google auth sdk
    window.gapi.load('auth2', function () {
      window.auth2 = window.gapi.auth2.init({
        client_id: '876733105116-i0hj3s53qiio5k95prpfmj0hp0gmgtor.apps.googleusercontent.com'
      })
    })
  }
}
</script>
