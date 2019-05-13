<template>
  <v-card flat :color="$vuetify.theme.torus_bcg">
    <v-container fill-height>
      <v-layout row wrap align-center justify-center align-content-center>
        <v-flex xs12 sm5>
          <span>
            <span class="spanWrapSvgStyle">
              <img src="images/wallet-blue.svg" alt="Wallet" class="svg-setting-small" />
            </span>
            <span class="text-bluish headline"> My Portfolio</span>
            <span class="spanWrapSvgStyle">
              <v-btn icon size="18" small>
                <img src="images/sync-blue.svg" alt="Wallet" class="svg-setting-tiny" />
              </v-btn>
            </span>
          </span>
        </v-flex>
        <v-flex xs12 sm5 class="text-sm-right">
          <div>Total Portfolio Value</div>
          <div>
            <span>
              <span class="text-bluish headline spanWrapSvgStyle"> {{ tokenBalances.totalPortfolioValue }} </span>
              <v-select
                class="select-width d-inline-flex ml-2 spanWrapSvgStyle"
                height="23"
                :items="supportedCurrencies"
                v-model="selectedCurrency"
                label=""
                @change="onCurrencyChange"
              ></v-select>
            </span>
          </div>
        </v-flex>
        <v-flex xs12>
          <token-balances-table :headers="headers" :tokenBalances="tokenBalances.finalBalancesArray" />
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
// The color of dropdown icon requires half day work in modifying v-select
import config from '../config'
import TokenBalancesTable from '../components/TokenBalancesTable.vue'
import torus from '../torus'
import { significantDigits } from '../utils/utils'

const web3Utils = torus.web3.utils

export default {
  name: 'walletHome',
  components: { TokenBalancesTable },
  computed: {
    tokenBalances() {
      const { weiBalance, tokenData, tokenRates, currencyData } = this.$store.state || {}
      let currencyMultiplier = 1
      if (this.selectedCurrency !== 'ETH') currencyMultiplier = currencyData[this.selectedCurrency.toLowerCase()] || 1
      let full = [{ balance: weiBalance, decimals: 18, erc20: false, logo: 'eth.svg', name: 'Ethereum', symbol: 'ETH', tokenAddress: '0x' }]
      // because vue is stupid
      if (Object.keys(tokenData).length > 0) {
        full = [...full, ...tokenData]
      }
      let totalPortfolioValue = 0
      const finalBalancesArray = full.map(x => {
        const computedBalance = parseFloat(web3Utils.hexToNumberString(x.balance)) / 10 ** parseFloat(x.decimals) || 0
        let tokenRateMultiplier = 1
        if (x.tokenAddress !== '0x') tokenRateMultiplier = tokenRates[x.tokenAddress.toLowerCase()] || 0
        const currencyRate = currencyMultiplier * tokenRateMultiplier
        const currencyBalance = computedBalance * currencyRate
        totalPortfolioValue += currencyBalance
        return {
          ...x,
          id: x.symbol,
          formattedBalance: `${x.symbol} ${significantDigits(computedBalance || 0)}`,
          currencyBalance: `${this.selectedCurrency} ${significantDigits(currencyBalance || 0)}`,
          currencyRateText: `1 ${x.symbol} = ${significantDigits(currencyRate || 0)} ${this.selectedCurrency}`
        }
      })
      return { finalBalancesArray, totalPortfolioValue: `${significantDigits(totalPortfolioValue) || 0}` }
    }
  },
  data() {
    return {
      supportedCurrencies: ['ETH', ...config.supportedCurrencies],
      selectedCurrency: 'USD',
      totalPortfolioValue: '$ 0',
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
  methods: {
    onCurrencyChange() {
      if (this.selectedCurrency !== 'ETH') this.$store.dispatch('setSelectedCurrency', this.selectedCurrency.toLowerCase())
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
