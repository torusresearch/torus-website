import { getPublic } from '@toruslabs/eccrypto'
import { decryptData } from '@toruslabs/metadata-helpers'
import OpenLogin from '@toruslabs/openlogin'
import { subkey } from '@toruslabs/openlogin-subkey'
import { Mutex } from 'await-semaphore'
import { BN } from 'ethereumjs-util'
import log from 'loglevel'

import config from '../../config'
import torus from '../../torus'
import { ACCOUNT_TYPE } from '../../utils/enums'
import { get } from '../../utils/httpHelpers'
import { generateTorusAuthHeaders } from '../../utils/utils'

const mutex = new Mutex()

class OpenLoginHandler {
  static openLoginHandlerInstance = null

  static getInstance(whiteLabel = {}, loginConfig = {}) {
    if (OpenLoginHandler.openLoginHandlerInstance) return OpenLoginHandler.openLoginHandlerInstance
    OpenLoginHandler.openLoginHandlerInstance = new OpenLoginHandler(whiteLabel, loginConfig)
    return OpenLoginHandler.openLoginHandlerInstance
  }

  // This constructor is private. Don't call it
  constructor(whiteLabel = {}, loginConfig = {}) {
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
    this.openLoginInstance = new OpenLogin({
      clientId: config.openLoginClientId,
      _iframeUrl: config.openLoginUrl,
      redirectUrl: `${config.baseRoute}end`,
      replaceUrlOnRedirect: true,
      uxMode: 'redirect',
      originData: {
        [window.location.origin]: config.openLoginOriginSig,
      },
      whiteLabel: whiteLabelOpenLogin,
      loginConfig,
      // no3PC: true,
    })
  }

  async getActiveSession() {
    try {
      const { sessionId } = this.openLoginInstance.state.store.getStore()
      log.info(this.openLoginInstance)
      if (sessionId) {
        log.info('found session id', sessionId)
        const publicKeyHex = getPublic(Buffer.from(sessionId, 'hex')).toString('hex')
        const encData = await get(`${config.storageServerUrl}/store/get?key=${publicKeyHex}`)
        if (encData.message) {
          const loginDetails = await decryptData(sessionId, encData.message)
          this.openLoginInstance._syncState(loginDetails)
          return loginDetails
        }
      }
      return null
    } catch (error) {
      log.warn(error)
      return null
    }
  }

  async init() {
    const releaseLock = await mutex.acquire()
    if (this.openLoginInstance.provider.initialized) {
      releaseLock()
      return this.openLoginInstance
    }
    await this.openLoginInstance.init()
    log.info('initialized openlogin instance')
    releaseLock()
    return this.openLoginInstance
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

  getKeysInfo() {
    const { state } = this.openLoginInstance
    // keys
    const keys = []
    if (state.walletKey) {
      const ethAddress = torus.generateAddressFromPrivKey(new BN(state.walletKey, 'hex'))
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
        ethAddress: torus.generateAddressFromPrivKey(new BN(state.tKey, 'hex')),
      })
    }

    let postboxKey
    if (state.oAuthPrivateKey) {
      postboxKey = {
        privKey: state.oAuthPrivateKey.padStart(64, '0'),
        ethAddress: torus.generateAddressFromPrivKey(new BN(state.oAuthPrivateKey, 'hex')),
      }
    }

    // derive app scoped keys from tkey
    log.info(keys, postboxKey)

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
        log.info(headers, 'headers')
        const response = await get(`${config.developerDashboardUrl}/projects/user-projects?chain_namespace=evm`, {
          headers,
        })
        log.info(response, 'User projects from developer dashboard')
        const userProjects = response.user_projects ?? []
        userProjects.sort((a, b) => (a.last_login < b.last_login ? 1 : -1))
        userProjects.forEach((project) => {
          const subKey = subkey(state.tKey, Buffer.from(project.project_id, 'base64'))
          const subAddress = torus.generateAddressFromPrivKey(new BN(subKey, 'hex'))
          userDapps[subAddress] = `${project.name} (${project.hostname})`
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
