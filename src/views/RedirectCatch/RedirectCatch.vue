<template>
  <v-container class="fill-height text-center" fluid>
    <div class="d-flex flex-column fill-height">
      <div class="flex-grow-1 d-flex align-center justify-center">
        <div>
          <BoxLoader :force-spinner="true" />
          <div v-if="showCloseText" class="redirect-title font-weight-bold mt-2">
            {{ $t('dappGeneral.loading') }}
          </div>
        </div>
      </div>
      <div class="footer mb-15">
        <div class="powered-by">{{ $t('login.selfCustodial') }}</div>
        <img height="26" :src="require(`@/assets/images/web3auth.svg`)" alt="Web3Auth" />
      </div>
    </div>
  </v-container>
</template>

<script>
import { BroadcastChannel } from '@toruslabs/broadcast-channel'
import log from 'loglevel'

import BoxLoader from '../../components/helpers/BoxLoader'
import { broadcastChannelOptions, handleRedirectParameters } from '../../utils/utils'

export default {
  name: 'Redirect',
  components: { BoxLoader },
  data() {
    return {
      showCloseText: false,
    }
  },
  async created() {
    let bc
    try {
      // reddit error - hash params
      // error: "access_denied"
      // state: "eyJpbnN0YW5jZUlkIjoiTjFhRHNmaGN4dGNzc1dhc2pPV2tzSThPclI2eHBIIiwidmVyaWZpZXIiOiJyZWRkaXQifQ%3D%3D"
      // twitch error - query params
      // error: "access_denied"
      // error_description: "The user denied you access"
      // state: "eyJpbnN0YW5jZUlkIjoiTjFhRHNmaGN4dGNzc1dhc2pPV2tzSThPclI2eHBIIiwidmVyaWZpZXIiOiJ0d2l0Y2gifQ=="
      const hash = this.$route.hash.slice(1)
      const queryParameters = this.$route.query
      const { error, instanceParameters, hashParameters } = handleRedirectParameters(hash, queryParameters)
      log.info(hashParameters, queryParameters)
      if (!queryParameters.preopenInstanceId) {
        this.textVisible = true
        bc = new BroadcastChannel(`redirect_channel_${instanceParameters.instanceId}`, broadcastChannelOptions)
        bc.addEventListener('message', (ev) => {
          if (ev.success) {
            bc.close()
            log.info('posted', { queryParameters, hashParameters, instanceParameters })
          } else {
            window.close()
            this.showCloseText = true
          }
        })
        await bc.postMessage({
          data: JSON.parse(
            JSON.stringify({
              instanceParams: instanceParameters,
              hashParams: hashParameters,
              queryParams: queryParameters,
            })
          ),
          error,
        })

        setTimeout(() => {
          window.location.href = window.location.origin + window.location.search + window.location.hash
        }, 5000)
      } else {
        bc = new BroadcastChannel(`preopen_channel_${queryParameters.preopenInstanceId}`, broadcastChannelOptions)
        bc.addEventListener('message', (ev) => {
          const { preopenInstanceId: oldId, payload, message } = ev.data
          if (oldId === queryParameters.preopenInstanceId && payload?.url) {
            const url = new URL(payload.url)
            // if same origin, use router.push
            if (url.origin === window.location.origin) {
              const matchedRoute = this.$router.resolve(url.pathname.replace(/^\/v\d+\.\d+\.\d+\//, ''))
              const query = Object.fromEntries(new URLSearchParams(url.search))
              this.$router.push({ query, hash: url.hash, name: matchedRoute.name })
            } else {
              window.location.href = payload.url
            }
          } else if (oldId === queryParameters.preopenInstanceId && message === 'setup_complete') {
            bc.postMessage({
              data: {
                preopenInstanceId: queryParameters.preopenInstanceId,
                message: 'popup_loaded',
              },
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
      this.showCloseText = true
    }
  },
}
</script>

<style lang="scss" scoped>
@import 'RedirectCatch.scss';
</style>
