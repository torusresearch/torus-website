import { setAPIKey } from '@toruslabs/http-helpers'
import log from 'loglevel'
import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import { fromWei, hexToUtf8 } from 'web3-utils'

import config from '../config'
import torus from '../torus'
import ConfirmHandler from '../utils/ConfirmHandler'
import { TX_MESSAGE, TX_PERSONAL_MESSAGE, TX_TRANSACTION, TX_TYPED_MESSAGE } from '../utils/enums'
import { storageAvailable } from '../utils/utils'
import actions from './actions'
import defaultGetters from './getters'
import mutations from './mutations'
import paymentActions from './PaymentActions'
import defaultState from './state'

Vue.use(Vuex)

let vuexPersist

if (storageAvailable('sessionStorage')) {
  vuexPersist = new VuexPersistence({
    key: 'torus-app',
    storage: window.sessionStorage,
    reducer: (state) => ({
      userInfo: state.userInfo,
      userInfoAccess: state.userInfoAccess,
      wallet: state.wallet,
      // weiBalance: state.weiBalance,
      selectedAddress: state.selectedAddress,
      networkType: state.networkType,
      networkId: state.networkId,
      currencyData: state.currencyData,
      // tokenData: state.tokenData,
      tokenRates: state.tokenRates,
      selectedCurrency: state.selectedCurrency,
      jwtToken: state.jwtToken,
      theme: state.theme,
      locale: state.locale,
      billboard: state.billboard,
      contacts: state.contacts,
      whiteLabel: state.whiteLabel,
      supportedNetworks: state.supportedNetworks,
      pastTransactions: state.pastTransactions,
      paymentTx: state.paymentTx,
      etherscanTx: state.etherscanTx,
      wcConnectorSession: state.wcConnectorSession,
    }),
  })
}

const getBalance = async (state, key) => {
  return new Promise((resolve, reject) => {
    let counter = 0
    const interval = setInterval(() => {
      counter += 1
      if (counter > 10) {
        clearInterval(interval)
        reject(new Error('Waited too long'))
      }
      if (state.weiBalance[key] !== undefined) {
        clearInterval(interval)
        resolve(state.weiBalance[key])
      }
    }, 500)
  })
}

const VuexStore = new Vuex.Store({
  plugins: vuexPersist ? [vuexPersist.plugin] : [],
  state: defaultState,
  getters: defaultGetters,
  mutations,
  actions: {
    ...actions,
    ...paymentActions,
    async showPopup({ state }, { payload, preopenInstanceId }) {
      const isTx = payload && typeof payload === 'object'
      const confirmHandler = new ConfirmHandler(isTx ? payload.id : payload, preopenInstanceId)
      confirmHandler.isTx = isTx
      confirmHandler.selectedCurrency = state.selectedCurrency
      confirmHandler.tokenRates = state.tokenRates
      confirmHandler.jwtToken = state.jwtToken
      confirmHandler.currencyData = state.currencyData
      confirmHandler.networkType = state.networkType
      confirmHandler.whiteLabel = state.whiteLabel
      if (isTx) {
        const txParameters = payload
        txParameters.userInfo = state.userInfo
        log.info(txParameters, 'txParams')
        confirmHandler.txParams = txParameters
        confirmHandler.txType = TX_TRANSACTION
      } else {
        const { msgParams, type } = getLatestMessageParameters(payload)
        confirmHandler.msgParams = msgParams
        confirmHandler.txType = type
      }
      let weiBalance = 0
      try {
        weiBalance = await getBalance(state, state.selectedAddress)
      } catch (error) {
        log.error(error, 'Unable to fetch balance within 5 secs')
        handleDeny(confirmHandler.id, confirmHandler.txType)
        return
      }
      confirmHandler.balance = fromWei(weiBalance.toString())
      if (payload.txParams.isWalletConnectRequest || payload.msgParams.isWalletConnectRequest) {
        confirmHandler.open(handleConfirm, handleDeny)
        log.debug(isTorusSignedMessage, config)
      }
      // } else if (window.location === window.parent.location && window.location.origin === config.baseUrl) {
      //   handleConfirm({ data: { txType: confirmHandler.txType, id: confirmHandler.id } })
      // } else if (confirmHandler.txType === TX_MESSAGE && isTorusSignedMessage(confirmHandler.msgParams)) {
      //   handleConfirm({ data: { txType: confirmHandler.txType, id: confirmHandler.id } })
      // } else {
      //   confirmHandler.open(handleConfirm, handleDeny)
      // }
    },
  },
})

