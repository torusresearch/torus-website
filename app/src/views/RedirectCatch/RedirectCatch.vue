<template>
  <v-container fluid>
    <v-layout wrap>
      <v-flex xs12 sm6 md3>Redirecting you back to Torus App. Please Wait...</v-flex>
      <page-loader />
    </v-layout>
  </v-container>
</template>

<script>
import BroadcastChannel from 'broadcast-channel'
import PageLoader from '../../components/helpers/PageLoader'
import { broadcastChannelOptions } from '../../utils/utils'
import log from 'loglevel'

export default {
  name: 'redirect',
  components: {
    PageLoader
  },
  async mounted() {
    const hash = this.$router.currentRoute.hash.substr(1)

    let result = hash.split('&').reduce(function(result, item) {
      const parts = item.split('=')
      result[parts[0]] = parts[1]
      return result
    }, {})
    if (result && result.state) {
      const instanceParams = JSON.parse(window.atob(decodeURIComponent(decodeURIComponent(result.state)))) || {}
      var bc = new BroadcastChannel(`redirect_channel_${instanceParams.instanceId}`, broadcastChannelOptions)
      await bc.postMessage({
        data: {
          verifier: instanceParams.verifier,
          verifierParams: result
        }
      })
      bc.close()
      window.close()
    }

    // var bc = new BroadcastChannel(
    //   `user_info_request_channel_${new URLSearchParams(window.location.search).get('instanceId')}`,
    //   broadcastChannelOptions
    // )
    // bc.onmessage = async ev => {
    //   const { payload, origin } = ev.data || {}
    //   let url = { hostname: '' }
    //   try {
    //     url = new URL(origin)
    //   } catch (err) {
    //     log.error(err)
    //   }
    //   this.origin = url.hostname // origin of tx: website url
    //   this.type = 'userInfo'
    //   bc.close()
    // }
    // bc.postMessage({ data: 'popup-loaded' })
  }
}
</script>
