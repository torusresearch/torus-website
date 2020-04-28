<template>
  <v-card class="private-key-container">
    <v-card-text class="py-6">
      <v-layout wrap>
        <v-flex xs12 :class="$vuetify.breakpoint.xsOnly ? '' : 'px-4'">
          <div class="font-weight-bold headline">{{ t('walletSettings.privateKey') }}</div>
        </v-flex>
        <v-flex xs12 mt-4 :class="$vuetify.breakpoint.xsOnly ? '' : 'px-4'">
          <v-list>
            <v-list-item :class="$vuetify.breakpoint.xsOnly ? 'px-0' : ''">
              <v-list-item-icon :class="$vuetify.breakpoint.xsOnly ? 'mr-1' : ''">
                <img :width="$vuetify.breakpoint.xsOnly ? '16' : ''" :src="require('../../../../public/img/icons/file-text-grey.svg')" />
              </v-list-item-icon>
              <v-list-item-content>
                <div class="subtitle-1 flex-grow-1 font-weight-bold">{{ t('walletSettings.downloadSoftCopy') }} (JSON)</div>
                <v-expand-transition>
                  <v-layout v-if="isShowGetPassword" wrap align-center justify-space-between class="mt-2 download-form-container">
                    <v-flex>
                      <v-form ref="downloadForm" v-model="downloadFormValid" lazy-validation @submit.prevent="downloadWallet">
                        <v-text-field
                          id="json-file-password"
                          v-model="keyStorePassword"
                          small
                          :rules="[rules.required]"
                          :type="showJsonPassword ? 'text' : 'password'"
                          :append-icon="showJsonPassword ? '$vuetify.icons.visibility_off' : '$vuetify.icons.visibility_on'"
                          @click:append="showJsonPassword = !showJsonPassword"
                        >
                          <template v-if="!$vuetify.breakpoint.xsOnly" v-slot:append-outer>
                            <v-btn
                              v-if="!walletJson"
                              id="json-file-confirm-btn"
                              class="white--text"
                              color="torusBrand1"
                              depressed
                              width="155px"
                              :disabled="!downloadFormValid || isLoadingDownloadWallet"
                              :loading="isLoadingDownloadWallet"
                              @click="downloadWallet"
                            >
                              {{ t('walletSettings.confirm') }}
                              <template v-slot:loader>
                                <span>
                                  Encrypting
                                  <v-progress-circular :indeterminate="true" size="24" value="0" width="4" color="text_2" />
                                </span>
                              </template>
                            </v-btn>
                            <v-btn
                              v-if="walletJson"
                              id="json-file-download-btn"
                              class="white--text"
                              depressed
                              color="torusBrand1"
                              :href="walletJson"
                              :download="name"
                            >
                              {{ t('walletSettings.downloadWallet') }}
                            </v-btn>
                          </template>
                        </v-text-field>
                      </v-form>
                    </v-flex>
                    <v-flex v-if="$vuetify.breakpoint.xsOnly" class="text-right">
                      <v-btn
                        v-if="!walletJson"
                        id="mobile-json-file-confirm-btn"
                        class="white--text"
                        color="torusBrand1"
                        :disabled="!downloadFormValid || isLoadingDownloadWallet"
                        width="155px"
                        :loading="isLoadingDownloadWallet"
                        @click="downloadWallet"
                      >
                        {{ t('walletSettings.confirm') }}
                        <template v-slot:loader>
                          <span>
                            Encrypting
                            <v-progress-circular :indeterminate="true" size="24" value="0" width="4" color="text_2" />
                          </span>
                        </template>
                      </v-btn>
                      <v-btn
                        v-if="walletJson"
                        id="mobile-json-file-download-btn"
                        class="white--text gmt-private-key-download"
                        color="torusBrand1"
                        :href="walletJson"
                        :download="name"
                      >
                        {{ t('walletSettings.downloadWallet') }}
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
                <div class="subtitle-1 flex-grow-1 font-weight-bold">{{ t('walletSettings.showPrivateKey') }}</div>
                <v-layout v-if="isShowPrivateKey" wrap align-center justify-space-between class="mt-2">
                  <v-flex :class="$vuetify.breakpoint.xsOnly ? 'xs12' : ''">
                    <div class="text_2--text" :class="$vuetify.breakpoint.xsOnly ? 'caption' : ''" style="word-break: break-all;">
                      {{ selectedKey }}
                    </div>
                  </v-flex>
                  <v-flex :class="$vuetify.breakpoint.xsOnly ? 'xs12 text-center' : ''">
                    <ShowToolTip :address="selectedKey">
                      <v-btn id="click-to-copy-btn" text small class="torusBrand1--text" :class="$vuetify.breakpoint.xsOnly ? 'mt-2' : 'caption'">
                        <img
                          :src="require('../../../../public/img/icons/copy-primary.svg')"
                          class="mr-1"
                          :width="$vuetify.breakpoint.xsOnly ? '12' : '20'"
                        />
                        {{ t('walletSettings.clickCopy') }}
                      </v-btn>
                    </ShowToolTip>
                  </v-flex>
                </v-layout>
              </v-list-item-content>
              <v-list-item-icon :class="$vuetify.breakpoint.xsOnly ? 'ma-1' : ''">
                <v-btn id="show-private-key-btn gmt-private-key-show" icon small @click="isShowPrivateKey = !isShowPrivateKey">
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
        <v-btn id="close-btn" large text @click="onClose">{{ t('walletSettings.close') }}</v-btn>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
import * as ethUtil from 'ethereumjs-util'
import Wallet from 'ethereumjs-wallet'
import { mapState } from 'vuex'

import ShowToolTip from '../../helpers/ShowToolTip'
// eslint-disable-next-line import/no-webpack-loader-syntax
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
      downloadFormValid: true,
      rules: {
        required: (value) => !!value || 'Required.',
      },
    }
  },
  computed: {
    ...mapState(['selectedAddress', 'wallet']),
    selectedKey() {
      return this.wallet[this.selectedAddress]
    },
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
          const finishedWallet = this.createWallet(this.keyStorePassword)
          this.exportKeyStoreFile(finishedWallet)
          this.isLoadingDownloadWallet = false
        } else {
          const worker = new WalletWorker()
          worker.postMessage({ type: 'createWallet', data: [this.keyStorePassword, this.selectedKey] })
          worker.addEventListener('message', (ev) => {
            const finishedWallet = ev.data
            this.exportKeyStoreFile(finishedWallet)
            this.isLoadingDownloadWallet = false
          })
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
    createBlob(mime, string_) {
      const string = typeof string_ === 'object' ? JSON.stringify(string_) : string_
      if (string === null) return ''
      const blob = new Blob([string], {
        type: mime,
      })
      return window.URL.createObjectURL(blob)
    },
  },
}
</script>
