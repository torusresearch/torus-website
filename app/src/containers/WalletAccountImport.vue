<template>
  <v-flex xs12 sm8 mb-3 mt-3>
    <div class="d-flex has-border">
      <v-layout align-center row wrap>
        <v-flex xs12 sm6 align-self-center>
          Select Import Type
        </v-flex>
        <v-flex xs12 sm6>
          <v-select
            single-line
            solo
            flat
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
      <div class="d-flex has-border">
        <v-form ref="privateKeyForm" v-model="privateKeyFormValid" lazy-validation>
          <v-layout row wrap>
            <v-flex xs12 sm6 align-self-center>
              Input Private Key
            </v-flex>
            <v-flex xs12 sm6>
              <v-text-field
                single-line
                solo
                flat
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

      <div class="has-border text-xs-right" mt-1>
        <v-btn class="btnStyle" @click.prevent="importViaPrivateKey" :loading="isLoadingPrivate" :disabled="!privateKeyFormValid || isLoadingPrivate"
          >Import</v-btn
        >
      </div>
    </template>

    <template v-if="selectedType === 'keystore'">
      <v-form ref="jsonFileForm" v-model="jsonFileFormValid" lazy-validation>
        <div class="d-flex has-border">
          <v-layout row>
            <v-flex xs6 align-self-center>
              Keystore
            </v-flex>
            <v-flex xs6>
              <v-btn @click.prevent="$refs.keystoreUpload.click()" class="btnStyle"><v-icon left>cloud_upload</v-icon>Upload</v-btn>
              <input v-show="false" ref="keystoreUpload" multiple="false" type="file" @change="processFile" />
            </v-flex>
          </v-layout>
        </div>
        <div class="text-xs-right" v-show="selectedFileName !== ''">Selected File: {{ selectedFileName }}</div>
        <div class="d-flex has-border">
          <v-layout row wrap>
            <v-flex xs12 sm6 align-self-center>
              Password
            </v-flex>
            <v-flex xs12 sm6>
              <v-text-field
                single-line
                solo
                flat
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

        <div class="has-border text-xs-right" mt-1>
          <v-btn class="btnStyle" :disabled="!jsonFileFormValid" @click.prevent="importViaKeyStoreFile">Import</v-btn>
        </div>
      </v-form>
    </template>
    <v-snackbar v-model="snackbar" color="error">
      {{ error }}
      <v-btn dark flat @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
  </v-flex>
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
            this.error = err
            this.snackbar = true
            console.log(err)
            this.isLoadingPrivate = false
          })
      }
    },
    importViaKeyStoreFile() {
      if (this.$refs.jsonFileForm.validate()) {
        if (!window.Worker) {
          this.$store
            .dispatch('importAccount', { keyData: [JSON.parse(this.keyStoreFileContents), this.jsonPassword], strategy: 'JSON File' })
            .then(() => {
              this.$router.push({ path: '/wallet/home' })
            })
            .catch(err => {
              this.error = err
              this.snackbar = true
              console.log(err)
            })
        } else {
          const worker = new WalletWorker()
          worker.postMessage({ type: 'unlockWallet', data: [JSON.parse(this.keyStoreFileContents), this.jsonPassword] })
          worker.onmessage = e => {
            const privKey = ethUtil.bufferToHex(Buffer.from(e.data._privKey))
            this.$store
              .dispatch('finishImportAccount', { privKey })
              .then(() => {
                this.$router.push({ path: '/wallet/home' })
              })
              .catch(err => {
                this.error = err
                this.snackbar = true
                console.log(err)
              })
          }
          worker.onerror = err => {
            this.error = err
            this.snackbar = true
            console.log(err)
          }
        }
      }
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
    }
  }
}
</script>

<style lang="scss" scoped>
.has-border {
  border-radius: 5px;
  padding: 0 15px;
  margin: 0 15px;
}

/deep/.v-text-field--solo .v-input__slot,
.v-text-field--outline .v-input__slot {
  min-height: auto !important;
  display: flex !important;
  align-items: flex-end !important;
  border-radius: 17px !important;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.16) !important;
  margin-top: 20px !important;
  margin-bottom: 0px !important;
}

/deep/.v-text-field.v-text-field--solo .v-input__control {
  min-height: auto !important;
}

.btnStyle {
  width: 141px;
  height: 41px;
  border: #fff;
  background-color: #fff !important;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  border-radius: 45px;
}
</style>
