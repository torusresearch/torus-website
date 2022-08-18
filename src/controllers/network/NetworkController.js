import { ComposedStore, ObservableStore } from '@metamask/obs-store'
import { JRPCEngine, mergeMiddleware } from '@toruslabs/openlogin-jrpc'
import assert from 'assert'
import { PollingBlockTracker } from 'eth-block-tracker'
import {
  createBlockRefRewriteMiddleware,
  createBlockTrackerInspectorMiddleware,
  createFetchMiddleware,
  providerFromEngine,
  providerFromMiddleware,
} from 'eth-json-rpc-middleware'
import EthQuery from 'eth-query'
import EventEmitter from 'events'
import log from 'loglevel'
import { createEventEmitterProxy, createSwappableProxy } from 'swappable-obj-proxy'

import { ETH, INFURA_PROVIDER_TYPES, LOCALHOST, MAINNET, MAINNET_CHAIN_ID, RPC, SUPPORTED_NETWORK_TYPES } from '../../utils/enums'
import { areProviderConfigsEqual } from '../../utils/utils'
import { createInfuraClient } from './createInfuraClient'
import { createJsonRpcClient } from './createJsonRpcClient'
import createMetamaskMiddleware from './createMetamaskMiddleware'

// defaults and constants
const defaultProviderConfig = { type: MAINNET, ticker: ETH.toUpperCase(), chainId: MAINNET_CHAIN_ID }
const defaultNetworkDetailsState = {
  EIPS: { 1559: undefined },
}
export default class NetworkController extends EventEmitter {
  /**
   * @constructor
   * @param {Object} opts
   */
  constructor(options = {}) {
    super()
    this.defaultMaxListeners = 100
    const providerConfig = options.provider || defaultProviderConfig
    log.info(providerConfig)
    // if (!SUPPORTED_NETWORK_TYPES[providerConfig.rpcTarget]) {
    //   providerConfig.type = RPC
    // }
    this.providerStore = new ObservableStore(providerConfig)
    this.networkStore = new ObservableStore('loading')
    this.networkDetails = new ObservableStore(
      options.networkDetails || {
        ...defaultNetworkDetailsState,
      }
    )
    this.store = new ComposedStore({
      provider: this.providerStore,
      network: this.networkStore,
      networkDetails: this.networkDetails,
    })
    this.on('networkDidChange', this.lookupNetwork)
    // provider and block tracker
    this._provider = null
    this._blockTracker = null
    // provider and block tracker proxies - because the network changes
    this._providerProxy = null
    this._blockTrackerProxy = null
  }

  getNetworkIdentifier() {
    const { type, rpcUrl } = this.getProviderConfig()
    if (type === RPC) return rpcUrl
    return type
  }

