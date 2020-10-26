import randomId from '@chaitanyapotti/random-id'
import { BroadcastChannel } from 'broadcast-channel'
import log from 'loglevel'

import config from '../../config'
import { getQuote, getWalletOrder } from '../../plugins/wyre'
import torus from '../../torus'
import { WYRE } from '../../utils/enums'
import PopupHandler from '../../utils/PopupHandler'
import { broadcastChannelOptions } from '../../utils/utils'

export default {
  fetchWyreQuote({ state }, payload) {
    // returns a promise
    return getQuote(
      {
        dest_currency: payload.selectedCryptoCurrency,
        source_amount: +Number.parseFloat(payload.fiatValue),
        source_currency: payload.selectedCurrency,
      },
      { Authorization: `Bearer ${state.jwtToken}` }
    )
  },
  fetchWyreOrder({ state, dispatch }, { currentOrder, preopenInstanceId: preopenInstanceIdPayload, selectedAddress }) {
    return new Promise((resolve, reject) => {
      let preopenInstanceId = preopenInstanceIdPayload
      if (!preopenInstanceId) {
        preopenInstanceId = randomId()
        const finalUrl = `${config.baseUrl}/redirect?preopenInstanceId=${preopenInstanceId}`
        const handledWindow = new PopupHandler({ url: finalUrl })
        handledWindow.open()

        handledWindow.once('close', () => {
          reject(new Error('user closed wyre popup'))
        })
      }
      const instanceState = encodeURIComponent(
        window.btoa(
          JSON.stringify({
            instanceId: torus.instanceId,
            provider: WYRE,
          })
        )
      )
      const parameters = {
        amount: currentOrder.sourceAmount,
        sourceCurrency: currentOrder.sourceCurrency,
        destCurrency: currentOrder.destCurrency,
        dest: `ethereum:${selectedAddress}`,
        email: state.userInfo.email,
        redirectUrl: `${config.redirect_uri}?state=${instanceState}`,
        failureRedirectUrl: `${config.redirect_uri}?state=${instanceState}`,
        referrerAccountId: config.wyreAccountId,
        referenceId: selectedAddress,
      }

      getWalletOrder(parameters, {})
        .then(({ data }) => dispatch('postWyreOrder', { finalUrl: data.url, preopenInstanceId }))
        .then((response) => resolve(response))
        .catch((error) => reject(error))
    })
  },
  postWyreOrder(context, { finalUrl, preopenInstanceId }) {
    return new Promise((resolve, reject) => {
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
