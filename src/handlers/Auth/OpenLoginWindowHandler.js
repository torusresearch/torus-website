import randomId from '@chaitanyapotti/random-id'
import { safebtoa } from '@toruslabs/openlogin-utils'
import log from 'loglevel'

import config from '../../config'
import PopupWithBcHandler from '../Popup/PopupWithBcHandler'

class OpenLoginWindowHandler {
  nonce = randomId()

  constructor({ verifier, redirect_uri, preopenInstanceId, jwtParameters, skipTKey, whiteLabel, loginConfigItem, origin, mfaLevel }) {
    this.verifier = verifier
    this.preopenInstanceId = preopenInstanceId
    this.redirect_uri = redirect_uri
    this.jwtParameters = jwtParameters
    this.skipTKey = skipTKey
    this.whiteLabel = whiteLabel
    this.loginConfigItem = loginConfigItem
    this.origin = origin
    this.mfaLevel = mfaLevel
    this.setFinalUrl()
  }

  get state() {
    log.info('check', {
      instanceId: this.nonce,
      verifier: this.verifier,
      redirectToOpener: this.redirectToOpener || false,
      whiteLabel: this.whiteLabel || '',
      loginConfigItem: this.loginConfigItem,
      origin: this.origin,
    })
    return encodeURIComponent(
      safebtoa(
        JSON.stringify({
          instanceId: this.nonce,
          verifier: this.verifier,
          redirectToOpener: this.redirectToOpener || false,
          whiteLabel: this.whiteLabel || {},
          loginConfig: !Object.keys(config.loginConfig).includes(this.verifier) ? { [this.loginConfigItem.loginProvider]: this.loginConfigItem } : {},
          origin: this.origin,
        })
      )
    )
  }

  setFinalUrl() {
    const finalUrl = new URL(`${config.baseRoute}start`)
    finalUrl.searchParams.append('state', this.state)
    finalUrl.searchParams.append('loginProvider', this.loginConfigItem.loginProvider)
    Object.keys(this.jwtParameters).forEach((x) => {
      if (this.jwtParameters[x]) finalUrl.searchParams.append(x, this.jwtParameters[x])
    })
    finalUrl.searchParams.append('skipTKey', this.skipTKey)
    finalUrl.searchParams.append('mfaLevel', this.mfaLevel)
    log.info(finalUrl.href)
    this.finalURL = finalUrl
  }

  async handleLoginWindow() {
    const { typeOfLogin, clientId } = this.loginConfigItem
    if (!this.verifier || !typeOfLogin || !clientId) {
      throw new Error('Invalid params')
    }
    const channelName = `redirect_openlogin_channel_${this.nonce}`
    log.info('channelname', channelName)
    const verifierWindow = new PopupWithBcHandler({ channelName, url: this.finalURL, preopenInstanceId: this.preopenInstanceId })
    const result = await verifierWindow.handle()
    return result
  }
}

export default OpenLoginWindowHandler
