import { get } from '../../utils/httpHelpers'
import AbstractLoginHandler from './AbstractLoginHandler'

export default class RedditHandler extends AbstractLoginHandler {
  RESPONSE_TYPE = 'token'

  SCOPE = 'identity'

  constructor({ clientId, verifier, redirect_uri, typeOfLogin, preopenInstanceId, redirectToOpener = false }) {
    super({ clientId, verifier, redirect_uri, typeOfLogin, preopenInstanceId, redirectToOpener })
    this.setFinalUrl()
  }

  setFinalUrl() {
    const finalUrl = new URL(`https://www.reddit.com/api/v1/authorize${window.innerWidth < 600 ? '.compact' : ''}`)
    finalUrl.searchParams.append('response_type', this.RESPONSE_TYPE)
    finalUrl.searchParams.append('client_id', this.clientId)
    finalUrl.searchParams.append('state', this.state)
    finalUrl.searchParams.append('scope', this.SCOPE)
    finalUrl.searchParams.append('redirect_uri', this.redirect_uri)
    this.finalURL = finalUrl
  }

  async getUserInfo(parameters) {
    const { accessToken } = parameters
    const userInfo = await get('https://oauth.reddit.com/api/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    const { icon_img: profileImage = '', name = '' } = userInfo
    return {
      email: '',
      name,
      profileImage: profileImage.split('?').length > 0 ? profileImage.split('?')[0] : profileImage,
      verifier: this.verifier,
      verifierId: name.toLowerCase(),
      typeOfLogin: this.typeOfLogin,
    }
  }
}
