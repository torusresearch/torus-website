import { getQuote } from '../../plugins/moonpay'
import config from '../../config'

export default {
  fetchMoonpayQuote(context, payload) {
    // returns a promise
    // Need to add validations here
    return getQuote({
      digital_currency: payload.selectedCryptoCurrency.toLowerCase(),
      fiat_currency: payload.selectedCurrency.toLowerCase(),
      requested_amount: +parseFloat(payload.fiatValue)
    })
  },
  fetchMoonpayOrder({ state, dispatch }, { currentOrder, colorCode }) {
    const params = {
      apiKey: config.moonpayLiveAPIKEY,
      currencyCode: currentOrder.currency.code,
      walletAddress: state.selectedAddress,
      colorCode: colorCode,
      baseCurrencyAmount: currentOrder.baseCurrencyAmount,
      baseCurrencyCode: currentOrder.baseCurrency.code,
      email: state.userInfo.email !== '' ? state.userInfo.email : undefined,
      externalCustomerId: state.selectedAddress,
      redirectURL: config.payment_redirect_uri
    }
    dispatch('postMoonpayOrder', { path: config.moonpayHost, params: params })
  },
  postMoonpayOrder(context, { path, params, method = 'post' }) {
    // Do different things based on origin of request
    const paramString = new URLSearchParams(params)
    const finalUrl = `${path}?${paramString}`
    // Handle communication with moonpay window here
    var moonpayWindow = window.open(finalUrl, '_blank', 'directories=0,titlebar=0,toolbar=0,status=0,location=0,menubar=0,height=700,width=1200')
  }
}
