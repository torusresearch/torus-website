const debounce = require('debounce')
const EventEmitter = require('events')
const ComposableObservableStore = require('../utils/ComposableObservableStore').default
const log = require('loglevel')
const NetworkController = require('./NetworkController').default
const AccountTracker = require('./AccountTracker').default
const TransactionController = require('./TransactionController').default
const RecentBlocksController = require('./RecentBlocksController').default
const CurrencyController = require('./CurrencyController').default
const DetectTokensController = require('./DetectTokensController').default
const TokenRatesController = require('./TokenRatesController').default
const toChecksumAddress = require('../utils/toChecksumAddress').default
const BN = require('ethereumjs-util').BN
const GWEI_BN = new BN('1000000000')
const percentile = require('percentile')
const sigUtil = require('eth-sig-util')
// const Dnode = require('dnode')
const pump = require('pump')
const setupMultiplex = require('../utils/setupMultiplex').default
const asStream = require('obs-store/lib/asStream')
const RpcEngine = require('json-rpc-engine')
const createFilterMiddleware = require('eth-json-rpc-filters')
const createSubscriptionManager = require('eth-json-rpc-filters/subscriptionManager')
const createOriginMiddleware = require('../utils/createOriginMiddleware')
const createLoggerMiddleware = require('../utils/createLoggerMiddleware')
const providerAsMiddleware = require('eth-json-rpc-middleware/providerAsMiddleware')
const createEngineStream = require('json-rpc-middleware-stream/engineStream')
const MessageManager = require('./MessageManager').default
const PersonalMessageManager = require('./PersonalMessageManager').default
const TypedMessageManager = require('./TypedMessageManager').default
const ObservableStore = require('obs-store')
const nodeify = require('../utils/nodeify').default
const KeyringController = require('./TorusKeyring').default

// defaults and constants
const version = '0.0.1'

