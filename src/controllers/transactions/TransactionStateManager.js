import { ObservableStore } from '@metamask/obs-store'
import { SafeEventEmitter } from '@toruslabs/openlogin-jrpc'
import { keyBy, mapValues, omitBy, pickBy, sortBy } from 'lodash-es'
import log from 'loglevel'

import { TRANSACTION_STATUSES } from '../../utils/enums'
import createId from '../../utils/random-id'
import { generateHistoryEntry, replayHistory, snapshotFromTxMeta } from './tx-state-history-helper'
import { getFinalStates, normalizeAndValidateTxParams, transactionMatchesNetwork } from './txUtils'
/**
  TransactionStateManager is responsible for the state of a transaction and
  storing the transaction
  it also has some convenience methods for finding subsets of transactions
  *
  *STATUS METHODS
  <br>statuses:
  <br>   - `'unapproved'` the user has not responded
  <br>   - `'rejected'` the user has responded no!
  <br>   - `'approved'` the user has approved the tx
  <br>   - `'signed'` the tx is signed
  <br>   - `'submitted'` the tx is sent to a server
  <br>   - `'confirmed'` the tx has been included in a block.
  <br>   - `'failed'` the tx failed for some reason, included on tx data.
  <br>   - `'dropped'` the tx nonce was already used
  @param opts {object}
  @param {object} [opts.initState={ transactions: [] }] initial transactions list with the key transaction {array}
  @param {number} [opts.txHistoryLimit] limit for how many finished
  transactions can hang around in state
  @param {function} opts.getNetwork return network number
  @class
*/
class TransactionStateManager extends SafeEventEmitter {
  constructor({ initState, txHistoryLimit, getNetwork, getCurrentChainId }) {
    super()

    this.store = new ObservableStore({
      transactions: {},
      ...initState,
    })
    this.txHistoryLimit = txHistoryLimit
    this.getNetwork = getNetwork
    this.getCurrentChainId = getCurrentChainId
  }

  /**
    @param opts {object} - the object to use when overwriting defaults
    @returns {txMeta} the default txMeta object
  */
  generateTxMeta(opts = {}) {
    const netId = this.getNetwork()
    const chainId = this.getCurrentChainId()
    if (netId === 'loading') throw new Error('Torus is having trouble connecting to the network')
    let dappSuggestedGasFees = null

    // If we are dealing with a transaction suggested by a dapp and not
    // an internally created metamask transaction, we need to keep record of
    // the originally submitted gasParams.
    // TODO: Maybe check origin here?
    if (opts.txParams && typeof opts.origin === 'string' && opts.origin !== 'torus') {
      if (typeof opts.txParams.gasPrice !== 'undefined') {
        dappSuggestedGasFees = {
          gasPrice: opts.txParams.gasPrice,
        }
      } else if (typeof opts.txParams.maxFeePerGas !== 'undefined' || typeof opts.txParams.maxPriorityFeePerGas !== 'undefined') {
        dappSuggestedGasFees = {
          maxPriorityFeePerGas: opts.txParams.maxPriorityFeePerGas,
          maxFeePerGas: opts.txParams.maxFeePerGas,
        }
      }

      if (typeof opts.txParams.gas !== 'undefined') {
        dappSuggestedGasFees = {
          ...dappSuggestedGasFees,
          gas: opts.txParams.gas,
        }
      }
    }

    return {
      id: createId(),
      time: Date.now(),
      status: 'unapproved',
      metamaskNetworkId: netId,
      loadingDefaults: true,
      chainId,
      dappSuggestedGasFees,
      ...opts,
    }
  }

  /**
   * Get an object containing all unapproved transactions for the current
   * network. This is the only transaction fetching method that returns an
   * object, so it doesn't use getTransactions like everything else.
   *
   * @returns {Record<string, TransactionMeta>} Unapproved transactions keyed
   *  by id
   */
  getUnapprovedTxList() {
    const chainId = this.getCurrentChainId()
    const network = this.getNetwork()
    return pickBy(
      this.store.getState().transactions,
      (transaction) => transaction.status === TRANSACTION_STATUSES.UNAPPROVED && transactionMatchesNetwork(transaction, chainId, network)
    )
  }

  /**
   * Get all approved transactions for the current network. If an address is
   * provided, the list will be further refined to only those transactions
   * originating from the supplied address.
   *
   * @param {string} [address] - hex prefixed address to find transactions for.
   * @returns {TransactionMeta[]} the filtered list of transactions
   */
  getApprovedTransactions(address) {
    const searchCriteria = { status: TRANSACTION_STATUSES.APPROVED }
    if (address) {
      searchCriteria.from = address
    }
    return this.getTransactions({ searchCriteria })
  }

