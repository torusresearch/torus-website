<template>
  <div>
    <TkeyInputPassword @setPasswordInput="setInput" />
    <TkeyInputShareTransfer />
    <TkeyDeviceDetected @setStoreDeviceFlow="setInput" />
  </div>
</template>

<script>
import log from 'loglevel'

import createTKeyInstance from '../../../handlers/Tkey/TkeyFactory'
import { calculateSettingsPageData } from '../../../handlers/Tkey/TkeyUtils'
import { SECURITY_QUESTIONS_MODULE_KEY, SHARE_TRANSFER_MODULE_KEY } from '../../../utils/enums'
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
      [SECURITY_QUESTIONS_MODULE_KEY]: {
        show: false,
        finished: false,
      },
      [SHARE_TRANSFER_MODULE_KEY]: {
        show: false,
        finished: false,
      },
    }
  },
  async mounted() {
    // Create tkey instance here
    this.tKey = await createTKeyInstance(this.postboxKey, this.tKeyJson)
    this.settingsData = await calculateSettingsPageData(this.tKey)
    const { keyDetails, parsedShareDescriptions } = this.settingsData
    const { requiredShares } = keyDetails
    if (requiredShares > 0) {
      for (const element of parsedShareDescriptions) {
        if (element.module === SECURITY_QUESTIONS_MODULE_KEY) {
          this[SECURITY_QUESTIONS_MODULE_KEY].show = true
        } else {
          this[SHARE_TRANSFER_MODULE_KEY].show = true
        }
      }
    }
  },
  methods: {
    setInput(details) {
      const { rejected } = details
      if (rejected) this.$emit('triggerDeny')
      else this.$emit('triggerSign', details)
    },
    async enterPassword(password) {
      try {
        await this.tKey.modules[SECURITY_QUESTIONS_MODULE_KEY].inputShareFromSecurityQuestions(password)
        this[SECURITY_QUESTIONS_MODULE_KEY].finished = true
        await this.tryFinish()
      } catch (error) {
        // TODO: show incorrect password
        log.error(error, 'incorrect password entered')
      }
    },
    async tryFinish() {
      this.settingsData = await calculateSettingsPageData(this.tKey)
      const {
        keyDetails: { requiredShares },
      } = this.settingsData

      if (requiredShares === 0) {
        // finish fn
      }
    },
  },
}
</script>

<style lang="scss" scoped>
// @import 'TkeyInputForm.scss';
</style>
