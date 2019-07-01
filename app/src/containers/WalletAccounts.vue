<template>
  <v-flex xs12 sm8 mt-3 mb-3>
    <div class="d-flex has-border">
      <v-select single-line solo flat :items="accounts" :value="selectedAddress" label="Selected Account" @change="onAccountChange"></v-select>
    </div>
    <div class="d-flex has-border">
      <span class="body-2">Public Address</span>
      <span class="text-xs-right">
        <show-tool-tip :address="selectedAddress">
          {{ slicedAddress }}
        </show-tool-tip>
      </span>
    </div>
    <div class="d-flex has-border">
      <span class="body-2">Private Key</span>
      <span class="text-xs-right">
        <show-tool-tip :address="selectedKey">
          {{ slicedKey }}
        </show-tool-tip>
      </span>
    </div>

    <div class="has-border py-0">
      <v-btn block small flat class="grey lighten-2 mb-0 font-weight-regular" @click="showPrivateKey = !showPrivateKey">
        {{ showPrivateKey ? 'Hide Private Key' : 'Show Private Key' }}
        <v-icon v-if="showPrivateKey" :color="$vuetify.theme.torus_reject">expand_less</v-icon>
        <v-icon v-else :color="$vuetify.theme.torus_reject">expand_more</v-icon>
      </v-btn>

      <div class="mt-0 mb-1 mx-0 py-1 grey lighten-3 text-xs-center break-word" v-if="showPrivateKey">
        <show-tool-tip :address="selectedKey">
          {{ selectedKey }}
        </show-tool-tip>
      </div>
    </div>

    <div class="has-border text-xs-right" mt-1>
      <v-btn class="btnStyle" @click="dialogJson = true">Download JSON</v-btn>
      <v-btn class="btnStyle" @click="downloadPdf">Download wallet</v-btn>
    </div>

    <v-dialog v-model="dialogJson" max-width="400px">
      <v-card class="grey lighten-3">
        <v-form ref="form" v-model="formValid" lazy-validation>
          <v-card-title>
            <div class="title">Download JSON</div>
          </v-card-title>
          <v-divider light></v-divider>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs12 align-self-center>
                Enter your password
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  :rules="[rules.required]"
                  v-model="keyStorePassword"
                  :append-icon="showJsonPassword ? 'visibility' : 'visibility_off'"
                  :type="showJsonPassword ? 'text' : 'password'"
                  @click:append="toggleJsonPasswordShow"
                  single-line
                  solo
                  flat
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-divider light></v-divider>
          <v-card-actions class="px-3">
            <v-spacer></v-spacer>
            <v-btn class="btnStyle" @click="dialogJson = false">Close</v-btn>
            <v-btn class="btnStyle" :disabled="!formValid" @click.prevent="downloadWallet">Confirm</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <!-- <a :href="walletJson" :class="[{ disable: !downloadable }]" :download="name">Download wallet</a> -->
  </v-flex>
</template>

<script>
import ShowToolTip from '../components/ShowToolTip.vue'
import { addressSlicer } from '../utils/utils'
const Wallet = require('ethereumjs-wallet')
const ethUtil = require('ethereumjs-util')
// eslint-disable-next-line import/no-webpack-loader-syntax
const WalletWorker = require('worker-loader!../utils/wallet.worker.js')

export default {
  name: 'walletAccounts',
  components: { ShowToolTip },
  data() {
    return {
      keyStorePassword: '',
      walletJson: '',
      name: '',
      downloadable: false,
      showPrivateKey: false,
      dialogJson: false,
      showJsonPassword: false,
      formValid: true,
      rules: {
        required: value => !!value || 'Required.'
      }
    }
  },
  computed: {
    selectedAddress() {
      return this.$store.state.selectedAddress
    },
    selectedKey() {
      return this.$store.state.wallet[this.selectedAddress]
    },
    slicedAddress() {
      return addressSlicer(this.selectedAddress)
    },
    slicedKey() {
      return addressSlicer(this.selectedKey)
    },
    accounts() {
      return Object.keys(this.$store.state.wallet)
    }
  },
  methods: {
    downloadWallet() {
      if (this.$refs.form.validate()) {
        if (!window.Worker) {
          const _wallet = this.createWallet(this.keyStorePassword)
          this.exportKeyStoreFile(_wallet)
        } else {
          const worker = new WalletWorker()
          worker.postMessage({ type: 'createWallet', data: [this.keyStorePassword, this.selectedKey] })
          worker.onmessage = e => {
            console.log(e.data)
            const _wallet = e.data
            this.exportKeyStoreFile(_wallet)
          }
        }
      }
    },
    onAccountChange(newAddress) {
      this.$store.dispatch('updateSelectedAddress', { selectedAddress: newAddress })
    },
    exportKeyStoreFile(_wallet) {
      this.walletJson = this.createBlob('mime', _wallet.walletJson)
      this.name = _wallet.name.toString()
    },
    createWallet(password) {
      const createdWallet = {}
      const wallet = this.generateWallet(this.selectedKey)
      createdWallet.walletJson = wallet.toV3(password)
      createdWallet.name = wallet.getV3Filename()
      return createdWallet
    },
    generateWallet(privateKey) {
      const stripped = ethUtil.stripHexPrefix(privateKey)
      const buffer = Buffer.from(stripped, 'hex')
      const wallet = Wallet.fromPrivateKey(buffer)
      return wallet
    },
    createBlob(mime, str) {
      const string = typeof str === 'object' ? JSON.stringify(str) : str
      if (string === null) return ''
      const blob = new Blob([string], {
        type: mime
      })
      return window.URL.createObjectURL(blob)
    },
    toggleJsonPasswordShow(event) {
      event.preventDefault()
      this.showJsonPassword = !this.showJsonPassword
    },
    downloadPdf() {}
  }
}
</script>

<style lang="scss" scoped>
.selected-account {
  cursor: pointer;
  padding: 5px 15px;
  border-radius: 10px;
  max-width: 120px;
  &:hover {
    background-color: var(--v-torus_reject_mild-base);
    opacity: 0.5;
    color: #fff;
  }
  &.active {
    background-color: var(--v-torus_active-base);
  }
}

.has-border {
  // border: 2px solid var(--v-torus_reject-base);
  border-radius: 5px;
  padding: 15px;
  margin: 15px;
}

.disable {
  background-color: var(--v-torus_svg_bcg-base);
  cursor: default;
  pointer-events: none;
}

.break-word {
  word-wrap: break-word;
}

/deep/.v-text-field--solo .v-input__slot,
.v-text-field--outline .v-input__slot {
  min-height: auto !important;
  display: flex !important;
  align-items: flex-end !important;
  border-radius: 17px !important;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.16) !important;
  margin-top: 5px !important;
  margin-bottom: 0px !important;
}

/deep/.v-text-field.v-text-field--solo .v-input__control {
  min-height: auto !important;
}

.btnStyle {
  height: 41px;
  border: #fff;
  background-color: #fff !important;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  border-radius: 45px;
}
</style>
