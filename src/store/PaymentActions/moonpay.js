import randomId from '@chaitanyapotti/random-id'

import config from '../../config'
import PopupHandler from '../../handlers/Popup/PopupHandler'
import PopupWithBcHandler from '../../handlers/Popup/PopupWithBcHandler'
import { getQuote, getSignature } from '../../plugins/moonpay'
import { MOONPAY } from '../../utils/enums'

export default {
  fetchMoonpayQuote(context, payload) {
    // returns a promise
    return getQuote({
      digital_currency: payload.selectedCryptoCurrency && payload.selectedCryptoCurrency.toLowerCase(),
      fiat_currency: payload.selectedCurrency && payload.selectedCurrency.toLowerCase(),
      requested_amount: +Number.parseFloat(payload.fiatValue),
    })
  },
  fetchMoonpayOrder({ state, dispatch }, { currentOrder, colorCode, preopenInstanceId: preopenInstanceIdPayload, selectedAddress }) {
    return new Promise((resolve, reject) => {
      let preopenInstanceId = preopenInstanceIdPayload
      if (!preopenInstanceId) {
        preopenInstanceId = randomId()
        const finalUrl = `${config.redirect_uri}?preopenInstanceId=${preopenInstanceId}`
        const handledWindow = new PopupHandler({ url: finalUrl })
        handledWindow.open()
        handledWindow.once('close', () => {
          reject(new Error('user closed moonpay popup'))
        })
      }
      const orderInstanceId = randomId()
      const instanceState = encodeURIComponent(
        window.btoa(
          JSON.stringify({
            instanceId: orderInstanceId,
            provider: MOONPAY,
          })
        )
      )
      const parameters = {
        apiKey: config.moonpayLiveAPIKEY,
        enabledPaymentMethods: 'credit_debit_card,sepa_bank_transfer,gbp_bank_transfer',
        defaultCurrencyCode: currentOrder.currency.code || undefined,
        walletAddresses: selectedAddress ? JSON.stringify({ eth: selectedAddress, bnb_bsc: selectedAddress, busd_bsc: selectedAddress }) : undefined,
        colorCode,
        baseCurrencyAmount: currentOrder.baseCurrencyAmount || undefined,
        baseCurrencyCode: currentOrder.baseCurrency.code || undefined,
        email: state.userInfo.email || undefined,
        externalCustomerId: selectedAddress || state.selectedAddress,
        redirectURL: `${config.redirect_uri}?state=${instanceState}`,
        showWalletAddressForm: true,
      }

      const parameterString = new URLSearchParams(JSON.parse(JSON.stringify(parameters)))
      const url = `${config.moonpayHost}?${parameterString.toString()}`

      getSignature({ url: encodeURIComponent(url) })
        .then(({ signature }) =>
          dispatch('postMoonpayOrder', { finalUrl: `${url}&signature=${encodeURIComponent(signature)}`, preopenInstanceId, orderInstanceId })
        )
        .then((response) => resolve(response))
        .catch((error) => reject(error))
    })
  },
  async postMoonpayOrder(_, { finalUrl, preopenInstanceId, orderInstanceId }) {
    const moonpayWindow = new PopupWithBcHandler({ url: finalUrl, preopenInstanceId, channelName: `redirect_channel_${orderInstanceId}` })
    const result = await moonpayWindow.handle()
    const { queryParams: { transactionStatus = '' } = {} } = result
    if (transactionStatus !== 'failed') return { success: true }
    throw new Error('Payment Failed')
  },
}
