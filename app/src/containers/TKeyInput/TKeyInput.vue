<template>
  <div>
    <TkeyInputForm :tkey-store="tKeyStore" />
  </div>
</template>

<script>
import { mapState } from 'vuex'

import TkeyInputForm from '../../components/Tkey/TkeyInputForm'

export default {
  name: 'TkeyInput',
  components: { TkeyInputForm },
  computed: {
    ...mapState(['tKeyStore']),
  },
}
</script>

<style lang="scss" scoped>
@import 'TkeyInput.scss';
</style>
