import { get } from '../../utils/httpHelpers'
import AbstractLoginHandler from './AbstractLoginHandler'

export default class TwitchHandler extends AbstractLoginHandler {
  RESPONSE_TYPE = 'token'

  SCOPE = 'user:read:email'

  constructor({ clientId, verifier, redirect_uri, typeOfLogin, preopenInstanceId, redirectToOpener = false }) {
    super({ clientId, verifier, redirect_uri, typeOfLogin, preopenInstanceId, redirectToOpener })
    this.setFinalUrl()
  }

  setFinalUrl() {
    const finalUrl = new URL('https://id.twitch.tv/oauth2/authorize')
    finalUrl.searchParams.append('response_type', this.RESPONSE_TYPE)
    finalUrl.searchParams.append('client_id', this.clientId)
    finalUrl.searchParams.append('state', this.state)
    finalUrl.searchParams.append('scope', this.SCOPE)
    finalUrl.searchParams.append('redirect_uri', this.redirect_uri)
    finalUrl.searchParams.append('force_verify', 'true')
    this.finalURL = finalUrl
  }

  async getUserInfo(parameters) {
    const { accessToken } = parameters
    const userInfo = await get('https://api.twitch.tv/helix/users', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Client-ID': this.clientId,
      },
    })
    const [{ profile_image_url: profileImage = '', display_name: name = '', email = '', id: verifierId }] = userInfo.data || []
    return {
      profileImage,
      name,
      email,
      verifierId,
      verifier: this.verifier,
      typeOfLogin: this.typeOfLogin,
    }
  }
}
