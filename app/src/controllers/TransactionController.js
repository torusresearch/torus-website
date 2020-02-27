import config from '../config'
import AbiDecoder from '../utils/abiDecoder'
import EventEmitter from 'safe-event-emitter'
import ObservableStore from 'obs-store'
import * as ethUtil from 'ethereumjs-util'
import { sha3 } from 'web3-utils'
import Transaction from 'ethereumjs-tx'
import EthQuery from 'ethjs-query'
import tokenAbi from 'human-standard-token-abi'
import collectibleAbi from 'human-standard-collectible-abi'
import { ethErrors } from 'eth-json-rpc-errors'
import { toChecksumAddress } from 'web3-utils'
import erc20Contracts from 'eth-contract-metadata'
import erc721Contracts from '../assets/assets-map.json'
import TransactionStateManager from './TransactionStateManager'
import TxGasUtil from '../utils/TxGasUtil'
import PendingTransactionTracker from './PendingTransactionTracker'
import NonceTracker from './NonceTracker'
import * as txUtils from '../utils/txUtils'
import cleanErrorStack from '../utils/cleanErrorStack'
import log from 'loglevel'

import Web3 from 'web3'

import {
  TRANSACTION_TYPE_CANCEL,
  TRANSACTION_TYPE_RETRY,
  TRANSACTION_TYPE_STANDARD,
  TRANSACTION_STATUS_APPROVED,
  TOKEN_METHOD_APPROVE,
  TOKEN_METHOD_TRANSFER,
  TOKEN_METHOD_TRANSFER_FROM,
  OLD_ERC721_LIST,
  SEND_ETHER_ACTION_KEY,
  DEPLOY_CONTRACT_ACTION_KEY,
  CONTRACT_INTERACTION_KEY,
  ZERO_ADDRESS,
  COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM
} from '../utils/enums'

import { hexToBn, bnToHex, BnMultiplyByFraction } from '../utils/utils'

const tokenABIDecoder = new AbiDecoder(tokenAbi)
const collectibleABIDecoder = new AbiDecoder(collectibleAbi)

/**
  Transaction Controller is an aggregate of sub-controllers and trackers
  composing them in a way to be exposed to the metamask controller
    <br>- txStateManager
      responsible for the state of a transaction and
      storing the transaction
    <br>- pendingTxTracker
      watching blocks for transactions to be include
      and emitting confirmed events
    <br>- txGasUtil
      gas calculations and safety buffering
    <br>- nonceTracker
      calculating nonces

  @class
  @param {object} - opts
  @param {object}  opts.initState - initial transaction list default is an empty array
  @param {Object}  opts.networkStore - an observable store for network number
  @param {Object}  opts.blockTracker - An instance of eth-blocktracker
  @param {Object}  opts.provider - A network provider.
  @param {Function}  opts.signTransaction - function the signs an ethereumjs-tx
  @param {Function}  [opts.getGasPrice] - optional gas price calculator
  @param {Function}  opts.signTransaction - ethTx signer that returns a rawTx
  @param {Number}  [opts.txHistoryLimit] - number *optional* for limiting how many transactions are in state
  @param {Object}  opts.preferencesStore
*/

