import log from 'loglevel'
import store from './store'
import torus from '../torus'
import { capitalizeFirstLetter } from '../utils/utils'
/* 
Edited to change networkId => network state. Has an implication of changing neworkVersion 
to "loading" at times in the inpage API
 */

torus.torusController.networkController.networkStore.subscribe(function(state) {
  store.dispatch('updateNetworkId', { networkId: state })
})

export function accountTrackerHandler({ accounts }) {
  if (accounts) {
    for (const key in accounts) {
      if (Object.prototype.hasOwnProperty.call(accounts, key)) {
        const account = accounts[key]
        if (account.address) store.commit('setWeiBalance', { [account.address]: account.balance })
      }
    }
  }
}

export function transactionControllerHandler({ transactions }) {
  if (transactions) {
    // these transactions have negative index
    const updatedTransactions = []
    for (let id in transactions) {
      if (transactions[id]) {
        updatedTransactions.push(transactions[id])
      }
    }
    // log.info(updatedTransactions, 'txs')
    store.commit('setTransactions', updatedTransactions)
  }
}

export function assetControllerHandler({ accounts }) {
  for (const key in accounts) {
    if (Object.prototype.hasOwnProperty.call(accounts, key)) {
      const { collectibleContracts, collectibles } = accounts[key]
      const finalCollectibles = collectibleContracts.map(contract => {
        contract.assets = collectibles.filter(asset => {
          return asset.address === contract.address
        })
        return contract
      })
      store.commit('setAssets', {
        [key]: finalCollectibles
      })
    }
  }
}

export function typedMessageManagerHandler({ unapprovedTypedMessages }) {
  store.commit('setTypedMessages', unapprovedTypedMessages)
}

export function personalMessageManagerHandler({ unapprovedPersonalMsgs }) {
  store.commit('setPersonalMessages', unapprovedPersonalMsgs)
}

export function messageManagerHandler({ unapprovedMsgs }) {
  store.commit('setMessages', unapprovedMsgs)
}

export function detectTokensControllerHandler({ tokens }) {
  if (tokens.length > 0) {
    store.commit('setTokenData', {
      [torus.torusController.detectTokensController.selectedAddress]: tokens
    })
  }
}

export function tokenRatesControllerHandler({ contractExchangeRates }) {
  if (contractExchangeRates) {
    store.commit('setTokenRates', contractExchangeRates)
  }
}

export function prefsControllerHandler(state) {
  // console.log(state, 'hek')
  Object.keys(state).forEach(x => {
    store.commit(`set${capitalizeFirstLetter(x)}`, state[x])
  })
}

export function successMsgHandler(msg) {
  store.commit('setSuccessMsg', msg)
}

export function errorMsgHandler(err) {
  store.commit('setErrorMsg', err)
}

export function metadataHandler(state) {
  store.commit('setMetaData', state)
}
