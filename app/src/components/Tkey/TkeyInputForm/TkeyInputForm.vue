<template>
  <div>
    <TkeyInputPassword :tkey-store="tKeyStore" :selected-address="selectedAddress" />
    <TkeyInputShareTransfer :tkey-store="tKeyStore" />
    <TkeyDeviceDetected :tkey-store="tKeyStore" :selected-address="selectedAddress" />
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
}
</script>

<style lang="scss" scoped>
@import 'TkeyInputForm.scss';
</style>