class TransactionController extends EventEmitter {
  constructor(opts) {
    super()
    this.networkStore = opts.networkStore || new ObservableStore({})
    this.preferencesStore = opts.preferencesStore || new ObservableStore({})
    this.provider = opts.provider
    this.blockTracker = opts.blockTracker
    this.signEthTx = opts.signTransaction
    this.getGasPrice = opts.getGasPrice
    this.inProcessOfSigning = new Set()
    this.memStore = new ObservableStore({})
    this.query = new EthQuery(this.provider)
    this.web3 = new Web3(this.provider)
    this.getWallet = opts.getWallet
    this.txGasUtil = new TxGasUtil(this.provider)
    this.scwController = opts.scwController
    this.opts = opts
    this._mapMethods()
    this.txStateManager = new TransactionStateManager({
      initState: opts.initState,
      txHistoryLimit: opts.txHistoryLimit,
      getNetwork: this.getNetwork.bind(this)
    })
    this._onBootCleanUp()
    this.store = this.txStateManager.store
    this.nonceTracker = new NonceTracker({
      provider: this.provider,
      blockTracker: this.blockTracker,
      getPendingTransactions: this.txStateManager.getPendingTransactions.bind(this.txStateManager),
      getConfirmedTransactions: this.txStateManager.getConfirmedTransactions.bind(this.txStateManager)
    })

    this.pendingTxTracker = new PendingTransactionTracker({
      provider: this.provider,
      nonceTracker: this.nonceTracker,
      publishTransaction: rawTx => this.query.sendRawTransaction(rawTx),
      getPendingTransactions: () => {
        const pending = this.txStateManager.getPendingTransactions()
        const approved = this.txStateManager.getApprovedTransactions()
        return [...pending, ...approved]
      },
      approveTransaction: this.approveTransaction.bind(this),
      getCompletedTransactions: this.txStateManager.getConfirmedTransactions.bind(this.txStateManager)
    })

    this.txStateManager.store.subscribe(() => this.emit('update:badge'))
    this._setupListeners()
    // memstore is computed from a few different stores
    this._updateMemstore()
    this.txStateManager.store.subscribe(() => this._updateMemstore())
    this.networkStore.subscribe(() => {
      this._onBootCleanUp()
      this._updateMemstore()
    })
    this.preferencesStore.subscribe(() => this._updateMemstore())

    // request state update to finalize initialization
    this._updatePendingTxsAfterFirstBlock()
  }

  /** @returns {number} the chainId */
  getChainId() {
    const networkState = this.networkStore.getState()
    const getChainId = parseInt(networkState)
    if (Number.isNaN(getChainId)) {
      return 0
    } else {
      return getChainId
    }
  }

  /**
  Adds a tx to the txlist
  @emits ${txMeta.id}:unapproved
*/
  addTx(txMeta) {
    this.txStateManager.addTx(txMeta)
    this.emit(`${txMeta.id}:unapproved`, txMeta)
  }

  /**
  Wipes the transactions for a given account
  @param {string} address - hex string of the from address for txs being removed
  */
  wipeTransactions(address) {
    this.txStateManager.wipeTransactions(address)
  }

  /**
  add a new unapproved transaction to the pipeline

  @returns {Promise<string>} the hash of the transaction after being submitted to the network
  @param txParams {object} - txParams for the transaction
  @param opts {object} - with the key origin to put the origin on the txMeta
  */

  async newUnapprovedTransaction(txParams, opts = {}) {
    log.debug(`MetaMaskController newUnapprovedTransaction ${JSON.stringify(txParams)}`)
    const initialTxMeta = await this.addUnapprovedTransaction(txParams, opts.origin)

    // listen for tx completion (success, fail)
    return new Promise((resolve, reject) => {
      this.txStateManager.once(`${initialTxMeta.id}:finished`, finishedTxMeta => {
        // log.info(finishedTxMeta)
        switch (finishedTxMeta.status) {
          case 'submitted':
            return resolve(finishedTxMeta.hash)
          case 'rejected':
            return reject(cleanErrorStack(ethErrors.provider.userRejectedRequest('Torus Tx Signature: User denied transaction signature.')))
          case 'failed':
            return reject(cleanErrorStack(ethErrors.rpc.internal(finishedTxMeta.err.message)))
          default:
            return reject(cleanErrorStack(ethErrors.rpc.internal(`Torus Tx Signature: Unknown problem: ${JSON.stringify(finishedTxMeta.txParams)}`)))
        }
      })
    })
  }

  /**
  Validates and generates a txMeta with defaults and puts it in txStateManager
  store

  @returns {txMeta}
  */

