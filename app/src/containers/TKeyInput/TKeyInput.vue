<template>
  <div>
    <TkeyInputForm :current-form-data="tKeyStore" :selected-address="selectedAddress" @triggerSign="triggerSign" @triggerDeny="triggerDeny" />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

import TkeyInputForm from '../../components/Tkey/TkeyInputForm'

export default {
  name: 'TkeyInput',
  components: { TkeyInputForm },
  computed: {
    ...mapState(['tKeyStore', 'selectedAddress']),
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
