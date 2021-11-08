/* eslint-disable require-atomic-updates */
import Common from '@ethereumjs/common'
import { TransactionFactory } from '@ethereumjs/tx'
import { ObservableStore } from '@metamask/obs-store'
import { SafeEventEmitter } from '@toruslabs/openlogin-jrpc'
import { ethErrors } from 'eth-rpc-errors'
import { addHexPrefix, bufferToHex, stripHexPrefix } from 'ethereumjs-util'
import EthQuery from 'ethjs-query'
import collectibleAbi from 'human-standard-collectible-abi'
import tokenAbi from 'human-standard-token-abi'
import log from 'loglevel'
import { ERC1155 as erc1155Abi } from 'multi-token-standard-abi'
import { fromWei, isAddress, sha3, toBN, toChecksumAddress } from 'web3-utils'

import AbiDecoder from '../../utils/abiDecoder'
import ApiHelpers from '../../utils/apiHelpers'
import erc20Contracts from '../../utils/contractMetadata'
import { decGWEIToHexWEI } from '../../utils/conversionUtils'
import {
  CHAIN_ID_TO_GAS_LIMIT_BUFFER_MAP,
  CONTRACT_TYPE_ERC20,
  CONTRACT_TYPE_ERC721,
  CONTRACT_TYPE_ERC1155,
  CONTRACT_TYPE_ETH,
  GAS_ESTIMATE_TYPES,
  HARDFORKS,
  INFURA_PROVIDER_TYPES,
  OLD_ERC721_LIST,
  RPC,
  SUPPORTED_NETWORK_TYPES,
  TRANSACTION_ENVELOPE_TYPES,
  TRANSACTION_STATUSES,
  TRANSACTION_TYPES,
} from '../../utils/enums'
import { bnLessThan, BnMultiplyByFraction, bnToHex, formatPastTx, GAS_LIMITS, getChainType, getEtherScanHashLink, hexToBn } from '../../utils/utils'
import NonceTracker from '../NonceTracker'
import cleanErrorStack from '../utils/cleanErrorStack'
import PendingTransactionTracker from './PendingTransactionTracker'
import TransactionStateManager from './TransactionStateManager'
import TxGasUtil from './TxGasUtil'
import * as txUtils from './txUtils'

const tokenABIDecoder = new AbiDecoder(tokenAbi)
const collectibleABIDecoder = new AbiDecoder(collectibleAbi)
const erc1155AbiDecoder = new AbiDecoder(erc1155Abi.abi)

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