  async addUnapprovedTransaction(txParams, origin) {
    // validate
    log.debug(`MetaMaskController addUnapprovedTransaction ${JSON.stringify(txParams)}`)
    const relayer = txParams.relayer
    const normalizedTxParams = txUtils.normalizeTxParams(txParams)
    txUtils.validateTxParams(normalizedTxParams)

    /**
    `generateTxMeta` adds the default txMeta properties to the passed object.
    These include the tx's `id`. As we use the id for determining order of
    txes in the tx-state-manager, it is necessary to call the asynchronous
    method `this._determineTransactionCategory` after `generateTxMeta`.
    */
    let txMeta = this.txStateManager.generateTxMeta({
      txParams: normalizedTxParams,
      type: TRANSACTION_TYPE_STANDARD
    })
    log.debug(`MetaMaskController addUnapprovedTransaction ${JSON.stringify(txMeta)}`)

    if (origin === 'metamask') {
      // Assert the from address is the selected address
      if (normalizedTxParams.from !== this.getSelectedAddress()) {
        throw ethErrors.rpc.internal({
          message: 'Internally initiated transaction is using invalid account.',
          data: {
            origin,
            fromAddress: normalizedTxParams.from,
            selectedAddress: this.getSelectedAddress()
          }
        })
      }
    } else {
      // Assert that the origin has permissions to initiate transactions from
      // the specified address
      const permittedAddresses = [await this.getSelectedAddress()]
      if (!permittedAddresses.includes(normalizedTxParams.from)) {
        throw ethErrors.provider.unauthorized({ data: { origin } })
      }
    }

    txMeta['origin'] = origin

    const { transactionCategory, getCodeResponse, methodParams, contractParams } = await this._determineTransactionCategory(txParams)
    txMeta.transactionCategory = transactionCategory
    txMeta.methodParams = methodParams
    txMeta.contractParams = contractParams
    txMeta.relayer = relayer

    this.addTx(txMeta)

    try {
      // add default tx params
      txMeta = await this.addTxGasDefaults(txMeta, getCodeResponse)
    } catch (error) {
      log.warn(error)
      txMeta.loadingDefaults = false
      this.txStateManager.updateTx(txMeta, 'Failed to calculate gas defaults.')
      throw error
    }

    this.emit('newUnapprovedTx', txMeta)

    txMeta.loadingDefaults = false

    // save txMeta
    this.txStateManager.updateTx(txMeta)

    return txMeta
  }

  /**
  adds the tx gas defaults: gas && gasPrice
  @param txMeta {Object} - the txMeta object
  @returns {Promise<object>} resolves with txMeta
*/
  async addTxGasDefaults(txMeta, getCodeResponse) {
    const txParams = txMeta.txParams
    // ensure value
    txParams.value = txParams.value ? ethUtil.addHexPrefix(txParams.value) : '0x0'
    txMeta.gasPriceSpecified = Boolean(txParams.gasPrice)
    let gasPrice = txParams.gasPrice
    if (!gasPrice) {
      gasPrice = this.getGasPrice ? this.getGasPrice() : await this.query.gasPrice()
    }
    txParams.gasPrice = ethUtil.addHexPrefix(gasPrice.toString(16))
    // set gasLimit
    const result = await this.txGasUtil.analyzeGasUsage(txMeta, getCodeResponse)
    return result
  }

  /**
    Creates a new txMeta with the same txParams as the original
    to allow the user to resign the transaction with a higher gas values
    @param  originalTxId {number} - the id of the txMeta that
    you want to attempt to retry
    @param  gasPrice {string=} - Optional gas price to be increased to use as the retry
    transaction's gas price
    @return {txMeta}
  */

  async retryTransaction(originalTxId, gasPrice) {
    const originalTxMeta = this.txStateManager.getTx(originalTxId)
    const { txParams } = originalTxMeta
    const lastGasPrice = gasPrice || originalTxMeta.txParams.gasPrice
    const suggestedGasPriceBN = new ethUtil.BN(ethUtil.stripHexPrefix(this.getGasPrice()), 16)
    const lastGasPriceBN = new ethUtil.BN(ethUtil.stripHexPrefix(lastGasPrice), 16)
    // essentially lastGasPrice * 1.1 but
    // dont trust decimals so a round about way of doing that
    const lastGasPriceBNBumped = lastGasPriceBN.mul(new ethUtil.BN(110, 10)).div(new ethUtil.BN(100, 10))
    // transactions that are being retried require a >=%10 bump or the clients will throw an error
    txParams.gasPrice = suggestedGasPriceBN.gt(lastGasPriceBNBumped)
      ? `0x${suggestedGasPriceBN.toString(16)}`
      : `0x${lastGasPriceBNBumped.toString(16)}`

    const txMeta = this.txStateManager.generateTxMeta({
      txParams: originalTxMeta.txParams,
      lastGasPrice,
      loadingDefaults: false,
      type: TRANSACTION_TYPE_RETRY
    })
    this.addTx(txMeta)
    this.emit('newUnapprovedTx', txMeta)
    return txMeta
  }

