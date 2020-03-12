<template>
  <v-container fill-height text-center>
    <v-layout class="redirect-container" :class="$vuetify.breakpoint.xsOnly ? 'redirect-container--mobile' : ''" row wrap align-center>
      <v-flex text-center>
        <BeatLoader :color="$vuetify.theme.themes.dark.primary.base" />
        <div class="redirect-title font-weight-bold mt-3">
          {{ t('dappGeneral.loading') }}
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { BroadcastChannel } from 'broadcast-channel'
import log from 'loglevel'
import BeatLoader from 'vue-spinner/src/BeatLoader'

import { broadcastChannelOptions } from '../../utils/utils'

export default {
  name: 'Redirect',
  components: { BeatLoader },
  async mounted() {
    let bc
    try {
      const hash = this.$router.currentRoute.hash.slice(1)
      const hashParameters = hash.split('&').reduce((result, item) => {
        const [part0, part1] = item.split('=')
        result[part0] = part1
        return result
      }, {})
      const queryParameters = this.$router.currentRoute.query
      // reddit error - hash params
      // error: "access_denied"
      // state: "eyJpbnN0YW5jZUlkIjoiTjFhRHNmaGN4dGNzc1dhc2pPV2tzSThPclI2eHBIIiwidmVyaWZpZXIiOiJyZWRkaXQifQ%3D%3D"
      // twitch error - query params
      // error: "access_denied"
      // error_description: "The user denied you access"
      // state: "eyJpbnN0YW5jZUlkIjoiTjFhRHNmaGN4dGNzc1dhc2pPV2tzSThPclI2eHBIIiwidmVyaWZpZXIiOiJ0d2l0Y2gifQ=="
      log.info(hashParameters, queryParameters)
      if (!queryParameters.preopenInstanceId) {
        this.textVisible = true
        let instanceParameters = {}
        let error = ''
        if (Object.keys(hashParameters).length > 0 && hashParameters.state) {
          instanceParameters = JSON.parse(window.atob(decodeURIComponent(decodeURIComponent(hashParameters.state)))) || {}
          if (hashParameters.error) error = hashParameters.error
        } else if (Object.keys(queryParameters).length > 0 && queryParameters.state) {
          instanceParameters = JSON.parse(window.atob(decodeURIComponent(decodeURIComponent(queryParameters.state)))) || {}
          if (queryParameters.error) error = queryParameters.error
        }
        bc = new BroadcastChannel(`redirect_channel_${instanceParameters.instanceId}`, broadcastChannelOptions)
        await bc.postMessage({
          data: {
            instanceParams: instanceParameters,
            hashParams: hashParameters,
            queryParams: queryParameters
          },
          error
        })
        bc.close()
        log.info('posted', { queryParameters, hashParameters, instanceParameters })
      } else {
        bc = new BroadcastChannel(`preopen_channel_${queryParameters.preopenInstanceId}`, broadcastChannelOptions)
        bc.addEventListener('message', ev => {
          const { preopenInstanceId: oldId, payload, message } = ev.data
          if (oldId === queryParameters.preopenInstanceId && payload && payload.url) {
            window.location.href = payload.url
          } else if (oldId === queryParameters.preopenInstanceId && message === 'setup_complete') {
            bc.postMessage({
              data: {
                preopenInstanceId: queryParameters.preopenInstanceId,
                message: 'popup_loaded'
              }
            })
          }
          if (ev.error && ev.error !== '') {
            log.error(ev.error)
            bc.close()
          }
        })
      }
    } catch (error) {
      log.info(error, 'something went wrong')
      if (bc) bc.close()
      window.close()
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'RedirectCatch.scss';
</style>
