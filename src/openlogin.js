import OpenLogin from '@toruslabs/openlogin'
import log from 'loglevel'

import config from './config'

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

export { default } from '@toruslabs/openlogin'
