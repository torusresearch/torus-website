<template>
  <div>
    <TkeyInputPassword />
    <TkeyInputShareTransfer />
    <TkeyDeviceDetected />
  </div>
</template>

<script>
import TkeyDeviceDetected from '../TkeyDeviceDetected'
import TkeyInputPassword from '../TkeyInputPassword'
import TkeyInputShareTransfer from '../TkeyInputShareTransfer'

export default {
  name: 'TkeyInputForm',
  components: { TkeyInputPassword, TkeyInputShareTransfer, TkeyDeviceDetected },
}
</script>

<style lang="scss" scoped>
@import 'TkeyInputForm.scss';
</style>
