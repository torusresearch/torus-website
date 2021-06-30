<template>
  <v-container class="wallet-home pt-6" :class="$vuetify.breakpoint.xsOnly ? 'px-4' : ''">
    <div class="d-flex align-center">
      <div class="font-weight-bold text_2--text float-left page-title" :class="{ 'display-1': $vuetify.breakpoint.width > 390 }">
        {{ t('walletHome.walletHome') }}
      </div>
      <div class="ml-auto">
        <QuickAddress />
      </div>
    </div>
    <v-layout wrap mx-n4 mt-7>
      <v-flex px-4 xs12 md6>
        <v-card class="card-total elevation-1 px-6 py-4">
          <div class="d-flex align-center" :style="{ marginBottom: '5px' }">
            <div :style="{ lineHeight: '1em' }">
              <span class="title text_1--text" :style="{ lineHeight: '1em' }">{{ t('walletHome.totalValue') }}</span>
            </div>
            <div class="ml-auto">
              <NetworkDisplay :network="networkType.networkName" :store-network-type="networkType"></NetworkDisplay>
            </div>
          </div>
          <div class="d-flex align-center">
            <div>
              <ComponentLoader v-if="!weiBalanceLoaded || !tokenDataLoaded" class="mt-3" />
              <div v-else class="d-flex align-end">
                <span class="text_2--text text-clamp-one" :class="$vuetify.breakpoint.xsOnly ? 'display-2' : 'display-4'">
                  {{ totalPortfolioValue }}
                </span>
                <v-menu offset-y max-height="300" z-index="20">
                  <template #activator="{ on }">
                    <v-btn
                      x-small
                      text
                      class="text_3--text px-3"
                      :class="{ 'currency-selector': $vuetify.breakpoint.mAndUp }"
                      title="Select currency"
                      aria-label="Select currency"
                      v-on="on"
                    >
                      <span id="selected-currency" class="description">{{ selectedCurrency }}</span>
                      <v-icon class="text_3--text" small>$vuetify.icons.select</v-icon>
                    </v-btn>
                  </template>
                  <v-list class="pa-0" dense>
                    <v-list-item-group color="torusBrand1">
                      <v-list-item
                        v-for="supportedCurrency in supportedCurrencies"
                        :key="supportedCurrency"
                        class="px-2"
                        :class="selectedCurrency === supportedCurrency ? 'active' : ''"
                        @click="onCurrencyChange(supportedCurrency)"
                      >
                        <v-list-item-content>
                          <v-list-item-title>{{ supportedCurrency }}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>
                </v-menu>
              </div>
            </div>
            <div class="ml-auto align-self-end text-right">
              <span class="description text_3--text" :style="{ lineHeight: '0' }">{{ finalBalancesArray[0].currencyRateText }}</span>
            </div>
          </div>
          <v-layout wrap class="mx-n3 mt-2">
            <v-flex xs6 px-3>
              <v-btn
                v-show="canShowLrc && !whiteLabel.topupHide"
                block
                large
                class="torus-btn1 gtm-topup-cta"
                :class="$store.state.whiteLabel.isActive ? 'white--text' : 'torusBrand1--text'"
                :color="$store.state.whiteLabel.isActive ? 'torusBrand1' : ''"
                @click="topup"
              >
                <v-icon left>$vuetify.icons.add</v-icon>
                {{ t('walletHome.topUp') }}
              </v-btn>
            </v-flex>
            <v-flex xs6 px-3>
              <v-btn
                block
                large
                class="torus-btn1 gtm-transfer-cta"
                :class="$store.state.whiteLabel.isActive ? 'white--text' : 'torusBrand1--text'"
                :color="$store.state.whiteLabel.isActive ? 'torusBrand1' : ''"
                @click="initiateTransfer"
              >
                <v-icon left>$vuetify.icons.send</v-icon>
                {{ t('walletHome.transfer') }}
              </v-btn>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
      <v-flex v-if="isFreshAccount || events.length === 0" px-4 xs12 md6 :class="$vuetify.breakpoint.mdAndUp ? 'mt-0' : 'mt-7'">
        <v-card class="card-shadow elevation-1" :style="{ height: $vuetify.breakpoint.xsOnly ? 'inherit' : '159px' }">
          <v-card-text class="pt-0" :class="$vuetify.breakpoint.lgAndUp ? 'pb-2 px-8' : 'pb-3 px-6'">
            <v-layout>
              <v-flex class="pt-4" :class="$vuetify.breakpoint.xsOnly ? 'xs12 text-center' : $vuetify.breakpoint.lgAndUp ? 'xs8' : 'xs9'">
                <div class="text-body-1 font-weight-bold">{{ t('walletHome.welcome') }} Torus.</div>
                <v-dialog v-model="dialogOnboarding" persistent max-width="600">
                  <template #activator="{ on }">
                    <div class="body-2'">
                      <a id="learn-more-btn" class="torusBrand1--text font-weight-bold" v-on="on">
                        {{ t('walletHome.learnMore') }}
                      </a>
                      {{ t('walletHome.aboutWallet') }}.
                    </div>
                  </template>
                  <Onboarding @onClose="dialogOnboarding = false" />
                </v-dialog>
              </v-flex>
              <v-flex xs4 pt-4 class="text-right hidden-xs-only">
                <img
                  :src="require(`../../../assets/images/${$vuetify.theme.dark ? 'home-illustration' : 'learn-more'}.svg`)"
                  :style="{ height: '120px' }"
                  alt="Onboarding"
                />
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex
        v-for="(event, i) in isFreshAccount || whiteLabel.featuredBillboardHide ? [] : events"
        :key="`event-${i}`"
        px-4
        xs12
        md6
        :class="$vuetify.breakpoint.mdAndUp ? 'mt-0' : 'mt-7'"
      >
        <PromotionCard
          :title="event.eventName"
          :image-path="event.imageUrl"
          :image-dark-path="event.imageDarkUrl"
          :subtitle="event.description"
          :details-link="event.callToActionLink"
          :details-link-two="event.callToActionLinkTwo"
          :details-text="event.callToActionText"
        ></PromotionCard>
      </v-flex>
    </v-layout>

    <!-- <v-layout class="mt-8">
      <v-flex xs12>
        <Badges />
      </v-flex>
    </v-layout> -->

    <v-layout wrap align-center class="mt-7">
      <v-flex xs12 md6 :class="{ 'offset-md-3': $vuetify.breakpoint.mdAndUp }">
        <v-tabs v-model="activeTab" class="home-tab" centered hide-slider>
          <v-tab :key="t('walletHome.tokens')" class="home-tab-token gmt-tokens-tab font-weight-bold">
            <v-icon class="mr-1" small left>$vuetify.icons.token</v-icon>
            {{ t('walletHome.tokens') }}
          </v-tab>
          <v-tab :key="t('walletHome.collectibles')" class="home-tab-collectibles gmt-collectibles-tab font-weight-bold">
            <v-icon class="mr-1" small left>$vuetify.icons.collectibles</v-icon>
            {{ t('walletHome.collectibles') }}
          </v-tab>
        </v-tabs>
      </v-flex>
      <v-flex v-if="$vuetify.breakpoint.mdAndUp && activeTab === 0" xs12 md3 class="refresh text-right">
        <div class="mb-1">
          <v-btn
            class="gmt-refresh-tokens refresh-btn"
            :color="$vuetify.theme.isDark ? 'torusBlack2' : 'torusGray4'"
            height="24"
            aria-label="Refresh Balances"
            @click="refreshBalances"
          >
            <v-icon left color="torusFont2" size="8">$vuetify.icons.refresh</v-icon>
            <span class="caption text_2--text">{{ t('walletHome.showAllTokens') }}</span>
          </v-btn>
        </div>
        <div class="text_3--text refresh-text" small>{{ t('walletHome.lastUpdate') }}: {{ lastUpdated }}</div>
      </v-flex>
      <v-flex v-if="showSearch" xs12 mt-4>
        <v-text-field
          v-model="search"
          class="search-tokens text_2--text body-2"
          outlined
          hide-details
          placeholder="Search for Tokens"
          append-icon="$vuetify.icons.search"
        ></v-text-field>
      </v-flex>
    </v-layout>

    <v-tabs-items v-model="activeTab" class="token-tab-content mt-8">
      <v-tab-item>
        <TokenBalancesTable :hide-token-mode="hideTokenMode" :token-balances="filteredBalancesArray" :selected="selected" @update:select="select" />
        <div v-if="hasCustomToken && $vuetify.breakpoint.mdAndUp" class="text-right">
          <v-btn
            class="gmt-edit-tokens refresh-btn"
            :color="$vuetify.theme.isDark ? 'torusBlack2' : 'torusGray4'"
            height="24"
            :aria-label="t('homeToken.editTokens')"
            @click="hideTokenMode = !hideTokenMode"
          >
            <v-icon left class="text_2--text" size="14">$vuetify.icons.pencil_edit</v-icon>
            <span class="caption text_2--text">{{ t('homeToken.editTokens') }}</span>
          </v-btn>
        </div>
      </v-tab-item>
      <v-tab-item>
        <CollectiblesList></CollectiblesList>
      </v-tab-item>
    </v-tabs-items>

    <v-layout v-if="$vuetify.breakpoint.smAndDown" class="mt-10">
      <v-flex xs12 class="refresh text-right">
        <div class="mb-1">
          <v-btn
            class="gmt-refresh-tokens refresh-btn"
            :color="$vuetify.theme.isDark ? 'torusBlack2' : 'torusGray4'"
            height="24"
            aria-label="Refresh Balances"
            @click="refreshBalances"
          >
            <v-icon left color="torusFont2" size="8">$vuetify.icons.refresh</v-icon>
            <span class="caption text_2--text">{{ t('walletHome.showAllTokens') }}</span>
          </v-btn>
          <v-btn
            v-if="hasCustomToken"
            class="gmt-edit-tokens refresh-btn ml-2"
            :color="$vuetify.theme.isDark ? 'torusBlack2' : 'torusGray4'"
            height="24"
            :aria-label="t('homeToken.editTokens')"
            @click="hideTokenMode = !hideTokenMode"
          >
            <v-icon left class="text_2--text" size="14">$vuetify.icons.pencil_edit</v-icon>
            <span class="caption text_2--text">{{ t('homeToken.editTokens') }}</span>
          </v-btn>
        </div>
        <div class="text_3--text refresh-text" small>{{ t('walletHome.lastUpdate') }}: {{ lastUpdated }}</div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