export default class TorusController extends EventEmitter {
  /**
   * @constructor
   * @param {Object} opts
   */
  constructor(opts) {
    super()
    this.defaultMaxListeners = 20
    this.sendUpdate = debounce(this.privateSendUpdate.bind(this), 200)
    this.opts = opts
    const { host, chainId, networkName } = opts.sessionCachedNetwork || {}
    const networkControllerOpts = opts.sessionCachedNetwork
      ? {
          provider: {
            type: host,
            rpcTarget: host,
            chainId: chainId,
            ticker: networkName,
            nickname: networkName
          }
        }
      : {}
    this.store = new ComposableObservableStore()
    this.networkController = new NetworkController(networkControllerOpts)

    // this keeps track of how many "controllerStream" connections are open
    // the only thing that uses controller connections are open metamask UI instances
    this.activeControllerConnections = 0

    this.currencyController = new CurrencyController({
      initState: {}
    })
    this.currencyController.updateConversionRate()
    this.currencyController.scheduleConversionInterval()

    this.initializeProvider()
    this.provider = this.networkController.getProviderAndBlockTracker().provider
    this.blockTracker = this.networkController.getProviderAndBlockTracker().blockTracker

    this.recentBlocksController = new RecentBlocksController({
      blockTracker: this.blockTracker,
      provider: this.provider,
      networkController: this.networkController
    })

    this.accountTracker = new AccountTracker({
      provider: this.provider,
      blockTracker: this.blockTracker,
      network: this.networkController
    })

    // detect tokens controller
    this.detectTokensController = new DetectTokensController({
      network: this.networkController,
      provider: this.provider
    })

    this.tokenRatesController = new TokenRatesController({
      currency: this.currencyController.store,
      tokensStore: this.detectTokensController.detectedTokensStore
    })

    // start and stop polling for balances based on activeControllerConnections
    this.on('controllerConnectionChanged', activeControllerConnections => {
      if (activeControllerConnections > 0) {
        this.accountTracker.start()
      } else {
        this.accountTracker.stop()
      }
    })

    // ensure accountTracker updates balances after network change
    this.networkController.on('networkDidChange', () => {
      this.accountTracker._updateAccounts()
      this.detectTokensController.restartTokenDetection()
    })

    // key mgmt
    this.keyringController = new KeyringController()
    this.publicConfigStore = this.initPublicConfigStore()

    // tx mgmt
    this.txController = new TransactionController({
      networkStore: this.networkController.networkStore,
      txHistoryLimit: 40,
      getNetwork: this.networkController.getNetworkState.bind(this),
      // signs ethTx
      signTransaction: this.keyringController.signTransaction.bind(this.keyringController),
      provider: this.provider,
      blockTracker: this.blockTracker,
      getGasPrice: this.getGasPrice.bind(this),
      storeProps: this.opts.storeProps
    })
    this.txController.on('newUnapprovedTx', () => opts.showUnapprovedTx())

    this.txController.on('tx:status-update', (txId, status) => {
      if (status === 'confirmed' || status === 'failed') {
        const txMeta = this.txController.txStateManager.getTx(txId)
        if (this.platform) {
          this.platform.showTransactionNotification(txMeta) // TODO: implement platform specific handlers
        }
      }
    })

    this.networkController.lookupNetwork()
    this.messageManager = new MessageManager()
    this.personalMessageManager = new PersonalMessageManager()
    this.typedMessageManager = new TypedMessageManager({ networkController: this.networkController })
    this.store.updateStructure({
      TransactionController: this.txController.store,
      NetworkController: this.networkController.store,
      MessageManager: this.messageManager.store,
      CurrencyController: this.currencyController.store,
      PersonalMessageManager: this.personalMessageManager.store,
      TypedMessageManager: this.typedMessageManager.store
    })
    this.updateAndApproveTransaction = nodeify(this.txController.updateAndApproveTransaction, this.txController)
    this.cancelTransaction = nodeify(this.txController.cancelTransaction, this.txController)

    if (typeof opts.rehydrate === 'function') {
      setTimeout(function() {
        opts.rehydrate()
      }, 50)
    }
  }

  /**
   * Helper method for initializing provider
   */
  initializeProvider() {
    const providerOpts = {
      static: {
        eth_syncing: false,
        web3_clientVersion: `Torus/v${version}`
      },
      version,
      // account mgmt
      getAccounts: async ({ origin }) => {
        // Expose no accounts if this origin has not been approved, preventing
        // account-requiring RPC methods from completing successfully
        // only show address if account is unlocked
        if (typeof this.opts.storeProps === 'function') {
          const { selectedAddress } = this.opts.storeProps()
          if (selectedAddress) {
            return [selectedAddress]
          } else {
            return []
          }
        }
      },
      // tx signing
      processTransaction: this.newUnapprovedTransaction.bind(this),
      // msg signing
      processEthSignMessage: this.newUnsignedMessage.bind(this),
      processTypedMessage: this.newUnsignedTypedMessage.bind(this),
      processTypedMessageV3: this.newUnsignedTypedMessage.bind(this),
      processPersonalMessage: this.newUnsignedPersonalMessage.bind(this),
      getPendingNonce: this.getPendingNonce.bind(this)
    }
    const providerProxy = this.networkController.initializeProvider(providerOpts)
    return providerProxy
  }

  /**
   * Constructor helper: initialize a public config store.
   * This store is used to make some config info available to Dapps synchronously.
   */
  initPublicConfigStore() {
    // get init state
    const publicConfigStore = new ObservableStore()

    // memStore -> transform -> publicConfigStore
    this.on('update', memState => {
      this.isClientOpenAndUnlocked = memState.isUnlocked
      const publicState = selectPublicState(memState)
      publicConfigStore.putState(publicState)
    })

    function selectPublicState(memState) {
      const result = {
        selectedAddress: memState.isUnlocked ? memState.selectedAddress : undefined,
        networkVersion: memState.network
      }
      return result
    }

    return publicConfigStore
  }

