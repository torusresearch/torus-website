import {
  createBlockRefRewriteMiddleware,
  createBlockTrackerInspectorMiddleware,
  createFetchMiddleware,
  providerFromMiddleware,
} from '@metamask/eth-json-rpc-middleware'
import { providerFromEngine } from '@metamask/eth-json-rpc-provider'
import { ComposedStore, ObservableStore } from '@metamask/obs-store'
import { JRPCEngine, mergeMiddleware } from '@toruslabs/openlogin-jrpc'
import assert from 'assert'
import { PollingBlockTracker } from 'eth-block-tracker'
import EthQuery from 'eth-query'
import { ethErrors } from 'eth-rpc-errors'
import { isHexString } from 'ethers'
import EventEmitter from 'events'
import log from 'loglevel'
import { createEventEmitterProxy, createSwappableProxy } from 'swappable-obj-proxy'

import { ETH, INFURA_PROVIDER_TYPES, LOCALHOST, MAINNET, MAINNET_CHAIN_ID, MESSAGE_TYPE, RPC, SUPPORTED_NETWORK_TYPES } from '../../utils/enums'
// import { areProviderConfigsEqual } from '../../utils/utils'
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
    const customNetworkStore = options.customNetworks || {}
    // if (!SUPPORTED_NETWORK_TYPES[providerConfig.rpcTarget]) {
    //   providerConfig.type = RPC
    // }
    this.providerStore = new ObservableStore(providerConfig)
    this.networkStore = new ObservableStore('loading')
    this.customNetworkStore = new ObservableStore(customNetworkStore)
    this.networkDetails = new ObservableStore(
      options.networkDetails || {
        ...defaultNetworkDetailsState,
      }
    )
    this.switchChainReqStore = new ObservableStore({
      unapprovedSwitchChainRequests: {},
      unapprovedSwitchChainRequestsCount: 0,
    })
    this.store = new ComposedStore({
      provider: this.providerStore,
      network: this.networkStore,
      networkDetails: this.networkDetails,
      switchChainReqStore: this.switchChainReqStore,
    })
    this.on('networkDidChange', this.lookupNetwork)
    // provider and block tracker
    this._provider = null
    this._blockTracker = null
    // provider and block tracker proxies - because the network changes
    this._providerProxy = null
    this._blockTrackerProxy = null
    this.switchChainRequests = []
  }

  getUnapprovedSwitchChainReqs() {
    return this.switchChainRequests
      .filter((chainReq) => chainReq.status === 'unapproved')
      .reduce((result, chainReq) => {
        result[chainReq.id] = chainReq
        return result
      }, {})
  }

  async _validateSwitchChainParams(chainParams) {
    const { chainId } = chainParams || {}

    if (!chainId) {
      throw ethErrors.rpc.invalidParams('Invalid switch chain params: please pass chainId in params')
    }

    if (!isHexString(chainId)) {
      throw ethErrors.rpc.invalidParams('Invalid switch chain params: please pass a valid hex chainId in params, for: ex: 0x1')
    }
  }

  normalizedSwitchChainParams(id, switchChainParams) {
    const chainIDNum = Number.parseInt(switchChainParams.chainId, 16)
    const networkDetails = Object.values(this.supportedNetworks).find((network) => {
      if (network.chainId === chainIDNum) {
        return true
      }
      return false
    })

    if (!networkDetails) {
      throw ethErrors.rpc.invalidParams('Invalid switch chain params, unsupported chain, please add this chain before switching')
    }
    const { rpcUrl, tickerName, networkName, host } = networkDetails
    const currentNetworkConfig = this.getProviderConfig()
    return {
      id,
      switchChainParams: {
        type: RPC,
        rpc_url: rpcUrl,
        host,
        chain_id: chainIDNum,
        ticker: tickerName,
        network_name: networkName,
        id: networkDetails.id,
        currentNetworkName: currentNetworkConfig.nickname,
        currentNetworkHost: currentNetworkConfig.rpcUrl,
      },
    }
  }

  async switchChainRequestAsync(switchChainParams, request, id) {
    await this._validateSwitchChainParams(switchChainParams)
    const switchChainParamsNormalized = await this.normalizedSwitchChainParams(id, switchChainParams)
    return new Promise((resolve, reject) => {
      this._addSwitchChainRequest(switchChainParamsNormalized, request, id)
      this.emit('newUnapprovedSwitchChainRequest', switchChainParamsNormalized, request)
      // await finished
      this.once(`${id}:finished`, (data) => {
        const req = this.getSwitchChainRequest(id)
        switch (data.status) {
          case 'approved':
            return resolve()
          case 'rejected':
            return reject(ethErrors.provider.userRejectedRequest(`Torus switch chain method: ${req.errorMsg || 'User denied switch chain request.'}`))
          default:
            return reject(new Error(`Torus switch chain method: Unknown problem: ${JSON.stringify(switchChainParamsNormalized)}`))
        }
      })
    })
  }

  _addSwitchChainRequest(chainReqParams, request, id) {
    // add origin from request
    if (request) chainReqParams.origin = request.origin
    const time = Date.now()
    const chainRequestData = {
      id,
      time,
      status: 'unapproved',
      type: MESSAGE_TYPE.SWITCH_CHAIN,
      ...chainReqParams,
    }

    this.addSwitchChainRequest(chainRequestData)

    // signal update
    this.emit('update')
    return id
  }

  _saveChainRequestList() {
    const unapprovedSwitchChainRequests = this.getUnapprovedSwitchChainReqs()
    const unapprovedSwitchChainRequestsCount = Object.keys(unapprovedSwitchChainRequests).length
    this.switchChainReqStore.updateState({ unapprovedSwitchChainRequests, unapprovedSwitchChainRequestsCount })
  }

  addSwitchChainRequest(chainRequest) {
    this.switchChainRequests.push(chainRequest)
    this._saveChainRequestList()
  }

  getSwitchChainRequest(switchChainReqId) {
    return this.switchChainRequests.find((chainRequest) => chainRequest.id === switchChainReqId)
  }

  _updateChainRequest(existingChainReq) {
    const index = this.switchChainRequests.findIndex((chainRequest) => existingChainReq.id === chainRequest.id)
    if (index !== -1) {
      this.switchChainRequests[index] = existingChainReq
    }
    this._saveChainRequestList()
  }

  _setSwitchChainReqStatus(switchChainReqId, status, errorMsg = '') {
    const chainRequest = this.getSwitchChainRequest(switchChainReqId)
    if (!chainRequest) {
      throw new Error(`NetworkController - SwitchChainRequest not found for id: "${switchChainReqId}".`)
    }
    chainRequest.status = status
    if (errorMsg) {
      chainRequest.errorMsg = errorMsg
    }
    this._updateChainRequest(chainRequest)
    this.emit(`${switchChainReqId}:${status}`, chainRequest)
    if (status === 'rejected' || status === 'approved' || status === 'errored') {
      this.emit(`${switchChainReqId}:finished`, chainRequest)
    }
  }

  async approveSwitchChainRequest(switchChainReqId) {
    try {
      const chainReqData = this.getSwitchChainRequest(switchChainReqId)
      const { id, rpc_url, chain_id, ticker, network_name, host } = chainReqData.switchChainParams
      if (rpc_url) {
        this.setRpcTarget(id, rpc_url, chain_id, ticker, network_name)
      } else {
        this.setProviderConfig({
          type: host,
          chainId: chain_id,
          ticker,
          nickname: network_name,
          rpcPrefs: {},
          id,
        })
      }
      this._setSwitchChainReqStatus(switchChainReqId, 'approved')
    } catch (error) {
      log.error('error while approving switch chain', error)
      this.rejectSwitchChainRequest(switchChainReqId, error?.message || 'Something went wrong while approving switch chain request')
      throw error
    }
  }

  rejectSwitchChainRequest(switchChainReqId, errorMsg = '') {
    this._setSwitchChainReqStatus(switchChainReqId, 'rejected', errorMsg)
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
      const initialNetwork = this.networkState
      ethQuery.sendAsync({ method: 'eth_getBlockByNumber', params: ['latest', false] }, (err, block) => {
        const currentNetwork = this.networkState
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
  get networkState() {
    return this.networkStore.getState()
  }

  /**
   * Get custom + supported networks
   */
  get supportedNetworks() {
    return {
      ...this.customNetworks,
      ...SUPPORTED_NETWORK_TYPES,
    }
  }

  /**
   *  Get custom networks.
   */
  get customNetworks() {
    return this.customNetworkStore.getState()
  }

  /**
   * Update supported networks
   */
  addSupportedNetworks(network) {
    const currentHosts = Object.keys(this.supportedNetworks)
    if (!currentHosts.includes(network.host)) {
      this.customNetworkStore.updateState({
        ...this.customNetworks,
        [network.host]: network,
      })
    }
  }

  /**
   * Delete a network from custom network store.
   */
  deleteCustomNetwork(id) {
    const networks = Object.values(this.customNetworks).filter((network) => network.id !== id)
    const obj = {}
    networks.forEach((i) => {
      obj[i.host] = i
    })
    this.customNetworkStore.putState(obj)
  }

  /**
   * Update custom networks in custom network store.
   */
  editSupportedNetworks(network) {
    // network host can also change so we need to iterate over all networks
    // and update exact values for the edited network
    const { id } = network
    const obj = {}
    Object.values(this.customNetworks).forEach((i) => {
      if (i.id !== id) obj[i.host] = i
    })
    obj[network.host] = network
    this.customNetworkStore.putState(obj)
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
    return this.networkState === 'loading'
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
    const initialNetwork = this.networkState

    ethQuery.sendAsync({ method: 'net_version' }, (error, network) => {
      const currentNetwork = this.networkState
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
    const chainId = SUPPORTED_NETWORK_TYPES[type]?.chainId || configChainId
    return isHexString(chainId) ? chainId : `0x${Number(chainId).toString(16)}`
  }

  getCurrentNetworkUrl() {
    const { type, rpcUrl } = this.getProviderConfig()

    const isInfura = INFURA_PROVIDER_TYPES.has(type)
    if (isInfura) {
      return `https://${type}.infura.io/v3/${process.env.VUE_APP_INFURA_KEY}`
    }
    const networkConfig = SUPPORTED_NETWORK_TYPES[type]
    return networkConfig?.rpcUrl || rpcUrl
  }

  setRpcTarget(networkId, rpcUrl, chainId, ticker = 'ETH', nickname = '', rpcPrefs = {}) {
    this.setProviderConfig({
      type: RPC,
      rpcUrl,
      chainId,
      ticker,
      nickname,
      rpcPrefs,
      id: networkId,
    })
  }

  /**
   * Set provider
   * @param {string} type
   */
  async setProviderType(type, rpcUrl = '', ticker = 'ETH', nickname = '') {
    assert.notStrictEqual(type, RPC, 'NetworkController - cannot call "setProviderType" with type \'rpc\'. use "setRpcTarget"')
    assert.ok(this.supportedNetworks[type] !== undefined, `NetworkController - Unknown rpc type "${type}"`)
    const { chainId, ...rest } = this.supportedNetworks[type]
    const providerConfig = { type, rpcUrl, ticker, nickname, chainId, ...rest }
    // get current provider config and check if it is the same as the new one
    // const currentProviderConfig = this.getProviderConfig()
    // const areNetworksEqual = areProviderConfigsEqual(currentProviderConfig, providerConfig)
    // log.info('current provider config', currentProviderConfig, 'new config', providerConfig, 'are networks equal', areNetworksEqual)
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
    } else if (this.supportedNetworks[type] !== undefined) {
      const { chainId: localChainId, rpcUrl: localUrl } = this.supportedNetworks[type]
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
    log.info('networkClient', networkClient)
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
