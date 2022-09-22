<template>
  <v-card class="account-import">
    <v-container class="pa-7">
      <div>
        <div class="font-weight-bold headline">{{ $t('accountMenu.importAccount') }}</div>
        <div class="mt-4">
          <div class="text-subtitle-2 mb-2">{{ $t('accountMenu.selectImportType') }}</div>
          <v-select v-model="selectedType" variant="outlined" :items="options" item-title="name" item-value="value"></v-select>
        </div>
        <template v-if="selectedType === 'private'">
          <v-form
            ref="privateKeyForm"
            v-model="privateKeyFormValid"
            lazy-validation
            aria-autocomplete="off"
            autocomplete="off"
            @submit.prevent="importViaPrivateKey"
          >
            <div>
              <div class="text-subtitle-2 mb-2">{{ $t('accountMenu.inputPrivateKey') }}:</div>
              <v-text-field
                v-model="privateKey"
                class="private-key"
                variant="outlined"
                :type="showPrivateKey ? 'text' : 'password'"
                :rules="[rules.required]"
                :name="randomName"
                :label="$t('accountMenu.privateKey')"
                single-line
                :append-inner-icon="showPrivateKey ? '$visibility_off' : '$visibility_on'"
                @click:append-inner="togglePrivShow"
              ></v-text-field>
            </div>
            <div v-show="canShowError">
              <span class="text-error">{{ error }}</span>
            </div>
            <div class="text-right">
              <v-spacer></v-spacer>
              <v-btn variant="text" @click="onClose">
                {{ $t('accountMenu.back') }}
              </v-btn>
              <v-btn
                id="import-account-private"
                variant="flat"
                color="torusBrand1 ml-2 gmt-import-account"
                :loading="isLoadingPrivate"
                :disabled="privateKeyFormValid === false || isLoadingPrivate"
                class="px-8 white--text"
                type="submit"
              >
                {{ $t('accountMenu.import') }}
              </v-btn>
            </div>
          </v-form>
        </template>
        <template v-if="selectedType === 'keystore'">
          <v-form ref="jsonFileForm" v-model="jsonFileFormValid" lazy-validation @submit.prevent="importViaKeyStoreFile">
            <div class="mb-2">
              <div class="d-flex align-center justify-space-between">
                <div>
                  <span class="mr-1">{{ $t('accountMenu.uploadJsonLabel') }}</span>
                  <HelpTooltip :title="$t('accountMenu.uploadJsonTitle')" :description="$t('accountMenu.uploadJsonDesc')"></HelpTooltip>
                </div>
                <div>
                  <v-btn variant="outlined" class="upload-button" color="torusBrand1" @click.prevent="openFilePicker">
                    <v-icon left>$question</v-icon>
                    {{ $t('accountMenu.upload') }}
                  </v-btn>
                  <input v-show="false" ref="keystoreUpload" multiple="false" type="file" @change="processFile" />
                </div>
              </div>
              <div v-show="selectedFileName !== ''" class="text-right">{{ $t('accountMenu.selectedFile') }}: {{ selectedFileName }}</div>
            </div>
            <div>
              <div class="text-subtitle-2 mb-2">{{ $t('accountMenu.enterPassword') }}:</div>
              <v-text-field
                v-model="jsonPassword"
                class="password-input"
                variant="outlined"
                name="password"
                :rules="[rules.required]"
                :type="showJsonPassword ? 'text' : 'password'"
                :placeholder="$t('accountMenu.password')"
                autocomplete="current-password"
                :append-inner-icon="showJsonPassword ? '$visibility_off' : '$visibility_on'"
                @click:append-inner="toggleJsonPasswordShow"
              ></v-text-field>
            </div>
            <div v-show="canShowError">
              <span class="text-error">{{ error }}</span>
            </div>
            <div class="text-right">
              <v-spacer></v-spacer>
              <v-btn variant="text" @click="onClose">
                {{ $t('accountMenu.back') }}
              </v-btn>
              <v-btn
                id="import-account-keystore"
                variant="flat"
                color="torusBrand1 ml-2"
                :loading="isLoadingKeystore"
                :disabled="jsonFileFormValid === false || isLoadingKeystore"
                class="px-8 text-white gmt-import-account"
                type="submit"
              >
                {{ $t('accountMenu.import') }}
              </v-btn>
            </div>
          </v-form>
        </template>
      </div>
    </v-container>
  </v-card>
</template>

<script>
/* eslint-disable import/default */
/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable import/extensions */
import { BroadcastChannel } from '@toruslabs/broadcast-channel'
import { randomId } from '@toruslabs/openlogin-utils'
import { bufferToHex, stripHexPrefix } from 'ethereumjs-util'
import log from 'loglevel'
import WalletWorker from 'worker-loader!../../../utils/wallet.worker.js'

import { broadcastChannelOptions } from '../../../utils/utils'
import HelpTooltip from '../../helpers/HelpTooltip'

export default {
  components: {
    HelpTooltip,
  },
  data() {
    return {
      selectedType: 'private',
      privateKey: '',
      jsonPassword: '',
      privateKeyFormValid: true,
      jsonFileFormValid: true,
      keyStoreFileContents: '',
      error: '',
      canShowError: false,
      selectedFileName: '',
      showPrivateKey: false,
      showJsonPassword: false,
      isLoadingPrivate: false,
      isLoadingKeystore: false,
      rules: {
        required: (value) => !!value || this.$t('accountMenu.required'),
      },
    }
  },
  computed: {
    options() {
      return [
        {
          name: this.$t('accountMenu.privateKey'),
          value: 'private',
        },
        {
          name: this.$t('accountMenu.keystore'),
          value: 'keystore',
        },
      ]
    },
    randomName() {
      return `torus-${randomId()}`
    },
  },
  methods: {
    openFilePicker() {
      this.$refs.keystoreUpload.click()
    },
    async importViaPrivateKey() {
      const formValid = await this.$refs.privateKeyForm.validate()
      if (!formValid.valid) return
      this.isLoadingPrivate = true

      this.$store
        .dispatch('importAccount', { keyData: [this.privateKey], strategy: 'Private Key' })
        .then((privKey) => {
          this.onClose()
          this.privateKey = ''
          this.showPrivateKey = false
          this.isLoadingPrivate = false
          this.informClients(privKey)
          this.$refs.privateKeyForm.resetValidation()
        })
        .catch((error) => {
          this.setErrorState(error)
        })
    },
    informClients(privKey) {
      const urlInstance = this.$route.query.instanceId
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
    async importViaKeyStoreFile() {
      const formValid = await this.$refs.jsonFileForm.validate()
      if (!formValid.valid) return
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
            this.keyStoreFileContents = ''
            this.jsonPassword = ''
            this.showJsonPassword = false
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
              this.keyStoreFileContents = ''
              this.jsonPassword = ''
              this.showJsonPassword = false
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
    },
    setErrorState(error) {
      this.error = error && error.message && error.message.includes('wrong passphrase') ? this.$t('accountMenu.incorrectPassword') : error
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
        fileReader.readAsText(file, 'utf8')
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
  },
}
</script>

<style lang="scss" scoped>
@import 'AccountImport.scss';
</style>
