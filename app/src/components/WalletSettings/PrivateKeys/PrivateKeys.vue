<template>
  <v-card class="private-key-container">
    <v-card-text class="text_1--text py-6">
      <v-layout wrap>
        <v-flex xs12 :class="$vuetify.breakpoint.xsOnly ? '' : 'px-4'">
          <div class="font-weight-bold headline">Private Key</div>
        </v-flex>
        <v-flex xs12 mt-4 :class="$vuetify.breakpoint.xsOnly ? '' : 'px-4'">
          <v-list>
            <v-list-item :class="$vuetify.breakpoint.xsOnly ? 'px-0' : ''">
              <v-list-item-icon :class="$vuetify.breakpoint.xsOnly ? 'mr-1' : ''">
                <img :width="$vuetify.breakpoint.xsOnly ? '16' : ''" :src="require('../../../../public/img/icons/file-text-grey.svg')" />
              </v-list-item-icon>
              <v-list-item-content>
                <div class="subtitle-1 flex-grow-1 font-weight-bold">Download soft copy (JSON)</div>
                <v-expand-transition>
                  <v-layout wrap align-center justify-space-between v-if="isShowGetPassword" class="mt-2 download-form-container">
                    <v-flex>
                      <v-form ref="downloadForm" @submit.prevent="downloadWallet" v-model="downloadFormValid" lazy-validation>
                        <v-text-field
                          id="json-file-password"
                          small
                          :rules="[rules.required]"
                          v-model="keyStorePassword"
                          :type="showJsonPassword ? 'text' : 'password'"
                          @click:append="showJsonPassword = !showJsonPassword"
                          :append-icon="showJsonPassword ? '$vuetify.icons.visibility_off' : '$vuetify.icons.visibility_on'"
                        >
                          <template v-slot:append-outer v-if="!$vuetify.breakpoint.xsOnly">
                            <v-btn
                              id="json-file-confirm-btn"
                              color="primary"
                              depressed
                              :disabled="!downloadFormValid || isLoadingDownloadWallet"
                              v-if="!walletJson"
                              :loading="isLoadingDownloadWallet"
                              @click="downloadWallet"
                            >
                              Confirm
                            </v-btn>
                            <v-btn id="json-file-download-btn" depressed color="primary" v-if="walletJson" :href="walletJson" :download="name">
                              Download wallet
                            </v-btn>
                          </template>
                        </v-text-field>
                      </v-form>
                    </v-flex>
                    <v-flex v-if="$vuetify.breakpoint.xsOnly" class="text-right">
                      <v-btn
                        id="mobile-json-file-confirm-btn"
                        color="primary"
                        :disabled="!downloadFormValid || isLoadingDownloadWallet"
                        v-if="!walletJson"
                        :loading="isLoadingDownloadWallet"
                        @click="downloadWallet"
                      >
                        Confirm
                      </v-btn>
                      <v-btn id="mobile-json-file-download-btn" color="primary" v-if="walletJson" :href="walletJson" :download="name">
                        Download wallet
                      </v-btn>
                    </v-flex>
                  </v-layout>
                </v-expand-transition>
              </v-list-item-content>
              <v-list-item-icon :class="$vuetify.breakpoint.xsOnly ? 'ma-1' : ''">
                <v-btn id="show-download-form-btn" icon small @click="isShowGetPassword = true">
                  <img :width="$vuetify.breakpoint.xsOnly ? '16' : ''" :src="require('../../../../public/img/icons/download-primary.svg')" />
                </v-btn>
              </v-list-item-icon>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item :class="$vuetify.breakpoint.xsOnly ? 'px-0' : ''">
              <v-list-item-icon :class="$vuetify.breakpoint.xsOnly ? 'mr-1' : ''">
                <img :width="$vuetify.breakpoint.xsOnly ? '16' : ''" :src="require(`../../../../public/img/icons/key.svg`)" />
              </v-list-item-icon>
              <v-list-item-content>
                <div class="subtitle-1 flex-grow-1 font-weight-bold">Show Private Key</div>
                <v-expand-transition>
                  <v-layout wrap align-center justify-space-between v-if="isShowPrivateKey" class="mt-2">
                    <v-flex :class="$vuetify.breakpoint.xsOnly ? 'xs12' : ''">
                      <div class="text_2--text" :class="$vuetify.breakpoint.xsOnly ? 'caption' : ''" style="word-break: break-all">
                        {{ selectedKey }}
                      </div>
                    </v-flex>
                    <v-flex :class="$vuetify.breakpoint.xsOnly ? 'xs12 text-center' : ''">
                      <show-tool-tip :address="selectedKey">
                        <v-btn id="click-to-copy-btn" text small class="primary--text" :class="$vuetify.breakpoint.xsOnly ? 'mt-2' : 'caption'">
                          <img
                            :src="require('../../../../public/img/icons/copy-primary.svg')"
                            class="mr-1"
                            :width="$vuetify.breakpoint.xsOnly ? '12' : '20'"
                          />
                          Click to copy
                        </v-btn>
                      </show-tool-tip>
                    </v-flex>
                  </v-layout>
                </v-expand-transition>
              </v-list-item-content>
              <v-list-item-icon :class="$vuetify.breakpoint.xsOnly ? 'ma-1' : ''">
                <v-btn id="show-private-key-btn" icon small @click="isShowPrivateKey = !isShowPrivateKey">
                  <img
                    :width="$vuetify.breakpoint.xsOnly ? '20' : ''"
                    :src="require(`../../../../public/img/icons/eye${isShowPrivateKey ? '-off' : ''}-primary.svg`)"
                  />
                </v-btn>
              </v-list-item-icon>
            </v-list-item>
          </v-list>
        </v-flex>
      </v-layout>
      <v-layout mt-4 pr-4>
        <v-spacer></v-spacer>
        <v-btn id="close-btn" large text @click="onClose">Close</v-btn>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
import ShowToolTip from '../../helpers/ShowToolTip'
const Wallet = require('ethereumjs-wallet')
const ethUtil = require('ethereumjs-util')
const WalletWorker = require('worker-loader!../../../utils/wallet.worker.js')

export default {
  components: { ShowToolTip },
  data() {
    return {
      isShowPrivateKey: false,
      isShowGetPassword: false,
      showJsonPassword: false,
      keyStorePassword: '',
      walletJson: '',
      name: '',
      isLoadingDownloadWallet: false,
      downloadFormValid: false,
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
    }
  },
  methods: {
    onClose() {
      // Reset data
      this.isShowPrivateKey = false
      this.isShowGetPassword = false
      this.showJsonPassword = false
      this.keyStorePassword = ''
      this.walletJson = ''
      this.name = ''
      this.$emit('onClose')
    },
    downloadWallet() {
      if (this.$refs.downloadForm.validate()) {
        this.isLoadingDownloadWallet = true

        if (!window.Worker) {
          const _wallet = this.createWallet(this.keyStorePassword)
          this.exportKeyStoreFile(_wallet)
          this.isLoadingDownloadWallet = false
        } else {
          const worker = new WalletWorker()
          worker.postMessage({ type: 'createWallet', data: [this.keyStorePassword, this.selectedKey] })
          worker.onmessage = e => {
            const _wallet = e.data
            this.exportKeyStoreFile(_wallet)
            this.isLoadingDownloadWallet = false
          }
        }
      }
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
    }
  }
}
</script>