function isTorusSignedMessage(messageParameters) {
  if (messageParameters.customPrefix !== '\u0019Torus Signed Message:\n') return false
  const { origin } = messageParameters
  if (!/.+\.tor\.us$/.exec(origin) && origin !== 'tor.us') {
    return false
  }
  return true
}

function handleConfirm(ev) {
  const { torusController } = torus
  const { state } = VuexStore
  if (ev.data.txType === TX_PERSONAL_MESSAGE) {
    const { msgParams } = state.unapprovedPersonalMsgs[ev.data.id]
    log.info('PERSONAL MSG PARAMS:', msgParams)
    msgParams.metamaskId = Number.parseInt(ev.data.id, 10)
    torusController.signPersonalMessage(msgParams)
  } else if (ev.data.txType === TX_MESSAGE) {
    const { msgParams } = state.unapprovedMsgs[ev.data.id]
    log.info(' MSG PARAMS:', msgParams)
    msgParams.metamaskId = Number.parseInt(ev.data.id, 10)
    torusController.signMessage(msgParams)
  } else if (ev.data.txType === TX_TYPED_MESSAGE) {
    const { msgParams } = state.unapprovedTypedMessages[ev.data.id]
    log.info('TYPED MSG PARAMS:', msgParams)
    msgParams.metamaskId = Number.parseInt(ev.data.id, 10)
    torusController.signTypedMessage(msgParams)
  } else if (ev.data.txType === TX_TRANSACTION) {
    const { unApprovedTransactions } = VuexStore.getters
    let txMeta = unApprovedTransactions.find((x) => x.id === ev.data.id)
    log.info('STANDARD TX PARAMS:', txMeta)

    if (ev.data.gasPrice || ev.data.gas || ev.data.customNonceValue) {
      const newTxMeta = JSON.parse(JSON.stringify(txMeta))
      if (ev.data.gasPrice) {
        log.info('Changed gas price to:', ev.data.gasPrice)
        newTxMeta.txParams.gasPrice = ev.data.gasPrice
      }
      if (ev.data.gas) {
        log.info('Changed gas limit to:', ev.data.gas)
        newTxMeta.txParams.gas = ev.data.gas
      }
      if (ev.data.customNonceValue) {
        log.info('Changed nonce to:', ev.data.customNonceValue)
        newTxMeta.txParams.customNonceValue = ev.data.customNonceValue
      }
      torusController.txController.updateTransaction(newTxMeta)
      txMeta = newTxMeta
      log.info('New txMeta: ', txMeta)
    }
    torusController.updateAndApproveTransaction(txMeta)
  } else {
    throw new Error('No new transactions.')
  }
}

function handleDeny(id, txType) {
  const { torusController } = torus
  if (txType === TX_PERSONAL_MESSAGE) {
    torusController.cancelPersonalMessage(Number.parseInt(id, 10))
  } else if (txType === TX_MESSAGE) {
    torusController.cancelMessage(Number.parseInt(id, 10))
  } else if (txType === TX_TYPED_MESSAGE) {
    torusController.cancelTypedMessage(Number.parseInt(id, 10))
  } else if (txType === TX_TRANSACTION) {
    torusController.cancelTransaction(Number.parseInt(id, 10))
  }
}

function getLatestMessageParameters(id) {
  let message = null
  let type = ''
  if (VuexStore.state.unapprovedMsgs[id]) {
    message = VuexStore.state.unapprovedMsgs[id]
    type = TX_MESSAGE
  } else if (VuexStore.state.unapprovedPersonalMsgs[id]) {
    message = VuexStore.state.unapprovedPersonalMsgs[id]
    type = TX_PERSONAL_MESSAGE
  }

  // handle hex-based messages and convert to text
  if (message) {
    let finalMessage
    try {
      finalMessage = hexToUtf8(message.msgParams.data)
    } catch {
      finalMessage = message.msgParams.data
    }
    message.msgParams.message = finalMessage
  }

  if (VuexStore.state.unapprovedTypedMessages[id]) {
    message = VuexStore.state.unapprovedTypedMessages[id]
    message.msgParams.typedMessages = message.msgParams.data // TODO: use for differentiating msgs later on
    type = TX_TYPED_MESSAGE
  }

  return message ? { msgParams: message.msgParams, id, type } : {}
}

if (storageAvailable('localStorage')) {
  const torusTheme = localStorage.getItem('torus-theme')
  if (torusTheme) {
    VuexStore.commit('setTheme', torusTheme)
  }
}

// Another location

setAPIKey(VuexStore.state.embedState.apiKey)

export default VuexStore