  /**
   * Creates a new approved transaction to attempt to cancel a previously submitted transaction. The
   * new transaction contains the same nonce as the previous, is a basic ETH transfer of 0x value to
   * the sender's address, and has a higher gasPrice than that of the previous transaction.
   * @param {number} originalTxId - the id of the txMeta that you want to attempt to cancel
   * @param {string=} customGasPrice - the hex value to use for the cancel transaction
   * @returns {txMeta}
   */
  async createCancelTransaction(originalTxId, customGasPrice) {
    const originalTxMeta = this.txStateManager.getTx(originalTxId)
    const { txParams } = originalTxMeta
    const { gasPrice: lastGasPrice, from, nonce } = txParams

    const newGasPrice = customGasPrice || bnToHex(BnMultiplyByFraction(hexToBn(lastGasPrice), 11, 10))
    const newTxMeta = this.txStateManager.generateTxMeta({
      txParams: {
        from,
        to: from,
        nonce,
        gas: '0x5208',
        value: '0x0',
        gasPrice: newGasPrice
      },
      lastGasPrice,
      loadingDefaults: false,
      status: TRANSACTION_STATUS_APPROVED,
      type: TRANSACTION_TYPE_CANCEL
    })

    this.addTx(newTxMeta)
    await this.approveTransaction(newTxMeta.id)
    return newTxMeta
  }

  async createSpeedUpTransaction(originalTxId, customGasPrice) {
    const originalTxMeta = this.txStateManager.getTx(originalTxId)
    const { txParams } = originalTxMeta
    const { gasPrice: lastGasPrice } = txParams

    const newGasPrice = customGasPrice || bnToHex(BnMultiplyByFraction(hexToBn(lastGasPrice), 11, 10))

    const newTxMeta = this.txStateManager.generateTxMeta({
      txParams: {
        ...txParams,
        gasPrice: newGasPrice
      },
      lastGasPrice,
      loadingDefaults: false,
      status: TRANSACTION_STATUS_APPROVED,
      type: TRANSACTION_TYPE_RETRY
    })

    this.addTx(newTxMeta)
    await this.approveTransaction(newTxMeta.id)
    return newTxMeta
  }

  /**
  updates the txMeta in the txStateManager
  @param txMeta {Object} - the updated txMeta
  */
  async updateTransaction(txMeta) {
    this.txStateManager.updateTx(txMeta, 'confTx: user updated transaction')
  }

  /**
  updates and approves the transaction
  @param txMeta {Object}
  */
  async updateAndApproveTransaction(txMeta) {
    this.txStateManager.updateTx(txMeta, 'confTx: user approved transaction')
    await this.approveTransaction(txMeta.id)
  }

