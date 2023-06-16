import { getQuote, getWalletOrder, saveWalletOrder } from '../../plugins/paybis'
import { ETH } from '../../utils/enums'
import { paymentProviders } from '../../utils/utils'

export default {
  fetchPaybisQuote({ state }, payload) {
    // returns a promise
    return getQuote(
      {
        dest_currency: (payload.selectedCryptoCurrency || ETH).toUpperCase(),
        source_currency: (payload.selectedCurrency || paymentProviders.rampnetwork.validCurrencies[0]).toUpperCase(),
        source_amount: +Number.parseFloat(payload.fiatValue || paymentProviders.rampnetwork.minOrderValue),
      },
      { Authorization: `Bearer ${state.jwtToken[state.selectedAddress]}` }
    )
  },
  fetchPaybisOrder({ dispatch, state }, { currentOrder, selectedAddress }) {
    return new Promise((resolve, reject) => {
      const parameters = {
        target: currentOrder.target,
        wallet_address: selectedAddress,
        quote_id: currentOrder.quoteId,
      }

      getWalletOrder(parameters, { Authorization: `Bearer ${state.jwtToken[state.selectedAddress]}` })
        .then(({ data }) => {
          // https://widget.sandbox.paybis.com/?requestId=a2d1153b-4588-44ae-882d-8120b59fe13a#/v2/exchange-form

          window.PartnerExchangeWidget.open({
            requestId: data.requestId,
          })

          window.PartnerExchangeWidget.events.onclosed = () => {
            // eslint-disable-next-line no-console
            console.log('PartnerExchangeWidget.state', window.PartnerExchangeWidget.state)
            if (window.PartnerExchangeWidget.state === 'completed') {
              // Save to backend
              const orderParams = {
                paybis_id: data.requestId,
                wallet_address: selectedAddress,
                fiat_currency: currentOrder.from,
                crypto_currency: currentOrder.target,
                fiat_amount: currentOrder.fiatAmount,
                crypto_amount: currentOrder.targetAmount,
              }

              dispatch('postPaybisOrder', { orderParams })

              resolve({ success: true })
            } else {
              reject(new Error('user closed paybis popup'))
            }
          }
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  postPaybisOrder({ state }, { orderParams }) {
    saveWalletOrder(orderParams, { Authorization: `Bearer ${state.jwtToken[state.selectedAddress]}` })
  },
}
