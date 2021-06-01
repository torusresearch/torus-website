import randomId from '@chaitanyapotti/random-id'
import { BroadcastChannel } from 'broadcast-channel'
import log from 'loglevel'

import config from '../../config'
import PopupHandler from '../../handlers/Popup/PopupHandler'
import { getQuote } from '../../plugins/mercuryo'
import torus from '../../torus'
import { MERCURYO } from '../../utils/enums'
import { broadcastChannelOptions } from '../../utils/utils'

export default {
  fetchMercuryoQuote({ state }, payload) {
    // returns a promise
    return getQuote(
      {
        digital_currency: payload.selectedCryptoCurrency && payload.selectedCryptoCurrency.toUpperCase(),
        fiat_currency: payload.selectedCurrency && payload.selectedCurrency.toUpperCase(),
        requested_amount: +Number.parseFloat(payload.fiatValue),
      },
      { Authorization: `Bearer ${state.jwtToken[state.selectedAddress]}` }
    )
  },
  fetchMercuryoOrder({ state, dispatch }, { currentOrder, preopenInstanceId: preopenInstanceIdPayload, selectedAddress }) {
    return new Promise((resolve, reject) => {
      const preopenInstanceId = preopenInstanceIdPayload
      // if (!preopenInstanceId) {
      //   preopenInstanceId = randomId()
      //   const finalUrl = `${config.redirect_uri}?preopenInstanceId=${preopenInstanceId}`
      //   const handledWindow = new PopupHandler({ url: finalUrl })
      //   handledWindow.open()

      //   handledWindow.once('close', () => {
      //     reject(new Error('user closed mercuryo popup'))
      //   })
      // }
      const instanceState = encodeURIComponent(
        window.btoa(
          JSON.stringify({
            instanceId: torus.instanceId,
            provider: MERCURYO,
          })
        )
      )
      const parameters = {
        widget_id: config.mercuryoLiveAPIKEY,
        type: 'buy',
        amount: currentOrder.amount,
        currency: currentOrder.currency,
        fiat_amount: currentOrder.fiat_amount,
        fiat_currency: currentOrder.fiat_currency,
        address: selectedAddress,
        email: state.userInfo.email || undefined,
        return_url: `${config.redirect_uri}?state=${instanceState}`,
        merchant_transaction_id: randomId(),
      }

      const parameterString = new URLSearchParams(JSON.parse(JSON.stringify(parameters)))
      const url = `${config.mercuryoHost}?${parameterString.toString()}`

      // if (selectedAddress) {
      //   getSignature({ address: selectedAddress })
      //     .then(({ signature }) =>
      //       dispatch('postMercuryoOrder', { finalUrl: `${url}&signature=${encodeURIComponent(signature)}`, preopenInstanceId })
      //     )
      //     .then(resolve)
      //     .catch(reject)
      // } else {
      dispatch('postMercuryoOrder', { finalUrl: `${url}`, preopenInstanceId })
        .then(resolve)
        .catch(reject)
      // }
    })
  },
  postMercuryoOrder(context, { finalUrl, preopenInstanceId }) {
    return new Promise((resolve, reject) => {
      const mercuryoWindow = new PopupHandler({ url: finalUrl, preopenInstanceId })

      const bc = new BroadcastChannel(`redirect_channel_${torus.instanceId}`, broadcastChannelOptions)
      bc.addEventListener('message', (ev) => {
        try {
          const {
            instanceParams: { provider },
          } = ev.data || {}
          if (ev.error && ev.error !== '') {
            log.error(ev.error)
            reject(new Error(ev.error))
          } else if (provider === MERCURYO) {
            resolve({ success: true })
          }
        } catch (error) {
          reject(error)
        } finally {
          bc.close()
          mercuryoWindow.close()
        }
      })

      // Handle communication with moonpay window here
      mercuryoWindow.open()
      mercuryoWindow.once('close', () => {
        bc.close()
        reject(new Error('user closed mercuryo popup'))
      })
    })
  },
}
