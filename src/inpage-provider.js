const pump = require('pump')
const RpcEngine = require('json-rpc-engine')
const createErrorMiddleware = require('./createErrorMiddleware')
const createIdRemapMiddleware = require('json-rpc-engine/src/idRemapMiddleware')
const createJsonRpcStream = require('json-rpc-middleware-stream')
const LocalStorageStore = require('obs-store')
const ObjectMultiplex = require('obj-multiplex')
const util = require('util')
const SafeEventEmitter = require('safe-event-emitter')
const setupMultiplex = require('./stream-utils.js').setupMultiplex
const DuplexStream = require('readable-stream').Duplex

module.exports = MetamaskInpageProvider

util.inherits(MetamaskInpageProvider, SafeEventEmitter)

function MetamaskInpageProvider (connectionStream) {
  const self = this

  // super constructor
  SafeEventEmitter.call(self)

  // setup connectionStream multiplexing
  const mux = setupMultiplex(connectionStream)
  const publicConfigStream = mux.createStream('publicConfig')

  // subscribe to metamask public config (one-way)
  // self.publicConfigStore = new LocalStorageStore({ storageKey: 'MetaMask-Config' })

  class LocalStorageStream extends DuplexStream {
    constructor() {
      super({objectMode: true})
    }
  }

  LocalStorageStore.prototype._read = function(chunk, enc, cb) {
    console.log('reading from LocalStorageStore')
  }

  LocalStorageStore.prototype._onMessage = function(event) {
    console.log('LocalStorageStore', event)
  }

  LocalStorageStream.prototype._write = function(chunk, enc, cb) {
    let data = JSON.parse(chunk)
    for (let key in data) {
      if (key == "selectedAddress") {
        if (data.selectedAddress !== null) {
          window.sessionStorage.setItem("selectedAddress", data.selectedAddress)
        } else {
          window.sessionStorage.removeItem("selectedAddress")
        }
      } else {
        window.sessionStorage.setItem(key, data[key])
      }
    }
    cb()
  }

  window.lss = new LocalStorageStream()

  pump(
    publicConfigStream,
    window.lss
  )

  // ignore phishing warning message (handled elsewhere)
  mux.ignoreStream('phishing')

  // connect to async provider
  const jsonRpcConnection = createJsonRpcStream()
  pump(
    jsonRpcConnection.stream,
    mux.createStream('provider'),
    jsonRpcConnection.stream,
    logStreamDisconnectWarning.bind(this, 'MetaMask RpcProvider')
  )

  // handle sendAsync requests via dapp-side rpc engine
  const rpcEngine = new RpcEngine()
  // rpcEngine.push(createIdRemapMiddleware()) // TODO: fix?
  rpcEngine.push(createErrorMiddleware())
  rpcEngine.push(jsonRpcConnection.middleware)
  self.rpcEngine = rpcEngine

  // forward json rpc notifications
  jsonRpcConnection.events.on('notification', function(payload) {
    self.emit('data', null, payload)
  })

  // Work around for https://github.com/metamask/metamask-extension/issues/5459
  // drizzle accidently breaking the `this` reference
  self.send = self.send.bind(self)
  self.sendAsync = self.sendAsync.bind(self)
}

// Web3 1.0 provider uses `send` with a callback for async queries
MetamaskInpageProvider.prototype.send = function (payload, callback) {
  const self = this

  if (callback) {
    self.sendAsync(payload, callback)
  } else {
    return self._sendSync(payload)
  }
}

// handle sendAsync requests via asyncProvider
// also remap ids inbound and outbound
MetamaskInpageProvider.prototype.sendAsync = function (payload, cb) {
  console.log('ASYNC REQUEST', payload)
  const self = this
  self.rpcEngine.handle(payload, cb)
}

MetamaskInpageProvider.prototype._sendSync = function (payload) {
  const self = this

  let selectedAddress
  let result = null
  switch (payload.method) {

    case 'eth_accounts':
      // read from localStorage
      selectedAddress = window.sessionStorage.getItem('selectedAddress')
      result = selectedAddress ? [selectedAddress] : []
      break

    case 'eth_coinbase':
      // read from localStorage
      selectedAddress = window.sessionStorage.getItem('selectedAddress')
      result = selectedAddress || null
      break

    case 'eth_uninstallFilter':
      self.sendAsync(payload, noop)
      result = true
      break

    case 'net_version':
      console.log('NET VERSION REQUESTED')
      const networkVersion = window.sessionStorage.getItem('networkVersion')
      result = networkVersion || null
      break

    // throw not-supported Error
    default:
      var link = 'https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md#dizzy-all-async---think-of-metamask-as-a-light-client'
      var message = `The MetaMask Web3 object does not support synchronous methods like ${payload.method} without a callback parameter. See ${link} for details.`
      throw new Error(message)

  }

  // return the result
  return {
    id: payload.id,
    jsonrpc: payload.jsonrpc,
    result: result,
  }
}

MetamaskInpageProvider.prototype.isConnected = function () {
  return true
}

MetamaskInpageProvider.prototype.isMetaMask = true

// util

function logStreamDisconnectWarning (remoteLabel, err) {
  let warningMsg = `MetamaskInpageProvider - lost connection to ${remoteLabel}`
  if (err) warningMsg += '\n' + err.stack
  console.warn(warningMsg)
  const listeners = this.listenerCount('error')
  if (listeners > 0) {
    this.emit('error', warningMsg)
  }
}

function noop () {}