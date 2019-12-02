import log from 'loglevel'
import { postQuote, postOrder } from '../../plugins/simplex'
import config from '../../config'
import { broadcastChannelOptions } from '../../utils/utils'
import PopupHandler from '../../utils/PopupHandler'
import { SIMPLEX } from '../../utils/enums'
import { BroadcastChannel } from 'broadcast-channel'
import torus from '../../torus'

export default {
  fetchSimplexQuote({ state }, payload) {
    // returns a promise
    return postQuote(
      {
        digital_currency: payload.selectedCryptoCurrency,
        fiat_currency: payload.selectedCurrency,
        requested_currency: payload.selectedCurrency,
        requested_amount: +parseFloat(payload.fiatValue)
      },
      {
        Authorization: `Bearer ${state.jwtToken}`
      }
    )
  },
  fetchSimplexOrder({ state, dispatch }, payload) {
    const instanceState = encodeURIComponent(
      window.btoa(
        JSON.stringify({
          instanceId: torus.instanceId,
          provider: SIMPLEX
        })
      )
    )
    return postOrder(
      {
        'g-recaptcha-response': '',
        account_details: {
          app_end_user_id: payload.currentOrder.user_id
        },
        return_url: `${config.redirect_uri}?state=${instanceState}`,
        transaction_details: {
          payment_details: {
            fiat_total_amount: {
              currency: payload.currentOrder.fiat_money.currency,
              amount: payload.currentOrder.fiat_money.total_amount
            },
            requested_digital_amount: {
              currency: payload.currentOrder.digital_money.currency,
              amount: payload.currentOrder.digital_money.amount
            },
            destination_wallet: {
              currency: payload.currentOrder.digital_money.currency,
              address: state.selectedAddress
            }
          }
        }
      },
      {
        Authorization: `Bearer ${state.jwtToken}`
      }
    ).then(result => {
      const {
        version,
        partner,
        return_url,
        quote_id,
        payment_id,
        user_id,
        destination_wallet_address,
        destination_wallet_currency,
        fiat_total_amount_amount,
        fiat_total_amount_currency,
        digital_total_amount_amount,
        digital_total_amount_currency,
        payment_post_url
      } = result.result
      return dispatch('postSimplexOrder', {
        path: payment_post_url,
        params: {
          payment_flow_type: 'wallet',
          version,
          partner,
          return_url,
          quote_id,
          payment_id,
          user_id,
          'destination_wallet[address]': destination_wallet_address,
          'destination_wallet[currency]': destination_wallet_currency,
          'fiat_total_amount[amount]': fiat_total_amount_amount,
          'fiat_total_amount[currency]': fiat_total_amount_currency,
          'digital_total_amount[amount]': digital_total_amount_amount,
          'digital_total_amount[currency]': digital_total_amount_currency
        }
      })
    })
  },
  postSimplexOrder(context, { path, params, method = 'post' }) {
    return new Promise((resolve, reject) => {
      const form = document.createElement('form')
      form.method = method
      form.action = path
      form.target = 'form-target'
      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          const hiddenField = document.createElement('input')
          hiddenField.type = 'hidden'
          hiddenField.name = key
          hiddenField.value = params[key]
          form.appendChild(hiddenField)
        }
      }
      document.body.appendChild(form)
      // Handle communication with simplex window here

      const simplexWindow = new PopupHandler('about:blank', 'form-target', 'width=1200, height=700')

      const bc = new BroadcastChannel(`redirect_channel_${torus.instanceId}`, broadcastChannelOptions)

      bc.onmessage = ev => {
        try {
          const {
            instanceParams: { provider }
          } = ev.data || {}
          if (ev.error && ev.error !== '') {
            log.error(ev.error)
            reject(new Error(ev.error))
          } else if (ev.data && provider === SIMPLEX) {
            resolve({ success: true })
          }
        } catch (error) {
          reject(error)
        } finally {
          bc.close()
          simplexWindow.close()
        }
      }
      simplexWindow.open()
      form.submit()

      simplexWindow.once('close', () => {
        reject(new Error('user closed simplex popup'))
      })
    })
  }
}
