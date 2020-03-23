<template>
  <v-layout class="home-cards token-balance-tab-container mx-n4" wrap align-center>
    <v-flex v-for="(balance, index) in tokenBalances" :key="index" class="xs12 sm6 md3 mb-4 px-4">
      <v-card color="elevation-1" router-link :to="{ name: 'walletTransfer', query: { contract: balance.tokenAddress } }">
        <v-card-text class="pa-0">
          <div class="d-flex align-center py-3 px-4">
            <div class="flex-grow-1 text-clamp-one">
              <img
                :src="require(`../../../../public/images/logos/${balance.logo}`)"
                class="inline-small d-inline-flex"
                onerror="if (this.src != 'eth.svg') this.src = 'images/logos/eth.svg';"
                :alt="balance.logo"
              />
              <span class="caption ml-1">{{ balance.name }}</span>
            </div>
            <div class="ml-auto text-right caption">
              {{ formatSmallNumbers(balance.computedBalanceRounded, balance.symbol) }}
            </div>
          </div>
          <div class="d-flex align-center py-3 px-4">
            <div class="more-info">
              {{ balance.currencyRateText }}
            </div>
            <div class="ml-auto more-info">
              {{ balance.currencyBalance }}
            </div>
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
      }
    }
  },
  data() {
    return {
      pagination: {
        sortBy: 'name'
      },
      dialog: false
    }
  },
  computed: {
    showFooter() {
      return this.tokenBalances.length > 5
    }
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
    formatSmallNumbers
    // smallNumbersEth(balance) {
    //   const convertedBalance = parseFloat(balance)
    //   let truncatedValue = convertedBalance

    //   // Check decimals
    //   const convertedBalanceArray = balance.split('.')
    //   const beforeDecimal = convertedBalanceArray[0] && Number(convertedBalanceArray[0])
    //   const afterDecimal = convertedBalanceArray[1] && Number(convertedBalanceArray[1])

    //   log.info('Number', beforeDecimal, afterDecimal)
    //   log.info('Number', typeof beforeDecimal, typeof afterDecimal)
    //   // const totalLength = beforeDecimal.length +

    //   if (beforeDecimal > 1000000) {
    //     truncatedValue = (beforeDecimal / 1000000).toFixed(1)
    //     return `${truncatedValue}m`
    //   }

    //   if (beforeDecimal > 1000) {
    //     truncatedValue = (beforeDecimal / 1000).toFixed(2)
    //     return `${truncatedValue}k`
    //   }

    //   if (convertedBalanceArray.length > 0) {
    //     if (convertedBalanceArray[1] && convertedBalanceArray[1].length > 5) {
    //       return convertedBalance.toFixed(5)
    //     }
    //   } else {
    //     return balance
    //   }

    //   log.info('convertedBalance', convertedBalance)
    // }
  }
}
</script>

<style lang="scss" scoped>
@import 'TokenBalancesTable.scss';
</style>
