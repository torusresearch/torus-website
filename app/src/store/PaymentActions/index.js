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
        if (!selectedParameters.selectedCurrency) [selectedParameters.selectedCurrency] = selectedProvider.validCurrencies
        // if (!selectedParameters.fiatValue) selectedParameters.fiatValue = selectedProvider.minOrderValue
        if (!selectedParameters.selectedCryptoCurrency) [selectedParameters.selectedCryptoCurrency] = selectedProvider.validCryptoCurrencies
        if (!selectedParameters.selectedAddress) selectedParameters.selectedAddress = state.selectedAddress

        // validations
        if (selectedParameters.fiatValue) {
          const requestedOrderAmount = +parseFloat(selectedParameters.fiatValue) || 0
          if (requestedOrderAmount < selectedProvider.minOrderValue) throw new Error('Requested amount is lower than supported')
          if (requestedOrderAmount > selectedProvider.maxOrderValue) throw new Error('Requested amount is higher than supported')
        }
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
          const result = await dispatch('fetchRampNetworkQuote', selectedParameters)
          const asset = result.assets.find(item => item.symbol === selectedParameters.selectedCryptoCurrency)
          let cryptoValue = 0
          if (selectedParameters.fiatValue) {
            const fiat = selectedParameters.fiatValue
            const feeRate = asset.maxFeePercent[selectedParameters.selectedCurrency] / 100
            const rate = asset.price[selectedParameters.selectedCurrency]
            const fiatWithoutFee = fiat / (1 + feeRate) // Final amount of fiat that will be converted to crypto
            cryptoValue = fiatWithoutFee / rate // Final Crypto amount
          }

          const currentOrder = {
            cryptoCurrencyValue: cryptoValue * 10 ** asset.decimals || undefined,
            cryptoCurrencySymbol: asset.symbol
          }
          const { success } = await dispatch('fetchRampNetworkOrder', {
            currentOrder,
            preopenInstanceId,
            selectedAddress: selectedParameters.selectedAddress
          })
          handleSuccess(success)
        } else if (provider === MOONPAY) {
          // moonpay
          let currentOrder = { currency: { code: '' }, baseCurrencyAmount: '', baseCurrency: { code: '' } }
          if (selectedParameters.fiatValue) {
            currentOrder = await dispatch('fetchMoonpayQuote', {
              selectedCurrency: selectedParameters.selectedCurrency,
              selectedCryptoCurrency: selectedParameters.selectedCryptoCurrency,
              selectedAddress: selectedParameters.selectedAddress,
              fiatValue: selectedParameters.fiatValue || selectedProvider.minOrderValue
            })
          }
          const { success } = await dispatch('fetchMoonpayOrder', {
            currentOrder,
            colorCode: vuetify.framework.theme.themes.light.primary.base,
            preopenInstanceId,
            selectedAddress: selectedParameters.selectedAddress
          })
          handleSuccess(success)
        } else if (provider === WYRE) {
          // wyre
          // const { data: currentOrder } = await dispatch('fetchWyreQuote', selectedParameters)
          const { success } = await dispatch('fetchWyreOrder', {
            currentOrder: { destCurrency: selectedParameters.selectedCryptoCurrency, sourceAmount: selectedParameters.fiatValue },
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
