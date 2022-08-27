<template>
  <div>
    <v-row v-if="!isIframe">
      <v-menu
        :value="guideOn"
        :close-on-content-click="false"
        offset-y
        :bottom="$vuetify.display.smAndUp"
        :top="$vuetify.display.xs"
        :nudge-top="$vuetify.display.xs ? 10 : -10"
        @change="guideOn = !guideOn"
      >
        <template #activator="{ attrs }">
          <span class="torusBrand1--text caption ml-3 mt-3" v-bind="attrs" @click="guideOn = !guideOn">
            {{ !guideOn ? $t('walletConnect.viewGuide') : $t('walletConnect.hideGuide') }}
          </span>
        </template>
        <v-card class="pb-4 guide-menu">
          <v-card-actions class="justify-right">
            <v-btn class="hidden-btn"></v-btn>
            <v-spacer></v-spacer>
            <v-btn class="close-btn" icon @click="guideOn = !guideOn">
              <v-icon>$close</v-icon>
            </v-btn>
          </v-card-actions>
          <div style="max-width: 180px" class="custom-placeholer mb-2 text-center mx-auto">
            <p>{{ $t('walletConnect.guideInfo') }}</p>
          </div>
          <v-img :src="require(`../../../assets/images/walletGuide.svg`)" max-height="200" max-width="151" class="mx-auto mb-5"></v-img>
        </v-card>
      </v-menu>
    </v-row>
    <!-- <v-btn block large class="torus-btn1 torusBrand1--text" @click="toggleWC">
      <span size="16">{{ $t('walletConnect.gotoApp') }}</span>
    </v-btn> -->
    <!-- <v-container> -->
    <v-row v-if="!isIframe" justify="space-around">
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="wcCopyPasteLink"
          dense
          hide-details
          variant="outlined"
          height="44"
          class="custom-placeholer"
          :placeholder="ctaPlaceholder"
          @change="onWcInputChanged"
        >
          <template #append>
            <v-btn
              v-if="(wcConnectorSession && wcConnectorSession.connected) || false"
              variant="text"
              size="small"
              color="torusBrand1"
              tabindex="-3"
              @click="toggleWC"
            >
              <!-- <v-icon small>$vuetify.icons.goto</v-icon> -->
              <span class="caption mr-1">{{ $t('walletConnect.gotoApp') }}</span>
              <v-img :src="require(`../../../assets/images/goto-link.svg`)"></v-img>
            </v-btn>
            <!-- <span v-if="(wcConnectorSession && wcConnectorSession.connected) || false" class="mt-1 ma-0 p-0" @click="toggleWC">Go to dApp</span>
            <v-img
              v-if="(wcConnectorSession && wcConnectorSession.connected) || false"
              :src="require(`../../../assets/images/goto-link.svg`)"
            ></v-img> -->
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <!-- <v-btn block large class="torus-btn1 torusBrand1--text" @click="toggleWC">
          <span size="16">{{ $t('walletConnect.scanToConnect') }}</span>
        </v-btn> -->
        <v-dialog v-model="showQrScanner" :eager="true" :width="qrLoading ? 0 : 600" @click:outside="closeQRScanner">
          <div v-if="showQrScanner" class="qr-scan-container">
            <QrcodeStream :camera="camera" :style="camera === 'off' && { display: 'none' }" @decode="onDecodeQr" @init="onInit" />
            <v-btn class="close-btn" icon aria-label="Close QR Scanner" title="Close QR Scanner" @click="closeQRScanner">
              <v-icon>$close</v-icon>
            </v-btn>
          </div>
        </v-dialog>

        <v-btn
          v-if="hasStreamApiSupport && !isIframe"
          depressed
          size="large"
          block
          class="torus-btn1 text-torusBrand1 gmt-billboard-cta"
          title="Capture QR"
          aria-label="Capture QR"
          :loading="showQrScanner"
          @click="openScanner"
        >
          <span v-if="(wcConnectorSession && wcConnectorSession.connected) || false" size="16">{{ $t('walletConnect.disconnect') }}</span>
          <span v-else size="16">{{ $t('walletConnect.scanToConnect') }}</span>
        </v-btn>
        <!-- </div> -->
      </v-col>
    </v-row>
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
  },
  data() {
    return {
      camera: 'off',
      showQrScanner: false,
      qrLoading: true,
      hasStreamApiSupport: true,
      wcCopyPasteLink: '',
      guideOn: false,
      ctaPlaceholder: 'wc:ff9e1dfa-68be-47ed...',
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
    wcConnectorSession(value) {
      if (value.connected) {
        this.$store.dispatch('setSuccessMessage', 'walletConnect.connected')
        if (value.uri) this.wcCopyPasteLink = value.uri
      }
    },
  },
  methods: {
    ...mapActions(['updateSelectedAddress', 'initWalletConnect', 'disconnectWalletConnect', 'sendWalletConnectResponse', 'getWalletConnectedApp']),
    ...mapMutations(['setErrorMsg']),
    async toggleWC() {
      if (this.wcConnectorSession?.connected) {
        const url = await this.getWalletConnectedApp()
        window.open(url)
      } else {
        // this.menu = !this.menu
        this.guideOn = !this.guideOn
      }
    },
    async onWcInputChanged() {
      try {
        if (!this.wcCopyPasteLink.startsWith('wc:')) {
          return
        }
        await this.initWalletConnect({ uri: this.wcCopyPasteLink })
        if (this.isIframe && this.showFromEmbed) await this.sendWalletConnectResponse({ success: true })
        // this.textPasteFlow = true
      } catch (error) {
        log.error(error)
        if (this.isIframe && this.showFromEmbed) await this.sendWalletConnectResponse({ success: false, errorMessage: error?.message })
      }
    },
    openScanner() {
      if (this.wcConnectorSession?.connected) {
        this.disconnectWalletConnect()
        this.wcCopyPasteLink = ''
        // this.textPasteFlow = false
      } else {
        this.camera = 'auto'
        this.showQrScanner = true
        this.scannerOpened = true
      }
    },
    async onDecodeQr(result) {
      try {
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
