import { postQuote, postOrder } from '../plugins/simplex'

export default {
  fetchSimplexQuote(context, payload) {
    // returns a promise
    // Need to add validations here
    return postQuote({
      digital_currency: 'ETH',
      fiat_currency: payload.selectedCurrency,
      requested_currency: payload.selectedCurrency,
      requested_amount: +parseFloat(payload.fiatValue)
    })
  },
  fetchSimplexOrder({ state, dispatch }, payload) {
    postOrder({
      'g-recaptcha-response': '',
      account_details: {
        app_end_user_id: payload.currentOrder.user_id
      },
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
    }).then(result => {
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
      dispatch('postSimplexOrder', {
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
    // Do different things based on origin of request
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
    var simplexWindow = window.open('about:blank', 'form-target', 'width=1200, height=700')
    form.submit()
  }
}
