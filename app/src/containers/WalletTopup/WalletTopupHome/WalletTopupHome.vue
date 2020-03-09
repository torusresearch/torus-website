<template>
  <v-container class="wallet-topup-view" :class="$vuetify.breakpoint.xsOnly ? 'px-4' : ''">
    <v-layout wrap align-start :class="$vuetify.breakpoint.xsOnly ? 'mt-2' : 'mt-3'">
      <v-flex xs12 sm6>
        <div class="font-weight-bold display-1 text-left">
          <span v-if="selectedProvider && !$vuetify.breakpoint.xsOnly">
            {{ t('walletTopUp.purchaseVia') }}
            <span class="text-capitalize">{{ selectedProvider }}</span>
          </span>
          <span v-else>{{ t('walletTopUp.selectProvider') }}</span>
        </div>
      </v-flex>
      <v-flex xs12 sm6 class="text-right">
        <export-qr-code>
          <v-btn icon>
            <v-icon x-small v-text="'$vuetify.icons.qr'" />
          </v-btn>
        </export-qr-code>
      </v-flex>
    </v-layout>
    <v-layout mt-7 mx-n4 wrap>
      <TopupProviders
        :selected-provider="selectedProvider"
        :providers="providers"
        @onSelectProvider="
          selected => {
            selectedProvider = selected
          }
        "
      />

      <v-flex v-if="selectedProvider && $vuetify.breakpoint.xsOnly" xs12 mb-2>
        <div class="text-black font-weight-bold headline px-4 mb-4">
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
import TopupProviders from '../../../components/WalletTopup/TopupProviders'
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
  },
  mounted() {
    this.$vuetify.goTo(0)
  }
}
</script>
