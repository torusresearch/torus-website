import NodeDetailManager from '@toruslabs/fetch-node-details'
import log from 'loglevel'
import LocalMessageDuplexStream from 'post-message-stream'
import Web3 from 'web3'

import TorusController from './controllers/TorusController'
import { MAINNET, MAINNET_CODE, MAINNET_DISPLAY_NAME } from './utils/enums'
import setupMultiplex from './utils/setupMultiplex'
import { getIFrameOrigin, isMain, storageAvailable } from './utils/utils'
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

function triggerUi(type, request) {
  log.info(`TRIGGERUI:${type}`)
  getStore().dispatch('showPopup', { request })
}

function onloadTorus(torus) {
  let sessionData

  if (storageAvailable('sessionStorage')) {
    sessionData = sessionStorage.getItem('torus-app')
  }

  const sessionCachedNetwork = (sessionData && JSON.parse(sessionData).networkType) || {
    host: MAINNET,
    chainId: MAINNET_CODE,
    networkName: MAINNET_DISPLAY_NAME,
  }

  const torusController = new TorusController({
    sessionCachedNetwork,
    showUnconfirmedMessage: (request) => {
      triggerUi('showUnconfirmedMessage', request)
    },
    unlockAccountMessage: (request) => {
      triggerUi('unlockAccountMessage', request)
    },
    showUnapprovedTx: (request) => {
      triggerUi('showUnapprovedTx', request)
    },
    openPopup: (request) => {
      triggerUi('bindopenPopup', request)
    },
    storeProps: () => {
      const { state } = getStore()
      const { selectedAddress, wallet } = state || {}
      return { selectedAddress, wallet }
    },
    rehydrate() {
      getStore().dispatch('rehydrate')
    },
  })

  torus.torusController = torusController

  torusController.provider.setMaxListeners(100)
  torus.web3 = new Web3(torusController.provider)

  // update node details
  torus.nodeDetailManager = new NodeDetailManager({ network: process.env.VUE_APP_PROXY_NETWORK, proxyAddress: process.env.VUE_APP_PROXY_ADDRESS })
  torus.nodeDetailManager
    .getNodeDetails()
    .then((nodeDetails) => log.info(nodeDetails))
    .catch((error) => log.error(error))

  // You are not inside an iframe
  if (isMain) {
    // we use this to start accounttracker balances
    torusController.setupControllerConnection()
    return torus
  }

  const metamaskStream = new LocalMessageDuplexStream({
    name: 'iframe_metamask',
    target: 'embed_metamask',
    targetWindow: window.parent,
  })

  const communicationStream = new LocalMessageDuplexStream({
    name: 'iframe_comm',
    target: 'embed_comm',
    targetWindow: window.parent,
  })

  torus.metamaskMux = setupMultiplex(metamaskStream)
  torus.communicationMux = setupMultiplex(communicationStream)
  torus.communicationMux.setMaxListeners(50)

  const providerOutStream = torus.metamaskMux.getStream('provider')

  torusController.setupUntrustedCommunication(providerOutStream, getIFrameOrigin())

  return torus
}

export default onloadTorus
