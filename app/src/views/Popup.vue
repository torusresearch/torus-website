<template>
  <div>
    <button v-on:click="triggerLogin" id="googleAuthBtn">Google</button>
    <input id="email" />
    <p>{{ this.$store.state.loggedIn }}</p>
    <p>{{ loggedIn }}</p>
  </div>
</template>

<script>
/* eslint-disable */
import torusUtils from '@/utils/torusUtils'
import { mapActions, mapGetters } from 'vuex'
import * as log from 'loglevel'

export default {
  name: 'popup',
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
  computed: {
    ...mapGetters (['loggedIn'])
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
