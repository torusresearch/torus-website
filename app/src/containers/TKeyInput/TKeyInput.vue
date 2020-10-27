<template>
  <div>
    <TkeyInputForm :t-key-json="tKeyJson" :postbox-key="postboxKey" @triggerSign="triggerSign" @triggerDeny="triggerDeny" />
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
      tKeyJson: (state) => state.tKeyStore.tKey,
      wallet: 'wallet',
      selectedAddress: 'selectedAddress',
    }),
    postboxKey() {
      const postboxWallet = Object.keys(this.wallet).find((x) => this.wallet[x].accountType === ACCOUNT_TYPE.NORMAL)
      return this.wallet[postboxWallet]?.privateKey
    },
  },
  watch: {
    selectedAddress(newValue, oldValue) {
      if (newValue && newValue !== oldValue) {
        let redirectPath = this.$route.query.redirect
        if (redirectPath === undefined || (redirectPath && redirectPath.includes('index.html'))) redirectPath = '/wallet/home'

        this.$router.push(redirectPath).catch((_) => {})
      }
    },
  },
  methods: {
    ...mapActions(['setTkeyInputFlow']),
    triggerSign(data) {
      this.setTkeyInputFlow(data)
    },
    triggerDeny() {
      this.setTkeyInputFlow({ rejected: true })
    },
  },
}
</script>
