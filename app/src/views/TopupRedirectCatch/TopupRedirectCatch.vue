<template>
  <v-container fluid>
    <v-layout wrap>
      <v-flex xs12 sm6 md3>Redirecting you back to Torus App. Please Wait...</v-flex>
      <page-loader />
    </v-layout>
  </v-container>
</template>

<script>
import { BroadcastChannel } from 'broadcast-channel'
import PageLoader from '../../components/helpers/PageLoader'
import { broadcastChannelOptions } from '../../utils/utils'
import log from 'loglevel'

export default {
  name: 'topupredirect',
  components: {
    PageLoader
  },
  async mounted() {
    let bc
    try {
      const queryParams = this.$router.currentRoute.query
      log.info(queryParams)
      let instanceParams = {}
      let error = ''
      if (Object.keys(queryParams).length > 0 && queryParams.state) {
        instanceParams = JSON.parse(window.atob(decodeURIComponent(decodeURIComponent(queryParams.state)))) || {}
        if (queryParams.error) error = queryParams.error
      }
      bc = new BroadcastChannel(`topup_redirect_channel_${instanceParams.instanceId}`, broadcastChannelOptions)
      await bc.postMessage({
        data: {
          success: true,
          provider: instanceParams.provider
        },
        error: error
      })
      bc.close()
    } catch (error) {
      log.info(error, 'something went wrong')
      bc.close()
      window.close()
    }
  }
}
</script>
