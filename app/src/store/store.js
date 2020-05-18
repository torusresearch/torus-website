import log from 'loglevel'
import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import { fromWei, hexToUtf8, isAddress, toBN, toChecksumAddress } from 'web3-utils'

import config from '../config'
import torus from '../torus'
import ConfirmHandler from '../utils/ConfirmHandler'
import {
  COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM,
  TOKEN_METHOD_TRANSFER_FROM,
  TX_MESSAGE,
  TX_PERSONAL_MESSAGE,
  TX_TRANSACTION,
  TX_TYPED_MESSAGE,
} from '../utils/enums'
import { post } from '../utils/httpHelpers'
import { notifyUser } from '../utils/notifications'
import { getEtherScanHashLink, storageAvailable } from '../utils/utils'
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
      // pastTransactions: state.pastTransactions
    }),
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
    showPopup({ state, getters }) {
      const confirmHandler = new ConfirmHandler(torus.instanceId)
      const isTx = isTorusTransaction()
      confirmHandler.isTx = isTx
      confirmHandler.selectedCurrency = state.selectedCurrency
      confirmHandler.balance = fromWei(state.weiBalance[state.selectedAddress].toString())
      confirmHandler.tokenRates = state.tokenRates
      confirmHandler.jwtToken = state.jwtToken
      confirmHandler.currencyData = state.currencyData
      confirmHandler.networkType = state.networkType
      confirmHandler.whiteLabel = state.whiteLabel
      if (isTx) {
        const txParameters = getters.unApprovedTransactions[getters.unApprovedTransactions.length - 1]
        txParameters.userInfo = state.userInfo
        log.info(txParameters, 'txParams')
        confirmHandler.txParams = txParameters
        confirmHandler.id = txParameters.id
        confirmHandler.txType = TX_TRANSACTION
      } else {
        const { msgParams, id, type } = getLatestMessageParameters()
        confirmHandler.msgParams = msgParams
        confirmHandler.id = id
        confirmHandler.txType = type
      }
      if (window.location === window.parent.location && window.location.origin === config.baseUrl) {
        handleConfirm({ data: { txType: confirmHandler.txType, id: confirmHandler.id } })
      } else if (confirmHandler.txType === TX_MESSAGE && isTorusSignedMessage(confirmHandler.msgParams)) {
        handleConfirm({ data: { txType: confirmHandler.txType, id: confirmHandler.id } })
      } else {
        confirmHandler.open(handleConfirm, handleDeny)
      }
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

function getCurrencyMultiplier() {
  const { selectedCurrency, currencyData } = VuexStore.state || {}
  let currencyMultiplier = 1
  if (selectedCurrency !== 'ETH') currencyMultiplier = currencyData[selectedCurrency.toLowerCase()] || 1
  return currencyMultiplier
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

    if (ev.data.gasPrice) {
      log.info('Changed gas price to:', ev.data.gasPrice)
      const newTxMeta = JSON.parse(JSON.stringify(txMeta))
      newTxMeta.txParams.gasPrice = ev.data.gasPrice
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

function getLatestMessageParameters() {
  let time = 0
  let message = null
  let type = ''
  let finalId = 0
  for (const id in VuexStore.state.unapprovedMsgs) {
    const messageTime = VuexStore.state.unapprovedMsgs[id].time
    if (messageTime > time) {
      message = VuexStore.state.unapprovedMsgs[id]
      time = messageTime
      finalId = id
      type = TX_MESSAGE
    }
  }

  for (const id in VuexStore.state.unapprovedPersonalMsgs) {
    const messageTime = VuexStore.state.unapprovedPersonalMsgs[id].time
    if (messageTime > time) {
      message = VuexStore.state.unapprovedPersonalMsgs[id]
      time = messageTime
      finalId = id
      type = TX_PERSONAL_MESSAGE
    }
  }

  // handle hex-based messages and convert to text
  if (message) {
    let finalMessage
    try {
      finalMessage = hexToUtf8(message.msgParams.data)
    } catch (error) {
      finalMessage = message.msgParams.data
    }
    message.msgParams.message = finalMessage
  }

  // handle typed messages
  for (const id in VuexStore.state.unapprovedTypedMessages) {
    const messageTime = VuexStore.state.unapprovedTypedMessages[id].time
    if (messageTime > time) {
      time = messageTime
      message = VuexStore.state.unapprovedTypedMessages[id]
      message.msgParams.typedMessages = message.msgParams.data // TODO: use for differentiating msgs later on
      finalId = id
      type = TX_TYPED_MESSAGE
    }
  }
  return message ? { msgParams: message.msgParams, id: finalId, type } : {}
}

function isTorusTransaction() {
  let isLatestTx = false
  let latestTime = 0
  for (const id in VuexStore.getters.unApprovedTransactions) {
    const txTime = VuexStore.getters.unApprovedTransactions[id].time
    if (txTime > latestTime) {
      latestTime = txTime
      isLatestTx = true
    }
  }
  for (const id in VuexStore.state.unapprovedTypedMessages) {
    const messageTime = VuexStore.state.unapprovedTypedMessages[id].time
    if (messageTime > latestTime) {
      return false
    }
  }
  for (const id in VuexStore.state.unapprovedPersonalMsgs) {
    const messageTime = VuexStore.state.unapprovedPersonalMsgs[id].time
    if (messageTime > latestTime) {
      return false
    }
  }
  for (const id in VuexStore.state.unapprovedMsgs) {
    const messageTime = VuexStore.state.unapprovedMsgs[id].time
    if (messageTime > latestTime) {
      return false
    }
  }
  return isLatestTx
}

VuexStore.subscribe((mutation, state) => {
  // will rewrite later
  if (mutation.type === 'setTransactions' && state.jwtToken) {
    const txs = mutation.payload
    for (const id in txs) {
      const txMeta = txs[id]
      if (txMeta.status === 'submitted' && id >= 0) {
        // insert into db here
        const { methodParams, contractParams, txParams, transactionCategory, time, hash } = txMeta
        let amountTo
        let amountValue
        let assetName
        let tokenRate
        let symbol
        let type
        let typeName
        let typeImageLink
        let totalAmount

        if (contractParams.erc721) {
          // Handling cryptokitties
          if (contractParams.isSpecial) {
            ;[amountTo, amountValue] = methodParams || []
          } else {
            // Rest of the 721s
            ;[, amountTo, amountValue] = methodParams || []
          }

          // Get asset name of the 721
          const [contract] = state.assets[state.selectedAddress].filter((x) => x.name.toLowerCase() === contractParams.name.toLowerCase()) || []
          const [assetObject] = contract.assets.filter((x) => x.tokenId.toString() === amountValue.value.toString()) || []
          assetName = assetObject.name || ''

          symbol = assetName
          type = 'erc721'
          typeName = contractParams.name
          typeImageLink = contractParams.logo
          totalAmount = fromWei(toBN(txParams.value))
        } else if (contractParams.erc20) {
          // ERC20 transfer
          tokenRate = contractParams.erc20 ? state.tokenRates[txParams.to] : 1
          if (methodParams && Array.isArray(methodParams)) {
            if (transactionCategory === TOKEN_METHOD_TRANSFER_FROM || transactionCategory === COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM) {
              ;[, amountTo, amountValue] = methodParams || []
            } else {
              ;[amountTo, amountValue] = methodParams || []
            }
          }
          symbol = contractParams.symbol
          type = 'erc20'
          typeName = contractParams.name
          typeImageLink = contractParams.logo
          totalAmount = amountValue && amountValue.value ? fromWei(toBN(amountValue.value)) : fromWei(toBN(txParams.value))
        } else {
          // ETH transfers
          tokenRate = 1
          symbol = 'ETH'
          type = 'eth'
          typeName = 'eth'
          typeImageLink = 'n/a'
          totalAmount = fromWei(toBN(txParams.value))
        }
        const txObject = {
          created_at: new Date(time),
          from: toChecksumAddress(txParams.from),
          to: amountTo && isAddress(amountTo.value) ? toChecksumAddress(amountTo.value) : toChecksumAddress(txParams.to),
          total_amount: totalAmount,
          gas: txParams.gas,
          gasPrice: txParams.gasPrice,
          symbol,
          nonce: txParams.nonce,
          type,
          type_name: typeName,
          type_image_link: typeImageLink,
          currency_amount: (getCurrencyMultiplier() * Number.parseFloat(totalAmount) * tokenRate).toString(),
          selected_currency: state.selectedCurrency,
          status: 'submitted',
          network: state.networkType.host,
          transaction_hash: hash,
        }
        if (state.pastTransactions.findIndex((x) => x.transaction_hash === txObject.transaction_hash && x.network === txObject.network) === -1) {
          // User notification
          try {
            notifyUser(getEtherScanHashLink(hash, state.networkType.host))
          } catch (error) {
            log.error(error)
          }

          post(`${config.api}/transaction`, txObject, {
            headers: {
              Authorization: `Bearer ${state.jwtToken}`,
              'Content-Type': 'application/json; charset=utf-8',
            },
          })
            .then((response) => {
              if (response.response.length > 0) VuexStore.commit('patchPastTransactions', { ...txObject, id: response.response[0] })
              log.info('successfully added', response)
            })
            .catch((error) => log.error(error, 'unable to insert transaction'))
        }
      }
    }
  }
})

if (storageAvailable('localStorage')) {
  const torusTheme = localStorage.getItem('torus-theme')
  if (torusTheme) {
    VuexStore.commit('setTheme', torusTheme)
  }
}

export default VuexStore