class TransactionController extends SafeEventEmitter {
  constructor(options) {
    super()
    this.networkStore = options.networkStore || new ObservableStore({})
    this._getCurrentChainId = options.getCurrentChainId
    this.getProviderConfig = options.getProviderConfig
    this._getCurrentNetworkEIP1559Compatibility = options.getCurrentNetworkEIP1559Compatibility
    this._getCurrentAccountEIP1559Compatibility = options.getCurrentAccountEIP1559Compatibility

    this.preferencesStore = options.preferencesStore || new ObservableStore({})
    this.provider = options.provider
    this.blockTracker = options.blockTracker
    this.signEthTx = options.signTransaction

    this.inProcessOfSigning = new Set()
    this._getEIP1559GasFeeEstimates = options.getEIP1559GasFeeEstimates

    this.memStore = new ObservableStore({})
    this.query = new EthQuery(this.provider)

    this.txGasUtil = new TxGasUtil(this.provider)
    this.opts = options
    this._mapMethods()
    this.api = new ApiHelpers(options.storeDispatch)
    this.txStateManager = new TransactionStateManager({
      initState: options.initState,
      txHistoryLimit: options.txHistoryLimit,
      getNetwork: this.getNetwork.bind(this),
      getCurrentChainId: options.getCurrentChainId,
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
    // this.preferencesStore.subscribe(() => this._updateMemstore())

    // request state update to finalize initialization
    this._updatePendingTxsAfterFirstBlock()
  }

  /** @returns {number} the chainId */
  getChainId() {
    const networkState = this.networkStore.getState()
    const chainId = this._getCurrentChainId()
    const integerChainId = typeof chainId === 'string' ? Number.parseInt(chainId, 16) : chainId
    if (networkState === 'loading' || Number.isNaN(integerChainId)) {
      return 0
    }
    return integerChainId
  }

  async getEIP1559Compatibility(fromAddress) {
    const currentNetworkIsCompatible = await this._getCurrentNetworkEIP1559Compatibility()
    const fromAccountIsCompatible = await this._getCurrentAccountEIP1559Compatibility(fromAddress)
    return currentNetworkIsCompatible && fromAccountIsCompatible
  }

  /**
   * @ethereumjs/tx uses @ethereumjs/common as a configuration tool for
   * specifying which chain, network, hardfork and EIPs to support for
   * a transaction. By referencing this configuration, and analyzing the fields
   * specified in txParams, @ethereumjs/tx is able to determine which EIP-2718
   * transaction type to use.
   * @returns {Common} common configuration object
   */
  async getCommonConfiguration(fromAddress) {
    const { type, nickname: name } = this.getProviderConfig()
    const supportsEIP1559 = await this.getEIP1559Compatibility(fromAddress)

    // This logic below will have to be updated each time a hardfork happens
    // that carries with it a new Transaction type. It is inconsequential for
    // hardforks that do not include new types.
    const hardfork = supportsEIP1559 ? HARDFORKS.LONDON : HARDFORKS.BERLIN

    // type will be one of our default network names or 'rpc'. the default
    // network names are sufficient configuration, simply pass the name as the
    // chain argument in the constructor.
    if (type !== RPC && INFURA_PROVIDER_TYPES.has(type)) {
      return new Common({
        chain: type,
        hardfork,
      })
    }

    // For 'rpc' we need to use the same basic configuration as mainnet,
    // since we only support EVM compatible chains, and then override the
    // name, chainId and networkId properties. This is done using the
    // `forCustomChain` static method on the Common class.
    const chainId = this._getCurrentChainId()
    const networkId = this.networkStore.getState()

    return Common.custom({ chainId, name, defaultHardfork: hardfork, networkId: networkId === 'loading' ? 0 : Number.parseInt(networkId, 10) })
  }

  /**
  Adds a tx to the txlist
  @emits ${txMeta.id}:unapproved
*/
  addTransaction(txMeta) {
    this.txStateManager.addTransaction(txMeta)
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
  @param txParameters {object} - txParams for the transaction
  @param opts {object} - with the key origin to put the origin on the txMeta
  */

  async newUnapprovedTransaction(txParameters, options = {}) {
    log.debug(`MetaMaskController newUnapprovedTransaction ${JSON.stringify(txParameters)}`)

    const initialTxMeta = await this.addUnapprovedTransaction(txParameters, options)

    // listen for tx completion (success, fail)
    return new Promise((resolve, reject) => {
      this.txStateManager.once(`${initialTxMeta.id}:finished`, (finishedTxMeta) => {
        switch (finishedTxMeta.status) {
          case TRANSACTION_STATUSES.SUBMITTED:
            return resolve(finishedTxMeta.hash)
          case TRANSACTION_STATUSES.REJECTED:
            return reject(cleanErrorStack(ethErrors.provider.userRejectedRequest('Torus Tx Signature: User denied transaction signature.')))
          case TRANSACTION_STATUSES.FAILED:
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
    const normalizedTxParameters = txUtils.normalizeTxParameters(txParameters)
    const eip1559Compatibility = await this.getEIP1559Compatibility()
    txUtils.validateTxParameters(normalizedTxParameters, eip1559Compatibility)

    /**
    `generateTxMeta` adds the default txMeta properties to the passed object.
    These include the tx's `id`. As we use the id for determining order of
    txes in the tx-state-manager, it is necessary to call the asynchronous
    method `this._determineTransactionCategory` after `generateTxMeta`.
    */
    let txMeta = this.txStateManager.generateTxMeta({
      txParams: normalizedTxParameters,
      origin: request.origin,
    })

    if (request.origin === 'torus') {
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
      const permittedAddresses = new Set([this.getSelectedAddress().toLowerCase()])
      if (!permittedAddresses.has(normalizedTxParameters.from)) {
        throw ethErrors.provider.unauthorized({ data: { origin: request.origin }, message: 'Unauthorized origin' })
      }
    }

    txMeta.origin = request.origin

    const { transactionCategory, getCodeResponse, methodParams, contractParams } = await this._determineTransactionCategory(txParameters)
    txMeta.transactionCategory = transactionCategory
    txMeta.methodParams = methodParams
    txMeta.contractParams = contractParams

    // ensure value
    txMeta.txParams.value = txMeta.txParams.value ? addHexPrefix(txMeta.txParams.value) : '0x0'

    this.addTransaction(txMeta)

    try {
      // add default tx params
      txMeta = await this.addTxGasDefaults(txMeta, getCodeResponse)
    } catch (error) {
      log.warn(error)
      txMeta = this.txStateManager.getTransaction(txMeta.id)
      txMeta.loadingDefaults = false
      this.txStateManager.updateTransaction(txMeta, 'Failed to calculate gas defaults.')
      throw error
    }
    txMeta.txParams.type =
      eip1559Compatibility && txUtils.isEIP1559Transaction(txMeta) ? TRANSACTION_ENVELOPE_TYPES.FEE_MARKET : TRANSACTION_ENVELOPE_TYPES.LEGACY

    this.emit('newUnapprovedTx', txMeta, request)

    txMeta.loadingDefaults = false

    // save txMeta
    this.txStateManager.updateTransaction(txMeta, 'Added new unapproved transaction.')

    return txMeta
  }

  /**
    Creates a new txMeta with the same txParams as the original
    to allow the user to resign the transaction with a higher gas values
    @param  originalTxId {number} - the id of the txMeta that
    you want to attempt to retry
    * @param {CustomGasSettings} [customGasSettings] - optional customGasSettings overrides to use for gas
    *  params instead of allowing this method to generate them
    @return {txMeta}
  */

  async retryTransaction(originalTxId, customGasSettings = {}) {
    const originalTxMeta = this.txStateManager.getTransaction(originalTxId)
    const { txParams } = originalTxMeta

    const { previousGasParams, newGasParams } = this.generateNewGasParams(originalTxMeta, {
      ...customGasSettings,
      gasLimit: customGasSettings.gasLimit || GAS_LIMITS.SIMPLE,
    })

    const txMeta = this.txStateManager.generateTxMeta({
      txParams: {
        ...txParams,
        ...newGasParams,
      },
      previousGasParams,
      loadingDefaults: false,
      status: TRANSACTION_STATUSES.UNAPPROVED,
      type: TRANSACTION_TYPES.RETRY,
    })
    this.addTransaction(txMeta)
    this.emit('newUnapprovedTx', txMeta)
    return txMeta
  }

  /**
  adds the tx gas defaults: gas && gasPrice
  @param txMeta {Object} - the txMeta object
  @returns {Promise<object>} resolves with txMeta
*/
  async addTxGasDefaults(txMeta, getCodeResponse) {
    const eip1559Compatibility = await this.getEIP1559Compatibility()

    const {
      gasPrice: defaultGasPrice,
      maxFeePerGas: defaultMaxFeePerGas,
      maxPriorityFeePerGas: defaultMaxPriorityFeePerGas,
    } = await this._getDefaultGasFees(txMeta, eip1559Compatibility)
    const { gasLimit: defaultGasLimit, simulationFails } = await this._getDefaultGasLimit(txMeta, getCodeResponse)

    // eslint-disable-next-line no-param-reassign
    txMeta = this.txStateManager.getTransaction(txMeta.id)
    if (simulationFails) {
      txMeta.simulationFails = simulationFails
    }

    if (eip1559Compatibility) {
      // If the dapp has suggested a gas price, but no maxFeePerGas or maxPriorityFeePerGas
      //  then we set maxFeePerGas and maxPriorityFeePerGas to the suggested gasPrice.
      if (txMeta.txParams.gasPrice && !txMeta.txParams.maxFeePerGas && !txMeta.txParams.maxPriorityFeePerGas) {
        txMeta.txParams.maxFeePerGas = txMeta.txParams.gasPrice
        txMeta.txParams.maxPriorityFeePerGas = bnLessThan(
          typeof defaultMaxPriorityFeePerGas === 'string' ? stripHexPrefix(defaultMaxPriorityFeePerGas) : defaultMaxPriorityFeePerGas,
          typeof txMeta.txParams.gasPrice === 'string' ? stripHexPrefix(txMeta.txParams.gasPrice) : txMeta.txParams.gasPrice
        )
          ? defaultMaxPriorityFeePerGas
          : txMeta.txParams.gasPrice
      } else {
        if (defaultMaxFeePerGas && !txMeta.txParams.maxFeePerGas) {
          // If the dapp has not set the gasPrice or the maxFeePerGas, then we set maxFeePerGas
          // with the one returned by the gasFeeController, if that is available.
          txMeta.txParams.maxFeePerGas = defaultMaxFeePerGas
        }

        if (defaultMaxPriorityFeePerGas && !txMeta.txParams.maxPriorityFeePerGas) {
          // If the dapp has not set the gasPrice or the maxPriorityFeePerGas, then we set maxPriorityFeePerGas
          // with the one returned by the gasFeeController, if that is available.
          txMeta.txParams.maxPriorityFeePerGas = defaultMaxPriorityFeePerGas
        }

        if (defaultGasPrice && !txMeta.txParams.maxFeePerGas) {
          // If the dapp has not set the gasPrice or the maxFeePerGas, and no maxFeePerGas is available
          // from the gasFeeController, then we set maxFeePerGas to the defaultGasPrice, assuming it is
          // available.
          txMeta.txParams.maxFeePerGas = defaultGasPrice
        }

        if (txMeta.txParams.maxFeePerGas && !txMeta.txParams.maxPriorityFeePerGas) {
          // If the dapp has not set the gasPrice or the maxPriorityFeePerGas, and no maxPriorityFeePerGas is
          // available from the gasFeeController, then we set maxPriorityFeePerGas to
          // txMeta.txParams.maxFeePerGas, which will either be the gasPrice from the controller, the maxFeePerGas
          // set by the dapp, or the maxFeePerGas from the controller.
          txMeta.txParams.maxPriorityFeePerGas = txMeta.txParams.maxFeePerGas
        }
      }

      // We remove the gasPrice param entirely when on an eip1559 compatible network

      delete txMeta.txParams.gasPrice
    } else {
      // We ensure that maxFeePerGas and maxPriorityFeePerGas are not in the transaction params
      // when not on a EIP1559 compatible network

      delete txMeta.txParams.maxPriorityFeePerGas
      delete txMeta.txParams.maxFeePerGas
    }

    // If we have gotten to this point, and none of gasPrice, maxPriorityFeePerGas or maxFeePerGas are
    // set on txParams, it means that either we are on a non-EIP1559 network and the dapp didn't suggest
    // a gas price, or we are on an EIP1559 network, and none of gasPrice, maxPriorityFeePerGas or maxFeePerGas
    // were available from either the dapp or the network.
    if (defaultGasPrice && !txMeta.txParams.gasPrice && !txMeta.txParams.maxPriorityFeePerGas && !txMeta.txParams.maxFeePerGas) {
      txMeta.txParams.gasPrice = defaultGasPrice
    }

    if (defaultGasLimit && !txMeta.txParams.gas) {
      txMeta.txParams.gas = defaultGasLimit
    }
    return txMeta
  }

  /**
   * Gets default gas fees, or returns `undefined` if gas fees are already set
   * @param {Object} txMeta - The txMeta object
   * @returns {Promise<string|undefined>} The default gas price
   */
  async _getDefaultGasFees(txMeta, eip1559Compatibility) {
    if (
      (!eip1559Compatibility && txMeta.txParams.gasPrice) ||
      (eip1559Compatibility && txMeta.txParams.maxFeePerGas && txMeta.txParams.maxPriorityFeePerGas)
    ) {
      return {}
    }

    try {
      const { gasFeeEstimates, gasEstimateType } = await this._getEIP1559GasFeeEstimates()
      if (eip1559Compatibility && gasEstimateType === GAS_ESTIMATE_TYPES.FEE_MARKET) {
        const { medium: { suggestedMaxPriorityFeePerGas, suggestedMaxFeePerGas } = {} } = gasFeeEstimates

        if (suggestedMaxPriorityFeePerGas && suggestedMaxFeePerGas) {
          return {
            maxFeePerGas: decGWEIToHexWEI(suggestedMaxFeePerGas),
            maxPriorityFeePerGas: decGWEIToHexWEI(suggestedMaxPriorityFeePerGas),
          }
        }
      } else if (gasEstimateType === GAS_ESTIMATE_TYPES.LEGACY) {
        // The LEGACY type includes low, medium and high estimates of
        // gas price values.
        return {
          gasPrice: decGWEIToHexWEI(gasFeeEstimates.medium),
        }
      } else if (gasEstimateType === GAS_ESTIMATE_TYPES.ETH_GASPRICE) {
        // The ETH_GASPRICE type just includes a single gas price property,
        // which we can assume was retrieved from eth_gasPrice
        return {
          gasPrice: decGWEIToHexWEI(gasFeeEstimates.gasPrice),
        }
      }
    } catch (error) {
      log.error(error)
    }

    const gasPrice = await this.query.gasPrice()

    return { gasPrice: gasPrice && addHexPrefix(gasPrice.toString(16)) }
  }

  /**
   * Gets default gas limit, or debug information about why gas estimate failed.
   * @param {Object} txMeta - The txMeta object
   * @param {string} getCodeResponse - The transaction category code response, used for debugging purposes
   * @returns {Promise<Object>} Object containing the default gas limit, or the simulation failure object
   */
  async _getDefaultGasLimit(txMeta, getCodeResponse) {
    const chainId = this._getCurrentChainId()
    const customNetworkGasBuffer = CHAIN_ID_TO_GAS_LIMIT_BUFFER_MAP[chainId]
    const chainType = getChainType(chainId)

    if (txMeta.txParams.gas) {
      return {}
    }
    if (txMeta.txParams.to && txMeta.transactionCategory === TRANSACTION_TYPES.SENT_ETHER && chainType !== 'custom') {
      // if there's data in the params, but there's no contract code, it's not a valid transaction
      if (txMeta.txParams.data) {
        const err = new Error('TxGasUtil - Trying to call a function on a non-contract address')
        // set error key so ui can display localized error message
        err.errorKey = 'transactionErrorNoContract'

        // set the response on the error so that we can see in logs what the actual response was
        err.getCodeResponse = getCodeResponse
        throw err
      }

      // This is a standard ether simple send, gas requirement is exactly 21k
      return { gasLimit: GAS_LIMITS.SIMPLE }
    }

    const { blockGasLimit, estimatedGasHex, simulationFails } = await this.txGasUtil.analyzeGasUsage(txMeta)

    // add additional gas buffer to our estimation for safety
    const gasLimit = this.txGasUtil.addGasBuffer(addHexPrefix(estimatedGasHex), blockGasLimit, customNetworkGasBuffer)
    return { gasLimit, simulationFails }
  }

  /**
   * Given a TransactionMeta object, generate new gas params such that if the
   * transaction was an EIP1559 transaction, it only has EIP1559 gas fields,
   * otherwise it only has gasPrice. Will use whatever custom values are
   * specified in customGasSettings, or falls back to incrementing by a percent
   * which is defined by specifying a numerator. 11 is a 10% bump, 12 would be
   * a 20% bump, and so on.
   * @param {import(
   *  '../../../../shared/constants/transaction'
   * ).TransactionMeta} originalTxMeta - Original transaction to use as base
   * @param {CustomGasSettings} [customGasSettings] - overrides for the gas
   *  fields to use instead of the multiplier
   * @param {number} [incrementNumerator] - Numerator from which to generate a
   *  percentage bump of gas price. E.g 11 would be a 10% bump over base.
   * @returns {{ newGasParams: CustomGasSettings, previousGasParams: CustomGasSettings }}
   */
  generateNewGasParams(originalTxMeta, customGasSettings = {}, incrementNumerator = 11) {
    const { txParams } = originalTxMeta
    const previousGasParams = {}
    const newGasParams = {}
    if (customGasSettings.gasLimit) {
      newGasParams.gas = customGasSettings?.gas ?? GAS_LIMITS.SIMPLE
    }

    if (txUtils.isEIP1559Transaction(originalTxMeta)) {
      previousGasParams.maxFeePerGas = txParams.maxFeePerGas
      previousGasParams.maxPriorityFeePerGas = txParams.maxPriorityFeePerGas
      newGasParams.maxFeePerGas =
        customGasSettings?.maxFeePerGas || bnToHex(BnMultiplyByFraction(hexToBn(txParams.maxFeePerGas), incrementNumerator, 10))
      newGasParams.maxPriorityFeePerGas =
        customGasSettings?.maxPriorityFeePerGas || bnToHex(BnMultiplyByFraction(hexToBn(txParams.maxPriorityFeePerGas), incrementNumerator, 10))
    } else {
      previousGasParams.gasPrice = txParams.gasPrice
      newGasParams.gasPrice = customGasSettings?.gasPrice || bnToHex(BnMultiplyByFraction(hexToBn(txParams.gasPrice), incrementNumerator, 10))
    }

    return { previousGasParams, newGasParams }
  }

  /**
   * Creates a new approved transaction to attempt to cancel a previously submitted transaction. The
   * new transaction contains the same nonce as the previous, is a basic ETH transfer of 0x value to
   * the sender's address, and has a higher gasPrice than that of the previous transaction.
   * @param {number} originalTxId - the id of the txMeta that you want to attempt to cancel
   * @param {CustomGasSettings} [customGasSettings] - overrides to use for gas
   *  params instead of allowing this method to generate them
   * @returns {txMeta}
   */
  async createCancelTransaction(originalTxId, customGasSettings) {
    const originalTxMeta = this.txStateManager.getTransaction(originalTxId)
    const { txParams } = originalTxMeta
    const { from, nonce } = txParams

    const { previousGasParams, newGasParams } = this.generateNewGasParams(originalTxMeta, {
      ...customGasSettings,
      // We want to override the previous transactions gasLimit because it
      // will now be a simple send instead of whatever it was before such
      // as a token transfer or contract call.
      gasLimit: customGasSettings.gasLimit || GAS_LIMITS.SIMPLE,
    })

    const newTxMeta = this.txStateManager.generateTxMeta({
      txParams: {
        from,
        to: from,
        nonce,
        value: '0x0',
        ...newGasParams,
      },
      previousGasParams,
      loadingDefaults: false,
      status: TRANSACTION_STATUSES.APPROVED,
      type: TRANSACTION_TYPES.CANCEL,
    })

    this.addTransaction(newTxMeta)
    await this.approveTransaction(newTxMeta.id)
    return newTxMeta
  }

  /**
   * Creates a new approved transaction to attempt to speed up a previously submitted transaction. The
   * new transaction contains the same nonce as the previous. By default, the new transaction will use
   * the same gas limit and a 10% higher gas price, though it is possible to set a custom value for
   * each instead.
   * @param {number} originalTxId - the id of the txMeta that you want to speed up
   * @param {CustomGasSettings} [customGasSettings] - overrides to use for gas
   *  params instead of allowing this method to generate them
   * @returns {txMeta}
   */
  async createSpeedUpTransaction(originalTxId, customGasSettings) {
    const originalTxMeta = this.txStateManager.getTransaction(originalTxId)
    const { txParams } = originalTxMeta

    const { previousGasParams, newGasParams } = this.generateNewGasParams(originalTxMeta, customGasSettings)

    const newTxMeta = this.txStateManager.generateTxMeta({
      txParams: {
        ...txParams,
        ...newGasParams,
      },
      previousGasParams,
      loadingDefaults: false,
      status: TRANSACTION_STATUSES.APPROVED,
      type: TRANSACTION_TYPES.RETRY,
    })

    this.addTransaction(newTxMeta)
    await this.approveTransaction(newTxMeta.id)
    return newTxMeta
  }

  /**
  updates the txMeta in the txStateManager
  @param txMeta {Object} - the updated txMeta
  */
  async updateTransaction(txMeta) {
    this.txStateManager.updateTransaction(txMeta, 'confTx: user updated transaction')
  }

  /**
  updates and approves the transaction
  @param txMeta {Object}
  */
  async updateAndApproveTransaction(txMeta) {
    this.txStateManager.updateTransaction(txMeta, 'confTx: user approved transaction')
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
      const txMeta = this.txStateManager.getTransaction(txId)
      const fromAddress = txMeta.txParams.from
      // wait for a nonce
      // TODO: Check this
      let { customNonceValue } = txMeta.txParams
      customNonceValue = Number(customNonceValue)
      nonceLock = await this.nonceTracker.getNonceLock(fromAddress)
      // add nonce to txParams
      // if txMeta has lastGasPrice then it is a retry at same nonce with higher
      // gas price transaction and their for the nonce should not be calculated
      const nonce = txMeta.previousGasParams ? txMeta.txParams.nonce : nonceLock.nextNonce
      const customOrNonce = customNonceValue === 0 ? customNonceValue : customNonceValue || nonce
      txMeta.txParams.nonce = addHexPrefix(customOrNonce.toString(16))
      // add nonce debugging information to txMeta
      txMeta.nonceDetails = nonceLock.nonceDetails
      if (customNonceValue) {
        txMeta.nonceDetails.customNonceValue = customNonceValue
      }
      this.txStateManager.updateTransaction(txMeta, 'transactions#approveTransaction')
      // sign transaction
      const rawTx = await this.signTransaction(txId)
      await this.publishTransaction(txId, rawTx)
      // must set transaction to submitted/failed before releasing lock
      nonceLock.releaseLock()
    } catch (error) {
      // this is try-catch wrapped so that we can guarantee that the nonceLock is released
      try {
        this._failTransaction(txId, error)
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
    const txMeta = this.txStateManager.getTransaction(txId)
    // add network/chain id
    const chainId = this.getChainId()
    const type = txUtils.isEIP1559Transaction(txMeta) ? TRANSACTION_ENVELOPE_TYPES.FEE_MARKET : TRANSACTION_ENVELOPE_TYPES.LEGACY
    const txParameters = { ...txMeta.txParams, type, chainId, gasLimit: txMeta.txParams.gas }
    // sign tx
    const fromAddress = txParameters.from
    const common = await this.getCommonConfiguration(txParameters.from)
    const unsignedEthTx = TransactionFactory.fromTxData(txParameters, { common })
    const signedEthTx = await this.signEthTx(unsignedEthTx, fromAddress)

    // add r,s,v values for provider request purposes see createMetamaskMiddleware
    // and JSON rpc standard for further explanation
    txMeta.r = bufferToHex(signedEthTx.r)
    txMeta.s = bufferToHex(signedEthTx.s)
    txMeta.v = bufferToHex(signedEthTx.v)

    this.txStateManager.updateTransaction(txMeta, 'transactions#signTransaction: add r, s, v values')

    // set state to signed
    this.txStateManager.setTxStatusSigned(txMeta.id)
    const rawTx = bufferToHex(signedEthTx.serialize())
    return rawTx
  }

  /**
    publishes the raw tx and sets the txMeta to submitted
    @param txId {number} - the tx's Id
    @param rawTx {string} - the hex string of the serialized signed transaction
    @returns {Promise<void>}
  */
  async publishTransaction(txId, rawTx) {
    const txMeta = this.txStateManager.getTransaction(txId)
    txMeta.rawTx = rawTx
    this.txStateManager.updateTransaction(txMeta, 'transactions#publishTransaction')
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
  async confirmTransaction(txId, txReceipt, baseFeePerGas) {
    // get the txReceipt before marking the transaction confirmed
    // to ensure the receipt is gotten before the ui revives the tx
    const txMeta = this.txStateManager.getTransaction(txId)

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

      if (baseFeePerGas) {
        txMeta.baseFeePerGas = baseFeePerGas
      }

      this.txStateManager.setTxStatusConfirmed(txId)
      this._markNonceDuplicatesDropped(txId)

      this.txStateManager.updateTransaction(txMeta, 'transactions#confirmTransaction - add txReceipt')
    } catch (error) {
      log.error(error)
    }
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
    const txMeta = this.txStateManager.getTransaction(txId)
    txMeta.hash = txHash
    this.txStateManager.updateTransaction(txMeta, 'transactions#setTxHash')
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
    /** @returns {Object} the state in transaction controller */
    this.getState = () => this.memStore.getState()

    /** @returns {string|number} the network number stored in networkStore */
    this.getNetwork = () => this.networkStore.getState()

    /** @returns {string} the user selected address */
    this.getSelectedAddress = () => this.preferencesStore.getState().selectedAddress || ''

    /** @returns {Array} transactions whos status is unapproved */
    this.getUnapprovedTxCount = () => Object.keys(this.txStateManager.getUnapprovedTxList()).length

    /**
      @returns {number} number of transactions that have the status submitted
      @param {string} account - hex prefixed account
    */
    this.getPendingTxCount = (account) => this.txStateManager.getPendingTransactions(account).length

    /** see txStateManager */
    this.getTransactions = (opts) => this.txStateManager.getTransactions(opts)
  }

  getHeaders() {
    const prefsState = this.preferencesStore.getState()
    return {
      Authorization: `Bearer ${prefsState[prefsState.selectedAddress]?.jwtToken || ''}`,
      'Content-Type': 'application/json; charset=utf-8',
    }
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
      .getTransactions({
        searchCriteria: {
          status: TRANSACTION_STATUSES.UNAPPROVED,
          loadingDefaults: true,
        },
      })
      .forEach((tx) => {
        this.addTxGasDefaults(tx)
          .then((txMeta) => {
            txMeta.loadingDefaults = false
            this.txStateManager.updateTransaction(txMeta, 'transactions: gas estimation for tx on boot')
          })
          .catch((error) => {
            const txMeta = this.txStateManager.getTransaction(tx.id)
            txMeta.loadingDefaults = false
            this.txStateManager.updateTransaction(txMeta, 'failed to estimate gas during boot cleanup.')
            this._failTransaction(txMeta.id, error)
          })
      })

    this.txStateManager
      .getTransactions({
        searchCriteria: {
          status: TRANSACTION_STATUSES.APPROVED,
        },
      })
      .forEach((txMeta) => {
        const txSignError = new Error('Transaction found as "approved" during boot - possibly stuck during signing')
        this._failTransaction(txMeta.id, txSignError)
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
      this.txStateManager.updateTransaction(txMeta, 'transactions/pending-tx-tracker#event: tx:warning')
    })
    this.pendingTxTracker.on('tx:failed', (txId, error) => {
      this._failTransaction(txId, error)
    })
    this.pendingTxTracker.on('tx:confirmed', (txId, transactionReceipt, baseFeePerGas) =>
      this.confirmTransaction(txId, transactionReceipt, baseFeePerGas)
    )
    this.pendingTxTracker.on('tx:dropped', (txId) => this._dropTransaction(txId))
    this.pendingTxTracker.on('tx:block-update', (txMeta, latestBlockNumber) => {
      if (!txMeta.firstRetryBlockNumber) {
        txMeta.firstRetryBlockNumber = latestBlockNumber
        this.txStateManager.updateTransaction(txMeta, 'transactions/pending-tx-tracker#event: tx:block-update')
      }
    })
    this.pendingTxTracker.on('tx:retry', (txMeta) => {
      if (!('retryCount' in txMeta)) txMeta.retryCount = 0
      txMeta.retryCount += 1
      this.txStateManager.updateTransaction(txMeta, 'transactions/pending-tx-tracker#event: tx:retry')
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
    const chainId = this._getCurrentChainId()
    let result
    let code
    let tokenMethodName = ''
    let methodParameters = {}
    let contractParameters = {}
    const tokenObject = Object.prototype.hasOwnProperty.call(erc20Contracts, checkSummedTo) ? erc20Contracts[toChecksumAddress(to)] : {}
    // If we know the contract address, mark it as erc20
    if (tokenObject && tokenObject.erc20 && decodedERC20) {
      const { name = '', params } = decodedERC20
      tokenMethodName = [
        TRANSACTION_TYPES.TOKEN_METHOD_APPROVE,
        TRANSACTION_TYPES.TOKEN_METHOD_TRANSFER,
        TRANSACTION_TYPES.TOKEN_METHOD_TRANSFER_FROM,
      ].find((methodName) => methodName.toLowerCase() === name.toLowerCase())
      methodParameters = params
      contractParameters = tokenObject
    } else if (checkSummedTo && Object.prototype.hasOwnProperty.call(OLD_ERC721_LIST, checkSummedTo.toLowerCase())) {
      // For Cryptokitties
      tokenMethodName = TRANSACTION_TYPES.TOKEN_METHOD_TRANSFER
      contractParameters = Object.prototype.hasOwnProperty.call(OLD_ERC721_LIST, checkSummedTo.toLowerCase())
        ? OLD_ERC721_LIST[checkSummedTo.toLowerCase()]
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
      tokenMethodName = [
        TRANSACTION_TYPES.TOKEN_METHOD_APPROVE,
        TRANSACTION_TYPES.TOKEN_METHOD_TRANSFER,
        TRANSACTION_TYPES.TOKEN_METHOD_TRANSFER_FROM,
      ].find((methodName) => methodName.toLowerCase() === name.toLowerCase())
      methodParameters = params
      contractParameters.erc20 = true
      contractParameters.symbol = 'ERC20'
    } else if (checkSummedTo && decodedERC721) {
      // Next give preference to erc721
      const { name = '', params } = decodedERC721
      // transferFrom & approve of ERC721 can't be distinguished from ERC20
      tokenMethodName = [TRANSACTION_TYPES.COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM].find(
        (methodName) => methodName.toLowerCase() === name.toLowerCase()
      )
      methodParameters = params
      try {
        let assetRes = {}
        const idParam = params.find((param) => param.name === '_tokenId' || param.name === 'tokenId' || param.name === 'id')
        if (idParam) {
          assetRes = await this.api.getAssetData(
            { contract: checkSummedTo.toLowerCase(), chainId, tokenId: idParam.value },
            this.getHeaders(),
            10_000
          )
        } else {
          assetRes = await this.api.getAssetContractData({ contract: checkSummedTo.toLowerCase(), chainId }, this.getHeaders(), 10_000)
        }
        contractParameters = { ...contractParameters, ...assetRes }
      } catch (error) {
        log.warn('failed to fetch asset data', error)
      }

      contractParameters.erc721 = true
      contractParameters.decimals = 0
      contractParameters.isSpecial = false
    } else if (checkSummedTo && decodedERC1155) {
      // Next give preference to erc1155
      const { name = '', params } = decodedERC1155
      tokenMethodName = [TRANSACTION_TYPES.COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM].find(
        (methodName) => methodName.toLowerCase() === name.toLowerCase()
      )
      try {
        let assetRes = {}
        const idParam = params.find((param) => param.name === '_tokenId' || param.name === 'tokenId' || param.name === 'id')

        if (idParam) {
          assetRes = await this.api.getAssetData(
            { contract: checkSummedTo.toLowerCase(), chainId, tokenId: idParam.value },
            this.getHeaders(),
            10_000
          )
        } else {
          assetRes = await this.api.getAssetContractData({ contract: checkSummedTo.toLowerCase(), chainId }, this.getHeaders(), 10_000)
        }
        contractParameters = { ...contractParameters, ...assetRes }
      } catch (error) {
        log.warn('failed to fetch asset data', error)
      }
      methodParameters = params
      contractParameters.erc1155 = true
      contractParameters.decimals = 0
      contractParameters.isSpecial = false
    } else if (isEtherscan && checkSummedTo && Object.prototype.hasOwnProperty.call(erc20Contracts, checkSummedTo)) {
      tokenMethodName = TRANSACTION_TYPES.TOKEN_METHOD_TRANSFER_FROM
      contractParameters = Object.prototype.hasOwnProperty.call(erc20Contracts, checkSummedTo) ? erc20Contracts[checkSummedTo] : {}
      contractParameters.erc20 = true
    }

    // log.debug(data, decodedERC20, decodedERC721, tokenMethodName, contractParameters, methodParameters, 'tx category')

    if (!result) {
      if (txParameters.data && tokenMethodName) {
        result = tokenMethodName
      } else if (txParameters.data && !to) {
        result = TRANSACTION_TYPES.DEPLOY_CONTRACT
      }
      if (!result) {
        try {
          code = await this.query.getCode(to)
        } catch (error) {
          code = null
          log.warn(error)
        }
        const codeIsEmpty = !code || code === '0x' || code === '0x0'

        result = codeIsEmpty ? TRANSACTION_TYPES.SENT_ETHER : TRANSACTION_TYPES.CONTRACT_INTERACTION
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
    const txMeta = this.txStateManager.getTransaction(txId)
    const { nonce, from } = txMeta.txParams
    const sameNonceTxs = this.txStateManager.getTransactions({
      searchCriteria: { nonce, from },
    })
    if (sameNonceTxs.length === 0) return
    // mark all same nonce transactions as dropped and give i a replacedBy hash
    sameNonceTxs.forEach((otherTxMeta) => {
      if (otherTxMeta.id === txId) return
      otherTxMeta.replacedBy = txMeta.hash
      this.txStateManager.updateTransaction(
        txMeta,
        'transactions/pending-tx-tracker#event: tx:confirmed reference to confirmed txHash with same nonce'
      )
      this._dropTransaction(otherTxMeta.id)
    })
  }

  _setupBlockTrackerListener() {
    let listenersAreActive = false
    const latestBlockHandler = this._onLatestBlock.bind(this)
    const { blockTracker, txStateManager } = this

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
    const unapprovedTxs = this.txStateManager.getUnapprovedTxList()
    const currentNetworkTxList = this.txStateManager.getTransactions({
      limit: 100,
    })
    this.memStore.updateState({ unapprovedTxs, currentNetworkTxList })
  }

  _failTransaction(txId, error) {
    this.txStateManager.setTxStatusFailed(txId, error)
  }

  _dropTransaction(txId) {
    this.txStateManager.setTxStatusDropped(txId)
  }
}

export default TransactionController
