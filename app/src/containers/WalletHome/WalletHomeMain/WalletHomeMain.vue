<template>
  <div class="wallet-home">
    <v-layout wrap align-center :class="$vuetify.breakpoint.xsOnly ? 'mt-2' : 'mt-3'">
      <v-flex xs6 px-4>
        <div class="font-weight-bold headline float-left">{{ pageHeader }}</div>
      </v-flex>
      <v-flex xs6 px-4 class="text-right hidden-xs-only">
        <v-btn outlined large color="primary" :disabled="isFreshAccount" class="transfer-btn px-12 py-1 mr-4 mt-4" @click="initiateTransfer">
          <v-icon left>$vuetify.icons.send</v-icon>
          Transfer
        </v-btn>
        <v-tooltip top :value="isFreshAccount" class="hidden-xs-only">
          <template v-slot:activator="{ on }">
            <v-btn depressed large color="primary" class="px-12 py-1 mt-4 topup-btn hidden-xs-only" @click="topup" v-on="on">
              <v-icon left>$vuetify.icons.add</v-icon>
              Top up
            </v-btn>
          </template>
          <div class="outline-tooltip hidden-xs-only">
            <span>Get ETH!</span>
          </div>
        </v-tooltip>
      </v-flex>

      <v-flex xs12 :class="$vuetify.breakpoint.xsOnly ? '' : 'mb-2'">
        <v-layout class="home-cards" wrap>
          <v-flex xs12 sm6 px-4 my-4 :class="$vuetify.breakpoint.xsOnly ? 'mb-4' : ''">
            <v-card class="card-total card-shadow">
              <v-card-title class="font-weight-bold subtitle-2 pt-6 px-6">
                <v-layout>
                  <v-flex>
                    <span>TOTAL VALUE</span>
                  </v-flex>
                  <v-flex text-right>
                    <export-qr-code></export-qr-code>
                  </v-flex>
                </v-layout>
              </v-card-title>
              <v-card-text class="pb-8 px-6">
                <h2 class="display-2 text_2--text font-weight-bold">
                  {{ totalPortfolioValue }}
                  <span id="selected-currency" class="body-2 font-weight-light">{{ selectedCurrency }}</span>
                </h2>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12 sm6 px-4 my-4 v-if="isFreshAccount">
            <v-card class="card-shadow">
              <v-card-text class="pt-0" :class="$vuetify.breakpoint.lgAndUp ? 'pb-2 px-8' : 'pb-3 px-6'">
                <v-layout>
                  <v-flex
                    class="text_1--text pt-4"
                    :class="$vuetify.breakpoint.xsOnly ? 'xs12 text-center' : $vuetify.breakpoint.lgAndUp ? 'xs8' : 'xs9'"
                  >
                    <div class="body-1 font-weight-bold">Welcome to Torus.</div>
                    <v-dialog v-model="dialogLearnMore" max-width="700">
                      <template v-slot:activator="{ on }">
                        <div class="body-2'">
                          <a id="learn-more-btn" class="primary--text font-weight-bold" v-on="on">Learn more</a>
                          about your wallet today.
                        </div>
                      </template>
                      <LearnMore @onClose="dialogLearnMore = false" />
                    </v-dialog>
                  </v-flex>
                  <v-flex xs4 pt-4 class="text-right hidden-xs-only">
                    <img
                      :src="require(`../../../../public/images/${$vuetify.theme.dark ? 'home-illustration' : 'learn-more'}.svg`)"
                      style="height: 90px"
                    />
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12 sm6 px-4 my-4 v-for="(event, i) in isFreshAccount ? [] : events" :key="`event-${i}`">
            <promotion-card
              :title="event.eventName"
              :image-path="event.imageUrl"
              :subtitle="event.description"
              :details-link="event.callToActionLink"
              :details-text="event.callToActionText"
            ></promotion-card>
          </v-flex>
        </v-layout>
      </v-flex>

      <v-flex xs12 px-4 class="hidden-sm-and-up mb-3">
        <v-layout>
          <v-flex xs6 class="pr-1">
            <v-btn
              outlined
              large
              block
              color="primary"
              :disabled="isFreshAccount"
              class="transfer-btn-mobile px-12 py-1 mr-4 mt-4"
              @click="initiateTransfer"
            >
              <v-icon left>$vuetify.icons.send</v-icon>
              Transfer
            </v-btn>
          </v-flex>
          <v-flex xs6 class="pl-1">
            <v-tooltip top :value="isFreshAccount" class="hidden-sm-and-up">
              <template v-slot:activator="{ on }">
                <v-btn depressed large block color="primary" class="px-12 py-1 mt-4 topup-btn-mobile hidden-sm-and-up" @click="topup" v-on="on">
                  <v-icon left>$vuetify.icons.add</v-icon>
                  Top up
                </v-btn>
              </template>
              <div class="outline-tooltip hidden-sm-and-up">
                <span>Get ETH!</span>
              </div>
            </v-tooltip>
          </v-flex>
        </v-layout>
      </v-flex>

      <v-flex xs12>
        <v-layout wrap justify-space-between align-center>
          <v-flex xs12 sm6 px-4 v-if="showSearch">
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  v-model="search"
                  outlined
                  hide-details
                  class="caption search-field"
                  placeholder="Search"
                  append-icon="$vuetify.icons.search"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs12 sm6 px-4 class="balance-filter" :class="showSearch ? 'pt-2' : ''">
            <v-layout>
              <v-flex xs7 class="refresh">
                <v-icon color="primary" @click="refreshBalances()" small>$vuetify.icons.refresh</v-icon>
                <span class="caption text_2--text">Last update {{ lastUpdated }}</span>
              </v-flex>
              <v-flex xs5 class="text-right currency">
                <span class="caption text_2--text">CURRENCY:</span>
                <v-select
                  id="currency-selector"
                  class="pt-0 mt-0 ml-1 caption currency-selector e2e-currency-selector-container"
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

      <v-flex xs12 px-4 mt-5>
        <v-tabs v-model="activeTab">
          <v-tab class="home-tab-token">
            <v-icon left>$vuetify.icons.token</v-icon>
            Tokens
          </v-tab>
          <v-tab class="home-tab-collectibles">
            <v-icon left>$vuetify.icons.collectibles</v-icon>
            Collectibles
          </v-tab>
        </v-tabs>
      </v-flex>
    </v-layout>

    <v-tabs-items v-model="activeTab" class="token-tab-content">
      <v-tab-item>
        <token-balances-table :tokenBalances="filteredBalancesArray" @update:select="select" :selected="selected" />
      </v-tab-item>
      <v-tab-item>
        <collectibles-list></collectibles-list>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
