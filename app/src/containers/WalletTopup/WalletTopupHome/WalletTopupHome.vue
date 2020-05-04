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

      <v-flex id="providerForm" xs12 sm6 md7 mb-4 px-4>
        <router-view></router-view>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

import QuickAddress from '../../../components/helpers/QuickAddress'
import TopupProviders from '../../../components/WalletTopup/TopupProviders'
import { getPaymentProviders } from '../../../utils/utils'

export default {
  components: {
    TopupProviders,
    QuickAddress,
  },
  data() {
    return {
      selectedProvider: '',
    }
  },
  computed: {
    ...mapState(['theme']),
    providers() {
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
