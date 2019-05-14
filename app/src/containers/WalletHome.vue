<template>
  <v-card flat :color="$vuetify.theme.torus_bcg">
    <v-container fill-height>
      <v-layout row wrap align-center justify-center align-content-center>
        <v-flex xs12 sm5>
          <span>
            <span class="spanWrapSvgStyle">
              <img :src="require('../../public/images/wallet-blue.svg')" alt="Wallet" class="svg-setting-small" />
            </span>
            <span class="text-bluish headline"> My Portfolio</span>
            <span class="spanWrapSvgStyle">
              <v-btn icon size="18" small @click="refreshBalances">
                <img :src="require('../../public/images/sync-blue.svg')" alt="Wallet" class="svg-setting-tiny" />
              </v-btn>
            </span>
          </span>
        </v-flex>
        <v-flex xs12 sm5 class="text-sm-right">
          <div>Total Portfolio Value</div>
          <div>
            <span>
              <span class="text-bluish headline spanWrapSvgStyle"> {{ totalPortfolioValue }} </span>
              <v-select
                class="select-width d-inline-flex ml-2 spanWrapSvgStyle"
                height="23"
                :items="supportedCurrencies"
                :value="selectedCurrency"
                label=""
                @change="onCurrencyChange"
              ></v-select>
            </span>
          </div>
        </v-flex>
        <v-flex xs12>
          <token-balances-table :headers="headers" :tokenBalances="finalBalancesArray" />
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
// The color of dropdown icon requires half day work in modifying v-select
import config from '../config'
import TokenBalancesTable from '../components/TokenBalancesTable.vue'

export default {
  name: 'walletHome',
  components: { TokenBalancesTable },
  data() {
    return {
      supportedCurrencies: ['ETH', ...config.supportedCurrencies],
      headers: [
        {
          text: 'Coin',
          align: 'left',
          value: 'name'
        },
        { text: 'Balance', value: 'formattedBalance', align: 'center' },
        { text: 'Value', value: 'currencyBalance', align: 'right' }
      ]
    }
  },
  computed: {
    totalPortfolioValue() {
      return this.$store.getters.tokenBalances.totalPortfolioValue || '$ 0'
    },
    finalBalancesArray() {
      return this.$store.getters.tokenBalances.finalBalancesArray || []
    },
    selectedCurrency() {
      return this.$store.state.selectedCurrency
    }
  },
  methods: {
    onCurrencyChange(value) {
      this.$store.dispatch('setSelectedCurrency', value)
    },
    refreshBalances() {
      this.$store.dispatch('forceFetchTokens')
    }
  }
}
</script>

<style lang="scss">
@mixin svg-size($args...) {
  @each $name, $size in keywords($args) {
    .svg-setting-#{$name} {
      width: $size;
      height: $size;
    }
  }
}

@include svg-size($tiny: 18px, $small: 24px, $medium: 38px, $large: 80px);

%justify-align {
  justify-content: start;
  align-items: center;
}

.spanWrapSvgStyle {
  display: inline-flex;
  @extend %justify-align;
}

.svg-bcg-color {
  background-color: var(--v-torus_svg_bcg-base);
}

.text-bluish {
  color: var(--v-torus_blue-base);
}

.select-width {
  width: 50px;
}
</style>
