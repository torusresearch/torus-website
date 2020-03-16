<template>
  <div class="activity-table">
    <v-data-iterator
      :disable-pagination="$vuetify.breakpoint.xsOnly"
      :items="filteredTransactions"
      item-key="id"
      :items-per-page.sync="itemsPerPage"
      :page.sync="page"
      hide-default-footer
      :loading="loadingTransactions"
      no-data-text=""
    >
      <template v-slot:default="props">
        <TransactionDetails v-for="transaction in props.items" :key="transaction.id" :transaction="transaction" />
      </template>
      <template v-slot:loading>
        <ComponentLoader class="mt-2" />
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
import { ACTIVITY_ACTION_ALL, ACTIVITY_PERIOD_ALL, ACTIVITY_PERIOD_MONTH_ONE, ACTIVITY_PERIOD_WEEK_ONE } from '../../../utils/enums'
import ComponentLoader from '../../helpers/ComponentLoader'
import TransactionDetails from '../TransactionDetails'

export default {
  components: {
    TransactionDetails,
    ComponentLoader
  },
  props: {
    transactions: {
      type: Array,
      default() {
        return []
      }
    },
    selectedAction: {
      type: String,
      default: ''
    },
    selectedPeriod: {
      type: String,
      default: ''
    },
    loadingTransactions: {
      type: Boolean
    }
  },
  data() {
    return {
      page: 1,
      itemsPerPage: 8,
      expanded: [],
      pagination: {},
      defaultSort: 'date'
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

      return this.transactions.filter(item => {
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
    rowClicked(item) {
      if (this.expanded.includes(item)) {
        this.expanded = []
      } else {
        this.expanded = [item]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'TxHistoryTable.scss';
</style>
