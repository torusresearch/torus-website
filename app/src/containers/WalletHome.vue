<template>
  <div>
    <v-layout mt-5 wrap row>
      <v-flex xs12 px-3 mb-3>
        <div class="text-black font-weight-bold headline left">My Wallet</div>
        <div class="right">
          <v-btn outlined large color="grey" class="px-5 py-1 mr-3 mt-3" @click="initiateTransfer">
            <img :src="require('../../public/images/icons/indent-increse-grey.svg')" class="btn-icon mr-1" />
            Send
          </v-btn>
          <v-tooltip top v-model="isFreshAccount">
            <template v-slot:activator="{ on }">
              <v-btn large color="primary" class="px-5 py-1 mt-3" @click="topup" v-on="on">
                <img :src="require('../../public/images/icons/add.svg')" class="btn-icon mr-1" />
                Top up
              </v-btn>
            </template>
            <span>Get ETH!</span>
          </v-tooltip>
        </div>
      </v-flex>

      <v-flex xs12 px-3 mb-4>
        <v-card class="mx-auto card-total card-shadow" color="dark" white>
          <v-card-title class="font-weight-bold subtitle-2 pt-4 px-4">
            TOTAL VALUE
          </v-card-title>
          <v-card-text class="pb-3 px-4">
            <h2 class="display-2 font-weight-bold">{{ totalPortfolioValue }} <small class="font-weight-light">USD</small></h2>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 px-3>
        <v-layout justify-space-between row>
          <v-flex xs6>
            <v-text-field
              v-if="showSearch"
              v-model="search"
              outlined
              hide-details
              class="mr-3 subtitle-2 search-field"
              append-icon="search"
              style="max-width: 120px"
            ></v-text-field>
            <span class="caption">Last update 24/06/19, 16:24</span>
          </v-flex>
          <v-flex xs6 class="text-xs-right" :class="showSearch ? 'pt-2' : ''">
            <span class="subtitle-2">CURRENCY:</span>
            <v-select
              class="pt-0 mt-0 ml-2 subtitle-2 currency-selector"
              height="25px"
              hide-details
              :items="supportedCurrencies"
              :value="selectedCurrency"
              @change="onCurrencyChange"
            ></v-select>
          </v-flex>
        </v-layout>
      </v-flex>

      <v-flex xs12>
        <token-balances-table
          :headers="headers"
          :tokenBalances="filteredBalancesArray"
          @update:select="select"
          :selected="selected"
          :search="search"
        />
      </v-flex>
    </v-layout>
    <!-- <v-layout mt-5 row wrap align-start justify-center align-content-start>
      <v-flex xs12>
        <token-balances-table :headers="headers" :tokenBalances="finalBalancesArray" @update:select="select" :selected="selected" />
      </v-flex>
      <v-flex xs12>
        <v-layout row wrap>
          <v-flex offset-xs1 class="text-xs-left" id="flexibtn">
            <v-tooltip bottom :disabled="!isTransferDisabled">
              <template v-slot:activator="{ on }">
                <span v-on="on">
                  <v-btn :disabled="isTransferDisabled" outlined large class="btnStyle" @click="initiateTransfer">Transfer</v-btn>
                </span>
              </template>
              <span>Please select a coin/token</span>
            </v-tooltip>
            <v-btn outlined large class="btnStyle" @click="topup">Top-up</v-btn>
          </v-flex>
          <v-flex xs2 align-self-center class="hidden-xs-only">
            <img :src="require('../../public/images/torus_logo.png')" />
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout> -->
  </div>
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
      selected: [],
      search: ''
    }
  },
  computed: {
    totalPortfolioValue() {
      return this.$store.getters.tokenBalances.totalPortfolioValue || '0'
    },
    finalBalancesArray() {
      let balances = this.$store.getters.tokenBalances.finalBalancesArray

      return balances || []
    },
    filteredBalancesArray() {
      const search = this.search || ''
      var regEx = new RegExp(search, 'i')

      return this.finalBalancesArray.filter(balance => balance.name.match(regEx))
    },
    selectedCurrency() {
      return this.$store.state.selectedCurrency
    },
    isTransferDisabled() {
      return this.selected.length === 0
    },
    isRefreshVisible() {
      return this.$store.state.networkType === MAINNET
    },
    showSearch() {
      return this.finalBalancesArray.length > 10
    },
    isFreshAccount() {
      return this.filteredBalancesArray.length === 1 && this.filteredBalancesArray[0].computedBalance === 0
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
      // this.$router.push({ path: '/wallet/transfer', query: { address: this.selected[0].tokenAddress.toLowerCase() } })
      this.$router.push({ path: '/wallet/transfer' })
    },
    topup() {
      this.$router.push({ path: '/wallet/topup' })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/nav-selector.mixin';

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

.btn-icon {
  font-size: 1.2rem;
}

.card-total {
  h2 {
    color: #5c6c7f;
    font-size: 3.5rem;

    small {
      font-size: 0.9rem !important;
      letter-spacing: 0.09px;
    }
  }
}

.small-card {
  .v-card {
    min-height: 175px;
  }
}

::v-deep .currency-selector {
  @include navSelector();
  max-width: 50px;
  .v-select__selection {
    color: var(--v-primary-base) !important;
  }
}

button {
  border-radius: 6px !important;
  box-shadow: none !important;
}

::v-deep .v-text-field .v-input__append-inner {
  margin-top: 8px;
}

::v-deep .search-field {
  display: inline-flex;
  .v-input__slot {
    margin: 0;
    min-height: 40px;
  }
  .v-input__append-inner {
    margin-top: 9px;
  }
}

.v-tooltip__content {
  background: #fff;
  border: 1px solid var(--v-primary-base);
  color: var(--v-primary-base);
  &::after {
    content: ' ';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: var(--v-primary-base) transparent transparent transparent;
  }
}
</style>
