<template>
  <div>
    <TkeyInputForm :tkey-store="currentFormData" :postbox-key="postboxKey" @triggerSign="triggerSign" @triggerDeny="triggerDeny" />
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
      const { whiteLabel, data, postboxKey } = ev.data || {}
      this.currentFormData = data
      this.postboxKey = postboxKey
      this.$store.commit('setWhiteLabel', whiteLabel)

      bc.close()
    })
    bc.postMessage({ data: { type: POPUP_LOADED, id: instanceId } })
  },
  methods: {
    async triggerSign({ data }) {
      const bc = new BroadcastChannel(this.channel, broadcastChannelOptions)
      await bc.postMessage({
        data: { type: POPUP_RESULT, data, approve: true },
      })
      bc.close()
    },
    async triggerDeny() {
      const bc = new BroadcastChannel(this.channel, broadcastChannelOptions)
      await bc.postMessage({ data: { type: POPUP_RESULT, approve: false } })
      bc.close()
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'TkeyDappInput.scss';
</style>
