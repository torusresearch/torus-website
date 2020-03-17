<template>
  <v-layout class="home-cards token-balance-tab-container mx-n4 mt-8" wrap align-center>
    <v-flex v-for="(balance, index) in tokenBalances" :key="index" class="xs12 sm6 mb-4 px-4">
      <v-card color="elevation-1" router-link :to="{ name: 'walletTransfer', query: { contract: balance.tokenAddress } }">
        <v-card-text class="pa-0">
          <v-layout align-center class="px-3 elevation-1 card-header py-2">
            <v-flex xs8>
              <img
                :src="require(`../../../../public/images/logos/${balance.logo}`)"
                class="inline-small d-inline-flex"
                onerror="if (this.src != 'eth.svg') this.src = 'images/logos/eth.svg';"
                :alt="balance.logo"
              />
              <span class="subtitle-2 ml-1">{{ balance.name }}</span>
            </v-flex>
            <v-flex xs4 class="subtitle-2 text-right">{{ balance.computedBalanceRounded }} {{ balance.symbol }}</v-flex>
          </v-layout>
          <v-layout px-4 py-3>
            <v-flex xs6 class="body-2">
              {{ balance.currencyRateText }}
            </v-flex>
            <v-flex xs6 class="text-right body-2">
              {{ balance.currencyBalance }}
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
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
    }
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
