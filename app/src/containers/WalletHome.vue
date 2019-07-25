<template>
  <div>
    <v-layout mt-6 wrap>
      <v-flex xs12 px-4 mb-4>
        <div class="font-weight-bold headline float-left">My Wallet</div>
        <div class="float-right">
          <v-btn outlined large color="primary" :disabled="isFreshAccount" class="px-12 py-1 mr-4 mt-4" @click="initiateTransfer">
            <v-icon left>$vuetify.icons.send</v-icon>
            Transfer
          </v-btn>
          <v-tooltip top v-model="isFreshAccount">
            <template v-slot:activator="{ on }">
              <v-btn large color="primary" class="px-12 py-1 mt-4" @click="topup" v-on="on">
                <v-icon left>$vuetify.icons.add</v-icon>
                Top up
              </v-btn>
            </template>
            <span>Get ETH!</span>
          </v-tooltip>
        </div>
      </v-flex>

      <v-flex xs12 px-4 mb-6>
        <v-card class="card-total card-shadow">
          <v-card-title class="font-weight-bold subtitle-2 pt-6 px-6">
            TOTAL VALUE
          </v-card-title>
          <v-card-text class="pb-4 px-6">
            <h2 class="display-2 font-weight-bold">
              {{ totalPortfolioValue }}
              <small class="font-weight-light">{{ selectedCurrency }}</small>
            </h2>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 px-4>
        <v-layout justify-space-between align-center>
          <v-flex xs6>
            <v-text-field
              v-if="showSearch"
              v-model="search"
              outlined
              hide-details
              class="mr-4 caption search-field"
              placeholder="Search"
              style="max-width: 200px"
              append-icon="$vuetify.icons.search"
            ></v-text-field>
            <v-btn text icon small color="primary" @click="refreshBalances()">
              <v-icon small>$vuetify.icons.refresh</v-icon>
            </v-btn>
            <span class="caption">Last update {{ lastUpdated }}</span>
          </v-flex>
          <v-flex xs6 class="text-right" :class="showSearch ? 'pt-2' : ''">
            <span class="subtitle-2">CURRENCY:</span>
            <v-select
              class="pt-0 mt-0 ml-2 subtitle-2 currency-selector"
              height="25px"
              hide-details
              :items="supportedCurrencies"
              :value="selectedCurrency"
              @change="onCurrencyChange"
              append-icon="$vuetify.icons.select"
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
          :isFreshAccount="isFreshAccount"
        />
      </v-flex>
    </v-layout>
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
      search: '',
      lastUpdated: ''
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
    isRefreshVisible() {
      return this.$store.state.networkType === MAINNET
    },
    showSearch() {
      return this.finalBalancesArray.length > 5
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
      this.setDateUpdated()
    },
    initiateTransfer() {
      // this.$router.push({ path: '/wallet/transfer', query: { address: this.selected[0].tokenAddress.toLowerCase() } })
      this.$router.push({ path: '/wallet/transfer' })
    },
    topup() {
      this.$router.push({ path: '/wallet/topup' })
    },
    setDateUpdated() {
      const currentDateTime = new Date()
      const day = currentDateTime
        .getDate()
        .toString()
        .padStart(2, '0')
      const month = (currentDateTime.getMonth() + 1).toString().padStart(2, '0')
      const date = `${day}/${month}/${currentDateTime
        .getFullYear()
        .toString()
        .substring(2, 4)}`

      const hours = currentDateTime
        .getHours()
        .toString()
        .padStart(2, '0')
      const mins = currentDateTime
        .getMinutes()
        .toString()
        .padStart(2, '0')
      const time = `${hours}:${mins}`
      this.lastUpdated = `${date}, ${time}`
    }
  },
  created() {
    this.setDateUpdated()
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

.card-total {
  h2 {
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
    min-height: 40px;
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
