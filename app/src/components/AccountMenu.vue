<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on }">
      <v-btn class="hidden-xs-only" small text v-on="on">
        <span>Satoshi Nakamoto</span>
        <v-icon class="ml-2 mt-1" small>$vuetify.icons.select</v-icon>
      </v-btn>
    </template>

    <v-card width="400">
      <v-list>
        <v-list-item>
          <v-list-item-avatar class="mr-2">
            <img src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-subtitle>{{ userEmail }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <div class="font-weight-bold headline mt-2">Personal Wallet</div>
            <div class="subtitle-2 mb-0">{{ totalPortfolioEthValue }} ETH / {{ `${totalPortfolioValue} ${selectedCurrency}` }}</div>
            <div class="caption torus_text--text text--lighten-4">{{ selectedAddress }}</div>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list>
        <v-list-item>
          <v-list-item-action class="mr-2">
            <img :src="require('../../public/img/icons/import-grey.svg')" />
          </v-list-item-action>
          <v-list-item-content>Add Account</v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-action class="mr-2">
            <img :src="require('../../public/img/icons/plus-circle-grey.svg')" />
          </v-list-item-action>
          <v-list-item-content>Import Account</v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list>
        <v-list-item>
          <v-list-item-action class="mr-2">
            <img :src="require('../../public/img/icons/info-grey.svg')" />
          </v-list-item-action>
          <v-list-item-content>Info and Support</v-list-item-content>
        </v-list-item>
      </v-list>

      <v-card-actions>
        <v-btn text class="torus_text--text text--lighten-4 font-weight-bold mb-6 ml-2">Log Out</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
import { significantDigits } from '../utils/utils'

export default {
  computed: {
    userEmail() {
      return this.$store.state.email
    },
    selectedAddress() {
      return this.$store.state.selectedAddress
    },
    selectedCurrency() {
      return this.$store.state.selectedCurrency
    },
    getCurrencyMultiplier() {
      const { selectedCurrency, currencyData } = this.$store.state || {}
      let currencyMultiplier = 1
      if (selectedCurrency !== 'ETH') currencyMultiplier = currencyData[selectedCurrency.toLowerCase()] || 1
      return currencyMultiplier
    },
    totalPortfolioValue() {
      return this.$store.getters.tokenBalances.totalPortfolioValue || '0'
    },
    totalPortfolioEthValue() {
      return significantDigits(parseFloat(this.totalPortfolioValue.replace(',', '')) / this.getCurrencyMultiplier)
    }
  },
  created() {
    console.log(this.$store.state.email)
  }
}
</script>
