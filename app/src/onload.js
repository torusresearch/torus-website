// import WebsocketSubprovider from './websocket.js'
import TorusController from './controllers/TorusController'
import store from './store'
import { MAINNET, MAINNET_DISPLAY_NAME, MAINNET_CODE } from './utils/enums'
import { getNodeEndpoint, getLatestEpochInfo } from './utils/nodeList'
import { storageAvailable } from './utils/utils'
import config, { INFURA_MAINNET_URL } from './config'
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
      let { selectedAddress, wallet } = state || {}
      return { selectedAddress, wallet }
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
  torus._mainnetWeb3 = new Web3(Web3.providers.HttpProvider(INFURA_MAINNET_URL))
  ;(async function() {
    const latestEpochInfo = await getLatestEpochInfo(torus._mainnetWeb3)
    config.currentEpoch = Number(latestEpochInfo[0])
    var nodeEndpointRequests = []
    var nodeEndpoints = []
    var indexes = latestEpochInfo[4].map((_, index) => {
      return index
    })
    latestEpochInfo[4].map(async nodeEthAddress => {
      var req = getNodeEndpoint(torus._mainnetWeb3, nodeEthAddress)
      nodeEndpointRequests.push(req)
      nodeEndpoints.push(await req)
    })
    await Promise.all(nodeEndpointRequests)
    config.torusIndexes = indexes
    config.torusNodeEndpoints = nodeEndpoints
    // TODO: remove
    console.log(config)
  })()

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
