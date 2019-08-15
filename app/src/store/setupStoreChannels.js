import BroadcastChannel from 'broadcast-channel'
import log from 'loglevel'
import pump from 'pump'
import stream from 'stream'
import torus from '../torus'
import { MAINNET, RPC } from '../utils/enums'
import VuexStore from './store'

/* 
Edited to change networkId => network state. Has an implication of changing neworkVersion 
to "loading" at times in the inpage API
 */

torus.torusController.networkController.networkStore.subscribe(function(state) {
  VuexStore.dispatch('updateNetworkId', { networkId: state })
})

if (window.localStorage) {
  // listen to changes on localstorage
  window.addEventListener(
    'storage',
    function() {
      const network = localStorage.getItem('torus_network_type') || MAINNET
      if (network !== RPC && network !== VuexStore.state.networkType) {
        VuexStore.dispatch('setProviderType', { network })
      }
      if (network === RPC && localStorage.getItem('torus_custom_rpc') !== VuexStore.state.rpcDetails) {
        VuexStore.dispatch('setProviderType', { network: JSON.parse(localStorage.getItem('torus_custom_rpc')), type: RPC })
      }
    },
    false
  )
}

// setup handlers for communicationStream
var passthroughStream = new stream.PassThrough({ objectMode: true })
passthroughStream.on('data', function() {
  log.info('p data:', arguments)
})

torus.communicationMux.getStream('oauth').on('data', function(chunk) {
  VuexStore.dispatch('triggerLogin', { calledFromEmbed: chunk.data.calledFromEmbed })
})

torus.communicationMux.getStream('show_wallet').on('data', function(chunk) {
  VuexStore.dispatch('showWalletPopup', { network: chunk.data.calledFromEmbed })
})

torus.communicationMux.getStream('provider_change').on('data', function(chunk) {
  VuexStore.dispatch('showProviderChangePopup', { ...chunk.data })
})

torus.communicationMux.getStream('logout').on('data', function(chunk) {
  if (chunk.name === 'logOut') VuexStore.dispatch('logOut')
})

const userInfoStream = torus.communicationMux.getStream('user_info')
userInfoStream.on('data', function(chunk) {
  if (chunk.name === 'user_info_request') VuexStore.dispatch('showUserInfoRequestPopup', { ...chunk.data })
})

pump(torus.communicationMux.getStream('oauth'), passthroughStream, err => {
  if (err) log.error(err)
})
var bc = new BroadcastChannel(`torus_channel_${torus.instanceId}`)
bc.onmessage = function(ev) {
  if (ev.data.type === 'confirm-transaction') {
    let { torusController } = torus
    let state = VuexStore.state
    if (Object.keys(state.unapprovedPersonalMsgs).length > 0) {
      let msgParams = state.unapprovedPersonalMsgs[ev.data.id].msgParams
      log.info('PERSONAL MSG PARAMS:', msgParams)
      msgParams.metamaskId = parseInt(ev.data.id, 10)
      torusController.signPersonalMessage(msgParams)
    } else if (Object.keys(state.unapprovedMsgs).length > 0) {
      let msgParams = state.unapprovedMsgs[ev.data.id].msgParams
      log.info(' MSG PARAMS:', msgParams)
      msgParams.metamaskId = parseInt(ev.data.id, 10)
      torusController.signMessage(msgParams)
    } else if (Object.keys(state.unapprovedTypedMessages).length > 0) {
      let msgParams = state.unapprovedTypedMessages[ev.data.id].msgParams
      log.info('TYPED MSG PARAMS:', msgParams)
      msgParams.metamaskId = parseInt(ev.data.id, 10)
      torusController.signTypedMessage(msgParams)
    } else if (Object.keys(state.transactions).length > 0) {
      const unApprovedTransactions = VuexStore.getters.unApprovedTransactions
      var txMeta = unApprovedTransactions.find(x => x.id === ev.data.id)
      log.info('STANDARD TX PARAMS:', txMeta)

      if (ev.data.gasPrice) {
        log.info('Changed gas price to:', ev.data.gasPrice)
        var newTxMeta = JSON.parse(JSON.stringify(txMeta))
        newTxMeta.txParams.gasPrice = ev.data.gasPrice
        torusController.txController.updateTransaction(newTxMeta)
        txMeta = newTxMeta
        log.info('New txMeta: ', txMeta)
      }
      torusController.updateAndApproveTransaction(txMeta)
    } else {
      throw new Error('No new transactions.')
    }
  } else if (ev.data.type === 'deny-transaction') {
    let { torusController } = torus
    let state = VuexStore.state
    if (Object.keys(state.unapprovedPersonalMsgs).length > 0) {
      torusController.cancelPersonalMessage(parseInt(ev.data.id, 10))
    } else if (Object.keys(state.unapprovedMsgs).length > 0) {
      torusController.cancelMessage(parseInt(ev.data.id, 10))
    } else if (Object.keys(state.unapprovedTypedMessages).length > 0) {
      torusController.cancelTypedMessage(parseInt(ev.data.id, 10))
    } else if (Object.keys(state.transactions).length > 0) {
      torusController.cancelTransaction(parseInt(ev.data.id, 10))
    }
  }
}

var providerChangeChannel = new BroadcastChannel('torus_provider_change_channel')
providerChangeChannel.onmessage = function(ev) {
  if (ev.data && ev.data.type === 'confirm-provider-change' && ev.data.approve) {
    log.info('Provider change approved', ev.data.payload)
    VuexStore.dispatch('setProviderType', ev.data.payload)
  } else if (ev.data && ev.data.type === 'deny-provider-change') {
    log.info('Provider change denied')
  }
}

var logoutChannel = new BroadcastChannel('torus_logout_channel')
logoutChannel.onmessage = function(ev) {
  log.info('received logging message', ev)
  if (ev.data && ev.data.type === 'logout') {
    log.info('Logging Out', ev.data)
    VuexStore.dispatch('logOut')
  }
}

var userInfoRequestChannel = new BroadcastChannel(`user_info_request_channel_${torus.instanceId}`)
userInfoRequestChannel.onmessage = function(ev) {
  if (ev.data && ev.data.type === 'confirm-user-info-request' && ev.data.approve) {
    log.info('User Info Request approved')
    userInfoStream.write({ name: 'user_info_response', data: { payload: VuexStore.state.userInfo, approved: true } })
  } else if (ev.data && ev.data.tyep === 'deny-user-info-request') {
    log.info('User Info Request deined')
    userInfoStream.write({ name: 'user_info_response', data: { payload: VuexStore.state.userInfo, approved: false } })
  }
}

export default VuexStore
