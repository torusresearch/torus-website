// import WebsocketSubprovider from './websocket.js'
import TorusController from './controllers/TorusController'
import store from './store'
import { MAINNET, MAINNET_DISPLAY_NAME, MAINNET_CODE } from './utils/enums'
import { storageAvailable } from './utils/utils'
import config from './config'
const NodeDetailManager = require('@toruslabs/fetch-node-details')
var log = require('loglevel')
var Web3 = require('web3')
var LocalMessageDuplexStream = require('post-message-stream')
const stream = require('stream')
const setupMultiplex = require('./utils/setupMultiplex').default

function onloadTorus(torus) {
  function triggerUi(type) {
    log.info('TRIGGERUI:' + type)
    store.dispatch('showPopup')
  }

  let sessionData

  if (storageAvailable('sessionStorage')) {
    sessionData = sessionStorage.getItem('torus-app')
  }

  const sessionCachedNetwork = (sessionData && JSON.parse(sessionData).networkType) || {
    host: MAINNET,
    chainId: MAINNET_CODE,
    networkName: MAINNET_DISPLAY_NAME
  }

  const torusController = new TorusController({
    sessionCachedNetwork,
    showUnconfirmedMessage: triggerUi.bind(window, 'showUnconfirmedMessage'),
    unlockAccountMessage: triggerUi.bind(window, 'unlockAccountMessage'),
    showUnapprovedTx: triggerUi.bind(window, 'showUnapprovedTx'),
    openPopup: triggerUi.bind(window, 'bindopenPopup'),
    storeProps: () => {
      const { state } = store || {}
      let { selectedAddress, wallet, selectedEOA } = state || {}
      return { selectedAddress, wallet, selectedEOA }
    },
    rehydrate: function() {
      store.dispatch('rehydrate')
    }
  })

  var metamaskStream = new LocalMessageDuplexStream({
    name: 'iframe_metamask',
    target: 'embed_metamask',
    targetWindow: window.parent
  })

  var communicationStream = new LocalMessageDuplexStream({
    name: 'iframe_comm',
    target: 'embed_comm',
    targetWindow: window.parent
  })

  torus.torusController = torusController
  torus.metamaskMux = setupMultiplex(metamaskStream)
  torus.communicationMux = setupMultiplex(communicationStream)
  torus.communicationMux.setMaxListeners(50)
  torusController.provider.setMaxListeners(100)
  torus.web3 = new Web3(torusController.provider)

  // update node details
  NodeDetailManager.getNodeDetails().then(log.info)

  /* Stream setup block */
  // doesnt do anything.. just for logging
  // since the stack traces are constrained to a single javascript context
  // we use a passthrough stream to log method calls
  var receivePassThroughStream = new stream.PassThrough({ objectMode: true })
  receivePassThroughStream.on('data', function() {
    log.info('receivePassThroughStream', arguments)
  })

  var sendPassThroughStream = new stream.PassThrough({ objectMode: true })
  sendPassThroughStream.on('data', function() {
    log.info('sendPassThroughStream', arguments)
  })

  const providerOutStream = torus.metamaskMux.getStream('provider')

  torusController.setupTrustedCommunication(providerOutStream, 'metamask')

  return torus
}

export default onloadTorus
