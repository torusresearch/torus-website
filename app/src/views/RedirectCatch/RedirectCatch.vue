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
    let bc
    try {
      const hash = this.$router.currentRoute.hash.substr(1)
      const hashParams = hash.split('&').reduce(function(result, item) {
        const parts = item.split('=')
        result[parts[0]] = parts[1]
        return result
      }, {})
      const queryParams = this.$router.currentRoute.query
      // reddit error - hash params
      // error: "access_denied"
      // state: "eyJpbnN0YW5jZUlkIjoiTjFhRHNmaGN4dGNzc1dhc2pPV2tzSThPclI2eHBIIiwidmVyaWZpZXIiOiJyZWRkaXQifQ%3D%3D"
      // twitch error - query params
      // error: "access_denied"
      // error_description: "The user denied you access"
      // state: "eyJpbnN0YW5jZUlkIjoiTjFhRHNmaGN4dGNzc1dhc2pPV2tzSThPclI2eHBIIiwidmVyaWZpZXIiOiJ0d2l0Y2gifQ=="
      console.log(hashParams, queryParams)
      let instanceParams = {}
      let error = ''
      if (Object.keys(hashParams).length > 0 && hashParams.state) {
        instanceParams = JSON.parse(window.atob(decodeURIComponent(decodeURIComponent(hashParams.state)))) || {}
        if (hashParams.error) error = hashParams.error
      } else if (Object.keys(queryParams).length > 0 && queryParams.state) {
        instanceParams = JSON.parse(window.atob(decodeURIComponent(decodeURIComponent(queryParams.state)))) || {}
        if (queryParams.error) error = queryParams.error
      }
      bc = new BroadcastChannel(`redirect_channel_${instanceParams.instanceId}`, broadcastChannelOptions)
      await bc.postMessage({
        data: {
          verifier: instanceParams.verifier,
          verifierParams: hashParams
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
