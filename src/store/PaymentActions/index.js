import randomId from '@chaitanyapotti/random-id'
import log from 'loglevel'

import config from '../../config'
import PopupWithBcHandler from '../../handlers/Popup/PopupWithBcHandler'
import vuetify from '../../plugins/vuetify'
import torus from '../../torus'
import { MERCURYO, MOONPAY, RAMPNETWORK, WYRE, XANPOOL } from '../../utils/enums'
import { fakeStream, paymentProviders } from '../../utils/utils'
import mercuryo from './mercuryo'
import moonpay from './moonpay'
import rampnetwork from './rampnetwork'
import simplex from './simplex'
import wyre from './wyre'
import xanpool from './xanpool'

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
  ...simplex,
  ...rampnetwork,
  ...moonpay,
  ...wyre,
  ...xanpool,
  ...mercuryo,
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
        if (selectedParameters.selectedCryptoCurrency && !selectedProvider.validCryptoCurrencies.includes(selectedParameters.selectedCryptoCurrency))
          throw new Error('Unsupported cryptoCurrency')

        if (provider === RAMPNETWORK) {
          // rampnetwork
          const currentOrder = { cryptoCurrencyValue: '', cryptoCurrencySymbol: selectedParameters.selectedCryptoCurrency || '' }
          if (selectedParameters.fiatValue && selectedParameters.selectedCurrency && selectedParameters.selectedCryptoCurrency) {
            const result = await dispatch('fetchRampNetworkQuote', selectedParameters)
            let cryptoValue = 0
            const asset = result.assets.find((item) => item.symbol === selectedParameters.selectedCryptoCurrency)
            const fiat = selectedParameters.fiatValue
            const feeRate = asset.maxFeePercent[selectedParameters.selectedCurrency] / 100
            const rate = asset.price[selectedParameters.selectedCurrency]
            const fiatWithoutFee = fiat / (1 + feeRate) // Final amount of fiat that will be converted to crypto
            cryptoValue = fiatWithoutFee / rate // Final Crypto amount
            currentOrder.cryptoCurrencyValue = Math.trunc(cryptoValue * 10 ** asset.decimals) || ''
            currentOrder.cryptoCurrencySymbol = asset.symbol || ''
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
            currency: { code: selectedParameters.selectedCryptoCurrency || '' },
            baseCurrencyAmount: selectedParameters.fiatValue || '',
            baseCurrency: { code: selectedParameters.selectedCurrency || '' },
          }
          const { success } = await dispatch('fetchMoonpayOrder', {
            currentOrder,
            colorCode: vuetify.framework.theme.themes.light.primary.base,
            preopenInstanceId,
            selectedAddress: selectedParameters.selectedAddress,
          })
          handleSuccess(success)
        } else if (provider === WYRE) {
          // wyre
          const { success } = await dispatch('fetchWyreOrder', {
            currentOrder: {
              destCurrency: selectedParameters.selectedCryptoCurrency || undefined,
              sourceAmount: selectedParameters.fiatValue || undefined,
              sourceCurrency: selectedParameters.selectedCurrency || undefined,
            },
            preopenInstanceId,
            selectedAddress: selectedParameters.selectedAddress,
          })
          handleSuccess(success)
        } else if (provider === XANPOOL) {
          // xanpool
          const { success } = await dispatch('fetchXanpoolOrder', {
            currentOrder: {
              selectedCryptoCurrency: selectedParameters.selectedCryptoCurrency || 'ETH',
              fiatValue: selectedParameters.fiatValue || '',
              selectedCurrency: selectedParameters.selectedCurrency || '',
            },
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
        const handledWindow = new PopupWithBcHandler({ url: finalUrl, preopenInstanceId, channelName: `redirect_channel_${channelId}` })
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
