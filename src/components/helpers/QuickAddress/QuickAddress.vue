<template>
  <div class="quick-address d-flex align-center">
    <div class="ml-auto">
      <span v-if="!!showBackToApp" class="mr-2">
        <v-btn type="link" small class="address-btn" aria-label="Return to USFL">
          <a href="https://usfl.fans">{{ t('homeAssets.returnToUsfl') }}</a>
        </v-btn>
      </span>
      <ShowToolTip :address="selectedAddress">
        <v-btn small class="address-btn" aria-label="Copy Address">
          <v-icon left size="9">$vuetify.icons.address</v-icon>
          <span>{{ slicedAddress }}</span>
        </v-btn>
      </ShowToolTip>
    </div>
    <div class="ml-2">
      <ExportQrCode>
        <v-icon x-small>$vuetify.icons.qr</v-icon>
      </ExportQrCode>
    </div>
    <!-- <div v-if="apiStreamSupported">
      <WalletConnect />
    </div> -->
  </div>
</template>

<script>
import { mapState } from 'vuex'

import { apiStreamSupported, toChecksumAddressByChainId } from '../../../utils/utils'
import ExportQrCode from '../ExportQrCode'
import ShowToolTip from '../ShowToolTip'
// import WalletConnect from '../WalletConnect'

export default {
  components: { ExportQrCode, ShowToolTip },
  props: {
    showBackToApp: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState({
      selectedAddress(state) {
        if (state.selectedAddress === '') return state.selectedAddress
        return toChecksumAddressByChainId(state.selectedAddress, this.$store.state.networkId)
      },
    }),
    slicedAddress() {
      return this.$vuetify.breakpoint.xsOnly
        ? `${this.selectedAddress.slice(0, 4)}...${this.selectedAddress.slice(-3)}`
        : `${this.selectedAddress.slice(0, 6)}...${this.selectedAddress.slice(-5)}`
    },
    apiStreamSupported() {
      return apiStreamSupported()
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'QuickAddress.scss';
</style>
