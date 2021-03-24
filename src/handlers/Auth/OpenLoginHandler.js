import randomId from '@chaitanyapotti/random-id'
import log from 'loglevel'

import PopupWithBcHandler from '../Popup/PopupWithBcHandler'

class OpenLoginHandler {
  nonce = randomId()

  constructor({ clientId, verifier, redirect_uri, typeOfLogin, preopenInstanceId }) {
    this.clientId = clientId
    this.verifier = verifier
    this.preopenInstanceId = preopenInstanceId
    this.redirect_uri = redirect_uri
    this.typeOfLogin = typeOfLogin
    this.setFinalUrl()
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

  setFinalUrl() {
    const finalUrl = new URL(window.location.href)
    finalUrl.pathname = '/start'
    finalUrl.searchParams.append('verifier', this.verifier)
    finalUrl.searchParams.append('state', this.state)
    this.finalURL = finalUrl
  }

  async handleLoginWindow() {
    const channelName = `redirect_openlogin_channel_${this.nonce}`
    log.info('channelname', channelName)
    const verifierWindow = new PopupWithBcHandler({ channelName, url: this.finalURL, preopenInstanceId: this.preopenInstanceId })
    const result = await verifierWindow.handle()
    return result
  }
}

export default OpenLoginHandler
