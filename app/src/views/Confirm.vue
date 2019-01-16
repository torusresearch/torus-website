<template>
<div></div>
</template>

<script>
  export default {
    mounted () {
      if (!window.confirm('im a confirm and im TRIGGEREEEEDD >:(((')) {
        throw new Error('USER DID NOT CONFIRM??')
      } else {
        let torusController = window.Vue.TorusUtils.torusController
        let state = torusController.getState()
        let unapprovedPersonalMsgs = []
        console.log(state)
        for (let id in state.unapprovedPersonalMsgs) {
          unapprovedPersonalMsgs.push(state.unapprovedPersonalMsgs[id])
        }
        unapprovedPersonalMsgs = unapprovedPersonalMsgs.sort((a, b) => { return a.time - b.time })
        console.log(unapprovedPersonalMsgs)
        if (unapprovedPersonalMsgs.length > 0) {
          let msgParams = unapprovedPersonalMsgs[0].msgParams
          msgParams.metamaskId = parseInt(unapprovedPersonalMsgs[0].id)
          torusController.signPersonalMessage(msgParams)
        } else {
          throw new Error('no transactions!!!!!!')
        }
      }
    }
  }
</script>