import randomId from '@chaitanyapotti/random-id'
import log from 'loglevel'

import config from '../../config'
import PopupHandler from '../../handlers/Popup/PopupHandler'
import PopupWithBcHandler from '../../handlers/Popup/PopupWithBcHandler'
import { getQuote, getWalletOrder } from '../../plugins/banxa'
import { BANXA, ETH } from '../../utils/enums'
import { paymentProviders } from '../../utils/utils'

export default {
  fetchBanxaQuote({ state }, payload) {
    // returns a promise
    return getQuote(
      {
        target: (payload.selectedCryptoCurrency || ETH).toUpperCase(),
        source: (payload.selectedCurrency || paymentProviders.rampnetwork.validCurrencies[0]).toUpperCase(),
        source_amount: +Number.parseFloat(payload.fiatValue || paymentProviders.rampnetwork.minOrderValue),
      },
      { Authorization: `Bearer ${state.jwtToken[state.selectedAddress]}` }
    )
  },
  fetchBanxaOrder({ dispatch }, { currentOrder, preopenInstanceId: preopenInstanceIdPayload, selectedAddress }) {
    return new Promise((resolve, reject) => {
      const orderInstanceId = randomId()
      let preopenInstanceId = preopenInstanceIdPayload
      if (!preopenInstanceId) {
        preopenInstanceId = randomId()
        const finalUrl = `${config.redirect_uri}?preopenInstanceId=${preopenInstanceId}`
        const handledWindow = new PopupHandler({ url: finalUrl })
        handledWindow.open()

        handledWindow.once('close', () => {
          reject(new Error('user closed wyre popup'))
        })
      }
      const instanceState = encodeURIComponent(
        window.btoa(
          JSON.stringify({
            instanceId: orderInstanceId,
            provider: BANXA,
          })
        )
      )
      const parameters = {
        account_reference: selectedAddress,
        source: currentOrder.fiat_code,
        source_amount: currentOrder.fiat_amount,
        target: currentOrder.coin_code,
        wallet_address: selectedAddress,
        return_url_on_success: `${config.redirect_uri}?state=${instanceState}`,
      }

      getWalletOrder(parameters, {})
        .then(({ data }) => {
          log.info('fetchBanxa', JSON.stringify(data))
          return dispatch('postBanxaOrder', { finalUrl: data.checkout_url, preopenInstanceId, orderInstanceId })
        })
        .then(resolve)
        .catch(reject)
    })
  },
  async postBanxaOrder(context, { finalUrl, preopenInstanceId, orderInstanceId }) {
    log.info('postBanxa', JSON.stringify({ finalUrl, preopenInstanceId, orderInstanceId }))
    const banxaWindow = new PopupWithBcHandler({ preopenInstanceId, url: finalUrl, channelName: `redirect_channel_${orderInstanceId}` })
    await banxaWindow.handle()
    return { success: true }
  },
}
