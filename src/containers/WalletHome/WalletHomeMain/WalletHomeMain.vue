<template>
  <v-container class="wallet-home pt-6" :class="$vuetify.display.xs ? 'px-4' : ''">
    <div class="d-flex align-center">
      <div class="font-weight-bold text-text_2 float-left page-title" :class="{ 'display-1': $vuetify.display.width > 390 }">
        {{ $t('walletHome.walletHome') }}
      </div>
      <div class="ml-auto">
        <QuickAddress />
      </div>
    </div>
    <v-row wrap class="mx-n4 mt-7">
      <v-col class="px-4" cols="12" md="6">
        <v-card class="card-total elevation-1 px-6 py-4">
          <div class="d-flex align-center" :style="{ marginBottom: '5px' }">
            <div :style="{ lineHeight: '1em' }">
              <span class="title text-text_1" :style="{ lineHeight: '1em' }">{{ $t('walletHome.totalValue') }}</span>
            </div>
            <div class="ml-auto">
              <NetworkDisplay :network="networkType.networkName" :store-network-type="networkType"></NetworkDisplay>
            </div>
          </div>
          <div class="d-flex align-center">
            <div>
              <ComponentLoader v-if="!weiBalanceLoaded || !tokenDataLoaded" class="mt-3" />
              <div v-else class="d-flex align-end">
                <span class="text-text_2 text-clamp-one" :class="$vuetify.display.xs ? 'display-2' : 'display-4'">
                  {{ totalPortfolioValue }}
                </span>
                <v-menu offset-y :style="{ zIndex: 20, maxheight: '300px' }">
                  <template #activator="{ props }">
                    <v-btn
                      size="x-small"
                      variant="text"
                      class="text-text_3 px-3"
                      :class="{ 'currency-selector': $vuetify.display.mAndUp }"
                      title="Select currency"
                      aria-label="Select currency"
                      v-bind="props"
                    >
                      <span id="selected-currency" class="description">{{ selectedCurrency }}</span>
                      <v-icon class="text-text_3" size="small">$select</v-icon>
                    </v-btn>
                  </template>
                  <v-list class="pa-0" density="compact">
                    <v-item-group color="torusBrand1">
                      <v-list-item
                        v-for="supportedCurrency in supportedCurrencies"
                        :key="supportedCurrency"
                        class="px-2"
                        :class="selectedCurrency === supportedCurrency ? 'active' : ''"
                        @click="onCurrencyChange(supportedCurrency)"
                      >
                        <v-list-item-title>{{ supportedCurrency }}</v-list-item-title>
                      </v-list-item>
                    </v-item-group>
                  </v-list>
                </v-menu>
              </div>
            </div>
            <div class="ml-auto align-self-end text-right">
              <span class="description text-text_3" :style="{ lineHeight: '0' }">{{ finalBalancesArray[0]?.currencyRateText || '' }}</span>
            </div>
          </div>
          <v-row wrap class="mx-n3 mt-2">
            <v-col cols="6" class="px-3">
              <v-btn
                v-show="canShowLrc && !whiteLabel.topupHide"
                block
                size="large"
                class="torus-btn1 gtm-topup-cta"
                :class="whiteLabel.isActive ? 'text-white' : 'text-torusBrand1'"
                :color="whiteLabel.isActive ? 'torusBrand1' : ''"
                @click="topup"
              >
                <v-icon left>$add</v-icon>
                {{ $t('walletHome.topUp') }}
              </v-btn>
            </v-col>
            <v-col cols="6" class="px-3">
              <v-btn
                block
                size="large"
                class="torus-btn1 gtm-transfer-cta"
                :class="whiteLabel.isActive ? 'text-white' : 'text-torusBrand1'"
                :color="whiteLabel.isActive ? 'torusBrand1' : ''"
                @click="initiateTransfer"
              >
                <v-icon left>$send</v-icon>
                {{ $t('walletHome.transfer') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <!-- <v-col v-if="isFreshAccount || events.length === 0" px-4 xs12 md6 :class="$vuetify.display.mdAndUp ? 'mt-0' : 'mt-7'">
        <v-card class="card-shadow elevation-1" :style="{ height: $vuetify.display.xs ? 'inherit' : '159px' }">
          <v-card-text class="pt-0" :class="$vuetify.display.lgAndUp ? 'pb-2 px-8' : 'pb-3 px-6'">
            <v-row>
              <v-col class="pt-4" :class="$vuetify.display.xs ? 'xs12 text-center' : $vuetify.display.lgAndUp ? 'xs8' : 'xs9'">
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
              </v-col>
              <v-col xs4 pt-4 class="text-right hidden-xs-only">
                <img
                  :src="require(`../../../assets/images/${$vuetify.theme.dark ? 'home-illustration' : 'learn-more'}.svg`)"
                  :style="{ height: '120px' }"
                  alt="Onboarding"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col> -->
      <v-col
        v-if="!whiteLabel.featuredBillboardHide && apiStreamSupported"
        cols="12"
        md="6"
        class="px-4"
        :class="$vuetify.display.mdAndUp ? 'mt-0' : 'mt-7'"
      >
        <WalletConnectCard
          image-path="https://images.web3auth.io/wallet-connect.svg"
          image-dark-path="https://images.web3auth.io/wallet-connect.svg"
        ></WalletConnectCard>
      </v-col>
      <v-col
        v-for="(event, i) in isFreshAccount || whiteLabel.featuredBillboardHide ? [] : events"
        :key="`event-${i}`"
        cols="12"
        class="px-4"
        :class="$vuetify.display.mdAndUp && event.length === 0 ? 'mt-0' : 'mt-7'"
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
      </v-col>
    </v-row>

    <v-row wrap class="mt-7 align-center">
      <v-col cols="12" md="6" :class="{ 'offset-md-3': $vuetify.display.mdAndUp }">
        <v-tabs v-model="activeTab" class="home-tab" centered hide-slider :class="isDarkMode ? 'v-theme--dark' : 'v-theme--light'">
          <v-tab :key="$t('walletHome.tokens')" class="home-tab-token gmt-tokens-tab font-weight-bold">
            <v-icon class="mr-1" size="small" start>$token</v-icon>
            {{ $t('walletHome.tokens') }}
          </v-tab>
          <v-tab :key="$t('walletHome.collectibles')" class="home-tab-collectibles gmt-collectibles-tab font-weight-bold">
            <v-icon class="mr-1" size="small" start>$collectibles</v-icon>
            {{ $t('walletHome.collectibles') }}
          </v-tab>
        </v-tabs>
      </v-col>
      <v-col v-if="$vuetify.display.mdAndUp && activeTab === 0" cols="12" md="3" class="refresh text-right">
        <div class="mb-1">
          <v-btn
            class="gmt-refresh-tokens refresh-btn"
            :color="isDarkMode ? 'torusBlack2' : 'torusGray4'"
            height="24"
            aria-label="Refresh Balances"
            @click="refreshBalances"
          >
            <v-icon start color="torusFont2" class="mr-1" size="8">$refresh</v-icon>
            <span class="text-caption text-text_2">{{ $t('walletHome.showAllTokens') }}</span>
          </v-btn>
        </div>
        <div class="text-text_3 refresh-text" size="small">{{ $t('walletHome.lastUpdate') }}: {{ lastUpdated }}</div>
      </v-col>
      <v-col v-if="showSearch" cols="12" class="mt-4">
        <v-text-field
          v-model="search"
          class="search-tokens text-text_2 body-2"
          variant="outlined"
          hide-details
          placeholder="Search for Tokens"
          append-icon="$search"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-window v-model="activeTab" class="token-tab-content mt-8">
      <v-window-item class="w-full">
        <TokenBalancesTable :hide-token-mode="hideTokenMode" :token-balances="filteredBalancesArray" :selected="selected" @update:select="select" />
        <div v-if="hasCustomToken && $vuetify.display.mdAndUp" class="text-right">
          <v-btn
            class="gmt-edit-tokens refresh-btn"
            :color="isDarkMode ? 'torusBlack2' : 'torusGray4'"
            height="24"
            :aria-label="$t('homeToken.editTokens')"
            @click="hideTokenMode = !hideTokenMode"
          >
            <v-icon left class="text-text_2" size="14">$pencil_edit</v-icon>
            <span class="text-caption text-text_2">{{ $t('homeToken.editTokens') }}</span>
          </v-btn>
        </div>
      </v-window-item>
      <v-window-item>
        <CollectiblesList></CollectiblesList>
      </v-window-item>
    </v-window>

    <v-row v-if="$vuetify.display.smAndDown" class="mt-10">
      <v-col cols="12" class="refresh text-right">
        <div class="mb-1">
          <v-btn
            class="gmt-refresh-tokens refresh-btn"
            :color="isDarkMode ? 'torusBlack2' : 'torusGray4'"
            height="24"
            aria-label="Refresh Balances"
            @click="refreshBalances"
          >
            <v-icon start color="torusFont2" class="mr-1" size="8">$refresh</v-icon>
            <span class="text-caption text-text_2">{{ $t('walletHome.showAllTokens') }}</span>
          </v-btn>
          <v-btn
            v-if="hasCustomToken"
            class="gmt-edit-tokens refresh-btn ml-2"
            :color="isDarkMode ? 'torusBlack2' : 'torusGray4'"
            height="24"
            :aria-label="$t('homeToken.editTokens')"
            @click="hideTokenMode = !hideTokenMode"
          >
            <v-icon start class="text-text_2" size="14">$pencil_edit</v-icon>
            <span class="text-caption text-text_2">{{ $t('homeToken.editTokens') }}</span>
          </v-btn>
        </div>
        <div class="text-text_3 refresh-text">{{ $t('walletHome.lastUpdate') }}: {{ lastUpdated }}</div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { BroadcastChannel } from '@toruslabs/broadcast-channel'
import { mapActions, mapGetters, mapState } from 'vuex'

import ComponentLoader from '../../../components/helpers/ComponentLoader'
import NetworkDisplay from '../../../components/helpers/NetworkDisplay'
import QuickAddress from '../../../components/helpers/QuickAddress'
import CollectiblesList from '../../../components/WalletHome/CollectiblesList'
// import Onboarding from '../../../components/WalletHome/Onboarding'
import PromotionCard from '../../../components/WalletHome/PromotionCard'
import TokenBalancesTable from '../../../components/WalletHome/TokenBalancesTable'
import WalletConnectCard from '../../../components/WalletHome/WalletConnectCard'
import { LOCALE_EN, MAINNET } from '../../../utils/enums'
import { apiStreamSupported, broadcastChannelOptions } from '../../../utils/utils'

export default {
  name: 'WalletHome',
  components: { TokenBalancesTable, CollectiblesList, QuickAddress, WalletConnectCard, ComponentLoader, NetworkDisplay, PromotionCard },
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
      const lang = this.$i18n.locale

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
    apiStreamSupported() {
      return apiStreamSupported()
    },
    isDarkMode() {
      return this.$vuetify.theme.name === 'dark'
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
    async onCurrencyChange(value) {
      this.setSelectedCurrency({ selectedCurrency: value, origin: 'home' })
      const urlInstance = this.$route.query.instanceId
      if (urlInstance && urlInstance !== '') {
        const selectedCurrencyChannel = new BroadcastChannel(`selected_currency_channel_${urlInstance}`, broadcastChannelOptions)
        await selectedCurrencyChannel.postMessage({
          data: {
            name: 'selected_currency',
            payload: value,
          },
        })
        selectedCurrencyChannel.close()
      }
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
