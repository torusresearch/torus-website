<template>
  <div class="activity-table">
    <v-data-iterator
      :disable-pagination="$vuetify.breakpoint.xsOnly"
      :items="filteredTransactions"
      item-key="id"
      :items-per-page.sync="itemsPerPage"
      :page.sync="page"
      hide-default-footer
    >
      <template #default="props">
        <TransactionDetails
          v-for="transaction in props.items"
          :key="transaction.transaction_hash || transaction.id"
          :transaction="transaction"
          :currency-multiplier="currencyMultiplier"
          :selected-currency="selectedCurrency"
          :cancel-gas-price="cancelGasPrice"
          @cancelTransaction="cancelTransaction"
        />
      </template>
    </v-data-iterator>

    <div v-if="!$vuetify.breakpoint.xsOnly && pageCount > 1" class="text-center pt-6">
      <v-pagination
        v-model="page"
        class="activity-pagination"
        prev-icon="$vuetify.icons.page_prev"
        next-icon="$vuetify.icons.page_next"
        :length="pageCount"
      ></v-pagination>
    </div>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js'
import log from 'loglevel'

import { ACTIVITY_ACTION_ALL, ACTIVITY_PERIOD_ALL, ACTIVITY_PERIOD_MONTH_ONE, ACTIVITY_PERIOD_WEEK_ONE } from '../../../utils/enums'
import TransactionDetails from '../TransactionDetails'

export default {
  components: {
    TransactionDetails,
  },
  props: {
    transactions: {
      type: Array,
      default() {
        return []
      },
    },
    selectedAction: {
      type: String,
      default: '',
    },
    selectedPeriod: {
      type: String,
      default: '',
    },
    currencyMultiplier: {
      type: BigNumber,
      default: new BigNumber('0'),
    },
    selectedCurrency: {
      type: String,
      default: 'USD',
    },
    cancelGasPrice: {
      type: BigNumber,
      default: new BigNumber('5'),
    },
  },
  data() {
    return {
      page: 1,
      itemsPerPage: 8,
      expanded: [],
      pagination: {},
      defaultSort: 'date',
    }
  },
  computed: {
    showFooter() {
      return this.transactions && this.transactions.length > 5
    },
    pageCount() {
      return Math.ceil(this.filteredTransactions.length / this.itemsPerPage)
    },
    oneWeekAgoDate() {
      const minDate = new Date()
      return minDate.setDate(minDate.getDate() - 7)
    },
    oneMonthAgoDate() {
      const minDate = new Date()
      return minDate.setMonth(minDate.getMonth() - 1)
    },
    sixMonthAgoDate() {
      const minDate = new Date()
      return minDate.setMonth(minDate.getMonth() - 6)
    },
    filteredTransactions() {
      const selectedAction = this.selectedAction === ACTIVITY_ACTION_ALL ? '' : this.selectedAction
      const regExAction = new RegExp(selectedAction, 'i')

      const transactions = this.transactions.filter((item) => {
        // GET Date Scope
        let isScoped = false
        if (this.selectedPeriod === ACTIVITY_PERIOD_ALL) {
          isScoped = true
        } else {
          let minDate
          const itemDate = new Date(item.date)
          if (this.selectedPeriod === ACTIVITY_PERIOD_WEEK_ONE) {
            minDate = this.oneWeekAgoDate
          } else if (this.selectedPeriod === ACTIVITY_PERIOD_MONTH_ONE) {
            minDate = this.oneMonthAgoDate
          } else {
            minDate = this.sixMonthAgoDate
          }
          isScoped = minDate <= itemDate.getTime()
        }

        if (item.action) {
          return item.action.match(regExAction) && isScoped
        }
        return isScoped
      })

      log.info('transactions', transactions)

      return transactions
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
    rowClicked(item) {
      if (this.expanded.includes(item)) {
        this.expanded = []
      } else {
        this.expanded = [item]
      }
    },
    cancelTransaction(transaction) {
      this.$emit('cancelTransaction', transaction)
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'TxHistoryTable.scss';
</style>
