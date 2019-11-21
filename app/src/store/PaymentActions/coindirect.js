import { postQuote } from '../../plugins/coindirect'
import config from '../../config'

export default {
  fetchCoindirectQuote({ state }, payload) {
    // returns a promise
    // Need to add validations here
    return postQuote({
      from: payload.selectedCurrency,
      to: payload.selectedCryptoCurrency,
      payInMethod: 'card',
      payOutMethod: 'crypto',
      merchantId: config.coindirectLiveMerchantID,
      amountIn: +parseFloat(payload.fiatValue),
      payOutInstruction: {
        code: 'crypto',
        address: state.selectedAddress
      }
    })
  },
  fetchCoindirectOrder({ state, dispatch }, { currentOrder }) {
    const params = {
      merchantId: config.coindirectLiveMerchantID,
      to: currentOrder.to,
      address: state.selectedAddress,
      url: encodeURIComponent(config.payment_redirect_uri)
    }
    dispatch('postCoindirectOrder', { path: config.coindirectLiveHost, params: params })
  },
  postCoindirectOrder(context, { path, params, method = 'post' }) {
    // Do different things based on origin of request
    const paramString = new URLSearchParams(params)
    const finalUrl = `${path}?${paramString}`
    // Handle communication with coindirect window here
    var wyreWindow = window.open(finalUrl, '_blank', 'directories=0,titlebar=0,toolbar=0,status=0,location=0,menubar=0,height=700,width=1200')
  }
}
