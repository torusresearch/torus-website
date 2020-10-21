<template>
  <div>
    <TkeyInputPassword :tkey-store="tKeyStore" :selected-address="selectedAddress" @setPasswordInput="setInput" />
    <TkeyInputShareTransfer :tkey-store="tKeyStore" />
    <TkeyDeviceDetected :tkey-store="tKeyStore" :selected-address="selectedAddress" @setStoreDeviceFlow="setInput" />
  </div>
</template>

<script>
import TkeyDeviceDetected from '../TkeyDeviceDetected'
import TkeyInputPassword from '../TkeyInputPassword'
import TkeyInputShareTransfer from '../TkeyInputShareTransfer'

export default {
  name: 'TkeyInputForm',
  components: { TkeyInputPassword, TkeyInputShareTransfer, TkeyDeviceDetected },
  props: {
    tKeyStore: {
      type: Object,
      default() {
        return {}
      },
    },
    selectedAddress: {
      type: String,
      default: '',
    },
  },
  methods: {
    setInput(details) {
      const { rejected } = details
      if (rejected) this.$emit('triggerDeny')
      else this.$emit('triggerSign', details)
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'TkeyInputForm.scss';
</style>
