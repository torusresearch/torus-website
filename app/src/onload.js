// import WebsocketSubprovider from './websocket.js'
import TorusController from './controllers/TorusController'
import store from './store'
var log = require('loglevel')
var Web3 = require('web3')
var LocalMessageDuplexStream = require('post-message-stream')
const pump = require('pump')
const stream = require('stream')
const setupMultiplex = require('./utils/setupMultiplex').default
const MetamaskInpageProvider = require('../inpage/inpage-provider')
const routerStream = require('./utils/routerStream')
;(function() {
  var origNextTick = process.nextTick.bind(process)
  process.nextTick = function() {
    var args = Array.prototype.slice.call(arguments)
    var fn = args.shift()
    origNextTick(fn.bind.apply(fn, [null].concat(args)))
  }
})()

function onloadTorus(torus) {
  function triggerUi(type) {
    log.info('TRIGGERUI:' + type)
    store.dispatch('showPopup')
  }

  const torusController = new TorusController({
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
      let { selectedAddress, wallet, networkType } = store.state
      if (networkType) {
        store.dispatch('setProviderType', { network: networkType })
      }
      if (selectedAddress && wallet[selectedAddress]) {
        setTimeout(function() {
          store.dispatch('updateSelectedAddress', { selectedAddress })
          torus.torusController.accountTracker.store.subscribe(function(state) {
            if (state.accounts) {
              for (const key in state.accounts) {
                if (state.accounts.hasOwnProperty(key)) {
                  const account = state.accounts[key]
                  store.dispatch('updateWeiBalance', { address: account.address, balance: account.balance })
                }
              }
            }
          })
        }, 50)
        torus.torusController.initTorusKeyring([wallet[selectedAddress]], [selectedAddress])
        statusStream.write({ loggedIn: true })
        log.info('rehydrated wallet')
        torus.web3.eth.net
          .getId()
          .then(res => {
            setTimeout(function() {
              store.dispatch('updateNetworkId', { networkId: res })
            })
            // publicConfigOutStream.write(JSON.stringify({networkVersion: res}))
          })
          .catch(e => log.error(e))
      }
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
  torus.web3 = new Web3(torusController.provider)
  torus.setProviderType = function(network) {
    store.dispatch('setProviderType', { network })
  }

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

  // stream to send logged in status
  const statusStream = torus.communicationMux.getStream('status')

  var iframeMetamaskStream = new stream.Duplex({
    objectMode: true,
    read: function() {},
    write: function(obj, enc, cb) {
      cb()
    }
  })
  iframeMetamaskStream.setMaxListeners(100)
  var iframeMetamask = new MetamaskInpageProvider(iframeMetamaskStream, { skipStatic: true })
  iframeMetamask.setMaxListeners(100)
  iframeMetamask.mux.setMaxListeners(100)
  var reverseStream = new stream.Duplex({
    objectMode: true,
    read: function() {},
    write: function(obj, enc, cb) {
      cb()
    }
  })
  reverseStream.setMaxListeners(100)
  var reverseMux = setupMultiplex(reverseStream)
  reverseMux.setMaxListeners(100)

  pump(iframeMetamask.mux, reverseMux, iframeMetamask.mux)
  var rStream = routerStream(providerOutStream, reverseMux.createStream('provider'))
  torusController.setupProviderConnection(rStream.mergeSteam, rStream.splitStream, 'metamask')

  // also need to set autoreload in embed.js upon network change
  // rStream.mergeSteam
  //   .pipe(sendPassThroughStream)
  //   .pipe(providerStream)
  //   .pipe(receivePassThroughStream)
  //   .pipe(rStream.splitStream)
  //   .pipe(statusStream)

  /* Stream setup block */

  return torus
}

export default onloadTorus