  /**
   * Returns internal state of the TorusController
   *
   * @returns {Object} status
   */
  getState() {
    return this.store.getFlatState()
  }

  /**
   * Returns an Object containing API Callback Functions.
   * These functions are the interface for the UI.
   * The API object can be transmitted over a stream with dnode.
   *
   * @returns {Object} Object containing API functions.
   */
  getApi() {
    const keyringController = this.keyringController
    const txController = this.txController
    const networkController = this.networkController

    return {
      // etc
      getState: cb => cb(null, this.getState()),
      setCurrentCurrency: this.setCurrentCurrency.bind(this),
      getGasPrice: cb => cb(null, this.getGasPrice()),

      // network management
      setProviderType: nodeify(networkController.setProviderType, networkController),

      // KeyringController
      exportAccount: nodeify(keyringController.exportAccount, keyringController),

      // txController
      cancelTransaction: nodeify(txController.cancelTransaction, txController),
      updateTransaction: nodeify(txController.updateTransaction, txController),
      updateAndApproveTransaction: nodeify(txController.updateAndApproveTransaction, txController),
      retryTransaction: nodeify(this.retryTransaction, this),
      createCancelTransaction: nodeify(this.createCancelTransaction, this),
      createSpeedUpTransaction: nodeify(this.createSpeedUpTransaction, this),
      getFilteredTxList: nodeify(txController.getFilteredTxList, txController),
      estimateGas: nodeify(this.estimateGas, this),

      // messageManager
      signMessage: nodeify(this.signMessage, this),
      cancelMessage: this.cancelMessage.bind(this),

      // personalMessageManager
      signPersonalMessage: nodeify(this.signPersonalMessage, this),
      cancelPersonalMessage: this.cancelPersonalMessage.bind(this),

      // personalMessageManager
      signTypedMessage: nodeify(this.signTypedMessage, this),
      cancelTypedMessage: this.cancelTypedMessage.bind(this)
    }
  }

  // =============================================================================
  // KEYRING RELATED METHODS
  // =============================================================================

  initTorusKeyring(keyArray, addresses) {
    return new Promise((resolve, reject) => {
      this.keyringController
        .deserialize(keyArray)
        .then(resp => {
          log.info('keyring deserialized')
          resolve()
        })
        .catch(err => {
          reject(err)
          log.error('unable to deserialize keyring', err)
        })
      this.accountTracker.syncWithAddresses(addresses)
    })

    // this.setupControllerConnection()
    // this.accountTracker._updateAccounts()
  }

  async addAccount(key, address) {
    await this.keyringController.addAccount(key)
    this.accountTracker.addAccounts([address])
  }

  setSelectedAccount(address) {
    this.detectTokensController.startTokenDetection(address)
  }

  /**
   * Get an account balance from the AccountTracker or request it directly from the network.
   * @param {string} address - The account address
   * @param {EthQuery} ethQuery - The EthQuery instance to use when asking the network
   */
  getBalance(address, ethQuery) {
    return new Promise((resolve, reject) => {
      const cached = this.accountTracker.store.getState().accounts[address]
      if (cached && cached.balance) {
        resolve(cached.balance)
      } else {
        ethQuery.getBalance(address, (error, balance) => {
          if (error) {
            reject(error)
            log.error(error)
          } else {
            resolve(balance || '0x0')
          }
        })
      }
    })
  }

