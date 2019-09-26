<template>
  <v-container fluid>
    <v-layout wrap>
      <v-flex xs12 sm6 md3>
        Welcome to Torus
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'popup',
  data: function() {
    return {}
  },
  mounted() {
    const googleInterval = setInterval(() => {
      if (window.gapi) {
        window.gapi.load('auth2', () => {
          window.auth2 = window.gapi.auth2.init({
            client_id: '876733105116-i0hj3s53qiio5k95prpfmj0hp0gmgtor.apps.googleusercontent.com'
          })
          clearInterval(googleInterval)
        })
      }
    }, 2000)

    // setup facebook auth sdk
    const facebookInterval = setInterval(() => {
      if (window.FB) {
        window.FB.init({
          appId: '2554219104599979',
          version: 'v4.0'
        })
        window.FBInitialized = true
        clearInterval(facebookInterval)
      }
    }, 2000)
  }
}
</script>
