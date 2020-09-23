<template>
  <v-layout class="account-import" wrap :class="[isModal ? 'py-10 px-5' : '']">
    <v-flex xs12 :class="!isModal ? 'px-0 mb-4' : $vuetify.breakpoint.xsOnly ? 'px-1' : 'px-4'">
      <div :class="[isModal ? 'font-weight-bold headline' : 'body-2 torusFont1--text text-capitalize px-1']">
        {{ t('accountMenu.importAccount') }}
      </div>
    </v-flex>
    <v-flex xs12 :class="!isModal ? 'px-0 mb-2' : $vuetify.breakpoint.xsOnly ? 'px-1' : 'px-4'">
      <v-flex xs12>
        <span v-if="isModal" class="text-subtitle-2">{{ t('accountMenu.selectImportType') }}</span>
        <v-select
          v-model="selectedType"
          outlined
          append-icon="$vuetify.icons.select"
          :items="options"
          item-text="name"
          item-value="value"
          :hide-details="!isModal"
          @change="canShowError = false"
        ></v-select>
      </v-flex>
    </v-flex>
    <template v-if="selectedType === IMPORT_OPTION_PRIVATE">
      <v-flex xs12>
        <v-form ref="privateKeyForm" v-model="privateKeyFormValid" lazy-validation @submit.prevent="">
          <v-layout wrap>
            <v-flex xs12 :class="!isModal ? 'px-0' : $vuetify.breakpoint.xsOnly ? 'px-1' : 'px-4'">
              <span v-if="isModal" class="text-subtitle-2">{{ t('accountMenu.inputPrivateKey') }}:</span>
              <v-text-field
                v-model="privateKey"
                class="private-key"
                outlined
                :type="showPrivateKey ? 'text' : 'password'"
                :rules="[rules.required]"
                name="private-key"
                :label="t('accountMenu.privateKey')"
                single-line
                @input="canShowError = false"
              >
                <template v-slot:append>
                  <v-btn icon aria-label="Show/Hide Private Key" @click="togglePrivShow">
                    <v-icon class="text_3--text">{{ showPrivateKey ? '$vuetify.icons.visibility_off' : '$vuetify.icons.visibility_on' }}</v-icon>
                  </v-btn>
                </template>
              </v-text-field>
            </v-flex>
            <v-flex v-show="canShowError" xs12 :class="$vuetify.breakpoint.xsOnly ? 'px-1' : 'px-4'">
              <span class="red--text">{{ error }}</span>
            </v-flex>
          </v-layout>
        </v-form>
      </v-flex>
    </template>
    <template v-if="selectedType === IMPORT_OPTION_KEYSTORE">
      <v-flex xs12>
        <v-form ref="jsonFileForm" v-model="jsonFileFormValid" lazy-validation @submit.prevent="">
          <v-layout wrap>
            <v-flex xs12 mb-2 :class="!isModal ? 'px-0' : $vuetify.breakpoint.xsOnly ? 'px-1' : 'px-4'">
              <v-layout wrap align-center justify-space-between>
                <v-flex grow>
                  <span class="mr-1" :class="{ 'body-2': !isModal }">{{ t('accountMenu.uploadJsonLabel') }}</span>
                  <HelpTooltip :title="t('accountMenu.uploadJsonTitle')" :description="t('accountMenu.uploadJsonDesc')"></HelpTooltip>
                </v-flex>
                <v-flex shrink>
                  <v-btn outlined class="upload-button" color="torusBrand1" @click.prevent="$refs.keystoreUpload.click">
                    <v-icon left>$vuetify.icons.question</v-icon>
                    {{ t('accountMenu.upload') }}
                  </v-btn>
                  <input v-show="false" ref="keystoreUpload" multiple="false" type="file" @change="processFile" />
                </v-flex>
              </v-layout>
              <div v-show="selectedFileName !== ''" class="text-right">{{ t('accountMenu.selectedFile') }}: {{ selectedFileName }}</div>
            </v-flex>
            <v-flex xs12 :class="!isModal ? 'px-0' : $vuetify.breakpoint.xsOnly ? 'px-1' : 'px-4'">
              <span v-if="isModal" class="text-subtitle-2">{{ t('accountMenu.enterPassword') }}:</span>
              <v-text-field
                v-model="jsonPassword"
                class="password-input"
                outlined
                name="password"
                :rules="[rules.required]"
                :type="showJsonPassword ? 'text' : 'password'"
                :placeholder="t('accountMenu.password')"
                @click:append="toggleJsonPasswordShow"
              >
                <template v-slot:append>
                  <v-btn icon aria-label="Show/Hide JSON Password" @click="toggleJsonPasswordShow">
                    <v-icon class="text_3--text">
                      {{ showJsonPassword ? '$vuetify.icons.visibility_off' : '$vuetify.icons.visibility_on' }}
                    </v-icon>
                  </v-btn>
                </template>
              </v-text-field>
            </v-flex>
            <v-flex v-show="canShowError" xs12 :class="$vuetify.breakpoint.xsOnly ? 'px-1' : 'px-4'">
              <span class="red--text">{{ error }}</span>
            </v-flex>
          </v-layout>
        </v-form>
      </v-flex>
    </template>
    <template v-if="selectedType === IMPORT_OPTION_SEEDPHRASE">
      <v-flex xs12>
        <v-form ref="seedPhraseForm" v-model="seedPhraseFormValid" lazy-validation @submit.prevent="">
          <v-layout wrap>
            <v-flex xs12 :class="!isModal ? 'px-0' : $vuetify.breakpoint.xsOnly ? 'px-1' : 'px-4'">
              <span v-if="isModal" class="text-subtitle-2">{{ t('accountMenu.inputSeedPhrase') }}:</span>
              <v-textarea v-model="seedPhrase" hide-details height="100" outlined :placeholder="t('accountMenu.inputSeedPhraseHere')"></v-textarea>
            </v-flex>
            <v-flex xs12 class="mt-2" :class="!isModal ? 'px-0' : $vuetify.breakpoint.xsOnly ? 'px-1' : 'px-4'">
              <v-checkbox
                v-model="importSeedPermanently"
                class="mt-0 pt-0"
                :on-icon="`$vuetify.icon.checkbox${$vuetify.theme.dark ? '_dark' : ''}_checked`"
                :off-icon="`$vuetify.icon.checkbox${$vuetify.theme.dark ? '_dark' : ''}_unchecked`"
                hide-details
              >
                <template v-slot:label>
                  <span class="body-2 text_2--text">{{ t('tkeySettings.saveImportedAccount') }}</span>
                </template>
              </v-checkbox>
            </v-flex>
          </v-layout>
        </v-form>
      </v-flex>
    </template>
    <v-flex
      xs12
      class="text-right"
      :class="[!isModal ? 'px-0' : $vuetify.breakpoint.xsOnly ? 'px-1' : 'px-4', selectedType === IMPORT_OPTION_SEEDPHRASE ? 'mt-5' : 'mt-0']"
    >
      <v-spacer></v-spacer>
      <v-btn v-if="isModal" text @click="onClose">
        {{ t('accountMenu.back') }}
      </v-btn>
      <v-btn
        :id="`import-account-${selectedType}`"
        :large="!isModal"
        :depressed="isModal"
        :class="importBtnClass"
        :color="isModal ? 'torusBrand1' : $store.state.whiteLabel.isActive ? 'torusBrand1' : ''"
        :loading="isBtnLoading"
        :disabled="isBtnDisabled || isBtnLoading"
        min-width="150"
        @click.prevent="onImport"
      >
        {{ t('accountMenu.import') }}
      </v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
