import { BroadcastChannel } from 'broadcast-channel'
import deepmerge from 'deepmerge'
import jwtDecode from 'jwt-decode'
import log from 'loglevel'

import { get, post } from '../../utils/httpHelpers'
import { broadcastChannelOptions, padUrlString } from '../../utils/utils'
import AbstractLoginHandler from './AbstractLoginHandler'

export default class JwtHandler extends AbstractLoginHandler {
  SCOPE = 'openid profile email'

  RESPONSE_TYPE = 'token id_token'

  PROMPT = 'login'

  constructor(_clientId, _verifier, _redirect_uri, _typeofLogin, _redirectToOpener, _jwtParameters) {
    super(_clientId, _verifier, _redirect_uri, _redirectToOpener)
    this.setFinalUrl()
  }

  setFinalUrl() {
    const { domain, login_hint } = this.jwtParams
    if (!login_hint) {
      throw new Error('Pls provide login_hint')
    }
    const domainUrl = new URL(domain)
    domainUrl.pathname = '/passwordless/start'
    this.finalURL = domainUrl
  }

  async getUserInfo(parameters) {
    const { idToken, accessToken } = parameters
    try {
      const { domain } = this.jwtParams
      const domainUrl = new URL(domain)
      const userInfo = await get(`${padUrlString(domainUrl)}userinfo`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      const { sub, picture, name, email } = userInfo
      return {
        email,
        name,
        profileImage: picture,
        verifierId: sub,
        verifier: this.verifier,
      }
    } catch (error) {
      log.error(error)
      const decodedToken = jwtDecode(idToken)
      const { name, email, picture, sub } = decodedToken
      return {
        profileImage: picture,
        name,
        email,
        verifierId: sub,
        verifier: this.verifier,
      }
    }
  }

  handleLoginWindow() {
    return new Promise((resolve, reject) => {
      if (this.redirectToOpener) {
        reject(new Error('Cannot use redirect to opener for passwordless'))
        return
      }
      const handleData = (ev) => {
        try {
          const { error, data } = ev
          const {
            instanceParams: { verifier: returnedVerifier },
            hashParams: { access_token: accessToken, id_token: idToken },
          } = data || {}
          if (error) {
            log.error(ev.error)
            reject(new Error(error))
            return
          }
          if (ev.data && returnedVerifier === this.verifier) {
            log.info(ev.data)
            resolve({ accessToken, idToken: idToken || '' })
          }
        } catch (error) {
          log.error(error)
          reject(error)
        }
      }
      const bc = new BroadcastChannel(`redirect_channel_${this.nonce}`, broadcastChannelOptions)
      bc.addEventListener('message', async (ev) => {
        handleData(ev)
        bc.close()
      })
      try {
        const { connection = 'email', login_hint: loginHint } = this.jwtParams
        const finalJwtParameters = deepmerge(
          {
            client_id: this.clientId,
            connection,
            email: connection === 'email' ? loginHint : undefined,
            phone_number: connection === 'sms' ? loginHint : undefined,
            send: 'link',
            authParams: {
              scope: this.SCOPE,
              state: this.state,
              response_type: this.RESPONSE_TYPE,
              redirect_uri: this.redirect_uri,
              nonce: this.nonce,
            },
          },
          {
            authParams: this.jwtParams,
          }
        )
        // using stringify and parse to remove undefined params
        post(this.finalURL.href, JSON.parse(JSON.stringify(finalJwtParameters)))
      } catch (error) {
        log.error(error)
        reject(error)
      }
    })
  }
}
