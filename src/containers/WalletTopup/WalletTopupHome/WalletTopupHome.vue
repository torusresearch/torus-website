<template>
  <div>
    <SupportErrorBanner
      v-if="noSupportedProvidersForNetwork"
      :message="t('walletTopUp.notSupportedBanner', [t('navBar.topUp'), networkType.networkName])"
    />

    <NoSupportedProvidersForNetworkPlaceholder v-if="noSupportedProvidersForNetwork">
      <!-- Placeholder Topup Header -->
      <WalletTopupHeader :placeholder="true" :selected-provider="selectedProvider" />
    </NoSupportedProvidersForNetworkPlaceholder>

    <v-container v-else class="wallet-topup-view pt-6" :class="$vuetify.breakpoint.xsOnly ? 'px-4' : ''">
      <!-- Normal Topup Header -->
      <WalletTopupHeader :selected-provider="selectedProvider" />

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

import SupportErrorBanner from '../../../components/helpers/SupportErrorBanner'
import TopupProviders from '../../../components/WalletTopup/TopupProviders'
import WalletTopupHeader from '../../../components/WalletTopup/WalletTopupHeader'
import { THEME_DARK_BLACK_NAME, THEME_LIGHT_BLUE_NAME } from '../../../utils/enums'
import { getPaymentProviders } from '../../../utils/utils'
import NoSupportedProvidersForNetworkPlaceholder from './NoSupportedProvidersForNetworkPlaceholder.vue'

export default {
  components: {
    SupportErrorBanner,
    TopupProviders,
    NoSupportedProvidersForNetworkPlaceholder,
    WalletTopupHeader,
  },
  data() {
    return {
      selectedProvider: '',
    }
  },
  computed: {
    ...mapState(['theme', 'whiteLabel', 'networkType', 'networkId']),
    providers() {
      if (this.whiteLabel.isActive) {
        return getPaymentProviders(this.networkId, this.whiteLabel.theme.isDark ? THEME_DARK_BLACK_NAME : THEME_LIGHT_BLUE_NAME)
      }
      return getPaymentProviders(this.networkId, this.theme)
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
