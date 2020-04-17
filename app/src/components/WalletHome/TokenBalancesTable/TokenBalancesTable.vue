<template>
  <v-layout class="home-cards token-balance-tab-container mx-n4" wrap align-center :justify-center="tokenBalances.length < 4">
    <v-flex v-for="(balance, index) in tokenBalances" :key="index" class="xs12 sm6 md3 mb-4 px-4">
      <v-card color="elevation-1" router-link :to="{ name: 'walletTransfer', query: { contract: balance.tokenAddress } }">
        <v-card-text class="pa-0">
          <div class="d-flex align-center py-3 px-4 card-header elevation-1">
            <div class="flex-grow-1 text-clamp-one">
              <img
                :src="require(`../../../../public/images/logos/${balance.logo}`)"
                class="inline-small d-inline-flex"
                onerror="if (this.src != 'eth.svg') this.src = 'images/logos/eth.svg';"
                :alt="balance.logo"
              />
              <span class="caption text_1--text ml-1 font-weight-bold">{{ balance.name }}</span>
            </div>
            <div class="ml-auto text_1--text text-right mt-n1 caption font-weight-medium">
              {{ formatSmallNumbers(balance.computedBalanceRounded, balance.symbol) }}
            </div>
          </div>
          <div class="d-flex align-center py-3 px-4">
            <div class="caption text_3--text">
              {{ balance.currencyRateText }}
            </div>
            <div class="ml-auto caption text_3--text">
              {{ balance.currencyBalance }}
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex class="xs12 sm6 md3 mb-4 px-4">
      <v-card color="elevation-1">
        <v-card-text class="pa-0">
          <div class="d-flex align-center py-3 px-4 card-header elevation-1">
            <div class="flex-grow-1 text-clamp-one">
              <span class="caption text_1--text font-weight-bold">{{ t('walletHome.curious') }}</span>
            </div>
          </div>
          <div class="d-flex align-center py-3 px-4">
            <v-btn text x-small class="caption mb-1 mx-auto torusBrand1--text font-weight-medium" @click="topup">{{ t('walletHome.buyThem') }}</v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { formatSmallNumbers } from '../../../utils/utils'

export default {
  props: {
    tokenBalances: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      pagination: {
        sortBy: 'name',
      },
      dialog: false,
    }
  },
  computed: {
    showFooter() {
      return this.tokenBalances.length > 5
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
