import { ObservableStore, storeAsStream } from '@metamask/obs-store'
import createFilterMiddleware from 'eth-json-rpc-filters'
import createSubscriptionManager from 'eth-json-rpc-filters/subscriptionManager'
import { providerAsMiddleware } from 'eth-json-rpc-middleware'
import { normalize } from 'eth-sig-util'
import { stripHexPrefix } from 'ethereumjs-util'
import EventEmitter from 'events'
import { JsonRpcEngine } from 'json-rpc-engine'
import { createEngineStream } from 'json-rpc-middleware-stream'
import debounce from 'lodash.debounce'
import log from 'loglevel'
import pump from 'pump'
import { toChecksumAddress } from 'web3-utils'

import { version } from '../../package.json'
import createRandomId from '../utils/random-id'
import { isMain } from '../utils/utils'
import AccountTracker from './AccountTracker'
import AssetContractController from './AssetsContractController'
import AssetController from './AssetsController'
import AssetDetectionController from './AssetsDetectionController'
import CurrencyController from './CurrencyController'
import DecryptMessageManager from './DecryptMessageManager'
import DetectTokensController from './DetectTokensController'
import EncryptionPublicKeyManager from './EncryptionPublicKeyManager'
import MessageManager from './MessageManager'
import NetworkController from './NetworkController'
import PermissionsController from './PermissionsController'
import PersonalMessageManager from './PersonalMessageManager'
import PreferencesController from './PreferencesController'
import TokenRatesController from './TokenRatesController'
import KeyringController from './TorusKeyring'
import TransactionController from './TransactionController'
import TypedMessageManager from './TypedMessageManager'
import ComposableObservableStore from './utils/ComposableObservableStore'
import createLoggerMiddleware from './utils/createLoggerMiddleware'
import createOriginMiddleware from './utils/createOriginMiddleware'
import nodeify from './utils/nodeify'
import WalletConnectController from './WalletConnectController'

