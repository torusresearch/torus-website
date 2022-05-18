<template>
  <div>
    <v-dialog v-model="showQrScanner" :eager="true" :width="qrLoading ? 0 : 600" @click:outside="closeQRScanner">
      <div v-if="showQrScanner" class="qr-scan-container">
        <QrcodeStream :camera="camera" :style="camera === 'off' && { display: 'none' }" @decode="onDecodeQr" @init="onInit" />
        <v-btn class="close-btn" icon aria-label="Close QR Scanner" title="Close QR Scanner" @click="closeQRScanner">
          <v-icon>$vuetify.icons.close</v-icon>
        </v-btn>
      </div>
    </v-dialog>

    <!-- <v-btn
      v-if="hasStreamApiSupport && !isIframe && btnStyle === 'icon'"
      small
      class="wallet-connect-btn ml-2"
      icon
      title="Capture QR"
      aria-label="Capture QR"
      @click="toggleWC"
    >
      <v-icon v-if="(wcConnectorSession && wcConnectorSession.connected) || false" size="16">$vuetify.icons.disconnect</v-icon>
      <v-icon v-else size="16">$vuetify.icons.walletconnect</v-icon>
    </v-btn> -->

    <v-btn
      v-if="hasStreamApiSupport && !isIframe"
      depressed
      large
      block
      class="torus-btn1 torusBrand1--text gmt-billboard-cta"
      title="Capture QR"
      aria-label="Capture QR"
      :loading="showQrScanner"
      @click="toggleWC"
    >
      <span v-if="(wcConnectorSession && wcConnectorSession.connected) || false" size="16">{{ ctaDisconnectText }}</span>
      <span v-else size="16">{{ ctaText }}</span>
    </v-btn>
  </div>
</template>

<script>
import log from 'loglevel'
import { QrcodeStream } from 'vue-qrcode-reader'
import { mapActions, mapMutations, mapState } from 'vuex'

import { isMain } from '../../../utils/utils'

export default {
  components: { QrcodeStream },
  props: {
    showFromEmbed: {
      type: Boolean,
      default: false,
    },
    btnStyle: {
      type: String,
      default: 'icon',
    },
    ctaText: {
      type: String,
      default: 'Get Started',
    },
    ctaDisconnectText: {
      type: String,
      default: 'Disconnect',
    },
  },
  data() {
    return {
      camera: 'off',
      showQrScanner: false,
      qrLoading: true,
      hasStreamApiSupport: true,
    }
  },
  computed: {
    ...mapState(['wcConnectorSession']),
    isIframe() {
      return !isMain
    },
  },
  watch: {
    qrErrorMsg(value) {
      if (value) {
        this.setErrorMsg(value)
        this.qrErrorMsg = ''
      }
    },
    showFromEmbed(value) {
      this.showQrScanner = value
      if (value) {
        this.camera = 'auto'
      } else {
        this.camera = 'off'
      }
    },
  },
  methods: {
    ...mapActions(['updateSelectedAddress', 'initWalletConnect', 'disconnectWalletConnect', 'sendWalletConnectResponse']),
    ...mapMutations(['setErrorMsg']),
    toggleWC() {
      if (this.wcConnectorSession?.connected) {
        this.disconnectWalletConnect()
      } else {
        this.camera = 'auto'
        this.showQrScanner = true
      }
    },
    async onDecodeQr(result) {
      try {
        log.info(result, 'qr decoded')
        await this.initWalletConnect({ uri: result })
        if (this.isIframe && this.showFromEmbed) await this.sendWalletConnectResponse({ success: true })
      } catch (error) {
        log.error(error)
        if (this.isIframe && this.showFromEmbed) await this.sendWalletConnectResponse({ success: false, errorMessage: error?.message })
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
        if (error.name === 'NotAllowedError') {
          this.qrErrorMsg = 'accountMenu.qrErrorNeedCameraPermission'
          log.error('ERROR: you need to grant camera access permisson')
        } else if (error.name === 'NotFoundError') {
          this.qrErrorMsg = 'accountMenu.qrErrorNoCamera'
          log.error('ERROR: no camera on this device')
        } else if (error.name === 'NotSupportedError') {
          this.qrErrorMsg = 'accountMenu.qrErrorSecureContextRequired'
          log.error('ERROR: secure context required (HTTPS, localhost)')
        } else if (error.name === 'NotReadableError') {
          this.qrErrorMsg = 'accountMenu.qrErrorCameraAlreadyInUse'
          log.error('ERROR: is the camera already in use?')
        } else if (error.name === 'OverconstrainedError') {
          this.qrErrorMsg = 'accountMenu.qrErrorInstalledCamerasAreNotSuitable'
          log.error('ERROR: installed cameras are not suitable')
        } else if (error.name === 'StreamApiNotSupportedError') {
          this.qrErrorMsg = 'accountMenu.qrErrorStreamAPINotSupported'
          log.error('ERROR: Stream Api not supported')

          this.hasStreamApiSupport = false
        }

        if (this.isIframe && this.showFromEmbed) {
          this.sendWalletConnectResponse({ success: false, errorMessage: this.t(this.qrErrorMsg) })
        }
      }
    },
    async closeQRScanner() {
      this.camera = 'off'
      this.showQrScanner = false
      if (this.isIframe && this.showFromEmbed) {
        await this.sendWalletConnectResponse({ success: false, errorMessage: 'User Closed Scanner' })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'WalletConnect.scss';
</style>
