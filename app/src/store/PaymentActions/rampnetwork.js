import config from '../../config'
import PopupHandler from '../../handlers/Popup/PopupHandler'
import getQuote from '../../plugins/rampnetwork'
import { ETH } from '../../utils/enums'
import { paymentProviders } from '../../utils/utils'

export default {
  fetchRampNetworkQuote(_, payload) {
    // returns a promise
    return getQuote({
      digital_currency: (payload.selectedCryptoCurrency || ETH).toLowerCase(),
      fiat_currency: (payload.selectedCurrency || paymentProviders.rampnetwork.validCurrencies[0]).toLowerCase(),
      requested_amount: +Number.parseFloat(payload.fiatValue || paymentProviders.rampnetwork.minOrderValue),
    })
  },
  fetchRampNetworkOrder({ state, dispatch }, { currentOrder, preopenInstanceId, selectedAddress }) {
    const parameters = {
      userAddress: selectedAddress || undefined,
      userEmailAddress: state.userInfo.email || undefined,
      swapAsset: currentOrder.cryptoCurrencySymbol || undefined,
      swapAmount: currentOrder.cryptoCurrencyValue || undefined,
      variant: 'hosted-auto',
      webhookStatusUrl: `${config.rampApiHost}/transaction`,
      hostUrl: '*',
      hostLogoUrl: 'https://app.tor.us/images/torus-logo-blue.svg',
      hostAppName: 'Torus',
      hostApiKey: config.rampAPIKEY,
    }
    return dispatch('openWidget', { path: config.rampHost, params: parameters, preopenInstanceId })
  },
  openWidget(context, { path, params, preopenInstanceId }) {
    return new Promise((resolve, reject) => {
      const parameterString = new URLSearchParams(JSON.parse(JSON.stringify(params)))
      const finalUrl = `${path}?${parameterString.toString()}`
      const rampInstantWindow = new PopupHandler({ url: finalUrl, preopenInstanceId })
      let purchaseCreated = false
      let purchaseSuccess = false

      // Handle communication with Ramp Instant Widget window
      window.addEventListener(
        'message',
        (event) => {
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
              reject(new Error('Purchase Cancelled'))
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
  },
}
