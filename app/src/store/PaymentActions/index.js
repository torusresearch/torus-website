import vuetify from '../../plugins/vuetify'
import torus from '../../torus'
import { MOONPAY, RAMPNETWORK, SIMPLEX, WYRE } from '../../utils/enums'
import { fakeStream, paymentProviders } from '../../utils/utils'
import moonpay from './moonpay'
import rampnetwork from './rampnetwork'
import simplex from './simplex'
import wyre from './wyre'

const topupStream = (torus && torus.communicationMux && torus.communicationMux.getStream('topup')) || fakeStream

const handleSuccess = success => {
  topupStream.write({
    name: 'topup_response',
    data: {
      success
    }
  })
}

const handleFailure = error => {
  topupStream.write({
    name: 'topup_response',
    data: {
      success: false,
      error: error.message || 'Internal error'
    }
  })
}

export default {
  ...simplex,
  ...rampnetwork,
  ...moonpay,
  ...wyre,
  async initiateTopup({ state, dispatch }, { provider, params, preopenInstanceId }) {
    if (paymentProviders[provider] && paymentProviders[provider].api) {
      try {
        const selectedProvider = paymentProviders[provider]
        const selectedParameters = params || {}

        // set default values
        if (!selectedParameters.selectedCurrency) selectedParameters.selectedCurrency = 'USD'
        if (!selectedParameters.fiatValue) selectedParameters.fiatValue = selectedProvider.minOrderValue
        if (!selectedParameters.selectedCryptoCurrency) selectedParameters.selectedCryptoCurrency = 'ETH'
        if (!selectedParameters.selectedAddress) selectedParameters.selectedAddress = state.selectedAddress

        // validations
        const requestedOrderAmount = +parseFloat(selectedParameters.fiatValue)
        if (requestedOrderAmount < selectedProvider.minOrderValue) throw new Error('Requested amount is lower than supported')
        if (requestedOrderAmount > selectedProvider.maxOrderValue) throw new Error('Requested amount is higher than supported')
        if (!selectedProvider.validCurrencies.includes(selectedParameters.selectedCurrency)) throw new Error('Unsupported currency')
        if (!selectedProvider.validCryptoCurrencies.includes(selectedParameters.selectedCryptoCurrency)) throw new Error('Unsupported cryptoCurrency')

        // simplex
        if (provider === SIMPLEX) {
          const { result: currentOrder } = await dispatch('fetchSimplexQuote', selectedParameters)
          const { success } = await dispatch('fetchSimplexOrder', {
            currentOrder,
            preopenInstanceId,
            selectedAddress: selectedParameters.selectedAddress
          })
          handleSuccess(success)
        } else if (provider === RAMPNETWORK) {
          // rampnetwork
          const currentOrder = await dispatch('fetchRampNetworkQuote', selectedParameters)
          const { success } = await dispatch('fetchRampNetworkOrder', {
            currentOrder,
            preopenInstanceId,
            selectedAddress: selectedParameters.selectedAddress
          })
          handleSuccess(success)
        } else if (provider === MOONPAY) {
          // moonpay
          const currentOrder = await dispatch('fetchMoonpayQuote', selectedParameters)
          const { success } = await dispatch('fetchMoonpayOrder', {
            currentOrder,
            colorCode: vuetify.framework.theme.themes.light.primary.base,
            preopenInstanceId,
            selectedAddress: selectedParameters.selectedAddress
          })
          handleSuccess(success)
        } else if (provider === WYRE) {
          // wyre
          const { data: currentOrder } = await dispatch('fetchWyreQuote', selectedParameters)
          const { success } = await dispatch('fetchWyreOrder', {
            currentOrder,
            preopenInstanceId,
            selectedAddress: selectedParameters.selectedAddress
          })
          handleSuccess(success)
        }
      } catch (error) {
        handleFailure(error)
      }
    } else {
      handleFailure(new Error('Unsupported/Invalid provider selected'))
    }
  }
}
