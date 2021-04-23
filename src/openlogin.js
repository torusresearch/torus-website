import OpenLogin from '@toruslabs/openlogin'
import log from 'loglevel'

import config from './config'

let openLoginInstance = null

export async function getOpenLoginInstance() {
  log.info('getting openlogin instance')
  if (openLoginInstance !== null) {
    return openLoginInstance
  }
  const openLogin = new OpenLogin({
    clientId: config.openLoginClientId,
    iframeUrl: config.openLoginUrl,
    redirectUrl: `${config.baseRoute}end`,
    replaceUrlOnRedirect: true,
    uxMode: 'redirect',
    originData: {
      [window.location.origin]: config.openLoginOriginSig,
    },
    // no3PC: true,
  })

  await openLogin.init()
  // eslint-disable-next-line require-atomic-updates
  openLoginInstance = openLogin
  return openLoginInstance
}

export { default } from '@toruslabs/openlogin'
