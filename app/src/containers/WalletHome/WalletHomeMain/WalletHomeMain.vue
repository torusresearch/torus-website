<template>
  <v-container class="wallet-home pt-6" :class="$vuetify.breakpoint.xsOnly ? 'px-4' : ''">
    <div class="d-flex align-center">
      <div class="font-weight-bold display-1 text_2--text float-left">{{ t('walletHome.walletHome') }}</div>
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
                  <template v-slot:activator="{ on }">
                    <v-btn
                      x-small
                      text
                      class="text_3--text"
                      :class="{ 'currency-selector': $vuetify.breakpoint.mAndUp }"
                      title="Select currency"
                      aria-label="Select currency"
                      v-on="on"
                    >
                      <span id="selected-currency" class="description">{{ selectedCurrency }}</span>
                      <v-icon class="text_3--text" small>$vuetify.icons.select</v-icon>
                    </v-btn>
                  </template>
                  <v-list dense>
                    <v-list-item-group color="torusBrand1">
                      <v-list-item
                        v-for="supportedCurrency in supportedCurrencies"
                        :key="supportedCurrency"
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
      <v-flex v-if="isFreshAccount" px-4 xs12 md6 :class="$vuetify.breakpoint.mdAndUp ? 'mt-0' : 'mt-7'">
        <v-card class="card-shadow elevation-1" :style="{ height: $vuetify.breakpoint.xsOnly ? 'inherit' : '159px' }">
          <v-card-text class="pt-0" :class="$vuetify.breakpoint.lgAndUp ? 'pb-2 px-8' : 'pb-3 px-6'">
            <v-layout>
              <v-flex class="pt-4" :class="$vuetify.breakpoint.xsOnly ? 'xs12 text-center' : $vuetify.breakpoint.lgAndUp ? 'xs8' : 'xs9'">
                <div class="text-body-1 font-weight-bold">{{ t('walletHome.welcome') }} Torus.</div>
                <v-dialog v-model="dialogOnboarding" persistent max-width="600">
                  <template v-slot:activator="{ on }">
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

    <v-layout class="mt-8">
      <v-flex xs12>
        <Badges />
      </v-flex>
    </v-layout>

    <v-layout wrap align-center class="mt-6">
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
      <v-flex v-if="$vuetify.breakpoint.mdAndUp" xs12 md3 class="refresh text-right">
        <div class="mb-1">
          <v-btn
            class="gmt-refresh-tokens refresh-btn"
            :color="$vuetify.theme.isDark ? 'torusBlack2' : 'torusGray4'"
            height="24"
            aria-label="Refresh Balances"
            @click="refreshBalances"
          >
            <v-icon left color="torusFont2" size="8">$vuetify.icons.refresh</v-icon>
            <span class="caption text_2--text">Show all Tokens</span>
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
        <TokenBalancesTable :token-balances="filteredBalancesArray" :selected="selected" @update:select="select" />
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
            <span class="caption text_2--text">Show all Tokens</span>
          </v-btn>
        </div>
        <div class="text_3--text refresh-text" small>{{ t('walletHome.lastUpdate') }}: {{ lastUpdated }}</div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import WalletConnect from '@walletconnect/client'
import log from 'loglevel'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'

import ComponentLoader from '../../../components/helpers/ComponentLoader'
import NetworkDisplay from '../../../components/helpers/NetworkDisplay'
import QuickAddress from '../../../components/helpers/QuickAddress'
import Badges from '../../../components/WalletHome/Badges'
import CollectiblesList from '../../../components/WalletHome/CollectiblesList'
import Onboarding from '../../../components/WalletHome/Onboarding'
import PromotionCard from '../../../components/WalletHome/PromotionCard'
import TokenBalancesTable from '../../../components/WalletHome/TokenBalancesTable'
import config from '../../../config'
import torus from '../../../torus'
import { LOCALE_EN, MAINNET } from '../../../utils/enums'

