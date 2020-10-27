<template>
  <div class="tkey-input-form">
    <!-- <TkeyInputPassword
      v-if="securityQuestions.show && !securityQuestions.finished"
      :incorrect-password="incorrectPassword"
      @setPasswordInput="enterPassword"
    /> -->
    <TkeyInputShareTransfer
      v-if="!userInputCompleted"
      :security-questions="securityQuestions"
      :incorrect-password="incorrectPassword"
      :required-shares="settingsData && settingsData.keyDetails && settingsData.keyDetails.requiredShares"
      :all-device-shares="settingsData && settingsData.allDeviceShares"
      @setPasswordInput="enterPassword"
      @skipLogin="setInput"
    />
    <TkeyDeviceDetected v-if="userInputCompleted" :all-device-shares="settingsData && settingsData.allDeviceShares" @storeDevice="storeDevice" />
  </div>
</template>

<script>
import log from 'loglevel'

import createTKeyInstance from '../../../handlers/Tkey/TkeyFactory'
import { calculateSettingsPageData } from '../../../handlers/Tkey/TkeyUtils'
import { SECURITY_QUESTIONS_MODULE_KEY } from '../../../utils/enums'
import TkeyDeviceDetected from '../TkeyDeviceDetected'
import TkeyInputShareTransfer from '../TkeyInputShareTransfer'

export default {
  name: 'TkeyInputForm',
  components: { TkeyInputShareTransfer, TkeyDeviceDetected },
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
      userInputCompleted: false,
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
      this.incorrectPassword = false
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
    async storeDevice(details) {
      // eslint-disable-next-line no-console
      console.log('storeDevice -> details', details)
    },
    async tryFinish() {
      this.settingsData = await calculateSettingsPageData(this.tKey)
      const {
        keyDetails: { requiredShares },
      } = this.settingsData

      if (requiredShares === 0) {
        this.userInputCompleted = true
        // finish fn
      }
    },
  },
}
</script>

<style lang="scss" scoped>
// @import 'TkeyInputForm.scss';
</style>
