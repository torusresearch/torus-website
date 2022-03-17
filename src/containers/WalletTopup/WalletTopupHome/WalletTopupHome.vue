<template>
  <div>
    <div
      v-if="noSupportedProvidersForNetwork"
      class="error-box d-md-flex align-center justify-center error lighten-4 py-3 py-sm-5 px-5"
      :class="{ 'is-mobile': $vuetify.breakpoint.smAndDown }"
    >
      <div class="d-flex justify-md-center mb-2 mb-md-0">
        <v-icon size="22" class="black--text mr-2">$vuetify.icons.alert</v-icon>
        <div class="text-caption text-sm-body-2">{{ t('walletTopUp.topUpNotSupported', [networkType.networkName]) }}</div>
      </div>

      <div class="text-right">
        <router-link class="text-uppercase text-decoration-none text-body-2 ml-1" :to="{ name: 'walletSettings' }" :style="{ lineHeight: 0 }">
          {{ t('walletTopUp.changeNetwork') }}
        </router-link>
      </div>
    </div>
    <v-container class="wallet-topup-view pt-6" :class="$vuetify.breakpoint.xsOnly ? 'px-4' : ''">
      <div class="d-flex align-center">
        <div class="font-weight-bold text-left text_2--text page-title mr-auto" :class="{ 'display-1': $vuetify.breakpoint.width > 390 }">
          <span v-if="selectedProvider && !$vuetify.breakpoint.xsOnly">
            {{ t('walletTopUp.purchaseVia') }}
            <span class="text-capitalize">{{ selectedProvider }}</span>
          </span>
          <span v-else>{{ t('walletTopUp.selectProvider') }}</span>
        </div>
        <span class="mx-2">
          <NetworkDisplay :store-network-type="networkType" />
        </span>
        <span>
          <QuickAddress />
        </span>
      </div>
      <v-layout mt-7 mx-n4 wrap>
        <TopupProviders
          :selected-provider="selectedProvider"
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

        <v-flex id="providerForm" mb-4 px-4 :class="$vuetify.breakpoint.width > 800 ? 'xs7' : 'xs12'">
          <router-view></router-view>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import NetworkDisplay from '../../../components/helpers/NetworkDisplay'
import QuickAddress from '../../../components/helpers/QuickAddress'
import TopupProviders from '../../../components/WalletTopup/TopupProviders'
import { THEME_DARK_BLACK_NAME, THEME_LIGHT_BLUE_NAME } from '../../../utils/enums'
import { getPaymentProviders } from '../../../utils/utils'

export default {
  components: {
    TopupProviders,
    QuickAddress,
    NetworkDisplay,
  },
  data() {
    return {
      selectedProvider: '',
    }
  },
  computed: {
    ...mapState(['theme', 'whiteLabel', 'networkType']),
    providers() {
      const network = this.networkType.host
      if (this.whiteLabel.isActive) {
        return getPaymentProviders(network, this.whiteLabel.theme.isDark ? THEME_DARK_BLACK_NAME : THEME_LIGHT_BLUE_NAME)
      }
      return getPaymentProviders(network, this.theme)
    },
    noSupportedProvidersForNetwork() {
      return this.providers.length === 0
    },
  },
  mounted() {
    if (this.whiteLabel.topupHide) {
      this.$router.push({ name: 'walletHome' }).catch((_) => {})
      return
    }
    const routerPath = this.$router.currentRoute.path
    const foundPath = this.providers.find((x) => x.link === routerPath)
    this.selectedProvider = foundPath ? foundPath.name : ''

    this.$vuetify.goTo(0)
  },
}
</script>

<style lang="scss" scoped>
@import 'WalletTopupHome.scss';
</style>
