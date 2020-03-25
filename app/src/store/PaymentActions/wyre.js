import { BroadcastChannel } from 'broadcast-channel'
import log from 'loglevel'

import config from '../../config'
import getQuote from '../../plugins/wyre'
import torus from '../../torus'
import { WYRE } from '../../utils/enums'
import PopupHandler from '../../utils/PopupHandler'
import { broadcastChannelOptions } from '../../utils/utils'

const Wyre = {
  fetchWyreOrder({ state, dispatch }, { currentOrder, preopenInstanceId, selectedAddress }) {
    const instanceState = encodeURIComponent(window.btoa(JSON.stringify({ instanceId: torus.instanceId, provider: WYRE })))
    const parameters = {
      accountId: config.wyreAccountId,
      dest: selectedAddress ? `ethereum:${selectedAddress}` : undefined,
      destCurrency: currentOrder.destCurrency || undefined,
      redirectUrl: `${config.redirect_uri}?state=${instanceState}`,
      referenceId: selectedAddress || state.selectedAddress,
      sourceAmount: currentOrder.sourceAmount || undefined,
    }

    return dispatch('postWyreOrder', { params: parameters, path: config.wyreHost, preopenInstanceId })
  },
  fetchWyreQuote({ state }, payload) {
    // returns a promise
    return getQuote(
      { dest_currency: payload.selectedCryptoCurrency, source_amount: +parseFloat(payload.fiatValue), source_currency: payload.selectedCurrency },
      { Authorization: `Bearer ${state.jwtToken}` }
    )
  },
  postWyreOrder(context, { path, params, preopenInstanceId }) {
    return new Promise((resolve, reject) => {
      const parameterString = new URLSearchParams(JSON.parse(JSON.stringify(params)))
      const finalUrl = `${path}?${parameterString.toString()}`
      const wyreWindow = new PopupHandler({ preopenInstanceId, url: finalUrl })

      const bc = new BroadcastChannel(`redirect_channel_${torus.instanceId}`, broadcastChannelOptions)
      bc.addEventListener('message', (ev) => {
        try {
          const {
            instanceParams: { provider },
          } = ev.data || {}
          if (ev.error && ev.error !== '') {
            log.error(ev.error)
            reject(new Error(ev.error))
          } else if (provider === WYRE) {
            resolve({ success: true })
          }
        } catch (error) {
          reject(error)
        } finally {
          bc.close()
          wyreWindow.close()
        }
      })

      wyreWindow.open()
      wyreWindow.once('close', () => {
        bc.close()
        reject(new Error('user closed wyre popup'))
      })
    })
  },
}

export default Wyre
