<template>
  <v-card width="400">
    <v-list>
      <v-list-item>
        <v-list-item-avatar class="mr-2">
          <img :src="profileImage" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            <div class="font-weight-bold headline">{{ userName }}'s Account</div>
          </v-list-item-title>
          <v-list-item-subtitle>
            <v-layout>
              <v-flex xs10>
                <div class="caption">{{ slicedSelectedAddress }}</div>
                <div class="caption">
                  <show-tool-tip :address="selectedAddress">
                    {{ selectedAddress }}
                  </show-tool-tip>
                </div>
              </v-flex>
              <v-flex xs2 grow-shrink-0>
                <v-btn icon small @click="isShowPrivateKey = !isShowPrivateKey">
                  <img width="16" :src="require(`../../public/img/icons/eye${isShowPrivateKey ? '-off' : ''}-primary.svg`)" />
                </v-btn>
              </v-flex>
            </v-layout>
          </v-list-item-subtitle>
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
      <v-list-item v-for="headerItem in headerItems" :key="headerItem.name" link router :to="headerItem.route">
        <v-list-item-content>
          <v-list-item-title>{{ headerItem.display }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
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
</template>

<script>
import { significantDigits, addressSlicer } from '../utils/utils'
import ShowToolTip from '../components/ShowToolTip.vue'

export default {
  props: ['headerItems'],
  components: {
    ShowToolTip
  },
  data() {
    return {
      isShowPrivateKey: false
    }
  },
  computed: {
    userEmail() {
      return this.$store.state.email
    },
    userName() {
      return this.$store.state.name
    },
    profileImage() {
      return this.$store.state.profileImage
    },
    selectedAddress() {
      return this.$store.state.selectedAddress
    },
    slicedSelectedAddress() {
      return addressSlicer(this.$store.state.selectedAddress)
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
  }
}
</script>

<style lang="scss" scoped>
.break-word {
  word-break: break-word;
}
</style>
