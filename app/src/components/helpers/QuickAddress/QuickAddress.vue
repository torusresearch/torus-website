<template>
  <div class="quick-address d-flex align-center">
    <div class="ml-auto">
      <ShowToolTip :address="selectedAddress">
        <v-btn small class="address-btn" aria-label="Copy Address">
          <v-icon left size="9" v-text="'$vuetify.icons.address'" />
          <span>{{ slicedAddress }}</span>
        </v-btn>
      </ShowToolTip>
    </div>
    <div class="ml-2">
      <ExportQrCode>
        <v-icon x-small v-text="'$vuetify.icons.qr'" />
      </ExportQrCode>
    </div>
    <div v-if="$vuetify.breakpoint.xsOnly && apiStreamSupported">
      <WalletConnect />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import { apiStreamSupported } from '../../../utils/utils'
import ExportQrCode from '../ExportQrCode'
import ShowToolTip from '../ShowToolTip'
import WalletConnect from '../WalletConnect'

export default {
  components: { ExportQrCode, ShowToolTip, WalletConnect },
  computed: {
    ...mapState(['selectedAddress']),
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
