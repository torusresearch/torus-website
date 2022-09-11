<template>
  <v-card class="private-key-container">
    <v-card-text class="py-6">
      <v-row wrap>
        <v-col cols="12" :class="$vuetify.display.xs ? '' : 'px-4'">
          <div class="font-weight-bold headline">{{ $t('walletSettings.privateKey') }}</div>
        </v-col>
        <v-col cols="12" class="mt-4" :class="$vuetify.display.xs ? '' : 'px-4'">
          <v-list class="keys">
            <!-- Download JSON -->
            <v-list-item :class="$vuetify.display.xs ? 'px-0' : ''">
              <template #prepend>
                <div :class="$vuetify.display.xs ? 'mr-1' : ''">
                  <v-icon size="26" class="text-text_3" :style="{ marginRight: '10px' }">$json</v-icon>
                </div>
              </template>
              <div class="text-subtitle-1 flex-grow-1 font-weight-bold">{{ $t('walletSettings.downloadSoftCopy') }} (JSON)</div>
              <v-expand-transition>
                <v-row v-if="isShowGetPassword" wrap class="align-center justify-space-between mt-2 download-form-container">
                  <v-col>
                    <v-form ref="downloadForm" v-model="downloadFormValid" lazy-validation @submit.prevent="downloadWallet">
                      <v-text-field
                        id="json-file-password"
                        v-model="keyStorePassword"
                        size="small"
                        :rules="[rules.required, rules.password]"
                        autocomplete="new-password"
                        :type="showJsonPassword ? 'text' : 'password'"
                        :placeholder="$t('walletSettings.enterPassword')"
                      >
                        <template #append-inner>
                          <v-btn icon aria-label="Show/Hide JSON Password" @click="showJsonPassword = !showJsonPassword">
                            <v-icon class="text-text_3">
                              {{ showJsonPassword ? '$visibility_off' : '$visibility_on' }}
                            </v-icon>
                          </v-btn>
                        </template>
                        <template v-if="!$vuetify.display.xs" #append>
                          <v-btn
                            v-if="!walletJson"
                            id="json-file-confirm-btn"
                            class="text-white"
                            color="torusBrand1"
                            depressed
                            width="155px"
                            :disabled="!downloadFormValid || isLoadingDownloadWallet"
                            :loading="isLoadingDownloadWallet"
                            @click="downloadWallet"
                          >
                            {{ $t('walletSettings.confirm') }}
                            <template #loader>
                              <span>
                                {{ $t('tkeySettings.encrypting') }}
                                <v-progress-circular :indeterminate="true" size="24" value="0" width="4" color="text_2" />
                              </span>
                            </template>
                          </v-btn>
                          <v-btn
                            v-if="walletJson"
                            id="json-file-download-btn"
                            class="text-white"
                            depressed
                            color="torusBrand1"
                            :href="walletJson"
                            :download="name"
                          >
                            {{ $t('walletSettings.downloadWallet') }}
                          </v-btn>
                        </template>
                      </v-text-field>
                    </v-form>
                  </v-col>
                  <v-col v-if="$vuetify.display.xs" class="text-right">
                    <v-btn
                      v-if="!walletJson"
                      id="mobile-json-file-confirm-btn"
                      class="text-white"
                      color="torusBrand1"
                      :disabled="!downloadFormValid || isLoadingDownloadWallet"
                      width="155px"
                      :loading="isLoadingDownloadWallet"
                      @click="downloadWallet"
                    >
                      {{ $t('walletSettings.confirm') }}
                      <template #loader>
                        <span>
                          {{ $t('tkeySettings.encrypting') }}
                          <v-progress-circular :indeterminate="true" size="24" value="0" width="4" color="text_2" />
                        </span>
                      </template>
                    </v-btn>
                    <v-btn
                      v-if="walletJson"
                      id="mobile-json-file-download-btn"
                      class="text-white gmt-private-key-download"
                      color="torusBrand1"
                      :href="walletJson"
                      :download="name"
                    >
                      {{ $t('walletSettings.downloadWallet') }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-expand-transition>
              <template #append>
                <div :class="$vuetify.display.xs ? 'my-3 mx-1' : ''">
                  <v-btn id="show-download-form-btn" aria-label="Show/Hide Download JSON form" icon size="small" @click="isShowGetPassword = true">
                    <v-icon size="18" class="text-torusBrand1">$download</v-icon>
                  </v-btn>
                </div>
              </template>
            </v-list-item>

            <v-divider></v-divider>
            <!-- Show Private Key -->
            <v-list-item :class="$vuetify.display.xs ? 'px-0' : ''">
              <template #prepend>
                <div :class="$vuetify.display.xs ? 'mr-1' : ''">
                  <v-icon size="26" class="text-text_3" :style="{ marginRight: '10px' }">
                    {{ isSeedPhrase ? '$tkey_seed_phrase' : '$key' }}
                  </v-icon>
                </div>
              </template>
              <div class="text-subtitle-1 flex-grow-1 font-weight-bold">
                {{ isSeedPhrase ? $t('tkeySettings.tkeySeedPhrase.showSeedPhrase') : $t('walletSettings.showPrivateKey') }}
              </div>
              <v-row v-if="isShowPrivateKey" wrap class="mt-2 align-center justify-space-between">
                <v-col cols="12">
                  <div class="text-text_2" :class="$vuetify.display.xs ? 'caption' : ''" style="word-break: break-all">
                    {{ selectedKey }}
                  </div>
                </v-col>
                <v-col cols="12" :class="$vuetify.display.xs ? 'text-center' : ''">
                  <ShowToolTip :address="selectedKey">
                    <v-btn
                      id="click-to-copy-btn"
                      variant="text"
                      size="small"
                      class="text-torusBrand1"
                      :class="$vuetify.display.xs ? 'mt-2' : 'caption'"
                    >
                      <v-icon size="small" class="mr-1">$vuetify.icons.copy</v-icon>
                      <span>{{ $t('walletSettings.clickCopy') }}</span>
                    </v-btn>
                  </ShowToolTip>
                </v-col>
              </v-row>
              <template #append>
                <div :class="$vuetify.display.xs ? 'my-3 mx-1' : ''">
                  <v-btn
                    id="show-private-key-btn gmt-private-key-show"
                    class="text-torusBrand1"
                    icon
                    size="small"
                    aria-label="Show/Hide Private Key"
                    @click="isShowPrivateKey = !isShowPrivateKey"
                  >
                    <v-icon>{{ `$${isShowPrivateKey ? 'visibility_off' : 'visibility_on'}` }}</v-icon>
                  </v-btn>
                </div>
              </template>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
      <v-row class="mt-4 pr-4">
        <v-spacer></v-spacer>
        <v-btn id="close-btn" size="large" variant="text" @click="onClose">{{ $t('walletSettings.close') }}</v-btn>
      </v-row>
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
        password: (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,}$/.test(value) || this.t('walletSettings.errors-invalid-password'),
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

<style lang="scss" scoped>
@import 'PrivateKeys.scss';
</style>
