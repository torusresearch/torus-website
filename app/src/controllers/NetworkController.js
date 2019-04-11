const assert = require('assert')
const EventEmitter = require('events')
const ObservableStore = require('obs-store')
const ComposedStore = require('obs-store/lib/composed')
const log = require('loglevel')
const mergeMiddleware = require('json-rpc-engine/src/mergeMiddleware')
const createScaffoldMiddleware = require('json-rpc-engine/src/createScaffoldMiddleware')
const createBlockReRefMiddleware = require('eth-json-rpc-middleware/block-ref')
const createRetryOnEmptyMiddleware = require('eth-json-rpc-middleware/retryOnEmpty')
const createBlockCacheMiddleware = require('eth-json-rpc-middleware/block-cache')
const createInflightMiddleware = require('eth-json-rpc-middleware/inflight-cache')
const createBlockTrackerInspectorMiddleware = require('eth-json-rpc-middleware/block-tracker-inspector')
const providerFromMiddleware = require('eth-json-rpc-middleware/providerFromMiddleware')
const createInfuraMiddleware = require('eth-json-rpc-infura')
const BlockTracker = require('eth-block-tracker')
const EthQuery = require('eth-query')
const createMetamaskMiddleware = require('../utils/createMetamaskMiddleware').default
const JsonRpcEngine = require('json-rpc-engine')
const providerFromEngine = require('eth-json-rpc-middleware/providerFromEngine')
const { createSwappableProxy, createEventEmitterProxy } = require('swappable-obj-proxy')

// defaults and constants
const defaultProviderConfig = { type: 'mainnet' }
const defaultNetworkConfig = { ticker: 'ETH' }
const networks = { networkList: {} }
const { ROPSTEN, RINKEBY, KOVAN, MAINNET, LOCALHOST } = require('../utils/enums')
const INFURA_PROVIDER_TYPES = [ROPSTEN, RINKEBY, KOVAN, MAINNET]

export default class NetworkController extends EventEmitter {
  /**
   * @constructor
   * @param {Object} opts
   */
  constructor(opts = {}) {
    super()
    this.defaultMaxListeners = 20
    const providerConfig = opts.provider || defaultProviderConfig
    this.providerStore = new ObservableStore(providerConfig)
    this.networkStore = new ObservableStore('loading')
    this.networkConfig = new ObservableStore(defaultNetworkConfig)
    // TODO: change to use ComposableObservableStore
    this.store = new ComposedStore({
      provider: this.providerStore,
      network: this.networkStore,
      settings: this.networkConfig
    })
    this.on('networkDidChange', this.lookupNetwork)
    // provider and block tracker
    this._provider = null
    this._blockTracker = null
    // provider and block tracker proxies - because the network changes
    this._providerProxy = null
    this._blockTrackerProxy = null
  }

  /**
   * Helper method for initializing provider
   */
  initializeProvider(providerParams) {
    this._baseProviderParams = providerParams
    const { type, rpcTarget, chainId, ticker, nickname } = this.providerStore.getState()
    this._configureProvider({ type, rpcTarget, chainId, ticker, nickname })
    this.lookupNetwork()
    return this._providerProxy
  }

  /**
   * Returns proxies so the references will always be good
   */
  getProviderAndBlockTracker() {
    const provider = this._providerProxy
    const blockTracker = this._blockTrackerProxy
    return { provider, blockTracker }
  }

  /**
   * For checking network when restoring connectivity
   */
  verifyNetwork() {
    if (this.isNetworkLoading()) this.lookupNetwork()
  }

  /**
   * Get network state
   */
  getNetworkState() {
    return this.networkStore.getState()
  }

  /**
   * Get network config
   */
  getNetworkConfig() {
    return this.networkConfig.getState()
  }

  /**
   * Set network state
   * @param {string} network
   * @param {Object} type
   */
  setNetworkState(network, type) {
    if (network === 'loading') {
      return this.networkStore.putState(network)
    }
    if (!type) {
      return
    }
    // eslint-disable-next-line no-param-reassign
    network = networks.networkList[type] && networks.networkList[type].chainId ? networks.networkList[type].chainId : network
    return this.networkStore.putState(network)
  }

  /**
   * Return networking loading status
   */
  isNetworkLoading() {
    return this.getNetworkState() === 'loading'
  }

