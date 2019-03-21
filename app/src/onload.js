// import WebsocketSubprovider from './websocket.js'
import TorusController from './controllers/TorusController'
var log = require('loglevel')
var Web3 = require('web3')
var ProviderEngine = require('web3-provider-engine')
var CacheSubprovider = require('web3-provider-engine/subproviders/cache.js')
var FixtureSubprovider = require('web3-provider-engine/subproviders/fixture.js')
var FilterSubprovider = require('web3-provider-engine/subproviders/filters.js')
var VmSubprovider = require('web3-provider-engine/subproviders/vm.js')
var HookedWalletEthTxSubprovider = require('web3-provider-engine/subproviders/hooked-wallet-ethtx.js')
var NonceSubprovider = require('web3-provider-engine/subproviders/nonce-tracker.js')
var RpcSubprovider = require('web3-provider-engine/subproviders/rpc.js')
var LocalMessageDuplexStream = require('post-message-stream')
const pump = require('pump')
const createEngineStream = require('json-rpc-middleware-stream/engineStream')
const RpcEngine = require('json-rpc-engine')
const createFilterMiddleware = require('eth-json-rpc-filters')
const stream = require('stream')
const createSubscriptionManager = require('eth-json-rpc-filters/subscriptionManager')
const toChecksumAddress = require('./utils/toChecksumAddress').default
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
  var engine = new ProviderEngine()
  engine.addProvider(
    new FixtureSubprovider({
      web3_clientVersion: 'ProviderEngine/v0.0.0/javascript',
      net_listening: true,
      eth_hashrate: '0x00',
      eth_mining: false,
      eth_syncing: true
    })
  )
  engine.addProvider(new CacheSubprovider())
  engine.addProvider(new FilterSubprovider())
  engine.addProvider(new NonceSubprovider())
  engine.addProvider(new VmSubprovider())
  engine.addProvider(
    new HookedWalletEthTxSubprovider({
      getAccounts: function(cb) {
        var ethAddress = window.Vue.$store.state.selectedAddress
        log.info('GETTING ACCOUNT:', ethAddress)
        cb(null, ethAddress ? [toChecksumAddress(ethAddress)] : [])
      },
      getPrivateKey: function(address, cb) {
        var addr = toChecksumAddress(address)
        var wallet = window.Vue.$store.state.wallet
        if (addr == null) {
          cb(new Error('No address given.'), null)
        } else if (wallet[addr] == null) {
          cb(new Error('No private key accessible. Please login.'), null)
        } else {
          log.info('PRIVATE KEY RETRIEVED...')
          cb(null, Buffer.from(wallet[addr], 'hex'))
        }
      },
      approveTransaction: function(txParams, cb) {
        if (confirm('Confirm signature for transaction?')) {
          // TODO: add transaction details
          cb(null, true)
        } else {
          cb(new Error('User denied transaction.'), false)
        }
      }
    })
  )
  var rpcSource = new RpcSubprovider({
    // rpcUrl: 'https://mainnet.infura.io/v3/619e62693bc14791a9925152bbe514d1'
    rpcUrl: 'https://api.infura.io/v1/jsonrpc/mainnet'
  })
  // var rpcSource = new RpcSubprovider({
  //   rpcUrl: 'https://mainnet.infura.io/4cQUeyeUSfkCXsgEAUH2'
  //   // rpcUrl: 'http://localhost:7545'
  // })
  engine.addProvider(rpcSource)
  // var wsSubprovider = new WebsocketSubprovider({
  //   rpcUrl: 'wss://mainnet.infura.io/ws/v3/619e62693bc14791a9925152bbe514d1'
  // })
  // engine.addProvider(wsSubprovider)
  engine.on('block', function(block) {
    log.info('================================')
    log.info('BLOCK CHANGED:', '#' + block.number.toString('hex'), '0x' + block.hash.toString('hex'))
    log.info('================================')
    window.Vue.$store.dispatch('updateWeiBalance')
  })
  engine.on('error', function(err) {
    log.error(err.stack)
  })
  engine.start()

  function triggerUi(type) {
    log.info('TRIGGERUI:' + type)
    window.Vue.$store.dispatch('showPopup')
  }

  const torusController = new TorusController({
    showUnconfirmedMessage: triggerUi.bind(window, 'showUnconfirmedMessage'),
    unlockAccountMessage: triggerUi.bind(window, 'unlockAccountMessage'),
    showUnapprovedTx: triggerUi.bind(window, 'showUnapprovedTx'),
    openPopup: triggerUi.bind(window, 'bindopenPopup'),
    rehydrate: function() {
      let selectedAddress = window.Vue.$store.state.selectedAddress
      let wallet = window.Vue.$store.state.wallet
      if (selectedAddress && wallet[selectedAddress]) {
        setTimeout(function() {
          window.Vue.$store.dispatch('updateSelectedAddress', { selectedAddress })
        }, 50)
        torus.torusController.initTorusKeyring([wallet[selectedAddress]])
        log.info('rehydrated wallet')
        torus.web3.eth.net
          .getId()
          .then(res => {
            setTimeout(function() {
              window.Vue.$store.dispatch('updateNetworkId', { networkId: res })
            })
            // publicConfigOutStream.write(JSON.stringify({networkVersion: res}))
          })
          .catch(e => log.error(e))
      }
    }
  })

  const rpcEngine = new RpcEngine()
  const filterMiddleware = createFilterMiddleware({ provider: torusController.provider, blockTracker: torusController.blockTracker })
  const subscriptionManager = createSubscriptionManager({ provider: torusController.provider, blockTracker: torusController.blockTracker })
  subscriptionManager.events.on('notification', message => rpcEngine.emit('notification', message))
  rpcEngine.push(createOriginMiddleware({ origin: 'torus' }))
  rpcEngine.push(createLoggerMiddleware({ origin: 'torus' }))
  rpcEngine.push(filterMiddleware)
  rpcEngine.push(subscriptionManager.middleware)
  rpcEngine.push(createProviderMiddleware({ provider: torusController.provider }))
  const providerStream = createEngineStream({ engine: rpcEngine })

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
  torus.web3 = new Web3(engine)
  torus.setProviderType = function(network) {
    window.Vue.$store.dispatch('setProviderType', { network })
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

  const providerOutStream = torus.metamaskMux.createStream('provider')

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

  window.web3 = new Web3(iframeMetamask)
  pump(iframeMetamask.mux, reverseMux, iframeMetamask.mux)

  var rStream = routerStream(providerOutStream, reverseMux.createStream('provider'))

  rStream.mergeSteam
    .pipe(sendPassThroughStream)
    .pipe(providerStream)
    .pipe(receivePassThroughStream)
    .pipe(rStream.splitStream)

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
