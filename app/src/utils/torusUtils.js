// import WebsocketSubprovider from './websocket.js'
import TorusController from './TorusController'
var Elliptic = require('elliptic').ec
var log = require('loglevel')
var BN = require('bn.js')
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
const toChecksumAddress = require('./toChecksumAddress').default
const setupMultiplex = require('./setupMultiplex').default

/* Provider engine setup block */

var engine = new ProviderEngine()
engine.addProvider(new FixtureSubprovider({
  web3_clientVersion: 'ProviderEngine/v0.0.0/javascript',
  net_listening: true,
  eth_hashrate: '0x00',
  eth_mining: false,
  eth_syncing: true
}))
engine.addProvider(new CacheSubprovider())
engine.addProvider(new FilterSubprovider())
engine.addProvider(new NonceSubprovider())
engine.addProvider(new VmSubprovider())
engine.addProvider(new HookedWalletEthTxSubprovider({
  getAccounts: function (cb) {
    var ethAddress = window.Vue.$store.state.selectedAddress
    console.log('GETTING ACCOUNT:', ethAddress)
    cb(null, ethAddress ? [toChecksumAddress(ethAddress)] : [])
  },
  getPrivateKey: function (address, cb) {
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
  approveTransaction: function (txParams, cb) {
    if (confirm('Confirm signature for transaction?')) { // TODO: add transaction details
      cb(null, true)
    } else {
      cb(new Error('User denied transaction.'), false)
    }
  }
}))
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
engine.on('block', function (block) {
  log.info('================================')
  log.info('BLOCK CHANGED:', '#' + block.number.toString('hex'), '0x' + block.hash.toString('hex'))
  log.info('================================')
})
engine.on('error', function (err) {
  log.error(err.stack)
})
engine.start()

/**
 * TODO: temporary, to be fixed with a Vue popup or something like that
 */
function triggerUi (type) {
  window.Vue.$store.dispatch('showPopup')
}

const torusController = new TorusController({
  showUnconfirmedMessage: triggerUi.bind(window, 'showUnconfirmedMessage'),
  unlockAccountMessage: triggerUi.bind(window, 'unlockAccountMessage'),
  showUnapprovedTx: triggerUi.bind(window, 'showUnapprovedTx'),
  openPopup: triggerUi.bind(window, 'bindopenPopup')
})

const rpcEngine = new RpcEngine()
const filterMiddleware = createFilterMiddleware({ provider: torusController.provider, blockTracker: torusController.blockTracker })
const subscriptionManager = createSubscriptionManager({ provider: torusController.provider, blockTracker: torusController.blockTracker })
subscriptionManager.events.on('notification', (message) => rpcEngine.emit('notification', message))
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

/* Provider engine setup block */

var TorusUtils = {
  ec: Elliptic('secp256k1'),
  setupMultiplex,
  metamaskMux: setupMultiplex(metamaskStream),
  communicationMux: setupMultiplex(communicationStream),
  updateStaticData: function (payload) {
    console.log('STATIC DATA:', payload)
    var publicConfigOutStream = TorusUtils.metamaskMux.getStream('publicConfig')
    if (payload.selectedAddress) {
      publicConfigOutStream.write(JSON.stringify({ selectedAddress: payload.selectedAddress }))
    } else if (payload.networkId) {
      publicConfigOutStream.write(JSON.stringify({ networkVersion: payload.networkId }))
    }
  },
  web3: new Web3(engine),
  retrieveShares: function (endpoints, email, idToken, cb) {
    var promiseArr = []
    var responses = []
    for (var i = 0; i < endpoints.length; i++) {
      var p = fetch(endpoints[i], {
        method: 'POST',
        cache: 'no-cache',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'ShareRequest',
          id: 10,
          params: {
            index: 0,
            idtoken: idToken,
            email: email
          }
        })
      }).then(res => res.json())
        .then(res => responses.push(res))
        .catch(err => {
          console.error(err)
        })
      promiseArr.push(p)
    }
    Promise.all(promiseArr).then(function () {
      console.log('completed')
      var shares = []
      var nodeIndex = []
      console.log(responses)
      responses.map(response => {
        shares.push(new BN(response.result.hexshare, 16))
        nodeIndex.push(new BN(response.result.index, 10))
      })
      console.log(shares, nodeIndex)
      var privateKey = TorusUtils.lagrangeInterpolation(shares.slice(2), nodeIndex.slice(2))
      var key = TorusUtils.ec.keyFromPrivate(privateKey.toString('hex'), 'hex')
      var publicKey = key.getPublic().encode('hex').slice(2)
      var ethAddressLower = '0x' + TorusUtils.web3.utils.keccak256(Buffer.from(publicKey, 'hex')).slice(64 - 38) // remove 0x
      var ethAddress = toChecksumAddress(ethAddressLower)
      cb(null, {
        ethAddress,
        privKey: privateKey.toString('hex')
      })
    })
  },
  lagrangeInterpolation: function (shares, nodeIndex) {
    if (shares.length !== nodeIndex.length) {
      log.error('Shares do not match up')
      return null
    }
    var secret = new BN(0)
    for (let i = 0; i < shares.length; i++) {
      var upper = new BN(1)
      var lower = new BN(1)
      for (let j = 0; j < shares.length; j++) {
        if (i !== j) {
          upper = upper.mul(nodeIndex[j].neg())
          upper = upper.umod(TorusUtils.ec.curve.n)
          let temp = nodeIndex[i].sub(nodeIndex[j])
          temp = temp.umod(TorusUtils.ec.curve.n)
          lower = lower.mul(temp).umod(TorusUtils.ec.curve.n)
        }
      }
      let delta = upper.mul(lower.invm(TorusUtils.ec.curve.n)).umod(TorusUtils.ec.curve.n)
      delta = delta.mul(shares[i]).umod(TorusUtils.ec.curve.n)
      secret = secret.add(delta)
    }
    return secret.umod(TorusUtils.ec.curve.n)
  },
  getPubKeyAsync: function (web3, endpoints, email, cb) {
    var promiseArr = []
    var shares = []
    for (var i = 0; i < endpoints.length; i++) {
      var p = fetch(endpoints[i], {
        method: 'POST',
        cache: 'no-cache',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'SecretAssign',
          id: 10,
          params: {
            email
          }
        })
      }).then(res => res.json())
        .then(res => shares.push(res))
        .catch(err => {
          console.error(err)
        })
      promiseArr.push(p)
    }
    Promise.all(promiseArr).then(function () {
      promiseArr = []
      shares = []
      for (var i = 0; i < endpoints.length; i++) {
        var p = fetch(endpoints[i], {
          method: 'POST',
          cache: 'no-cache',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'SecretAssign',
            id: 10,
            params: {
              email
            }
          })
        }).then(res => res.json())
          .then(res => shares.push(res))
          .catch(err => {
            console.error(err)
          })
        promiseArr.push(p)
      }
      return Promise.all(promiseArr)
    }).then(function () {
      try {
        console.log('completed')
        console.log(shares)
        var Xs = {}
        var Ys = {}
        shares.map(function (share) {
          if (share.result && share.result.PubShareX) {
            if (Xs[share.result.PubShareX] === undefined) {
              Xs[share.result.PubShareX] = 1
            } else {
              Xs[share.result.PubShareX]++
            }
          }
          if (share.result && share.result.PubShareY) {
            if (Ys[share.result.PubShareY] === undefined) {
              Ys[share.result.PubShareY] = 1
            } else {
              Ys[share.result.PubShareY]++
            }
          }
        })
        var finalX
        var finalY
        for (let key in Xs) {
          if (Xs[key] >= 3) {
            finalX = key
          }
        }
        for (let key in Ys) {
          if (Ys[key] >= 3) {
            finalY = key
          }
        }
        var pubk = TorusUtils.ec.keyFromPublic({
          x: finalX,
          y: finalY
        }).pub
        console.log(pubk.encode('hex'))
        var publicKey = pubk.encode('hex').slice(2)
        var ethAddress = '0x' + web3.utils.keccak256(Buffer.from(publicKey, 'hex')).slice(64 - 38)
        console.log(ethAddress)
        cb(null, ethAddress)
      } catch (err) {
        cb(err, null)
      }
    })
  }
}

