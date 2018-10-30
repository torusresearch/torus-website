const ProviderEngine = require('web3-provider-engine')
const CacheSubprovider = require('web3-provider-engine/subproviders/cache.js')
const FixtureSubprovider = require('web3-provider-engine/subproviders/fixture.js')
const FilterSubprovider = require('web3-provider-engine/subproviders/filters.js')
const VmSubprovider = require('web3-provider-engine/subproviders/vm.js')
const HookedWalletEthTxSubprovider = require('web3-provider-engine/subproviders/hooked-wallet-ethtx.js')
const NonceSubprovider = require('web3-provider-engine/subproviders/nonce-tracker.js')
const RpcSubprovider = require('web3-provider-engine/subproviders/rpc.js')
const Web3 = require('web3')
const createEngineStream = require('json-rpc-middleware-stream/engineStream')
const pump = require('pump')
const setupMultiplex = require('./stream-utils.js').setupMultiplex
// const ObservableStore = require('obs-store')
const RpcEngine = require('json-rpc-engine')
const createFilterMiddleware = require('eth-json-rpc-filters')
const log = require('loglevel')
// const DuplexStream = require('readable-stream').Duplex
const stream = require('stream')

var engine = new ProviderEngine()
engine.addProvider(new FixtureSubprovider({
  web3_clientVersion: 'ProviderEngine/v0.0.0/javascript',
  net_listening: true,
  eth_hashrate: '0x00',
  eth_mining: false,
  eth_syncing: true,
}))
engine.addProvider(new CacheSubprovider())
engine.addProvider(new FilterSubprovider())
engine.addProvider(new NonceSubprovider())
engine.addProvider(new VmSubprovider())
engine.addProvider(new HookedWalletEthTxSubprovider({
  getAccounts: function(cb) {
    cb(null, ['0x5657d2e6D362618Fb0DA4b90aa6e22eD86e30bfd'])
  },
  getPrivateKey: function(address, cb) {
    var wallet = {
      '0x5657d2e6D362618Fb0DA4b90aa6e22eD86e30bfd': Buffer('b019705e07dcd942c62a2eaa2075a2769ce187d0f9e76ce1aaf5a7b8e07c48c1', 'hex')
    }
    console.log('PRIVATE KEY RETRIEVED...')
    cb(null, wallet[address])
  },
  approveTransaction: function(txParams, cb) {
    if(confirm('sign?')) {
      cb(null, true)
    } else {
      cb(new Error('user say no'), false)
    }
  }
}))
var rpcSource = new RpcSubprovider({
  rpcUrl: 'https://mainnet.infura.io/4cQUeyeUSfkCXsgEAUH2',
  // rpcUrl: 'http://localhost:7545'
})
engine.addProvider(rpcSource)
engine.on('block', function(block){
  console.log('================================')
  console.log('BLOCK CHANGED:', '#'+block.number.toString('hex'), '0x'+block.hash.toString('hex'))
  console.log('================================')
})
engine.on('error', function(err){
  console.error(err.stack)
})
engine.start()
window.web3 = new Web3(engine)



/* 
 * Set up window.postMessage relay of 
 * the provider we have created above
 */

const LocalMessageDuplexStream = require('post-message-stream')
window.LocalMessageDuplexStream = LocalMessageDuplexStream
window.connectionStream = new LocalMessageDuplexStream({
  name: 'iframe',
  target: 'embed',
  targetWindow: document.getElementById('iframe1').contentWindow
})

const rpcEngine = new RpcEngine()
const providerStream = createEngineStream({engine: rpcEngine})
const filterMiddleware = createFilterMiddleware({
  provider: engine,
  blockTracker: engine._blockTracker,
})
rpcEngine.push(createOriginMiddleware({ origin: 'torus' }))
rpcEngine.push(createLoggerMiddleware({ origin: 'torus' }))
rpcEngine.push(filterMiddleware)
rpcEngine.push(createProviderMiddleware({ provider: engine }))


const mux = setupMultiplex(window.connectionStream)
const providerOutStream = mux.createStream('provider')
const publicConfigOutStream = mux.createStream('publicConfig')

function updateSelectedAddress() {
  web3.eth.getAccounts().then(res => {
    publicConfigOutStream.write(JSON.stringify({selectedAddress: res[0]}))
  }).catch(err => log.error(err))
}

// setTimeout(function() {
web3.eth.net.getId().then(res => {
  publicConfigOutStream.write(JSON.stringify({networkVersion: res}))
}).catch(err => log.error(err))
updateSelectedAddress()
// }, 10000)

var passthroughStream1 = new stream.PassThrough({objectMode: true});
passthroughStream1.on('data', function() {
  console.log('PASSTHROUGH1', arguments)
})

var passthroughStream2 = new stream.PassThrough({objectMode: true});
passthroughStream2.on('data', function() {
  console.log('PASSTHROUGH2', arguments)
})

var transformStream = new stream.Transform({
  objectMode: true,
  transform: function(chunk, enc, cb) {
    console.log('TRANSFORM', chunk)
    if (chunk && chunk.method && chunk.method === 'eth_call' && chunk.params && chunk.params[0] && chunk.params[0].from && chunk.params[0].from.substring(0,2) == '0x') {
      chunk.params[0].from = Buffer.from(chunk.params[0].from.slice(2), 'hex')
    }
    cb(null, chunk)
  }
})

pump(
  providerOutStream,
  transformStream,
  providerStream,
  passthroughStream2,
  providerOutStream,
  (err) => {
    if (err) log.error(err)
  }
)

function createOriginMiddleware (opts) {
  return function originMiddleware (req, res, next) {
    req.origin = opts.origin
    next()
  }
}

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
