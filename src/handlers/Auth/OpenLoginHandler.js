import OpenLogin from '@toruslabs/openlogin'
import { OpenloginSessionManager } from '@toruslabs/openlogin-session-manager'
import { subkey } from '@toruslabs/openlogin-subkey'
import log from 'loglevel'

import config from '../../config'
import { ACCOUNT_TYPE } from '../../utils/enums'
import { get } from '../../utils/httpHelpers'
import { generateAddressFromPrivateKey, generateTorusAuthHeaders, getIFrameOriginObject, storageUtils } from '../../utils/utils'

const getOpenloginWhitelabel = (whiteLabel = {}) => {
  const whiteLabelOpenLogin = {}
  if (whiteLabel.theme) {
    if (whiteLabel.theme.isDark) whiteLabelOpenLogin.dark = true
    if (whiteLabel.theme.colors) {
      whiteLabelOpenLogin.theme = {
        primary: whiteLabel.theme.colors.torusBrand1,
      }
    }
  }
  if (whiteLabel.logoDark) whiteLabelOpenLogin.logoDark = whiteLabel.logoDark
  if (whiteLabel.logoLight) whiteLabelOpenLogin.logoLight = whiteLabel.logoLight
  if (whiteLabel.defaultLanguage) whiteLabelOpenLogin.defaultLanguage = whiteLabel.defaultLanguage
  if (whiteLabel.name) whiteLabelOpenLogin.name = whiteLabel.name
  if (whiteLabel.url) whiteLabelOpenLogin.url = whiteLabel.url
  return whiteLabelOpenLogin
}
class OpenLoginHandler {
  static openLoginHandlerInstance = null

  static async getInstance(whiteLabel = {}, loginConfig = {}, sessionNamespace = '', reinitialize = false) {
    if (OpenLoginHandler.openLoginHandlerInstance && !reinitialize) {
      if (Object.keys(whiteLabel).length > 0) {
        const whiteLabelOpenLogin = getOpenloginWhitelabel(whiteLabel)
        OpenLoginHandler.openLoginHandlerInstance.whiteLabel = whiteLabelOpenLogin
      }
      if (Object.keys(loginConfig).length > 0) {
        OpenLoginHandler.openLoginHandlerInstance.loginConfig = loginConfig
      }

      return OpenLoginHandler.openLoginHandlerInstance
    }
    OpenLoginHandler.openLoginHandlerInstance = new OpenLoginHandler(whiteLabel, loginConfig, sessionNamespace)
    await OpenLoginHandler.openLoginHandlerInstance.openLoginInstance.init()
    return OpenLoginHandler.openLoginHandlerInstance
  }

  // This constructor is private. Don't call it
  constructor(whiteLabel = {}, loginConfig = {}, sessionNamespace = '') {
    const whiteLabelOpenLogin = getOpenloginWhitelabel(whiteLabel)

    const iframeObj = getIFrameOriginObject()
    const customNamespace = config.isCustomLogin ? iframeObj.hostname : ''
    this.openLoginInstance = new OpenLogin({
      clientId: config.openLoginClientId,
      redirectUrl: `${config.baseRoute}end`,
      replaceUrlOnRedirect: true,
      uxMode: 'redirect',
      originData: {
        [window.location.origin]: config.openLoginOriginSig,
      },
      whiteLabel: whiteLabelOpenLogin,
      loginConfig,
      network: config.torusNetwork,
      sdkUrl: 'https://testing.openlogin.com',
      sessionNamespace: sessionNamespace || customNamespace,
      storageKey: storageUtils.storageType,
    })
  }

  get sessionId() {
    return this.openLoginInstance.state.sessionId || null
  }

  get sessionNamespace() {
    return this.openLoginInstance.options.sessionNamespace || ''
  }

  get state() {
    return this.openLoginInstance.state || {}
  }

  get accounts() {
    return this.openLoginInstance.state.accounts || null
  }

  get networkType() {
    return this.openLoginInstance.state.networkType || null
  }