  /**
   * Get all pending transactions for the current network. If an address is
   * provided, the list will be further refined to only those transactions
   * originating from the supplied address.
   *
   * @param {string} [address] - hex prefixed address to find transactions for.
   * @returns {TransactionMeta[]} the filtered list of transactions
   */
  getPendingTransactions(address) {
    const searchCriteria = { status: TRANSACTION_STATUSES.SUBMITTED }
    if (address) {
      searchCriteria.from = address
    }
    return this.getTransactions({ searchCriteria })
  }

  /**
   * Get all confirmed transactions for the current network. If an address is
   * provided, the list will be further refined to only those transactions
   * originating from the supplied address.
   *
   * @param {string} [address] - hex prefixed address to find transactions for.
   * @returns {TransactionMeta[]} the filtered list of transactions
   */
  getConfirmedTransactions(address) {
    const searchCriteria = { status: TRANSACTION_STATUSES.CONFIRMED }
    if (address) {
      searchCriteria.from = address
    }
    return this.getTransactions({ searchCriteria })
  }

  /**
    Adds the txMeta to the list of transactions in the store.
    if the list is over txHistoryLimit it will remove a transaction that
    is in its final state
    it will allso add the key `history` to the txMeta with the snap shot of the original
    object
    @param txMeta {Object}
    @returns {object} the txMeta
  */
  addTransaction(txMeta) {
    if (txMeta.txParams) {
      txMeta.txParams = normalizeAndValidateTxParams(txMeta.txParams, false)
    }
    this.once(`${txMeta.id}:signed`, () => {
      this.removeAllListeners(`${txMeta.id}:rejected`)
    })
    this.once(`${txMeta.id}:rejected`, () => {
      this.removeAllListeners(`${txMeta.id}:signed`)
    })
    // initialize history
    txMeta.history = []
    // capture initial snapshot of txMeta for history
    const snapshot = snapshotFromTxMeta(txMeta)
    txMeta.history.push(snapshot)

    const transactions = this.getTransactions({
      filterToCurrentNetwork: false,
    })
    const { txHistoryLimit } = this

    // checks if the length of the tx history is longer then desired persistence
    // limit and then if it is removes the oldest confirmed or rejected tx.
    // Pending or unapproved transactions will not be removed by this
    // operation. For safety of presenting a fully functional transaction UI
    // representation, this function will not break apart transactions with the
    // same nonce, per network. Not accounting for transactions of the same
    // nonce and network combo can result in confusing or broken experiences
    // in the UI.
    //
    // TODO: we are already limiting what we send to the UI, and in the future
    // we will send UI only collected groups of transactions *per page* so at
    // some point in the future, this persistence limit can be adjusted. When
    // we do that I think we should figure out a better storage solution for
    // transaction history entries.
    const nonceNetworkSet = new Set()

    const txsToDelete = transactions
      .reverse()
      .filter((tx) => {
        const { nonce } = tx.txParams
        const { chainId, metamaskNetworkId, status } = tx
        const key = `${nonce}-${chainId ?? metamaskNetworkId}`
        if (nonceNetworkSet.has(key)) {
          return false
        }
        if (nonceNetworkSet.size < txHistoryLimit - 1 || getFinalStates().includes(status) === false) {
          nonceNetworkSet.add(key)
          return false
        }
        return true
      })
      .map((tx) => tx.id)

    this._deleteTransactions(txsToDelete)
    this._addTransactionsToState([txMeta])
    return txMeta
  }

  /**
    @param txId {number}
    @returns {object} the txMeta who matches the given id if none found
    for the network returns undefined
  */
  getTransaction(txId) {
    const { transactions } = this.store.getState()
    return transactions[txId]
  }

  /**
    updates the txMeta in the list and adds a history entry
    @param txMeta {Object} - the txMeta to update
    @param [note] {string} - a note about the update for history
  */
  updateTransaction(txMeta, note) {
    // validate txParams
    if (txMeta.txParams) {
      txMeta.txParams = normalizeAndValidateTxParams(txMeta.txParams, false)
    }

    // create txMeta snapshot for history
    const currentState = snapshotFromTxMeta(txMeta)
    // recover previous tx state obj
    const previousState = replayHistory(txMeta.history)
    // generate history entry and add to history
    const entry = generateHistoryEntry(previousState, currentState, note)
    if (entry.length > 0) {
      txMeta.history.push(entry)
    }

    // commit txMeta to state
    const txId = txMeta.id
    this.store.updateState({
      transactions: {
        ...this.store.getState().transactions,
        [txId]: txMeta,
      },
    })
  }

