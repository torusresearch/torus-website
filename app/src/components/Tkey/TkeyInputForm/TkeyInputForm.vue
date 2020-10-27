<template>
  <div class="tkey-input-form">
    <TkeyInputView
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
import { SECURITY_QUESTIONS_MODULE_KEY, SHARE_TRANSFER_MODULE_KEY, WEB_STORAGE_MODULE_KEY } from '../../../utils/enums'
import TkeyDeviceDetected from '../TkeyDeviceDetected'
import TkeyInputView from '../TkeyInputView'

export default {
  name: 'TkeyInputForm',
  components: { TkeyInputView, TkeyDeviceDetected },
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
      shareTransfer: {},
      incorrectPassword: false,
      userInputCompleted: false,
    }
  },
  watch: {
    tKeyJson(newValue, oldValue) {
      if (newValue && newValue !== oldValue && !this.tKey) {
        this.initTkey(newValue)
      }
    },
  },
  async mounted() {
    // Create tkey instance here
    if (this.tKeyJson && Object.keys(this.tKeyJson).length > 0) await this.initTkey(this.tKeyJson)
  },
  methods: {
    async initTkey(json) {
      this.tKey = await createTKeyInstance(this.postboxKey, json)
      this.settingsData = await calculateSettingsPageData(this.tKey)
      const { keyDetails, parsedShareDescriptions } = this.settingsData
      const { requiredShares } = keyDetails
      if (requiredShares > 0) {
        for (const element of parsedShareDescriptions) {
          if (element.module === SECURITY_QUESTIONS_MODULE_KEY) {
            this.securityQuestions.show = true
          } else {
            this.shareTransfer[element.shareIndex] = {
              show: true,
              finished: false,
            }
          }
        }
        // check for ondevice share and set it to true
        const { onDeviceShare } = this.settingsData
        if (onDeviceShare?.share?.share?.shareIndex) {
          this.shareTransfer[onDeviceShare.share.share.shareIndex].finished = true
        }
        if (Object.keys(this.shareTransfer).length > 0) {
          // start share transfer listener
          this.listenForShareTransfer()
        }
      }
    },
    listenForShareTransfer() {
      this.tKey.modules[SHARE_TRANSFER_MODULE_KEY].setRequestStatusCheckInterval(3000)
      this.tKey.modules[SHARE_TRANSFER_MODULE_KEY].requestNewShare(
        window.navigator.userAgent,
        this.tKey.getCurrentShareIndexes(),
        async (shareStore) => {
          log.info(shareStore, 'received transferred Share')
          if (this.shareTransfer[shareStore.share.shareIndex]) {
            this.shareTransfer[shareStore.share.shareIndex].finished = true
          }
          await this.tryFinish()
          const {
            keyDetails: { requiredShares },
          } = this.settingsData

          if (requiredShares > 0 && Object.keys(this.shareTransfer).some((x) => this.shareTransfer[x].finished === false)) {
            this.listenForShareTransfer()
          }
        }
      )
    },
    async setInput(details) {
      const { rejected } = details
      if (rejected) {
        await this.tKey.modules[SHARE_TRANSFER_MODULE_KEY].cancelRequestStatusCheck()
        this.$emit('triggerDeny')
      } else this.$emit('triggerSign', details)
    },
    async enterPassword(password) {
      this.incorrectPassword = false
      try {
        await this.tKey.modules[SECURITY_QUESTIONS_MODULE_KEY].inputShareFromSecurityQuestions(password)
        this.securityQuestions.finished = true
        await this.tryFinish()
      } catch (error) {
        log.error(error, 'incorrect password entered')
        this.incorrectPassword = true
      }
    },
    async storeDevice(details) {
      try {
        const { isOld, oldIndex, rejected } = details
        if (rejected) throw new Error('User rejected to store device')
        if (!isOld) {
          const newShare = await this.tKey.generateNewShare()
          log.info(newShare, 'new Share')
          await this.tKey.modules[WEB_STORAGE_MODULE_KEY].storeDeviceShare(newShare.newShareStores[newShare.newShareIndex.toString('hex')])
        } else {
          const outputShareStore = await this.tKey.outputShareStore(oldIndex)
          log.info(outputShareStore, 'old Share')
          await this.tKey.modules[WEB_STORAGE_MODULE_KEY].storeDeviceShare(outputShareStore)
        }
      } catch (error) {
        log.error(error)
      } finally {
        await this.setInput({ response: this.tKey })
      }

      // call trigger success
    },
    async tryFinish() {
      this.settingsData = await calculateSettingsPageData(this.tKey)
      const {
        keyDetails: { requiredShares },
      } = this.settingsData

      if (requiredShares === 0) {
        this.userInputCompleted = true
        await this.tKey.modules[SHARE_TRANSFER_MODULE_KEY].cancelRequestStatusCheck()
        // finish fn
      }
    },
  },
}
</script>
