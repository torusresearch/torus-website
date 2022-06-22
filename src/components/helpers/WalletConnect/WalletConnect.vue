<template>
  <div>
    <!-- <v-container> -->
    <v-row justify="space-around">
      <v-col cols="12" sm="6">
        <v-text-field dense hide-details outlined height="44" class="custom-placeholer" :placeholder="ctaPlaceholder" @paste="onPaste"></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <!-- <div v-if="(wcConnectorSession && wcConnectorSession.connected) || false" class="ma-0 pa-0"> -->
        <v-btn
          v-if="(wcConnectorSession && wcConnectorSession.connected) || false"
          block
          large
          class="torus-btn1 torusBrand1--text"
          @click="toggleWC"
        >
          <span size="16">{{ ctaGotoApp }}</span>
        </v-btn>
        <v-menu
          v-else
          v-model="menu"
          :close-on-content-click="false"
          offset-y
          :bottom="$vuetify.breakpoint.smAndUp"
          :top="$vuetify.breakpoint.xsOnly"
          :nudge-top="$vuetify.breakpoint.xsOnly ? 10 : -10"
        >
          <template #activator="{ attrs }">
            <v-btn justify="end" block large class="torus-btn1 torusBrand1--text" v-bind="attrs" @click="toggleWC">
              {{ !guideOn ? ctaViewGuide : ctaHideGuide }}
            </v-btn>
          </template>
          <v-card class="pb-4 guide-menu">
            <v-card-actions class="justify-right">
              <v-btn class="hidden-btn"></v-btn>
              <v-spacer></v-spacer>
              <v-btn class="close-btn" icon @click="toggleWC">
                <v-icon>$vuetify.icons.close</v-icon>
              </v-btn>
            </v-card-actions>
            <div style="text-align: center" class="custom-placeholer mb-2">
              <span>
                Click on
                <span class="font-weight-bold">“Copy to clipboard”</span>
                below the
              </span>
              <br />
              <span>QR code when connecting with</span>
              <br />
              <span>WalletConnect on your Web3 App.</span>
              <br />
            </div>
            <v-img :src="require(`../../../assets/images/walletGuide.svg`)" max-height="200" max-width="151" class="mx-auto pa-20"></v-img>
          </v-card>
        </v-menu>
        <!-- </div> -->
      </v-col>
    </v-row>
  </div>
</template>

<script>
import log from 'loglevel'
import { mapActions, mapMutations, mapState } from 'vuex'

// import {wallet-connect-guide} from '../../../assets/images'
import { isMain } from '../../../utils/utils'

export default {
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
    ctaViewGuide: {
      type: String,
      default: 'View guide',
    },
    ctaHideGuide: {
      type: String,
      default: 'hide guide',
    },
    ctaPlaceholder: {
      type: String,
      default: 'wc:ff9e1dfa-68be-47ed-b900-72a4...',
    },
    ctaGotoApp: {
      type: String,
      default: 'Continue on Web3 App',
    },
  },
  data() {
    return {
      camera: 'off',
      showQrScanner: false,
      qrLoading: true,
      hasStreamApiSupport: true,
      walletAddress: '',
      guideOn: false,
      menu: false,
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
    menu(value) {
      if (!value) this.guideOn = false
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
        this.menu = !this.menu
        this.guideOn = !this.guideOn
      }
    },
    async onPaste(e) {
      try {
        const clipboardData = e.clipboardData || window.clipboardData
        const pastedData = clipboardData.getData('Text')
        log.info(pastedData, 'qr decoded')
        log.info(this.wcConnectorSession)
        await this.initWalletConnect({ uri: pastedData })
        if (this.isIframe && this.showFromEmbed) await this.sendWalletConnectResponse({ success: true })
        this.$store.dispatch('setSuccessMessage', 'Connected to Torus Wallet on Web3 App!')
      } catch (error) {
        log.error(error)
        if (this.isIframe && this.showFromEmbed) await this.sendWalletConnectResponse({ success: false, errorMessage: error?.message })
      } finally {
        this.camera = 'off'
        this.showQrScanner = false
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
