import { BroadcastChannel } from 'broadcast-channel'
import log from 'loglevel'

import config from '../../config'
import { getQuote, getSignature } from '../../plugins/moonpay'
import torus from '../../torus'
import { MOONPAY } from '../../utils/enums'
import PopupHandler from '../../utils/PopupHandler'
import { broadcastChannelOptions } from '../../utils/utils'

const randomId = require('@chaitanyapotti/random-id')

export default {
  fetchMoonpayQuote(context, payload) {
    // returns a promise
    return getQuote({
      digital_currency: payload.selectedCryptoCurrency && payload.selectedCryptoCurrency.toLowerCase(),
      fiat_currency: payload.selectedCurrency && payload.selectedCurrency.toLowerCase(),
      requested_amount: +parseFloat(payload.fiatValue),
    })
  },
  fetchMoonpayOrder({ state, dispatch }, { currentOrder, colorCode, preopenInstanceId: preopenInstanceIdPayload, selectedAddress }) {
    return new Promise((resolve, reject) => {
      let preopenInstanceId = preopenInstanceIdPayload
      if (!preopenInstanceId) {
        preopenInstanceId = randomId()
        const finalUrl = `${config.baseUrl}/redirect?preopenInstanceId=${preopenInstanceId}`
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
            provider: MOONPAY,
          })
        )
      )
      const parameters = {
        apiKey: config.moonpayLiveAPIKEY,
        enabledPaymentMethods: 'credit_debit_card,sepa_bank_transfer,gbp_bank_transfer',
        defaultCurrencyCode: currentOrder.currency.code || undefined,
        walletAddresses: selectedAddress ? JSON.stringify({ eth: selectedAddress }) : undefined,
        colorCode,
        baseCurrencyAmount: currentOrder.baseCurrencyAmount || undefined,
        baseCurrencyCode: currentOrder.baseCurrency.code || undefined,
        email: state.userInfo.email || undefined,
        externalCustomerId: selectedAddress || state.selectedAddress,
        redirectURL: `${config.redirect_uri}?state=${instanceState}`,
        showWalletAddressForm: true,
      }

      const parameterString = new URLSearchParams(JSON.parse(JSON.stringify(parameters)))
      const url = `${config.moonpayHost}?${parameterString.toString()}`

      getSignature({ url: encodeURIComponent(url) })
        .then(({ signature }) => dispatch('postMoonpayOrder', { finalUrl: `${url}&signature=${encodeURIComponent(signature)}`, preopenInstanceId }))
        .then((response) => resolve(response))
        .catch((error) => reject(error))
    })
  },
  postMoonpayOrder(context, { finalUrl, preopenInstanceId }) {
    return new Promise((resolve, reject) => {
      const moonpayWindow = new PopupHandler({ url: finalUrl, preopenInstanceId })

      const bc = new BroadcastChannel(`redirect_channel_${torus.instanceId}`, broadcastChannelOptions)
      bc.addEventListener('message', (ev) => {
        try {
          const {
            instanceParams: { provider },
            queryParams: { transactionStatus = '' } = {},
          } = ev.data || {}
          if (ev.error && ev.error !== '') {
            log.error(ev.error)
            reject(new Error(ev.error))
          } else if (provider === MOONPAY && transactionStatus !== 'failed') {
            resolve({ success: true })
          } else if (provider === MOONPAY && transactionStatus === 'failed') {
            reject(new Error('Payment Failed'))
          }
        } catch (error) {
          reject(error)
        } finally {
          bc.close()
          moonpayWindow.close()
        }
      })

      // Handle communication with moonpay window here
      moonpayWindow.open()
      moonpayWindow.once('close', () => {
        bc.close()
        reject(new Error('user closed moonpay popup'))
      })
    })
  },
}
