<template>
  <v-card class="account-import">
    <v-container>
      <v-layout wrap my-4>
        <v-flex xs12 px-4>
          <div class="font-weight-bold headline">Import Account</div>
        </v-flex>
        <v-flex xs12 px-4>
          <v-flex xs12 mt-4>
            <span class="subtitle-2">Select you type:</span>
            <v-select
              outlined
              append-icon="$vuetify.icons.select"
              :items="options"
              item-text="name"
              item-value="value"
              v-model="selectedType"
            ></v-select>
          </v-flex>
        </v-flex>
        <template v-if="selectedType === 'private'">
          <v-flex xs12>
            <v-form ref="privateKeyForm" @submit.prevent="" v-model="privateKeyFormValid" lazy-validation>
              <v-layout wrap>
                <v-flex xs12 px-4>
                  <span class="subtitle-2">Input Private Key:</span>
                  <v-text-field
                    outlined
                    :type="showPrivateKey ? 'text' : 'password'"
                    :rules="[rules.required]"
                    :append-icon="showPrivateKey ? '$vuetify.icons.visibility_off' : '$vuetify.icons.visibility_on'"
                    name="private-key"
                    label="Private Key"
                    @click:append="togglePrivShow"
                    v-model="privateKey"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 px-4 class="text-right">
                  <v-spacer></v-spacer>
                  <v-btn text @click="onClose">
                    Back
                  </v-btn>
                  <v-btn
                    color="primary"
                    depressed
                    @click.prevent="importViaPrivateKey"
                    :loading="isLoadingPrivate"
                    :disabled="!privateKeyFormValid || isLoadingPrivate"
                  >
                    Import
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
                      Please upload your JSON File
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <v-icon small v-text="'$vuetify.icons.question'" v-on="on"></v-icon>
                        </template>
                        <span>
                          <div class="primary--text subtitle-2">JSON File</div>
                          <v-divider class="my-2"></v-divider>
                          <div class="body-2">
                            This is a type of file format that your stores information on your Private Key.
                          </div>
                        </span>
                      </v-tooltip>
                    </v-flex>
                    <v-flex shrink>
                      <v-btn outlined @click.prevent="$refs.keystoreUpload.click()" class="upload-button" color="primary">
                        <v-icon left>$vuetify.icons.question</v-icon>
                        Upload
                      </v-btn>
                      <input v-show="false" ref="keystoreUpload" multiple="false" type="file" @change="processFile" />
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex xs12 px-4>
                  <span class="subtitle-2">Enter your password:</span>
                  <v-text-field
                    outlined
                    name="password"
                    :rules="[rules.required]"
                    :append-icon="showJsonPassword ? '$vuetify.icons.visibility_off' : '$vuetify.icons.visibility_on'"
                    :type="showJsonPassword ? 'text' : 'password'"
                    placeholder="Password"
                    v-model="jsonPassword"
                    @click:append="toggleJsonPasswordShow"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12 px-4 class="text-right">
                  <v-spacer></v-spacer>
                  <v-btn text @click="onClose">
                    Back
                  </v-btn>
                  <v-btn
                    color="primary"
                    depressed
                    @click.prevent="importViaKeyStoreFile"
                    :loading="isLoadingKeystore"
                    :disabled="!jsonFileFormValid || isLoadingKeystore"
                  >
                    Import
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-form>
          </v-flex>
          <!-- <v-layout>
            <v-flex xs6 align-self-center>
              Keystore
            </v-flex>
            <v-flex xs6>
              <v-btn @click.prevent="$refs.keystoreUpload.click()" class="btnStyle">
                <v-icon left>cloud_upload</v-icon>
                Upload
              </v-btn>
              <input v-show="false" ref="keystoreUpload" multiple="false" type="file" @change="processFile" />
            </v-flex>
          </v-layout>
          <div class="text-right" v-show="selectedFileName !== ''">Selected File: {{ selectedFileName }}</div>
          <div class="flex-grow-1 has-border">
            <v-layout wrap>
              <v-flex xs12 sm6 align-self-center>
                Password
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                  single-line
                  solo
                  text
                  name="password"
                  :rules="[rules.required]"
                  :append-icon="showJsonPassword ? 'visibility' : 'visibility_off'"
                  :type="showJsonPassword ? 'text' : 'password'"
                  label="Enter a valid password"
                  v-model="jsonPassword"
                  @click:append="toggleJsonPasswordShow"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </div>

          <div class="has-border text-right" mt-1>
            <v-btn
              class="btnStyle"
              @click.prevent="importViaKeyStoreFile"
              :loading="isLoadingKeystore"
              :disabled="!jsonFileFormValid || isLoadingKeystore"
            >
              Import
            </v-btn>
          </div> -->
        </template>
      </v-layout>
    </v-container>
  </v-card>
  <!-- <v-flex xs12 sm8 mb-4 mt-4>
    <div class="flex-grow-1 has-border">
      <v-layout align-center wrap>
        <v-flex xs12 sm6 align-self-center>
          Select Import Type
        </v-flex>
        <v-flex xs12 sm6>
          <v-select
            single-line
            solo
            text
            :items="options"
            item-text="name"
            item-value="value"
            v-model="selectedType"
            label="Select Import Type"
          ></v-select>
        </v-flex>
      </v-layout>
    </div>

    <template v-if="selectedType === 'private'">
      <div class="flex-grow-1 has-border">
        <v-form ref="privateKeyForm" @submit.prevent="" v-model="privateKeyFormValid" lazy-validation>
          <v-layout wrap>
            <v-flex xs12 sm6 align-self-center>
              Input Private Key
            </v-flex>
            <v-flex xs12 sm6>
              <v-text-field
                single-line
                solo
                text
                :type="showPrivateKey ? 'text' : 'password'"
                :rules="[rules.required]"
                :append-icon="showPrivateKey ? 'visibility' : 'visibility_off'"
                name="private-key"
                label="Private Key"
                @click:append="togglePrivShow"
                v-model="privateKey"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-form>
      </div>

      <div class="has-border text-right" mt-1>
        <v-btn class="btnStyle" @click.prevent="importViaPrivateKey" :loading="isLoadingPrivate" :disabled="!privateKeyFormValid || isLoadingPrivate">
          Import
        </v-btn>
      </div>
    </template>

    <template v-if="selectedType === 'keystore'">
      <v-form ref="jsonFileForm" v-model="jsonFileFormValid" @submit.prevent="" lazy-validation>
        <div class="flex-grow-1 has-border">
          <v-layout>
            <v-flex xs6 align-self-center>
              Keystore
            </v-flex>
            <v-flex xs6>
              <v-btn @click.prevent="$refs.keystoreUpload.click()" class="btnStyle">
                <v-icon left>cloud_upload</v-icon>
                Upload
              </v-btn>
              <input v-show="false" ref="keystoreUpload" multiple="false" type="file" @change="processFile" />
            </v-flex>
          </v-layout>
        </div>
        <div class="text-right" v-show="selectedFileName !== ''">Selected File: {{ selectedFileName }}</div>
        <div class="flex-grow-1 has-border">
          <v-layout wrap>
            <v-flex xs12 sm6 align-self-center>
              Password
            </v-flex>
            <v-flex xs12 sm6>
              <v-text-field
                single-line
                solo
                text
                name="password"
                :rules="[rules.required]"
                :append-icon="showJsonPassword ? 'visibility' : 'visibility_off'"
                :type="showJsonPassword ? 'text' : 'password'"
                label="Enter a valid password"
                v-model="jsonPassword"
                @click:append="toggleJsonPasswordShow"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </div>

        <div class="has-border text-right" mt-1>
          <v-btn
            class="btnStyle"
            @click.prevent="importViaKeyStoreFile"
            :loading="isLoadingKeystore"
            :disabled="!jsonFileFormValid || isLoadingKeystore"
          >
            Import
          </v-btn>
        </div>
      </v-form>
    </template>
    <v-snackbar v-model="snackbar" color="error">
      {{ error }}
      <v-btn dark text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
  </v-flex>   -->
