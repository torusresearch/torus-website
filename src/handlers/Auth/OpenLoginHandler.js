import { getPublic, sign } from '@toruslabs/eccrypto'
import { decryptData, encryptData, keccak256 } from '@toruslabs/metadata-helpers'
import OpenLogin from '@toruslabs/openlogin'
import { subkey } from '@toruslabs/openlogin-subkey'
// import { Mutex } from 'await-semaphore'
import { BN } from 'ethereumjs-util'
import log from 'loglevel'

import config from '../../config'
import torus from '../../torus'
import { ACCOUNT_TYPE } from '../../utils/enums'
import { get, post } from '../../utils/httpHelpers'
import { generateTorusAuthHeaders, getIFrameOriginObject } from '../../utils/utils'

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
      _sessionNamespace: namespace,
    })
  }

  async getActiveSession() {
    try {
      const { sessionId, sessionNamespace } = this.openLoginInstance.state.store.getStore()
      if (sessionId) {
        log.info('found session id')
        const publicKeyHex = getPublic(Buffer.from(sessionId, 'hex')).toString('hex')
        const url = new URL(`${config.storageServerUrl}/store/get`)
        url.searchParams.append('key', publicKeyHex)
        if (sessionNamespace) url.searchParams.append('namespace', sessionNamespace)
        const encData = await get(url.href)
        if (encData.message) {
          const loginDetails = await decryptData(sessionId, encData.message)
          this.openLoginInstance._syncState(loginDetails)
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

      if (sessionId) {
        const privKey = Buffer.from(sessionId, 'hex')
        const publicKeyHex = getPublic(privKey).toString('hex')
        const encData = await encryptData(sessionId, sessionData)
        const signatureBf = await sign(privKey, keccak256(encData))
        const signature = signatureBf.toString('hex')
        await post(`${config.storageServerUrl}/store/set`, { key: publicKeyHex, data: encData, signature, namespace: sessionNamespace })
        this.openLoginInstance._syncState(sessionData)
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
        const privKey = Buffer.from(sessionId, 'hex')
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

  // async init() {
  //   const releaseLock = await mutex.acquire()
  //   if (this.openLoginInstance.provider.initialized) {
  //     releaseLock()
  //     return this.openLoginInstance
  //   }
  //   await this.openLoginInstance.init()
  //   log.info('initialized openlogin instance')
  //   releaseLock()
  //   return this.openLoginInstance
  // }

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
    const allInfo = this.openLoginInstance.state.store.getStore()
    return allInfo.sessionNamespace
  }

  getWalletKey() {
    const { state } = this.openLoginInstance
    if (!state.walletKey) return null
    const ethAddress = torus.generateAddressFromPrivKey(new BN(state.walletKey, 'hex'))
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
        ethAddress: torus.generateAddressFromPrivKey(new BN(state.oAuthPrivateKey, 'hex')),
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
