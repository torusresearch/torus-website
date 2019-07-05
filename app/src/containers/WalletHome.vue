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
      return this.$store.getters.tokenBalances.totalPortfolioValue || '0'
    },
    finalBalancesArray() {
      let balances = this.$store.getters.tokenBalances.finalBalancesArray

      return balances || []
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
    isFreshAccount() {
      return this.finalBalancesArray.length === 1 && this.finalBalancesArray[0].computedBalance === 0
      // || true
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
      this.$router.push({ path: '/wallet/topup' })
    }
  }
}
</script>

<template>
  <div>
    <v-layout mt-5 wrap row>
      <v-flex xs6 px-3>
        <div class="text-black font-weight-bold headline mb-3">My Wallet</div>
        <v-card class="mx-auto card-total" color="dark" white>
          <v-card-title class="font-weight-bold pt-4 px-4">
            TOTAL VALUE
          </v-card-title>
          <v-card-text class="headline font-weight-bold pb-4 px-4">
            <h2>{{ totalPortfolioValue }} <small class="font-weight-light">USD</small></h2>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs6 px-3 :class="{ 'pt-3': isFreshAccount }" :style="{ order: isFreshAccount ? 2 : 0 }">
        <div>
          <div class="text-black font-weight-bold headline mb-3">Operations</div>
          <div>
            <v-btn outlined large color="primary" class="px-5 py-1 mr-3" @click="topup">
              <v-icon color="primary" class="btn-icon mr-1">send</v-icon>
              Send
            </v-btn>
            <v-btn large color="primary" class="px-5 py-1" @click="topup">
              <v-icon color="white" class="btn-icon mr-1">add</v-icon>
              Top up
            </v-btn>
          </div>
        </div>
      </v-flex>

      <v-flex :class="isFreshAccount ? 'px-3' : 'pt-4'" :style="{ order: isFreshAccount ? 1 : 2 }">
        <v-layout row align-center justify-end mb-2 :class="isFreshAccount ? '' : 'mr-3'">
          <div class="subheader">CURRENCY:</div>
          <v-select
            class="pt-0 mt-0 ml-2 subheader currency-selector"
            height="25px"
            hide-details
            :items="supportedCurrencies"
            :value="selectedCurrency"
            @change="onCurrencyChange"
          ></v-select>
        </v-layout>
        <v-layout row align-center mr-3 justify-end v-if="!isFreshAccount">
          <v-text-field outlined hide-details class="mr-3 subheading search-field" append-icon="search" style="max-width: 120px"></v-text-field>
          <span class="caption">Last update 24/06/19, 16:24</span>
        </v-layout>
        <token-balances-table
          :headers="headers"
          :isFreshAccount="isFreshAccount"
          :tokenBalances="finalBalancesArray"
          @update:select="select"
          :selected="selected"
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

<style lang="scss" scoped>
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

.currency-selector {
  max-width: 50px;
  ::v-deep .v-select__selection {
    color: #5495f7;
    margin: 0;
  }
}

button {
  border-radius: 6px !important;
  box-shadow: none !important;
}

::v-deep .search-field {
  .v-input__slot {
    margin: 0;
    min-height: 40px;
  }
  .v-input__append-inner {
    margin-top: 9px;
  }
}
</style>
