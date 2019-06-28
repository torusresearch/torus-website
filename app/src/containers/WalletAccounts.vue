<template>
  <v-flex xs12 sm8 mt-3 mb-3>
    <div class="d-flex has-border">
      <span class="body-2">Public Address</span>
      <span class="text-xs-right">
        <show-tool-tip :address="selectedAddress">
          {{ slicedAddress }}
        </show-tool-tip>
      </span>
    </div>
    <div class="d-flex has-border">
      <span class="body-2">Private Key</span>
      <span class="text-xs-right">
        <show-tool-tip :address="selectedKey">
          {{ slicedKey }}
        </show-tool-tip>
      </span>
    </div>
  </v-flex>
</template>

<script>
import ShowToolTip from '../components/ShowToolTip.vue'
import { addressSlicer } from '../utils/utils'

export default {
  name: 'walletAccounts',
  components: { ShowToolTip },
  computed: {
    selectedAddress() {
      return this.$store.state.selectedAddress
    },
    selectedKey() {
      return this.$store.state.wallet[this.selectedAddress]
    },
    slicedAddress() {
      return addressSlicer(this.selectedAddress)
    },
    slicedKey() {
      return addressSlicer(this.selectedKey)
    }
  }
}
</script>

<style lang="scss" scoped>
.selected-account {
  cursor: pointer;
  padding: 5px 15px;
  border-radius: 10px;
  max-width: 120px;
  &:hover {
    background-color: var(--v-torus_reject_mild-base);
    opacity: 0.5;
    color: #fff;
  }
  &.active {
    background-color: var(--v-torus_active-base);
  }
}

.has-border {
  // border: 2px solid var(--v-torus_reject-base);
  border-radius: 5px;
  padding: 15px;
  margin: 15px;
}
</style>
