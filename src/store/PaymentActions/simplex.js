import randomId from '@chaitanyapotti/random-id'

import config from '../../config'
import PopupHandler from '../../handlers/Popup/PopupHandler'
import PopupWithBcHandler from '../../handlers/Popup/PopupWithBcHandler'
import { postOrder, postQuote } from '../../plugins/simplex'
import { SIMPLEX } from '../../utils/enums'

export default {
  fetchSimplexQuote({ state }, payload) {
    // returns a promise
    return postQuote(
      {
        digital_currency: payload.selectedCryptoCurrency,
        fiat_currency: payload.selectedCurrency,
        requested_currency: payload.selectedCurrency,
        requested_amount: +Number.parseFloat(payload.fiatValue),
      },
      {
        Authorization: `Bearer ${state.jwtToken[state.selectedAddress]}`,
      }
    )
  },
  fetchSimplexOrder({ state, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      let { preopenInstanceId } = payload
      if (!preopenInstanceId) {
        preopenInstanceId = randomId()
        const finalUrl = `${config.redirect_uri}?preopenInstanceId=${preopenInstanceId}`
        const handledWindow = new PopupHandler({ url: finalUrl, target: 'form-target' })
        handledWindow.open()
        handledWindow.once('close', () => {
          reject(new Error('user closed simplex popup'))
        })
      }
      const orderInstanceId = randomId()
      const instanceState = encodeURIComponent(
        window.btoa(
          JSON.stringify({
            instanceId: orderInstanceId,
            provider: SIMPLEX,
          })
        )
      )
      postOrder(
        {
          'g-recaptcha-response': '',
          account_details: {
            app_end_user_id: payload.currentOrder.user_id,
          },
          return_url: `${config.redirect_uri}?state=${instanceState}`,
          transaction_details: {
            payment_details: {
              fiat_total_amount: {
                currency: payload.currentOrder.fiat_money.currency,
                amount: payload.currentOrder.fiat_money.total_amount,
              },
              requested_digital_amount: {
                currency: payload.currentOrder.digital_money.currency,
                amount: payload.currentOrder.digital_money.amount,
              },
              destination_wallet: {
                currency: payload.currentOrder.digital_money.currency,
                address: payload.selectedAddress || state.selectedAddress,
              },
            },
          },
        },
        {
          Authorization: `Bearer ${state.jwtToken[state.selectedAddress]}`,
        }
      )
        .then((result) => {
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
            payment_post_url,
          } = result.result
          return dispatch('postSimplexOrder', {
            preopenInstanceId,
            orderInstanceId,
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
              'digital_total_amount[currency]': digital_total_amount_currency,
            },
          })
        })
        .then((response) => resolve(response))
        .catch((error) => reject(error))
    })
  },
  async postSimplexOrder(_, { path, params, method = 'post', preopenInstanceId, orderInstanceId }) {
    const form = document.createElement('form')
    form.method = method
    form.action = path
    form.target = 'form-target'
    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        const hiddenField = document.createElement('input')
        hiddenField.type = 'hidden'
        hiddenField.name = key
        hiddenField.value = params[key]
        form.append(hiddenField)
      }
    }
    document.body.append(form)
    // Handle communication with simplex window here

    const simplexWindow = new PopupWithBcHandler({
      url: 'about:blank',
      target: 'form-target',
      preopenInstanceId,
      channelName: `redirect_channel_${orderInstanceId}`,
    })
    setTimeout(() => {
      form.submit()
    }, 2000)
    await simplexWindow.handle()
    return { success: true }
  },
}
