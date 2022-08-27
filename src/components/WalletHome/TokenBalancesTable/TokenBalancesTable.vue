<template>
  <v-row class="home-cards token-balance-tab-container mx-n4 align-center" wrap :class="{ 'justify-center': tokenBalances.length < 4 }">
    <v-col v-for="(balance, index) in tokenBalances" :key="index" cols="12" sm="6" md="4" lg="3" class="mb-4 px-4">
      <v-badge :model-value="hideTokenMode && !!balance.customTokenId" bordered>
        <template #badge>
          <EditToken :is-hide-mode="true" :delete-token="balance" />
        </template>
        <v-card
          color="elevation-1"
          router-link
          :to="{ name: 'walletTransfer', query: { contract: balance.tokenAddress } }"
          :title="`Transfer ${balance.symbol}`"
          :aria-label="`Transfer ${balance.symbol}`"
          class="w-100"
        >
          <v-card-text class="pa-0">
            <div class="d-flex align-center py-3 px-4 card-header elevation-1">
              <div class="flex-grow-1 text-clamp-one">
                <img
                  :src="`${logosUrl}/${balance.logo}`"
                  class="inline-small d-inline-flex"
                  :onerror="`if (!this.src.includes('images/token-${isDarkMode ? 'dark' : 'light'}.svg')) this.src = '/images/token-${
                    isDarkMode ? 'dark' : 'light'
                  }.svg';`"
                  :alt="balance.logo"
                />
                <span class="caption text-text_1 ml-1 font-weight-bold">{{ balance.name }}</span>
              </div>
              <div class="ml-auto text-text_1 text-right mt-n1 caption font-weight-medium">
                {{ formatSmallNumbers(balance.computedBalanceRounded, balance.symbol) }}
              </div>
            </div>
            <div class="d-flex align-center py-3 px-4">
              <div class="caption text-text_3">
                {{ balance.currencyRateText }}
              </div>
              <div class="ml-auto caption text-text_3">
                {{ formatSmallNumbers(balance.currencyBalanceRounded, selectedCurrency) }}
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-badge>
    </v-col>
    <v-col cols="12" sm="6" md="4" lg="3" class="mb-4 px-4">
      <v-card color="elevation-1">
        <v-card-text class="pa-0">
          <div class="d-flex align-center py-3 px-4 card-header elevation-1">
            <div class="flex-grow-1 text-clamp-one text-center" :style="{ height: '25px' }">
              <span class="caption text-text_1 font-weight-bold">{{ $t('homeToken.didNotSee') }}</span>
            </div>
          </div>
          <div class="text-center py-3 px-4" :style="{ lineHeight: '0' }">
            <EditToken />
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'vuex'

import config from '../../../config'
import { formatSmallNumbers } from '../../../utils/utils'
import EditToken from '../EditToken'

export default {
  components: { EditToken },
  props: {
    tokenBalances: {
      type: Array,
      default() {
        return []
      },
    },
    hideTokenMode: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      pagination: {
        sortBy: 'name',
      },
      dialog: false,
      logosUrl: config.logosUrl,
    }
  },
  computed: {
    ...mapState(['selectedCurrency']),
    showFooter() {
      return this.tokenBalances.length > 5
    },
    isDarkMode() {
      return this.$vuetify.theme.global.name === 'dark'
    },
  },
  methods: {
    changeSort(column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending
      } else {
        this.pagination.sortBy = column
        this.pagination.descending = false
      }
    },
    selectEmit(item) {
      this.$emit('update:select', item)
    },
    formatSmallNumbers,
    topup() {
      this.$router.push({ path: '/wallet/topup' }).catch((_) => {})
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'TokenBalancesTable.scss';
</style>
