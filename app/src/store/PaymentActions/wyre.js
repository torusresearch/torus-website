import { getQuote } from '../../plugins/wyre'
import config from '../../config'

export default {
  fetchWyreQuote({ state }, payload) {
    // returns a promise
    // Need to add validations here
    return getQuote(
      {
        source_amount: +parseFloat(payload.fiatValue),
        source_currency: payload.selectedCurrency,
        dest_currency: payload.selectedCryptoCurrency
      },
      {
        Authorization: `Bearer ${state.jwtToken}`
      }
    )
  },
  fetchWyreOrder({ state, dispatch }, { currentOrder }) {
    const params = {
      destCurrency: currentOrder.destCurrency,
      sourceAmount: currentOrder.sourceAmount,
      redirectUrl: config.payment_redirect_uri,
      dest: `ethereum:${state.selectedAddress}`,
      accountId: config.wyreAccountId,
      referenceId: state.selectedAddress
    }
    dispatch('postWyreOrder', { path: config.wyreHost, params: params })
  },
  postWyreOrder(context, { path, params, method = 'post' }) {
    // Do different things based on origin of request
    const paramString = new URLSearchParams(params)
    const finalUrl = `${path}?${paramString}`
    // Handle communication with moonpay window here
    var wyreWindow = window.open(finalUrl, '_blank', 'directories=0,titlebar=0,toolbar=0,status=0,location=0,menubar=0,height=700,width=1200')
  }
}
