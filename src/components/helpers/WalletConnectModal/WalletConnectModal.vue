<template>
  <div>
    <v-btn
      v-if="walletConnectConnected && !isEmbed"
      class="wallet-connect-btn wallet-connect-btn--success"
      small
      aria-label="Wallet Connect"
      :title="t('walletConnect.disconnect')"
      @click="disconnect"
    >
      <img class="mr-1" height="20" width="20" :src="connectedAppIcon" :alt="`${connectedAppName} Logo`" />
      {{ t('walletConnect.connected') }}
      <v-icon class="ml-4" size="18">$vuetify.icons.disconnect</v-icon>
    </v-btn>
    <v-btn
      v-else-if="!isEmbed"
      class="wallet-connect-btn"
      small
      aria-label="Wallet Connect"
      :title="t('walletConnect.useWalletConnect')"
      @click="wcDialog = true"
    >
      <img class="mr-1" height="20" width="20" src="https://images.web3auth.io/login-wallet-connect.svg" alt="Wallet Connect Logo" />
      {{ t('walletConnect.useWalletConnect') }}
    </v-btn>
    <v-dialog :value="showDialog" width="420" persistent @click:outside="closeDialog">
      <v-card>
        <v-layout wrap>
          <v-flex class="card-header text-center" xs12 pb-6 pt-8 px-6>
            <img
              class="mb-4"
              :width="$vuetify.breakpoint.xsOnly ? 180 : 200"
              src="../../../assets/images/wallet-connect-dapps.png"
              alt="Wallet Connect Dapps"
            />
            <div class="display-1 text_2--text">{{ headerText }}</div>
            <v-btn class="close-btn" icon aria-label="Close Connect WC" title="Close Connect WC" @click="closeDialog">
              <v-icon>$vuetify.icons.close</v-icon>
            </v-btn>
          </v-flex>

          <v-flex v-if="walletConnectConnected" class="xs12 px-8 px-sm-12 mb-11 text-center">
            <div class="mb-10">
              <img class="mb-6" :src="require(`../../../assets/images/status-success.svg`)" width="48" height="48" alt="Success" />
              <div class="body-2 text_2--text">
                {{ wcMessage ? t('walletConnect.youAllSet') : t('walletConnect.keepWalletOpen', [connectedAppName]) }}
              </div>
              <v-btn v-if="isEmbed" class="mt-4" aria-label="Disconnect" color="error" :title="t('walletConnect.disconnect')" @click="disconnect">
                {{ t('walletConnect.disconnect') }}
                <v-icon class="ml-4" size="18">$vuetify.icons.disconnect</v-icon>
              </v-btn>
            </div>
            <div>
              <a
                class="text-decoration-none body-2 torusBrand1--text font-weight-medium"
                :href="connectedAppUrl"
                target="_blank"
                rel="noreferrer noopener"
              >
                {{ t('walletConnect.takeMeToDapp', [connectedAppName]) }}
              </a>
            </div>
          </v-flex>
          <v-flex v-else class="xs12 px-8 px-sm-12 mb-11">
            <div class="mb-6 body-2 font-weight-medium">
              <div class="text_3--text">
                <span class="text_1--text font-weight-bold">{{ t('walletConnect.step', [1]) }}:</span>
                {{ t('walletConnect.step1Message') }}
              </div>
              <div class="text_3--text">
                <span class="text_1--text font-weight-bold">{{ t('walletConnect.step', [2]) }}</span>
                {{ t('walletConnect.step2Message') }}
              </div>
              <div class="text_3--text">
                <span class="text_1--text font-weight-bold">{{ t('walletConnect.step', [3]) }}</span>
                {{ t('walletConnect.step3Message') }}
              </div>
              <div class="text_3--text">
                <span class="text_1--text font-weight-bold">{{ t('walletConnect.step', [4]) }}</span>
                {{ t('walletConnect.step4Message') }}
              </div>
            </div>
            <v-form ref="walletConnectForm" @submit.prevent="submitWalletConnect">
              <div class="mb-4">
                <v-text-field
                  v-model="wcCopyPasteLink"
                  class="qr-field pr-0 caption"
                  hide-details
                  :placeholder="t('walletConnect.qRInputPlaceholder')"
                  outlined
                  dense
                  height="40"
                >
                  <template v-if="hasStreamApiSupport" #append>
                    <v-btn
                      depressed
                      color="torusBrand1"
                      :disabled="showQrScanner"
                      :loading="showQrScanner"
                      height="40"
                      text
                      class="body-2"
                      @click="openScanner"
                    >
                      <v-icon class="mr-1" small>$vuetify.icons.scan</v-icon>
                      {{ t('walletConnect.qrScan') }}
                    </v-btn>
                  </template>
                </v-text-field>
                <div v-if="wcErrorMsg" class="caption mt-1 mb-2 text-right error--text">{{ t(wcErrorMsg) }}</div>
              </div>
              <div>
                <v-btn
                  class="px-8 white--text"
                  :loading="wcConnecting"
                  :disabled="wcConnecting"
                  block
                  large
                  depressed
                  color="torusBrand1"
                  type="submit"
                >
                  <template #loader>
                    <v-progress-circular class="mr-2" size="20" :width="2" color="text-2" indeterminate></v-progress-circular>
                    <span>{{ t('walletConnect.connecting') }}</span>
                  </template>
                  {{ t('walletConnect.connect') }}
                </v-btn>
              </div>
            </v-form>
          </v-flex>
        </v-layout>
      </v-card>
      <v-dialog v-model="showQrScanner" :eager="true" :width="qrLoading ? 0 : 600" @click:outside="closeQRScanner">
        <div v-if="showQrScanner" class="qr-scan-container">
          <QrcodeStream :camera="camera" :style="camera === 'off' && { display: 'none' }" @decode="onDecodeQr" @init="onInit" />
          <v-btn class="close-btn" icon aria-label="Close QR Scanner" title="Close QR Scanner" @click="closeQRScanner">
            <v-icon>$vuetify.icons.close</v-icon>
          </v-btn>
        </div>
      </v-dialog>
    </v-dialog>
  </div>
