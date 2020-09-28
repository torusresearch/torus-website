import randomId from '@chaitanyapotti/random-id'

import config from '../../config'
import PopupWithBcHandler from '../../handlers/Popup/PopupWithBcHandler'
import getQuote from '../../plugins/wyre'
import { WYRE } from '../../utils/enums'

const Wyre = {
  fetchWyreOrder({ state, dispatch }, { currentOrder, preopenInstanceId, selectedAddress }) {
    const orderInstanceId = randomId()
    const instanceState = encodeURIComponent(window.btoa(JSON.stringify({ instanceId: orderInstanceId, provider: WYRE })))
    const parameters = {
      accountId: config.wyreAccountId,
      dest: selectedAddress ? `ethereum:${selectedAddress}` : undefined,
      destCurrency: currentOrder.destCurrency || undefined,
      redirectUrl: `${config.redirect_uri}?state=${instanceState}`,
      referenceId: selectedAddress || state.selectedAddress,
      sourceAmount: currentOrder.sourceAmount || undefined,
      failureRedirectUrl: `${config.redirect_uri}?state=${instanceState}&error=payment_failed`,
    }

    return dispatch('postWyreOrder', { params: parameters, path: config.wyreHost, preopenInstanceId, orderInstanceId })
  },
  fetchWyreQuote({ state }, payload) {
    // returns a promise
    return getQuote(
      {
        dest_currency: payload.selectedCryptoCurrency,
        source_amount: +Number.parseFloat(payload.fiatValue),
        source_currency: payload.selectedCurrency,
      },
      { Authorization: `Bearer ${state.jwtToken[state.selectedAddress]}` }
    )
  },
  async postWyreOrder(_, { path, params, preopenInstanceId, orderInstanceId }) {
    const parameterString = new URLSearchParams(JSON.parse(JSON.stringify(params)))
    const finalUrl = `${path}?${parameterString.toString()}`
    const wyreWindow = new PopupWithBcHandler({ preopenInstanceId, url: finalUrl, channelName: `redirect_channel_${orderInstanceId}` })
    await wyreWindow.handle()
    return { success: true }
  },
}

export default Wyre