export default class TorusController extends EventEmitter {
  /**
   * @constructor
   * @param {Object} opts
   */
  constructor(options) {
    super()
    this.defaultMaxListeners = 20
    this.sendUpdate = debounce(this.privateSendUpdate.bind(this), 200)
    this.opts = options
    const { host, chainId, networkName } = options.sessionCachedNetwork || {}
    const networkControllerOptions = options.sessionCachedNetwork && {
      provider: {
        type: host,
        rpcTarget: host,
        chainId,
        ticker: networkName,
        nickname: networkName,
      },
    }

    this.store = new ComposableObservableStore()
    this.networkController = new NetworkController(networkControllerOptions)

    // this keeps track of how many "controllerStream" connections are open
    // the only thing that uses controller connections are open metamask UI instances
    this.activeControllerConnections = 0

    this.currencyController = new CurrencyController({
      initState: {},
    })
    this.currencyController.updateConversionRate()
    this.currencyController.scheduleConversionInterval()

    this.initializeProvider()
    this.provider = this.networkController.getProviderAndBlockTracker().provider
    this.blockTracker = this.networkController.getProviderAndBlockTracker().blockTracker

    this.accountTracker = new AccountTracker({
      provider: this.provider,
      blockTracker: this.blockTracker,
      network: this.networkController,
    })

    // key mgmt
    this.keyringController = new KeyringController()

    this.prefsController = new PreferencesController({
      network: this.networkController,
      provider: this.provider,
      signMessage: this.keyringController.signMessage.bind(this.keyringController),
      storeDispatch: this.opts.storeDispatch,
    })

    // detect tokens controller
    this.detectTokensController = new DetectTokensController({
      network: this.networkController,
      provider: this.provider,
      preferencesStore: this.prefsController.store,
    })

    this.tokenRatesController = new TokenRatesController({
      currency: this.currencyController.store,
      tokensStore: this.detectTokensController.detectedTokensStore,
    })

    // start and stop polling for balances based on activeControllerConnections
    this.on('controllerConnectionChanged', (activeControllerConnections) => {
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
      this.assetDetectionController.restartAssetDetection()
      this.prefsController.recalculatePastTx()
      this.prefsController.refetchEtherscanTx()
      this.walletConnectController.updateSession()
    })

    this.publicConfigStore = this.initPublicConfigStore()

    this.permissionsController = new PermissionsController({
      getKeyringAccounts: this.keyringController.getAccounts.bind(this.keyringController),
      setSiteMetadata: this.prefsController.setSiteMetadata.bind(this.prefsController),
    })

    // tx mgmt
    this.txController = new TransactionController({
      networkStore: this.networkController.networkStore,
      txHistoryLimit: 40,
      // TODO: pass in methods to check permissions for transactions. Do the same for other types of txs
      getNetwork: this.networkController.getNetworkState.bind(this),
      // signs ethTx
      signTransaction: this.keyringController.signTransaction.bind(this.keyringController),
      provider: this.provider,
      blockTracker: this.blockTracker,
      storeProps: this.opts.storeProps,
    })
    this.txController.on('newUnapprovedTx', (txMeta, request) => options.showUnapprovedTx(txMeta, request))

    this.txController.on('tx:status-update', (txId, status) => {
      if (status === 'confirmed' || status === 'failed') {
        const txMeta = this.txController.txStateManager.getTx(txId)
        if (this.platform) {
          this.platform.showTransactionNotification(txMeta) // TODO: implement platform specific handlers
        }
      }
    })

    this.assetContractController = new AssetContractController({
      provider: this.provider,
    })

    // Asset controllers
    this.assetController = new AssetController({
      network: this.networkController,
      provider: this.provider,
      getNftMetadata: this.prefsController.getNftMetadata.bind(this.prefsController),
      assetContractController: this.assetContractController,
    })

    this.assetDetectionController = new AssetDetectionController({
      network: this.networkController,
      provider: this.provider,
      assetController: this.assetController,
      getCovalentNfts: this.prefsController.getCovalentNfts.bind(this.prefsController),
      getOpenSeaCollectibles: this.prefsController.getOpenSeaCollectibles.bind(this.prefsController),
    })

    this.networkController.lookupNetwork()
    this.messageManager = new MessageManager()
    this.personalMessageManager = new PersonalMessageManager()
    this.typedMessageManager = new TypedMessageManager({ networkController: this.networkController })
    this.encryptionPublicKeyManager = new EncryptionPublicKeyManager()
    this.decryptMessageManager = new DecryptMessageManager()
    this.store.updateStructure({
      AssetController: this.assetController.store,
      // PermissionsController: this.permissionsController.permissions,
      TransactionController: this.txController.store,
      NetworkController: this.networkController.store,
      MessageManager: this.messageManager.store,
      CurrencyController: this.currencyController.store,
      PersonalMessageManager: this.personalMessageManager.store,
      TypedMessageManager: this.typedMessageManager.store,
      EncryptionPublicKeyManager: this.encryptionPublicKeyManager.store,
      DecryptMessageManager: this.decryptMessageManager.store,
    })
    this.updateAndApproveTransaction = nodeify(this.txController.updateAndApproveTransaction, this.txController)
    this.cancelTransaction = nodeify(this.txController.cancelTransaction, this.txController)

    if (typeof options.rehydrate === 'function') {
      setTimeout(() => {
        options.rehydrate()
      }, 50)
    }

    this.prefsController.on('addEtherscanTransactions', (txs, network) => {
      this.txController.addEtherscanTransactions(txs, network)
    })

    this.walletConnectController = new WalletConnectController({
      provider: this.provider,
      network: this.networkController,
    })
  }

