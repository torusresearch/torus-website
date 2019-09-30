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
      let bc
      try {
        const instanceParams = JSON.parse(window.atob(decodeURIComponent(decodeURIComponent(result.state)))) || {}
        bc = new BroadcastChannel(`redirect_channel_${instanceParams.instanceId}`, broadcastChannelOptions)
        await bc.postMessage({
          data: {
            verifier: instanceParams.verifier,
            verifierParams: result
          }
        })
        bc.close()
        window.close()
      } catch (error) {
        log.info(error, 'something went wrong')
        bc.close()
        window.close()
      }
    } else {
      log.info('something went wrong')
      window.close()
    }
  }
}
</script>