  set whiteLabel(value) {
    this.openLoginInstance.options.whiteLabel = value
  }

  set loginConfig(value) {
    this.openLoginInstance.options.loginConfig = value
  }

  async updateSession(sessionData) {
    try {
      if (this.sessionId) {
        const sessionManager = new OpenloginSessionManager({
          sessionId: this.sessionId,
          sessionNamespace: this.sessionNamespace,
        })

        await sessionManager.updateSession(sessionData)
      }
    } catch (error) {
      log.warn(error)
    }
  }

  async invalidateSession() {
    await this.openLoginInstance.logout()
  }

  getUserInfo() {
    const allInfo = this.openLoginInstance.getUserInfo()
    const userInfo = {
      name: allInfo.name, // first + last name
      profileImage: allInfo.profileImage, // image url
      email: allInfo.email,
      verifier: allInfo.aggregateVerifier, // enum like GOOGLE
      verifierId: allInfo.verifierId, // usually email or facebook id
      verifierParams: { verifier_id: allInfo.verifierId }, // general params
      typeOfLogin: allInfo.typeOfLogin,
    }
    return userInfo
  }

  getWalletKey() {
    const { walletKey } = this.openLoginInstance.state
    if (!walletKey) return null
    const ethAddress = generateAddressFromPrivateKey(walletKey)
    return {
      privKey: walletKey,
      ethAddress,
    }
  }

  getKeysInfo() {
    const { walletKey, tKey, oAuthPrivateKey } = this.openLoginInstance.state
    // keys
    const keys = []
    if (walletKey) {
      const ethAddress = generateAddressFromPrivateKey(walletKey)
      keys.push({
        privKey: walletKey,
        accountType: ACCOUNT_TYPE.NORMAL,
        ethAddress,
      })
    }
    if (tKey && tKey !== walletKey) {
      keys.push({
        privKey: tKey.padStart(64, '0'),
        accountType: ACCOUNT_TYPE.THRESHOLD,
        ethAddress: generateAddressFromPrivateKey(tKey),
      })
    }
    if (this.accounts && typeof this.accounts === 'object') {
      Object.values(this.accounts).forEach((val) => {
        keys.push({
          privKey: val.privKey.padStart(64, '0'),
          accountType: val.accountType,
          ethAddress: val.ethAddress,
        })
      })
    }

    let postboxKey
    if (oAuthPrivateKey) {
      postboxKey = {
        privKey: oAuthPrivateKey.padStart(64, '0'),
        ethAddress: generateAddressFromPrivateKey(oAuthPrivateKey),
      }
    }

    return { keys, postboxKey }
  }

  async getUserDapps(postboxKey) {
    const userDapps = {}
    const { tKey, oAuthPrivateKey } = this.openLoginInstance.state
    const keys = []
    if (tKey && oAuthPrivateKey) {
      try {
        // projects are stored on oAuthPrivateKey but subkey is derived from tkey
        const headers = generateTorusAuthHeaders(postboxKey.privKey, postboxKey.ethAddress)
        const response = await get(`${config.developerDashboardUrl}/projects/user-projects?chain_namespace=evm`, {
          headers,
        })
        log.info('got User projects from developer dashboard')
        const userProjects = response.user_projects ?? []
        userProjects.sort((a, b) => (a.last_login < b.last_login ? 1 : -1))
        userProjects.forEach((project) => {
          const subKey = subkey(tKey, Buffer.from(project.project_id, 'base64'))
          const subAddress = generateAddressFromPrivateKey(subKey)
          userDapps[subAddress] = project.hostname ? `${project.name} (${project.hostname})` : project.name
          keys.push({ ethAddress: subAddress, privKey: subKey.padStart(64, '0'), accountType: ACCOUNT_TYPE.APP_SCOPED })
        })
      } catch (error) {
        log.error('fail to derive app-scoped keys', error)
      }
    }
    return { keys, userDapps }
  }
}

export default OpenLoginHandler
