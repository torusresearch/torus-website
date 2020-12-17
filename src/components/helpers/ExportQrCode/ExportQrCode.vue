<template>
  <v-dialog v-model="qrDialoag" width="350">
    <template #activator="{ on }">
      <v-btn id="openQr" class="qr-btn" icon small aria-label="Open Export QR" title="Open Export QR" v-on="on">
        <slot></slot>
      </v-btn>
    </template>
    <v-card>
      <v-layout wrap>
        <v-flex class="card-header text-center" xs12 py-10 px-6>
          <img
            class="home-link mx-auto"
            alt="Torus Logo"
            width="104"
            height="24"
            :src="require(`../../../assets/images/torus-logo-${$vuetify.theme.dark ? 'white' : 'blue'}.svg`)"
          />
          <v-btn class="close-btn" icon aria-label="Close Export QR" title="Close Export QR" @click="qrDialoag = false">
            <v-icon>$vuetify.icons.close</v-icon>
          </v-btn>
        </v-flex>
        <v-flex xs12 class="text-center pb-10">
          <div class="display-1 text_1--text mb-2">{{ t('walletHome.yourPublicAddress') }}</div>
          <div class="mb-2">
            <ShowToolTip :address="selectedAddress">
              <span class="public-address torusFont2--text">{{ selectedAddress }}</span>
              <v-icon size="12" class="torusFont2--text ml-1" v-text="'$vuetify.icons.copy'" />
            </ShowToolTip>
          </div>
          <div class="qr-container mb-8">
            <VueQr
              v-show="$vuetify.theme.dark"
              :color-dark="'#252529'"
              :color-light="'#FCFCFC'"
              :background-color="'#2F3136'"
              :logo-background-color="'#2F3136'"
              :logo-src="require('../../../assets/img/icons/t-fill.svg')"
              :logo-scale="0.28"
              :margin="1"
              :text="selectedAddress"
              :size="800"
              :dot-scale="0.6"
              :correct-level="3"
            ></VueQr>
            <VueQr
              v-show="!$vuetify.theme.dark"
              ref="address-qr"
              :logo-src="require('../../../assets/img/icons/t-fill.svg')"
              :margin="20"
              :logo-scale="0.28"
              :text="selectedAddress"
              :size="800"
              :dot-scale="0.6"
              :correct-level="3"
            ></VueQr>
          </div>
          <div>
            <v-btn large depressed color="torusBrand1 white--text caption font-weight-bold" class="px-10" @click="downloadQr">
              {{ t('walletHome.downloadQR') }}
            </v-btn>
          </div>
        </v-flex>
      </v-layout>
    </v-card>
  </v-dialog>
</template>

<script>
import VueQr from 'vue-qr'
import { mapState } from 'vuex'

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
    ...mapState({
      selectedAddress(state) {
        return this.customAddress || state.selectedAddress
      },
    }),
    slicedAddress() {
      return `${this.selectedAddress.slice(0, 11)}...${this.selectedAddress.slice(-13)}`
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
