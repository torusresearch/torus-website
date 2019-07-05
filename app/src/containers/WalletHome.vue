<script>
// The color of dropdown icon requires half day work in modifying v-select
import config from '../config'
// import TokenBalancesTable from '../components/TokenBalancesTable.vue'
import { MAINNET } from '../utils/enums'

export default {
  name: 'walletHome',
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
      // let balances = this.$store.getters.tokenBalances.finalBalancesArray
      // balances.push({
      //   balance: '0x0',
      //   computedBalance: 0,
      //   currencyBalance: 'USD 0.00',
      //   currencyRateText: '1 ETH = 285.24 USD',
      //   decimals: 18,
      //   erc20: false,
      //   formattedBalance: 'ETH 0',
      //   id: 'ETH',
      //   logo: 'eth.svg',
      //   name: 'Bit Coin',
      //   symbol: 'ETH',
      //   tokenAddress: '0x'
      // })

      return this.$store.getters.tokenBalances.finalBalancesArray || 0
      // return balances || []
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
      return this.finalBalancesArray.length <= 1
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
        <span class="text-black font-weight-bold headline">My Wallet</span>
        <v-card class="mx-auto mt-3 py-4 px-3 card-total" color="dark" white>
          <v-card-title class="font-weight-bold">
            TOTAL VALUE
          </v-card-title>
          <v-card-text class="headline font-weight-bold">
            <h2>{{ totalPortfolioValue }} <small class="font-weight-light">USD</small></h2>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs6 px-3 :class="{ 'pt-3': isFreshAccount }" :style="{ order: isFreshAccount ? 2 : 0 }">
        <div>
          <div class="headline mb-4">Operations</div>
          <div>
            <v-btn outline color="primary" class="px-5 py-1" @click="topup">
              <v-icon color="primary" class="btn-icon mr-1">send</v-icon>
              Send
            </v-btn>
            <v-btn color="primary" class="px-5 py-1" @click="topup">
              <v-icon color="white" class="btn-icon mr-1">add</v-icon>
              Top up
            </v-btn>
          </div>
        </div>
      </v-flex>
    </v-layout>
    <v-layout mt-5 row wrap align-start justify-center align-content-start>
      <!-- <v-flex xs12>
        <span>
          <span class="text-black font-weight-bold headline">My Wallet</span>
          <span class="spanWrapSvgStyle" v-show="isRefreshVisible">
          <v-btn icon size="18" small @click="refreshBalances">
            <img :src="require('../../public/images/sync-blue.svg')" alt="Wallet" class="svg-setting-tiny" />
          </v-btn>
        </span>
        </span>
      </v-flex> -->
      <!-- <v-flex xs12 class="text-sm-right mb-4">
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
      </v-flex> -->
      <!-- <v-flex xs12 class="mb-4">
        <v-card class="mx-auto py-4 px-3 card-total" color="dark" white>
          <v-card-title class="font-weight-bold">
            TOTAL VALUE
          </v-card-title>
          <v-card-text class="headline font-weight-bold">
            <h2>0.00 <small class="font-weight-light">USD</small></h2>
          </v-card-text>
        </v-card>
      </v-flex> -->
      <!-- 
      <v-flex pa-1 class="mb-4 small-card">
        <v-card white color="dark" class="py-4 px-3">
          <v-card-title class="pb-1">
            COINS / TOKEN
          </v-card-title>
          <v-flex>
            <v-card-text class="font-weight-bold d-flex pl-5">
              <span>Ethereum</span>
              <span class="text-sm-right">0.00 ETH</span>
            </v-card-text>
          </v-flex>
        </v-card>
      </v-flex>
      <v-flex pa-1 class="mb-4 small-card">
        <v-card white color="dark" class="py-4 px-3">
          <v-card-title class="font-weight-bold">
            Welcome to Torus. <br />
            Learn more about your wallet today.
          </v-card-title>
          <v-btn color="primary" class="px-4 py-2" @click="topup">
            Learn More
          </v-btn>
        </v-card>
      </v-flex> -->

      <!-- <v-flex xs12>
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
    </v-flex> -->
    </v-layout>
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

.spanWrapSvgStyle {
  display: inline-flex;
  @extend %justify-align;
}

.svg-bcg-color {
  background-color: var(--v-torus_svg_bcg-base);
}

button {
  border-radius: 6px !important;
  box-shadow: none !important;
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

/deep/.v-text-field--solo .v-input__slot,
.v-text-field--outline .v-input__slot {
  min-height: auto !important;
  display: flex !important;
  align-items: flex-end !important;
  border-radius: 17px !important;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.16) !important;
  margin-top: 20px !important;
  margin-bottom: 0px !important;
}

/deep/.v-text-field.v-text-field--solo .v-input__control {
  min-height: auto !important;
}
</style>