  /**
  sets the tx status to approved
  auto fills the nonce
  signs the transaction
  publishes the transaction
  if any of these steps fails the tx status will be set to failed
    @param txId {number} - the tx's Id
  */
  async approveTransaction(txId) {
    let nonceLock
    try {
      if (this.inProcessOfSigning.has(txId)) {
        return
      }
      const txMeta = this.txStateManager.getTx(txId)

      this.inProcessOfSigning.add(txId)
      // approve
      this.txStateManager.setTxStatusApproved(txId)
      // get next nonce

      const fromAddress = txMeta.txParams.from
      // wait for a nonce
      nonceLock = await this.nonceTracker.getNonceLock(fromAddress)
      // add nonce to txParams
      // if txMeta has lastGasPrice then it is a retry at same nonce with higher
      // gas price transaction and their for the nonce should not be calculated
      const nonce = txMeta.lastGasPrice ? txMeta.txParams.nonce : nonceLock.nextNonce
      txMeta.txParams.nonce = ethUtil.addHexPrefix(nonce.toString(16))
      // add nonce debugging information to txMeta
      txMeta.nonceDetails = nonceLock.nonceDetails
      this.txStateManager.updateTx(txMeta, 'transactions#approveTransaction')

      // sign transaction
      if (txMeta.relayer) {
        await this.scwController.signTransaction(txId, this.txStateManager, this.getChainId())
        // await this.scwController.publishTransaction()
        // this.txStateManager.setTxStatusSigned(txId)
        //this.setTxHash(txId, 'PENDING_'.concat(txMeta.id))
        this.txStateManager.setTxStatusSubmitted(txId)
        // this.txStateManager.setTxStatusConfirmed(txId)
      } else {
        const rawTx = await this.signTransaction(txId)
        await this.publishTransaction(txId, rawTx)
      }

      // must set transaction to submitted/failed before releasing lock
      nonceLock.releaseLock()
    } catch (err) {
      // this is try-catch wrapped so that we can guarantee that the nonceLock is released
      try {
        this.txStateManager.setTxStatusFailed(txId, err)
      } catch (err) {
        log.error(err)
      }
      // must set transaction to submitted/failed before releasing lock
      if (nonceLock) nonceLock.releaseLock()
      // continue with error chain
      throw err
    } finally {
      this.inProcessOfSigning.delete(txId)
    }
  }

  /**
    adds the chain id and signs the transaction and set the status to signed
    @param txId {number} - the tx's Id
    @returns - rawTx {string}
  */
  async signTransaction(txId) {
    const txMeta = this.txStateManager.getTx(txId)
    // add network/chain id
    const chainId = this.getChainId()
    const txParams = Object.assign({}, txMeta.txParams, { chainId })
    // sign tx
    const fromAddress = txParams.from
    const ethTx = new Transaction(txParams)
    await this.signEthTx(ethTx, fromAddress)

    // add r,s,v values for provider request purposes see createMetamaskMiddleware
    // and JSON rpc standard for further explanation
    txMeta.r = ethUtil.bufferToHex(ethTx.r)
    txMeta.s = ethUtil.bufferToHex(ethTx.s)
    txMeta.v = ethUtil.bufferToHex(ethTx.v)

    this.txStateManager.updateTx(txMeta, 'transactions#signTransaction: add r, s, v values')

    // set state to signed
    this.txStateManager.setTxStatusSigned(txMeta.id)
    const rawTx = ethUtil.bufferToHex(ethTx.serialize())
    return rawTx
  }

  /**
    publishes the raw tx and sets the txMeta to submitted
    @param txId {number} - the tx's Id
    @param rawTx {string} - the hex string of the serialized signed transaction
    @returns {Promise<void>}
  */
  async publishTransaction(txId, rawTx) {
    const txMeta = this.txStateManager.getTx(txId)
    txMeta.rawTx = rawTx
    this.txStateManager.updateTx(txMeta, 'transactions#publishTransaction')
    let txHash
    try {
      txHash = await this.query.sendRawTransaction(rawTx)
    } catch (error) {
      if (error.message.toLowerCase().includes('known transaction')) {
        txHash = sha3(ethUtil.addHexPrefix(rawTx)).toString('hex')
        txHash = ethUtil.addHexPrefix(txHash)
      } else {
        throw error
      }
    }
    this.setTxHash(txId, txHash)
    this.txStateManager.setTxStatusSubmitted(txId)
  }

