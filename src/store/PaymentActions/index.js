import log from 'loglevel'

import config from '../../config'
import PopupWithBcHandler from '../../handlers/Popup/PopupWithBcHandler'
import vuetify from '../../plugins/vuetify'
import torus from '../../torus'
import { BANXA, BANXA_NETWORK_MAP, MAINNET, MERCURYO, MOONPAY, RAMPNETWORK, TRANSAK, TRANSAK_NETWORK_MAP } from '../../utils/enums'
import { fakeStream, getTimeout, paymentProviders, randomId } from '../../utils/utils'
import banxa from './banxa'
import mercuryo from './mercuryo'
import moonpay from './moonpay'
import rampnetwork from './rampnetwork'
import simplex from './simplex'
import transak from './transak'

const topupStream = (torus && torus.communicationMux && torus.communicationMux.getStream('topup')) || fakeStream

const handleSuccess = (success) => {
  topupStream.write({
    name: 'topup_response',
    data: {
      success,
    },
  })
}

const handleFailure = (error) => {
  topupStream.write({
    name: 'topup_response',
    data: {
      success: false,
      error: error.message || 'Internal error',
    },
  })
}

export default {
  ...banxa,
  ...simplex,
  ...rampnetwork,
  ...moonpay,
  ...mercuryo,
  ...transak,
  async initiateTopup({ state, dispatch }, { provider, params, preopenInstanceId }) {
    if (paymentProviders[provider] && paymentProviders[provider].api) {
      try {
        const selectedProvider = paymentProviders[provider]
        const selectedParameters = params || {}

        // set default values
        // if (!selectedParameters.selectedCurrency) [selectedParameters.selectedCurrency] = selectedProvider.validCurrencies
        // if (!selectedParameters.fiatValue) selectedParameters.fiatValue = selectedProvider.minOrderValue
        // if (!selectedParameters.selectedCryptoCurrency) [selectedParameters.selectedCryptoCurrency] = selectedProvider.validCryptoCurrencies
        if (!selectedParameters.selectedAddress) selectedParameters.selectedAddress = state.selectedAddress

        // validations
        if (selectedParameters.fiatValue) {
          const requestedOrderAmount = +Number.parseFloat(selectedParameters.fiatValue) || 0
          if (requestedOrderAmount < selectedProvider.minOrderValue) throw new Error('Requested amount is lower than supported')
          if (requestedOrderAmount > selectedProvider.maxOrderValue && selectedProvider.enforceMax)
            throw new Error('Requested amount is higher than supported')
        }

        if (selectedParameters.selectedCurrency && !selectedProvider.validCurrencies.includes(selectedParameters.selectedCurrency))
          throw new Error('Unsupported currency')

        if (selectedParameters.selectedCryptoCurrency) {
          const validCryptoCurrenciesByChain = Object.values(selectedProvider.validCryptoCurrenciesByChain)
            .flat()
            .map((currency) => currency.value)

          const finalCryptoCurrency =
            provider === MOONPAY ? selectedParameters.selectedCryptoCurrency.toLowerCase() : selectedParameters.selectedCryptoCurrency

          if (validCryptoCurrenciesByChain && !validCryptoCurrenciesByChain.includes(finalCryptoCurrency))
            throw new Error('Unsupported cryptoCurrency')
        }

        if (provider === RAMPNETWORK) {
          // rampnetwork
          const currentOrder = { cryptoCurrencyValue: '', cryptoCurrencySymbol: selectedParameters.selectedCryptoCurrency || '' }
          if (selectedParameters.fiatValue && selectedParameters.selectedCurrency && selectedParameters.selectedCryptoCurrency) {
            const result = await dispatch('fetchRampNetworkQuote', selectedParameters)
            const { asset } = result
            currentOrder.cryptoCurrencySymbol = asset.symbol || ''
            currentOrder.cryptoCurrencyValue = result.cryptoAmount
          }

          const { success } = await dispatch('fetchRampNetworkOrder', {
            currentOrder,
            preopenInstanceId,
            selectedAddress: selectedParameters.selectedAddress,
          })
          handleSuccess(success)
        } else if (provider === MOONPAY) {
          // moonpay
          const currentOrder = {
            currency: { code: selectedParameters.selectedCryptoCurrency.toLowerCase() || '' },
            totalAmount: selectedParameters.fiatValue || '',
            baseCurrency: { code: selectedParameters.selectedCurrency || '' },
          }

          const { success } = await dispatch('fetchMoonpayOrder', {
            currentOrder,
            colorCode: vuetify.framework.theme.themes.light.primary.base,
            preopenInstanceId,
            selectedAddress: selectedParameters.selectedAddress,
          })
          handleSuccess(success)
        } else if (provider === MERCURYO) {
          // mercuryo
          const currentOrder = {
            currency: selectedParameters.selectedCryptoCurrency || 'ETH',
            fiat_amount: selectedParameters.fiatValue || '',
            fiat_currency: selectedParameters.selectedCurrency || '',
          }
          const { success } = await dispatch('fetchMercuryoOrder', {
            currentOrder,
            preopenInstanceId,
            selectedAddress: selectedParameters.selectedAddress,
          })
          handleSuccess(success)
        } else if (provider === TRANSAK) {
          // transak
          if (!selectedParameters.chainNetwork) throw new Error('Requires chainNetwork')
          selectedParameters.network = TRANSAK_NETWORK_MAP[selectedParameters.chainNetwork]
          const result = await dispatch('fetchTransakQuote', selectedParameters)

          const { success } = await dispatch('fetchTransakOrder', {
            currentOrder: result.response,
            colorCode: state.whiteLabel.theme.colors.torusBrand1 || '',
            selectedAddress: selectedParameters.selectedAddress,
            network: selectedParameters.network,
            preopenInstanceId,
          })
          handleSuccess(success)
        } else if (provider === BANXA) {
          const currentOrder = {
            fiat_code: selectedParameters.selectedCurrency,
            fiat_amount: selectedParameters.fiatValue.toString() || '',
            coin_code: selectedParameters.selectedCryptoCurrency,
          }

          const { success } = await dispatch('fetchBanxaOrder', {
            currentOrder,
            selectedAddress: selectedParameters.selectedAddress,
            blockchain: BANXA_NETWORK_MAP[selectedParameters.chainNetwork || MAINNET],
            preopenInstanceId,
          })
          handleSuccess(success)
        }
      } catch (error) {
        handleFailure(error)
      }
    } else {
      try {
        const finalUrl = new URL(`${config.baseRoute}wallet/topup`)
        const channelId = randomId()
        finalUrl.searchParams.append('instanceId', channelId)
        if (params)
          Object.keys(params).forEach((key) => {
            if (params[key]) finalUrl.searchParams.append(key, params[key])
          })
        const handledWindow = new PopupWithBcHandler({
          url: finalUrl,
          preopenInstanceId,
          channelName: `redirect_channel_${channelId}`,
          timeout: getTimeout({ isPaymentTx: true }),
        })
        const result = await handledWindow.handle()
        const { queryParams: { transactionStatus = '' } = {} } = result
        log.info(result)
        if (transactionStatus === 'success') {
          handleSuccess(true)
        } else if (transactionStatus === 'failed') {
          throw new Error('Payment Failed')
        }
      } catch (error) {
        handleFailure(error)
      }
    }
  },
}
