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
        <transaction-details v-for="transaction in props.items" :key="transaction.id" :transaction="transaction" />
      </template>
      <template v-slot:loading>
        <component-loader class="mt-2" />
      </template>
    </v-data-iterator>

    <div class="text-center pt-6" v-if="!$vuetify.breakpoint.xsOnly && pageCount > 1">
      <v-pagination
        class="activity-pagination"
        prev-icon="$vuetify.icons.page_prev"
        next-icon="$vuetify.icons.page_next"
        v-model="page"
        :length="pageCount"
      ></v-pagination>
    </div>
  </div>
</template>

<script>
import TransactionDetails from '../TransactionDetails'
import ComponentLoader from '../../helpers/ComponentLoader'
import {
  SUPPORTED_NETWORK_TYPES,
  ACTIVITY_ACTION_ALL,
  ACTIVITY_ACTION_TOPUP,
  ACTIVITY_ACTION_RECEIVE,
  ACTIVITY_ACTION_SEND,
  ACTIVITY_PERIOD_ALL,
  ACTIVITY_PERIOD_MONTH_ONE,
  ACTIVITY_PERIOD_WEEK_ONE,
  ACTIVITY_STATUS_SUCCESSFUL,
  ACTIVITY_STATUS_UNSUCCESSFUL,
  ACTIVITY_STATUS_PENDING
} from '../../../utils/enums'

export default {
  props: ['transactions', 'selectedAction', 'selectedPeriod', 'loadingTransactions'],
  components: {
    TransactionDetails,
    ComponentLoader
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
      let minDate = new Date()
      return minDate.setDate(minDate.getDate() - 7)
    },
    oneMonthAgoDate() {
      let minDate = new Date()
      return minDate.setMonth(minDate.getMonth() - 1)
    },
    sixMonthAgoDate() {
      let minDate = new Date()
      return minDate.setMonth(minDate.getMonth() - 6)
    },
    filteredTransactions() {
      const selectedAction = this.selectedAction === ACTIVITY_ACTION_ALL ? '' : this.selectedAction
      var regExAction = new RegExp(selectedAction, 'i')

      return this.transactions.filter(item => {
        // GET Date Scope
        let isScoped = false
        if (this.selectedPeriod === ACTIVITY_PERIOD_ALL) {
          isScoped = true
        } else {
          let minDate
          let itemDate = new Date(item.date)
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
        } else {
          return isScoped
        }
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
      if (this.expanded.indexOf(item) >= 0) {
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
