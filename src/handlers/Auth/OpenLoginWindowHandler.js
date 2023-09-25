import { safebtoa, storageAvailable } from '@toruslabs/openlogin-utils'
import log from 'loglevel'

import config from '../../config'
import { getTimeout, randomId } from '../../utils/utils'
import PopupWithBcHandler from '../Popup/PopupWithBcHandler'

class OpenLoginWindowHandler {
  nonce = randomId()

  constructor({ verifier, redirect_uri, preopenInstanceId, jwtParameters, whiteLabel, loginConfigItem, origin, mfaLevel }) {
    this.verifier = verifier
    this.preopenInstanceId = preopenInstanceId
    this.redirect_uri = redirect_uri
    this.jwtParameters = jwtParameters
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
          origin: this.origin,
          whiteLabel: this.whiteLabel || {},
          loginConfig: Object.keys(config.loginConfig).includes(this.verifier) ? {} : { [this.loginConfigItem.loginProvider]: this.loginConfigItem },
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
    finalUrl.searchParams.append('mfaLevel', this.mfaLevel)
    log.info(finalUrl.href)
    this.finalURL = finalUrl
  }

  async handleLoginWindow() {
    const { typeOfLogin, clientId } = this.loginConfigItem
    if (!this.verifier || !typeOfLogin || !clientId) {
      throw new Error('Invalid params')
    }
    if (storageAvailable('localStorage')) {
      localStorage.setItem('broadcast_channel_id', this.nonce)
    }
    const channelName = `redirect_openlogin_channel_${this.nonce}`
    log.info('channelname', channelName)
    const verifierWindow = new PopupWithBcHandler({
      channelName,
      url: this.finalURL,
      preopenInstanceId: this.preopenInstanceId,
      timeout: getTimeout({ typeOfLogin }),
    })
    const result = await verifierWindow.handle()
    if (storageAvailable('localStorage')) {
      localStorage.removeItem('broadcast_channel_id')
    }
    return result
  }
}

export default OpenLoginWindowHandler
