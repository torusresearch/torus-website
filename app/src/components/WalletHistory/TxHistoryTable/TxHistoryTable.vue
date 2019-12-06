<template>
  <div class="activity-table" :data-count="transactions.length" :data-per-page="itemsPerPage" :data-count-transfer="nonTopupTransactionCount">
    <v-data-iterator :items="filteredTransactions" :items-per-page.sync="itemsPerPage" :page.sync="page" hide-default-footer>
      <template v-slot:default="props">
        <transaction-details
          v-for="transaction in props.items"
          :key="transaction.id"
          @onCancelTransaction="cancelTransaction"
          :transaction="transaction"
        />
      </template>
    </v-data-iterator>

    <div class="text-center pt-6" v-if="pageCount > 1">
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

import { formatDate } from '../../../utils/utils'

export default {
  props: ['transactions', 'selectedAction', 'selectedPeriod', 'nonTopupTransactionCount'],
  components: {
    TransactionDetails
  },
  data() {
    return {
      mapper: SUPPORTED_NETWORK_TYPES,
      page: 1,
      itemsPerPage: 8,
      expanded: [],
      pagination: {},
      defaultSort: 'date',
      speedUpTx: false,
      headers: [
        {
          text: 'Transaction',
          value: 'action',
          align: 'left',
          width: '120px'
        },
        {
          text: 'From',
          value: 'from',
          align: 'left',
          class: 'address-col'
        },
        {
          text: 'To',
          value: 'to',
          align: 'left',
          class: 'address-col'
        },
        {
          text: 'Amount',
          value: 'amount',
          align: 'right',
          width: '200px'
        },
        {
          text: 'Date',
          value: 'date',
          align: 'right',
          width: '80px'
        },
        {
          text: 'Status',
          value: 'status',
          align: 'center'
        }
      ]
    }
  },
  computed: {
    showFooter() {
      return this.transactions && this.transactions.length > 5
    },
    pageCount() {
      return Math.ceil(this.filteredTransactions.length / this.itemsPerPage)
    },
    filteredTransactions() {
      const selectedAction = this.selectedAction === ACTIVITY_ACTION_ALL ? '' : this.selectedAction
      var regExAction = new RegExp(selectedAction, 'i')

      return this.transactions
        .map(item => {
          item.actionIcon = this.getIcon(item.action)
          item.actionText = this.getActionText(item.action, 'ETH')
          item.statusText = this.getStatusText(item.status)
          item.dateFormatted = this.formatDate(item.date)
          item.timeFormatted = this.formatTime(item.date)
          return item
        })
        .filter(item => {
          // GET Date Scope
          let isScoped = false
          if (this.selectedPeriod === ACTIVITY_PERIOD_ALL) {
            isScoped = true
          } else {
            let minDate = new Date()
            let itemDate = new Date(item.date)
            if (this.selectedPeriod === ACTIVITY_PERIOD_WEEK_ONE) {
              minDate.setDate(minDate.getDate() - 7)
            } else if (this.selectedPeriod === ACTIVITY_PERIOD_MONTH_ONE) {
              minDate.setMonth(minDate.getMonth() - 1)
            } else {
              minDate.setMonth(minDate.getMonth() - 6)
            }

            isScoped = minDate.getTime() <= itemDate.getTime()
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
    },
    getStatusText(status) {
      switch (status) {
        case 'rejected':
        case 'denied':
        case 'unapproved':
        case 'failed':
          return ACTIVITY_STATUS_UNSUCCESSFUL
        case 'confirmed':
        case 'completed':
        case 'complete':
        case 'success':
          return ACTIVITY_STATUS_SUCCESSFUL
        case 'pending':
        case 'submitted':
        case 'processing':
          return ACTIVITY_STATUS_PENDING
        default:
          return ''
      }
    },
    getActionText(action, item) {
      if (action === ACTIVITY_ACTION_SEND) {
        return 'Send ' + item
      } else if (action === ACTIVITY_ACTION_RECEIVE || action === ACTIVITY_ACTION_TOPUP) {
        return 'Received ' + item
      }
    },
    getIcon(action) {
      if (action === ACTIVITY_ACTION_TOPUP) {
        return '$vuetify.icons.coins_receive'
      } else if (action === ACTIVITY_ACTION_SEND) {
        return '$vuetify.icons.coins_send'
      } else if (action === ACTIVITY_ACTION_RECEIVE) {
        return '$vuetify.icons.coins_receive'
      }
    },
    formatDate(date) {
      return formatDate(date)
    },
    formatTime(time) {
      return time.toTimeString().substring(0, 8)
    },
    cancelTransaction(data) {
      console.log('cancelTransaction', data)
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'TxHistoryTable.scss';
</style>
