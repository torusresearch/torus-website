import config from '../../config'
import getQuote from '../../plugins/rampnetwork'
import { ETH } from '../../utils/enums'
import PopupHandler from '../../utils/PopupHandler'
import { paymentProviders } from '../../utils/utils'

export default {
  fetchRampNetworkQuote(context, payload) {
    // returns a promise
    return getQuote({
      digital_currency: (payload.selectedCryptoCurrency || ETH).toLowerCase(),
      fiat_currency: (payload.selectedCurrency || paymentProviders.rampnetwork.validCurrencies[0]).toLowerCase(),
      requested_amount: +parseFloat(payload.fiatValue || paymentProviders.rampnetwork.minOrderValue)
    })
  },
  fetchRampNetworkOrder({ state, dispatch }, { currentOrder, preopenInstanceId, selectedAddress }) {
    const parameters = {
      userAddress: selectedAddress || state.selectedAddress,
      userEmailAddress: state.userInfo.email || undefined,
      swapAsset: currentOrder.cryptoCurrencySymbol || undefined,
      swapAmount: currentOrder.cryptoCurrencyValue || undefined,
      variant: 'hosted-auto',
      webhookStatusUrl: `${config.rampApiHost}/transaction`,
      hostUrl: '*'
    }
    return dispatch('openWidget', { path: config.rampInstantWidget, params: parameters, preopenInstanceId })
  },
  openWidget(context, { path, params, preopenInstanceId }) {
    return new Promise((resolve, reject) => {
      const parameterString = new URLSearchParams(JSON.parse(JSON.stringify(params)))
      const finalUrl = `${path}?${parameterString}`
      const rampInstantWindow = new PopupHandler({ url: finalUrl, preopenInstanceId })
      let purchaseCreated = false
      let purchaseSuccess = false

      // Handle communication with Ramp Instant Widget window
      window.addEventListener(
        'message',
        event => {
          if (event.data.type === 'PURCHASE_CREATED') {
            purchaseCreated = true
          } else if (event.data.type === 'PURCHASE_SUCCESSFUL') {
            purchaseSuccess = true
            resolve({ success: true })
          } else if (event.data.type === 'WIDGET_CLOSE') {
            if (purchaseSuccess) {
              // Do nothing, promise already resolved
            } else if (purchaseCreated) {
              resolve({ success: true })
            } else {
              reject(new Error('Purchase Canceled'))
            }
            rampInstantWindow.close()
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
