import randomId from '@chaitanyapotti/random-id'
import { BroadcastChannel } from 'broadcast-channel'
import log from 'loglevel'

import { FEATURES_DEFAULT_POPUP_WINDOW } from '../../utils/enums'
import PopupHandler from '../../utils/PopupHandler'
import { broadcastChannelOptions } from '../../utils/utils'

class AbstractLoginHandler {
  nonce = randomId()

  recipientWindow = null

  constructor({ clientId, verifier, redirect_uri, typeOfLogin, preopenInstanceId, redirectToOpener = false }) {
    this.clientId = clientId
    this.verifier = verifier
    this.preopenInstanceId = preopenInstanceId
    this.redirect_uri = redirect_uri
    this.redirectToOpener = redirectToOpener
    this.typeOfLogin = typeOfLogin
  }

  get state() {
    return encodeURIComponent(
      window.btoa(
        JSON.stringify({
          instanceId: this.nonce,
          verifier: this.verifier,
          redirectToOpener: this.redirectToOpener || false,
        })
      )
    )
  }

  handleLoginWindow() {
    return new Promise((resolve, reject) => {
      if (this.redirectToOpener) {
        const handleData = async (ev) => {
          try {
            const { error, data } = ev.data
            log.info(ev.data, 'event')
            const {
              instanceParams: { verifier: returnedVerifier },
              hashParams: { access_token: accessToken, id_token: idToken },
            } = data || {}
            if (error) {
              log.error(ev.error)
              reject(new Error(error))
              return
            }
            if (ev.data && returnedVerifier === this.verifier) {
              this.recipientWindow.postMessage({ success: true })
              resolve({ accessToken, idToken: idToken || '' })
            }
          } catch (error) {
            log.error(error)
            reject(error)
          }
        }
        this.recipientWindow = window.open(this.finalURL, '_blank', FEATURES_DEFAULT_POPUP_WINDOW)
        window.console.log('WHATTTTTTTT', process.env.VUE_APP_REDIRECT_ROUTE)
        window.addEventListener('message', async (ev) => {
          if (ev.origin === new URL(process.env.VUE_APP_REDIRECT_ROUTE).origin) {
            await handleData(ev)
            this.recipientWindow.close()
          } else {
            log.error('WHATTT', ev)
          }
        })
      } else {
        const bc = new BroadcastChannel(`redirect_channel_${this.nonce}`, broadcastChannelOptions)
        const handleData = async (ev) => {
          try {
            const { error, data } = ev
            log.info(ev, 'event')
            const {
              instanceParams: { verifier: returnedVerifier },
              hashParams: { access_token: accessToken, id_token: idToken },
            } = data || {}
            if (error) {
              log.error(ev.error)
              reject(new Error(error))
              return
            }
            if (ev.data && returnedVerifier === this.verifier) {
              await bc.postMessage({ success: true })
              resolve({ accessToken, idToken: idToken || '' })
            }
          } catch (error) {
            log.error(error)
            reject(error)
          }
        }
        const verifierWindow = new PopupHandler({ url: this.finalURL, preopenInstanceId: this.preopenInstanceId })
        bc.addEventListener('message', async (ev) => {
          await handleData(ev)
          bc.close()
          verifierWindow.close()
        })
        verifierWindow.open()
        verifierWindow.once('close', () => {
          if (bc) bc.close()
          reject(new Error('user closed popup'))
        })
      }
    })
  }
}

export default AbstractLoginHandler