</template>

<script>
// eslint-disable-next-line import/no-webpack-loader-syntax
const WalletWorker = require('worker-loader!../utils/wallet.worker.js')
const ethUtil = require('ethereumjs-util')
export default {
  data() {
    return {
      selectedType: 'private',
      options: [
        {
          name: 'Private Key',
          value: 'private'
        },
        {
          name: 'Keystore',
          value: 'keystore'
        }
      ],
      privateKey: '',
      jsonPassword: '',
      privateKeyFormValid: true,
      jsonFileFormValid: true,
      keyStoreFileContents: '',
      error: '',
      selectedFileName: '',
      showPrivateKey: false,
      showJsonPassword: false,
      snackbar: false,
      isLoadingPrivate: false,
      isLoadingKeystore: false,
      rules: {
        required: value => !!value || 'Required.'
      }
    }
  },
  methods: {
    importViaPrivateKey() {
      if (this.$refs.privateKeyForm.validate()) {
        this.isLoadingPrivate = true

        this.$store
          .dispatch('importAccount', { keyData: [this.privateKey], strategy: 'Private Key' })
          .then(() => {
            this.$router.push({ path: '/wallet/home' })
            this.isLoadingPrivate = false
          })
          .catch(err => {
            this.setErrorState(err)
          })
      }
    },
    importViaKeyStoreFile() {
      if (this.$refs.jsonFileForm.validate()) {
        this.isLoadingKeystore = true

        if (!window.Worker) {
          this.$store
            .dispatch('importAccount', { keyData: [JSON.parse(this.keyStoreFileContents), this.jsonPassword], strategy: 'JSON File' })
            .then(() => {
              this.$router.push({ path: '/wallet/home' })
              this.isLoadingKeystore = false
            })
            .catch(err => {
              this.setErrorState(err)
            })
        } else {
          const worker = new WalletWorker()
          worker.postMessage({ type: 'unlockWallet', data: [JSON.parse(this.keyStoreFileContents), this.jsonPassword] })
          worker.onmessage = e => {
            const privKey = ethUtil.stripHexPrefix(ethUtil.bufferToHex(Buffer.from(e.data._privKey)))
            this.$store
              .dispatch('finishImportAccount', { privKey })
              .then(() => {
                this.$router.push({ path: '/wallet/home' })
                this.isLoadingKeystore = false
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
      this.error = err
      this.snackbar = true
      console.log(err)
      this.isLoadingKeystore = false
      this.isLoadingPrivate = false
    },
    processFile(event) {
      const file = event.target.files[0]
      this.selectedFileName = file.name
      const fileReader = new FileReader()
      fileReader.onload = function(jsonContent) {
        return function(e) {
          this.keyStoreFileContents = e.target.result
        }.bind(this)
      }.bind(this)(this.$refs.keyStoreUpload)
      fileReader.readAsText(file, 'utf-8')
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
@import '../scss/_card-tooltip.mixin';

.upload-button.v-btn {
  border-style: dashed;
}

.v-tooltip__content {
  @include cardTooltip();
}
</style>
