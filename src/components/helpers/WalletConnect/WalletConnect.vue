<template>
  <div>
    <v-form ref="walletConnectForm" @submit.prevent="submitWalletConnect">
      <v-row :class="{ 'ma-0': showFromEmbed }">
        <v-menu
          :value="guideOn"
          :close-on-content-click="false"
          offset-y
          :bottom="$vuetify.breakpoint.smAndUp"
          :top="$vuetify.breakpoint.xsOnly"
          :nudge-top="$vuetify.breakpoint.xsOnly ? 10 : -10"
          @change="guideOn = !guideOn"
        >
          <template #activator="{ attrs }">
            <span class="torusBrand1--text caption" :class="showFromEmbed ? 'mb-2 ml-1' : 'ml-3 mt-3'" v-bind="attrs" @click="guideOn = !guideOn">
              {{ !guideOn ? t('walletConnect.viewGuide') : t('walletConnect.hideGuide') }}
            </span>
          </template>
          <v-card class="pb-4 pt-8 guide-menu">
            <v-btn class="close-btn" small icon @click="guideOn = !guideOn">
              <v-icon>$vuetify.icons.close</v-icon>
            </v-btn>
            <div style="max-width: 180px" class="guide-info mb-2 text-center mx-auto">
              <p>{{ t('walletConnect.guideInfo') }}</p>
            </div>
            <v-img :src="require(`../../../assets/images/walletGuide.svg`)" max-height="200" max-width="151" class="mx-auto"></v-img>
          </v-card>
        </v-menu>
      </v-row>
      <v-row
        :dense="$vuetify.breakpoint.xsOnly || showFromEmbed"
        :class="{ 'mt-4': $vuetify.breakpoint.xsOnly && !showFromEmbed, 'ma-0': showFromEmbed }"
      >
        <v-col cols="12" :sm="showFromEmbed ? 12 : 6">
          <v-text-field
            ref="walletConnectInput"
            name="walletConnectInput"
            :value="walletConnectDisplay"
            dense
            outlined
            hide-details
            height="44"
            :disabled="walletConnectConnected || wcConnecting"
            class="wallet-connect-input text-caption"
            :class="{ 'wallet-connect-input--connected': walletConnectConnected }"
            :placeholder="walletConnectConnected ? 'Connected' : ctaPlaceholder"
            @input="onWcInputChanged"
          >
            <template v-if="walletConnectConnected" #prepend-inner>
              <v-icon color="success">$vuetify.icons.status</v-icon>
            </template>
            <template #append>
              <v-btn
                v-if="walletConnectConnected"
                class="primary--text"
                text
                small
                tabindex="-3"
                :title="t('walletConnect.gotoApp')"
                @click="toggleWC"
              >
                <span v-if="!$vuetify.breakpoint.mdOnly" class="caption mr-1">{{ t('walletConnect.gotoApp') }}</span>
                <v-icon x-small>$vuetify.icons.link</v-icon>
              </v-btn>
              <v-btn
                v-else-if="hasStreamApiSupport"
                icon
                small
                title="Capture QR"
                aria-label="Capture QR"
                :loading="showQrScanner"
                @click="openScanner"
              >
                <v-icon x-small>$vuetify.icons.scan</v-icon>
              </v-btn>
            </template>
          </v-text-field>
          <div v-if="wcErrorMsg" class="caption mt-1 mb-2 text-right error--text">{{ t(wcErrorMsg) }}</div>
        </v-col>
        <v-col cols="12" :sm="showFromEmbed ? 12 : 6">
          <v-btn
            v-if="wcConnecting || walletConnectConnected"
            depressed
            large
            block
            :loading="wcConnecting"
            class="torus-btn1 torusBrand1--text gmt-billboard-cta"
            tabindex="-3"
            title="Disconnect"
            @click="disconnect"
          >
            {{ t('walletConnect.disconnect') }}
          </v-btn>
          <v-btn v-else depressed large block class="torus-btn1 torusBrand1--text gmt-billboard-cta" tabindex="-3" title="Connect" type="submit">
            {{ t('walletConnect.connect') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-dialog v-model="showQrScanner" :eager="true" :width="qrLoading ? 0 : 600" @click:outside="closeQRScanner">
      <div v-if="showQrScanner" class="qr-scan-container">
        <QrcodeStream :camera="camera" :style="camera === 'off' && { display: 'none' }" @decode="onDecodeQr" @init="onInit" />
        <v-btn class="close-btn" icon aria-label="Close QR Scanner" title="Close QR Scanner" @click="closeQRScanner">
          <v-icon>$vuetify.icons.close</v-icon>
        </v-btn>
      </div>
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
    showFromEmbed: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      camera: 'off',
      showQrScanner: false,
      qrLoading: true,
      hasStreamApiSupport: true,
      wcCopyPasteLink: '',
      wcConnecting: false,
      wcNoResponse: false,
      guideOn: false,
      ctaPlaceholder: 'wc:ff9e1dfa-68be-47ed...',
      wcErrorMsg: '',
    }
  },
  computed: {
    ...mapState(['wcConnectorSession']),
    walletConnectConnected() {
      return !!(this.wcConnectorSession && (this.wcConnectorSession.connected || this.wcConnectorSession.sessionData))
    },
    walletConnectDisplay() {
      if (this.wcConnecting) return `${this.t('walletConnect.connecting')}...`
      return this.walletConnectConnected ? this.t('walletConnect.connected') : this.wcCopyPasteLink
    },
  },
  watch: {
    wcConnectorSession(value) {
      if (value.connected) {
        this.wcConnecting = false
        this.$store.dispatch('setSuccessMessage', this.t('walletConnect.connectedToCustom').replace(/{wallet}/gi, 'Exchangaweb3'))
        if (value.uri) this.wcCopyPasteLink = value.uri
      } else if (value.sessionData) {
        this.wcConnecting = false
        const parsedData = JSON.parse(value.sessionData || '{}')
        const peerMetadata = parsedData[0]?.peer?.metadata
        const appName = peerMetadata?.name || peerMetadata?.url
        if (appName) this.wcCopyPasteLink = appName
      } else {
        this.wcCopyPasteLink = ''
      }
    },
  },
  methods: {
    ...mapActions([
      'updateSelectedAddress',
      'initWalletConnect',
      'disconnectWalletConnect',
      'sendWalletConnectResponse',
      'getWalletConnectedApp',
      'setErrorMessage',
    ]),
    async toggleWC() {
      if (this.walletConnectConnected) {
        const url = await this.getWalletConnectedApp()
        window.open(url)
      } else {
        // this.menu = !this.menu
        this.guideOn = !this.guideOn
      }
    },
    async onWcInputChanged(link) {
      this.wcCopyPasteLink = link
    },
    openScanner() {
      this.camera = 'auto'
      this.showQrScanner = true
      this.scannerOpened = true
    },
    disconnect() {
      if (this.walletConnectConnected) {
        this.disconnectWalletConnect()
        this.wcConnecting = false
        this.wcCopyPasteLink = ''
      }
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
    handleError(msg) {
      if (this.showFromEmbed) {
        this.wcErrorMsg = msg
        setTimeout(() => {
          this.wcErrorMsg = ''
        }, 3000)
      } else {
        this.setErrorMessage(msg)
        this.wcErrorMsg = ''
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'WalletConnect.scss';
</style>
