/* eslint-disable require-atomic-updates */
import { ObservableStore } from '@metamask/obs-store'
import EventEmitter from '@metamask/safe-event-emitter'
import { ethErrors } from 'eth-rpc-errors'
import Common from 'ethereumjs-common'
import { Transaction } from 'ethereumjs-tx'
import { addHexPrefix, BN, bufferToHex, stripHexPrefix } from 'ethereumjs-util'
import EthQuery from 'ethjs-query'
import collectibleAbi from 'human-standard-collectible-abi'
import tokenAbi from 'human-standard-token-abi'
import log from 'loglevel'
import { ERC1155 as erc1155Abi } from 'multi-token-standard-abi'
import { fromWei, isAddress, sha3, toBN, toChecksumAddress } from 'web3-utils'

import erc721Contracts from '../assets/assets-map.json'
import AbiDecoder from '../utils/abiDecoder'
import erc20Contracts from '../utils/contractMetadata'
import {
  COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM,
  CONTRACT_INTERACTION_KEY,
  CONTRACT_TYPE_ERC20,
  CONTRACT_TYPE_ERC721,
  CONTRACT_TYPE_ERC1155,
  CONTRACT_TYPE_ETH,
  DEPLOY_CONTRACT_ACTION_KEY,
  GOERLI_CODE,
  KOVAN_CODE,
  MAINNET_CODE,
  OLD_ERC721_LIST,
  RINKEBY_CODE,
  ROPSTEN_CODE,
  SEND_ETHER_ACTION_KEY,
  SUPPORTED_NETWORK_TYPES,
  TOKEN_METHOD_APPROVE,
  TOKEN_METHOD_TRANSFER,
  TOKEN_METHOD_TRANSFER_FROM,
  TRANSACTION_STATUS_APPROVED,
  TRANSACTION_TYPE_CANCEL,
  TRANSACTION_TYPE_RETRY,
  TRANSACTION_TYPE_STANDARD,
} from '../utils/enums'
import { BnMultiplyByFraction, bnToHex, formatPastTx, getEtherScanHashLink, hexToBn } from '../utils/utils'
import NonceTracker from './NonceTracker'
import PendingTransactionTracker from './PendingTransactionTracker'
import TransactionStateManager from './TransactionStateManager'
import cleanErrorStack from './utils/cleanErrorStack'
import TxGasUtil from './utils/TxGasUtil'
import * as txUtils from './utils/txUtils'

