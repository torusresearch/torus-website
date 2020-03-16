<template>
  <v-card class="account-import">
    <v-container>
      <v-layout wrap my-4>
        <v-flex xs12 :class="$vuetify.breakpoint.xsOnly ? 'px-1' : 'px-4'">
          <div class="font-weight-bold headline">{{ t('accountMenu.importAccount') }}</div>
        </v-flex>
        <v-flex xs12 :class="$vuetify.breakpoint.xsOnly ? 'px-1' : 'px-4'">
          <v-flex xs12 mt-4>
            <span class="subtitle-2">{{ t('accountMenu.selectImportType') }}</span>
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
            <v-form ref="privateKeyForm" v-model="privateKeyFormValid" lazy-validation @submit.prevent="">
              <v-layout wrap>
                <v-flex xs12 :class="$vuetify.breakpoint.xsOnly ? 'px-1' : 'px-4'">
                  <span class="subtitle-2">{{ t('accountMenu.inputPrivateKey') }}:</span>
                  <v-text-field
                    v-model="privateKey"
                    outlined
                    :type="showPrivateKey ? 'text' : 'password'"
                    :rules="[rules.required]"
                    :append-icon="showPrivateKey ? '$vuetify.icons.visibility_off' : '$vuetify.icons.visibility_on'"
                    name="private-key"
                    :label="t('accountMenu.privateKey')"
                    single-line
                    @input="canShowError = false"
                    @click:append="togglePrivShow"
                  ></v-text-field>
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
                    color="primary"
                    depressed
                    :loading="isLoadingPrivate"
                    :disabled="!privateKeyFormValid || isLoadingPrivate"
                    @click.prevent="importViaPrivateKey"
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
            <v-form ref="jsonFileForm" v-model="jsonFileFormValid" lazy-validation @submit.prevent="">
              <v-layout wrap>
                <v-flex xs12 mb-2 :class="$vuetify.breakpoint.xsOnly ? 'px-1' : 'px-4'">
                  <v-layout wrap align-center justify-space-between>
                    <v-flex grow>
                      <span>{{ t('accountMenu.uploadJsonLabel') }}</span>
                      <HelpTooltip :title="t('accountMenu.uploadJsonTitle')" :description="t('accountMenu.uploadJsonDesc')"></HelpTooltip>
                    </v-flex>
                    <v-flex shrink>
                      <v-btn outlined class="upload-button" color="primary" @click.prevent="$refs.keystoreUpload.click">
                        <v-icon left>$vuetify.icons.question</v-icon>
                        {{ t('accountMenu.upload') }}
                      </v-btn>
                      <input v-show="false" ref="keystoreUpload" multiple="false" type="file" @change="processFile" />
                    </v-flex>
                  </v-layout>
                  <div v-show="selectedFileName !== ''" class="text-right">{{ t('accountMenu.selectedFile') }}: {{ selectedFileName }}</div>
                </v-flex>
                <v-flex xs12 :class="$vuetify.breakpoint.xsOnly ? 'px-1' : 'px-4'">
                  <span class="subtitle-2">{{ t('accountMenu.enterPassword') }}:</span>
                  <v-text-field
                    v-model="jsonPassword"
                    outlined
                    name="password"
                    :rules="[rules.required]"
                    :append-icon="showJsonPassword ? '$vuetify.icons.visibility_off' : '$vuetify.icons.visibility_on'"
                    :type="showJsonPassword ? 'text' : 'password'"
                    :placeholder="t('accountMenu.password')"
                    @click:append="toggleJsonPasswordShow"
                  ></v-text-field>
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
                    color="primary"
                    depressed
                    :loading="isLoadingKeystore"
                    :disabled="!jsonFileFormValid || isLoadingKeystore"
                    @click.prevent="importViaKeyStoreFile"
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
import { BroadcastChannel } from 'broadcast-channel'
import * as ethUtil from 'ethereumjs-util'
import log from 'loglevel'

import { broadcastChannelOptions } from '../../../utils/utils'
import HelpTooltip from '../../helpers/HelpTooltip'

// eslint-disable-next-line import/no-webpack-loader-syntax
const WalletWorker = require('worker-loader!../../../utils/wallet.worker.js')

export default {
  components: {
    HelpTooltip
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
        required: value => !!value || this.t('accountMenu.required')
      }
    }
  },
  computed: {
    options() {
      return [
        {
          name: this.t('accountMenu.privateKey'),
          value: 'private'
        },
        {
          name: this.t('accountMenu.keystore'),
          value: 'keystore'
        }
      ]
    }
  },
  methods: {
    importViaPrivateKey() {
      if (this.$refs.privateKeyForm.validate()) {
        this.isLoadingPrivate = true

        this.$store
          .dispatch('importAccount', { keyData: [this.privateKey], strategy: 'Private Key' })
          .then(privKey => {
            this.onClose()
            this.isLoadingPrivate = false
            this.informClients(privKey)
            this.$refs.privateKeyForm.resetValidation()
          })
          .catch(error => {
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
            payload: { privKey }
          }
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
            .then(privKey => {
              this.onClose()
              this.isLoadingKeystore = false
              this.informClients(privKey)
              this.$refs.jsonFileForm.resetValidation()
            })
            .catch(error => {
              this.setErrorState(error)
            })
        } else {
          const worker = new WalletWorker()
          worker.postMessage({ type: 'unlockWallet', data: [keyData, this.jsonPassword] })
          worker.addEventListener('message', event => {
            const { _privKey: stringPrivateKey } = event.data
            const privKey = ethUtil.stripHexPrefix(ethUtil.bufferToHex(Buffer.from(stringPrivateKey)))
            this.$store
              .dispatch('finishImportAccount', { privKey })
              .then(privateKey => {
                this.onClose()
                this.isLoadingKeystore = false
                this.informClients(privateKey)
                this.$refs.jsonFileForm.resetValidation()
              })
              .catch(error => {
                this.setErrorState(error)
              })
          })
          worker.addEventListener('error', error => {
            this.setErrorState(error)
          })
        }
      }
    },
    setErrorState(error) {
      log.info(error)
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'AccountImport.scss';
</style>
