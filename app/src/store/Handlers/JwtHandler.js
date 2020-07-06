import deepmerge from 'deepmerge'
import jwtDecode from 'jwt-decode'
import log from 'loglevel'

import { get } from '../../utils/httpHelpers'
import { getVerifierId, padUrlString } from '../../utils/utils'
import AbstractLoginHandler from './AbstractLoginHandler'

export default class JwtHandler extends AbstractLoginHandler {
  SCOPE = 'openid profile email'

  RESPONSE_TYPE = 'token id_token'

  PROMPT = 'login'

  constructor({ clientId, verifier, redirect_uri, preopenInstanceId, redirectToOpener = false, typeOfLogin, jwtParameters }) {
    super({ clientId, verifier, redirect_uri, typeOfLogin, preopenInstanceId, redirectToOpener })
    this.jwtParameters = jwtParameters
    this.setFinalUrl()
  }

  setFinalUrl() {
    const { domain, connection } = this.jwtParameters
    const finalUrl = new URL(domain)
    finalUrl.pathname = '/authorize'
    const clonedParameters = JSON.parse(JSON.stringify(this.jwtParameters))
    delete clonedParameters.domain
    const finalJwtParameters = deepmerge(
      {
        state: this.state,
        response_type: this.RESPONSE_TYPE,
        client_id: this.clientId,
        prompt: this.PROMPT,
        redirect_uri: this.redirect_uri,
        scope: this.SCOPE,
        connection,
        nonce: this.nonce,
      },
      clonedParameters
    )
    Object.keys(finalJwtParameters).forEach((key) => {
      if (finalJwtParameters[key]) finalUrl.searchParams.append(key, finalJwtParameters[key])
    })
    this.finalURL = finalUrl
  }

  async getUserInfo(parameters) {
    const { idToken, accessToken } = parameters
    const { domain, verifierIdField, isVerifierIdCaseSensitive } = this.jwtParameters
    try {
      const domainUrl = new URL(domain)
      const userInfo = await get(`${padUrlString(domainUrl)}userinfo`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      const { picture, name, email } = userInfo
      return {
        email,
        name,
        profileImage: picture,
        verifierId: getVerifierId(userInfo, this.typeOfLogin, verifierIdField, isVerifierIdCaseSensitive),
        verifier: this.verifier,
        typeOfLogin: this.typeOfLogin,
      }
    } catch (error) {
      log.error(error)
      const decodedToken = jwtDecode(idToken)
      const { name, email, picture } = decodedToken
      return {
        profileImage: picture,
        name,
        email,
        verifierId: getVerifierId(decodedToken, this.typeOfLogin, verifierIdField, isVerifierIdCaseSensitive),
        verifier: this.verifier,
        typeOfLogin: this.typeOfLogin,
      }
    }
  }
}
