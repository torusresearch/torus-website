<template>
  <v-container fill-height text-center>
    <v-layout class="redirect-container" :class="$vuetify.breakpoint.xsOnly ? 'redirect-container--mobile' : ''" row wrap align-center>
      <v-flex text-center>
        <div class="redirect-title white--text font-weight-bold mb-6">
          You are being redirected
        </div>
        <div class="redirect-info white--text mb-8">
          Please wait
        </div>
        <beat-loader color="white" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { BroadcastChannel } from 'broadcast-channel'
import BeatLoader from 'vue-spinner/src/BeatLoader'
import { broadcastChannelOptions } from '../../utils/utils'
import log from 'loglevel'

export default {
  name: 'redirect',
  components: { BeatLoader },
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
      log.info(hashParams, queryParams)
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
          instanceParams: instanceParams,
          hashParams: hashParams
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

<style lang="scss" scoped>
@import 'RedirectCatch.scss';
</style>
