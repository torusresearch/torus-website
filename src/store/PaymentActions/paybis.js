import config from '../../config'
import PopupHandler from '../../handlers/Popup/PopupHandler'
import PopupWithBcHandler from '../../handlers/Popup/PopupWithBcHandler'
import { getQuote, getWalletOrder, saveWalletOrder } from '../../plugins/paybis'
import { ETH } from '../../utils/enums'
import { paymentProviders, randomId } from '../../utils/utils'

export default {
  fetchPaybisQuote({ state }, payload) {
    // returns a promise
    return getQuote(
      {
        dest_currency: (payload.selectedCryptoCurrency || ETH).toUpperCase(),
        source_currency: (payload.selectedCurrency || paymentProviders.rampnetwork.validCurrencies[0]).toUpperCase(),
        source_amount: +Number.parseFloat(payload.fiatValue || paymentProviders.rampnetwork.minOrderValue),
      },
      { Authorization: `Bearer ${state.jwtToken[state.selectedAddress]}` }
    )
  },
  fetchPaybisOrder({ dispatch, state }, { currentOrder, preopenInstanceId: preopenInstanceIdPayload, selectedAddress }) {
    return new Promise((resolve, reject) => {
      const parameters = {
        target: currentOrder.target,
        wallet_address: selectedAddress,
        quote_id: currentOrder.quoteId,
      }

      getWalletOrder(parameters, { Authorization: `Bearer ${state.jwtToken[state.selectedAddress]}` })
        .then(({ data }) => {
          // https://widget.sandbox.paybis.com/?requestId=a2d1153b-4588-44ae-882d-8120b59fe13a#/v2/exchange-form

          let preopenInstanceId = preopenInstanceIdPayload
          if (!preopenInstanceId) {
            preopenInstanceId = randomId()
            const finalUrl = `${config.redirect_uri}?preopenInstanceId=${preopenInstanceId}`
            const handledWindow = new PopupHandler({ url: finalUrl })
            handledWindow.open()
            handledWindow.once('close', () => {
              reject(new Error('user closed Paybis popup'))
            })
          }

          const orderInstanceId = randomId()
          const url = `https://widget.sandbox.paybis.com/?requestId=${data.requestId}#/v2/exchange-form`

          dispatch('postPaybisOrder', { finalUrl: url, preopenInstanceId, orderInstanceId }).then(resolve).catch(reject)

          // window.PartnerExchangeWidget.open({
          //   requestId: data.requestId,
          // })
          // window.PartnerExchangeWidget.events.onclosed = () => {
          //   // eslint-disable-next-line no-console
          //   console.log('PartnerExchangeWidget.state', window.PartnerExchangeWidget.state)
          //   if (window.PartnerExchangeWidget.state === 'completed') {
          //     // Save to backend
          //     const orderParams = {
          //       paybis_id: data.requestId,
          //       wallet_address: selectedAddress,
          //       fiat_currency: currentOrder.from,
          //       crypto_currency: currentOrder.target,
          //       fiat_amount: currentOrder.fiatAmount,
          //       crypto_amount: currentOrder.targetAmount,
          //     }
          //     dispatch('postPaybisOrder', { orderParams })
          //     resolve({ success: true })
          //   } else {
          //     reject(new Error('user closed paybis popup'))
          //   }
          // }
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  async postPaybisOrder(_, { finalUrl, preopenInstanceId, orderInstanceId }) {
    const paybisWindow = new PopupWithBcHandler({ url: finalUrl, preopenInstanceId, channelName: `redirect_channel_${orderInstanceId}` })
    const result = await paybisWindow.handle()
    // const { queryParams: { transactionStatus = '' } = {} } = result
    // eslint-disable-next-line no-console
    console.log('result', result)
  },
  savePaybisOrder({ state }, { orderParams }) {
    saveWalletOrder(orderParams, { Authorization: `Bearer ${state.jwtToken[state.selectedAddress]}` })
  },
}
