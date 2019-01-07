<template>
  <Popup />
</template>

<script>
import Popup from '../components/Popup.vue'
import torusUtils from '@/utils/torusUtils'
import { mapActions } from 'vuex'
import * as log from 'loglevel'

export default {
  name: 'popup',
  components: {
    Popup
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
  methods: {
    ...mapActions({
      updateEmail: 'updateEmail',
      updateIdToken: 'updateIdToken',
      addWallet: 'addWallet',
      removeWallet: 'removeWallet',
      updateBalance: 'updateBalance',
      updateLoginStatus: 'updateLoginStatus',
      updateSelectedAddress: 'updateSelectedAddress',
      updateNetworkId: 'updateNetworkId'
    })
  },
  mounted () {
    /* global web3 */
    var that = this
    window.gapi.load('auth2', function () {
      window.auth2 = window.gapi.auth2.init({
        client_id: '876733105116-i0hj3s53qiio5k95prpfmj0hp0gmgtor.apps.googleusercontent.com'
      })
      window.auth2.attachClickHandler(window.document.getElementById('googleAuthBtn'), {},
        function (googleUser) {
          console.log('GOOGLE USER: ', googleUser)
          var profile = googleUser.getBasicProfile()
          // console.log(googleUser)
          console.log('ID: ' + profile.getId()) // Do not send to your backend! Use an ID token instead.
          console.log('Name: ' + profile.getName())
          console.log('Image URL: ' + profile.getImageUrl())
          console.log('Email: ' + profile.getEmail()) // This is null if the 'email' scope is not present.

          that.methods.updateIdToken({ idToken: googleUser.getAuthResponse().id_token })
          that.methods.updateEmail({ email: profile.getEmail() })
          window.gapi.auth2.getAuthInstance().disconnect().then(function () {
            torusUtils.getPubKeyAsync(that.torusNodeEndpoints, function (err, res) {
              if (err) {
                log.error(err)
              } else {
                console.log('New private key assigned to user at address ', res)
                torusUtils.retrieveShares(
                  that.torusNodeEndpoints,
                  that.$store.state.email,
                  that.$store.state.idToken,
                  function (err, data) {
                    log.error(err)
                    that.methods.updateSelectedAddress(data.ethAddress)
                    that.methods.addWallet(data)
                    web3.eth.net.getId().then(res => {
                      that.methods.updateNetworkId(res)
                    // publicConfigOutStream.write(JSON.stringify({networkVersion: res}))
                    }).catch(e => log.error(e))
                  }
                )
              }
            })
          })
        },
        function (error) {
          log.error(JSON.stringify(error, undefined, 2))
        })
    })
  }
}
</script>
