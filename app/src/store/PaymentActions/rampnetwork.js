import config from '../../config'
import getQuote from '../../plugins/rampnetwork'
import PopupHandler from '../../utils/PopupHandler'

export default {
  fetchRampNetworkQuote(context, payload) {
    // returns a promise
    return getQuote({
      digital_currency: payload.selectedCryptoCurrency.toLowerCase(),
      fiat_currency: payload.selectedCurrency.toLowerCase(),
      requested_amount: +parseFloat(payload.fiatValue)
    })
  },
  fetchRampNetworkOrder({ state, dispatch }, { currentOrder, preopenInstanceId, selectedAddress }) {
    const parameters = {
      userAddress: selectedAddress || state.selectedAddress,
      userEmailAddress: state.userInfo.email,
      swapAsset: currentOrder.cryptoCurrencySymbol,
      swapAmount: currentOrder.cryptoCurrencyValue,
      variant: 'hosted-auto',
      webhookStatusUrl: 'https://rampnetwork-api.tor.us/transaction',
      hostUrl: '*'
    }
    return dispatch('openWidget', { path: config.rampInstantWidget, params: parameters, preopenInstanceId })
  },
  openWidget(context, { path, params, preopenInstanceId }) {
    return new Promise((resolve, reject) => {
      const parameterString = new URLSearchParams(params)
      const finalUrl = `${path}?${parameterString}`
      const rampInstantWindow = new PopupHandler({ url: finalUrl, preopenInstanceId })

      // Handle communication with Ramp Instant Widget window
      window.addEventListener(
        'message',
        event => {
          if (event.data.type === 'WIDGET_CLOSE') {
            rampInstantWindow.close()
            reject(new Error('User closed Ramp Instant Widget'))
          } else if (event.data.type === 'PURCHASE_SUCCESSFUL') {
            resolve({ success: true })
          }
        },
        rampInstantWindow.window
      )

      rampInstantWindow.open()
      rampInstantWindow.once('close', () => {
        reject(new Error('User closed Ramp Instant Widget'))
      })
    })
  }
}
