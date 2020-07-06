import { get } from '../../utils/httpHelpers'
import AbstractLoginHandler from './AbstractLoginHandler'

export default class DiscordHandler extends AbstractLoginHandler {
  RESPONSE_TYPE = 'token'

  SCOPE = 'identify email'

  constructor({ clientId, verifier, redirect_uri, typeOfLogin, preopenInstanceId, redirectToOpener = false }) {
    super({ clientId, verifier, redirect_uri, typeOfLogin, preopenInstanceId, redirectToOpener })
    this.setFinalUrl()
  }

  setFinalUrl() {
    const finalUrl = new URL('https://discordapp.com/api/oauth2/authorize')
    finalUrl.searchParams.append('response_type', this.RESPONSE_TYPE)
    finalUrl.searchParams.append('client_id', this.clientId)
    finalUrl.searchParams.append('state', this.state)
    finalUrl.searchParams.append('scope', this.SCOPE)
    finalUrl.searchParams.append('redirect_uri', this.redirect_uri)
    this.finalURL = finalUrl
  }

  async getUserInfo(parameters) {
    const { accessToken } = parameters
    const userInfo = await get('https://discordapp.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    const { id, avatar, email = '', username: name = '', discriminator = '' } = userInfo
    const profileImage =
      avatar === null
        ? `https://cdn.discordapp.com/embed/avatars/${Number(discriminator) % 5}.png`
        : `https://cdn.discordapp.com/avatars/${id}/${avatar}.png?size=2048`
    return {
      profileImage,
      name: `${name}#${discriminator}`,
      email,
      verifierId: id,
      verifier: this.verifier,
      typeOfLogin: this.typeOfLogin,
    }
  }
}
