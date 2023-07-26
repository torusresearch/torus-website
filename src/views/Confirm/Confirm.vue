<template>
  <v-container px-0 py-0 :class="{ spinner: type === 'none' }">
    <template v-if="type === 'none'">
      <BoxLoader :force-spinner="true" />
    </template>
    <ConfirmForm v-else :current-confirm-modal="currentConfirmModal" @triggerSign="triggerSign" @triggerDeny="triggerDeny" />
  </v-container>
</template>

<script>
import { BroadcastChannel } from '@toruslabs/broadcast-channel'

import ConfirmForm from '../../components/Confirm/ConfirmForm'
import BoxLoader from '../../components/helpers/BoxLoader'
// import DappCreateTkey from '../../components/helpers/DappCreateTkey'
import { POPUP_LOADED, POPUP_RESULT } from '../../utils/enums'
import { broadcastChannelOptions } from '../../utils/utils'

export default {
  name: 'Confirm',
  components: {
    BoxLoader,
    ConfirmForm,
    // DappCreateTkey,
  },
  data() {
    return {
      id: 0,
      type: 'none',
      currentConfirmModal: undefined,
      channel: '',
    }
  },
  created() {
    const queryParameters = this.$route.query
    const { instanceId, id: queryParameterId } = queryParameters

    this.channel = `torus_channel_${instanceId}`
    const bc = new BroadcastChannel(this.channel, broadcastChannelOptions)
    bc.addEventListener('message', async (ev) => {
      const {
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
        networkDetails,
        gasFees,
      } = ev.data || {}
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
        networkDetails,
        gasFees,
      }
      this.$store.commit('setWhiteLabel', whiteLabel)
      bc.close()
    })
    bc.postMessage({ data: { type: POPUP_LOADED, id: queryParameterId } })
  },
  methods: {
    async triggerSign({ gasPrice, gas, customNonceValue, id, maxFeePerGas, maxPriorityFeePerGas, txEnvelopeType }) {
      const bc = new BroadcastChannel(this.channel, broadcastChannelOptions)

      await bc.postMessage({
        data: {
          type: POPUP_RESULT,
          gasPrice,
          maxFeePerGas,
          maxPriorityFeePerGas,
          txEnvelopeType,
          gas,
          id,
          txType: this.type,
          customNonceValue,
          approve: true,
        },
      })
      bc.close()
      setTimeout(() => {
        window.close()
      }, 1000)
    },
    async triggerDeny({ id }) {
      const bc = new BroadcastChannel(this.channel, broadcastChannelOptions)
      await bc.postMessage({ data: { type: POPUP_RESULT, id, txType: this.type, approve: false } })
      bc.close()
      setTimeout(() => {
        window.close()
      }, 1000)
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'Confirm.scss';
</style>
