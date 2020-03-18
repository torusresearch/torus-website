<template>
  <v-container class="wallet-home pt-6" :class="$vuetify.breakpoint.xsOnly ? 'px-4' : ''">
    <v-layout wrap align-start>
      <v-flex xs6>
        <div class="font-weight-bold display-1 float-left">Account Balance{{ /** t('walletHome.walletHome') */ }}</div>
      </v-flex>
      <v-flex xs6 class="text-right">
        <ExportQrCode>
          <v-btn icon>
            <v-icon x-small v-text="'$vuetify.icons.qr'" />
          </v-btn>
        </ExportQrCode>
      </v-flex>
    </v-layout>
    <v-layout wrap mx-n4 mt-7>
      <v-flex px-4 xs12 md6>
        <v-card class="card-total elevation-1">
          <v-layout wrap class="pa-6">
            <v-flex xs6>
              <span class="title torus_black--text">{{ t('walletHome.totalValue') }}</span>
            </v-flex>
            <v-flex xs6 class="text-right">
              <NetworkDisplay :network="storeNetworkType.networkName" :store-network-type="storeNetworkType"></NetworkDisplay>
            </v-flex>
            <v-flex xs8>
              <ComponentLoader v-if="!weiBalanceLoaded || !tokenDataLoaded" class="mt-3" />
              <h2 v-else class="display-4 text_2--text font-weight-bold text-clamp-one">
                {{ totalPortfolioValue }}
                <span id="selected-currency" class="description">{{ selectedCurrency }}</span>
              </h2>
            </v-flex>
            <v-flex xs4 class="text-right align-self-end">
              <span class="description">1ETH = 300USD</span>
            </v-flex>
            <v-flex xs12>
              <v-layout class="mx-n2 mt-3">
                <v-flex xs6 px-2>
                  <v-btn
                    v-show="canShowLrc"
                    block
                    large
                    class="elevation-3 torus_brand1--text"
                    :class="$vuetify.theme.isDark ? 'torus_black_2' : 'white'"
                    @click="topup"
                  >
                    <v-icon left>$vuetify.icons.add</v-icon>
                    {{ t('walletHome.topUp') }}
                  </v-btn>
                </v-flex>
                <v-flex xs6 px-2>
                  <v-btn
                    block
                    large
                    class="elevation-3 torus_brand1--text"
                    :class="$vuetify.theme.isDark ? 'torus_black_2' : 'white'"
                    @click="initiateTransfer"
                  >
                    <v-icon left>$vuetify.icons.send</v-icon>
                    {{ t('walletHome.transfer') }}
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
      <v-flex v-if="isFreshAccount" px-4 xs12 md6 :class="$vuetify.breakpoint.mdAndUp ? 'mt-0' : 'mt-7'">
        <v-card class="card-shadow elevation-1">
          <v-card-text class="pt-0" :class="$vuetify.breakpoint.lgAndUp ? 'pb-2 px-8' : 'pb-3 px-6'">
            <v-layout>
              <v-flex class="pt-4" :class="$vuetify.breakpoint.xsOnly ? 'xs12 text-center' : $vuetify.breakpoint.lgAndUp ? 'xs8' : 'xs9'">
                <div class="body-1 font-weight-bold">{{ t('walletHome.welcome') }} Torus.</div>
                <v-dialog v-model="dialogLearnMore" max-width="700">
                  <template v-slot:activator="{ on }">
                    <div class="body-2'">
                      <a id="learn-more-btn" class="torus_brand1--text font-weight-bold" v-on="on">
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
      <v-flex
        v-for="(event, i) in isFreshAccount ? [] : events"
        :key="`event-${i}`"
        px-4
        xs12
        md6
        :class="$vuetify.breakpoint.mdAndUp ? 'mt-0' : 'mt-7'"
      >
        <PromotionCard
          :title="event.eventName"
          :image-path="event.imageUrl"
          :subtitle="event.description"
          :details-link="event.callToActionLink"
          :details-text="event.callToActionText"
        ></PromotionCard>
      </v-flex>
    </v-layout>
    <v-layout class="mt-12">
      <v-flex xs12>
        <v-tabs v-model="activeTab" class="home-tab" centered>
          <v-tab :key="t('walletHome.tokens')" class="home-tab-token body-2 font-weight-bold">
            <v-icon class="mr-1" small left>$vuetify.icons.token</v-icon>
            {{ t('walletHome.tokens') }}
          </v-tab>
          <v-tab :key="t('walletHome.collectibles')" class="home-tab-collectibles body-2 font-weight-bold">
            <v-icon class="mr-1" small left>$vuetify.icons.collectibles</v-icon>
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
  </v-container>
</template>

<script>
// The color of dropdown icon requires half day work in modifying v-select
import ComponentLoader from '../../../components/helpers/ComponentLoader'
import ExportQrCode from '../../../components/helpers/ExportQrCode'
import NetworkDisplay from '../../../components/helpers/NetworkDisplay'
import CollectiblesList from '../../../components/WalletHome/CollectiblesList'
import LearnMore from '../../../components/WalletHome/LearnMore'
import PromotionCard from '../../../components/WalletHome/PromotionCard'
import TokenBalancesTable from '../../../components/WalletHome/TokenBalancesTable'
import config from '../../../config'
import { LOCALE_EN, MAINNET } from '../../../utils/enums'

export default {
  name: 'WalletHome',
  components: { TokenBalancesTable, CollectiblesList, ExportQrCode, PromotionCard, LearnMore, ComponentLoader, NetworkDisplay },
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
    },
    storeNetworkType() {
      return this.$store.state.networkType
    }
  },
  mounted() {
    this.setDateUpdated()

    this.activeTab = this.$route.hash === '#collectibles' ? 1 : 0

    this.$vuetify.goTo(0)
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
