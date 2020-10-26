<template>
  <div class="tkey-input-form">
    <TkeyInputPassword
      v-if="securityQuestions.show && !securityQuestions.finished"
      :incorrect-password="incorrectPassword"
      @setPasswordInput="enterPassword"
    />
    <TkeyInputShareTransfer v-if="shareTransfer.show && !shareTransfer.finished" />
    <TkeyDeviceDetected
      v-if="!securityQuestions.show && !shareTransfer.show"
      :all-device-shares="settingsData && settingsData.allDeviceShares"
      @setStoreDeviceFlow="setInput"
    />
  </div>
</template>

<script>
import log from 'loglevel'

import createTKeyInstance from '../../../handlers/Tkey/TkeyFactory'
import { calculateSettingsPageData } from '../../../handlers/Tkey/TkeyUtils'
import { SECURITY_QUESTIONS_MODULE_KEY } from '../../../utils/enums'
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
      securityQuestions: {
        show: false,
        finished: false,
      },
      shareTransfer: {
        show: false,
        finished: false,
      },
      incorrectPassword: false,
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
          this.securityQuestions.show = true
        } else {
          this.shareTransfer.show = true
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
      // eslint-disable-next-line no-console
      console.log('enterPassword -> password', password)
      try {
        await this.tKey.modules[SECURITY_QUESTIONS_MODULE_KEY].inputShareFromSecurityQuestions(password)
        this.securityQuestions.finished = true
        await this.tryFinish()
      } catch (error) {
        // TODO: show incorrect password
        log.error(error, 'incorrect password entered')
        this.incorrectPassword = true
      }
    },
    async tryFinish() {
      this.settingsData = await calculateSettingsPageData(this.tKey)
      const {
        keyDetails: { requiredShares },
      } = this.settingsData

      if (requiredShares === 0) {
        this.securityQuestions.show = false
        this.shareTransfer.show = false
        // finish fn
      }
    },
  },
}
</script>

<style lang="scss" scoped>
// @import 'TkeyInputForm.scss';
</style>
