<template>
  <v-container fill-height>
    <v-layout row wrap align-start justify-center align-content-start>
      <v-flex xs12 sm5>
        <span>
          <span class="spanWrapSvgStyle">
            <img :src="require('../../public/images/wallet-blue.svg')" alt="Wallet" class="svg-setting-small" />
          </span>
          <span class="text-bluish headline"> My Portfolio</span>
          <span class="spanWrapSvgStyle" v-show="isRefreshVisible">
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
              class="select-width spanWrapSvgStyle d-inline-flex ml-2"
              single-line
              solo
              flat
              :items="supportedCurrencies"
              :value="selectedCurrency"
              label=""
              @change="onCurrencyChange"
            ></v-select>
          </span>
        </div>
      </v-flex>
      <v-flex xs12>
        <token-balances-table :headers="headers" :tokenBalances="finalBalancesArray" @update:select="select" :selected="selected" />
      </v-flex>
      <v-flex xs12>
        <v-layout row wrap>
          <v-flex offset-xs1 class="text-xs-left" id="flexibtn">
            <v-tooltip bottom :disabled="!isTransferDisabled">
              <template v-slot:activator="{ on }">
                <span v-on="on">
                  <v-btn :disabled="isTransferDisabled" outline large class="btnStyle" @click="initiateTransfer">Transfer</v-btn>
                </span>
              </template>
              <span>Please select a coin/token</span>
            </v-tooltip>
            <v-btn outline large class="btnStyle" @click="topup">Top-up</v-btn>
          </v-flex>
          <v-flex xs2 align-self-center class="hidden-xs-only">
            <img :src="require('../../public/images/torus_logo.png')" />
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
// The color of dropdown icon requires half day work in modifying v-select
import config from '../config'
import TokenBalancesTable from '../components/TokenBalancesTable.vue'
import { MAINNET } from '../utils/enums'

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
      ],
      selected: []
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
    },
    isTransferDisabled() {
      return this.selected.length === 0
    },
    isRefreshVisible() {
      return this.$store.state.networkType === MAINNET
    }
  },
  methods: {
    select(selectedItem) {
      // this is so that we don't break their api
      this.selected = []
      this.finalBalancesArray.forEach(item => {
        if (item.id === selectedItem.id) {
          this.selected.push(item)
        }
      })
    },
    onCurrencyChange(value) {
      this.$store.dispatch('setSelectedCurrency', value)
    },
    refreshBalances() {
      this.$store.dispatch('forceFetchTokens')
    },
    initiateTransfer() {
      this.$router.push({ path: '/wallet/transfer', query: { address: this.selected[0].tokenAddress.toLowerCase() } })
    },
    topup() {
      window.alert('coming soon')
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
  width: 80px;
}

#flexibtn .btnStyle {
  width: 141px;
  height: 41px;
  border: #fff;
  border-radius: 45px;
  background-color: #fff !important;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
}

.v-text-field--solo .v-input__slot,
.v-text-field--outline .v-input__slot {
  min-height: auto !important;
  display: flex !important;
  align-items: flex-end !important;
  border-radius: 17px !important;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.16);
  margin-top: 20px;
  margin-bottom: 0px;
}

.v-text-field.v-text-field--solo .v-input__control {
  min-height: auto !important;
}
</style>
