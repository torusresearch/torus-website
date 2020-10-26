<template>
  <div>
    <TkeyInputPassword @setPasswordInput="setInput" />
    <TkeyInputShareTransfer />
    <TkeyDeviceDetected @setStoreDeviceFlow="setInput" />
  </div>
</template>

<script>
import createTKeyInstance from '../../../handlers/Tkey/TkeyFactory'
import { calculateSettingsPageData } from '../../../handlers/Tkey/TkeyUtils'
import TkeyDeviceDetected from '../TkeyDeviceDetected'
import TkeyInputPassword from '../TkeyInputPassword'
import TkeyInputShareTransfer from '../TkeyInputShareTransfer'

export default {
  name: 'TkeyInputForm',
  components: { TkeyInputPassword, TkeyInputShareTransfer, TkeyDeviceDetected },
  props: {
    tKeyJson: {
      type: Object,
      default() {
        return {}
      },
    },
    postboxKey: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      tKey: undefined,
      settingsData: {},
    }
  },
  async mounted() {
    // Create tkey instance here
    this.tKey = await createTKeyInstance(this.postboxKey, this.tKeyJson)
    this.settingsData = await calculateSettingsPageData(this.tKey)
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
