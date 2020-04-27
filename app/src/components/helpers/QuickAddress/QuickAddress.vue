<template>
  <div class="quick-address d-flex align-center">
    <div class="ml-auto">
      <ExportQrCode>
        <v-icon x-small v-text="'$vuetify.icons.qr'" />
      </ExportQrCode>
    </div>
    <div class="ml-2">
      <ShowToolTip :address="selectedAddress">
        <v-btn small class="address-btn">
          <v-icon left size="9" v-text="'$vuetify.icons.address'" />
          <span>{{ slicedAddress }}</span>
        </v-btn>
      </ShowToolTip>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import ExportQrCode from '../ExportQrCode'
import ShowToolTip from '../ShowToolTip'

export default {
  components: { ExportQrCode, ShowToolTip },
  computed: {
    ...mapState(['selectedAddress']),
    slicedAddress() {
      return this.$vuetify.breakpoint.xsOnly
        ? `${this.selectedAddress.slice(0, 4)}...${this.selectedAddress.slice(-3)}`
        : `${this.selectedAddress.slice(0, 6)}...${this.selectedAddress.slice(-5)}`
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'QuickAddress.scss';
</style>
