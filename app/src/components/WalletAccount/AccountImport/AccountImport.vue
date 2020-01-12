<template>
  <v-card class="account-import">
    <v-container>
      <v-layout wrap my-4>
        <v-flex xs12 px-4>
          <div class="font-weight-bold headline">{{ t('accountMenu.importAccount') }}</div>
        </v-flex>
        <v-flex xs12 px-4>
          <v-flex xs12 mt-4>
            <span class="subtitle-2">{{ t('accountMenu.selectImportType') }}:</span>
            <v-select
              outlined
              append-icon="$vuetify.icons.select"
              :items="options"
              item-text="name"
              item-value="value"
              @change="canShowError = false"
              v-model="selectedType"
            ></v-select>
          </v-flex>
        </v-flex>
        <template v-if="selectedType === 'private'">
          <v-flex xs12>
            <v-form ref="privateKeyForm" @submit.prevent="" v-model="privateKeyFormValid" lazy-validation>
              <v-layout wrap>
                <v-flex xs12 px-4>
                  <span class="subtitle-2">{{ t('accountMenu.inputPrivateKey') }}:</span>
                  <v-text-field
                    outlined
                    :type="showPrivateKey ? 'text' : 'password'"
                    :rules="[rules.required]"
                    :append-icon="showPrivateKey ? '$vuetify.icons.visibility_off' : '$vuetify.icons.visibility_on'"
                    name="private-key"
                    :label="t('accountMenu.privateKey')"
                    @input="canShowError = false"
                    @click:append="togglePrivShow"
                    v-model="privateKey"
                    single-line
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 px-4 v-show="canShowError">
                  <span class="red--text">{{ error }}</span>
                </v-flex>
                <v-flex xs12 px-4 class="text-right">
                  <v-spacer></v-spacer>
                  <v-btn text @click="onClose">
                    {{ t('accountMenu.back') }}
                  </v-btn>
                  <v-btn
                    color="primary"
                    depressed
                    @click.prevent="importViaPrivateKey"
                    :loading="isLoadingPrivate"
                    :disabled="!privateKeyFormValid || isLoadingPrivate"
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
            <v-form ref="jsonFileForm" v-model="jsonFileFormValid" @submit.prevent="" lazy-validation>
              <v-layout wrap>
                <v-flex xs12 px-4>
                  <v-layout align-center justify-space-between>
                    <v-flex grow>
                      {{ t('accountMenu.uploadJsonLabel') }}
                      <HelpTooltip :title="t('accountMenu.uploadJsonTitle')" :description="t('accountMenu.uploadJsonDesc')"></HelpTooltip>
                    </v-flex>
                    <v-flex shrink>
                      <v-btn outlined @click.prevent="$refs.keystoreUpload.click()" class="upload-button" color="primary">
                        <v-icon left>$vuetify.icons.question</v-icon>
                        {{ t('accountMenu.upload') }}
                      </v-btn>
                      <input v-show="false" ref="keystoreUpload" multiple="false" type="file" @change="processFile" />
                    </v-flex>
                  </v-layout>
                  <div class="text-right" v-show="selectedFileName !== ''">{{ t('accountMenu.selectedFile') }}: {{ selectedFileName }}</div>
                </v-flex>
                <v-flex xs12 px-4>
                  <span class="subtitle-2">{{ t('accountMenu.enterPassword') }}:</span>
                  <v-text-field
                    outlined
                    name="password"
                    :rules="[rules.required]"
                    :append-icon="showJsonPassword ? '$vuetify.icons.visibility_off' : '$vuetify.icons.visibility_on'"
                    :type="showJsonPassword ? 'text' : 'password'"
                    :placeholder="t('accountMenu.password')"
                    v-model="jsonPassword"
                    @click:append="toggleJsonPasswordShow"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 px-4 v-show="canShowError">
                  <span class="red--text">{{ error }}</span>
                </v-flex>
                <v-flex xs12 px-4 class="text-right">
                  <v-spacer></v-spacer>
                  <v-btn text @click="onClose">
                    {{ t('accountMenu.back') }}
                  </v-btn>
                  <v-btn
                    color="primary"
                    depressed
                    @click.prevent="importViaKeyStoreFile"
                    :loading="isLoadingKeystore"
                    :disabled="!jsonFileFormValid || isLoadingKeystore"
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
const WalletWorker = require('worker-loader!../../../utils/wallet.worker.js')
const ethUtil = require('ethereumjs-util')
const log = require('loglevel')
import HelpTooltip from '../../helpers/HelpTooltip'
import { broadcastChannelOptions } from '../../../utils/utils'

export default {
  components: {
    HelpTooltip
  },
  data() {
    return {
      selectedType: 'private',
      options: [
        {
          name: this.t('accountMenu.privateKey'),
          value: 'private'
        },
        {
          name: this.t('accountMenu.keystore'),
          value: 'keystore'
        }
      ],
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
          .catch(err => {
            this.setErrorState(err)
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
            .catch(err => {
              this.setErrorState(err)
            })
        } else {
          const worker = new WalletWorker()
          worker.postMessage({ type: 'unlockWallet', data: [keyData, this.jsonPassword] })
          worker.onmessage = e => {
            const privKey = ethUtil.stripHexPrefix(ethUtil.bufferToHex(Buffer.from(e.data._privKey)))
            this.$store
              .dispatch('finishImportAccount', { privKey })
              .then(privKey => {
                this.onClose()
                this.isLoadingKeystore = false
                this.informClients(privKey)
                this.$refs.jsonFileForm.resetValidation()
              })
              .catch(err => {
                this.setErrorState(err)
              })
          }
          worker.onerror = err => {
            this.setErrorState(err)
          }
        }
      }
    },
    setErrorState(err) {
      log.info(err)
      this.error = err && err.message && err.message.includes('wrong passphrase') ? this.t('accountMenu.incorrectPassword') : err
      this.canShowError = true
      log.error(err)
      this.isLoadingKeystore = false
      this.isLoadingPrivate = false
    },
    processFile(event) {
      try {
        const file = event.target.files[0]
        this.selectedFileName = file.name
        const fileReader = new FileReader()
        fileReader.onload = function(jsonContent) {
          return function(e) {
            this.keyStoreFileContents = e.target.result
          }.bind(this)
        }.bind(this)(this.$refs.keyStoreUpload)
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
