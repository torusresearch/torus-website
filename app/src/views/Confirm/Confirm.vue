<template>
  <v-container px-0 py-0 class="confirm-container">
    <template v-if="type === 'none'">
      <PopupScreenLoader />
    </template>
    <ConfirmForm v-else :current-confirm-modal="currentConfirmModal" @triggerSign="triggerSign" @triggerDeny="triggerDeny" />
  </v-container>
</template>

<script>
import BigNumber from 'bignumber.js'
import { BroadcastChannel } from 'broadcast-channel'

import ConfirmForm from '../../components/Confirm/ConfirmForm'
import { PopupScreenLoader } from '../../content-loader'
import { broadcastChannelOptions } from '../../utils/utils'

const weiInGwei = new BigNumber('10').pow(new BigNumber('9'))
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
    async triggerSign({ gasPrice, gasEstimate, nonce, id }) {
      const bc = new BroadcastChannel(this.channel, broadcastChannelOptions)
      const gasPriceHex = `0x${gasPrice.times(weiInGwei).toString(16)}`
      const gasHex = gasEstimate.eq(new BigNumber('0')) ? undefined : `0x${gasEstimate.toString(16)}`
      const customNonceValue = nonce >= 0 ? `0x${nonce.toString(16)}` : undefined

      await bc.postMessage({
        name: 'tx-result',
        data: { type: 'confirm-transaction', gasPrice: gasPriceHex, gas: gasHex, id, txType: this.type, customNonceValue },
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
