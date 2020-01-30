import log from 'loglevel'
import { getQuote } from '../../plugins/rampnetwork'
import config from '../../config'
import torus from '../../torus'
import { RAMPNETWORK } from '../../utils/enums'
import { BroadcastChannel } from 'broadcast-channel'
import { broadcastChannelOptions } from '../../utils/utils'
import PopupHandler from '../../utils/PopupHandler'

export default {
  fetchRampNetworkQuote(context, payload) {
    // returns a promise
    return getQuote({
      digital_currency: payload.selectedCryptoCurrency.toLowerCase(),
      fiat_currency: payload.selectedCurrency.toLowerCase(),
      requested_amount: +parseFloat(payload.fiatValue)
    })
  },
  fetchRampNetworkOrder({ state, dispatch }, { currentOrder, preopenInstanceId }) {
    const instanceState = encodeURIComponent(
      window.btoa(
        JSON.stringify({
          instanceId: torus.instanceId,
          provider: RAMPNETWORK
        })
      )
    )

    console.log('currentOrder:', currentOrder)

    const params = {
      userAddress: state.selectedAddress,
      swapAsset: currentOrder.cryptoCurrencySymbol,
      swapAmount: currentOrder.cryptoCurrencyValue,
      variant: 'hosted-auto',
      hostUrl: '*'
    }
    return dispatch('openWidget', { path: config.rampInstantWidget, params: params, preopenInstanceId })
  },
  openWidget(context, { path, params, preopenInstanceId }) {
    return new Promise((resolve, reject) => {
      const paramString = new URLSearchParams(params)
      const finalUrl = `${path}?${paramString}`
      const rampInstantWindow = new PopupHandler({ url: finalUrl, preopenInstanceId })

      rampInstantWindow.open()

      // Handle communication with Ramp Instant Widget window
      window.addEventListener(
        'message',
        event => {
          if (event.data.type === 'WIDGET_CLOSE') {
            rampInstantWindow.close()
          }
          if (event.data.type === 'PURCHASE_CREATED') {
            resolve({ success: true })
          }
        },
        rampInstantWindow.window
      )

      rampInstantWindow.once('close', () => {
        bc.close()
        reject(new Error('User closed Ramp Instant Widget'))
      })
    })
  }
}
