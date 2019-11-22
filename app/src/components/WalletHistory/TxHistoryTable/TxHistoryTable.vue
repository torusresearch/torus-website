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
import TxHistoryMixin from '../TxHistoryMixin'
import TransactionDetails from '../TransactionDetails'

export default {
  mixins: [TxHistoryMixin],
  components: {
    TransactionDetails
  },
  data() {
    return {
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
    cancelTransaction(data) {
      console.log('cancelTransaction', data)
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'TxHistoryTable.scss';
</style>
