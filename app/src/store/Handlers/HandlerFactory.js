import { DISCORD, EMAIL_PASSWORD, FACEBOOK, GITHUB, GOOGLE, JWT, LINKEDIN, PASSWORDLESS, REDDIT, TWITCH, TWITTER, WEIBO } from '../../utils/enums'
import DiscordHandler from './DiscordHandler'
import FacebookHandler from './FacebookHandler'
import GoogleHandler from './GoogleHandler'
import JwtHandler from './JwtHandler'
import PasswordlessHandler from './PasswordlessHandler'
import RedditHandler from './RedditHandler'
import TwitchHandler from './TwitchHandler'

const createHandler = ({ typeofLogin, clientId, verifier, redirect_uri, preopenInstanceId, redirectToOpener = false, jwtParameters }) => {
  switch (typeofLogin) {
    case GOOGLE:
      return new GoogleHandler({ clientId, verifier, redirect_uri, preopenInstanceId, redirectToOpener })
    case FACEBOOK:
      return new FacebookHandler({ clientId, verifier, redirect_uri, preopenInstanceId, redirectToOpener })
    case TWITCH:
      return new TwitchHandler({ clientId, verifier, redirect_uri, preopenInstanceId, redirectToOpener })
    case REDDIT:
      return new RedditHandler({ clientId, verifier, redirect_uri, preopenInstanceId, redirectToOpener })
    case DISCORD:
      return new DiscordHandler({ clientId, verifier, redirect_uri, preopenInstanceId, redirectToOpener })
    case PASSWORDLESS:
      return new PasswordlessHandler({ clientId, verifier, redirect_uri, typeofLogin, preopenInstanceId, redirectToOpener, jwtParameters })
    case GITHUB:
    case LINKEDIN:
    case TWITTER:
    case WEIBO:
    case EMAIL_PASSWORD:
    case JWT:
      return new JwtHandler({ clientId, verifier, redirect_uri, typeofLogin, preopenInstanceId, redirectToOpener, jwtParameters })
    default:
      throw new Error('Invalid login type')
  }
}

export default createHandler