  /**
   * A method for estimating a good gas price at recent prices.
   * Returns the lowest price that would have been included in
   * 50% of recent blocks.
   *
   * @returns {string} A hex representation of the suggested wei gas price.
   */
  getGasPrice() {
    const { recentBlocksController } = this
    const { recentBlocks } = recentBlocksController.store.getState()

    // Return 1 gwei if no blocks have been observed:
    if (recentBlocks.length === 0) {
      return '0x' + GWEI_BN.toString(16)
    }

    const lowestPrices = recentBlocks
      .map(block => {
        if (!block.gasPrices || block.gasPrices.length < 1) {
          return GWEI_BN
        }
        return block.gasPrices
          .map(hexPrefix => hexPrefix.substr(2))
          .map(hex => new BN(hex, 16))
          .sort((a, b) => {
            return a.gt(b) ? 1 : -1
          })[0]
      })
      .map(number => number.div(GWEI_BN).toNumber())

    const percentileNum = percentile(65, lowestPrices)
    const percentileNumBn = new BN(percentileNum)
    return '0x' + percentileNumBn.mul(GWEI_BN).toString(16)
  }

  /**
   * Called when a Dapp suggests a new tx to be signed.
   * this wrapper needs to exist so we can provide a reference to
   *  "newUnapprovedTransaction" before "txController" is instantiated
   *
   * @param {Object} msgParams - The params passed to eth_sign.
   * @param {Object} req - (optional) the original request, containing the origin
   */
  async newUnapprovedTransaction(txParams, req) {
    return this.txController.newUnapprovedTransaction(txParams, req)
  }

  // eth_sign methods:

  /**
   * Called when a Dapp uses the eth_sign method, to request user approval.
   * eth_sign is a pure signature of arbitrary data. It is on a deprecation
   * path, since this data can be a transaction, or can leak private key
   * information.
   *
   * @param {Object} msgParams - The params passed to eth_sign.
   * @param {Function} cb = The callback function called with the signature.
   */
  newUnsignedMessage(msgParams, req) {
    const promise = this.messageManager.addUnapprovedMessageAsync(msgParams, req)
    this.sendUpdate()
    this.opts.showUnconfirmedMessage()
    return promise
  }

  /**
   * Signifies user intent to complete an eth_sign method.
   *
   * @param  {Object} msgParams The params passed to eth_sign.
   * @returns {Promise<Object>} Full state update.
   */
  signMessage(msgParams) {
    log.info('MetaMaskController - signMessage')
    const msgId = msgParams.metamaskId

    // sets the status op the message to 'approved'
    // and removes the metamaskId for signing
    return this.messageManager
      .approveMessage(msgParams)
      .then(cleanMsgParams => {
        // signs the message
        return this.keyringController.signMessage(cleanMsgParams.from, cleanMsgParams.data)
      })
      .then(rawSig => {
        // tells the listener that the message has been signed
        // and can be returned to the dapp
        this.messageManager.setMsgStatusSigned(msgId, rawSig)
        return this.getState()
      })
  }

  /**
   * Used to cancel a message submitted via eth_sign.
   *
   * @param {string} msgId - The id of the message to cancel.
   */
  cancelMessage(msgId, cb) {
    const messageManager = this.messageManager
    messageManager.rejectMsg(msgId)
    if (cb && typeof cb === 'function') {
      cb(null, this.getState())
    }
  }

  // personal_sign methods:

  /**
   * Called when a dapp uses the personal_sign method.
   * This is identical to the Geth eth_sign method, and may eventually replace
   * eth_sign.
   *
   * We currently define our eth_sign and personal_sign mostly for legacy Dapps.
   *
   * @param {Object} msgParams - The params of the message to sign & return to the Dapp.
   * @param {Function} cb - The callback function called with the signature.
   * Passed back to the requesting Dapp.
   */
  async newUnsignedPersonalMessage(msgParams, req) {
    const promise = this.personalMessageManager.addUnapprovedMessageAsync(msgParams, req)
    this.sendUpdate()
    this.opts.showUnconfirmedMessage()
    return promise
  }