  getTransactions({ searchCriteria = {}, initialList = undefined, filterToCurrentNetwork = true, limit = undefined } = {}) {
    const chainId = this.getCurrentChainId()
    const network = this.getNetwork()
    // searchCriteria is an object that might have values that aren't predicate
    // methods. When providing any other value type (string, number, etc), we
    // consider this shorthand for "check the value at key for strict equality
    // with the provided value". To conform this object to be only methods, we
    // mapValues (lodash) such that every value on the object is a method that
    // returns a boolean.
    const predicateMethods = mapValues(searchCriteria, (predicate) => (typeof predicate === 'function' ? predicate : (v) => v === predicate))

    // If an initial list is provided we need to change it back into an object
    // first, so that it matches the shape of our state. This is done by the
    // lodash keyBy method. This is the edge case for this method, typically
    // initialList will be undefined.
    const transactionsToFilter = initialList ? keyBy(initialList, 'id') : this.store.getState().transactions

    // Combine sortBy and pickBy to transform our state object into an array of
    // matching transactions that are sorted by time.
    const filteredTransactions = sortBy(
      pickBy(transactionsToFilter, (transaction) => {
        // default matchesCriteria to the value of transactionMatchesNetwork
        // when filterToCurrentNetwork is true.
        if (filterToCurrentNetwork && transactionMatchesNetwork(transaction, chainId, network) === false) {
          return false
        }
        // iterate over the predicateMethods keys to check if the transaction
        // matches the searchCriteria
        for (const [key, predicate] of Object.entries(predicateMethods)) {
          // We return false early as soon as we know that one of the specified
          // search criteria do not match the transaction. This prevents
          // needlessly checking all criteria when we already know the criteria
          // are not fully satisfied. We check both txParams and the base
          // object as predicate keys can be either.
          if (key in transaction.txParams) {
            if (predicate(transaction.txParams[key]) === false) {
              return false
            }
          } else if (predicate(transaction[key]) === false) {
            return false
          }
        }

        return true
      }),
      'time'
    )
    if (limit !== undefined) {
      // We need to have all transactions of a given nonce in order to display
      // necessary details in the UI. We use the size of this set to determine
      // whether we have reached the limit provided, thus ensuring that all
      // transactions of nonces we include will be sent to the UI.
      const nonces = new Set()
      const txs = []
      // By default, the transaction list we filter from is sorted by time ASC.
      // To ensure that filtered results prefers the newest transactions we
      // iterate from right to left, inserting transactions into front of a new
      // array. The original order is preserved, but we ensure that newest txs
      // are preferred.
      for (let i = filteredTransactions.length - 1; i > -1; i -= 1) {
        const txMeta = filteredTransactions[i]
        const { nonce } = txMeta.txParams
        if (!nonces.has(nonce)) {
          if (nonces.size < limit) {
            nonces.add(nonce)
          } else {
            // eslint-disable-next-line no-continue
            continue
          }
        }
        // Push transaction into the beginning of our array to ensure the
        // original order is preserved.
        txs.unshift(txMeta)
      }
      return txs
    }
    return filteredTransactions
  }

  /**
    should update the status of the tx to 'rejected'.
    @param txId {number} - the txMeta Id
  */
  setTxStatusRejected(txId) {
    this._setTransactionStatus(txId, TRANSACTION_STATUSES.REJECTED)
    this._deleteTransaction(txId)
  }

  /**
    should update the status of the tx to 'unapproved'.
    @param txId {number} - the txMeta Id
  */
  setTxStatusUnapproved(txId) {
    this._setTransactionStatus(txId, TRANSACTION_STATUSES.UNAPPROVED)
  }

  /**
    should update the status of the tx to 'approved'.
    @param txId {number} - the txMeta Id
  */
  setTxStatusApproved(txId) {
    this._setTransactionStatus(txId, TRANSACTION_STATUSES.APPROVED)
  }

  /**
    should update the status of the tx to 'signed'.
    @param txId {number} - the txMeta Id
  */
  setTxStatusSigned(txId) {
    this._setTransactionStatus(txId, TRANSACTION_STATUSES.SIGNED)
  }

  /**
    should update the status of the tx to 'submitted'.
    and add a time stamp for when it was called
    @param txId {number} - the txMeta Id
  */
  setTxStatusSubmitted(txId) {
    const txMeta = this.getTransaction(txId)
    txMeta.submittedTime = Date.now()
    this.updateTransaction(txMeta, 'txStateManager - add submitted time stamp')
    this._setTransactionStatus(txId, TRANSACTION_STATUSES.SUBMITTED)
  }

