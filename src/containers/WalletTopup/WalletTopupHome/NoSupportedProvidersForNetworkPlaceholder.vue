<template>
  <v-container class="wallet-topup-view pt-6" :class="$vuetify.breakpoint.xsOnly ? 'px-4' : ''">
    <div class="d-flex align-center">
      <div class="font-weight-bold text-left text_2--text page-title mr-auto" :class="{ 'display-1': $vuetify.breakpoint.width > 390 }">
        <span style="opacity: 0.4">{{ t('walletTopUp.selectProvider') }}</span>
      </div>
      <span class="mx-2">
        <NetworkDisplay :store-network-type="networkType" />
      </span>
      <span>
        <QuickAddress />
      </span>
    </div>
    <v-layout mt-7 mx-n4 wrap>
      <PlaceholderTopupProviders />
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

import NetworkDisplay from '../../../components/helpers/NetworkDisplay'
import QuickAddress from '../../../components/helpers/QuickAddress'
import PlaceholderTopupProviders from '../../../components/WalletTopup/PlaceholderTopupProviders'

export default {
  components: {
    NetworkDisplay,
    QuickAddress,
    PlaceholderTopupProviders,
  },
  computed: {
    ...mapState(['whiteLabel', 'networkType']),
  },
  mounted() {
    if (this.whiteLabel.topupHide) {
      this.$router.push({ name: 'walletHome' }).catch((_) => {})
      return
    }

    this.$vuetify.goTo(0)
  },
}
</script>

<style lang="scss" scoped>
@import 'WalletTopupHome.scss';
</style>