  /**
   * Signifies a user's approval to sign a personal_sign message in queue.
   * Triggers signing, and the callback function from newUnsignedPersonalMessage.
   *
   * @param {Object} msgParams - The params of the message to sign & return to the Dapp.
   * @returns {Promise<Object>} - A full state update.
   */
  signPersonalMessage(msgParams) {
    log.info('MetaMaskController - signPersonalMessage')
    const msgId = msgParams.metamaskId
    // sets the status op the message to 'approved'
    // and removes the metamaskId for signing
    return this.personalMessageManager
      .approveMessage(msgParams)
      .then(cleanMsgParams => {
        // signs the message
        return this.keyringController.signPersonalMessage(cleanMsgParams.from, cleanMsgParams.data)
      })
      .then(rawSig => {
        // tells the listener that the message has been signed
        // and can be returned to the dapp
        this.personalMessageManager.setMsgStatusSigned(msgId, rawSig)
        return this.getState()
      })
  }

  /**
   * Used to cancel a personal_sign type message.
   * @param {string} msgId - The ID of the message to cancel.
   * @param {Function} cb - The callback function called with a full state update.
   */
  cancelPersonalMessage(msgId, cb) {
    const messageManager = this.personalMessageManager
    messageManager.rejectMsg(msgId)
    if (cb && typeof cb === 'function') {
      cb(null, this.getState())
    }
  }

  // eth_signTypedData methods

  /**
   * Called when a dapp uses the eth_signTypedData method, per EIP 712.
   *
   * @param {Object} msgParams - The params passed to eth_signTypedData.
   * @param {Function} cb - The callback function, called with the signature.
   */
  newUnsignedTypedMessage(msgParams, req, version) {
    const promise = this.typedMessageManager.addUnapprovedMessageAsync(msgParams, req, version)
    this.sendUpdate()
    this.opts.showUnconfirmedMessage()
    return promise
  }

  /**
   * The method for a user approving a call to eth_signTypedData, per EIP 712.
   * Triggers the callback in newUnsignedTypedMessage.
   *
   * @param  {Object} msgParams - The params passed to eth_signTypedData.
   * @returns {Object} Full state update.
   */
  async signTypedMessage(msgParams) {
    log.info('MetaMaskController - eth_signTypedData')
    const msgId = msgParams.metamaskId
    try {
      const cleanMsgParams = await this.typedMessageManager.approveMessage(msgParams)
      const address = toChecksumAddress(sigUtil.normalize(cleanMsgParams.from))
      let signature = await this.keyringController.signTypedData(address, cleanMsgParams.data)
      this.typedMessageManager.setMsgStatusSigned(msgId, signature)
      return this.getState()
    } catch (error) {
      log.info('TorusController - eth_signTypedData failed.', error)
      this.typedMessageManager.errorMessage(msgId, error)
    }
  }

  /**
   * Used to cancel a eth_signTypedData type message.
   * @param {string} msgId - The ID of the message to cancel.
   * @param {Function} cb - The callback function called with a full state update.
   */
  cancelTypedMessage(msgId, cb) {
    const messageManager = this.typedMessageManager
    messageManager.rejectMsg(msgId)
    if (cb && typeof cb === 'function') {
      cb(null, this.getState())
    }
  }

  /**
   * Allows a user to try to speed up a transaction by retrying it
   * with higher gas.
   *
   * @param {string} txId - The ID of the transaction to speed up.
   * @param {Function} cb - The callback function called with a full state update.
   */
  async retryTransaction(txId, gasPrice) {
    await this.txController.retryTransaction(txId, gasPrice)
    const state = await this.getState()
    return state
  }

  /**
   * Allows a user to attempt to cancel a previously submitted transaction by creating a new
   * transaction.
   * @param {number} originalTxId - the id of the txMeta that you want to attempt to cancel
   * @param {string=} customGasPrice - the hex value to use for the cancel transaction
   * @returns {object} MetaMask state
   */
  async createCancelTransaction(originalTxId, customGasPrice) {
    try {
      await this.txController.createCancelTransaction(originalTxId, customGasPrice)
      const state = await this.getState()
      return state
    } catch (error) {
      throw error
    }
  }