</template>

<script>
import log from 'loglevel'
import { QrcodeStream } from 'vue-qrcode-reader'
import { mapActions, mapState } from 'vuex'

export default {
  components: { QrcodeStream },
  props: {
    wcEmbedDialog: {
      type: Boolean,
      default: false,
    },
    isEmbed: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      wcDialog: false,
      wcCopyPasteLink: '',
      wcConnecting: false,
      wcErrorMsg: '',
      wcMessage: '',
      connectedAppUrl: '',
      connectedAppName: '',
      connectedAppIcon: '',
      // QR
      camera: 'off',
      showQrScanner: false,
      qrLoading: true,
      hasStreamApiSupport: true,
    }
  },
  computed: {
    ...mapState(['wcConnectorSession']),
    walletConnectConnected() {
      return !!(this.wcConnectorSession && (this.wcConnectorSession.connected || this.wcConnectorSession.sessionData))
    },
    showDialog() {
      if (this.wcMessage) return true
      if (this.isEmbed) return this.wcEmbedDialog
      return this.wcDialog
    },
    headerText() {
      if (this.wcMessage === 'request_approved') return this.t('walletConnect.requestApproved')
      if (this.isEmbed && this.walletConnectConnected) return this.t('walletConnect.youAreConnected')
      return this.walletConnectConnected ? this.t('walletConnect.successfulConnect') : this.t('walletConnect.connectWallet')
    },
  },
  watch: {
    wcConnectorSession(value, oldValue) {
      if (value.message) {
        this.wcMessage = value.message
        if (this.isEmbed) {
          this.toggleWidgetVisibility(true)
        }
      } else {
        if (oldValue.message !== '' && oldValue.message !== undefined) {
          this.wcDialog = false

          if (this.isEmbed) {
            this.toggleWidgetVisibility(false)
          }
        }
        this.wcMessage = ''
      }

      if (value.sessionData) {
        this.setConnectedStates()
      } else {
        this.wcCopyPasteLink = ''
      }
    },
  },
  mounted() {
    if (this.walletConnectConnected) {
      this.setConnectedStates()
    }
  },
  methods: {
    ...mapActions([
      'disconnectWalletConnect',
      'getWalletConnectedAppInfo',
      'initWalletConnect',
      'sendWalletConnectResponse',
      'setErrorMessage',
      'toggleWidgetVisibility',
    ]),
    disconnect() {
      if (this.walletConnectConnected) {
        this.disconnectWalletConnect()
        this.wcConnecting = false
        this.wcCopyPasteLink = ''
      }
    },
    async setConnectedStates() {
      const { name, url, icon } = await this.getWalletConnectedAppInfo()

      this.wcConnecting = false
      this.connectedAppUrl = url || ''
      this.connectedAppName = name || ''
      this.connectedAppIcon = icon || ''
    },
    async submitWalletConnect() {
      try {
        this.wcConnecting = true
        this.wcErrorMsg = ''
        if (!this.wcCopyPasteLink.startsWith('wc:')) {
          throw new Error('accountMenu.wcErrorLinkInvalid')
        }

        await this.initWalletConnect({ uri: this.wcCopyPasteLink })

        setTimeout(() => {
          if (!this.walletConnectConnected) {
            this.handleError('accountMenu.wcErrorLinkExpired')
            this.wcConnecting = false
            this.wcCopyPasteLink = ''
          }
        }, 10_000)
      } catch (error) {
        log.error(error)
        this.wcConnecting = false
        this.wcCopyPasteLink = ''

        this.handleError('accountMenu.wcErrorLinkInvalid')
      }
    },
    closeDialog() {
      this.wcMessage = ''
      if (this.isEmbed) {
        this.sendWalletConnectResponse({ success: true, errorMessage: 'User closed Wallet Connect' })
      } else {
        this.wcDialog = false
      }
    },
    handleError(msg) {
      this.wcErrorMsg = msg
      setTimeout(() => {
        this.wcErrorMsg = ''
      }, 4000)
    },
    // QR Methods
    openScanner() {
      this.camera = 'auto'
      this.showQrScanner = true
      this.scannerOpened = true
    },
    async onInit(promise) {
      try {
        await promise
        this.qrLoading = false
      } catch (error) {
        log.error(error)
        let errorMessage = ''
        if (error.name === 'NotAllowedError') {
          errorMessage = 'accountMenu.qrErrorNeedCameraPermission'
          log.error('ERROR: you need to grant camera access permisson')
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'accountMenu.qrErrorNoCamera'
          log.error('ERROR: no camera on this device')
        } else if (error.name === 'NotSupportedError') {
          errorMessage = 'accountMenu.qrErrorSecureContextRequired'
          log.error('ERROR: secure context required (HTTPS, localhost)')
        } else if (error.name === 'NotReadableError') {
          errorMessage = 'accountMenu.qrErrorCameraAlreadyInUse'
          log.error('ERROR: is the camera already in use?')
        } else if (error.name === 'OverconstrainedError') {
          errorMessage = 'accountMenu.qrErrorInstalledCamerasAreNotSuitable'
          log.error('ERROR: installed cameras are not suitable')
        } else if (error.name === 'StreamApiNotSupportedError') {
          errorMessage = 'accountMenu.qrErrorStreamAPINotSupported'
          log.error('ERROR: Stream Api not supported')

          this.hasStreamApiSupport = false
        }
        if (errorMessage) this.handleError(errorMessage)
      }
    },
    async closeQRScanner() {
      this.camera = 'off'
      this.showQrScanner = false
    },
    async onDecodeQr(result) {
      try {
        await this.initWalletConnect({ uri: result })
      } catch (error) {
        log.error(error)
      } finally {
        this.camera = 'off'
        this.showQrScanner = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'WalletConnectModal.scss';
</style>
