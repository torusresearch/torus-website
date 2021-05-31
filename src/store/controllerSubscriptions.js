import torus from '../torus'
import { capitalizeFirstLetter } from '../utils/utils'

let storeReference
let deferredDispatch = []
function getStore() {
  return (
    storeReference || {
      dispatch(...arguments_) {
        deferredDispatch.push(() => {
          storeReference.dispatch(...arguments_)
        })
      },
    }
  )
}

export function injectStore(s) {
  storeReference = s
  deferredDispatch.forEach((fn) => fn())
  deferredDispatch = []
}

/*
Edited to change networkId => network state. Has an implication of changing neworkVersion
to "loading" at times in the inpage API
 */

if (torus) {
  torus.torusController.networkController.networkStore.subscribe((state) => {
    getStore().dispatch('updateNetworkId', { networkId: state })
  })
}

export function accountTrackerHandler({ accounts }) {
  if (accounts) {
    for (const key in accounts) {
      if (Object.prototype.hasOwnProperty.call(accounts, key)) {
        const account = accounts[key]
        if (account.address) getStore().commit('setWeiBalance', { [account.address]: account.balance })
      }
    }
  }
}

export function transactionControllerHandler({ transactions }) {
  if (transactions) {
    // these transactions have negative index
    const updatedTransactions = []
    for (const id in transactions) {
      if (transactions[id]) {
        updatedTransactions.push(transactions[id])
      }
    }
    getStore().commit('setTransactions', updatedTransactions)
    getStore().dispatch('updateCalculatedTx', updatedTransactions)
  }
}

export function assetControllerHandler(store) {
  const { collectibleContracts, collectibles } = store
  const finalCollectibles = collectibleContracts.map((contract) => {
    contract.assets = collectibles.filter((asset) => asset.address === contract.address)
    return contract
  })
  getStore().commit('setAssets', {
    [torus.torusController.assetController.selectedAddress]: finalCollectibles,
  })
}

export function typedMessageManagerHandler({ unapprovedTypedMessages }) {
  getStore().commit('setTypedMessages', unapprovedTypedMessages)
}

export function personalMessageManagerHandler({ unapprovedPersonalMsgs }) {
  getStore().commit('setPersonalMessages', unapprovedPersonalMsgs)
}

export function messageManagerHandler({ unapprovedMsgs }) {
  getStore().commit('setMessages', unapprovedMsgs)
}

export function detectTokensControllerHandler(state) {
  getStore().commit('setTokenData', state)
  getStore().commit('setTokenDataLoaded')
}

export function tokenRatesControllerHandler({ contractExchangeRates }) {
  if (contractExchangeRates) {
    getStore().commit('setTokenRates', contractExchangeRates)
  }
}

export function prefsControllerHandler(state) {
  const { selectedAddress } = state
  getStore().commit('setSelectedAddress', selectedAddress)
  if (selectedAddress === '') return
  const addressState = state[selectedAddress]
  Object.keys(addressState).forEach((x) => {
    if (x === 'jwtToken') getStore().commit('setJwtToken', { [selectedAddress]: addressState[x] })
    else if (x !== 'fetchedPastTx' && x !== 'accountType' && x !== 'customTokens')
      getStore().commit(`set${capitalizeFirstLetter(x)}`, addressState[x])
  })
}

export function successMsgHandler(message) {
  getStore().commit('setSuccessMsg', message)
}

export function errorMsgHandler(error) {
  getStore().commit('setErrorMsg', error)
}

export function metadataHandler(state) {
  getStore().commit('setMetaData', state)
}

export function etherscanTxHandler(state) {
  getStore().commit('setEtherscanTx', state)
}

export function billboardHandler(state) {
  getStore().commit('setBillboard', state)
}

export function walletConnectHandler(state) {
  getStore().commit('setWCConnectorSession', state)
}

export function encryptionPublicKeyHandler({ unapprovedEncryptionPublicKeyMsgs }) {
  getStore().commit('setUnapprovedEncryptionPublicKeyMsgs', unapprovedEncryptionPublicKeyMsgs)
}

export function unapprovedDecryptMsgsHandler({ unapprovedDecryptMsgs }) {
  getStore().commit('setUnapprovedDecryptMsgs', unapprovedDecryptMsgs)
}

export function announcemenstHandler(state) {
  getStore().commit('setAnnouncements', state)
}
