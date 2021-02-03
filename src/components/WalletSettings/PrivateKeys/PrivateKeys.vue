<template>
  <v-card class="private-key-container">
    <v-card-text class="py-6">
      <v-layout wrap>
        <v-flex xs12 :class="$vuetify.breakpoint.xsOnly ? '' : 'px-4'">
          <div class="font-weight-bold headline">{{ t('walletSettings.privateKey') }}</div>
        </v-flex>
        <v-flex xs12 mt-4 :class="$vuetify.breakpoint.xsOnly ? '' : 'px-4'">
          <v-list>
            <!-- Download JSON -->
            <v-list-item :class="$vuetify.breakpoint.xsOnly ? 'px-0' : ''">
              <v-list-item-icon :class="$vuetify.breakpoint.xsOnly ? 'mr-1' : ''">
                <v-icon size="26" class="text_3--text" :style="{ marginRight: '10px' }" v-text="'$vuetify.icons.json'" />
              </v-list-item-icon>
              <v-list-item-content>
                <div class="text-subtitle-1 flex-grow-1 font-weight-bold">{{ t('walletSettings.downloadSoftCopy') }} (JSON)</div>
                <v-expand-transition>
                  <v-layout v-if="isShowGetPassword" wrap align-center justify-space-between class="mt-2 download-form-container">
                    <v-flex>
                      <v-form ref="downloadForm" v-model="downloadFormValid" lazy-validation @submit.prevent="downloadWallet">
                        <v-text-field
                          id="json-file-password"
                          v-model="keyStorePassword"
                          small
                          :rules="[rules.required]"
                          autocomplete="new-password"
                          :type="showJsonPassword ? 'text' : 'password'"
                          :placeholder="t('walletSettings.enterPassword')"
                        >
                          <template #append>
                            <v-btn icon aria-label="Show/Hide JSON Password" @click="showJsonPassword = !showJsonPassword">
                              <v-icon class="text_3--text">
                                {{ showJsonPassword ? '$vuetify.icons.visibility_off' : '$vuetify.icons.visibility_on' }}
                              </v-icon>
                            </v-btn>
                          </template>
                          <template v-if="!$vuetify.breakpoint.xsOnly" #append-outer>
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
                              <template #loader>
                                <span>
                                  {{ t('tkeySettings.encrypting') }}
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
                        <template #loader>
                          <span>
                            {{ t('tkeySettings.encrypting') }}
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
              <v-list-item-icon :class="$vuetify.breakpoint.xsOnly ? 'my-3 mx-1' : ''">
                <v-btn id="show-download-form-btn" aria-label="Show/Hide Download JSON form" icon small @click="isShowGetPassword = true">
                  <v-icon size="18" class="torusBrand1--text">$vuetify.icons.download</v-icon>
                </v-btn>
              </v-list-item-icon>
            </v-list-item>

            <v-divider></v-divider>
            <!-- Show Private Key -->
            <v-list-item :class="$vuetify.breakpoint.xsOnly ? 'px-0' : ''">
              <v-list-item-icon :class="$vuetify.breakpoint.xsOnly ? 'mr-1' : ''">
                <v-icon size="26" class="text_3--text" :style="{ marginRight: '10px' }">
                  {{ isSeedPhrase ? '$vuetify.icons.tkey_seed_phrase' : '$vuetify.icons.key' }}
                </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <div class="text-subtitle-1 flex-grow-1 font-weight-bold">
                  {{ isSeedPhrase ? t('tkeySettings.tkeySeedPhrase.showSeedPhrase') : t('walletSettings.showPrivateKey') }}
                </div>
                <v-layout v-if="isShowPrivateKey" wrap align-center justify-space-between class="mt-2">
                  <v-flex :class="$vuetify.breakpoint.xsOnly ? 'xs12' : ''">
                    <div class="text_2--text" :class="$vuetify.breakpoint.xsOnly ? 'caption' : ''" style="word-break: break-all">
                      {{ selectedKey }}
                    </div>
                  </v-flex>
                  <v-flex :class="$vuetify.breakpoint.xsOnly ? 'xs12 text-center' : ''">
                    <ShowToolTip :address="selectedKey">
                      <v-btn id="click-to-copy-btn" text small class="torusBrand1--text" :class="$vuetify.breakpoint.xsOnly ? 'mt-2' : 'caption'">
                        <v-icon small class="mr-1">$vuetify.icons.copy</v-icon>
                        <span>{{ t('walletSettings.clickCopy') }}</span>
                      </v-btn>
                    </ShowToolTip>
                  </v-flex>
                </v-layout>
              </v-list-item-content>
              <v-list-item-icon :class="$vuetify.breakpoint.xsOnly ? 'my-3 mx-1' : ''">
                <v-btn
                  id="show-private-key-btn gmt-private-key-show"
                  class="torusBrand1--text"
                  icon
                  small
                  aria-label="Show/Hide Private Key"
                  @click="isShowPrivateKey = !isShowPrivateKey"
                >
                  <v-icon>{{ `$vuetify.icons.${isShowPrivateKey ? 'visibility_off' : 'visibility_on'}` }}</v-icon>
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
/* eslint-disable import/default */
/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable import/extensions */
import { stripHexPrefix } from 'ethereumjs-util'
import Wallet from 'ethereumjs-wallet'
import log from 'loglevel'
import { mapState } from 'vuex'
import WalletWorker from 'worker-loader!../../../utils/wallet.worker.js'

import { ACCOUNT_TYPE } from '../../../utils/enums'
import ShowToolTip from '../../helpers/ShowToolTip'

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
        required: (value) => !!value || this.t('walletSettings.required'),
      },
    }
  },
  computed: {
    ...mapState(['selectedAddress', 'wallet']),
    selectedKey() {
      return this.isSeedPhrase ? this.wallet[this.selectedAddress]?.seedPhrase : this.wallet[this.selectedAddress]?.privateKey
    },
    isSeedPhrase() {
      return this.wallet[this.selectedAddress]?.accountType === ACCOUNT_TYPE.TKEY_SEED_PHRASE
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
    async downloadWallet() {
      if (this.$refs.downloadForm.validate()) {
        this.isLoadingDownloadWallet = true

        if (!window.Worker) {
          const finishedWallet = await this.createWallet(this.keyStorePassword)
          this.exportKeyStoreFile(finishedWallet)
          this.isLoadingDownloadWallet = false
        } else {
          const worker = new WalletWorker()
          worker.addEventListener('message', (ev) => {
            const finishedWallet = ev.data
            this.exportKeyStoreFile(finishedWallet)
            this.isLoadingDownloadWallet = false
          })
          worker.addEventListener('error', (error) => {
            log.error(error)
            this.isLoadingDownloadWallet = false
          })
          // log.info(this.keyStorePassword, this.selectedKey)
          worker.postMessage({ type: 'createWallet', data: [this.keyStorePassword, this.selectedKey] })
        }
      }
    },
    exportKeyStoreFile(_wallet) {
      this.walletJson = this.createBlob('mime', _wallet.walletJson)
      this.name = _wallet.name.toString()
    },
    async createWallet(password) {
      const createdWallet = {}
      const wallet = this.generateWallet(this.selectedKey)
      createdWallet.walletJson = await wallet.toV3(password)
      createdWallet.name = wallet.getV3Filename()
      return createdWallet
    },
    generateWallet(privateKey) {
      const stripped = stripHexPrefix(privateKey)
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
