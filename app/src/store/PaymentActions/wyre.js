import { getQuote } from '../../plugins/wyre'
import config from '../../config'
import torus from '../../torus'
import { WYRE } from '../../utils/enums'
import { BroadcastChannel } from 'broadcast-channel'
import log from 'loglevel'
import { broadcastChannelOptions } from '../../utils/utils'
import PopupHandler from '../../utils/PopupHandler'

export default {
  fetchWyreQuote({ state }, payload) {
    // returns a promise
    return getQuote(
      {
        source_amount: +parseFloat(payload.fiatValue),
        source_currency: payload.selectedCurrency,
        dest_currency: payload.selectedCryptoCurrency
      },
      {
        Authorization: `Bearer ${state.jwtToken}`
      }
    )
  },
  fetchWyreOrder({ state, dispatch }, { currentOrder, preopenInstanceId }) {
    const instanceState = encodeURIComponent(
      window.btoa(
        JSON.stringify({
          instanceId: torus.instanceId,
          provider: WYRE
        })
      )
    )
    const params = {
      destCurrency: currentOrder.destCurrency,
      sourceAmount: currentOrder.sourceAmount,
      redirectUrl: `${config.redirect_uri}?state=${instanceState}`,
      dest: `ethereum:${state.selectedAddress}`,
      accountId: config.wyreAccountId,
      referenceId: state.selectedAddress
    }
    return dispatch('postWyreOrder', { path: config.wyreHost, params: params, preopenInstanceId })
  },
  postWyreOrder(context, { path, params, method = 'post', preopenInstanceId }) {
    return new Promise((resolve, reject) => {
      const paramString = new URLSearchParams(params)
      const finalUrl = `${path}?${paramString}`
      const wyreWindow = new PopupHandler({ url: finalUrl, preopenInstanceId })

      const bc = new BroadcastChannel(`redirect_channel_${torus.instanceId}`, broadcastChannelOptions)
      bc.onmessage = ev => {
        try {
          const {
            instanceParams: { provider }
          } = ev.data || {}
          if (ev.error && ev.error !== '') {
            log.error(ev.error)
            reject(new Error(ev.error))
          } else if (ev.data && provider === WYRE) {
            resolve({ success: true })
          }
        } catch (error) {
          reject(error)
        } finally {
          bc.close()
          wyreWindow.close()
        }
      }

      wyreWindow.open()
      wyreWindow.once('close', () => {
        reject(new Error('user closed wyre popup'))
      })
    })
  }
}
