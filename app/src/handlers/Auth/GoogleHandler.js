import { get } from '../../utils/httpHelpers'
import AbstractLoginHandler from './AbstractLoginHandler'

export default class GoogleHandler extends AbstractLoginHandler {
  RESPONSE_TYPE = 'token id_token'

  SCOPE = 'profile email openid'

  PROMPT = 'consent select_account'

  constructor({ clientId, verifier, redirect_uri, typeOfLogin, preopenInstanceId, redirectToOpener = false }) {
    super({ clientId, verifier, redirect_uri, typeOfLogin, preopenInstanceId, redirectToOpener })
    this.setFinalUrl()
  }

  setFinalUrl() {
    const finalUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
    finalUrl.searchParams.append('response_type', this.RESPONSE_TYPE)
    finalUrl.searchParams.append('client_id', this.clientId)
    finalUrl.searchParams.append('state', this.state)
    finalUrl.searchParams.append('scope', this.SCOPE)
    finalUrl.searchParams.append('redirect_uri', this.redirect_uri)
    finalUrl.searchParams.append('nonce', this.nonce)
    finalUrl.searchParams.append('prompt', this.PROMPT)
    this.finalURL = finalUrl
  }

  async getUserInfo(parameters) {
    const { accessToken } = parameters
    const userInfo = await get('https://www.googleapis.com/userinfo/v2/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    const { picture: profileImage = '', email = '', name = '' } = userInfo
    return {
      email,
      name,
      profileImage,
      verifier: this.verifier,
      verifierId: email.toLowerCase(),
      typeOfLogin: this.typeOfLogin,
    }
  }
}
