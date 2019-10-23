<template>
  <div class="wallet-topup-view">
    <v-layout mt-3 wrap>
      <v-flex xs12 mb-2>
        <div class="text-black font-weight-bold headline px-4 mb-4">
          <span v-if="selectedProvider && !$vuetify.breakpoint.xsOnly">
            Purchase Cryptocurrency with your credit card via
            <span class="text-capitalize">{{ selectedProvider }}</span>
          </span>
          <span v-else>Select a Provider</span>
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

      <v-flex xs12 mb-2 v-if="selectedProvider && $vuetify.breakpoint.xsOnly">
        <div class="text-black font-weight-bold headline px-4 mb-4">
          <span>
            Purchase Cryptocurrency with your credit card via
            <span class="text-capitalize">{{ selectedProvider }}</span>
          </span>
        </div>
      </v-flex>

      <v-flex xs12 sm7 mb-4 px-4>
        <router-view></router-view>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import TopupProviders from '../../../components/WalletTopup/TopupProviders'
import { ACTIVE, INACTIVE, THEME_DARK_BLACK_NAME } from '../../../utils/enums'

export default {
  components: {
    TopupProviders
  },
  data() {
    return {
      selectedProvider: '',
      providers: [
        {
          name: 'simplex',
          logo: this.$store.state.theme === THEME_DARK_BLACK_NAME ? 'simplex-logo-white.png' : 'simplex-logo.png',
          line1: 'Pay with Credit / Debit Card',
          line2: '<span class="font-weight-medium">Fee</span> : 5% or 10 USD',
          line3: 'Limits: $20,000/day, $50,000/mo',
          line4: 'Currencies: ETH',
          link: '/wallet/topup/simplex',
          status: ACTIVE
        },
        {
          name: 'moonpay',
          logo: this.$store.state.theme === THEME_DARK_BLACK_NAME ? 'moon-pay-logo-white.svg' : 'moon-pay-logo.svg',
          line1: 'Pay with Credit / Debit Card',
          line2: '<span class="font-weight-medium">Fee</span> : 4.5% or 5 USD',
          line3: 'Limits: 2,000€/day, 10,000€/mo',
          line4: 'Currencies: ETH, DAI, TUSD, USDC, USDT',
          link: '/wallet/topup/moonpay',
          status: ACTIVE
        },
        {
          name: 'wyre',
          logo: this.$store.state.theme === THEME_DARK_BLACK_NAME ? 'wyre-logo-white.svg' : 'wyre-logo.svg',
          line1: 'Pay with Google/Apple/Masterpass',
          line2: '<span class="font-weight-medium">Fee</span> : 2.9% + 30¢',
          line3: 'Limits: $250/day',
          line4: 'Currencies: ETH, DAI, WETH, USDC',
          link: '/wallet/topup/wyre',
          status: ACTIVE
        },
        {
          name: 'coindirect',
          logo: this.$store.state.theme === THEME_DARK_BLACK_NAME ? 'coindirect-logo-white.svg' : 'coindirect-logo.svg',
          line1: 'Pay with Credit Card',
          line2: '<span class="font-weight-medium">coindirect.com Service Fee</span> : Varies',
          line3: 'Limits: N/A',
          line4: 'Currencies: ETH',
          link: '/wallet/topup/coindirect',
          status: ACTIVE
        },
        {
          name: 'crypto',
          logo: this.$store.state.theme === THEME_DARK_BLACK_NAME ? 'crypto-logo-white.png' : 'crypto-logo.png',
          line1: 'Pay with Credit Card',
          line2: '<span class="font-weight-medium">crypto.com Service Fee</span> : Varies',
          line3: 'Limits: N/A',
          line4: 'Currencies: ETH',
          link: '/wallet/topup/crypto',
          status: ACTIVE
        }
      ]
    }
  },
  created() {
    const routerPath = this.$router.currentRoute.path
    const foundPath = this.providers.find(x => x.link === routerPath)
    this.selectedProvider = foundPath ? foundPath.name : ''
  }
}
</script>
