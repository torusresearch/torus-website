<template>
  <div>
    <TkeyInputForm
      :verifier-name="verifierName"
      :t-key-json="tKeyJson"
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
import { mapActions, mapState } from 'vuex'

import TkeyInputForm from '../../components/Tkey/TkeyInputForm'

export default {
  name: 'TkeyInput',
  components: { TkeyInputForm },
  computed: {
    ...mapState({
      tKeyJson: (state) => state.tKeyStore.tKey,
      wallet: 'wallet',
      selectedAddress: 'selectedAddress',
      loginConfig: (state) => state.embedState.loginConfig,
      userInfo: 'userInfo',
      postboxKey: (state) => state.postboxKey.privateKey,
    }),
    verifierName() {
      const verifierName = this.loginConfig[this.userInfo.verifier].name
      return verifierName.charAt(0).toUpperCase() + verifierName.slice(1)
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
    ...mapActions(['setTkeyInputFlow', 'setTkeySuccess', 'clearTkeySuccess', 'setTkeyError', 'clearTkeyError']),
    triggerSign(data) {
      this.setTkeyInputFlow(data)
    },
    triggerDeny() {
      this.setTkeyInputFlow({ rejected: true })
    },
  },
}
</script>
