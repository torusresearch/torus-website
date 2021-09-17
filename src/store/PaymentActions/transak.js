import randomId from '@chaitanyapotti/random-id'

import config from '../../config'
import PopupHandler from '../../handlers/Popup/PopupHandler'
import PopupWithBcHandler from '../../handlers/Popup/PopupWithBcHandler'
import { getQuote, getSignature } from '../../plugins/transak'
import { TRANSAK } from '../../utils/enums'

export default {
  fetchTransakQuote(context, payload) {
    // returns a promise
    return getQuote({
      digital_currency: payload.selectedCryptoCurrency && payload.selectedCryptoCurrency.toLowerCase(),
      fiat_currency: payload.selectedCurrency && payload.selectedCurrency.toLowerCase(),
      requested_amount: +Number.parseFloat(payload.fiatValue),
    })
  },
  fetchTransakOrder({ state, dispatch }, { currentOrder, colorCode, preopenInstanceId: preopenInstanceIdPayload, selectedAddress }) {
    return new Promise((resolve, reject) => {
      let preopenInstanceId = preopenInstanceIdPayload
      if (!preopenInstanceId) {
        preopenInstanceId = randomId()
        const finalUrl = `${config.redirect_uri}?preopenInstanceId=${preopenInstanceId}`
        const handledWindow = new PopupHandler({ url: finalUrl })
        handledWindow.open()
        handledWindow.once('close', () => {
          reject(new Error('user closed Transak popup'))
        })
      }
      const orderInstanceId = randomId()
      const instanceState = encodeURIComponent(
        window.btoa(
          JSON.stringify({
            instanceId: orderInstanceId,
            provider: TRANSAK,
          })
        )
      )
      const parameters = {
        apiKey: config.transakLiveAPIKEY,
        hostURL: config.baseUrl,
        cryptoCurrencyCode: currentOrder.cryptoCurrency || undefined,
        walletAddress: selectedAddress,
        themeColor: colorCode,
        fiatAmount: currentOrder.fiatAmount || undefined,
        fiatCurrency: currentOrder.fiatCurrency || undefined,
        email: state.userInfo.email || undefined,
        partnerCustomerId: selectedAddress || state.selectedAddress,
        redirectURL: `${config.redirect_uri}?state=${instanceState}`,
      }
      const parameterString = new URLSearchParams(JSON.parse(JSON.stringify(parameters)))
      // const url = `${config.transakHost}?${parameterString.toString()}`
      const url = `${config.transakTestHost}?${parameterString.toString()}`

      getSignature({ url: encodeURIComponent(url) })
        .then(({ signature }) =>
          dispatch('postTransakOrder', { finalUrl: `${url}&signature=${encodeURIComponent(signature)}`, preopenInstanceId, orderInstanceId })
        )
        .then((response) => resolve(response))
        .catch((error) => reject(error))
    })
  },
  async postTransakOrder(_, { finalUrl, preopenInstanceId, orderInstanceId }) {
    const transakWindow = new PopupWithBcHandler({ url: finalUrl, preopenInstanceId, channelName: `redirect_channel_${orderInstanceId}` })
    const result = await transakWindow.handle()
    const { queryParams: { transactionStatus = '' } = {} } = result
    if (transactionStatus !== 'failed') return { success: true }
    throw new Error('Payment Failed')
  },
}
