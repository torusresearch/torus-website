<template>
  <div class="wallet-home">
    <v-layout wrap align-center :class="$vuetify.breakpoint.xsOnly ? 'mt-2' : 'mt-3'">
      <v-flex xs6 px-4 mb-4>
        <div class="font-weight-bold headline float-left">My Wallet</div>
      </v-flex>
      <v-flex xs6 px-4 mb-4 class="text-right hidden-xs-only">
        <v-btn outlined large color="primary" :disabled="isFreshAccount" class="px-12 py-1 mr-4 mt-4" @click="initiateTransfer">
          <v-icon left>$vuetify.icons.send</v-icon>
          Transfer
        </v-btn>
        <v-tooltip top :value="isFreshAccount">
          <template v-slot:activator="{ on }">
            <v-btn depressed large color="primary" class="px-12 py-1 mt-4" @click="topup" v-on="on">
              <v-icon left>$vuetify.icons.add</v-icon>
              Top up
            </v-btn>
          </template>
          <span>Get ETH!</span>
        </v-tooltip>
      </v-flex>

      <v-flex xs12 px-4 :class="$vuetify.breakpoint.xsOnly ? '' : 'mb-6'">
        <v-card class="card-total card-shadow">
          <v-card-title class="font-weight-bold subtitle-2 pt-6 px-6">
            TOTAL VALUE
          </v-card-title>
          <v-card-text class="pb-4 px-6">
            <h2 class="display-2 font-weight-bold">
              {{ totalPortfolioValue }}
              <span class="body-2 font-weight-light">{{ selectedCurrency }}</span>
            </h2>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 px-4 class="hidden-sm-and-up mb-3">
        <v-layout>
          <v-flex xs6 class="pr-1">
            <v-btn outlined large block color="primary" :disabled="isFreshAccount" class="px-12 py-1 mr-4 mt-4" @click="initiateTransfer">
              <v-icon left>$vuetify.icons.send</v-icon>
              Transfer
            </v-btn>
          </v-flex>
          <v-flex xs6 class="pl-1">
            <v-tooltip top :value="isFreshAccount">
              <template v-slot:activator="{ on }">
                <v-btn depressed large block color="primary" class="px-12 py-1 mt-4" @click="topup" v-on="on">
                  <v-icon left>$vuetify.icons.add</v-icon>
                  Top up
                </v-btn>
              </template>
              <span>Get ETH!</span>
            </v-tooltip>
          </v-flex>
        </v-layout>
      </v-flex>

      <v-flex xs12 px-4>
        <v-layout wrap justify-space-between align-center>
          <v-flex xs12 sm6>
            <v-layout wrap>
              <v-flex xs12 sm3 v-if="showSearch">
                <v-text-field
                  v-model="search"
                  outlined
                  hide-details
                  class="caption search-field"
                  placeholder="Search"
                  append-icon="$vuetify.icons.search"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm9 class="hidden-xs-only">
                <v-btn text icon small class="refresh-button" color="primary" @click="refreshBalances()">
                  <v-icon small>$vuetify.icons.refresh</v-icon>
                </v-btn>
                <span class="caption">Last update {{ lastUpdated }}</span>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs12 sm6 class="balance-filter" :class="showSearch ? 'pt-2' : ''">
            <v-layout>
              <v-flex xs8 class="hidden-sm-and-up refresh">
                <v-icon color="primary" @click="refreshBalances()" small>$vuetify.icons.refresh</v-icon>
                <span class="caption">Last update {{ lastUpdated }}</span>
              </v-flex>
              <v-flex xs4 sm12 class="text-right currency">
                <span class="caption">CURRENCY:</span>
                <v-select
                  class="pt-0 mt-0 ml-1 caption currency-selector"
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
        </v-layout>
      </v-flex>

      <v-flex xs12>
        <token-balances-table
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
import config from '../../config'
import TokenBalancesTable from '../../components/WalletHome/TokenBalancesTable'
import { MAINNET } from '../../utils/enums'

export default {
  name: 'walletHome',
  components: { TokenBalancesTable },
  data() {
    return {
      supportedCurrencies: ['ETH', ...config.supportedCurrencies],
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
      return this.$store.state.isNewUser
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
      this.$store.dispatch('setSelectedCurrency', { selectedCurrency: value })
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
@import 'WalletHome.scss';
</style>
