import { getPublic, sign } from '@toruslabs/eccrypto'
import { decryptData, encryptData, keccak256 } from '@toruslabs/metadata-helpers'
import OpenLogin from '@toruslabs/openlogin'
import { subkey } from '@toruslabs/openlogin-subkey'
import log from 'loglevel'

import config from '../../config'
import { ACCOUNT_TYPE } from '../../utils/enums'
import { get, post, put } from '../../utils/httpHelpers'
import { generateAddressFromPrivateKey, generateTorusAuthHeaders, getIFrameOriginObject } from '../../utils/utils'

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

  static getInstance(whiteLabel = {}, loginConfig = {}, sessionNamespace = '') {
    if (OpenLoginHandler.openLoginHandlerInstance) {
      const updatedConfig = {}
      if (Object.keys(whiteLabel).length > 0) {
        const whiteLabelOpenLogin = getOpenloginWhitelabel(whiteLabel)
        updatedConfig.whiteLabel = whiteLabelOpenLogin
      }
      if (Object.keys(loginConfig).length > 0) {
        updatedConfig.loginConfig = loginConfig
      }
      if (Object.keys(updatedConfig).length > 0) {
        OpenLoginHandler.openLoginHandlerInstance.openLoginInstance._syncState({
          ...updatedConfig,
        })
      }

      return OpenLoginHandler.openLoginHandlerInstance
    }
    OpenLoginHandler.openLoginHandlerInstance = new OpenLoginHandler(whiteLabel, loginConfig, sessionNamespace)
    return OpenLoginHandler.openLoginHandlerInstance
  }

  // This constructor is private. Don't call it
  constructor(whiteLabel = {}, loginConfig = {}, sessionNamespace = '') {
    const whiteLabelOpenLogin = getOpenloginWhitelabel(whiteLabel)

    const iframeObj = getIFrameOriginObject()
    const namespace = config.isCustomLogin ? iframeObj.hostname : undefined
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
      no3PC: true,
      _sessionNamespace: sessionNamespace || namespace,
    })
  }

  async getActiveSession() {
    try {
      const { sessionId } = this.openLoginInstance.state.store.getStore()
      const { sessionNamespace } = this.openLoginInstance.state
      const finalSessionNamespace = sessionNamespace || config.namespace
      const finalSessionId = sessionId || config.sessionId
      if (finalSessionId) {
        log.info('found session id')
        const publicKeyHex = getPublic(Buffer.from(finalSessionId.padStart(64, '0'), 'hex')).toString('hex')
        const url = new URL(`${config.storageServerUrl}/store/get`)
        url.searchParams.append('key', publicKeyHex)
        if (finalSessionNamespace) url.searchParams.append('namespace', finalSessionNamespace)
        const encData = await get(url.href)
        if (encData.message) {
          const loginDetails = await decryptData(finalSessionId, encData.message)
          this.openLoginInstance._syncState({ ...loginDetails, sessionNamespace: finalSessionNamespace })
          return loginDetails
        }
        this.openLoginInstance.state.store.set('sessionId', null)
      }
      return null
    } catch (error) {
      log.warn(error)
      this.openLoginInstance.state.store.set('sessionId', null)
      return null
    }
  }

  async updateSession(sessionData) {
    try {
      const { sessionId } = this.openLoginInstance.state.store.getStore()
      const { sessionNamespace } = this.openLoginInstance.state
      const finalSessionNamespace = sessionNamespace || config.namespace
      const finalSessionId = sessionId || config.sessionId
      if (finalSessionId) {
        const privKey = Buffer.from(finalSessionId.padStart(64, '0'), 'hex')
        const publicKeyHex = getPublic(privKey).toString('hex')
        const encData = await encryptData(finalSessionId, sessionData)
        const signatureBf = await sign(privKey, keccak256(encData))
        const signature = signatureBf.toString('hex')
        await put(`${config.storageServerUrl}/store/update`, { key: publicKeyHex, data: encData, signature, namespace: finalSessionNamespace })
        this.openLoginInstance._syncState({ ...sessionData, sessionNamespace: finalSessionNamespace })
      }
    } catch (error) {
      log.warn(error)
    }
  }

  async setSession(sessionData) {
    try {
      const { sessionId } = this.openLoginInstance.state.store.getStore()
      const { sessionNamespace } = this.openLoginInstance.state

      if (sessionId) {
        const privKey = Buffer.from(sessionId.padStart(64, '0'), 'hex')
        const publicKeyHex = getPublic(privKey).toString('hex')
        const encData = await encryptData(sessionId, sessionData)
        const signatureBf = await sign(privKey, keccak256(encData))
        const signature = signatureBf.toString('hex')
        await post(`${config.storageServerUrl}/store/set`, { key: publicKeyHex, data: encData, signature, namespace: sessionNamespace })
        this.openLoginInstance._syncState({ ...sessionData, sessionNamespace })
      }
    } catch (error) {
      log.warn(error)
    }
  }

  async invalidateSession() {
    try {
      const { sessionId } = this.openLoginInstance.state.store.getStore()
      const { sessionNamespace } = this.openLoginInstance.state
      if (sessionId) {
        const privKey = Buffer.from(sessionId.padStart(64, '0'), 'hex')
        const publicKeyHex = getPublic(privKey).toString('hex')
        const encData = await encryptData(sessionId, {})
        const signatureBf = await sign(privKey, keccak256(encData))
        const signature = signatureBf.toString('hex')
        await post(`${config.storageServerUrl}/store/set`, { key: publicKeyHex, data: encData, signature, timeout: 1, namespace: sessionNamespace })
        this.openLoginInstance.state.store.set('sessionId', null)
      }
    } catch (error) {
      if (error?.status === 404) {
        this.openLoginInstance.state.store.set('sessionId', null)
      }
      log.warn(error)
    }
  }

  getUserInfo() {
    const allInfo = this.openLoginInstance.state.store.getStore()
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

  getSessionId() {
    const allInfo = this.openLoginInstance.state.store.getStore()
    return allInfo.sessionId
  }

  getSessionNamespace() {
    const allInfo = this.openLoginInstance.state
    return allInfo.sessionNamespace
  }

  getWalletKey() {
    const { state } = this.openLoginInstance
    if (!state.walletKey) return null
    const ethAddress = generateAddressFromPrivateKey(state.walletKey)
    return {
      privKey: state.walletKey,
      ethAddress,
    }
  }

  getKeysInfo() {
    const { state } = this.openLoginInstance
    // keys
    const keys = []
    if (state.walletKey) {
      const ethAddress = generateAddressFromPrivateKey(state.walletKey)
      keys.push({
        privKey: state.walletKey,
        accountType: ACCOUNT_TYPE.NORMAL,
        ethAddress,
      })
    }
    if (state.tKey && state.tKey !== state.walletKey) {
      keys.push({
        privKey: state.tKey.padStart(64, '0'),
        accountType: ACCOUNT_TYPE.THRESHOLD,
        ethAddress: generateAddressFromPrivateKey(state.tKey),
      })
    }
    if (state.accounts && typeof state.accounts === 'object') {
      Object.values(state.accounts).forEach((val) => {
        keys.push({
          privKey: val.privKey.padStart(64, '0'),
          accountType: val.accountType,
          ethAddress: val.ethAddress,
        })
      })
    }

    let postboxKey
    if (state.oAuthPrivateKey) {
      postboxKey = {
        privKey: state.oAuthPrivateKey.padStart(64, '0'),
        ethAddress: generateAddressFromPrivateKey(state.oAuthPrivateKey),
      }
    }

    return { keys, postboxKey }
  }

  async getUserDapps(postboxKey) {
    const userDapps = {}
    const { state } = this.openLoginInstance
    const keys = []
    if (state.tKey && state.oAuthPrivateKey) {
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
          const subKey = subkey(state.tKey, Buffer.from(project.project_id, 'base64'))
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
