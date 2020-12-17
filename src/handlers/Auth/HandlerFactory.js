import {
  APPLE,
  DISCORD,
  EMAIL_PASSWORD,
  FACEBOOK,
  GITHUB,
  GOOGLE,
  JWT,
  KAKAO,
  LINE,
  LINKEDIN,
  PASSWORDLESS,
  REDDIT,
  TWITCH,
  TWITTER,
  WECHAT,
  WEIBO,
} from '../../utils/enums'
import DiscordHandler from './DiscordHandler'
import FacebookHandler from './FacebookHandler'
import GoogleHandler from './GoogleHandler'
import JwtHandler from './JwtHandler'
import PasswordlessHandler from './PasswordlessHandler'
import RedditHandler from './RedditHandler'
import TwitchHandler from './TwitchHandler'

const createHandler = ({ typeOfLogin, clientId, verifier, redirect_uri, preopenInstanceId, redirectToOpener = false, jwtParameters }) => {
  if (!verifier || !typeOfLogin || !clientId) {
    throw new Error('Invalid params')
  }
  const { domain, login_hint } = jwtParameters || {}
  switch (typeOfLogin) {
    case GOOGLE:
      return new GoogleHandler({ clientId, verifier, redirect_uri, typeOfLogin, preopenInstanceId, redirectToOpener })
    case FACEBOOK:
      return new FacebookHandler({ clientId, verifier, redirect_uri, typeOfLogin, preopenInstanceId, redirectToOpener })
    case TWITCH:
      return new TwitchHandler({ clientId, verifier, redirect_uri, typeOfLogin, preopenInstanceId, redirectToOpener })
    case REDDIT:
      return new RedditHandler({ clientId, verifier, redirect_uri, typeOfLogin, preopenInstanceId, redirectToOpener })
    case DISCORD:
      return new DiscordHandler({ clientId, verifier, redirect_uri, typeOfLogin, preopenInstanceId, redirectToOpener })
    case PASSWORDLESS:
      if (!domain || !login_hint) throw new Error('Invalid params')
      return new PasswordlessHandler({ clientId, verifier, redirect_uri, typeOfLogin, preopenInstanceId, redirectToOpener, jwtParameters })
    case GITHUB:
    case APPLE:
    case KAKAO:
    case LINE:
    case LINKEDIN:
    case TWITTER:
    case WEIBO:
    case WECHAT:
    case EMAIL_PASSWORD:
    case JWT:
      if (!domain) throw new Error('Invalid params')
      return new JwtHandler({ clientId, verifier, redirect_uri, typeOfLogin, preopenInstanceId, redirectToOpener, jwtParameters })
    default:
      throw new Error('Invalid login type')
  }
}

export default createHandler
