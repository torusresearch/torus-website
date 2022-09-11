<template>
  <div class="quick-address d-flex align-center">
    <div class="ml-auto">
      <ShowToolTip :address="selectedAddress">
        <v-btn size="small" class="address-btn" aria-label="Copy Address">
          <v-icon start size="9" class="mr-2">$address</v-icon>
          <span>{{ slicedAddress }}</span>
        </v-btn>
      </ShowToolTip>
    </div>
    <div class="ml-2">
      <ExportQrCode>
        <v-icon size="x-small">$qr</v-icon>
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
  computed: {
    ...mapState({
      selectedAddress(state) {
        if (state.selectedAddress === '') return state.selectedAddress
        return toChecksumAddressByChainId(state.selectedAddress, this.$store.state.networkId)
      },
    }),
    slicedAddress() {
      return this.$vuetify.display.xs
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
