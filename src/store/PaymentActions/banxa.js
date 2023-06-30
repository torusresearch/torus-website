import config from '../../config'
import PopupHandler from '../../handlers/Popup/PopupHandler'
import PopupWithBcHandler from '../../handlers/Popup/PopupWithBcHandler'
import { getQuote, getWalletOrder } from '../../plugins/banxa'
import { BANXA, ETH } from '../../utils/enums'
import { paymentProviders, randomId } from '../../utils/utils'

export default {
  fetchBanxaQuote({ state }, payload) {
    // returns a promise
    return getQuote(
      {
        dest_currency: (payload.selectedCryptoCurrency || ETH).toUpperCase(),
        source_currency: (payload.selectedCurrency || paymentProviders.rampnetwork.validCurrencies[0]).toUpperCase(),
        source_amount: +Number.parseFloat(payload.fiatValue || paymentProviders.rampnetwork.minOrderValue),
        blockchain: payload.blockchain,
      },
      { Authorization: `Bearer ${state.jwtToken[state.selectedAddress]}` }
    )
  },
  fetchBanxaOrder({ dispatch }, { currentOrder, preopenInstanceId: preopenInstanceIdPayload, selectedAddress, blockchain }) {
    return new Promise((resolve, reject) => {
      const orderInstanceId = randomId()
      let preopenInstanceId = preopenInstanceIdPayload
      if (!preopenInstanceId) {
        preopenInstanceId = randomId()
        const finalUrl = `${config.redirect_uri}?preopenInstanceId=${preopenInstanceId}`
        const handledWindow = new PopupHandler({ url: finalUrl })
        handledWindow.open()

        handledWindow.once('close', () => {
          reject(new Error('user closed banxa popup'))
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
        source_amount: currentOrder.fiat_amount || undefined,
        target: currentOrder.coin_code,
        wallet_address: selectedAddress,
        return_url_on_success: `${config.redirect_uri}?state=${instanceState}`,
        blockchain,
      }

      getWalletOrder(parameters, {})
        .then(({ data }) => dispatch('postBanxaOrder', { finalUrl: data.checkout_url, preopenInstanceId, orderInstanceId }))
        .then(resolve)
        .catch(reject)
    })
  },
  async postBanxaOrder(_, { finalUrl, preopenInstanceId, orderInstanceId }) {
    const banxaWindow = new PopupWithBcHandler({ preopenInstanceId, url: finalUrl, channelName: `redirect_channel_${orderInstanceId}` })
    await banxaWindow.handle()
    return { success: true }
  },
}
