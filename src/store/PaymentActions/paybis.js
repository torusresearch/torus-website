import { getQuote, getWalletOrder } from '../../plugins/paybis'
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
  fetchPaybisOrder({ state }, { currentOrder, selectedAddress }) {
    return new Promise((resolve, reject) => {
      const parameters = {
        target: currentOrder.target,
        wallet_address: selectedAddress,
        quote_id: currentOrder.quoteId,
      }

      getWalletOrder(parameters, { Authorization: `Bearer ${state.jwtToken[state.selectedAddress]}` })
        // .then(({ data }) => dispatch('postBanxaOrder', { finalUrl: data.checkout_url }))
        .then(({ data }) => {
          // eslint-disable-next-line no-console
          console.log('data', data)
          window.PartnerExchangeWidget.openInNewTab({
            requestId: data.requestId,
          })
        })
        .then(resolve)
        .catch(reject)
    })
  },
  // async postBanxaOrder(_, { finalUrl, preopenInstanceId, orderInstanceId }) {
  //   const banxaWindow = new PopupWithBcHandler({ preopenInstanceId, url: finalUrl, channelName: `redirect_channel_${orderInstanceId}` })
  //   await banxaWindow.handle()
  //   return { success: true }
  // },
}
