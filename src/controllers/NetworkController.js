import { ComposedStore, ObservableStore } from '@metamask/obs-store'
import assert from 'assert'
import { PollingBlockTracker } from 'eth-block-tracker'
import createInfuraMiddleware from 'eth-json-rpc-infura'
import {
  createBlockCacheMiddleware,
  createBlockRefMiddleware,
  createBlockRefRewriteMiddleware,
  createBlockTrackerInspectorMiddleware,
  createFetchMiddleware,
  createInflightCacheMiddleware,
  createRetryOnEmptyMiddleware,
  providerFromEngine,
  providerFromMiddleware,
} from 'eth-json-rpc-middleware'
import EthQuery from 'eth-query'
import EventEmitter from 'events'
import { createScaffoldMiddleware, JsonRpcEngine, mergeMiddleware } from 'json-rpc-engine'
import log from 'loglevel'
import { createEventEmitterProxy, createSwappableProxy } from 'swappable-obj-proxy'

import config from '../config'
import {
  BSC_MAINNET,
  BSC_MAINNET_CODE,
  BSC_MAINNET_DISPLAY_NAME,
  BSC_MAINNET_URL,
  BSC_TESTNET,
  BSC_TESTNET_CODE,
  BSC_TESTNET_DISPLAY_NAME,
  BSC_TESTNET_URL,
  BSC_TICKER,
  GOERLI,
  KOVAN,
  LOCALHOST,
  MAINNET,
  MATIC,
  MATIC_CODE,
  MATIC_DISPLAY_NAME,
  MATIC_TICKER,
  MATIC_URL,
  MUMBAI,
  MUMBAI_CODE,
  MUMBAI_DISPLAY_NAME,
  MUMBAI_URL,
  RINKEBY,
  ROPSTEN,
  RPC,
  SUPPORTED_NETWORK_TYPES,
  XDAI,
  XDAI_CODE,
  XDAI_DISPLAY_NAME,
  XDAI_TICKER,
  XDAI_URL,
} from '../utils/enums'
import createMetamaskMiddleware from './utils/createMetamaskMiddleware'

// defaults and constants
const defaultProviderConfig = { type: 'mainnet' }
const defaultNetworkConfig = { ticker: 'ETH' }
const networks = { networkList: {} }
const INFURA_PROVIDER_TYPES = new Set([ROPSTEN, RINKEBY, KOVAN, MAINNET, GOERLI])
const TORUS_PROVIDER_TYPES = new Set([MATIC, MUMBAI, BSC_MAINNET, BSC_TESTNET, XDAI])

