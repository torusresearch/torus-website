<template>
  <div class="wallet-topup-view">
    <v-layout mt-3 wrap>
      <v-flex xs12 mb-2>
        <div class="text-black font-weight-bold headline px-4 mb-4">
          <span v-if="selectedProvider && !$vuetify.breakpoint.xsOnly">
            {{ t('walletTopUp.purchaseVia') }}
            <span class="text-capitalize">{{ selectedProvider }}</span>
          </span>
          <span v-else>{{ t('walletTopUp.selectProvider') }}</span>
        </div>
      </v-flex>
      <TopupProviders
        :selectedProvider="selectedProvider"
        :providers="providers"
        @onSelectProvider="
          selected => {
            selectedProvider = selected
          }
        "
      />

      <v-flex id="providerForm" xs12 mb-2 v-if="selectedProvider && $vuetify.breakpoint.xsOnly">
        <div class="text-black font-weight-bold headline px-4 mb-4">
          <span>
            {{ t('walletTopUp.purchaseVia') }}
            <span class="text-capitalize">{{ selectedProvider }}</span>
          </span>
        </div>
      </v-flex>

      <v-flex xs12 sm6 md7 mb-4 px-4>
        <router-view></router-view>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import TopupProviders from '../../../components/WalletTopup/TopupProviders'
import { ACTIVE, INACTIVE, THEME_DARK_BLACK_NAME } from '../../../utils/enums'
import { getPaymentProviders } from '../../../utils/utils'

export default {
  components: {
    TopupProviders
  },
  data() {
    return {
      selectedProvider: ''
    }
  },
  computed: {
    providers() {
      return getPaymentProviders(this.$store.state.theme)
    }
  },
  created() {
    const routerPath = this.$router.currentRoute.path
    const foundPath = this.providers.find(x => x.link === routerPath)
    this.selectedProvider = foundPath ? foundPath.name : ''
  }
}
</script>
