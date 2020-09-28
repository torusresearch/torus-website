import randomId from '@chaitanyapotti/random-id'

import config from '../../config'
import PopupWithBcHandler from '../../handlers/Popup/PopupWithBcHandler'
import getQuote from '../../plugins/xanpool'
import { XANPOOL } from '../../utils/enums'

export default {
  fetchXanpoolQuote(context, payload) {
    // returns a promise
    return getQuote({
      type: payload.type || 'buy',
      cryptoCurrency: payload.selectedCryptoCurrency,
      currency: payload.selectedCurrency,
      fiat: +Number.parseFloat(payload.fiatValue),
    })
  },
  fetchXanpoolOrder({ state, dispatch }, { currentOrder, preopenInstanceId, selectedAddress }) {
    const orderInstanceId = randomId()
    const instanceState = encodeURIComponent(window.btoa(JSON.stringify({ instanceId: orderInstanceId, provider: XANPOOL })))
    const parameters = {
      apiKey: config.xanpoolLiveAPIKEY,
      wallet: selectedAddress || undefined,
      fiat: currentOrder.fiatValue || undefined,
      cryptoCurrency: currentOrder.selectedCryptoCurrency || undefined,
      currency: currentOrder.selectedCurrency || undefined,
      partnerData: selectedAddress || state.selectedAddress,
      redirectUrl: `${config.redirect_uri}?state=${instanceState}`,
    }

    return dispatch('postXanpoolOrder', { params: parameters, path: config.xanpoolHost, preopenInstanceId, orderInstanceId })
  },
  async postXanpoolOrder(_, { path, params, preopenInstanceId, orderInstanceId }) {
    const parameterString = new URLSearchParams(JSON.parse(JSON.stringify(params)))
    const finalUrl = `${path}?${parameterString.toString()}`
    const xanpoolWindow = new PopupWithBcHandler({ preopenInstanceId, url: finalUrl, channelName: `redirect_channel_${orderInstanceId}` })
    await xanpoolWindow.handle()
    return { success: true }
  },
}