  /**
   * Sets the status of the transaction to confirmed and sets the status of nonce duplicates as
   * dropped if the txParams have data it will fetch the txReceipt
   * @param {number} txId - The tx's ID
   * @returns {Promise<void>}
   */
  async confirmTransaction(txId, txReceipt) {
    // get the txReceipt before marking the transaction confirmed
    // to ensure the receipt is gotten before the ui revives the tx
    const txMeta = this.txStateManager.getTx(txId)

    if (!txMeta) {
      return
    }

    try {
      // const txReceipt = await this.query.getTransactionReceipt(txMeta.hash)

      // It seems that sometimes the numerical values being returned from
      // this.query.getTransactionReceipt are BN instances and not strings.
      const gasUsed = typeof txReceipt.gasUsed !== 'string' ? txReceipt.gasUsed.toString(16) : txReceipt.gasUsed

      txMeta.txReceipt = {
        ...txReceipt,
        gasUsed
      }

      this.txStateManager.updateTx(txMeta, 'transactions#confirmTransaction - add txReceipt')
    } catch (err) {
      log.error(err)
    }

    this.txStateManager.setTxStatusConfirmed(txId)
    this._markNonceDuplicatesDropped(txId)
  }

  /**
    Convenience method for the ui thats sets the transaction to rejected
    @param txId {number} - the tx's Id
    @returns {Promise<void>}
  */
  async cancelTransaction(txId) {
    this.txStateManager.setTxStatusRejected(txId)
  }

  /**
    Sets the txHash on the txMeta
    @param txId {number} - the tx's Id
    @param txHash {string} - the hash for the txMeta
  */
  setTxHash(txId, txHash) {
    // Add the tx hash to the persisted meta-tx object
    const txMeta = this.txStateManager.getTx(txId)
    txMeta.hash = txHash
    this.txStateManager.updateTx(txMeta, 'transactions#setTxHash')
  }

  //
  //           PRIVATE METHODS
  //
  /** maps methods for convenience */
  _mapMethods() {
    /** @returns the state in transaction controller */
    this.getState = () => this.memStore.getState()
    /** @returns the network number stored in networkStore */
    this.getNetwork = () => this.networkStore.getState()
    /** @returns the user selected address */
    this.getSelectedAddress = () => {
      if (typeof this.opts.storeProps === 'function') {
        const { selectedAddress } = this.opts.storeProps() || {}
        return (selectedAddress && selectedAddress.toLowerCase()) || ''
      } else return ''
    }
    /**  */
    this.getSelectedEOA = () => {
      if (typeof this.opts.storeProps === 'function') {
        console.log(this.opts.storeProps())
        const { selectedEOA } = this.opts.storeProps() || {}
        return (selectedEOA && selectedEOA.toLowerCase()) || ''
      } else return ''
    }
    /** Returns an array of transactions whos status is unapproved */
    this.getUnapprovedTxCount = () => Object.keys(this.txStateManager.getUnapprovedTxList()).length
    /**
      @returns a number that represents how many transactions have the status submitted
      @param account {String} - hex prefixed account
    */
    this.getPendingTxCount = account => this.txStateManager.getPendingTransactions(account).length
    /** see txStateManager */
    this.getFilteredTxList = opts => this.txStateManager.getFilteredTxList(opts)
  }

  // called once on startup
  async _updatePendingTxsAfterFirstBlock() {
    // wait for first block so we know we're ready
    await this.blockTracker.getLatestBlock()
    // get status update for all pending transactions (for the current network)
    await this.pendingTxTracker.updatePendingTxs()
  }

  /**
    If transaction controller was rebooted with transactions that are uncompleted
    in steps of the transaction signing or user confirmation process it will either
    transition txMetas to a failed state or try to redo those tasks.
  */

  _onBootCleanUp() {
    this.txStateManager
      .getFilteredTxList({
        status: 'unapproved',
        loadingDefaults: true
      })
      .forEach(tx => {
        this.addTxGasDefaults(tx)
          .then(txMeta => {
            txMeta.loadingDefaults = false
            this.txStateManager.updateTx(txMeta, 'transactions: gas estimation for tx on boot')
          })
          .catch(error => {
            tx.loadingDefaults = false
            this.txStateManager.updateTx(tx, 'failed to estimate gas during boot cleanup.')
            this.txStateManager.setTxStatusFailed(tx.id, error)
          })
      })

    this.txStateManager
      .getFilteredTxList({
        status: TRANSACTION_STATUS_APPROVED
      })
      .forEach(txMeta => {
        const txSignError = new Error('Transaction found as "approved" during boot - possibly stuck during signing')
        this.txStateManager.setTxStatusFailed(txMeta.id, txSignError)
      })
  }