import ComponentLoader from '../../../components/helpers/ComponentLoader'
import NetworkDisplay from '../../../components/helpers/NetworkDisplay'
import QuickAddress from '../../../components/helpers/QuickAddress'
// import Badges from '../../../components/WalletHome/Badges'
import CollectiblesList from '../../../components/WalletHome/CollectiblesList'
import Onboarding from '../../../components/WalletHome/Onboarding'
import PromotionCard from '../../../components/WalletHome/PromotionCard'
import TokenBalancesTable from '../../../components/WalletHome/TokenBalancesTable'
import { LOCALE_EN, MAINNET } from '../../../utils/enums'

export default {
  name: 'WalletHome',
  components: { TokenBalancesTable, CollectiblesList, QuickAddress, PromotionCard, Onboarding, ComponentLoader, NetworkDisplay },
  data() {
    return {
      selected: [],
      search: '',
      lastUpdated: '',
      dialogOnboarding: false,
      activeTab: 0,
      hideTokenMode: false,
    }
  },
  computed: {
    ...mapGetters(['tokenBalances', 'supportedCurrencies']),
    ...mapState({
      whiteLabel: 'whiteLabel',
      weiBalanceLoaded: 'weiBalanceLoaded',
      tokenDataLoaded: 'tokenDataLoaded',
      selectedCurrency: 'selectedCurrency',
      networkType: 'networkType',
      isFreshAccount: 'isNewUser',
      billboard: 'billboard',
    }),
    canShowLrc() {
      return process.env.VUE_APP_TORUS_BUILD_ENV !== 'lrc'
    },
    totalPortfolioValue() {
      return this.tokenBalances.totalPortfolioValue || '0'
    },
    finalBalancesArray() {
      const balances = this.tokenBalances.finalBalancesArray
      return balances || []
    },
    filteredBalancesArray() {
      const search = this.search || ''
      const regEx = new RegExp(search, 'i')

      return this.finalBalancesArray.filter((balance) => balance?.name.match(regEx))
    },
    isRefreshVisible() {
      return this.networkType.host === MAINNET
    },
    showSearch() {
      return this.finalBalancesArray.length > 10
    },
    events() {
      const events = []
      const lang = this.$vuetify.lang.current

      Object.keys(this.billboard).forEach((key) => {
        const event = this.billboard[key]
        const finalEvent = event[lang] || event[LOCALE_EN]
        if (finalEvent) events.push(finalEvent)
      })

      return events
    },
    hasCustomToken() {
      return this.filteredBalancesArray.some((x) => !!x.customTokenId)
    },
  },
  mounted() {
    this.setDateUpdated()

    this.activeTab = this.$route.hash === '#collectibles' ? 1 : 0

    this.$vuetify.goTo(0)
  },
  methods: {
    ...mapActions(['forceFetchTokens', 'setSelectedCurrency']),
    select(selectedItem) {
      // this is so that we don't break their api
      this.selected = []
      this.finalBalancesArray.forEach((item) => {
        if (item.id === selectedItem.id) {
          this.selected.push(item)
        }
      })
    },
    onCurrencyChange(value) {
      this.setSelectedCurrency({ selectedCurrency: value, origin: 'home' })
    },
    refreshBalances() {
      this.forceFetchTokens()
      this.setDateUpdated()
    },
    initiateTransfer() {
      this.$router.push({ name: 'walletTransfer' }).catch((_) => {})
    },
    topup() {
      this.$router.push({ path: '/wallet/topup' }).catch((_) => {})
    },
    setDateUpdated() {
      this.lastUpdated = new Date().toLocaleString()
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'WalletHomeMain.scss';
</style>
