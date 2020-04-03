<template>
  <v-dialog v-model="qrDialoag" width="450">
    <template v-slot:activator="{ on }">
      <v-btn id="openQr" class="qr-btn" icon small aria-label="Open QR" v-on="on">
        <slot></slot>
      </v-btn>
    </template>
    <v-card>
      <div class="text-right">
        <v-btn icon small @click="qrDialoag = false">
          <v-icon size="8">$vuetify.icons.close</v-icon>
        </v-btn>
      </div>
      <v-card-text class="text-center qr-container">
        <div class="headline font-weight-bold">{{ t('walletHome.yourPublicAddress') }}</div>
        <div class="caption text_2--text mb-4">
          <ShowToolTip :address="selectedAddress">{{ slicedAddress }}</ShowToolTip>
        </div>
        <VueQr
          ref="address-qr"
          :logo-src="require(`../../../../public/images/torus-circle.svg`)"
          :margin="10"
          :logo-scale="0.4"
          :logo-corner-radius="145"
          logo-background-color="white"
          :text="selectedAddress"
          :size="800"
          :dot-scale="1"
          :correct-level="3"
        ></VueQr>
        <div class="mt-8">
          <v-btn depressed color="torusBrand1" class="px-12" @click="downloadQr">
            <v-icon small>$vuetify.icons.download</v-icon>
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import VueQr from 'vue-qr'

import ShowToolTip from '../ShowToolTip'

export default {
  components: {
    ShowToolTip,
    VueQr,
  },
  props: {
    customAddress: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      qrDialoag: false,
    }
  },
  computed: {
    selectedAddress() {
      return this.customAddress || this.$store.state.selectedAddress
    },
    slicedAddress() {
      return `${this.selectedAddress.slice(0, 20)}...${this.selectedAddress.slice(-10)}`
    },
  },
  methods: {
    downloadQr() {
      const qrImage = this.$refs['address-qr'].$el.src
      const downloadLink = document.createElement('a')

      downloadLink.href = qrImage
      downloadLink.download = 'qrcode.png'
      document.body.append(downloadLink)
      downloadLink.click()
      downloadLink.remove()
      // document.body.removeChild(downloadLink)
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'ExportQrCode.scss';
</style>
