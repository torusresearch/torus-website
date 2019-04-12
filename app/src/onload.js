// import WebsocketSubprovider from './websocket.js'
import TorusController from './controllers/TorusController'
import store from './store'
var log = require('loglevel')
var Web3 = require('web3')
var LocalMessageDuplexStream = require('post-message-stream')
const pump = require('pump')
const createEngineStream = require('json-rpc-middleware-stream/engineStream')
const RpcEngine = require('json-rpc-engine')
const createFilterMiddleware = require('eth-json-rpc-filters')
const stream = require('stream')
const createSubscriptionManager = require('eth-json-rpc-filters/subscriptionManager')
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

let localweb3

function onloadTorus(torus) {
  // var engine = new ProviderEngine()
  // engine.addProvider(
  //   new FixtureSubprovider({
  //     web3_clientVersion: 'ProviderEngine/v0.0.0/javascript',
  //     net_listening: true,
  //     eth_hashrate: '0x00',
  //     eth_mining: false,
  //     eth_syncing: true
  //   })
  // )
  // engine.addProvider(new CacheSubprovider())
  // engine.addProvider(new FilterSubprovider())
  // engine.addProvider(new NonceSubprovider())
  // engine.addProvider(new VmSubprovider())
  // engine.addProvider(
  //   new HookedWalletEthTxSubprovider({
  //     getAccounts: function(cb) {
  //       var ethAddress = store.state.selectedAddress
  //       log.info('GETTING ACCOUNT:', ethAddress)
  //       cb(null, ethAddress ? [toChecksumAddress(ethAddress)] : [])
  //     },
  //     getPrivateKey: function(address, cb) {
  //       var addr = toChecksumAddress(address)
  //       var wallet = store.state.wallet
  //       if (addr == null) {
  //         cb(new Error('No address given.'), null)
  //       } else if (wallet[addr] == null) {
  //         cb(new Error('No private key accessible. Please login.'), null)
  //       } else {
  //         log.info('PRIVATE KEY RETRIEVED...')
  //         cb(null, Buffer.from(wallet[addr], 'hex'))
  //       }
  //     },
  //     approveTransaction: function(txParams, cb) {
  //       if (confirm('Confirm signature for transaction?')) {
  //         // TODO: add transaction details
  //         cb(null, true)
  //       } else {
  //         cb(new Error('User denied transaction.'), false)
  //       }
  //     }
  //   })
  // )
  // var rpcSource = new RpcSubprovider({
  //   rpcUrl: 'https://mainnet.infura.io/v3/619e62693bc14791a9925152bbe514d1'
  //   // rpcUrl: 'https://api.infura.io/v1/jsonrpc/mainnet'
  // })
  // // var rpcSource = new RpcSubprovider({
  // //   rpcUrl: 'https://mainnet.infura.io/4cQUeyeUSfkCXsgEAUH2'
  // //   // rpcUrl: 'http://localhost:7545'
  // // })
  // engine.addProvider(rpcSource)
  // // var wsSubprovider = new WebsocketSubprovider({
  // //   rpcUrl: 'wss://mainnet.infura.io/ws/v3/619e62693bc14791a9925152bbe514d1'
  // // })
  // // engine.addProvider(wsSubprovider)
  // engine.on('block', function(block) {
  //   try {
  //     log.info('================================')
  //     log.info('BLOCK CHANGED:', '#' + block.number.toString('hex'), '0x' + block.hash.toString('hex'))
  //     log.info('================================')
  //     store.dispatch('updateWeiBalance')
  //   } catch (error) {
  //     console.log(error)
  //   }
  // })
  // engine.on('error', function(err) {
  //   log.error(err.stack)
  // })
  // engine.start()

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
      let { selectedAddress, wallet } = store.state
      if (selectedAddress && wallet[selectedAddress]) {
        setTimeout(function() {
          store.dispatch('updateSelectedAddress', { selectedAddress })
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

  localweb3 = new Web3(iframeMetamask)
  pump(iframeMetamask.mux, reverseMux, iframeMetamask.mux)

  var rStream = routerStream(providerOutStream, reverseMux.createStream('provider'))

  torusController.setupProviderConnection(rStream.mergeSteam, rStream.splitStream, 'metamask')

  // stop using the above and use `torusController.setupTrustedCommunication(stream, 'metamask')`
  // this will remove the need for localweb3 because the torus.web3 will invoke the same - maybe - need to test
  // also need to define getApi() in toruscontroller - not necessary
  // also need to set autoreload in embed.js upon network change
  // rStream.mergeSteam
  //   .pipe(sendPassThroughStream)
  //   .pipe(providerStream)
  //   .pipe(receivePassThroughStream)
  //   .pipe(rStream.splitStream)
  //   .pipe(statusStream)

  // pump(
  //   providerOutStream,
  //   sendPassThroughStream,
  //   // transformStream,
  //   providerStream,
  //   receivePassThroughStream,
  //   providerOutStream,
  //   err => {
  //     if (err) log.error(err)
  //   }
  // )
  /* Stream setup block */

  return torus
}

function createLoggerMiddleware(opts) {
  return function loggerMiddleware(/** @type {any} */ req, /** @type {any} */ res, /** @type {Function} */ next) {
    next((/** @type {Function} */ cb) => {
      if (res.error) {
        log.error('Error in RPC response:\n', res)
      }
      if (req.isMetamaskInternal) return
      log.info(`RPC (${opts.origin}):`, req, '->', res)
      cb()
    })
  }
}

function createProviderMiddleware({ provider }) {
  return (req, res, next, end) => {
    provider.sendAsync(req, (err, _res) => {
      if (err) return end(err)
      res.result = _res.result
      end()
    })
  }
}

function createOriginMiddleware(opts) {
  return function originMiddleware(req, res, next) {
    req.origin = opts.origin
    next()
  }
}

export default onloadTorus
export { onloadTorus, localweb3 }
