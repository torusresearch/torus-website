import { BasePostMessageStream } from '@toruslabs/openlogin-jrpc'
import { BrowserProvider } from 'ethers'
import log from 'loglevel'

import config from './config'
import TorusController from './controllers/TorusController'
import setupMultiplex from './controllers/utils/setupMultiplex'
import { getDefaultNetwork, getIFrameOrigin, isMain, randomId, storageUtils } from './utils/utils'
// import store from './store'
let storeReference
let deferredDispatch = []
function getStore() {
  return (
    storeReference || {
      dispatch(...arguments_) {
        deferredDispatch.push(() => {
          storeReference.dispatch(...arguments_)
        })
      },
    }
  )
}

export function injectStore(s) {
  storeReference = s
  deferredDispatch.forEach((fn) => fn())
  deferredDispatch = []
}

function triggerUi(type, payload, request) {
  log.info(`TRIGGERUI:${type}`, payload, request)
  getStore().dispatch('showPopup', { payload, request })
}

const torus = {
  instanceId: randomId(),
}
let sessionData

if (config.storageAvailability[storageUtils.storageType]) {
  const { storage, storageKey } = storageUtils
  sessionData = storage.getItem(storageKey)
}

const sessionCachedNetwork = (sessionData && JSON.parse(sessionData).networkType) || getDefaultNetwork()
const customNetworks = (sessionData && JSON.parse(sessionData).customNetworks) || {}

const torusController = new TorusController({
  initState: {
    NetworkController: {
      provider: sessionCachedNetwork,
      customNetworks,
    },
  },
  showUnconfirmedMessage: triggerUi.bind(window, 'showUnconfirmedMessage'),
  unlockAccountMessage: triggerUi.bind(window, 'unlockAccountMessage'),
  showUnapprovedTx: triggerUi.bind(window, 'showUnapprovedTx'),
  openPopup: triggerUi.bind(window, 'bindopenPopup'),
  showSwitchChain: triggerUi.bind(window, 'showSwitchChain'),
  showAddChain: triggerUi.bind(window, 'showAddChain'),
  storeProps: () => {
    const { state } = getStore()
    const { selectedAddress, wallet } = state || {}
    return { selectedAddress, wallet }
  },
  storeDispatch: () => getStore().dispatch,
})

torus.torusController = torusController

torusController.provider.setMaxListeners(100)
torus.ethersProvider = new BrowserProvider(torus.torusController.provider, 'any')
log.info('torus network', process.env.VUE_APP_PROXY_NETWORK)

// we use this to start accounttracker balances
torusController.setupControllerConnection()

if (!isMain) {
  const iframeOrigin = getIFrameOrigin()
  log.info('iframe origin', iframeOrigin)
  const metamaskStream = new BasePostMessageStream({
    name: 'iframe_metamask',
    target: 'embed_metamask',
    targetWindow: window.parent,
    targetOrigin: iframeOrigin,
  })

  const communicationStream = new BasePostMessageStream({
    name: 'iframe_comm',
    target: 'embed_comm',
    targetWindow: window.parent,
    targetOrigin: iframeOrigin,
  })

  torus.metamaskMux = setupMultiplex(metamaskStream)
  torus.communicationMux = setupMultiplex(communicationStream)
  torus.communicationMux.setMaxListeners(50)

  const providerOutStream = torus.metamaskMux.getStream('provider')

  torusController.setupUntrustedCommunication(providerOutStream, iframeOrigin)
}

export default torus