  /**
   * Helper method for initializing provider
   */
  initializeProvider() {
    const providerOptions = {
      static: {
        eth_syncing: false,
        web3_clientVersion: `Torus/v${version}`,
      },
      version,
      // account mgmt
      getAccounts: async () =>
        // Expose no accounts if this origin has not been approved, preventing
        // account-requiring RPC methods from completing successfully
        // only show address if account is unlocked
        // log.info(this.prefsController.store.getState().selectedAddress, 'accounts')
        this.prefsController.store.getState().selectedAddress ? [this.prefsController.store.getState().selectedAddress] : [],
      // tx signing
      processTransaction: this.newUnapprovedTransaction.bind(this),
      // msg signing
      processEthSignMessage: this.newUnsignedMessage.bind(this),
      processTypedMessage: this.newUnsignedTypedMessage.bind(this),
      processTypedMessageV3: this.newUnsignedTypedMessage.bind(this),
      processTypedMessageV4: this.newUnsignedTypedMessage.bind(this),
      processPersonalMessage: this.newUnsignedPersonalMessage.bind(this),
      getPendingNonce: this.getPendingNonce.bind(this),
      getPendingTransactionByHash: (hash) => this.txController.getFilteredTxList({ hash, status: 'submitted' })[0],
      processEncryptionPublicKey: this.newUnsignedEncryptionPublicKey.bind(this),
      processDecryptMessage: this.newUnsignedDecryptMessage.bind(this),
    }
    const providerProxy = this.networkController.initializeProvider(providerOptions)
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
    this.on('update', (memState) => {
      this.isClientOpenAndUnlocked = memState.isUnlocked
      const publicState = selectPublicState(memState)
      publicConfigStore.putState(publicState)
    })

    // eslint-disable-next-line unicorn/consistent-function-scoping
    function selectPublicState(memState) {
      const result = {
        selectedAddress: memState.isUnlocked ? memState.selectedAddress : undefined,
        networkVersion: memState.network,
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
    const { keyringController } = this
    const { txController } = this
    const { networkController } = this

    return {
      // etc
      getState: (callback) => callback(null, this.getState()),
      setCurrentCurrency: this.setCurrentCurrency.bind(this),

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
      cancelTypedMessage: this.cancelTypedMessage.bind(this),

      // decryptMessageManager
      decryptMessage: nodeify(this.decryptMessage, this),
      decryptMessageInline: nodeify(this.decryptMessageInline, this),
      cancelDecryptMessage: this.cancelDecryptMessage.bind(this),

      // EncryptionPublicKeyManager
      encryptionPublicKey: nodeify(this.signEncryptionPublicKey, this),
      cancelEncryptionPublicKey: this.cancelEncryptionPublicKey.bind(this),
    }
  }

  // =============================================================================
  // KEYRING RELATED METHODS
  // =============================================================================

  initTorusKeyring(keyArray, addresses) {
    return Promise.all([this.keyringController.deserialize(keyArray), this.accountTracker.syncWithAddresses(addresses)])
  }

  async addAccount(key, address) {
    await this.keyringController.addAccount(key)
    this.accountTracker.addAccounts([address])
  }

  setSelectedAccount(address) {
    this.prefsController.setSelectedAddress(address)
    if (isMain) {
      this.detectTokensController.startTokenDetection(address)
      this.assetDetectionController.startAssetDetection(address)
      this.walletConnectController.setSelectedAddress(address)
    }
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
   * Called when a Dapp suggests a new tx to be signed.
   * this wrapper needs to exist so we can provide a reference to
   *  "newUnapprovedTransaction" before "txController" is instantiated
   *
   * @param {Object} msgParams - The params passed to eth_sign.
   * @param {Object} req - (optional) the original request, containing the origin
   */
  async newUnapprovedTransaction(txParameters, request) {
    return this.txController.newUnapprovedTransaction(txParameters, request)
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
  newUnsignedMessage(messageParameters, request) {
    const messageId = createRandomId()
    const promise = this.messageManager.addUnapprovedMessageAsync(messageParameters, request, messageId)
    this.sendUpdate()
    this.opts.showUnconfirmedMessage(messageId, request)
    return promise
  }

  /**
   * Signifies user intent to complete an eth_sign method.
   *
   * @param  {Object} msgParams The params passed to eth_sign.
   * @returns {Promise<Object>} Full state update.
   */
  signMessage(messageParameters) {
    log.info('MetaMaskController - signMessage')
    const messageId = messageParameters.metamaskId

    // sets the status op the message to 'approved'
    // and removes the metamaskId for signing
    // signs the message
    return this.messageManager
      .approveMessage(messageParameters)
      .then((cleanMessageParameters) => this.keyringController.signMessage(cleanMessageParameters.from, cleanMessageParameters.data))
      .then((rawSig) => {
        // tells the listener that the message has been signed
        // and can be returned to the dapp
        this.messageManager.setMsgStatusSigned(messageId, rawSig)
        return this.getState()
      })
  }

  /**
   * Used to cancel a message submitted via eth_sign.
   *
   * @param {string} msgId - The id of the message to cancel.
   */
  cancelMessage(messageId, callback) {
    const { messageManager } = this
    messageManager.rejectMsg(messageId)
    if (callback && typeof callback === 'function') {
      return callback(null, this.getState())
    }
    return undefined
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
  async newUnsignedPersonalMessage(messageParameters, request) {
    const messageId = createRandomId()
    const promise = this.personalMessageManager.addUnapprovedMessageAsync(messageParameters, request, messageId)
    this.sendUpdate()
    this.opts.showUnconfirmedMessage(messageId, request)
    return promise
  }

  /**
   * Signifies a user's approval to sign a personal_sign message in queue.
   * Triggers signing, and the callback function from newUnsignedPersonalMessage.
   *
   * @param {Object} msgParams - The params of the message to sign & return to the Dapp.
   * @returns {Promise<Object>} - A full state update.
   */
  signPersonalMessage(messageParameters) {
    log.info('MetaMaskController - signPersonalMessage')
    const messageId = messageParameters.metamaskId
    // sets the status op the message to 'approved'
    // and removes the metamaskId for signing
    // signs the message
    return this.personalMessageManager
      .approveMessage(messageParameters)
      .then((cleanMessageParameters) => this.keyringController.signPersonalMessage(cleanMessageParameters.from, cleanMessageParameters.data))
      .then((rawSig) => {
        // tells the listener that the message has been signed
        // and can be returned to the dapp
        this.personalMessageManager.setMsgStatusSigned(messageId, rawSig)
        return this.getState()
      })
  }

  /**
   * Used to cancel a personal_sign type message.
   * @param {string} msgId - The ID of the message to cancel.
   * @param {Function} cb - The callback function called with a full state update.
   */
  cancelPersonalMessage(messageId, callback) {
    const messageManager = this.personalMessageManager
    messageManager.rejectMsg(messageId)
    if (callback && typeof callback === 'function') {
      return callback(null, this.getState())
    }
    return undefined
  }

  // eth_signTypedData methods

  /**
   * Called when a dapp uses the eth_signTypedData method, per EIP 712.
   *
   * @param {Object} msgParams - The params passed to eth_signTypedData.
   * @param {Function} cb - The callback function, called with the signature.
   */
  newUnsignedTypedMessage(messageParameters, request, messageVersion) {
    const messageId = createRandomId()
    const promise = this.typedMessageManager.addUnapprovedMessageAsync(messageParameters, request, messageVersion, messageId)
    this.sendUpdate()
    this.opts.showUnconfirmedMessage(messageId, request)
    return promise
  }

  /**
   * The method for a user approving a call to eth_signTypedData, per EIP 712.
   * Triggers the callback in newUnsignedTypedMessage.
   *
   * @param  {Object} msgParams - The params passed to eth_signTypedData.
   * @returns {Object} Full state update.
   */
  async signTypedMessage(messageParameters) {
    log.info('MetaMaskController - eth_signTypedData')
    const messageId = messageParameters.metamaskId
    const { version: messageVersion } = messageParameters
    try {
      const cleanMessageParameters = await this.typedMessageManager.approveMessage(messageParameters)
      const address = toChecksumAddress(normalize(cleanMessageParameters.from))
      const signature = await this.keyringController.signTypedData(address, cleanMessageParameters.data, messageVersion)
      this.typedMessageManager.setMsgStatusSigned(messageId, signature)
      this.getState()
      return
    } catch (error) {
      log.info('TorusController - eth_signTypedData failed.', error)
      this.typedMessageManager.errorMessage(messageId, error)
    }
  }

  /**
   * Used to cancel a eth_signTypedData type message.
   * @param {string} msgId - The ID of the message to cancel.
   * @param {Function} cb - The callback function called with a full state update.
   */
  cancelTypedMessage(messageId, callback) {
    const messageManager = this.typedMessageManager
    messageManager.rejectMsg(messageId)
    if (callback && typeof callback === 'function') {
      return callback(null, this.getState())
    }
    return undefined
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
    await this.txController.createCancelTransaction(originalTxId, customGasPrice)
    const state = await this.getState()
    return state
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
  estimateGas(estimateGasParameters) {
    return new Promise((resolve, reject) => {
      this.txController.txGasUtil.query.estimateGas(estimateGasParameters, (error, response) => {
        if (error) {
          return reject(error)
        }
        return resolve(response)
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
    // const mux = setupMultiplex(connectionStream)
    // connect features && for test cases
    this.setupProviderConnection(connectionStream, originDomain)
    // this.setupPublicConfig(mux.createStream('publicConfig'))
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
  setupControllerConnection(_) {
    // const api = this.getApi()
    // const dnode = Dnode(api)
    // report new active controller connection
    this.activeControllerConnections += 1
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
   * @param {string} sender - The URI of the requesting resource.
   */
  setupProviderConnection(outStream, sender) {
    // break violently
    const senderUrl = new URL(sender)

    const engine = this.setupProviderEngine({ origin: senderUrl.hostname, location: sender })

    // setup connection
    const providerStream = createEngineStream({ engine })

    outStream
      .pipe(providerStream)
      .pipe(outStream)
      .on('error', (error) => {
        // cleanup filter polyfill middleware
        engine._middleware.forEach((mid) => {
          if (mid.destroy && typeof mid.destroy === 'function') {
            mid.destroy()
          }
        })
        if (error) log.error(error)
      })
  }

  /**
   * A method for creating a provider that is safely restricted for the requesting domain.
   * */
  setupProviderEngine({ origin }) {
    // setup json rpc engine stack
    const engine = new JsonRpcEngine()
    const { provider } = this
    const { blockTracker } = this

    // create filter polyfill middleware
    const filterMiddleware = createFilterMiddleware({ provider, blockTracker })
    // create subscription polyfill middleware
    const subscriptionManager = createSubscriptionManager({ provider, blockTracker })
    subscriptionManager.events.on('notification', (message) => engine.emit('notification', message))

    // metadata
    engine.push(createOriginMiddleware({ origin }))
    engine.push(createLoggerMiddleware({ origin }))
    // filter and subscription polyfills
    engine.push(filterMiddleware)
    engine.push(subscriptionManager.middleware)
    // permissions
    engine.push(this.permissionsController.createMiddleware({ origin }))
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
    const configStream = storeAsStream(this.publicConfigStore)
    pump(configStream, outStream, (error) => {
      configStream.destroy()
      if (error) log.error(error)
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
    const addr = toChecksumAddress(address)
    if (typeof this.opts.storeProps === 'function') {
      const { wallet } = this.opts.storeProps()
      if (addr == null) {
        throw new Error('TxController - No address given.')
      } else if (wallet[addr] == null) {
        throw new Error('TxController - No private key accessible, please login.')
      } else {
        return Buffer.from(wallet[addr], 'hex')
      }
    }
    return undefined
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
  async setCurrentCurrency(payload, callback) {
    const { ticker } = this.networkController.getNetworkConfig()
    try {
      // if (payload.selectedCurrency !== 'ETH') {
      this.currencyController.setNativeCurrency(ticker)
      this.currencyController.setCurrentCurrency(payload.selectedCurrency.toLowerCase())
      await this.currencyController.updateConversionRate()
      // }
      const data = {
        nativeCurrency: ticker || 'ETH',
        conversionRate: this.currencyController.getConversionRate(),
        currentCurrency: this.currencyController.getCurrentCurrency(),
        conversionDate: this.currencyController.getConversionDate(),
      }
      if (payload.origin && payload.origin !== 'store') {
        this.prefsController.setSelectedCurrency(payload)
      }
      if (callback) return callback(null, data)
    } catch (error) {
      return callback(error)
    }
    return undefined
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

  /**
   * Called when a dapp uses the eth_getEncryptionPublicKey method.
   *
   * @param {Object} messageParameters - The params of the message to sign & return to the Dapp.
   * @param {Object} request - (optional) the original request, containing the origin
   * Passed back to the requesting Dapp.
   */
  newUnsignedEncryptionPublicKey(messageParameters, request) {
    const messageId = createRandomId()
    const promise = this.encryptionPublicKeyManager.addUnapprovedMessageAsync(messageParameters, request, messageId)
    this.sendUpdate()
    this.opts.showUnconfirmedMessage(messageId, request)
    return promise
  }

  /**
   * Signifies a user's approval to receiving encryption public key in queue.
   * Triggers receiving, and the callback function from newUnsignedEncryptionPublicKey.
   *
   * @param {Object} messageParameters - The params of the message to receive & return to the Dapp.
   * @returns {Promise<Object>} - A full state update.
   */
  async signEncryptionPublicKey(messageParameters) {
    log.info('MetaMaskController - eth_getEncryptionPublicKey')
    const messageId = messageParameters.metamaskId
    try {
      const cleanMessageParameters = await this.encryptionPublicKeyManager.approveMessage(messageParameters)
      const address = toChecksumAddress(normalize(cleanMessageParameters.msgParams))
      const publicKey = this.keyringController.signEncryptionPublicKey(address)
      this.encryptionPublicKeyManager.setMsgStatusReceived(messageId, publicKey)
    } catch (error) {
      log.info('TorusController - eth_getEncryptionPublicKey failed.', error)
      this.encryptionPublicKeyManager.errorMessage(messageId, error)
    }
  }

  /**
   * Used to cancel a eth_getEncryptionPublicKey type message.
   * @param {string} msgId - The ID of the message to cancel.
   * @param {Function} cb - The callback function called with a full state update.
   */
  cancelEncryptionPublicKey(msgId, cb) {
    const messageManager = this.encryptionPublicKeyManager
    messageManager.rejectMsg(msgId)
    if (cb && typeof cb === 'function') {
      cb(null, this.getState())
    }
  }

  /**
   * Called when a dapp uses the eth_decrypt method.
   *
   * @param {Object} messageParameters - The params of the message to sign & return to the Dapp.
   * @param {Object} request = (optional) the original request, containing the origin.
   * Passed back to the requesting Dapp.
   */
  newUnsignedDecryptMessage(messageParameters, request) {
    const messageId = createRandomId()
    const promise = this.decryptMessageManager.addUnapprovedMessageAsync(messageParameters, request, messageId)
    this.sendUpdate()
    this.opts.showUnconfirmedMessage(messageId, request)
    return promise
  }

  /**
   * Signifies a user's approval to decrypt a message in queue.
   * Triggers decrypt, and the callback function from newUnsignedDecryptMessage.
   *
   * @param {Object} msgParams - The params of the message to decrypt & return to the Dapp.
   * @returns {Promise<Object>} - A full state update.
   */
  async signEthDecrypt(messageParameters) {
    log.info('MetaMaskController - eth_decrypt')
    const messageId = messageParameters.metamaskId
    try {
      const cleanMessageParameters = await this.decryptMessageManager.approveMessage(messageParameters)
      const address = toChecksumAddress(normalize(cleanMessageParameters.from))

      const stripped = stripHexPrefix(cleanMessageParameters.data)
      const buff = Buffer.from(stripped, 'hex')
      cleanMessageParameters.data = JSON.parse(buff.toString('utf8'))

      const rawMess = this.keyringController.decryptMessage(cleanMessageParameters, address)
      this.decryptMessageManager.setMsgStatusDecrypted(messageId, rawMess)
      this.getState()
      return
    } catch (error) {
      log.info('TorusController - eth_getEncryptionPublicKey failed.', error)
      this.encryptionPublicKeyManager.errorMessage(messageId, error)
    }
  }

  /**
   * Only decypt message and don't touch transaction state
   *
   * @param {Object} msgParams - The params of the message to decrypt.
   * @returns {Promise<Object>} - A full state update.
   */
  async decryptMessageInline(msgParams) {
    log.info('MetaMaskController - eth_decrypt inline')
    const address = toChecksumAddress(normalize(msgParams.from))
    const stripped = stripHexPrefix(msgParams.data)
    const buff = Buffer.from(stripped, 'hex')
    msgParams.data = JSON.parse(buff.toString('utf8'))

    return this.keyringController.decryptMessage(msgParams, address)
  }

  /**
   * Used to cancel a eth_decrypt type message.
   * @param {string} msgId - The ID of the message to cancel.
   * @param {Function} cb - The callback function called with a full state update.
   */
  cancelDecryptMessage(msgId, cb) {
    const messageManager = this.decryptMessageManager
    messageManager.rejectMsg(msgId)
    if (cb && typeof cb === 'function') {
      cb(null, this.getState())
    }
  }
}
