import { setAPIKey } from '@toruslabs/http-helpers'
import log from 'loglevel'
import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import { fromWei, hexToUtf8 } from 'web3-utils'

import config from '../config'
import PopupWithBcHandler from '../handlers/Popup/PopupWithBcHandler'
import torus from '../torus'
import { FEATURES_CONFIRM_WINDOW, MESSAGE_TYPE, TRANSACTION_TYPES } from '../utils/enums'
import { setSentryEnabled } from '../utils/sentry'
import { getIFrameOriginObject, isMain, isPwa, storageAvailable } from '../utils/utils'
import actions from './actions'
import defaultGetters from './getters'
import mutations from './mutations'
import paymentActions from './PaymentActions'
import preferencesActions from './preferencesActions'
import defaultState from './state'

const { baseRoute } = config

Vue.use(Vuex)

let vuexPersist

if (storageAvailable(isPwa ? 'localStorage' : 'sessionStorage')) {
  vuexPersist = new VuexPersistence({
    key: 'torus-app',
    storage: isPwa ? window.localStorage : window.sessionStorage,
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
      crashReport: state.crashReport,
      locale: state.locale,
      billboard: state.billboard,
      announcements: state.announcements,
      contacts: state.contacts,
      whiteLabel: state.whiteLabel,
      supportedNetworks: state.supportedNetworks,
      pastTransactions: state.pastTransactions,
      paymentTx: state.paymentTx,
      etherscanTx: state.etherscanTx,
      defaultPublicAddress: state.defaultPublicAddress,
      wcConnectorSession: state.wcConnectorSession,
      postboxKey: state.postboxKey,
      lastLoginInfo: state.lastLoginInfo,
      userDapps: state.userDapps,
    }),
  })
}