  /**
   * Update status of the TransactionMeta with provided id to 'confirmed'
   *
   * @param {number} txId - the target TransactionMeta's Id
   */
  setTxStatusConfirmed(txId) {
    this._setTransactionStatus(txId, TRANSACTION_STATUSES.CONFIRMED)
  }

  /**
   * Update status of the TransactionMeta with provided id to 'dropped'
   *
   * @param {number} txId - the target TransactionMeta's Id
   */
  setTxStatusDropped(txId) {
    this._setTransactionStatus(txId, TRANSACTION_STATUSES.DROPPED)
  }

  /**
    should update the status of the tx to 'failed'.
    and put the error on the txMeta
    @param txId {number} - the txMeta Id
    @param error_ {errorObject} - error object
  */
  setTxStatusFailed(txId, error_) {
    const error = !error_ ? new Error('Internal torus failure') : error_

    const txMeta = this.getTransaction(txId)
    txMeta.err = {
      message: error.toString(),
      rpc: error.value,
      stack: error.stack,
    }
    this.updateTransaction(txMeta, 'transactions:tx-state-manager#fail - add error')
    this._setTransactionStatus(txId, TRANSACTION_STATUSES.FAILED)
  }

  /**
    Removes transaction from the given address for the current network
    from the txList
    @param address {string} - hex string of the from address on the txParams to remove
  */
  wipeTransactions(address) {
    // network only tx
    const { transactions } = this.store.getState()
    const network = this.getNetwork()
    const chainId = this.getCurrentChainId()

    // Update state
    this.store.updateState({
      transactions: omitBy(
        transactions,
        (transaction) => transaction.txParams.from === address && transactionMatchesNetwork(transaction, chainId, network)
      ),
    })
  }

  /**
   * Filters out the unapproved transactions from state
   */
  clearUnapprovedTxs() {
    this.store.updateState({
      transactions: omitBy(this.store.getState().transactions, (transaction) => transaction.status === TRANSACTION_STATUSES.UNAPPROVED),
    })
  }
  //
  //           PRIVATE METHODS
  //

  // STATUS METHODS
  // statuses:
  //    - `'unapproved'` the user has not responded
  //    - `'rejected'` the user has responded no!
  //    - `'approved'` the user has approved the tx
  //    - `'signed'` the tx is signed
  //    - `'submitted'` the tx is sent to a server
  //    - `'confirmed'` the tx has been included in a block.
  //    - `'failed'` the tx failed for some reason, included on tx data.
  //    - `'dropped'` the tx nonce was already used

  /**
    @param txId {number} - the txMeta Id
    @param status {string} - the status to set on the txMeta
    @emits tx:status-update - passes txId and status
    @emits ${txMeta.id}:finished - if it is a finished state. Passes the txMeta
    @emits update:badge
  */
  _setTransactionStatus(txId, status) {
    const txMeta = this.getTransaction(txId)

    if (!txMeta) {
      return
    }

    txMeta.status = status
    try {
      this.updateTransaction(txMeta, `txStateManager: setting status to ${status}`)
      this.emit(`${txMeta.id}:${status}`, txId)
      this.emit('tx:status-update', txId, status)
      if ([TRANSACTION_STATUSES.SUBMITTED, TRANSACTION_STATUSES.REJECTED, TRANSACTION_STATUSES.FAILED].includes(status)) {
        this.emit(`${txMeta.id}:finished`, txMeta)
      }
      this.emit('update:bagde')
    } catch (error) {
      log.error(error)
    }
  }

  /**
   * Adds one or more transactions into state. This is not intended for
   * external use.
   *
   * @private
   * @param {TransactionMeta[]} transactions - the list of transactions to save
   */
  _addTransactionsToState(transactions) {
    this.store.updateState({
      transactions: transactions.reduce((result, newTx) => {
        result[newTx.id] = newTx
        return result
      }, this.store.getState().transactions),
    })
  }

  /**
   * removes one transaction from state. This is not intended for external use.
   *
   * @private
   * @param {number} targetTransactionId - the transaction to delete
   */
  _deleteTransaction(targetTransactionId) {
    const { transactions } = this.store.getState()
    delete transactions[targetTransactionId]
    this.store.updateState({
      transactions,
    })
  }

  /**
   * removes multiple transaction from state. This is not intended for external use.
   *
   * @private
   * @param {number[]} targetTransactionIds - the transactions to delete
   */
  _deleteTransactions(targetTransactionIds) {
    const { transactions } = this.store.getState()
    targetTransactionIds.forEach((transactionId) => {
      delete transactions[transactionId]
    })
    this.store.updateState({
      transactions,
    })
  }
}

export default TransactionStateManager
