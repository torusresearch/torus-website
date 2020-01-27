import log from 'loglevel'
import { getQuote, getSignature } from '../../plugins/moonpay'
import config from '../../config'
import torus from '../../torus'
import { MOONPAY } from '../../utils/enums'
import { BroadcastChannel } from 'broadcast-channel'
import { broadcastChannelOptions } from '../../utils/utils'
import PopupHandler from '../../utils/PopupHandler'

const randomId = require('random-id')

export default {
  fetchMoonpayQuote(context, payload) {
    // returns a promise
    return getQuote({
      digital_currency: payload.selectedCryptoCurrency.toLowerCase(),
      fiat_currency: payload.selectedCurrency.toLowerCase(),
      requested_amount: +parseFloat(payload.fiatValue)
    })
  },
  fetchMoonpayOrder({ state, dispatch }, { currentOrder, colorCode, preopenInstanceId: preopenInstanceIdPayload, selectedAddress }) {
    return new Promise((resolve, reject) => {
      let preopenInstanceId = preopenInstanceIdPayload
      if (!preopenInstanceId) {
        preopenInstanceId = randomId()
        const finalUrl = config.baseUrl + `/redirect?preopenInstanceId=${preopenInstanceId}`
        const handledWindow = new PopupHandler({ url: finalUrl })
        handledWindow.open()

        handledWindow.once('close', () => {
          reject(new Error('user closed moonpay popup'))
        })
      }
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
        enabledPaymentMethods: 'credit_debit_card,sepa_bank_transfer,gbp_bank_transfer',
        currencyCode: currentOrder.currency.code,
        walletAddress: selectedAddress || state.selectedAddress,
        colorCode: colorCode,
        baseCurrencyAmount: currentOrder.baseCurrencyAmount,
        baseCurrencyCode: currentOrder.baseCurrency.code,
        email: state.userInfo.email !== '' ? state.userInfo.email : undefined,
        externalCustomerId: state.selectedAddress,
        redirectURL: `${config.redirect_uri}?state=${instanceState}`
      }

      const paramString = new URLSearchParams(params)
      const url = `${config.moonpayHost}?${paramString}`

      getSignature({ url: encodeURIComponent(url), token: state.jwtToken })
        .then(({ signature }) => {
          dispatch('postMoonpayOrder', { finalUrl: `${url}&signature=${encodeURIComponent(signature)}`, preopenInstanceId })
            .then(res => resolve(res))
            .catch(err => reject(err))
        })
        .catch(err => reject(new Error('unable to create moonpay tx')))
    })
  },
  postMoonpayOrder(context, { finalUrl, method = 'post', preopenInstanceId }) {
    return new Promise((resolve, reject) => {
      const moonpayWindow = new PopupHandler({ url: finalUrl, preopenInstanceId })

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
        bc.close()
        reject(new Error('user closed moonpay popup'))
      })
    })
  }
}
