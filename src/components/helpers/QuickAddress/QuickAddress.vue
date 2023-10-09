<template>
  <div class="quick-address d-flex align-center">
    <div class="ml-auto">
      <WalletConnectModal />
    </div>
    <div class="ml-2">
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
  </div>
</template>

<script>
import { mapState } from 'vuex'

import { apiStreamSupported, toChecksumAddressByChainId } from '../../../utils/utils'
import ExportQrCode from '../ExportQrCode'
import ShowToolTip from '../ShowToolTip'
import WalletConnectModal from '../WalletConnectModal'

export default {
  components: { ExportQrCode, ShowToolTip, WalletConnectModal },
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
