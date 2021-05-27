import randomId from '@chaitanyapotti/random-id'

import config from '../../config'
import PopupHandler from '../../handlers/Popup/PopupHandler'
import PopupWithBcHandler from '../../handlers/Popup/PopupWithBcHandler'
import { getQuote, getWalletOrder } from '../../plugins/wyre'
import { WYRE } from '../../utils/enums'

export default {
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
  fetchWyreOrder({ state, dispatch }, { currentOrder, preopenInstanceId: preopenInstanceIdPayload, selectedAddress }) {
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
            provider: WYRE,
          })
        )
      )
      const parameters = {
        amount: currentOrder.sourceAmount,
        sourceCurrency: currentOrder.sourceCurrency,
        destCurrency: currentOrder.destCurrency,
        dest: `ethereum:${selectedAddress}`,
        email: state.userInfo.email,
        redirectUrl: `${config.redirect_uri}?state=${instanceState}`,
        failureRedirectUrl: `${config.redirect_uri}?state=${instanceState}`,
        referrerAccountId: config.wyreAccountId,
        referenceId: selectedAddress,
      }

      getWalletOrder(parameters, {})
        .then(({ data }) => dispatch('postWyreOrder', { finalUrl: data.url, preopenInstanceId, orderInstanceId }))
        .then(resolve)
        .catch(reject)
    })
  },
  async postWyreOrder(context, { finalUrl, preopenInstanceId, orderInstanceId }) {
    const wyreWindow = new PopupWithBcHandler({ preopenInstanceId, url: finalUrl, channelName: `redirect_channel_${orderInstanceId}` })
    await wyreWindow.handle()
    return { success: true }
  },
}
