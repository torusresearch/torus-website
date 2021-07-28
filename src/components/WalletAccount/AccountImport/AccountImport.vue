<template>
  <v-card class="account-import">
    <v-container>
      <v-layout wrap my-4>
        <v-flex xs12 :class="$vuetify.breakpoint.xsOnly ? 'px-1' : 'px-4'">
          <div class="font-weight-bold headline">{{ t('accountMenu.importAccount') }}</div>
        </v-flex>
        <v-flex xs12 :class="$vuetify.breakpoint.xsOnly ? 'px-1' : 'px-4'">
          <v-flex xs12 mt-4>
            <div class="text-subtitle-2 mb-2">{{ t('accountMenu.selectImportType') }}</div>
            <v-select
              v-model="selectedType"
              outlined
              append-icon="$vuetify.icons.select"
              :items="options"
              item-text="name"
              item-value="value"
              @change="canShowError = false"
            ></v-select>
          </v-flex>
        </v-flex>
        <template v-if="selectedType === 'private'">
          <v-flex xs12>
            <v-form
              ref="privateKeyForm"
              v-model="privateKeyFormValid"
              lazy-validation
              aria-autocomplete="off"
              autocomplete="off"
              @submit.prevent="importViaPrivateKey"
            >
              <v-layout wrap>
                <v-flex xs12 :class="$vuetify.breakpoint.xsOnly ? 'px-1' : 'px-4'">
                  <div class="text-subtitle-2 mb-2">{{ t('accountMenu.inputPrivateKey') }}:</div>
                  <v-text-field
                    v-model="privateKey"
                    class="private-key"
                    outlined
                    :type="showPrivateKey ? 'text' : 'password'"
                    :rules="[rules.required]"
                    :name="randomName"
                    :label="t('accountMenu.privateKey')"
                    single-line
                    @input="canShowError = false"
                  >
                    <template #append>
                      <v-btn icon aria-label="Show/Hide Private Key" @click="togglePrivShow">
                        <v-icon class="text_3--text">{{ showPrivateKey ? '$vuetify.icons.visibility_off' : '$vuetify.icons.visibility_on' }}</v-icon>
                      </v-btn>
                    </template>
                  </v-text-field>
                </v-flex>
                <v-flex v-show="canShowError" xs12 :class="$vuetify.breakpoint.xsOnly ? 'px-1' : 'px-4'">
                  <span class="red--text">{{ error }}</span>
                </v-flex>
                <v-flex xs12 class="text-right" :class="$vuetify.breakpoint.xsOnly ? 'px-1' : 'px-4'">
                  <v-spacer></v-spacer>
                  <v-btn text @click="onClose">
                    {{ t('accountMenu.back') }}
                  </v-btn>
                  <v-btn
                    id="import-account-private"
                    depressed
                    color="torusBrand1 ml-2 gmt-import-account"
                    :loading="isLoadingPrivate"
                    :disabled="!privateKeyFormValid || isLoadingPrivate"
                    class="px-8 white--text"
                    type="submit"
                  >
                    {{ t('accountMenu.import') }}
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-form>
          </v-flex>
        </template>
        <template v-if="selectedType === 'keystore'">
          <v-flex xs12>
            <v-form ref="jsonFileForm" v-model="jsonFileFormValid" lazy-validation @submit.prevent="importViaKeyStoreFile">
              <v-layout wrap>
                <v-flex xs12 mb-2 :class="$vuetify.breakpoint.xsOnly ? 'px-1' : 'px-4'">
                  <v-layout wrap align-center justify-space-between>
                    <v-flex grow>
                      <span class="mr-1">{{ t('accountMenu.uploadJsonLabel') }}</span>
                      <HelpTooltip :title="t('accountMenu.uploadJsonTitle')" :description="t('accountMenu.uploadJsonDesc')"></HelpTooltip>
                    </v-flex>
                    <v-flex shrink>
                      <v-btn outlined class="upload-button" color="torusBrand1" @click.prevent="openFilePicker">
                        <v-icon left>$vuetify.icons.question</v-icon>
                        {{ t('accountMenu.upload') }}
                      </v-btn>
                      <input v-show="false" ref="keystoreUpload" multiple="false" type="file" @change="processFile" />
                    </v-flex>
                  </v-layout>
                  <div v-show="selectedFileName !== ''" class="text-right">{{ t('accountMenu.selectedFile') }}: {{ selectedFileName }}</div>
                </v-flex>
                <v-flex xs12 :class="$vuetify.breakpoint.xsOnly ? 'px-1' : 'px-4'">
                  <div class="text-subtitle-2 mb-2">{{ t('accountMenu.enterPassword') }}:</div>
                  <v-text-field
                    v-model="jsonPassword"
                    class="password-input"
                    outlined
                    name="password"
                    :rules="[rules.required]"
                    :type="showJsonPassword ? 'text' : 'password'"
                    :placeholder="t('accountMenu.password')"
                    autocomplete="current-password"
                    @click:append="toggleJsonPasswordShow"
                  >
                    <template #append>
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
                <v-flex xs12 class="text-right" :class="$vuetify.breakpoint.xsOnly ? 'px-1' : 'px-4'">
                  <v-spacer></v-spacer>
                  <v-btn text @click="onClose">
                    {{ t('accountMenu.back') }}
                  </v-btn>
                  <v-btn
                    id="import-account-keystore"
                    depressed
                    color="torusBrand1 ml-2"
                    :loading="isLoadingKeystore"
                    :disabled="!jsonFileFormValid || isLoadingKeystore"
                    class="px-8 white--text gmt-import-account"
                    type="submit"
                  >
                    {{ t('accountMenu.import') }}
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-form>
          </v-flex>
        </template>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
/* eslint-disable import/default */
/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable import/extensions */
import randomId from '@chaitanyapotti/random-id'
import { BroadcastChannel } from 'broadcast-channel'
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
        required: (value) => !!value || this.t('accountMenu.required'),
      },
    }
  },
  computed: {
    options() {
      return [
        {
          name: this.t('accountMenu.privateKey'),
          value: 'private',
        },
        {
          name: this.t('accountMenu.keystore'),
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
    importViaPrivateKey() {
      if (this.$refs.privateKeyForm.validate()) {
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
  },
}
</script>

<style lang="scss" scoped>
@import 'AccountImport.scss';
</style>
