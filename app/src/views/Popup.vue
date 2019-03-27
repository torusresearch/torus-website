<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 sm6 md3>
        <v-text-field
          id="email"
          placeholder="Enter your email address"
          aria-label="box"
          solo
          type="email"
          v-model="email"
          :rules="[rules.email]"
          height="15px"
        ></v-text-field>
      </v-flex>
      <v-flex xs12 sm6 md3>
        <v-btn color="#75b4fd" class="white--text" v-on:click="triggerLogin" id="googleAuthBtnf">Google</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'popup',
  data: function() {
    return {
      torusNodeEndpoints: [
        'https://binancelabs.torusnode.com/jrpc',
        'https://waseda.torusnode.com/jrpc',
        'https://vgr.torusnode.com/jrpc',
        'https://torus.torusnode.com/jrpc',
        'https://etc.torusnode.com/jrpc'
      ],
      email: '',
      rules: {
        email: value => {
          // eslint-disable-next-line max-len
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        }
      }
    }
  },
  methods: {
    ...mapActions({
      updateEmail: 'updateEmail',
      updateIdToken: 'updateIdToken',
      addWallet: 'addWallet',
      removeWallet: 'removeWallet',
      updateSelectedAddress: 'updateSelectedAddress',
      updateNetworkId: 'updateNetworkId',
      triggerLogin: 'triggerLogin'
    })
  },
  mounted() {
    const interval = setInterval(() => {
      if (window.gapi) {
        window.gapi.load('auth2', function() {
          window.auth2 = window.gapi.auth2.init({
            client_id: '876733105116-i0hj3s53qiio5k95prpfmj0hp0gmgtor.apps.googleusercontent.com'
          })
          clearInterval(interval)
        })
      }
    }, 2000)
  }
}
</script>
