<template>
  <v-container class="dapp-parent d-flex flex-column justify-start align-center" :class="$vuetify.display.xs ? 'xs-parent px-4' : ''">
    <div
      class="discover-header d-flex mt-3"
      :class="$vuetify.display.smAndDown ? 'flex-column justify-start align-start' : 'flex-row justify-space-between'"
    >
      <h3 class="discover-title font-weight-bold" :style="{ color: isDarkMode ? '#EEF2F4' : '#5C6C7F' }">
        {{ $t('navBar.discover') }}
      </h3>
      <v-row no-gutters class="dapp-filters mt-5 mt-md-0 mx-n2">
        <v-col cols="6" class="filter-width px-sm-2">
          <v-select
            v-model="selectedCategory"
            hide-details
            prepend-inner-icon="$activities"
            append-inner-icon="$select"
            :items="categoryList"
            variant="plain"
            density="comfortable"
            class="filter-selector"
            :class="{ 'v-theme--dark': isDarkMode }"
          ></v-select>
        </v-col>
        <v-col cols="6" class="filter-width px-sm-2">
          <v-select
            v-model="selectedNetwork"
            hide-details
            prepend-inner-icon="$calendar"
            append-inner-icon="$select"
            :items="networkList"
            variant="plain"
            density="comfortable"
            class="filter-selector"
            :class="{ 'v-theme--dark': isDarkMode }"
          >
            <template #selection="{ item }">{{ getDisplayName(item.value) }}</template>
            <template #item="{ item }">
              <v-list-item :class="selectedNetwork === item.value ? 'active' : ''" @click="selectedNetwork = item.value">
                <v-list-item-title>{{ getDisplayName(item.value) }}</v-list-item-title>
              </v-list-item>
            </template>
          </v-select>
        </v-col>
      </v-row>
    </div>

    <v-container class="f-width">
      <v-row>
        <v-col v-for="dapp in pagedList" :key="dapp.title + dapp.network" sm="6" md="4" lg="3">
          <Dapp :dapp="dapp" :show-network="selectedNetwork === ALL_NETWORKS" />
        </v-col>
      </v-row>
    </v-container>
    <div v-if="!$vuetify.display.xs && pageCount > 1" class="text-center pt-6">
      <v-pagination v-model="page" class="activity-pagination" prev-icon="$page_prev" next-icon="$page_next" :length="pageCount"></v-pagination>
    </div>
  </v-container>
</template>
<script>
import log from 'loglevel'
import { mapState } from 'vuex'

// import BoxLoader from '../../components/helpers/BoxLoader'
import Dapp from '../../components/WalletDiscover/Dapp'
import torus from '../../torus'
import { SUPPORTED_NETWORK_TYPES } from '../../utils/enums'

const ALL_CATEGORIES = 'All DApps'
const ALL_NETWORKS = 'All networks'
export default {
  name: 'WalletDiscover',
  components: { Dapp },
  // components: { BoxLoader, Dapp },
  data() {
    return {
      isLoadingDapps: true,
      redirectUrl: undefined,
      dapps: [],
      selectedCategory: ALL_CATEGORIES,
      selectedNetwork: ALL_NETWORKS,
      page: 1,
      itemsPerPage: 20,
    }
  },
  computed: {
    ...mapState(['networkType']),
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
      const filtered =
        this.dapps?.filter(
          (dapp) =>
            (this.selectedCategory === ALL_CATEGORIES || this.selectedCategory === dapp.category) &&
            (this.selectedNetwork === ALL_NETWORKS || this.selectedNetwork === dapp.network)
        ) || []
      return filtered
    },
    pagedList() {
      const dapps = this.filteredList.slice((this.page - 1) * this.itemsPerPage, this.page * this.itemsPerPage)

      return dapps
    },
    pageCount() {
      return Math.ceil(this.filteredList.length / this.itemsPerPage)
    },
    isDarkMode() {
      return this.$vuetify.theme.current.dark
    },
  },
  async mounted() {
    try {
      if (this.$route.query.url) {
        this.redirectUrl = new URL(this.$route.query.url)
        window.location.href = this.redirectUrl.href
      }
    } catch (error) {
      log.error(error)
    } finally {
      // Fetch dapps if not redirecting
      if (!this.redirectUrl) {
        const dappRecords = await this.fetchDapps()
        this.dapps = dappRecords?.records || []
        this.isLoadingDapps = false
        this.selectedNetwork = this.networkType?.host || ALL_NETWORKS // set default network as user's setting default
      }
    }
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