  async createSpeedUpTransaction(originalTxId, customGasPrice) {
    await this.txController.createSpeedUpTransaction(originalTxId, customGasPrice)
    const state = await this.getState()
    return state
  }

  /**
   * Used to estimate gas of a transaction
   * @param {Object} estimateGasParams - estimate gas parameters
   */
  estimateGas(estimateGasParams) {
    return new Promise((resolve, reject) => {
      return this.txController.txGasUtil.query.estimateGas(estimateGasParams, (err, res) => {
        if (err) {
          return reject(err)
        }

        return resolve(res)
      })
    })
  }

  /**
   * Used to create a multiplexed stream for connecting to an untrusted context
   * like a Dapp or other extension.
   * @param {*} connectionStream - The Duplex stream to connect to.
   * @param {string} originDomain - The domain requesting the stream, which
   * may trigger a blacklist reload.
   */
  setupUntrustedCommunication(connectionStream, originDomain) {
    // setup multiplexing
    const mux = setupMultiplex(connectionStream)
    // connect features && for test cases
    this.setupProviderConnection(mux.createStream('test'), mux.createStream('provider'), originDomain)
    this.setupPublicConfig(mux.createStream('publicConfig'))
  }

  /**
   * Used to create a multiplexed stream for connecting to a trusted context,
   * like our own user interfaces, which have the provider APIs, but also
   * receive the exported API from this controller, which includes trusted
   * functions, like the ability to approve transactions or sign messages.
   *
   * @param {*} connectionStream - The duplex stream to connect to.
   * @param {string} originDomain - The domain requesting the connection,
   * used in logging and error reporting.
   */
  setupTrustedCommunication(outStream, originDomain) {
    // setup multiplexing
    // const mux = setupMultiplex(connectionStream)
    // connect features
    this.setupControllerConnection(outStream)
    // to fix test cases
    this.setupProviderConnection(outStream, originDomain)
  }

  /**
   * A method for providing our API over a stream using Dnode.
   * @param {*} outStream - The stream to provide our API over.
   */
  setupControllerConnection(outStream) {
    // const api = this.getApi()
    // const dnode = Dnode(api)
    // report new active controller connection
    this.activeControllerConnections++
    this.emit('controllerConnectionChanged', this.activeControllerConnections)
    // connect dnode api to remote connection
    // pump(outStream, dnode, outStream, err => {
    //   // report new active controller connection
    //   this.activeControllerConnections--
    //   this.emit('controllerConnectionChanged', this.activeControllerConnections)
    //   // report any error
    //   if (err) log.error(err)
    // })
    // dnode.on('remote', remote => {
    //   // push updates to popup
    //   const sendUpdate = update => remote.sendUpdate(update)
    //   this.on('update', sendUpdate)
    //   // remove update listener once the connection ends
    //   dnode.on('end', () => this.removeListener('update', sendUpdate))
    // })
  }

  /**
   * A method for serving our ethereum provider over a given stream.
   * @param {*} outStream - The stream to provide over.
   * @param {string} origin - The URI of the requesting resource.
   */
  setupProviderConnection(outStream, origin) {
    const engine = this.setupProviderEngine(origin)

    // setup connection
    const providerStream = createEngineStream({ engine })

    outStream
      .pipe(providerStream)
      .pipe(outStream)
      .on('error', err => {
        // cleanup filter polyfill middleware
        engine._middleware.forEach(mid => {
          if (mid.destroy && typeof mid.destroy === 'function') {
            mid.destroy()
          }
        })
        if (err) log.error(err)
      })
  }

