<template>
  <div class="dapp-parent">
    <div class="discover-header">
      <h3 class="discover-title" :style="{ color: $vuetify.theme.isDark ? '#EEF2F4' : '#5C6C7F' }">
        {{ t('navBar.discover') }}
      </h3>

      <v-layout mx-n2 class="dapp-filters">
        <v-flex xs6 px-2>
          <v-menu offset-y>
            <template #activator="{ on }">
              <div class="d-flex align-center filter-selector pa-2" :class="{ 'theme--dark': $vuetify.theme.isDark }" v-on="on">
                <v-icon x-small class="text_2--text">$vuetify.icons.activities</v-icon>
                <span class="ml-1 text_1--text" :class="$vuetify.breakpoint.xsOnly ? 'caption' : 'body-2'">{{ selectedCategory }}</span>
                <v-icon class="ml-auto text_2--text">$vuetify.icons.select</v-icon>
              </div>
            </template>
            <v-card class="pa-3">
              <v-list min-width="190" dense>
                <v-list-item-group color="torusBrand1">
                  <v-list-item
                    v-for="category in categoryList"
                    :key="category"
                    :class="selectedCategory === category ? 'active' : ''"
                    @click="selectedCategory = category"
                  >
                    <v-list-item-content>
                      <v-list-item-title>{{ category }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card>
          </v-menu>
        </v-flex>
        <v-flex xs6 px-2>
          <v-menu offset-y>
            <template #activator="{ on }">
              <div class="d-flex align-center filter-selector pa-2" :class="{ 'theme--dark': $vuetify.theme.isDark }" v-on="on">
                <v-icon class="text_2--text" small>$vuetify.icons.calendar</v-icon>
                <span class="ml-1 text_1--text" :class="$vuetify.breakpoint.xsOnly ? 'caption' : 'body-2'">
                  {{ getDisplayName(selectedNetwork) }}
                </span>
                <v-icon class="ml-auto text_2--text">$vuetify.icons.select</v-icon>
              </div>
            </template>
            <v-card class="pa-3">
              <v-list min-width="190" dense>
                <v-list-item-group color="torusBrand1">
                  <v-list-item
                    v-for="network in networkList"
                    :key="network"
                    :class="selectedNetwork === network ? 'active' : ''"
                    @click="selectedNetwork = network"
                  >
                    <v-list-item-content>
                      <v-list-item-title>{{ getDisplayName(network) }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card>
          </v-menu>
        </v-flex>
      </v-layout>
    </div>

    <div
      v-if="!isLoadingDapps"
      :class="{
        'dapp-list-container': 'true',
        'gcol-4': $vuetify.breakpoint.lg,
        'gcol-3': $vuetify.breakpoint.md,
        'gcol-2': $vuetify.breakpoint.sm,
        'gcol-1': $vuetify.breakpoint.xs,
      }"
    >
      <Dapp v-for="dapp in filteredList" :key="dapp.title" :dapp="dapp" />
    </div>
    <p v-if="isLoadingDapps">Please wait while we fetch data.</p>
    <p v-if="!isLoadingDapps && filteredList.length === 0">No Dapp found for current query.</p>
  </div>
</template>
<script>
import log from 'loglevel'

import Dapp from '../../components/WalletDiscover/Dapp'
import torus from '../../torus'
import { BSC_MAINNET, MAINNET, MATIC, SUPPORTED_NETWORK_TYPES } from '../../utils/enums'

const ALL_CATEGORIES = 'All DApps'
const ALL_NETWORKS = 'All network'
export default {
  name: 'WalletDiscover',
  components: { Dapp },
  data() {
    return {
      isLoadingDapps: true,
      dapps: [],
      selectedCategory: ALL_CATEGORIES,
      selectedNetwork: ALL_NETWORKS,
    }
  },
  computed: {
    networkList() {
      return [
        ALL_NETWORKS,
        ...new Set(
          this.dapps
            .filter((d) => !!d?.network?.length)
            .map((d) => d.network)
            ?.sort()
        ),
      ]
    },
    categoryList() {
      return [
        ALL_CATEGORIES,
        ...new Set(
          this.dapps
            .filter((d) => !!d?.desc?.length)
            .map((d) => d.desc)
            ?.sort()
        ),
      ]
    },
    filteredList() {
      return (
        this.dapps?.filter(
          (dapp) =>
            (this.selectedCategory === ALL_CATEGORIES || this.selectedCategory === dapp.desc) &&
            (this.selectedNetwork === ALL_NETWORKS || this.selectedNetwork === dapp.network)
        ) || []
      )
    },
  },
  async mounted() {
    this.$vuetify.goTo(0)
    this.dapps = (await this.fetchDapps())?.records || []
    this.standardiseNetworkNames()
    this.isLoadingDapps = false
    log.info('WalletDiscover', this.dapps, SUPPORTED_NETWORK_TYPES)
  },
  methods: {
    async fetchDapps() {
      let data
      try {
        data = await torus.torusController.prefsController.fetchDappList()
      } catch {
        this.isLoadingDapps = false
      }
      return data
    },
    standardiseNetworkNames() {
      this.dapps.forEach((dapp) => {
        let standardNetwork = dapp.network
        if (dapp.network.toLowerCase().includes('ethereum')) {
          standardNetwork = MAINNET
        } else if (dapp.network.toLowerCase().includes('polygon')) {
          standardNetwork = MATIC
        } else if (dapp.network.toLowerCase().includes('binance')) {
          standardNetwork = BSC_MAINNET
        }
        dapp.network = standardNetwork
      })
    },
    getDisplayName(name) {
      return SUPPORTED_NETWORK_TYPES[name]?.networkName || name
    },
  },
}
</script>
<style lang="scss" scoped>
@import 'WalletDiscover.scss';
</style>
