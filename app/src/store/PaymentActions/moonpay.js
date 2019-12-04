import log from 'loglevel'
import { getQuote } from '../../plugins/moonpay'
import config from '../../config'
import torus from '../../torus'
import { MOONPAY } from '../../utils/enums'
import { BroadcastChannel } from 'broadcast-channel'
import { broadcastChannelOptions } from '../../utils/utils'
import PopupHandler from '../../utils/PopupHandler'

export default {
  fetchMoonpayQuote(context, payload) {
    // returns a promise
    return getQuote({
      digital_currency: payload.selectedCryptoCurrency.toLowerCase(),
      fiat_currency: payload.selectedCurrency.toLowerCase(),
      requested_amount: +parseFloat(payload.fiatValue)
    })
  },
  fetchMoonpayOrder({ state, dispatch }, { currentOrder, colorCode }) {
    const instanceState = encodeURIComponent(
      window.btoa(
        JSON.stringify({
          instanceId: torus.instanceId,
          provider: MOONPAY
        })
      )
    )
    const params = {
      apiKey: config.moonpayLiveAPIKEY,
      currencyCode: currentOrder.currency.code,
      walletAddress: state.selectedAddress,
      colorCode: colorCode,
      baseCurrencyAmount: currentOrder.baseCurrencyAmount,
      baseCurrencyCode: currentOrder.baseCurrency.code,
      email: state.userInfo.email !== '' ? state.userInfo.email : undefined,
      externalCustomerId: state.selectedAddress,
      redirectURL: `${config.redirect_uri}?state=${instanceState}`
    }
    return dispatch('postMoonpayOrder', { path: config.moonpayHost, params: params })
  },
  postMoonpayOrder(context, { path, params, method = 'post' }) {
    return new Promise((resolve, reject) => {
      const paramString = new URLSearchParams(params)
      const finalUrl = `${path}?${paramString}`
      const moonpayWindow = new PopupHandler(finalUrl)

      const bc = new BroadcastChannel(`redirect_channel_${torus.instanceId}`, broadcastChannelOptions)
      bc.onmessage = ev => {
        try {
          const {
            instanceParams: { provider }
          } = ev.data || {}
          if (ev.error && ev.error !== '') {
            log.error(ev.error)
            reject(new Error(ev.error))
          } else if (ev.data && provider === MOONPAY) {
            resolve({ success: true })
          }
        } catch (error) {
          reject(error)
        } finally {
          bc.close()
          moonpayWindow.close()
        }
      }

      // Handle communication with moonpay window here
      moonpayWindow.open()
      moonpayWindow.once('close', () => {
        reject(new Error('user closed moonpay popup'))
      })
    })
  }
}
