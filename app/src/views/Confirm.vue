<template>
<div></div>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    methods: {
      ...mapActions({
        hidePopup: 'hidePopup'
      })
    },
    mounted () {
      let confirmed = window.confirm('Confirm transaction?')
      this.hidePopup()
      if (!confirmed) {
        throw new Error('USER DID NOT CONFIRM??')
      } else {
        let torusController = window.Vue.TorusUtils.torusController
        let state = torusController.getState()
        if (Object.keys(state.unapprovedPersonalMsgs).length > 0) {
          let unapprovedPersonalMsgs = []
          console.log(state)
          for (let id in state.unapprovedPersonalMsgs) {
            unapprovedPersonalMsgs.push(state.unapprovedPersonalMsgs[id])
          }
          unapprovedPersonalMsgs = unapprovedPersonalMsgs.sort((a, b) => { return a.time - b.time })
          console.log(unapprovedPersonalMsgs)
          let msgParams = unapprovedPersonalMsgs[0].msgParams
          msgParams.metamaskId = parseInt(unapprovedPersonalMsgs[0].id)
          torusController.signPersonalMessage(msgParams)
        } else if (Object.keys(state.unapprovedMsgs).length > 0) {
          let unapprovedMsgs = []
          console.log(state)
          for (let id in state.unapprovedMsgs) {
            unapprovedMsgs.push(state.unapprovedMsgs[id])
          }
          unapprovedMsgs = unapprovedMsgs.sort((a, b) => { return a.time - b.time })
          console.log(unapprovedMsgs)
          let msgParams = unapprovedMsgs[0].msgParams
          msgParams.metamaskId = parseInt(unapprovedMsgs[0].id)
          torusController.signPersonalMessage(msgParams)
        } else if (Object.keys(state.unapprovedTypedMessages).length > 0) {
          let unapprovedTypedMessages = []
          console.log(state)
          for (let id in state.unapprovedTypedMessages) {
            unapprovedTypedMessages.push(state.unapprovedTypedMessages[id])
          }
          unapprovedTypedMessages = unapprovedTypedMessages.sort((a, b) => { return a.time - b.time })
          console.log(unapprovedTypedMessages)
          let msgParams = unapprovedTypedMessages[0].msgParams
          msgParams.metamaskId = parseInt(unapprovedTypedMessages[0].id)
          torusController.signPersonalMessage(msgParams)
        } else if (Object.keys(state.transactions).length > 0) {
          let transactions = []
          console.log(state)
          for (let id in state.transactions) {
            transactions.push(state.transactions[id])
          }
          console.log(transactions)
          torusController.updateAndApproveTransaction(transactions[0])
        } else {
          throw new Error('NO NEW TRANSACTIONS!!!!')
        }
      }
    }
  }
</script>