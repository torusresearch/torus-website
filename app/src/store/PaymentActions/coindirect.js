import { postQuote } from '../../plugins/coindirect'
import config from '../../config'
import torus from '../../torus'
import { COINDIRECT } from '../../utils/enums'
import { BroadcastChannel } from 'broadcast-channel'
import log from 'loglevel'
import { broadcastChannelOptions } from '../../utils/utils'

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
  fetchCoindirectOrder({ state, dispatch }, { currentOrder }) {
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
      url: encodeURIComponent(
        `${config.coindirectApiHost}/transaction?url=${encodeURIComponent(`${config.topup_redirect_uri}?state=${instanceState}`)}`
      )
    }
    return dispatch('postCoindirectOrder', { path: config.coindirectLiveHost, params: params })
  },
  postCoindirectOrder(context, { path, params, method = 'post' }) {
    var coindirectWindow
    var iClosedCoindirect = false
    return new Promise((resolve, reject) => {
      const paramString = new URLSearchParams(params)
      const finalUrl = `${path}?${paramString}`

      const bc = new BroadcastChannel(`topup_redirect_channel_${torus.instanceId}`, broadcastChannelOptions)

      bc.onmessage = ev => {
        try {
          if (ev.error && ev.error !== '') {
            log.error(ev.error)
            reject(new Error(ev.error))
          } else if (ev.data && ev.data.provider === COINDIRECT) {
            resolve({ success: ev.data.success })
          }
        } catch (error) {
          reject(error)
        } finally {
          bc.close()
          iClosedCoindirect = true
          coindirectWindow.close()
        }
      }

      // Handle communication with coindirect window here
      coindirectWindow = window.open(finalUrl, '_blank', 'directories=0,titlebar=0,toolbar=0,status=0,location=0,menubar=0,height=700,width=1200')

      var coindirectTimer = setInterval(function() {
        if (coindirectWindow.closed) {
          clearInterval(coindirectTimer)
          if (!iClosedCoindirect) {
            log.error('user closed popup')
            reject(new Error('user closed coindirect popup'))
          }
          iClosedCoindirect = false
          coindirectWindow = undefined
        }
      }, 1000)
    })
  }
}
