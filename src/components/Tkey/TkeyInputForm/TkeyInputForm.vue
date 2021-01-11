<template>
  <div class="tkey-input-form">
    <v-tabs-items v-model="tab" touchless>
      <v-tab-item>
        <TkeyInputView
          :security-questions="securityQuestions"
          :incorrect-password="incorrectPassword"
          :incorrect-share-mnemonic="incorrectShareMnemonic"
          :required-shares="settingsData && settingsData.keyDetails && settingsData.keyDetails.requiredShares"
          :all-device-shares="settingsData && settingsData.allDeviceShares"
          :verifier-name="verifierName"
          :share-mnemonic-arr="shareMnemonicArr"
          @setPasswordInput="enterPassword"
          @onShareMnemonicInput="inputShareMnemonic"
          @skipLogin="setInput"
        />
      </v-tab-item>
      <v-tab-item>
        <TkeyDeviceDetected :all-device-shares="settingsData && settingsData.allDeviceShares" @storeDevice="storeDevice" />
      </v-tab-item>
      <v-tab-item>
        <TkeySeedPhrase :adding-seed-phrase="addingSeedPhrase" @addSeedPhrase="createSeedPhrase" />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import log from 'loglevel'

import config from '../../../config'
import createTKeyInstance from '../../../handlers/Tkey/TkeyFactory'
import { calculateSettingsPageData, getAllPrivateKeys } from '../../../handlers/Tkey/TkeyUtils'
import torus from '../../../torus'
import {
  ACCOUNT_TYPE,
  SECURITY_QUESTIONS_MODULE_KEY,
  SEED_PHRASE_MODULE_KEY,
  SHARE_SERIALIZATION_MODULE_KEY,
  SHARE_TRANSFER_MODULE_KEY,
  WEB_STORAGE_MODULE_KEY,
} from '../../../utils/enums'
import TkeyDeviceDetected from '../TkeyDeviceDetected'
import TkeyInputView from '../TkeyInputView'
import TkeySeedPhrase from '../TkeySeedPhrase'

export default {
  name: 'TkeyInputForm',
  components: { TkeyInputView, TkeyDeviceDetected, TkeySeedPhrase },
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
    verifierName: {
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
      currentEncPubKeyX: '',
      incorrectShareMnemonic: false,
      shareMnemonicArr: [],
      requireSeedPhraseInput: false,
      addingSeedPhrase: false,
      tab: 0,
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
      log.info('creating tkey using json ', json)
      this.tKey = await createTKeyInstance(this.postboxKey, json, torus.web3.eth.currentProvider)
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
          const index = onDeviceShare.share.share.shareIndex.toString('hex')
          if (this.shareTransfer[index]) this.shareTransfer[index].finished = true
        }
        if (Object.keys(this.shareTransfer).length > 0) {
          // start share transfer listener
          this.listenForShareTransfer()
        }
      } else {
        await this.tryFinish()
      }
    },
    async inputShareMnemonic(shareMnemonic) {
      this.incorrectShareMnemonic = false
      try {
        const deserializedShare = await this.tKey.modules[SHARE_SERIALIZATION_MODULE_KEY].deserialize(shareMnemonic, 'mnemonic')
        await this.tKey.inputShare(deserializedShare)
        await this.tryFinish()
        const deserializedShareHex = deserializedShare.toString('hex')
        if (!this.shareMnemonicArr.includes(deserializedShareHex)) this.shareMnemonicArr.push(deserializedShareHex)
      } catch (error) {
        log.error(error)
        this.incorrectShareMnemonic = true
      }
    },
    async listenForShareTransfer() {
      try {
        log.info('listening for share transfer')
        await this.tKey.modules[SHARE_TRANSFER_MODULE_KEY].setShareTransferStore({})
        this.currentEncPubKeyX = await this.tKey.modules[SHARE_TRANSFER_MODULE_KEY].requestNewShare(
          window.navigator.userAgent,
          this.tKey.getCurrentShareIndexes()
        )
        const shareStore = await this.tKey.modules[SHARE_TRANSFER_MODULE_KEY].startRequestStatusCheck(this.currentEncPubKeyX, true)
        log.info(shareStore, 'received transferred Share')
        this.currentEncPubKeyX = ''
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
      } catch (error) {
        log.error(error)
        let timeleft = 5
        const downloadTimer = setInterval(() => {
          if (timeleft <= 0) {
            this.$emit('clearErrorMessage')
            clearInterval(downloadTimer)
            this.setInput({ rejected: true })
          } else {
            this.$emit('postErrorMessage', this.t('tkeyNew.verifyFail').replace('{verifier}', this.verifierName).replace('{countdown}', timeleft))
          }
          timeleft -= 1
        }, 1000)
      }
    },
    // async checkForPendingRequests() {
    // log.info(latestShareTransferStore, 'current requests')
    // if i find pending requests before requesting share, i should handle them
    // for (const request in latestShareTransferStore) {
    //   if (Object.prototype.hasOwnProperty.call(latestShareTransferStore, request)) {
    //     const { encShareInTransit, userAgent } = latestShareTransferStore[request]
    //     if (userAgent === window.navigator.userAgent) {
    //       if (encShareInTransit) {
    //         // request already approved
    //       }
    //     }
    //   }
    // }
    // },
    async cleanUpShareTransfer() {
      await this.tKey.modules[SHARE_TRANSFER_MODULE_KEY].cancelRequestStatusCheck()
      if (this.currentEncPubKeyX) await this.tKey.modules[SHARE_TRANSFER_MODULE_KEY].deleteShareTransferStore(this.currentEncPubKeyX)
    },
    async setInput(details) {
      const { rejected } = details
      if (rejected) {
        this.cleanUpShareTransfer()
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
        log.info('finishing up storing device')
        await this.setInput({ response: this.tKey })
      }

      // call trigger success
    },
    async tryFinish() {
      this.settingsData = await calculateSettingsPageData(this.tKey)
      const {
        keyDetails: { requiredShares },
      } = this.settingsData

      log.info(this.tKey, this.settingsData)

      if (requiredShares === 0) {
        const { privKey } = await this.tKey.reconstructKey()
        let allKeys = await getAllPrivateKeys(this.tKey, privKey)
        if (config.onlySeedPhraseAccounts && allKeys.length > 0) {
          // don't use the first key
          allKeys = allKeys.filter((x) => x.accountType !== ACCOUNT_TYPE.THRESHOLD)
        }

        if (this.tab === 0) this.tab = 1

        if (allKeys.length === 0) {
          this.tab = 2
          return
        }
        this.$emit('postSuccessMessage', this.t('tkeyNew.verifySuccess'))
        await this.cleanUpShareTransfer()
        // finish fn

        setTimeout(() => {
          this.$emit('clearSuccessMessage')
        }, 2000)
      }
    },
    async createSeedPhrase(seedPhrase) {
      this.addingSeedPhrase = true
      try {
        log.info('adding seed phrase', seedPhrase)
        await this.tKey.modules[SEED_PHRASE_MODULE_KEY].setSeedPhrase('HD Key Tree', seedPhrase || undefined)
        await this.tryFinish()
        await this.setInput({ response: this.tKey })
        this.addingSeedPhrase = false
        return
      } catch (error) {
        log.error(error)
      }
    },
  },
}
</script>
