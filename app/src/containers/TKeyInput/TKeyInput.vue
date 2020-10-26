<template>
  <div>
    <TkeyInputForm :t-key-store="tKeyStore" :postbox-key="postboxKey" @triggerSign="triggerSign" @triggerDeny="triggerDeny" />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

import TkeyInputForm from '../../components/Tkey/TkeyInputForm'
import { ACCOUNT_TYPE } from '../../utils/enums'

export default {
  name: 'TkeyInput',
  components: { TkeyInputForm },
  computed: {
    ...mapState({
      tKeyStore: (state) => state.tKeyStore.tKey,
      wallet: 'wallet',
    }),
    postboxKey() {
      const postboxWallet = Object.keys(this.wallet).find((x) => this.wallet[x].accountType === ACCOUNT_TYPE.NORMAL)
      return this.wallet[postboxWallet]?.privateKey
    },
  },
  methods: {
    ...mapActions(['setTkeyInputFlow']),
    triggerSign(data) {
      this.setTkeyInputFlow({ response: data })
    },
    triggerDeny() {
      this.setTkeyInputFlow({ rejected: true })
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'TkeyInput.scss';
</style>
