import log from 'loglevel'
import store from './store'
import torus from '../torus'

function accountTrackerHandler({ accounts }) {
  if (accounts) {
    for (const key in accounts) {
      if (Object.prototype.hasOwnProperty.call(accounts, key)) {
        const account = accounts[key]
        store.dispatch('updateWeiBalance', { address: account.address, balance: account.balance })
      }
    }
  }
}

function transactionControllerHandler({ transactions }) {
  if (transactions) {
    // these transactions have negative index
    const updatedTransactions = []
    for (let id in transactions) {
      if (transactions[id]) {
        updatedTransactions.push(transactions[id])
      }
    }
    // log.info(updatedTransactions, 'txs')
    store.dispatch('updateTransactions', { transactions: updatedTransactions })
  }
}

function assetControllerHandler({ accounts }) {
  log.info('received assets')
  for (const key in accounts) {
    if (Object.prototype.hasOwnProperty.call(accounts, key)) {
      const { allCollectibleContracts, allCollectibles, collectibleContracts, collectibles } = accounts[key]
      store.dispatch('updateAssets', {
        allCollectibleContracts: allCollectibleContracts,
        allCollectibles: allCollectibles,
        collectibleContracts: collectibleContracts,
        collectibles: collectibles,
        selectedAddress: key
      })
    }
  }
}

function typedMessageManagerHandler({ unapprovedTypedMessages }) {
  store.dispatch('updateTypedMessages', { unapprovedTypedMessages: unapprovedTypedMessages })
}

function personalMessageManagerHandler({ unapprovedPersonalMsgs }) {
  store.dispatch('updatePersonalMessages', { unapprovedPersonalMsgs: unapprovedPersonalMsgs })
}

function messageManagerHandler({ unapprovedMsgs }) {
  store.dispatch('updateMessages', { unapprovedMsgs: unapprovedMsgs })
}

function detectTokensControllerHandler({ tokens }) {
  if (tokens.length > 0) {
    store.dispatch('updateTokenData', {
      tokenData: tokens,
      address: torus.torusController.detectTokensController.selectedAddress
    })
  }
}

function tokenRatesControllerHandler({ contractExchangeRates }) {
  if (contractExchangeRates) {
    store.dispatch('updateTokenRates', { tokenRates: contractExchangeRates })
  }
}

export {
  accountTrackerHandler,
  transactionControllerHandler,
  assetControllerHandler,
  typedMessageManagerHandler,
  personalMessageManagerHandler,
  messageManagerHandler,
  detectTokensControllerHandler,
  tokenRatesControllerHandler
}