export default class NetworkController extends EventEmitter {
  /**
   * @constructor
   * @param {Object} opts
   */
  constructor(options = {}) {
    super()
    this.defaultMaxListeners = 20
    const providerConfig = options.provider || defaultProviderConfig
    log.info(providerConfig)
    if (!SUPPORTED_NETWORK_TYPES[providerConfig.rpcTarget]) {
      providerConfig.type = RPC
    }
    this.providerStore = new ObservableStore(providerConfig)
    this.networkStore = new ObservableStore('loading')
    this.networkConfig = new ObservableStore(defaultNetworkConfig)
    // TODO: change to use ComposableObservableStore
    this.store = new ComposedStore({
      provider: this.providerStore,
      network: this.networkStore,
      settings: this.networkConfig,
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
    const { type, rpcTarget } = this.getProviderConfig()
    if (type === RPC) return rpcTarget
    return type
  }

  /**
   * Helper method for initializing provider
   */
  initializeProvider(providerParameters) {
    this._baseProviderParams = providerParameters
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
  setNetworkState(network, type, force = false) {
    if (network === 'loading') {
      this.networkStore.putState(network)
      return
    }
    if (!type) {
      return
    }
    let cachedNetwork
    if (force) {
      cachedNetwork = network
    } else if (networks.networkList[type] && networks.networkList[type].chainId) {
      cachedNetwork = networks.networkList[type].chainId
    } else cachedNetwork = network
    this.networkStore.putState(cachedNetwork)
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
      log.warn('NetworkController - lookupNetwork aborted due to missing provider')
      return
    }
    const { type } = this.providerStore.getState()
    const ethQuery = new EthQuery(this._provider)
    const initialNetwork = this.getNetworkState()
    ethQuery.sendAsync({ method: 'net_version' }, (error, network) => {
      const currentNetwork = this.getNetworkState()
      if (initialNetwork === currentNetwork) {
        if (error) {
          this.setNetworkState('loading')
          return
        }
        log.info(`web3.getNetwork returned ${network}`)
        this.setNetworkState(network, type, true)
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
      rpcPrefs,
    }
    this.providerConfig = providerConfig
  }

  /**
   * Set provider
   * @param {string} type
   */
  async setProviderType(type, rpcTarget = '', ticker = 'ETH', nickname = '') {
    assert.notStrictEqual(type, 'rpc', 'NetworkController - cannot call "setProviderType" with type \'rpc\'. use "setRpcTarget"')
    assert(INFURA_PROVIDER_TYPES.has(type) || type === LOCALHOST || TORUS_PROVIDER_TYPES.has(type), `NetworkController - Unknown rpc type "${type}"`)
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

  _switchNetwork(options) {
    this.setNetworkState('loading')
    this._configureProvider(options)
    this.emit('networkDidChange')
  }

  _configureProvider(options) {
    const { type, rpcTarget, chainId, ticker, nickname } = options
    // infura type-based endpoints
    const isInfura = INFURA_PROVIDER_TYPES.has(type)
    if (isInfura) {
      this._configureInfuraProvider(options)
    } else if (type === LOCALHOST) {
      this._configureLocalhostProvider()
      // url-based rpc endpoints
    } else if (type === MATIC) {
      this._configureStandardProvider({ rpcUrl: MATIC_URL, chainId: MATIC_CODE, ticker: MATIC_TICKER, nickname: MATIC_DISPLAY_NAME })
    } else if (type === MUMBAI) {
      this._configureStandardProvider({ rpcUrl: MUMBAI_URL, chainId: MUMBAI_CODE, ticker: MATIC_TICKER, nickname: MUMBAI_DISPLAY_NAME })
    } else if (type === BSC_MAINNET) {
      this._configureStandardProvider({ rpcUrl: BSC_MAINNET_URL, chainId: BSC_MAINNET_CODE, ticker: BSC_TICKER, nickname: BSC_MAINNET_DISPLAY_NAME })
    } else if (type === BSC_TESTNET) {
      this._configureStandardProvider({ rpcUrl: BSC_TESTNET_URL, chainId: BSC_TESTNET_CODE, ticker: BSC_TICKER, nickname: BSC_TESTNET_DISPLAY_NAME })
    } else if (type === XDAI) {
      this._configureStandardProvider({ rpcUrl: XDAI_URL, chainId: XDAI_CODE, ticker: XDAI_TICKER, nickname: XDAI_DISPLAY_NAME })
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
    const settings = {
      ticker: 'ETH',
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
    networks.networkList.rpc = {
      chainId,
      rpcUrl,
      ticker: ticker || 'ETH',
      nickname,
    }
    // setup networkConfig
    let settings = {
      network: chainId,
    }
    settings = { ...settings, ...networks.networkList.rpc }
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
  const infuraMiddleware = createInfuraMiddleware({ network, projectId: config.infuraKey })
  const infuraProvider = providerFromMiddleware(infuraMiddleware)
  const blockTracker = new PollingBlockTracker({ provider: infuraProvider })

  const networkMiddleware = mergeMiddleware([
    createNetworkAndChainIdMiddleware({ network }),
    createBlockCacheMiddleware({ blockTracker }),
    createInflightCacheMiddleware(),
    createBlockRefMiddleware({ blockTracker, provider: infuraProvider }),
    createRetryOnEmptyMiddleware({ blockTracker, provider: infuraProvider }),
    createBlockTrackerInspectorMiddleware({ blockTracker }),
    infuraMiddleware,
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
    net_version: netId,
  })
}

function createLocalhostClient() {
  const fetchMiddleware = createFetchMiddleware({ rpcUrl: 'https://localhost:8545/' })
  const blockProvider = providerFromMiddleware(fetchMiddleware)
  const blockTracker = new PollingBlockTracker({ provider: blockProvider, pollingInterval: 1000 })

  const networkMiddleware = mergeMiddleware([
    createBlockRefRewriteMiddleware({ blockTracker }),
    createBlockTrackerInspectorMiddleware({ blockTracker }),
    fetchMiddleware,
  ])
  return { networkMiddleware, blockTracker }
}

function createJsonRpcClient({ rpcUrl }) {
  const fetchMiddleware = createFetchMiddleware({ rpcUrl })
  const blockProvider = providerFromMiddleware(fetchMiddleware)
  const blockTracker = new PollingBlockTracker({ provider: blockProvider })

  const networkMiddleware = mergeMiddleware([
    createBlockRefRewriteMiddleware({ blockTracker }),
    createBlockCacheMiddleware({ blockTracker }),
    createInflightCacheMiddleware(),
    createBlockTrackerInspectorMiddleware({ blockTracker }),
    fetchMiddleware,
  ])
  return { networkMiddleware, blockTracker }
}
