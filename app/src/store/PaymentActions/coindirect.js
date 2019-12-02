import log from 'loglevel'
import { postQuote } from '../../plugins/coindirect'
import config from '../../config'
import torus from '../../torus'
import { COINDIRECT } from '../../utils/enums'
import { BroadcastChannel } from 'broadcast-channel'
import { broadcastChannelOptions } from '../../utils/utils'
import PopupHandler from '../../utils/PopupHandler'

export default {
  fetchCoindirectQuote({ state }, payload) {
    // returns a promise
    return postQuote({
      from: payload.selectedCurrency,
      to: payload.selectedCryptoCurrency,
      payInMethod: 'card',
      payOutMethod: 'crypto',
      merchantId: config.coindirectTestMerchantID,
      amountIn: +parseFloat(payload.fiatValue),
      payOutInstruction: {
        code: 'crypto',
        address: state.selectedAddress
      }
    })
  },
  fetchCoindirectOrder({ state, dispatch }, { currentOrder, preopenInstanceId }) {
    const instanceState = encodeURIComponent(
      window.btoa(
        JSON.stringify({
          instanceId: torus.instanceId,
          provider: COINDIRECT
        })
      )
    )
    const params = {
      merchantId: config.coindirectLiveMerchantID,
      to: currentOrder.to,
      address: state.selectedAddress,
      email: state.userInfo.email !== '' ? state.userInfo.email : undefined,
      amount: currentOrder.amountIn,
      url: encodeURIComponent(`${config.coindirectApiHost}/transaction?url=${encodeURIComponent(`${config.redirect_uri}?state=${instanceState}`)}`)
    }
    return dispatch('postCoindirectOrder', { path: config.coindirectLiveHost, params: params, preopenInstanceId })
  },
  postCoindirectOrder(context, { path, params, method = 'post', preopenInstanceId }) {
    return new Promise((resolve, reject) => {
      const paramString = new URLSearchParams(params)
      const finalUrl = `${path}?${paramString}`
      const coindirectWindow = new PopupHandler({ url: finalUrl, preopenInstanceId })

      const bc = new BroadcastChannel(`redirect_channel_${torus.instanceId}`, broadcastChannelOptions)
      bc.onmessage = ev => {
        try {
          const {
            instanceParams: { provider }
          } = ev.data || {}
          if (ev.error && ev.error !== '') {
            log.error(ev.error)
            reject(new Error(ev.error))
          } else if (ev.data && provider === COINDIRECT) {
            resolve({ success: true })
          }
        } catch (error) {
          reject(error)
        } finally {
          bc.close()
          coindirectWindow.close()
        }
      }

      coindirectWindow.open()
      coindirectWindow.once('close', () => {
        reject(new Error('user closed coindirect popup'))
      })
    })
  }
}
