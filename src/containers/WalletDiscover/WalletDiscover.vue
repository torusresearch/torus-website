<template>
  <div class="dapp-parent d-flex flex-column justify-start align-center" :class="$vuetify.breakpoint.xsOnly ? 'xs-parent' : ''">
    <div
      class="discover-header d-flex"
      :class="$vuetify.breakpoint.xsOnly ? 'flex-column justify-start align-start' : 'flex-row justify-space-between align-center'"
    >
      <h3 class="discover-title font-weight-bold" :style="{ color: $vuetify.theme.isDark ? '#EEF2F4' : '#5C6C7F' }">
        {{ t('navBar.discover') }}
      </h3>

      <v-layout mx-n2 class="dapp-filters">
        <v-flex xs6 px-2 class="filter-width">
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
        <v-flex xs6 px-2 class="filter-width">
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

    <v-container class="f-width">
      <v-row>
        <v-col v-for="dapp in filteredList" :key="dapp.title + dapp.network" class="col-sm-6 col-md-4 col-lg-3 col-xl-3">
          <Dapp :dapp="dapp" :show-network="selectedNetwork === ALL_NETWORKS" />
        </v-col>
      </v-row>
    </v-container>
    <p v-if="isLoadingDapps">{{ t('walletDiscover.loading') }}</p>
    <p v-if="!isLoadingDapps && filteredList.length === 0">{{ t('walletDiscover.noData') }}</p>
  </div>
</template>
<script>
import { mapState } from 'vuex'

import Dapp from '../../components/WalletDiscover/Dapp'
import torus from '../../torus'
import { SUPPORTED_NETWORK_TYPES } from '../../utils/enums'

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
    ...mapState(['networkType', 'supportedNetworks']),
    networkList() {
      return [
        ALL_NETWORKS,
        ...new Set(
          this.dapps
            .reduce((networkList, dapp) => {
              if (dapp?.network?.length) {
                networkList.push(dapp.network)
              }
              return networkList
            }, [])
            ?.sort()
        ),
      ]
    },
    categoryList() {
      return [
        ALL_CATEGORIES,
        ...new Set(
          this.dapps
            .reduce((categoryList, dapp) => {
              if (dapp?.category?.length) {
                categoryList.push(dapp.category)
              }
              return categoryList
            }, [])
            ?.sort()
        ),
      ]
    },
    filteredList() {
      return (
        this.dapps?.filter(
          (dapp) =>
            (this.selectedCategory === ALL_CATEGORIES || this.selectedCategory === dapp.category) &&
            (this.selectedNetwork === ALL_NETWORKS || this.selectedNetwork === dapp.network)
        ) || []
      )
    },
  },
  async mounted() {
    this.$vuetify.goTo(0)
    this.dapps = (await this.fetchDapps())?.records || []
    this.isLoadingDapps = false
    this.selectedNetwork = this.$store?.state?.networkType?.host || ALL_NETWORKS // set default network as user's setting default
  },
  created() {
    this.ALL_NETWORKS = ALL_NETWORKS
  },
  methods: {
    async fetchDapps() {
      let data = {}
      try {
        data = await torus.torusController.prefsController.fetchDappList()
      } catch {
        this.isLoadingDapps = false
      }
      return data
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