/* eslint-disable import/default */
/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable import/extensions */
import { BroadcastChannel } from 'broadcast-channel'
import { bufferToHex, stripHexPrefix } from 'ethereumjs-util'
import log from 'loglevel'
import WalletWorker from 'worker-loader!../../../utils/wallet.worker.js'

import { IMPORT_OPTION_KEYSTORE, IMPORT_OPTION_PRIVATE, IMPORT_OPTION_SEEDPHRASE } from '../../../utils/enums'
import { broadcastChannelOptions } from '../../../utils/utils'
import HelpTooltip from '../../helpers/HelpTooltip'

export default {
  components: {
    HelpTooltip,
  },
  props: {
    isModal: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectedType: IMPORT_OPTION_PRIVATE,
      privateKey: '',
      jsonPassword: '',
      seedPhrase: '',
      privateKeyFormValid: true,
      jsonFileFormValid: true,
      seedPhraseFormValid: true,
      keyStoreFileContents: '',
      error: '',
      canShowError: false,
      selectedFileName: '',
      showPrivateKey: false,
      showJsonPassword: false,
      isLoadingPrivate: false,
      isLoadingKeystore: false,
      isLoadingSeedPhrase: false,
      rules: {
        required: (value) => !!value || this.t('accountMenu.required'),
      },
      IMPORT_OPTION_PRIVATE,
      IMPORT_OPTION_KEYSTORE,
      IMPORT_OPTION_SEEDPHRASE,
      importSeedPermanently: false,
    }
  },
  computed: {
    options() {
      return [
        {
          name: this.t('accountMenu.privateKey'),
          value: IMPORT_OPTION_PRIVATE,
        },
        {
          name: this.t('accountMenu.keystore'),
          value: IMPORT_OPTION_KEYSTORE,
        },
        {
          name: this.t('accountMenu.seedPhrase'),
          value: IMPORT_OPTION_SEEDPHRASE,
        },
      ]
    },
    importBtnClass() {
      return this.isModal
        ? 'px-8 white--text ml-2 gmt-import-account'
        : ['torus-btn1', this.$store.state.whiteLabel.isActive ? 'white--text' : 'torusBrand1--text']
    },
    isBtnLoading() {
      if (this.selectedType === IMPORT_OPTION_PRIVATE) {
        return this.isLoadingPrivate
      }
      if (this.selectedType === IMPORT_OPTION_KEYSTORE) {
        return this.isLoadingKeystore
      }
      if (this.selectedType === IMPORT_OPTION_SEEDPHRASE) {
        return this.isLoadingSeedPhrase
      }
      return false
    },
    isBtnDisabled() {
      if (this.selectedType === IMPORT_OPTION_PRIVATE) {
        return !this.privateKeyFormValid
      }
      if (this.selectedType === IMPORT_OPTION_KEYSTORE) {
        return !this.jsonFileFormValid
      }
      if (this.selectedType === IMPORT_OPTION_SEEDPHRASE) {
        return !this.seedPhraseFormValid
      }
      return true
    },
  },
  methods: {
    importViaPrivateKey() {
      if (this.$refs.privateKeyForm.validate()) {
        this.isLoadingPrivate = true

        this.$store
          .dispatch('importAccount', { keyData: [this.privateKey], strategy: 'Private Key' })
          .then((privKey) => {
            this.onClose()
            this.isLoadingPrivate = false
            this.informClients(privKey)
            this.$refs.privateKeyForm.resetValidation()
          })
          .catch((error) => {
            this.setErrorState(error)
          })
      }
    },
    informClients(privKey) {
      const urlInstance = new URLSearchParams(window.location.search).get('instanceId')
      if (urlInstance && urlInstance !== '') {
        const accountImportChannel = new BroadcastChannel(`account_import_channel_${urlInstance}`, broadcastChannelOptions)
        accountImportChannel.postMessage({
          data: {
            name: 'imported_account',
            payload: { privKey },
          },
        })
      }
    },
    importViaKeyStoreFile() {
      if (this.$refs.jsonFileForm.validate()) {
        this.isLoadingKeystore = true
        let keyData
        try {
          keyData = JSON.parse(this.keyStoreFileContents)
        } catch (error) {
          log.error(error)
          this.setErrorState(new Error('Unable to parse keystore file'))
          return
        }
        if (!window.Worker) {
          this.$store
            .dispatch('importAccount', { keyData: [keyData, this.jsonPassword], strategy: 'JSON File' })
            .then((privKey) => {
              this.onClose()
              this.isLoadingKeystore = false
              this.informClients(privKey)
              this.$refs.jsonFileForm.resetValidation()
            })
            .catch((error) => {
              this.setErrorState(error)
            })
        } else {
          const worker = new WalletWorker()
          worker.addEventListener('message', (event) => {
            const { privateKey: bufferPrivateKey } = event.data
            const privKey = stripHexPrefix(bufferToHex(bufferPrivateKey))
            this.$store
              .dispatch('finishImportAccount', { privKey })
              .then((privateKey) => {
                this.onClose()
                this.isLoadingKeystore = false
                this.informClients(privateKey)
                this.$refs.jsonFileForm.resetValidation()
              })
              .catch((error) => {
                this.setErrorState(error)
                this.isLoadingKeystore = false
              })
          })
          worker.addEventListener('error', (error) => {
            this.setErrorState(error)
            this.isLoadingKeystore = false
          })
          worker.postMessage({ type: 'unlockWallet', data: [keyData, this.jsonPassword] })
        }
      }
    },
    importViaSeedPhrase() {
      if (this.$refs.seedPhraseForm.validate()) {
        this.isLoadingSeedPhrase = true
        // eslint-disable-next-line no-console
        console.log('seedPhrase', this.seedPhrase)
      }
    },
    setErrorState(error) {
      this.error = error && error.message && error.message.includes('wrong passphrase') ? this.t('accountMenu.incorrectPassword') : error
      this.canShowError = true
      log.error(error)
      this.isLoadingKeystore = false
      this.isLoadingPrivate = false
    },
    processFile(event) {
      try {
        const file = event.target.files[0]
        this.selectedFileName = file.name
        const fileReader = new FileReader()
        fileReader.addEventListener(
          'load',
          function readFile(_) {
            return function readFileContent(ev) {
              this.keyStoreFileContents = ev.target.result
            }.bind(this)
          }.bind(this)(this.$refs.keyStoreUpload)
        )
        fileReader.readAsText(file, 'utf-8')
      } catch (error) {
        log.error(error)
        this.setErrorState(error)
      }
    },
    togglePrivShow(event) {
      event.preventDefault()
      this.showPrivateKey = !this.showPrivateKey
    },
    toggleJsonPasswordShow(event) {
      event.preventDefault()
      this.showJsonPassword = !this.showJsonPassword
    },
    onClose() {
      this.$emit('onClose')
    },
    onImport() {
      if (this.selectedType === IMPORT_OPTION_PRIVATE) {
        this.importViaPrivateKey()
      }
      if (this.selectedType === IMPORT_OPTION_KEYSTORE) {
        this.importViaKeyStoreFile()
      }
      if (this.selectedType === IMPORT_OPTION_SEEDPHRASE) {
        this.importViaSeedPhrase()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'AccountImport.scss';
</style>