/* Stream setup block */

var transformStream = new stream.Transform({
  objectMode: true,
  transform: function (chunk, enc, cb) {
    log.info('TRANSFORM', chunk)
    try {
      if (chunk.method === 'eth_call' || chunk.method === 'eth_estimateGas') {
        log.info('transforming:', chunk.params[0].from)
        if (chunk.params[0].from && typeof chunk.params[0].from === 'string') {
          if (chunk.params[0].from.substring(0, 2) === '0x') {
            chunk.params[0].from = Buffer.from(chunk.params[0].from.slice(2), 'hex')
          }
        } else if (!chunk.params[0].from) {
          chunk.params[0].from = []
        }
        log.info('transformed:', chunk.params[0].from)
      }
      cb(null, chunk)
    } catch (err) {
      log.error('Could not transform stream data', err)
      cb(err, null)
    }
  }
})

// doesnt do anything.. just for logging
// since the stack traces are constrained to a single javascript context
// we use a passthrough stream to log method calls
var receivePassThroughStream = new stream.PassThrough({ objectMode: true })
receivePassThroughStream.on('data', function () {
  log.info('receivePassThroughStream', arguments)
})

var sendPassThroughStream = new stream.PassThrough({ objectMode: true })
sendPassThroughStream.on('data', function () {
  log.info('sendPassThroughStream', arguments)
})

const providerOutStream = TorusUtils.metamaskMux.createStream('provider')

pump(
  providerOutStream,
  sendPassThroughStream,
  transformStream,
  providerStream,
  receivePassThroughStream,
  providerOutStream,
  (err) => {
    if (err) log.error(err)
  }
)

/* Stream setup block */

function createLoggerMiddleware (opts) {
  return function loggerMiddleware (/** @type {any} */ req, /** @type {any} */ res, /** @type {Function} */ next) {
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

function createProviderMiddleware ({ provider }) {
  return (req, res, next, end) => {
    provider.sendAsync(req, (err, _res) => {
      if (err) return end(err)
      res.result = _res.result
      end()
    })
  }
}

function createOriginMiddleware (opts) {
  return function originMiddleware (req, res, next) {
    req.origin = opts.origin
    next()
  }
}

export default TorusUtils
