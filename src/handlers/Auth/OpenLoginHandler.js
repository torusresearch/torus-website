import randomId from '@chaitanyapotti/random-id'
import { safebtoa } from '@toruslabs/openlogin-utils'
import log from 'loglevel'

import config from '../../config'
import PopupWithBcHandler from '../Popup/PopupWithBcHandler'

class OpenLoginHandler {
  nonce = randomId()

  constructor({ clientId, verifier, redirect_uri, typeOfLogin, preopenInstanceId, jwtParameters, skipTKey, whiteLabel }) {
    this.clientId = clientId
    this.verifier = verifier
    this.preopenInstanceId = preopenInstanceId
    this.redirect_uri = redirect_uri
    this.typeOfLogin = typeOfLogin
    this.jwtParameters = jwtParameters
    this.skipTKey = skipTKey
    this.whiteLabel = whiteLabel
    this.setFinalUrl()
  }

  get state() {
    log.info('check', {
      instanceId: this.nonce,
      verifier: this.verifier,
      redirectToOpener: this.redirectToOpener || false,
      whiteLabel: this.whiteLabel || '',
    })
    return encodeURIComponent(
      safebtoa(
        JSON.stringify({
          instanceId: this.nonce,
          verifier: this.verifier,
          redirectToOpener: this.redirectToOpener || false,
          whiteLabel: this.whiteLabel || '',
        })
      )
    )
  }

  setFinalUrl() {
    const finalUrl = new URL(`${config.baseRoute}start`)
    finalUrl.searchParams.append('verifier', this.verifier)
    finalUrl.searchParams.append('state', this.state)
    Object.keys(this.jwtParameters).forEach((x) => {
      if (this.jwtParameters[x]) finalUrl.searchParams.append(x, this.jwtParameters[x])
    })
    finalUrl.searchParams.append('skipTKey', this.skipTKey)
    log.info(finalUrl.href)
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
