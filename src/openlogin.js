import OpenLogin from '@toruslabs/openlogin'
import log from 'loglevel'

import config from './config'

let openLoginInstance = null

export async function getOpenLoginInstance(whiteLabel) {
  log.info('getting openlogin instance')
  const whiteLabelOpenLogin = {}
  if (openLoginInstance !== null) {
    return openLoginInstance
  }
  if (whiteLabel.theme) {
    if (whiteLabel.theme.isDark) whiteLabelOpenLogin.dark = 'true'
    if (whiteLabel.theme.colors) {
      whiteLabelOpenLogin.theme = {
        primary: whiteLabel.theme.colors.torusBrand1,
      }
    }
  }
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
    // no3PC: true,
  })

  await openLogin.init()
  // eslint-disable-next-line require-atomic-updates
  openLoginInstance = openLogin
  return openLoginInstance
}

export { default } from '@toruslabs/openlogin'
