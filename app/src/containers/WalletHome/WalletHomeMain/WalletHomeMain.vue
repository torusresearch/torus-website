<template>
  <div class="wallet-home">
    <v-layout wrap align-start :class="$vuetify.breakpoint.xsOnly ? 'mt-2' : 'mt-3'">
      <v-flex xs12 sm4 pl-4>
        <div class="font-weight-bold headline float-left">{{ t('walletHome.walletHome') }}</div>
      </v-flex>
      <v-flex xs8 sm8 px-4 class="text-right hidden-xs-only">
        <v-btn
          outlined
          large
          color="primary"
          class="transfer-btn py-1 mr-4"
          :class="$vuetify.breakpoint.smAndDown ? 'px-8' : 'px-12'"
          @click="initiateTransfer"
        >
          <v-icon left>$vuetify.icons.send</v-icon>
          {{ t('walletHome.transfer') }}
        </v-btn>
        <v-btn
          v-show="canShowLrc"
          depressed
          large
          color="primary"
          class="py-1 topup-btn hidden-xs-only"
          :class="$vuetify.breakpoint.smAndDown ? 'px-8' : 'px-12'"
          @click="topup"
        >
          <v-icon left>$vuetify.icons.add</v-icon>
          {{ t('walletHome.topUp') }}
        </v-btn>
      </v-flex>

      <v-flex xs12 :class="$vuetify.breakpoint.xsOnly ? '' : 'mb-2'">
        <v-layout class="home-cards" wrap>
          <v-flex xs12 sm6 px-4 my-4 :class="$vuetify.breakpoint.xsOnly ? 'mb-4' : ''">
            <v-card class="card-total card-shadow">
              <v-card-title class="font-weight-bold subtitle-2 pt-6 px-6">
                <v-layout>
                  <v-flex>
                    <span>{{ t('walletHome.totalValue') }}</span>
                  </v-flex>
                  <v-flex text-right>
                    <ExportQrCode></ExportQrCode>
                  </v-flex>
                </v-layout>
              </v-card-title>
              <v-card-text class="pb-8 px-6">
                <ComponentLoader v-if="!weiBalanceLoaded || !tokenDataLoaded" class="mt-3" />
                <h2 v-else :class="$vuetify.breakpoint.smAndDown ? 'display-1' : 'display-2'" class="text_2--text font-weight-bold text-clamp-one">
                  {{ totalPortfolioValue }}
                  <span id="selected-currency" class="body-2 font-weight-light">{{ selectedCurrency }}</span>
                </h2>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex v-if="isFreshAccount" xs12 sm6 px-4 my-4>
            <v-card class="card-shadow">
              <v-card-text class="pt-0" :class="$vuetify.breakpoint.lgAndUp ? 'pb-2 px-8' : 'pb-3 px-6'">
                <v-layout>
                  <v-flex
                    class="text_1--text pt-4"
                    :class="$vuetify.breakpoint.xsOnly ? 'xs12 text-center' : $vuetify.breakpoint.lgAndUp ? 'xs8' : 'xs9'"
                  >
                    <div class="body-1 font-weight-bold">{{ t('walletHome.welcome') }} Torus.</div>
                    <v-dialog v-model="dialogLearnMore" max-width="700">
                      <template v-slot:activator="{ on }">
                        <div class="body-2'">
                          <a id="learn-more-btn" class="primary--text font-weight-bold" v-on="on">
                            {{ t('walletHome.learnMore') }}
                          </a>
                          {{ t('walletHome.aboutWallet') }}.
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
          <v-flex v-for="(event, i) in isFreshAccount ? [] : events" :key="`event-${i}`" xs12 sm6 px-4 my-4>
            <PromotionCard
              :title="event.eventName"
              :image-path="event.imageUrl"
              :subtitle="event.description"
              :details-link="event.callToActionLink"
              :details-text="event.callToActionText"
            ></PromotionCard>
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
              class="transfer-btn-mobile py-1 mr-4 mt-4"
              @click="initiateTransfer"
            >
              <v-icon left>$vuetify.icons.send</v-icon>
              {{ t('walletHome.transfer') }}
            </v-btn>
          </v-flex>
          <v-flex xs6 class="pl-1">
            <v-btn depressed large block color="primary" class="py-1 mt-4 topup-btn-mobile hidden-sm-and-up" @click="topup">
              <v-icon left>$vuetify.icons.add</v-icon>
              {{ t('walletHome.topUp') }}
            </v-btn>
          </v-flex>
        </v-layout>
      </v-flex>

      <v-flex xs12>
        <v-layout wrap justify-space-between align-center>
          <v-flex v-if="showSearch" xs12 sm6 px-4>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  v-model="search"
                  outlined
                  hide-details
                  class="search-field"
                  placeholder="Search for Tokens"
                  append-icon="$vuetify.icons.search"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs12 sm6 px-4 class="balance-filter" :class="showSearch ? 'pt-2' : ''">
            <v-layout>
              <v-flex xs7 class="refresh">
                <v-btn small icon @click="refreshBalances">
                  <v-icon color="primary" small>$vuetify.icons.refresh</v-icon>
                </v-btn>
                <span class="caption text_2--text">{{ t('walletHome.lastUpdate') }} {{ lastUpdated }}</span>
              </v-flex>
              <v-flex xs5 class="text-right currency">
                <span class="caption text_2--text">{{ t('walletHome.currency') }}:</span>
                <v-select
                  id="currency-selector"
                  class="pt-0 mt-0 ml-1 caption currency-selector e2e-currency-selector-container"
                  height="25px"
                  hide-details
                  :items="supportedCurrencies"
                  :value="selectedCurrency"
                  append-icon="$vuetify.icons.select"
                  @change="onCurrencyChange"
                ></v-select>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>

      <v-flex xs12 px-4 mt-5>
        <v-tabs v-model="activeTab">
          <v-tab :key="t('walletHome.tokens')" class="home-tab-token">
            <v-icon left>$vuetify.icons.token</v-icon>
            {{ t('walletHome.tokens') }}
          </v-tab>
          <v-tab :key="t('walletHome.collectibles')" class="home-tab-collectibles">
            <v-icon left>$vuetify.icons.collectibles</v-icon>
            {{ t('walletHome.collectibles') }}
          </v-tab>
        </v-tabs>
      </v-flex>
    </v-layout>

    <v-tabs-items v-model="activeTab" class="token-tab-content">
      <v-tab-item>
        <TokenBalancesTable :token-balances="filteredBalancesArray" :selected="selected" @update:select="select" />
      </v-tab-item>
      <v-tab-item>
        <CollectiblesList></CollectiblesList>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