  /**
    is called in constructor applies the listeners for pendingTxTracker txStateManager
    and blockTracker
  */
  _setupListeners() {
    this.txStateManager.on('tx:status-update', this.emit.bind(this, 'tx:status-update'))
    this._setupBlockTrackerListener()
    this.pendingTxTracker.on('tx:warning', txMeta => {
      this.txStateManager.updateTx(txMeta, 'transactions/pending-tx-tracker#event: tx:warning')
    })
    this.pendingTxTracker.on('tx:failed', this.txStateManager.setTxStatusFailed.bind(this.txStateManager))
    this.pendingTxTracker.on('tx:confirmed', (txId, transactionReceipt) => this.confirmTransaction(txId, transactionReceipt))
    this.pendingTxTracker.on('tx:dropped', this.txStateManager.setTxStatusDropped.bind(this.txStateManager))
    this.pendingTxTracker.on('tx:block-update', (txMeta, latestBlockNumber) => {
      if (!txMeta.firstRetryBlockNumber) {
        txMeta.firstRetryBlockNumber = latestBlockNumber
        this.txStateManager.updateTx(txMeta, 'transactions/pending-tx-tracker#event: tx:block-update')
      }
    })
    this.pendingTxTracker.on('tx:retry', txMeta => {
      if (!('retryCount' in txMeta)) txMeta.retryCount = 0
      txMeta.retryCount++
      this.txStateManager.updateTx(txMeta, 'transactions/pending-tx-tracker#event: tx:retry')
    })
  }

  /**
    Returns a "type" for a transaction out of the following list: simpleSend, tokenTransfer, tokenApprove,
    contractDeployment, contractMethodCall
  */
  async _determineTransactionCategory(txParams) {
    const { data, to } = txParams
    const checkSummedTo = toChecksumAddress(to)
    const decodedERC721 = data && collectibleABIDecoder.decodeMethod(data)
    const decodedERC20 = data && tokenABIDecoder.decodeMethod(data)
    log.debug('_determineTransactionCategory', decodedERC20, decodedERC721)

    let result
    let code
    let tokenMethodName = ''
    let methodParams = {}
    let contractParams = {}
    const tokenObj = Object.prototype.hasOwnProperty.call(erc20Contracts, checkSummedTo) ? erc20Contracts[toChecksumAddress(to)] : {}
    // If we know the contract address, mark it as erc20
    if (tokenObj && tokenObj.erc20 && decodedERC20) {
      const { name = '', params } = decodedERC20
      tokenMethodName = [TOKEN_METHOD_APPROVE, TOKEN_METHOD_TRANSFER, TOKEN_METHOD_TRANSFER_FROM].find(
        tokenMethodName => tokenMethodName.toLowerCase() === name.toLowerCase()
      )
      methodParams = params
      contractParams = tokenObj
    } else if (OLD_ERC721_LIST.hasOwnProperty(checkSummedTo.toLowerCase())) {
      // For Cryptokitties
      tokenMethodName = COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM
      contractParams = Object.prototype.hasOwnProperty.call(erc721Contracts, checkSummedTo.toLowerCase())
        ? erc721Contracts[checkSummedTo.toLowerCase()]
        : {}
      const ck20 = data && tokenABIDecoder.decodeMethod(data)
      delete contractParams['erc20']
      contractParams.erc721 = true
      contractParams.isSpecial = true
      methodParams = ck20.params
    } else if (decodedERC20) {
      // fallback to erc20
      const { name = '', params } = decodedERC20
      tokenMethodName = [TOKEN_METHOD_APPROVE, TOKEN_METHOD_TRANSFER, TOKEN_METHOD_TRANSFER_FROM].find(
        tokenMethodName => tokenMethodName.toLowerCase() === name.toLowerCase()
      )
      methodParams = params
      contractParams.erc20 = true
      contractParams.symbol = 'ERC20'
    } else if (decodedERC721) {
      // Next give preference to erc721
      const { name = '', params } = decodedERC721
      // transferFrom & approve of ERC721 can't be distinguished from ERC20
      tokenMethodName = [COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM].find(tokenMethodName => tokenMethodName.toLowerCase() === name.toLowerCase())
      methodParams = params
      contractParams = Object.prototype.hasOwnProperty.call(erc721Contracts, checkSummedTo.toLowerCase())
        ? erc721Contracts[checkSummedTo.toLowerCase()]
        : {}

      contractParams.erc721 = true
      contractParams.decimals = 0
    }

    // log.info(data, decodedERC20, decodedERC721, tokenMethodName, contractParams, methodParams)

    if (!result) {
      if (txParams.data && tokenMethodName) {
        result = tokenMethodName
      } else if (txParams.data && !to) {
        result = DEPLOY_CONTRACT_ACTION_KEY
      }
      if (!result) {
        try {
          code = await this.query.getCode(to)
        } catch (e) {
          code = null
          log.warn(e)
        }
        const codeIsEmpty = !code || code === '0x' || code === '0x0'

        result = codeIsEmpty ? SEND_ETHER_ACTION_KEY : CONTRACT_INTERACTION_KEY
      }
    }
    return { transactionCategory: result, getCodeResponse: code, methodParams: methodParams, contractParams: contractParams }
  }

