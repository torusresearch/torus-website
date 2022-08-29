import NodeDetailManager from '@toruslabs/fetch-node-details'
import { BasePostMessageStream } from '@toruslabs/openlogin-jrpc'
import log from 'loglevel'
import Web3 from 'web3'

import config from './config'
import TorusController from './controllers/TorusController'
import setupMultiplex from './controllers/utils/setupMultiplex'
import { MAINNET, SUPPORTED_NETWORK_TYPES } from './utils/enums'
import { getIFrameOrigin, getIFrameOriginObject, isMain } from './utils/utils'
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

function onloadTorus(torus) {
  let sessionData

  if (config.localStorageAvailable) {
    const storage = !isMain ? (config.isCustomLogin === null ? window.sessionStorage : window.localStorage) : window.localStorage
    const storageKey = config.isCustomLogin === true ? `torus_app_${getIFrameOriginObject().hostname}` : 'torus-app'
    sessionData = storage.getItem(storageKey)
  }

  const sessionCachedNetwork = (sessionData && JSON.parse(sessionData).networkType) || SUPPORTED_NETWORK_TYPES[MAINNET]
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
    storeProps: () => {
      const { state } = getStore()
      const { selectedAddress, wallet } = state || {}
      return { selectedAddress, wallet }
    },
    storeDispatch: () => getStore().dispatch,
  })

  torus.torusController = torusController

  torusController.provider.setMaxListeners(100)
  torus.web3 = new Web3(torusController.provider)

  torus.nodeDetailManager = new NodeDetailManager({
    network: config.NETWORK_MAP[config.torusNetwork],
    proxyAddress: NodeDetailManager[`PROXY_ADDRESS_${config.NETWORK_MAP[config.torusNetwork].toUpperCase().split('-')[0]}`],
  })
  log.info('torus network', process.env.VUE_APP_PROXY_NETWORK)

  // we use this to start accounttracker balances
  torusController.setupControllerConnection()

  if (isMain) return torus

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

  const publicConfOutStream = torus.metamaskMux.getStream('publicConfig')

  torusController.setupPublicConfig(publicConfOutStream)

  return torus
}

export default onloadTorus