// The color of dropdown icon requires half day work in modifying v-select
import ComponentLoader from '../../../components/helpers/ComponentLoader'
import ExportQrCode from '../../../components/helpers/ExportQrCode'
import CollectiblesList from '../../../components/WalletHome/CollectiblesList'
import LearnMore from '../../../components/WalletHome/LearnMore'
import PromotionCard from '../../../components/WalletHome/PromotionCard'
import TokenBalancesTable from '../../../components/WalletHome/TokenBalancesTable'
import config from '../../../config'
import { LOCALE_EN, MAINNET } from '../../../utils/enums'

export default {
  name: 'WalletHome',
  components: { TokenBalancesTable, CollectiblesList, ExportQrCode, PromotionCard, LearnMore, ComponentLoader },
  data() {
    return {
      supportedCurrencies: ['ETH', ...config.supportedCurrencies],
      selected: [],
      search: '',
      lastUpdated: '',
      dialogLearnMore: false,
      activeTab: 0
    }
  },
  computed: {
    canShowLrc() {
      return process.env.VUE_APP_TORUS_BUILD_ENV !== 'lrc'
    },
    totalPortfolioValue() {
      return this.$store.getters.tokenBalances.totalPortfolioValue || '0'
    },
    weiBalanceLoaded() {
      return this.$store.state.weiBalanceLoaded
    },
    tokenDataLoaded() {
      return this.$store.state.tokenDataLoaded
    },
    finalBalancesArray() {
      const balances = this.$store.getters.tokenBalances.finalBalancesArray
      return balances || []
    },
    filteredBalancesArray() {
      const search = this.search || ''
      const regEx = new RegExp(search, 'i')

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
      const events = []
      const lang = this.$vuetify.lang.current
      const { billboard } = this.$store.state

      Object.keys(billboard).forEach(key => {
        const event = billboard[key]
        const finalEvent = event[lang] || event[LOCALE_EN]
        events.push(finalEvent)
      })

      return events
    }
  },
  mounted() {
    this.setDateUpdated()

    this.activeTab = this.$route.hash === '#collectibles' ? 1 : 0
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
      this.$router.push({ name: 'walletTransfer' }).catch(_ => {})
    },
    topup() {
      this.$router.push({ path: '/wallet/topup' }).catch(_ => {})
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
        .slice(2, 4)}`

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
  }
}
</script>

<style lang="scss" scoped>
@import 'WalletHomeMain.scss';
</style>
