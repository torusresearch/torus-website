import { BroadcastChannel } from 'broadcast-channel'
import log from 'loglevel'

import config from '../../config'
import getQuote from '../../plugins/xanpool'
import torus from '../../torus'
import { XANPOOL } from '../../utils/enums'
import PopupHandler from '../../utils/PopupHandler'
import { broadcastChannelOptions } from '../../utils/utils'

export default {
  fetchXanpoolQuote(context, payload) {
    // returns a promise
    return getQuote({
      type: payload.type || 'buy',
      cryptoCurrency: payload.selectedCryptoCurrency,
      currency: payload.selectedCurrency,
      fiat: +Number.parseFloat(payload.fiatValue),
    })
  },
  fetchXanpoolOrder({ state, dispatch }, { currentOrder, preopenInstanceId, selectedAddress }) {
    const instanceState = encodeURIComponent(window.btoa(JSON.stringify({ instanceId: torus.instanceId, provider: XANPOOL })))
    const parameters = {
      apiKey: config.xanpoolLiveAPIKEY,
      wallet: selectedAddress || undefined,
      fiat: currentOrder.fiatValue || undefined,
      cryptoCurrency: currentOrder.selectedCryptoCurrency || undefined,
      currency: currentOrder.selectedCurrency || undefined,
      partnerData: selectedAddress || state.selectedAddress,
      redirectUrl: `${config.redirect_uri}?state=${instanceState}`,
    }

    return dispatch('postXanpoolOrder', { params: parameters, path: config.xanpoolHost, preopenInstanceId })
  },
  postXanpoolOrder(context, { path, params, preopenInstanceId }) {
    return new Promise((resolve, reject) => {
      const parameterString = new URLSearchParams(JSON.parse(JSON.stringify(params)))
      const finalUrl = `${path}?${parameterString.toString()}`
      const xanpoolWindow = new PopupHandler({ preopenInstanceId, url: finalUrl })

      const bc = new BroadcastChannel(`redirect_channel_${torus.instanceId}`, broadcastChannelOptions)
      bc.addEventListener('message', (ev) => {
        try {
          const {
            instanceParams: { provider },
          } = ev.data || {}
          if (ev.error && ev.error !== '') {
            log.error(ev.error)
            reject(new Error(ev.error))
          } else if (provider === XANPOOL) {
            resolve({ success: true })
          }
        } catch (error) {
          reject(error)
        } finally {
          bc.close()
          xanpoolWindow.close()
        }
      })

      xanpoolWindow.open()
      xanpoolWindow.once('close', () => {
        bc.close()
        reject(new Error('user closed xanpool popup'))
      })
    })
  },
}