  /**
   * Return network type
   */
  lookupNetwork() {
    // Prevent firing when provider is not defined.
    if (!this._provider) {
      return log.warn('NetworkController - lookupNetwork aborted due to missing provider')
    }
    const { type } = this.providerStore.getState()
    const ethQuery = new EthQuery(this._provider)
    const initialNetwork = this.getNetworkState()
    ethQuery.sendAsync({ method: 'net_version' }, (err, network) => {
      const currentNetwork = this.getNetworkState()
      if (initialNetwork === currentNetwork) {
        if (err) {
          return this.setNetworkState('loading')
        }
        log.info('web3.getNetwork returned ' + network)
        this.setNetworkState(network, type)
      }
    })
  }

  /**
   * Set provider
   * @param {string} type
   */
  async setProviderType(type) {
    assert.notStrictEqual(type, 'rpc', 'NetworkController - cannot call "setProviderType" with type \'rpc\'. use "setRpcTarget"')
    assert(INFURA_PROVIDER_TYPES.includes(type) || type === LOCALHOST, `NetworkController - Unknown rpc type "${type}"`)
    const providerConfig = { type }
    this.providerConfig = providerConfig
  }

  /**
   * Reset network connection
   */
  resetConnection() {
    this.providerConfig = this.getProviderConfig()
  }

  /**
   * Setter for providerConfig
   */
  set providerConfig(providerConfig) {
    this.providerStore.updateState(providerConfig)
    this._switchNetwork(providerConfig)
  }

  /**
   * Getter for providerConfig
   */
  getProviderConfig() {
    return this.providerStore.getState()
  }

  _switchNetwork(opts) {
    this.setNetworkState('loading')
    this._configureProvider(opts)
    this.emit('networkDidChange')
  }

  _configureProvider(opts) {
    // infura type-based endpoints
    const isInfura = INFURA_PROVIDER_TYPES.includes(opts.type)
    if (isInfura) {
      this._configureInfuraProvider(opts)
    } else {
      throw new Error(`NetworkController - _configureProvider - unknown type "${opts.type}"`)
    }
  }

  _configureInfuraProvider({ type }) {
    log.info('NetworkController - configureInfuraProvider', type)
    const networkClient = createInfuraClient({ network: type })
    this._setNetworkClient(networkClient)
    // setup networkConfig
    var settings = {
      ticker: 'ETH'
    }
    this.networkConfig.putState(settings)
  }

  _setNetworkClient({ networkMiddleware, blockTracker }) {
    const metamaskMiddleware = createMetamaskMiddleware(this._baseProviderParams)
    const engine = new JsonRpcEngine()
    engine.push(metamaskMiddleware)
    engine.push(networkMiddleware)
    const provider = providerFromEngine(engine)
    this._setProviderAndBlockTracker({ provider, blockTracker })
  }

  _setProviderAndBlockTracker({ provider, blockTracker }) {
    // update or intialize proxies
    if (this._providerProxy) {
      this._providerProxy.setTarget(provider)
    } else {
      this._providerProxy = createSwappableProxy(provider)
    }
    if (this._blockTrackerProxy) {
      this._blockTrackerProxy.setTarget(blockTracker)
    } else {
      this._blockTrackerProxy = createEventEmitterProxy(blockTracker, { eventFilter: 'skipInternal' })
    }
    // set new provider and blockTracker
    this._provider = provider
    this._blockTracker = blockTracker
  }

  _logBlock(block) {
    log.info(`BLOCK CHANGED: #${block.number.toString('hex')} 0x${block.hash.toString('hex')}`)
    this.verifyNetwork()
  }
}

function createInfuraClient({ network }) {
  const infuraMiddleware = createInfuraMiddleware({ network })
  const infuraProvider = providerFromMiddleware(infuraMiddleware)
  const blockTracker = new BlockTracker({ provider: infuraProvider })

  const networkMiddleware = mergeMiddleware([
    createNetworkAndChainIdMiddleware({ network }),
    createBlockCacheMiddleware({ blockTracker }),
    createInflightMiddleware(),
    createBlockReRefMiddleware({ blockTracker, provider: infuraProvider }),
    createRetryOnEmptyMiddleware({ blockTracker, provider: infuraProvider }),
    createBlockTrackerInspectorMiddleware({ blockTracker }),
    infuraMiddleware
  ])
  return { networkMiddleware, blockTracker }
}

function createNetworkAndChainIdMiddleware({ network }) {
  let chainId
  let netId

  switch (network) {
    case 'mainnet':
      netId = '1'
      chainId = '0x01'
      break
    case 'ropsten':
      netId = '3'
      chainId = '0x03'
      break
    case 'rinkeby':
      netId = '4'
      chainId = '0x04'
      break
    case 'kovan':
      netId = '42'
      chainId = '0x2a'
      break
    default:
      throw new Error(`createInfuraClient - unknown network "${network}"`)
  }

  return createScaffoldMiddleware({
    eth_chainId: chainId,
    net_version: netId
  })
}