// The color of dropdown icon requires half day work in modifying v-select
import config from '../../../config'
import TokenBalancesTable from '../../../components/WalletHome/TokenBalancesTable'
import CollectiblesList from '../../../components/WalletHome/CollectiblesList'
import ExportQrCode from '../../../components/helpers/ExportQrCode'
import PromotionCard from '../../../components/WalletHome/PromotionCard'
import LearnMore from '../../../components/WalletHome/LearnMore'
import { MAINNET, WALLET_HEADERS_HOME } from '../../../utils/enums'
import { get } from '../../../utils/httpHelpers'

export default {
  name: 'walletHome',
  components: { TokenBalancesTable, CollectiblesList, ExportQrCode, PromotionCard, LearnMore },
  data() {
    return {
      pageHeader: WALLET_HEADERS_HOME,
      supportedCurrencies: ['ETH', ...config.supportedCurrencies],
      selected: [],
      search: '',
      lastUpdated: '',
      dialogLearnMore: false,
      activeTab: 0
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
      return this.$store.state.networkType.host === MAINNET
    },
    showSearch() {
      return this.finalBalancesArray.length > 5
    },
    isFreshAccount() {
      return this.$store.state.isNewUser
    },
    events() {
      return this.$store.state.billboard
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
      this.$store.dispatch('setSelectedCurrency', { selectedCurrency: value, origin: 'home' })
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
  mounted() {
    this.setDateUpdated()

    this.activeTab = this.$route.hash === '#collectibles' ? 1 : 0
  }
}
</script>

<style lang="scss" scoped>
@import 'WalletHomeMain.scss';
</style>
