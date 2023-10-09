import config from '../../config'
import PopupHandler from '../../handlers/Popup/PopupHandler'
import PopupWithBcHandler from '../../handlers/Popup/PopupWithBcHandler'
import apis from '../../plugins/transak'
import { TRANSAK } from '../../utils/enums'
import { getTimeout, randomId } from '../../utils/utils'

export default {
  fetchTransakQuote(context, payload) {
    // returns a promise
    return apis.getQuote({
      digital_currency: payload.selectedCryptoCurrency && payload.selectedCryptoCurrency.toLowerCase(),
      fiat_currency: payload.selectedCurrency && payload.selectedCurrency.toLowerCase(),
      requested_amount: +Number.parseFloat(payload.fiatValue),
      network: payload.network,
    })
  },
  fetchTransakOrder({ state, dispatch }, { currentOrder, colorCode, preopenInstanceId: preopenInstanceIdPayload, selectedAddress, network }) {
    return new Promise((resolve, reject) => {
      let preopenInstanceId = preopenInstanceIdPayload
      if (!preopenInstanceId) {
        preopenInstanceId = randomId()
        const finalUrl = `${config.redirect_uri}?preopenInstanceId=${preopenInstanceId}`
        const handledWindow = new PopupHandler({ url: finalUrl, timeout: getTimeout({ isPaymentTx: true }) })
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
        // environment: 'STAGING',
        apiKey: config.transakLiveAPIKEY,
        hostURL: config.baseUrl,
        defaultCryptoCurrency: currentOrder.cryptoCurrency || undefined,
        walletAddress: selectedAddress,
        themeColor: colorCode,
        defaultFiatAmount: currentOrder.fiatAmount || undefined,
        fiatCurrency: currentOrder.fiatCurrency || undefined,
        email: state.userInfo.email || undefined,
        partnerCustomerId: selectedAddress || state.selectedAddress,
        redirectURL: `${config.redirect_uri}?state=${instanceState}`,
        network,
      }
      const parameterString = new URLSearchParams(JSON.parse(JSON.stringify(parameters)))
      const url = `${config.transakHost}?${parameterString.toString()}`
      // const url = `${config.transakTestHost}?${parameterString.toString()}`

      dispatch('postTransakOrder', { finalUrl: url, preopenInstanceId, orderInstanceId }).then(resolve).catch(reject)
    })
  },
  async postTransakOrder(_, { finalUrl, preopenInstanceId, orderInstanceId }) {
    const transakWindow = new PopupWithBcHandler({
      url: finalUrl,
      preopenInstanceId,
      channelName: `redirect_channel_${orderInstanceId}`,
      timeout: getTimeout({ isPaymentTx: true }),
    })
    const result = await transakWindow.handle()
    const { queryParams: { transactionStatus = '' } = {} } = result
    if (transactionStatus !== 'failed') return { success: true }
    throw new Error('Payment Failed')
  },
}