const tokenABIDecoder = new AbiDecoder(tokenAbi)
const collectibleABIDecoder = new AbiDecoder(collectibleAbi)
const erc1155AbiDecoder = new AbiDecoder(erc1155Abi.abi)
const SUPPORTED_CHAINS = new Set([GOERLI_CODE, KOVAN_CODE, MAINNET_CODE, RINKEBY_CODE, ROPSTEN_CODE])

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
  constructor(options) {
    super()
    this.networkStore = options.networkStore || new ObservableStore({})
    this.preferencesStore = options.preferencesStore || new ObservableStore({})
    this.provider = options.provider
    this.blockTracker = options.blockTracker
    this.signEthTx = options.signTransaction
    this.getGasPrice = options.getGasPrice
    this.inProcessOfSigning = new Set()
    this.memStore = new ObservableStore({})
    this.query = new EthQuery(this.provider)
    this.txGasUtil = new TxGasUtil(this.provider)
    this.opts = options
    this._mapMethods()
    this.txStateManager = new TransactionStateManager({
      initState: options.initState,
      txHistoryLimit: options.txHistoryLimit,
      getNetwork: this.getNetwork.bind(this),
    })
    this._onBootCleanUp()

    this.store = this.txStateManager.store
    this.etherscanTxStore = new ObservableStore([])
    this.nonceTracker = new NonceTracker({
      provider: this.provider,
      blockTracker: this.blockTracker,
      getPendingTransactions: this.txStateManager.getPendingTransactions.bind(this.txStateManager),
      getConfirmedTransactions: this.txStateManager.getConfirmedTransactions.bind(this.txStateManager),
    })

    this.pendingTxTracker = new PendingTransactionTracker({
      provider: this.provider,
      nonceTracker: this.nonceTracker,
      publishTransaction: (rawTx) => this.query.sendRawTransaction(rawTx),
      getPendingTransactions: () => {
        const pending = this.txStateManager.getPendingTransactions()
        const approved = this.txStateManager.getApprovedTransactions()
        return [...pending, ...approved]
      },
      approveTransaction: this.approveTransaction.bind(this),
      getCompletedTransactions: this.txStateManager.getConfirmedTransactions.bind(this.txStateManager),
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
    const getChainId = networkState.toString().startsWith('0x') ? Number.parseInt(networkState, 16) : Number.parseInt(networkState, 10)
    if (Number.isNaN(getChainId)) {
      return 0
    }
    return getChainId
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

  async newUnapprovedTransaction(txParameters, options = {}) {
    log.debug(`MetaMaskController newUnapprovedTransaction ${JSON.stringify(txParameters)}`)
    const initialTxMeta = await this.addUnapprovedTransaction(txParameters, options)

    // listen for tx completion (success, fail)
    return new Promise((resolve, reject) => {
      this.txStateManager.once(`${initialTxMeta.id}:finished`, (finishedTxMeta) => {
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

  async addUnapprovedTransaction(txParameters, request) {
    // validate
    log.debug(`MetaMaskController addUnapprovedTransaction ${JSON.stringify(txParameters)}`)
    const normalizedTxParameters = txUtils.normalizeTxParams(txParameters)
    txUtils.validateTxParams(normalizedTxParameters)

    /**
    `generateTxMeta` adds the default txMeta properties to the passed object.
    These include the tx's `id`. As we use the id for determining order of
    txes in the tx-state-manager, it is necessary to call the asynchronous
    method `this._determineTransactionCategory` after `generateTxMeta`.
    */
    let txMeta = this.txStateManager.generateTxMeta({
      txParams: normalizedTxParameters,
      type: TRANSACTION_TYPE_STANDARD,
    })

    if (request.origin === 'metamask') {
      // Assert the from address is the selected address
      if (normalizedTxParameters.from !== this.getSelectedAddress()) {
        throw ethErrors.rpc.internal({
          message: 'Internally initiated transaction is using invalid account.',
          data: {
            origin: request.origin,
            fromAddress: normalizedTxParameters.from,
            selectedAddress: this.getSelectedAddress(),
          },
        })
      }
    } else {
      // Assert that the origin has permissions to initiate transactions from
      // the specified address
      const permittedAddresses = new Set([await this.getSelectedAddress()])
      if (!permittedAddresses.has(normalizedTxParameters.from)) {
        throw ethErrors.provider.unauthorized({ data: { origin: request.origin }, message: 'Unauthorized origin' })
      }
    }

    txMeta.origin = request.origin

    const { transactionCategory, getCodeResponse, methodParams, contractParams } = await this._determineTransactionCategory(txParameters)
    txMeta.transactionCategory = transactionCategory
    txMeta.methodParams = methodParams
    txMeta.contractParams = contractParams

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

    this.emit('newUnapprovedTx', txMeta, request)

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
    const { txParams } = txMeta
    // ensure value
    txParams.value = txParams.value ? addHexPrefix(txParams.value) : '0x0'
    const gasPriceNumber = Number(txParams.gasPrice)
    txMeta.gasPriceSpecified = Boolean(gasPriceNumber)
    let { gasPrice } = txParams
    if (!gasPrice || !gasPriceNumber) {
      gasPrice = this.getGasPrice ? this.getGasPrice() : await this.query.gasPrice()
    }
    txParams.gasPrice = addHexPrefix(gasPrice.toString(16))
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
    const suggestGasPrice = this.getGasPrice ? this.getGasPrice() : await this.query.gasPrice()
    const suggestedGasPriceBN = new BN(stripHexPrefix(suggestGasPrice), 16)
    const lastGasPriceBN = new BN(stripHexPrefix(lastGasPrice), 16)
    // essentially lastGasPrice * 1.1 but
    // dont trust decimals so a round about way of doing that
    const lastGasPriceBNBumped = lastGasPriceBN.mul(new BN(110, 10)).div(new BN(100, 10))
    // transactions that are being retried require a >=%10 bump or the clients will throw an error
    txParams.gasPrice = suggestedGasPriceBN.gt(lastGasPriceBNBumped)
      ? `0x${suggestedGasPriceBN.toString(16)}`
      : `0x${lastGasPriceBNBumped.toString(16)}`

    const txMeta = this.txStateManager.generateTxMeta({
      txParams: originalTxMeta.txParams,
      lastGasPrice,
      loadingDefaults: false,
      type: TRANSACTION_TYPE_RETRY,
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
        gasPrice: newGasPrice,
      },
      lastGasPrice,
      loadingDefaults: false,
      status: TRANSACTION_STATUS_APPROVED,
      type: TRANSACTION_TYPE_CANCEL,
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
        gasPrice: newGasPrice,
      },
      lastGasPrice,
      loadingDefaults: false,
      status: TRANSACTION_STATUS_APPROVED,
      type: TRANSACTION_TYPE_RETRY,
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
      this.inProcessOfSigning.add(txId)
      // approve
      this.txStateManager.setTxStatusApproved(txId)
      // get next nonce
      const txMeta = this.txStateManager.getTx(txId)
      const fromAddress = txMeta.txParams.from
      // wait for a nonce
      let { customNonceValue } = txMeta.txParams
      customNonceValue = Number(customNonceValue)
      nonceLock = await this.nonceTracker.getNonceLock(fromAddress)
      // add nonce to txParams
      // if txMeta has lastGasPrice then it is a retry at same nonce with higher
      // gas price transaction and their for the nonce should not be calculated
      const nonce = txMeta.lastGasPrice ? txMeta.txParams.nonce : nonceLock.nextNonce
      const customOrNonce = customNonceValue === 0 ? customNonceValue : customNonceValue || nonce
      txMeta.txParams.nonce = addHexPrefix(customOrNonce.toString(16))
      // add nonce debugging information to txMeta
      txMeta.nonceDetails = nonceLock.nonceDetails
      if (customNonceValue) {
        txMeta.nonceDetails.customNonceValue = customNonceValue
      }
      this.txStateManager.updateTx(txMeta, 'transactions#approveTransaction')
      // sign transaction
      const rawTx = await this.signTransaction(txId)
      await this.publishTransaction(txId, rawTx)
      // must set transaction to submitted/failed before releasing lock
      nonceLock.releaseLock()
    } catch (error) {
      // this is try-catch wrapped so that we can guarantee that the nonceLock is released
      try {
        this.txStateManager.setTxStatusFailed(txId, error)
      } catch (error_) {
        log.error(error_)
      }
      // must set transaction to submitted/failed before releasing lock
      if (nonceLock) nonceLock.releaseLock()
      // continue with error chain
      throw error
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
    const txParameters = { ...txMeta.txParams, chainId }
    // sign tx
    const fromAddress = txParameters.from
    let chainParameters
    if (SUPPORTED_CHAINS.has(chainId)) chainParameters = { chain: chainId }
    else {
      chainParameters = {
        common: Common.forCustomChain(
          1,
          {
            chainId,
          },
          'istanbul'
        ),
      }
    }
    log.info('params', txParameters, chainParameters, chainId)
    const ethTx = new Transaction(txParameters, chainParameters)
    await this.signEthTx(ethTx, fromAddress)

    // add r,s,v values for provider request purposes see createMetamaskMiddleware
    // and JSON rpc standard for further explanation
    txMeta.r = bufferToHex(ethTx.r)
    txMeta.s = bufferToHex(ethTx.s)
    txMeta.v = bufferToHex(ethTx.v)

    this.txStateManager.updateTx(txMeta, 'transactions#signTransaction: add r, s, v values')

    // set state to signed
    this.txStateManager.setTxStatusSigned(txMeta.id)
    const rawTx = bufferToHex(ethTx.serialize())
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
        txHash = sha3(addHexPrefix(rawTx)).toString('hex')
        txHash = addHexPrefix(txHash)
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
        gasUsed,
      }

      this.txStateManager.updateTx(txMeta, 'transactions#confirmTransaction - add txReceipt')
    } catch (error) {
      log.error(error)
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
    Sets the txHas on the txMeta
    @param txId {number} - the tx's Id
    @param txHash {string} - the hash for the txMeta
  */
  setTxHash(txId, txHash) {
    // Add the tx hash to the persisted meta-tx object
    const txMeta = this.txStateManager.getTx(txId)
    txMeta.hash = txHash
    this.txStateManager.updateTx(txMeta, 'transactions#setTxHash')
  }

  async addEtherscanTransactions(txs, network) {
    const lowerCaseSelectedAddress = this.getSelectedAddress()

    const transactionPromises = await Promise.all(
      txs.map(async (tx) => {
        const { transactionCategory, contractParams } = await this._determineTransactionCategory({
          data: tx.input,
          to: tx.contractAddress || tx.to,
          isEtherscan: true,
        })
        tx.transaction_category = transactionCategory

        tx.type_image_link = contractParams.logo || tx.type_image_link
        tx.type_name = tx.name || tx.tokenName || SUPPORTED_NETWORK_TYPES[network]?.ticker

        if (contractParams.erc1155) {
          tx.type = CONTRACT_TYPE_ERC1155
          tx.symbol = tx.tokenName || tx.tokenID || tx.symbol
        }
        if (contractParams.erc721) {
          tx.type = CONTRACT_TYPE_ERC721
          tx.symbol = tx.tokenName || tx.tokenID || tx.symbol
        }
        if (contractParams.erc20) {
          tx.type = CONTRACT_TYPE_ERC20
        }

        return tx
      })
    )

    const finalTxs = transactionPromises.reduce((accumulator, x) => {
      const totalAmount = x.value ? fromWei(toBN(x.value)) : ''
      const etherscanTransaction = {
        etherscanLink: getEtherScanHashLink(x.hash, network),
        type: x.type || SUPPORTED_NETWORK_TYPES[network]?.ticker || CONTRACT_TYPE_ETH,
        type_image_link: x.type_image_link || 'n/a',
        type_name: x.type_name || 'n/a',
        symbol: x.tokenSymbol || SUPPORTED_NETWORK_TYPES[network]?.ticker || 'ETH',
        token_id: x.tokenID || '',
        total_amount: totalAmount,
        created_at: x.timeStamp * 1000,
        from: x.from,
        to: x.to,
        transaction_hash: x.hash,
        network,
        status: x.txreceipt_status && x.txreceipt_status === '0' ? 'failed' : 'success',
        isEtherscan: true,
        input: x.input,
        contract_address: x.contractAddress,
        transaction_category: x.transaction_category,
      }
      accumulator.push(formatPastTx(etherscanTransaction, lowerCaseSelectedAddress))

      return accumulator
    }, [])

    this.etherscanTxStore.putState(finalTxs)
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
      }
      return ''
    }
    /** Returns an array of transactions whos status is unapproved */
    this.getUnapprovedTxCount = () => Object.keys(this.txStateManager.getUnapprovedTxList()).length
    /**
      @returns a number that represents how many transactions have the status submitted
      @param account {String} - hex prefixed account
    */
    this.getPendingTxCount = (account) => this.txStateManager.getPendingTransactions(account).length
    /** see txStateManager */
    this.getFilteredTxList = (options) => this.txStateManager.getFilteredTxList(options)
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
        loadingDefaults: true,
      })
      .forEach((tx) => {
        this.addTxGasDefaults(tx)
          .then((txMeta) => {
            txMeta.loadingDefaults = false
            this.txStateManager.updateTx(txMeta, 'transactions: gas estimation for tx on boot')
          })
          .catch((error) => {
            tx.loadingDefaults = false
            this.txStateManager.updateTx(tx, 'failed to estimate gas during boot cleanup.')
            this.txStateManager.setTxStatusFailed(tx.id, error)
          })
      })

    this.txStateManager
      .getFilteredTxList({
        status: TRANSACTION_STATUS_APPROVED,
      })
      .forEach((txMeta) => {
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
    this.pendingTxTracker.on('tx:warning', (txMeta) => {
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
    this.pendingTxTracker.on('tx:retry', (txMeta) => {
      if (!('retryCount' in txMeta)) txMeta.retryCount = 0
      txMeta.retryCount += 1
      this.txStateManager.updateTx(txMeta, 'transactions/pending-tx-tracker#event: tx:retry')
    })
  }

  /**
    Returns a "type" for a transaction out of the following list: simpleSend, tokenTransfer, tokenApprove,
    contractDeployment, contractMethodCall
  */
  async _determineTransactionCategory(txParameters) {
    const { data, to, isEtherscan } = txParameters
    let checkSummedTo = to
    if (isAddress(to)) checkSummedTo = toChecksumAddress(to)
    const decodedERC1155 = data && erc1155AbiDecoder.decodeMethod(data)
    const decodedERC721 = data && collectibleABIDecoder.decodeMethod(data)
    const decodedERC20 = data && tokenABIDecoder.decodeMethod(data)

    let result
    let code
    let tokenMethodName = ''
    let methodParameters = {}
    let contractParameters = {}
    const tokenObject = Object.prototype.hasOwnProperty.call(erc20Contracts, checkSummedTo) ? erc20Contracts[toChecksumAddress(to)] : {}
    // If we know the contract address, mark it as erc20
    if (tokenObject && tokenObject.erc20 && decodedERC20) {
      const { name = '', params } = decodedERC20
      tokenMethodName = [TOKEN_METHOD_APPROVE, TOKEN_METHOD_TRANSFER, TOKEN_METHOD_TRANSFER_FROM].find(
        (methodName) => methodName.toLowerCase() === name.toLowerCase()
      )
      methodParameters = params
      contractParameters = tokenObject
    } else if (checkSummedTo && Object.prototype.hasOwnProperty.call(OLD_ERC721_LIST, checkSummedTo.toLowerCase())) {
      // For Cryptokitties
      tokenMethodName = TOKEN_METHOD_TRANSFER
      contractParameters = Object.prototype.hasOwnProperty.call(erc721Contracts, checkSummedTo.toLowerCase())
        ? erc721Contracts[checkSummedTo.toLowerCase()]
        : {}
      delete contractParameters.erc20
      contractParameters.erc721 = true
      contractParameters.isSpecial = true
      if (!isEtherscan) {
        const ck20 = data && tokenABIDecoder.decodeMethod(data)
        methodParameters = ck20.params
      }
    } else if (checkSummedTo && decodedERC20) {
      // fallback to erc20
      const { name = '', params } = decodedERC20
      tokenMethodName = [TOKEN_METHOD_APPROVE, TOKEN_METHOD_TRANSFER, TOKEN_METHOD_TRANSFER_FROM].find(
        (methodName) => methodName.toLowerCase() === name.toLowerCase()
      )
      methodParameters = params
      contractParameters.erc20 = true
      contractParameters.symbol = 'ERC20'
    } else if (checkSummedTo && decodedERC721) {
      // Next give preference to erc721
      const { name = '', params } = decodedERC721
      // transferFrom & approve of ERC721 can't be distinguished from ERC20
      tokenMethodName = [COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM].find((methodName) => methodName.toLowerCase() === name.toLowerCase())
      methodParameters = params
      contractParameters = Object.prototype.hasOwnProperty.call(erc721Contracts, checkSummedTo.toLowerCase())
        ? erc721Contracts[checkSummedTo.toLowerCase()]
        : {}

      contractParameters.erc721 = true
      contractParameters.decimals = 0
      contractParameters.isSpecial = false
    } else if (checkSummedTo && decodedERC1155) {
      // Next give preference to erc1155
      const { name = '', params } = decodedERC1155
      tokenMethodName = [COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM].find((methodName) => methodName.toLowerCase() === name.toLowerCase())
      methodParameters = params
      contractParameters.erc1155 = true
      contractParameters.decimals = 0
      contractParameters.isSpecial = false
    } else if (isEtherscan) {
      if (checkSummedTo && Object.prototype.hasOwnProperty.call(erc721Contracts, checkSummedTo.toLowerCase())) {
        tokenMethodName = COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM
        contractParameters = Object.prototype.hasOwnProperty.call(erc721Contracts, checkSummedTo.toLowerCase())
          ? erc721Contracts[checkSummedTo.toLowerCase()]
          : {}
        delete contractParameters.erc20
        contractParameters.erc721 = true
      } else if (checkSummedTo && Object.prototype.hasOwnProperty.call(erc20Contracts, checkSummedTo)) {
        tokenMethodName = TOKEN_METHOD_TRANSFER_FROM
        contractParameters = Object.prototype.hasOwnProperty.call(erc20Contracts, checkSummedTo) ? erc20Contracts[checkSummedTo] : {}
        contractParameters.erc20 = true
      }
    }

    // log.info(data, decodedERC20, decodedERC721, tokenMethodName, contractParams, methodParams)

    if (!result) {
      if (txParameters.data && tokenMethodName) {
        result = tokenMethodName
      } else if (txParameters.data && !to) {
        result = DEPLOY_CONTRACT_ACTION_KEY
      }
      if (!result) {
        try {
          code = await this.query.getCode(to)
        } catch (error) {
          code = null
          log.warn(error)
        }
        const codeIsEmpty = !code || code === '0x' || code === '0x0'

        result = codeIsEmpty ? SEND_ETHER_ACTION_KEY : CONTRACT_INTERACTION_KEY
      }
    }
    return { transactionCategory: result, getCodeResponse: code, methodParams: methodParameters, contractParams: contractParameters }
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
    if (sameNonceTxs.length === 0) return
    // mark all same nonce transactions as dropped and give i a replacedBy hash
    sameNonceTxs.forEach((otherTxMeta) => {
      if (otherTxMeta.id === txId) return
      otherTxMeta.replacedBy = txMeta.hash
      this.txStateManager.updateTx(txMeta, 'transactions/pending-tx-tracker#event: tx:confirmed reference to confirmed txHash with same nonce')
      this.txStateManager.setTxStatusDropped(otherTxMeta.id)
    })
  }

  _setupBlockTrackerListener() {
    let listenersAreActive = false
    const latestBlockHandler = this._onLatestBlock.bind(this)
    const { blockTracker } = this
    const { txStateManager } = this

    txStateManager.on('tx:status-update', updateSubscription)
    updateSubscription()

    function updateSubscription() {
      const pendingTxs = txStateManager.getPendingTransactions()
      if (!listenersAreActive && pendingTxs.length > 0) {
        blockTracker.on('latest', latestBlockHandler)
        listenersAreActive = true
      } else if (listenersAreActive && pendingTxs.length === 0) {
        blockTracker.removeListener('latest', latestBlockHandler)
        listenersAreActive = false
      }
    }
  }

  async _onLatestBlock(blockNumber) {
    try {
      await this.pendingTxTracker.updatePendingTxs()
    } catch (error) {
      log.error(error)
    }
    try {
      await this.pendingTxTracker.resubmitPendingTxs(blockNumber)
    } catch (error) {
      log.error(error)
    }
  }

  /**
    Updates the memStore in transaction controller
  */
  _updateMemstore() {
    this.pendingTxTracker.updatePendingTxs()
    const unapprovedTxs = this.txStateManager.getUnapprovedTxList()
    const currentNetworkTxList = this.txStateManager.getFilteredTxList({
      metamaskNetworkId: this.getNetwork(),
    })
    this.memStore.updateState({ unapprovedTxs, currentNetworkTxList })
  }
}

export default TransactionController
