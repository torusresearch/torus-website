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
import { ACTIVE, INACTIVE } from '../../../utils/enums'

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
          logo: 'simplex-logo.png',
          line1: 'Pay with Credit Card',
          line2: '<span class="font-weight-medium">Simplex Service Fee</span> : 5% or 10 USD',
          line3: '(whichever is higher)',
          link: '/wallet/topup/simplex',
          status: ACTIVE
        },
        {
          name: 'moonpay',
          logo: this.$vuetify.theme.dark ? 'moon-pay-logo-white.svg' : 'moon-pay-logo.svg',
          line1: 'Pay with Credit Card',
          line2: '<span class="font-weight-medium">Moonpay Service Fee</span> : 4.5% or 5 USD',
          line3: '(whichever is higher)',
          link: '/wallet/topup/moonpay',
          status: ACTIVE
        },
        {
          name: 'wyre',
          logo: this.$vuetify.theme.dark ? 'wyre-logo-white.svg' : 'wyre-logo.svg',
          line1: 'Pay with Debit Card (USA only)',
          line2: '<span class="font-weight-medium">Wyre Service Fee</span> : 2.9% + 30¢',
          line3: '( $40 per day limit )',
          link: '/wallet/topup/wyre',
          status: INACTIVE
        },
        {
          name: 'crypto',
          logo: this.$vuetify.theme.dark ? 'crypto-logo-white.png' : 'crypto-logo.png',
          line1: 'Pay with Credit Card',
          line2: '<span class="font-weight-medium">crypto.com Service Fee</span> : Varies',
          line3: '',
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
