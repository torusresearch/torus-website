<template>
  <div>
    <TkeyInputForm :tkey-store="tKeyStore" :selected-address="selectedAddress" />
  </div>
</template>

<script>
import { mapState } from 'vuex'

import TkeyInputForm from '../../components/Tkey/TkeyInputForm'

export default {
  name: 'TkeyInput',
  components: { TkeyInputForm },
  computed: {
    ...mapState(['tKeyStore', 'selectedAddress']),
  },
}
</script>

<style lang="scss" scoped>
@import 'TkeyInput.scss';
</style>
