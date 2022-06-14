import OpenLogin from '@toruslabs/openlogin'
import { subkey } from '@toruslabs/openlogin-subkey'
import { BN } from 'ethereumjs-util'
import log from 'loglevel'

import config from './config'
import torus from './torus'
import { ACCOUNT_TYPE } from './utils/enums'
import { get } from './utils/httpHelpers'
import { generateTorusAuthHeaders } from './utils/utils'

let openLoginInstance = null

export async function getOpenLoginInstance(whiteLabel = {}, loginConfig = {}) {
  log.info('getting openlogin instance')
  const whiteLabelOpenLogin = {}
  if (openLoginInstance !== null) {
    return openLoginInstance
  }
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
  const openLogin = new OpenLogin({
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

  await openLogin.init()
  log.info('got openlogin instance')
  // eslint-disable-next-line require-atomic-updates
  openLoginInstance = openLogin
  return openLoginInstance
}

export function getUserInfo(state) {
  const allInfo = state.store.getStore()
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

export async function getKeysInfo(state) {
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
  const userDapps = {}
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

  return { keys, postboxKey, userDapps }
}

export { default } from '@toruslabs/openlogin'
