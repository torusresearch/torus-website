import randomId from '@chaitanyapotti/random-id'

import PopupWithBcHandler from '../Popup/PopupWithBcHandler'

class AbstractLoginHandler {
  nonce = randomId()

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

  async handleLoginWindow() {
    const channelName = `redirect_channel_${this.nonce}`
    const verifierWindow = new PopupWithBcHandler({ channelName, url: this.finalURL, preopenInstanceId: this.preopenInstanceId })
    const localVerifier = this.verifier
    const result = await verifierWindow.handle(function successHandler(data) {
      const {
        instanceParams: { verifier: returnedVerifier },
      } = data
      if (returnedVerifier === localVerifier) return this.bc.postMessage({ success: true })
      return undefined
    })
    const {
      hashParams: { access_token: accessToken, id_token: idToken },
    } = result
    return { accessToken, idToken: idToken || '' }
  }
}

export default AbstractLoginHandler