const getBalance = async (state, key) =>
  new Promise((resolve, reject) => {
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

const fetchGasFeeEstimates = async (state) => {
  try {
    return torus.torusController.gasFeeController.fetchGasFeeEstimates()
  } catch (error) {
    log.warn(error, 'failed fetching gas estimates')
    return state.gasFees
  }
}

const VuexStore = new Vuex.Store({
  plugins: vuexPersist ? [vuexPersist.plugin] : [],
  state: defaultState,
  getters: defaultGetters,
  mutations,
  actions: {
    ...actions,
    ...paymentActions,
    ...preferencesActions,
    async showPopup({ state, commit }, { payload, request }) {
      const isTx = payload && typeof payload === 'object'
      const windowId = isTx ? payload.id : payload
      const channelName = `torus_channel_${windowId}`
      const finalUrl = `${baseRoute}confirm?instanceId=${windowId}&integrity=true&id=${windowId}`

      const popupPayload = {
        id: windowId,
        origin: getIFrameOriginObject(),
        selectedCurrency: state.selectedCurrency,
        tokenRates: state.tokenRates,
        jwtToken: state.jwtToken[state.selectedAddress],
        currencyData: state.currencyData,
        network: state.networkType,
        whiteLabel: state.whiteLabel,
        selectedAddress: state.selectedAddress,
        networkDetails: state.networkDetails,
      }
      if (isTx) {
        const txParameters = payload
        txParameters.userInfo = state.userInfo
        log.info(txParameters, 'txParams')
        popupPayload.txParams = txParameters
        popupPayload.type = TRANSACTION_TYPES.STANDARD_TRANSACTION
      } else {
        const { msgParams, type } = getLatestMessageParameters(payload)
        popupPayload.msgParams = { msgParams, id: windowId }
        popupPayload.type = type
      }
      let weiBalance = 0
      let latestGasFee = {}
      try {
        // polling might delay fetching fee or might have outdated fee, so getting latest fee.
        ;[weiBalance, latestGasFee] = await Promise.all([getBalance(state, state.selectedAddress), fetchGasFeeEstimates(state)])
      } catch (error) {
        log.error(error, 'Unable to fetch balance within 5 secs')
        handleDeny(windowId, popupPayload.type)
        return
      }
      popupPayload.balance = fromWei(weiBalance.toString())
      popupPayload.gasFees = latestGasFee
      if (request.isWalletConnectRequest && isMain) {
        const originObj = { href: '', hostname: '' }
        try {
          const peerMetaURL = new URL(torus.torusController.walletConnectController.getPeerMetaURL())
          originObj.href = peerMetaURL.href
          originObj.hostname = peerMetaURL.hostname
        } catch (error) {
          log.error('could not get peer meta URL for walletconnect', error)
        }
        popupPayload.origin = originObj
        commit('addConfirmModal', JSON.parse(JSON.stringify(popupPayload)))
      } else if (isMain) {
        handleConfirm({ data: { txType: popupPayload.type, id: popupPayload.id } })
      } else if (popupPayload.type === MESSAGE_TYPE.ETH_SIGN && isCustomSignedMessage(popupPayload.msgParams.msgParams)) {
        handleConfirm({ data: { txType: popupPayload.type, id: popupPayload.id } })
      } else {
        try {
          const confirmWindow = new PopupWithBcHandler({
            url: finalUrl,
            target: '_blank',
            features: FEATURES_CONFIRM_WINDOW,
            channelName,
            preopenInstanceId: request.preopenInstanceId,
          })
          const result = await confirmWindow.handleWithHandshake({
            payload: popupPayload,
          })
          const { approve = false } = result
          if (approve) handleConfirm({ data: result })
          else handleDeny(popupPayload.id, popupPayload.type)
        } catch {
          handleDeny(popupPayload.id, popupPayload.type)
        }
      }
    },
    handleConfirmModal({ commit }, payload) {
      const { gasPrice, gas, customNonceValue, id, approve, txType } = payload

      if (approve) {
        handleConfirm({
          data: {
            ...payload,
            id,
            gasPrice,
            gas,
            customNonceValue,
            txType,
          },
        })
      } else {
        handleDeny(id, txType)
      }
      commit('deleteConfirmModal', id)
    },
  },
})

function isCustomSignedMessage(messageParameters) {
  const { origin, customPrefix } = messageParameters
  if (origin && customPrefix === `\u0019${origin} Signed Message:\n`) return true

  // if (!/.+\.tor\.us$/.exec(origin) && origin !== 'tor.us') {
  //   return false
  // }
  return false
}

function handleConfirm(ev) {
  const { torusController } = torus
  const { state } = VuexStore
  if (ev.data.txType === MESSAGE_TYPE.PERSONAL_SIGN) {
    const { msgParams } = state.unapprovedPersonalMsgs[ev.data.id]
    log.info('PERSONAL MSG PARAMS:', msgParams)
    msgParams.metamaskId = Number.parseInt(ev.data.id, 10)
    torusController.signPersonalMessage(msgParams)
  } else if (ev.data.txType === MESSAGE_TYPE.ETH_SIGN) {
    const { msgParams } = state.unapprovedMsgs[ev.data.id]
    log.info(' MSG PARAMS:', msgParams)
    msgParams.metamaskId = Number.parseInt(ev.data.id, 10)
    torusController.signMessage(msgParams)
  } else if (ev.data.txType === MESSAGE_TYPE.ETH_SIGN_TYPED_DATA) {
    const { msgParams } = state.unapprovedTypedMessages[ev.data.id]
    log.info('TYPED MSG PARAMS:', msgParams)
    msgParams.metamaskId = Number.parseInt(ev.data.id, 10)
    torusController.signTypedMessage(msgParams)
  } else if (ev.data.txType === MESSAGE_TYPE.ETH_GET_ENCRYPTION_PUBLIC_KEY) {
    const msgParams = state.unapprovedEncryptionPublicKeyMsgs[ev.data.id]
    log.info('TYPED MSG PARAMS:', msgParams)
    msgParams.metamaskId = Number.parseInt(ev.data.id, 10)
    torusController.signEncryptionPublicKey(msgParams)
  } else if (ev.data.txType === MESSAGE_TYPE.ETH_DECRYPT) {
    const { msgParams } = state.unapprovedDecryptMsgs[ev.data.id]
    log.info('TYPED MSG PARAMS:', msgParams)
    msgParams.metamaskId = Number.parseInt(ev.data.id, 10)
    torusController.signEthDecrypt(msgParams)
  } else if (ev.data.txType === TRANSACTION_TYPES.STANDARD_TRANSACTION) {
    const { unApprovedTransactions } = VuexStore.getters
    let txMeta = unApprovedTransactions.find((x) => x.id === ev.data.id)
    log.info('STANDARD TX PARAMS:', txMeta)

    if (ev.data.gasPrice || (ev.data.maxPriorityFeePerGas && ev.data.maxFeePerGas) || ev.data.gas || ev.data.customNonceValue) {
      const newTxMeta = JSON.parse(JSON.stringify(txMeta))

      // both (maxPriorityFeePerGas, maxFeePerGas) and gasPrice should never sent
      if (ev.data.maxPriorityFeePerGas && ev.data.maxFeePerGas) {
        newTxMeta.txParams.maxPriorityFeePerGas = ev.data.maxPriorityFeePerGas
        newTxMeta.txParams.maxFeePerGas = ev.data.maxFeePerGas
      } else if (ev.data.gasPrice) {
        log.info('Changed gas price to:', ev.data.gasPrice)
        newTxMeta.txParams.gasPrice = ev.data.gasPrice
      }
      if (ev.data.txEnvelopeType) {
        newTxMeta.txParams.type = ev.data.txEnvelopeType
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
  if (txType === MESSAGE_TYPE.PERSONAL_SIGN) {
    torusController.cancelPersonalMessage(Number.parseInt(id, 10))
  } else if (txType === MESSAGE_TYPE.ETH_SIGN) {
    torusController.cancelMessage(Number.parseInt(id, 10))
  } else if (txType === MESSAGE_TYPE.ETH_SIGN_TYPED_DATA) {
    torusController.cancelTypedMessage(Number.parseInt(id, 10))
  } else if (txType === TRANSACTION_TYPES.STANDARD_TRANSACTION) {
    torusController.cancelTransaction(Number.parseInt(id, 10))
  } else if (txType === MESSAGE_TYPE.ETH_GET_ENCRYPTION_PUBLIC_KEY) {
    torusController.cancelEncryptionPublicKey(Number.parseInt(id, 10))
  } else if (txType === MESSAGE_TYPE.ETH_DECRYPT) {
    torusController.cancelDecryptMessage(Number.parseInt(id, 10))
  }
}

function getLatestMessageParameters(id) {
  let message = null
  let type = ''
  if (VuexStore.state.unapprovedMsgs[id]) {
    message = VuexStore.state.unapprovedMsgs[id]
    type = MESSAGE_TYPE.ETH_SIGN
  } else if (VuexStore.state.unapprovedPersonalMsgs[id]) {
    message = VuexStore.state.unapprovedPersonalMsgs[id]
    type = MESSAGE_TYPE.PERSONAL_SIGN
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
    type = MESSAGE_TYPE.ETH_SIGN_TYPED_DATA
  }

  if (VuexStore.state.unapprovedEncryptionPublicKeyMsgs[id]) {
    message = VuexStore.state.unapprovedEncryptionPublicKeyMsgs[id]
    type = MESSAGE_TYPE.ETH_GET_ENCRYPTION_PUBLIC_KEY
  }

  if (VuexStore.state.unapprovedDecryptMsgs[id]) {
    message = VuexStore.state.unapprovedDecryptMsgs[id]
    type = MESSAGE_TYPE.ETH_DECRYPT
  }

  return message ? { msgParams: message.msgParams, id, type } : {}
}

if (storageAvailable('localStorage')) {
  const torusTheme = localStorage.getItem('torus-theme')
  if (torusTheme) {
    VuexStore.commit('setTheme', torusTheme)
  }
  const torusEnableCrashReporter = localStorage.getItem('torus-enable-crash-reporter')
  if (torusEnableCrashReporter !== null) {
    VuexStore.commit('setCrashReport', Boolean(torusEnableCrashReporter))
  }

  const openLoginStore = localStorage.getItem('openlogin_store')
  if (openLoginStore !== null) {
    const { typeOfLogin, verifierId, aggregateVerifier, verifier, email } = JSON.parse(openLoginStore)
    VuexStore.commit('setLastLoginInfo', { typeOfLogin, verifierId, aggregateVerifier, verifier, email })
  }
}

// Another location

setAPIKey(VuexStore.state.embedState.apiKey)
setSentryEnabled(VuexStore.state.crashReport)

export default VuexStore
