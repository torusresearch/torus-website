<template>
  <v-dialog v-model="qrDialoag" width="350">
    <template #activator="{ props }">
      <v-btn class="qr-btn" icon density="comfortable" size="small" aria-label="Open Export QR" title="Open Export QR" v-bind="props">
        <slot></slot>
      </v-btn>
    </template>
    <v-card class="bg-torusBlack2 pa-6">
      <v-row wrap no-gutters>
        <v-col cols="12" class="card-header text-center py-10 px-6">
          <img
            class="home-link mx-auto"
            alt="Torus Logo"
            width="104"
            height="24"
            :src="require(`../../../assets/images/torus-logo-${isDarkMode ? 'white' : 'blue'}.svg`)"
          />
          <v-btn variant="plain" class="close-btn" icon aria-label="Close Export QR" title="Close Export QR" @click="qrDialoag = false">
            <v-icon>$close</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="12" class="text-center pb-10">
          <div class="display-1 text-text_1 mb-2">{{ $t('walletHome.yourPublicAddress') }}</div>
          <div class="mb-2">
            <ShowToolTip :address="selectedAddress">
              <span class="public-address text-torusFont2">{{ selectedAddress }}</span>
              <v-icon size="12" class="text-torusFont2 ml-1">$copy</v-icon>
            </ShowToolTip>
          </div>
          <div class="qr-container mb-8">
            <VueQr
              v-show="isDarkMode"
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
              v-show="!isDarkMode"
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
            <v-btn depressed color="torusBrand1" class="px-10 text-white text-caption font-weight-bold" @click="downloadQr">
              {{ $t('walletHome.downloadQR') }}
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>
import vueQr from 'vue-qr/src/packages/vue-qr.vue'
import { mapState } from 'vuex'

import { toChecksumAddressByChainId } from '../../../utils/utils'
import ShowToolTip from '../ShowToolTip'

export default {
  components: {
    ShowToolTip,
    VueQr: vueQr,
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
        const add = this.customAddress || state.selectedAddress
        if (add === '') return add
        return toChecksumAddressByChainId(add, this.$store.state.networkId)
      },
    }),
    slicedAddress() {
      return `${this.selectedAddress.slice(0, 11)}...${this.selectedAddress.slice(-13)}`
    },
    isDarkMode() {
      return this.$vuetify.theme.current.dark
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
