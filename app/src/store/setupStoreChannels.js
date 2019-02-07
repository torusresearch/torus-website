import log from 'loglevel'
import torus from '../torus'
import stream from 'stream'
import pump from 'pump'
import VuexStore from '.'

// setup handlers for communicationStream
var passthroughStream = new stream.PassThrough({ objectMode: true })
passthroughStream.on('data', function() {
  log.info('p data:', arguments)
})

torus.communicationMux.getStream('oauth').on('data', function(chunk) {
  VuexStore.dispatch('triggerLogin', { calledFromEmbed: chunk.data.calledFromEmbed })
})

pump(torus.communicationMux.getStream('oauth'), passthroughStream, err => {
  if (err) log.error(err)
})

var bc = new BroadcastChannel('torus_channel')
bc.onmessage = function(ev) {
  if (ev.data === 'confirm-transaction') {
    let torusController = window.Vue.torus.torusController
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
      msgParams.metamaskId = parseInt(unapprovedMsgs[0].id)
      torusController.signPersonalMessage(msgParams)
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
      torusController.signPersonalMessage(msgParams)
    } else if (Object.keys(state.transactions).length > 0) {
      let transactions = []
      for (let id in state.transactions) {
        if (state.transactions[id].status === 'unapproved') {
          transactions.push(state.transactions[id])
        }
      }
      torusController.updateAndApproveTransaction(transactions[0])
    } else {
      throw new Error('No new transactions.')
    }
  } else if (ev.data === 'deny-transaction') {
    let torusController = window.Vue.torus.torusController
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
