import { getQuote } from '../../plugins/moonpay'
import config from '../../config'
import torus from '../../torus'
import { MOONPAY } from '../../utils/enums'
import { BroadcastChannel } from 'broadcast-channel'
import log from 'loglevel'
import { broadcastChannelOptions } from '../../utils/utils'

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
    var moonpayWindow
    var iClosedMoonpay = false
    return new Promise((resolve, reject) => {
      const paramString = new URLSearchParams(params)
      const finalUrl = `${path}?${paramString}`

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
          iClosedMoonpay = true
          moonpayWindow.close()
        }
      }

      // Handle communication with moonpay window here
      moonpayWindow = window.open(finalUrl, '_blank', 'directories=0,titlebar=0,toolbar=0,status=0,location=0,menubar=0,height=700,width=1200')

      var moonpayTimer = setInterval(function() {
        if (moonpayWindow.closed) {
          clearInterval(moonpayTimer)
          if (!iClosedMoonpay) {
            log.error('user closed popup')
            reject(new Error('user closed moonpay popup'))
          }
          iClosedMoonpay = false
          moonpayWindow = undefined
        }
      }, 1000)
    })
  }
}