  /**
    Sets other txMeta statuses to dropped if the txMeta that has been confirmed has other transactions
    in the list have the same nonce

    @param txId {Number} - the txId of the transaction that has been confirmed in a block
  */
  _markNonceDuplicatesDropped(txId) {
    // get the confirmed transactions nonce and from address
    const txMeta = this.txStateManager.getTx(txId)
    const { nonce, from } = txMeta.txParams
    const sameNonceTxs = this.txStateManager.getFilteredTxList({ nonce, from })
    if (!sameNonceTxs.length) return
    // mark all same nonce transactions as dropped and give i a replacedBy hash
    sameNonceTxs.forEach(otherTxMeta => {
      if (otherTxMeta.id === txId) return
      otherTxMeta.replacedBy = txMeta.hash
      this.txStateManager.updateTx(txMeta, 'transactions/pending-tx-tracker#event: tx:confirmed reference to confirmed txHash with same nonce')
      this.txStateManager.setTxStatusDropped(otherTxMeta.id)
    })
  }

  _setupBlockTrackerListener() {
    let listenersAreActive = false
    const latestBlockHandler = this._onLatestBlock.bind(this)
    const blockTracker = this.blockTracker
    const txStateManager = this.txStateManager

    txStateManager.on('tx:status-update', updateSubscription)
    updateSubscription()

    function updateSubscription() {
      const pendingTxs = txStateManager.getPendingTransactions()
      if (!listenersAreActive && pendingTxs.length > 0) {
        blockTracker.on('latest', latestBlockHandler)
        listenersAreActive = true
      } else if (listenersAreActive && !pendingTxs.length) {
        blockTracker.removeListener('latest', latestBlockHandler)
        listenersAreActive = false
      }
    }
  }

  async _onLatestBlock(blockNumber) {
    try {
      await this.pendingTxTracker.updatePendingTxs()
    } catch (err) {
      log.error(err)
    }
    try {
      await this.pendingTxTracker.resubmitPendingTxs(blockNumber)
    } catch (err) {
      log.error(err)
    }
  }

  /**
    Updates the memStore in transaction controller
  */
  _updateMemstore() {
    this.pendingTxTracker.updatePendingTxs()
    const unapprovedTxs = this.txStateManager.getUnapprovedTxList()
    const selectedAddressTxList = this.txStateManager.getFilteredTxList({
      from: this.getSelectedAddress(),
      metamaskNetworkId: this.getNetwork()
    })
    this.memStore.updateState({ unapprovedTxs, selectedAddressTxList })
  }
}

export default TransactionController