  /**
   * Helper method for initializing provider
   */
  initializeProvider(providerParameters) {
    this._baseProviderParams = providerParameters
    const { type, rpcUrl, chainId, ticker, nickname, host } = this.getProviderConfig()
    let finalType = type || host
    if (!SUPPORTED_NETWORK_TYPES[finalType]) {
      finalType = RPC
    }
    this._configureProvider({ type: finalType, rpcUrl: rpcUrl || host, chainId, ticker, nickname })
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
   * Method to return the latest block for the current network
   * @returns {Object} Block header
   */
  getLatestBlock() {
    return new Promise((resolve, reject) => {
      const { provider } = this.getProviderAndBlockTracker()
      const ethQuery = new EthQuery(provider)
      const initialNetwork = this.getNetworkState()
      ethQuery.sendAsync({ method: 'eth_getBlockByNumber', params: ['latest', false] }, (err, block) => {
        const currentNetwork = this.getNetworkState()
        if (currentNetwork !== initialNetwork) {
          log.info('network has been changed', initialNetwork, '->', currentNetwork)
          return resolve({})
        }
        if (err) {
          return reject(err)
        }
        return resolve(block)
      })
    })
  }

  /**
   * Method to check if the block header contains fields that indicate EIP 1559
   * support (baseFeePerGas).
   * @returns {Promise<boolean>} true if current network supports EIP 1559
   */
  async getEIP1559Compatibility() {
    const { EIPS } = this.networkDetails.getState()
    // log.info('checking eip 1559 compatibility', EIPS[1559])
    if (EIPS[1559] !== undefined) {
      return EIPS[1559]
    }
    const latestBlock = await this.getLatestBlock()
    const supportsEIP1559 = latestBlock && latestBlock.baseFeePerGas !== undefined
    this.setNetworkEIPSupport(1559, supportsEIP1559)
    return supportsEIP1559
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
   * Set network state
   * @param {string} network
   * @param {Object} type
   */
  setNetworkState(network) {
    this.networkStore.putState(network)
    // if (network === 'loading') {
    //   this.networkStore.putState(network)
    //   return
    // }
    // if (!type) {
    //   return
    // }
    // let cachedNetwork
    // if (force) {
    //   cachedNetwork = network
    // } else if (networks.networkList[type] && networks.networkList[type].chainId) {
    //   cachedNetwork = networks.networkList[type].chainId
    // } else cachedNetwork = network
    // this.networkStore.putState(cachedNetwork)
  }

  setNetworkEIPSupport(EIPNumber, isSupported) {
    this.networkDetails.updateState({
      EIPS: {
        [EIPNumber]: isSupported,
      },
    })
  }

  clearNetworkDetails() {
    this.networkDetails.putState({ ...defaultNetworkDetailsState })
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
    const chainId = this.getCurrentChainId()
    if (!chainId) {
      log.warn('NetworkController - lookupNetwork aborted due to missing chainId')
      this.setNetworkState('loading')
      // keep network details in sync with network state
      this.clearNetworkDetails()
      return
    }
    const ethQuery = new EthQuery(this._provider)
    const initialNetwork = this.getNetworkState()

    ethQuery.sendAsync({ method: 'net_version' }, (error, network) => {
      const currentNetwork = this.getNetworkState()
      if (initialNetwork === currentNetwork) {
        if (error) {
          this.setNetworkState('loading')
          // keep network details in sync with network state
          this.clearNetworkDetails()
          return
        }
        log.info(`web3.getNetwork returned ${network}`)
        this.setNetworkState(network)
        // look up EIP-1559 support
        this.getEIP1559Compatibility()
      }
    })
  }

  getCurrentChainId() {
    const { type, chainId: configChainId } = this.getProviderConfig()
    return SUPPORTED_NETWORK_TYPES[type]?.chainId || configChainId
  }

  setRpcTarget(rpcUrl, chainId, ticker = 'ETH', nickname = '', rpcPrefs = {}) {
    this.setProviderConfig({
      type: RPC,
      rpcUrl,
      chainId,
      ticker,
      nickname,
      rpcPrefs,
    })
  }

  /**
   * Set provider
   * @param {string} type
   */
  async setProviderType(type, rpcUrl = '', ticker = 'ETH', nickname = '') {
    assert.notStrictEqual(type, RPC, 'NetworkController - cannot call "setProviderType" with type \'rpc\'. use "setRpcTarget"')
    assert.ok(SUPPORTED_NETWORK_TYPES[type] !== undefined, `NetworkController - Unknown rpc type "${type}"`)
    const { chainId, ...rest } = SUPPORTED_NETWORK_TYPES[type]
    const providerConfig = { type, rpcUrl, ticker, nickname, chainId, ...rest }
    // get current provider config and check if it is the same as the new one
    const currentProviderConfig = this.getProviderConfig()
    const areNetworksEqual = areProviderConfigsEqual(currentProviderConfig, providerConfig)
    log.info('current provider config', currentProviderConfig, 'new config', providerConfig, 'are networks equal', areNetworksEqual)
    // if (!areNetworksEqual) this.setProviderConfig(providerConfig)
    this.setProviderConfig(providerConfig)
  }

  /**
   * Reset network connection
   */
  resetConnection() {
    this.setProviderConfig(this.getProviderConfig())
  }

  // /**
  //  * Setter for providerConfig
  //  */
  // set providerConfig(providerConfig) {
  //   this.providerStore.updateState(providerConfig)
  //   this._switchNetwork(providerConfig)
  // }

  setProviderConfig(config) {
    // this.previousProviderStore.updateState(this.getProviderConfig())
    this.providerStore.updateState(config)
    this._switchNetwork(config)
  }

  /**
   * Getter for providerConfig
   */
  getProviderConfig() {
    return this.providerStore.getState()
  }

  _switchNetwork(options) {
    this.setNetworkState('loading')
    this.clearNetworkDetails()
    this._configureProvider(options)
    this.emit('networkDidChange')
  }

  _configureProvider(options) {
    const { type, rpcUrl, chainId, ticker, nickname } = options
    // infura type-based endpoints
    const isInfura = INFURA_PROVIDER_TYPES.has(type)
    if (isInfura) {
      this._configureInfuraProvider(options)
    } else if (type === LOCALHOST) {
      this._configureLocalhostProvider()
      // url-based rpc endpoints
    } else if (SUPPORTED_NETWORK_TYPES[type] !== undefined) {
      const { chainId: localChainId, rpcUrl: localUrl } = SUPPORTED_NETWORK_TYPES[type]
      this._configureStandardProvider({
        rpcUrl: rpcUrl || localUrl,
        chainId: chainId || localChainId,
      })
    } else if (type === RPC) {
      this._configureStandardProvider({ rpcUrl, chainId, ticker, nickname })
    } else {
      throw new Error(`NetworkController - _configureProvider - unknown type "${type}"`)
    }
  }

  _configureInfuraProvider({ type }) {
    log.info('NetworkController - configureInfuraProvider', type)
    const networkClient = createInfuraClient({ network: type })
    this._setNetworkClient(networkClient)
  }

  _configureLocalhostProvider() {
    log.info('NetworkController - configureLocalhostProvider')
    const networkClient = createLocalhostClient()
    this._setNetworkClient(networkClient)
  }

  _configureStandardProvider({ rpcUrl, chainId }) {
    log.info('NetworkController - configureStandardProvider', rpcUrl)
    const networkClient = createJsonRpcClient({ rpcUrl, chainId })
    // hack to add a 'rpc' network with chainId
    this._setNetworkClient(networkClient)
  }

  _setNetworkClient({ networkMiddleware, blockTracker }) {
    const metamaskMiddleware = createMetamaskMiddleware(this._baseProviderParams)
    const engine = new JRPCEngine()
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
