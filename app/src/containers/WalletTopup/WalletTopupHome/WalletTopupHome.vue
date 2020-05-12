<template>
  <v-container class="wallet-topup-view pt-6" :class="$vuetify.breakpoint.xsOnly ? 'px-4' : ''">
    <div class="d-flex align-center">
      <div class="font-weight-bold display-1 text-left text_2--text">
        <span v-if="selectedProvider && !$vuetify.breakpoint.xsOnly">
          {{ t('walletTopUp.purchaseVia') }}
          <span class="text-capitalize">{{ selectedProvider }}</span>
        </span>
        <span v-else>{{ t('walletTopUp.selectProvider') }}</span>
      </div>
      <div class="ml-auto">
        <QuickAddress />
      </div>
    </div>
    <v-layout mt-7 mx-n4 wrap>
      <TopupProviders
        :selected-provider="selectedProvider"
        :is-topup-modal-visible="isTopupModalVisible"
        :providers="providers"
        @onSelectProvider="
          (selected) => {
            selectedProvider = selected
          }
        "
      />

      <v-flex v-if="selectedProvider && $vuetify.breakpoint.xsOnly" xs12 mb-2>
        <div class="font-weight-bold headline px-4 mb-4 text_2--text">
          <span>
            {{ t('walletTopUp.purchaseVia') }}
            <span class="text-capitalize">{{ selectedProvider }}</span>
          </span>
        </div>
      </v-flex>

      <v-flex v-if="!isTopupModalVisible" id="providerForm" xs12 sm6 md7 mb-4 px-4>
        <router-view></router-view>
      </v-flex>
      <v-flex v-else id="providerForm" xs12 sm6 md7 mb-4 px-4>
        <WalletTopupSimplex v-if="selectedProvider === SIMPLEX" />
        <WalletTopupMoonpay v-if="selectedProvider === MOONPAY" />
        <WalletTopupWyre v-if="selectedProvider === WYRE" />
        <WalletTopupRampNetwork v-if="selectedProvider === RAMPNETWORK" />
        <WalletTopupXanpool v-if="selectedProvider === XANPOOL" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

import QuickAddress from '../../../components/helpers/QuickAddress'
import TopupProviders from '../../../components/WalletTopup/TopupProviders'
import { MOONPAY, RAMPNETWORK, SIMPLEX, THEME_DARK_BLACK_NAME, THEME_LIGHT_BLUE_NAME, WYRE, XANPOOL } from '../../../utils/enums'
import { getPaymentProviders } from '../../../utils/utils'
import WalletTopupMoonpay from '../WalletTopupMoonpay'
import WalletTopupRampNetwork from '../WalletTopupRampNetwork'
import WalletTopupSimplex from '../WalletTopupSimplex'
import WalletTopupWyre from '../WalletTopupWyre'
import WalletTopupXanpool from '../WalletTopupXanpool'

export default {
  name: 'WalletTopupHome',
  components: {
    TopupProviders,
    QuickAddress,
    WalletTopupMoonpay,
    WalletTopupRampNetwork,
    WalletTopupSimplex,
    WalletTopupWyre,
    WalletTopupXanpool,
  },
  data() {
    return {
      selectedProvider: '',
      MOONPAY,
      SIMPLEX,
      RAMPNETWORK,
      WYRE,
      XANPOOL,
    }
  },
  computed: {
    ...mapState(['theme', 'whiteLabel']),
    ...mapState({
      isTopupModalVisible: (state) => state.embedState.isTopupModalVisible,
    }),
    providers() {
      if (this.whiteLabel.isActive) {
        return getPaymentProviders(this.whiteLabel.theme.isDark ? THEME_DARK_BLACK_NAME : THEME_LIGHT_BLUE_NAME)
      }
      return getPaymentProviders(this.theme)
    },
  },
  mounted() {
    const routerPath = this.$router.currentRoute.path
    const foundPath = this.providers.find((x) => x.link === routerPath)
    this.selectedProvider = foundPath ? foundPath.name : ''

    this.$vuetify.goTo(0)
  },
}
</script>