export default {
  name: 'WalletHome',
  components: { TokenBalancesTable, CollectiblesList, QuickAddress, PromotionCard, Onboarding, ComponentLoader, NetworkDisplay, Badges },
  data() {
    return {
      supportedCurrencies: ['ETH', ...config.supportedCurrencies],
      selected: [],
      search: '',
      lastUpdated: '',
      dialogOnboarding: false,
      activeTab: 0,
      connector: null,
    }
  },
  computed: {
    ...mapGetters(['tokenBalances']),
    ...mapState({
      wcConnectorSession: 'wcConnectorSession',
      whiteLabel: 'whiteLabel',
      weiBalanceLoaded: 'weiBalanceLoaded',
      tokenDataLoaded: 'tokenDataLoaded',
      selectedAddress: 'selectedAddress',
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

      return this.finalBalancesArray.filter((balance) => balance.name.match(regEx))
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
        events.push(finalEvent)
      })

      return events
    },
  },
  watch: {
    selectedAddress(newValue, oldValue) {
      if (newValue !== oldValue) {
        if (Object.keys(this.wcConnectorSession).length > 0 && this.wcConnectorSession.connected) {
          this.wcConnector.updateSession({
            chainId: this.networkType.chainId,
            accounts: [this.selectedAddress],
          })
        }
      }
    },
    networkType(newValue, oldValue) {
      if (newValue !== oldValue) {
        if (Object.keys(this.wcConnectorSession).length > 0 && this.wcConnectorSession.connected) {
          this.wcConnector.updateSession({
            chainId: this.networkType.chainId,
            accounts: [this.selectedAddress],
          })
        }
      }
    },
  },
  mounted() {
    this.setDateUpdated()

    this.initWalletConnect()
    this.activeTab = this.$route.hash === '#collectibles' ? 1 : 0

    this.$vuetify.goTo(0)
  },
  methods: {
    ...mapActions(['forceFetchTokens', 'setSelectedCurrency']),
    ...mapMutations(['setWCConnectorSession']),
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
    async initWalletConnect() {
      const uri =
        // eslint-disable-next-line max-len
        'wc:390578bd-dbc4-474e-b52e-ed1638dc25c9@1?bridge=https%3A%2F%2Fbridge.walletconnect.org&key=22a7e5ad13f7d0ae19de9d7aec3691302632bb19076bc8c2bf57b506c32e5786'
      // if (Object.keys(this.wcConnectorSession).length > 0) {
      //   log.info('THERE IS A SESSION ALREADY', this.wcConnectorSession)
      //   this.wcConnector = new WalletConnect({ session: this.wcConnectorSession })
      // } else {
      this.wcConnector = new WalletConnect({ uri })
      this.setWCConnectorSession(this.wcConnector.session)
      // }
      if (!this.wcConnector.connected) {
        await this.wcConnector.createSession()
      }
      log.info('THIS IS THE WCCONNECTOR', this.wcConnector)
      this.wcConnector.on('session_request', (err, payload) => {
        log.info('SESSION REQUEST', err, payload)
        this.wcConnector.approveSession({ chainId: this.networkType.chainId, accounts: [this.selectedAddress] })
      })
      this.wcConnector.on('session_update', (err, payload) => {
        log.info('SESSION UPDATE', err, payload)
      })
      this.wcConnector.on('call_request', (err, payload) => {
        log.info('CALL REQUEST', err, payload, torus)
        payload.params[0].isWalletConnectRequest = 'true'
        torus.torusController.provider.send(payload, (error, result) => {
          if (err) {
            log.info(`FAILED REJECT REQUEST, ERROR ${err.message}`)
            this.wcConnector.rejectRequest({ id: payload.id, error: { message: `Failed or Rejected Request ${error.message}` } })
          } else {
            log.info(`SUCCEEDED APPROVE REQUEST, RESULT ${result}`)
            this.wcConnector.approveRequest({ id: payload.id, result })
          }
        })
      })
      this.wcConnector.on('connect', (err, payload) => {
        log.info('CONNECT', err, payload)
      })
      this.wcConnector.on('disconnect', (err, payload) => {
        log.info('DISCONNECT', err, payload)
        this.setWCConnectorSession({})
      })
      log.info('SESSION IS THIS', this.wcConnector.session)
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'WalletHomeMain.scss';
</style>
