<template>
  <v-dialog v-model="qrDialoag" width="450">
    <template v-slot:activator="{ on }">
      <v-icon small class="primary--text" v-text="'$vuetify.icons.qr'" v-on="on" />
    </template>
    <v-card>
      <div class="text-right">
        <v-btn icon small @click="qrDialoag = false">
          <v-icon size="8">$vuetify.icons.close</v-icon>
        </v-btn>
      </div>
      <v-card-text class="text-center qr-container">
        <div class="headline font-weight-bold mb-4">Your QR code</div>
        <vue-qr
          ref="address-qr"
          :logoSrc="require(`../../../../public/images/torus-circle.svg`)"
          :margin="10"
          :logoScale="0.4"
          :logoCornerRadius="145"
          logoBackgroundColor="white"
          :text="transferUrl"
          :size="800"
          :dotScale="1"
          :correctLevel="3"
        ></vue-qr>
        <div class="caption text_2--text">
          <show-tool-tip :address="selectedAddress">{{ slicedAddress }}</show-tool-tip>
        </div>
        <div class="mt-8">
          <v-btn depressed color="primary" class="px-12" @click="downloadQr">
            <v-icon small>$vuetify.icons.download</v-icon>
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import VueQr from 'vue-qr'
import ShowToolTip from '../../helpers/ShowToolTip'
import config from '../../../config'
const baseRoute = config.baseRoute

export default {
  components: {
    ShowToolTip,
    VueQr
  },
  data() {
    return {
      qrDialoag: false
    }
  },
  computed: {
    selectedAddress() {
      return this.$store.state.selectedAddress
    },
    slicedAddress() {
      return `${this.selectedAddress.slice(0, 20)}...${this.selectedAddress.slice(-10)}`
    },
    transferUrl() {
      let urlPath = this.$router.resolve({ name: 'walletTransfer', query: { to: this.selectedAddress } }).href
      if (urlPath.indexOf('/') === 0) urlPath = urlPath.substr(1)
      return `${baseRoute}${urlPath}`
    }
  },
  methods: {
    downloadQr() {
      const qrImage = this.$refs['address-qr'].$el.src
      const downloadLink = document.createElement('a')

      downloadLink.href = qrImage
      downloadLink.download = 'qrcode.png'
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'ExportQrCode.scss';
</style>
