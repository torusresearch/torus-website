import log from 'loglevel'
import torus from '../torus'
import stream from 'stream'
import pump from 'pump'
import VuexStore from '.'
import BroadcastChannel from 'broadcast-channel'

/* 
Edited to change networkId => network state. Has an implication of changing neworkVersion 
to "loading" at times in the inpage API
 */
torus.torusController.networkController.networkStore.subscribe(function(state) {
  VuexStore.dispatch('updateNetworkId', { networkId: state })
})

// setup handlers for communicationStream
var passthroughStream = new stream.PassThrough({ objectMode: true })
passthroughStream.on('data', function() {
  log.info('p data:', arguments)
})

torus.communicationMux.getStream('oauth').on('data', function(chunk) {
  VuexStore.dispatch('triggerLogin', { calledFromEmbed: chunk.data.calledFromEmbed })
})

// Metamask does not expose ability to change networks to the inpage, if we want to we can enable this
torus.communicationMux.getStream('network_change').on('data', function(chunk) {
  VuexStore.dispatch('showNetworkChangePopup', { network: chunk.data.network })
})

torus.communicationMux.getStream('show_profile').on('data', function(chunk) {
  VuexStore.dispatch('showProfilePopup', { network: chunk.data.calledFromEmbed })
})

pump(torus.communicationMux.getStream('oauth'), passthroughStream, err => {
  if (err) log.error(err)
})
var bc = new BroadcastChannel(`torus_channel_${torus.instanceId}`)
bc.onmessage = function(ev) {
  if (ev.data.type === 'confirm-transaction') {
    let { torusController } = torus
    let state = torusController.getState()
    if (Object.keys(state.unapprovedPersonalMsgs).length > 0) {
      let unapprovedPersonalMsgs = []
      for (let id in state.unapprovedPersonalMsgs) {
        unapprovedPersonalMsgs.push(state.unapprovedPersonalMsgs[id])
      }
      unapprovedPersonalMsgs = unapprovedPersonalMsgs.sort((a, b) => {
        return a.time - b.time
      })
      let msgParams = unapprovedPersonalMsgs[0].msgParams
      log.info('PERSONAL MSG PARAMS:', msgParams)
      msgParams.metamaskId = parseInt(unapprovedPersonalMsgs[0].id)
      torusController.signPersonalMessage(msgParams)
    } else if (Object.keys(state.unapprovedMsgs).length > 0) {
      let unapprovedMsgs = []
      for (let id in state.unapprovedMsgs) {
        unapprovedMsgs.push(state.unapprovedMsgs[id])
      }
      unapprovedMsgs = unapprovedMsgs.sort((a, b) => {
        return a.time - b.time
      })
      let msgParams = unapprovedMsgs[0].msgParams
      log.info(' MSG PARAMS:', msgParams)
      msgParams.metamaskId = parseInt(unapprovedMsgs[0].id)
      torusController.signMessage(msgParams)
    } else if (Object.keys(state.unapprovedTypedMessages).length > 0) {
      let unapprovedTypedMessages = []
      for (let id in state.unapprovedTypedMessages) {
        unapprovedTypedMessages.push(state.unapprovedTypedMessages[id])
      }
      unapprovedTypedMessages = unapprovedTypedMessages.sort((a, b) => {
        return a.time - b.time
      })
      let msgParams = unapprovedTypedMessages[0].msgParams
      log.info('TYPED MSG PARAMS:', msgParams)
      msgParams.metamaskId = parseInt(unapprovedTypedMessages[0].id)
      torusController.signTypedMessage(msgParams)
    } else if (Object.keys(state.transactions).length > 0) {
      let transactions = []
      for (let id in state.transactions) {
        if (state.transactions[id].status === 'unapproved') {
          transactions.push(state.transactions[id])
        }
      }
      var txMeta = transactions[0]
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
    let state = torusController.getState()
    if (Object.keys(state.unapprovedPersonalMsgs).length > 0) {
      let unapprovedPersonalMsgs = []
      for (let id in state.unapprovedPersonalMsgs) {
        unapprovedPersonalMsgs.push(state.unapprovedPersonalMsgs[id])
      }
      unapprovedPersonalMsgs = unapprovedPersonalMsgs.sort((a, b) => {
        return a.time - b.time
      })
      let msgParams = unapprovedPersonalMsgs[0].msgParams
      msgParams.metamaskId = parseInt(unapprovedPersonalMsgs[0].id)
      torusController.cancelPersonalMessage(msgParams.metamaskId)
    } else if (Object.keys(state.unapprovedMsgs).length > 0) {
      let unapprovedMsgs = []
      for (let id in state.unapprovedMsgs) {
        unapprovedMsgs.push(state.unapprovedMsgs[id])
      }
      unapprovedMsgs = unapprovedMsgs.sort((a, b) => {
        return a.time - b.time
      })
      let msgParams = unapprovedMsgs[0].msgParams
      msgParams.metamaskId = parseInt(unapprovedMsgs[0].id)
      torusController.cancelMessage(msgParams.metamaskId)
    } else if (Object.keys(state.unapprovedTypedMessages).length > 0) {
      let unapprovedTypedMessages = []
      for (let id in state.unapprovedTypedMessages) {
        unapprovedTypedMessages.push(state.unapprovedTypedMessages[id])
      }
      unapprovedTypedMessages = unapprovedTypedMessages.sort((a, b) => {
        return a.time - b.time
      })
      let msgParams = unapprovedTypedMessages[0].msgParams
      msgParams.metamaskId = parseInt(unapprovedTypedMessages[0].id)
      torusController.cancelTypedMessage(msgParams.metamaskId)
    } else if (Object.keys(state.transactions).length > 0) {
      let transactions = []
      for (let id in state.transactions) {
        if (state.transactions[id].status === 'unapproved') {
          transactions.push(state.transactions[id])
        }
      }
      torusController.cancelTransaction(transactions[0].id)
    }
  }
}

var networkChannel = new BroadcastChannel('torus_network_channel')
networkChannel.onmessage = function(ev) {
  if (ev.data.approve) {
    log.info('Network change approved', ev.data.network)
    torus.setProviderType(ev.data.network)
  } else if (ev.data === 'deny-network-change') {
    log.info('Network change denied')
  }
}
