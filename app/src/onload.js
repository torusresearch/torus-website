import NodeDetailManager from '@toruslabs/fetch-node-details'
import providerAsMiddleware from 'eth-json-rpc-middleware/providerAsMiddleware'
import providerFromEngine from 'eth-json-rpc-middleware/providerFromEngine'
import JsonRpcEngine from 'json-rpc-engine'
import createEngineStream from 'json-rpc-middleware-stream/engineStream'
import log from 'loglevel'
import LocalMessageDuplexStream from 'post-message-stream'
import Web3 from 'web3'

import TorusController from './controllers/TorusController'
import createLoggerMiddleware from './utils/createLoggerMiddleware'
import createOriginMiddleware from './utils/createOriginMiddleware'
import createSolanaMiddleware from './utils/createSolanaMiddleware'
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

function triggerUi(type, payload) {
  log.info(`TRIGGERUI:${type}`, payload)
  getStore().dispatch('showPopup', payload)
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
    showUnconfirmedMessage: triggerUi.bind(window, 'showUnconfirmedMessage'),
    unlockAccountMessage: triggerUi.bind(window, 'unlockAccountMessage'),
    showUnapprovedTx: triggerUi.bind(window, 'showUnapprovedTx'),
    openPopup: triggerUi.bind(window, 'bindopenPopup'),
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

  // we use this to start accounttracker balances
  torusController.setupControllerConnection()

  if (isMain) return torus

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

  const solanaStream = new LocalMessageDuplexStream({
    name: 'iframe_solana',
    target: 'embed_solana',
    targetWindow: window.parent,
  })

  torus.metamaskMux = setupMultiplex(metamaskStream)
  torus.communicationMux = setupMultiplex(communicationStream)
  torus.solanaMux = setupMultiplex(solanaStream)
  torus.communicationMux.setMaxListeners(50)
  torus.solanaMux.setMaxListeners(100)

  setupSolana(torus, getIFrameOrigin())

  const providerOutStream = torus.metamaskMux.getStream('provider')

  torusController.setupUntrustedCommunication(providerOutStream, getIFrameOrigin())

  return torus
}

export default onloadTorus

function setupSolana(torus, { hostname }) {
  const solanaMiddleware = createSolanaMiddleware({
    getAccounts: () => {
      log.info(getStore().state.solanaPublicKey, 'accounts')
      return [getStore().state.solanaPublicKey]
    },
    processTransaction: async (params, req) => {
      log.info(params, req)
      const result = await getStore().dispatch('showSolanaPopup', params)
      return result
    },
  })
  const engine = new JsonRpcEngine()
  engine.push(createOriginMiddleware({ origin: hostname }))
  engine.push(createLoggerMiddleware({ origin: hostname }))
  engine.push(solanaMiddleware)
  const provider = providerFromEngine(engine)
  engine.push(providerAsMiddleware(provider))

  const providerStream = createEngineStream({ engine })
  const outStream = torus.solanaMux.getStream('provider-solana')

  outStream
    .pipe(providerStream)
    .pipe(outStream)
    .on('error', (error) => {
      if (error) log.error(error)
    })
}
