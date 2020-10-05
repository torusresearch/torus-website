<template>
  <v-container px-0 py-0 class="confirm-container">
    <template v-if="type === 'none'">
      <PopupScreenLoader />
    </template>
    <ConfirmForm v-else :current-confirm-modal="currentConfirmModal" @triggerSign="triggerSign" @triggerDeny="triggerDeny" />
  </v-container>
</template>

<script>
import { BroadcastChannel } from 'broadcast-channel'

import ConfirmForm from '../../components/Confirm/ConfirmForm'
import { PopupScreenLoader } from '../../content-loader'
import { broadcastChannelOptions } from '../../utils/utils'

export default {
  name: 'Confirm',
  components: {
    PopupScreenLoader,
    ConfirmForm,
  },
  data() {
    return {
      id: 0,
      type: 'none',
      currentConfirmModal: undefined,
    }
  },
  mounted() {
    const queryParameters = new URLSearchParams(window.location.search)
    const instanceId = queryParameters.get('instanceId')
    const queryParameterId = queryParameters.get('id')
    this.channel = `torus_channel_${instanceId}`
    const bc = new BroadcastChannel(this.channel, broadcastChannelOptions)
    bc.addEventListener('message', async (ev) => {
      if (ev.name !== 'send-params') return
      const { type, msgParams, txParams, origin, balance, selectedCurrency, tokenRates, jwtToken, whiteLabel, currencyData, network } = ev.data || {}
      if (txParams && txParams.id.toString() !== queryParameterId) return
      this.type = type
      this.currentConfirmModal = {
        type,
        msgParams,
        txParams,
        origin,
        balance,
        selectedCurrency,
        tokenRates,
        jwtToken,
        whiteLabel,
        currencyData,
        network,
      }

      this.$store.commit('setWhiteLabel', whiteLabel)

      if (txParams && txParams.id.toString() !== queryParameterId) return
      bc.close()
    })
    bc.postMessage({ name: 'popup-loaded', data: { id: queryParameterId } })
  },
  methods: {
    async triggerSign({ gasPrice, gas, customNonceValue, id }) {
      const bc = new BroadcastChannel(this.channel, broadcastChannelOptions)

      await bc.postMessage({
        name: 'tx-result',
        data: { type: 'confirm-transaction', gasPrice, gas, id, txType: this.type, customNonceValue },
      })
      bc.close()
    },
    async triggerDeny({ id }) {
      const bc = new BroadcastChannel(this.channel, broadcastChannelOptions)
      await bc.postMessage({ name: 'tx-result', data: { type: 'deny-transaction', id, txType: this.type } })
      bc.close()
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'Confirm.scss';
</style>