  /**
   * A method for creating a provider that is safely restricted for the requesting domain.
   **/
  setupProviderEngine(origin, getSiteMetadata) {
    // setup json rpc engine stack
    const engine = new RpcEngine()
    const provider = this.provider
    const blockTracker = this.blockTracker

    // create filter polyfill middleware
    const filterMiddleware = createFilterMiddleware({ provider, blockTracker })
    // create subscription polyfill middleware
    const subscriptionManager = createSubscriptionManager({ provider, blockTracker })
    subscriptionManager.events.on('notification', message => engine.emit('notification', message))

    // metadata
    engine.push(createOriginMiddleware({ origin }))
    engine.push(createLoggerMiddleware({ origin }))
    // filter and subscription polyfills
    engine.push(filterMiddleware)
    engine.push(subscriptionManager.middleware)
    // watch asset
    // engine.push(this.preferencesController.requestWatchAsset.bind(this.preferencesController))
    // forward to metamask primary provider
    engine.push(providerAsMiddleware(provider))
    return engine
  }

  /**
   * A method for providing our public config info over a stream.
   * This includes info we like to be synchronous if possible, like
   * the current selected account, and network ID.
   *
   * Since synchronous methods have been deprecated in web3,
   * this is a good candidate for deprecation.
   *
   * @param {*} outStream - The stream to provide public config over.
   */
  setupPublicConfig(outStream) {
    const configStream = asStream(this.publicConfigStore)
    pump(configStream, outStream, err => {
      configStream.destroy()
      if (err) log.error(err)
    })
  }

  /**
   * A method for emitting the full MetaMask state to all registered listeners.
   * @private
   */
  privateSendUpdate() {
    this.emit('update', this.getState())
  }

  /**
   * Retrieve private key for address
   * @private
   */
  getPrivateKey(address) {
    let addr = toChecksumAddress(address)
    if (typeof this.opts.storeProps === 'function') {
      let { wallet } = this.opts.storeProps()
      if (addr == null) {
        throw new Error('TxController - No address given.')
      } else if (wallet[addr] == null) {
        throw new Error('TxController - No private key accessible, please login.')
      } else {
        return Buffer.from(wallet[addr], 'hex')
      }
    }
  }

  /**
   * Returns the nonce that will be associated with a transaction once approved
   * @param address {string} - The hex string address for the transaction
   * @returns Promise<number>
   */
  async getPendingNonce(address) {
    const { nonceDetails, releaseLock } = await this.txController.nonceTracker.getNonceLock(address)
    const pendingNonce = nonceDetails.params.highestSuggested

    releaseLock()
    return pendingNonce
  }

  /**
   * A method for setting the user's preferred display currency.
   * @param {string} currencyCode - The code of the preferred currency.
   * @param {Function} cb - A callback function returning currency info.
   */
  async setCurrentCurrency(currencyCode, cb) {
    const { ticker } = this.networkController.getNetworkConfig()
    try {
      this.currencyController.setNativeCurrency(ticker)
      this.currencyController.setCurrentCurrency(currencyCode)
      await this.currencyController.updateConversionRate()
      const data = {
        nativeCurrency: ticker || 'ETH',
        conversionRate: this.currencyController.getConversionRate(),
        currentCurrency: this.currencyController.getCurrentCurrency(),
        conversionDate: this.currencyController.getConversionDate()
      }
      cb(null, data)
    } catch (err) {
      cb(err)
    }
  }

  /**
   * A method for selecting a custom URL for an ethereum RPC provider.
   * @param {string} rpcTarget - A URL for a valid Ethereum RPC API.
   * @param {number} chainId - The chainId of the selected network.
   * @param {string} ticker - The ticker symbol of the selected network.
   * @param {string} nickname - Optional nickname of the selected network.
   * @returns {Promise<String>} - The RPC Target URL confirmed.
   */
  async setCustomRpc(rpcTarget, chainId, ticker = 'ETH', nickname = '', rpcPrefs = {}) {
    this.networkController.setRpcTarget(rpcTarget, chainId, ticker, nickname, rpcPrefs)
    return rpcTarget
  }
}
