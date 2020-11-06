<template>
  <div>
    <TkeyInputForm
      :verifier-name="verifierName"
      :t-key-json="currentFormData"
      :postbox-key="postboxKey"
      @triggerSign="triggerSign"
      @triggerDeny="triggerDeny"
      @postErrorMessage="setTkeyError"
      @clearErrorMessage="clearTkeyError"
      @postSuccessMessage="setTkeySuccess"
      @clearSuccessMessage="clearTkeySuccess"
    />
  </div>
</template>

<script>
import { BroadcastChannel } from 'broadcast-channel'

import TkeyInputForm from '../../components/Tkey/TkeyInputForm'
import { POPUP_LOADED, POPUP_RESULT } from '../../utils/enums'
import { broadcastChannelOptions } from '../../utils/utils'

export default {
  name: 'TkeyDappInput',
  components: { TkeyInputForm },
  data() {
    return {
      channel: '',
      currentFormData: undefined,
      postboxKey: '',
    }
  },
  mounted() {
    const queryParameters = new URLSearchParams(window.location.search)
    const instanceId = queryParameters.get('instanceId')
    this.channel = `tkey_channel_${instanceId}`
    const bc = new BroadcastChannel(this.channel, broadcastChannelOptions)
    bc.addEventListener('message', async (ev) => {
      const { whiteLabel, data, postboxKey, verifierName } = ev.data || {}
      this.currentFormData = JSON.parse(data)
      this.postboxKey = postboxKey
      this.$store.commit('setWhiteLabel', whiteLabel)
      this.verifierName = verifierName.charAt(0).toUpperCase() + verifierName.slice(1)

      bc.close()
    })
    bc.postMessage({ data: { type: POPUP_LOADED, id: instanceId } })
  },
  methods: {
    async triggerSign(data) {
      const bc = new BroadcastChannel(this.channel, broadcastChannelOptions)
      await bc.postMessage({
        data: { type: POPUP_RESULT, data: JSON.stringify(data.response), approve: true },
      })
      bc.close()
    },
    async triggerDeny() {
      const bc = new BroadcastChannel(this.channel, broadcastChannelOptions)
      await bc.postMessage({ data: { type: POPUP_RESULT, approve: false } })
      bc.close()
    },
    setTkeyError(message) {
      this.$store.commit('setErrorMsg', message)
    },
    clearTkeyError() {
      this.$store.commit('setErrorMsg')
    },
    setTkeySuccess(message) {
      this.$store.commit('setSuccessMsg', message)
    },
    clearTkeySuccess() {
      this.$store.commit('setSuccessMsg', '')
    },
  },
}
</script>
