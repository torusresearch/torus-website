import assert from 'assert'
import EventEmitter from 'events'
import ObservableStore from 'obs-store'
import ComposedStore from 'obs-store/lib/composed'
import log from 'loglevel'
import mergeMiddleware from 'json-rpc-engine/src/mergeMiddleware'
import createScaffoldMiddleware from 'json-rpc-engine/src/createScaffoldMiddleware'
import createBlockReRefMiddleware from 'eth-json-rpc-middleware/block-ref'
import createRetryOnEmptyMiddleware from 'eth-json-rpc-middleware/retryOnEmpty'
import createBlockCacheMiddleware from 'eth-json-rpc-middleware/block-cache'
import createInflightMiddleware from 'eth-json-rpc-middleware/inflight-cache'
import createBlockTrackerInspectorMiddleware from 'eth-json-rpc-middleware/block-tracker-inspector'
import providerFromMiddleware from 'eth-json-rpc-middleware/providerFromMiddleware'
import createFetchMiddleware from 'eth-json-rpc-middleware/fetch'
import createBlockRefRewriteMiddleware from 'eth-json-rpc-middleware/block-ref-rewrite'
import createInfuraMiddleware from 'eth-json-rpc-infura'
import BlockTracker from 'eth-block-tracker'
import EthQuery from 'eth-query'
import JsonRpcEngine from 'json-rpc-engine'
import providerFromEngine from 'eth-json-rpc-middleware/providerFromEngine'
import { createSwappableProxy, createEventEmitterProxy } from 'swappable-obj-proxy'

import createMetamaskMiddleware from '../utils/createMetamaskMiddleware'
import {
  ROPSTEN,
  RINKEBY,
  KOVAN,
  MAINNET,
  LOCALHOST,
  GOERLI,
  MATIC,
  MATIC_URL,
  MATIC_CODE,
  MAINNET_CODE,
  GOERLI_CODE,
  ROPSTEN_CODE,
  KOVAN_CODE,
  RINKEBY_CODE,
  SUPPORTED_NETWORK_TYPES
} from '../utils/enums'

// defaults and constants
const defaultProviderConfig = { type: 'mainnet' }
const defaultNetworkConfig = { ticker: 'ETH' }
const networks = { networkList: {} }
const INFURA_PROVIDER_TYPES = [ROPSTEN, RINKEBY, KOVAN, MAINNET, GOERLI]

export default class NetworkController extends EventEmitter {
  /**
   * @constructor
   * @param {Object} opts
   */
  constructor(opts = {}) {
    super()
    this.defaultMaxListeners = 20
    const providerConfig = opts.provider || defaultProviderConfig
    log.info(providerConfig)
    if (!SUPPORTED_NETWORK_TYPES[providerConfig.rpcTarget]) {
      providerConfig.type = 'rpc'
    }
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

  getNetworkNameFromNetworkCode() {
    switch (parseInt(this.getNetworkState())) {
      case MAINNET_CODE:
        return MAINNET

      case RINKEBY_CODE:
        return RINKEBY

      case ROPSTEN_CODE:
        return ROPSTEN

      case KOVAN_CODE:
        return KOVAN

      case GOERLI_CODE:
        return GOERLI
      default:
        return 'loading'
    }
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

  setRpcTarget(rpcTarget, chainId, ticker = 'ETH', nickname = '', rpcPrefs) {
    const providerConfig = {
      type: 'rpc',
      rpcTarget,
      chainId,
      ticker,
      nickname,
      rpcPrefs
    }
    this.providerConfig = providerConfig
  }

  /**
   * Set provider
   * @param {string} type
   */
  async setProviderType(type, rpcTarget = '', ticker = 'ETH', nickname = '') {
    assert.notStrictEqual(type, 'rpc', 'NetworkController - cannot call "setProviderType" with type \'rpc\'. use "setRpcTarget"')
    assert(INFURA_PROVIDER_TYPES.includes(type) || type === LOCALHOST || type === MATIC, `NetworkController - Unknown rpc type "${type}"`)
    const providerConfig = { type, rpcTarget, ticker, nickname }
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
    const { type, rpcTarget, chainId, ticker, nickname } = opts
    // infura type-based endpoints
    const isInfura = INFURA_PROVIDER_TYPES.includes(type)
    if (isInfura) {
      this._configureInfuraProvider(opts)
    } else if (type === LOCALHOST) {
      this._configureLocalhostProvider()
      // url-based rpc endpoints
    } else if (type === MATIC) {
      this._configureStandardProvider({ rpcUrl: MATIC_URL, MATIC_CODE, MATIC, MATIC })
    } else if (type === 'rpc') {
      this._configureStandardProvider({ rpcUrl: rpcTarget, chainId, ticker, nickname })
    } else {
      throw new Error(`NetworkController - _configureProvider - unknown type "${type}"`)
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

  _configureLocalhostProvider() {
    log.info('NetworkController - configureLocalhostProvider')
    const networkClient = createLocalhostClient()
    this._setNetworkClient(networkClient)
  }

  _configureStandardProvider({ rpcUrl, chainId, ticker, nickname }) {
    log.info('NetworkController - configureStandardProvider', rpcUrl)
    const networkClient = createJsonRpcClient({ rpcUrl })
    // hack to add a 'rpc' network with chainId
    networks.networkList['rpc'] = {
      chainId: chainId,
      rpcUrl,
      ticker: ticker || 'ETH',
      nickname
    }
    // setup networkConfig
    var settings = {
      network: chainId
    }
    settings = { ...settings, ...networks.networkList['rpc'] }
    this.networkConfig.putState(settings)
    this._setNetworkClient(networkClient)
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
    provider.setMaxListeners(100)
    this._blockTracker = blockTracker
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
    case 'goerli':
      netId = '5'
      chainId = '0x05'
      break
    default:
      throw new Error(`createInfuraClient - unknown network "${network}"`)
  }

  return createScaffoldMiddleware({
    eth_chainId: chainId,
    net_version: netId
  })
}

function createLocalhostClient() {
  const fetchMiddleware = createFetchMiddleware({ rpcUrl: 'https://localhost:8545/' })
  const blockProvider = providerFromMiddleware(fetchMiddleware)
  const blockTracker = new BlockTracker({ provider: blockProvider, pollingInterval: 1000 })

  const networkMiddleware = mergeMiddleware([
    createBlockRefRewriteMiddleware({ blockTracker }),
    createBlockTrackerInspectorMiddleware({ blockTracker }),
    fetchMiddleware
  ])
  return { networkMiddleware, blockTracker }
}

function createJsonRpcClient({ rpcUrl }) {
  const fetchMiddleware = createFetchMiddleware({ rpcUrl })
  const blockProvider = providerFromMiddleware(fetchMiddleware)
  const blockTracker = new BlockTracker({ provider: blockProvider })

  const networkMiddleware = mergeMiddleware([
    createBlockRefRewriteMiddleware({ blockTracker }),
    createBlockCacheMiddleware({ blockTracker }),
    createInflightMiddleware(),
    createBlockTrackerInspectorMiddleware({ blockTracker }),
    fetchMiddleware
  ])
  return { networkMiddleware, blockTracker }
}
