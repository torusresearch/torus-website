<template>
  <div class="activity-table" :data-count="transactions.length" :data-per-page="itemsPerPage" :data-count-transfer="nonTopupTransactionCount">
    <v-data-table
      :headers="headers"
      :items="filteredTransactions"
      :expanded.sync="expanded"
      item-key="id"
      single-expand
      @click:row="rowClicked"
      hide-default-footer
      :page.sync="page"
      :items-per-page="itemsPerPage"
      @page-count="pageCount = $event"
    >
      <template v-slot:item.action="{ item }">
        <span>
          <v-icon>{{ item.actionIcon }}</v-icon>
          <span class="transaction-action">{{ item.action }}</span>
        </span>
      </template>
      <template v-slot:item.from="{ item }">
        <span style="word-break: break-all">{{ item.from }}</span>
      </template>
      <template v-slot:item.to="{ item }">
        <span style="word-break: break-all">{{ item.to }}</span>
      </template>
      <template v-slot:item.date="{ item }">
        <span class="transaction-date">{{ item.dateFormatted }}</span>
      </template>
      <template v-slot:item.status="{ item }">
        <span class="text-capitalize" :class="`text-${item.status.toLowerCase()}`">{{ item.statusText }}</span>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length" class="pa-0 ma-0" style="height: inherit" v-show="item.etherscanLink !== ''">
          <v-flex xs12 white class="card-shadow dark pa-4">
            <v-layout wrap>
              <v-flex xs4 sm1 pr-2>
                Rate
                <span class="float-right">:</span>
              </v-flex>
              <v-flex xs8 sm11>1 ETH = {{ item.ethRate }} {{ item.currencyUsed }} @ {{ item.timeFormatted }}</v-flex>
              <v-flex xs4 sm1 pr-2>
                Network
                <span class="float-right">:</span>
              </v-flex>
              <v-flex xs8 sm11>{{ (mapper[item.networkType] && mapper[item.networkType].networkName) || '' }}</v-flex>
              <!-- <v-flex xs4 sm1 pr-2>
                Type
                <span class="float-right">:</span>
              </v-flex>
              <v-flex xs8 sm11>Contract Interaction</v-flex> -->
              <!-- <v-flex xs4 sm1 pr-2>
                Data
                <span class="float-right">:</span>
              </v-flex>
              <v-flex xs8 sm11>
                <v-card flat class="grey lighten-3">
                  <v-card-text></v-card-text>
                </v-card>
              </v-flex> -->
              <v-flex xs12 class="text-right">
                <a class="v-btn" color="primary" :href="item.etherscanLink" target="_blank">View On Etherscan</a>
              </v-flex>
            </v-layout>
          </v-flex>
        </td>
      </template>
      <template v-slot:no-data>
        <v-flex xs12 class="text-center">No Transaction Activity!</v-flex>
      </template>
    </v-data-table>
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

export default {
  mixins: [TxHistoryMixin],
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 8,
      expanded: [],
      pagination: {},
      defaultSort: 'date',
      headers: [
        {
          text: 'Transaction',
          value: 'action',
          align: 'left',
          width: '150px'
        },
        {
          text: 'From',
          value: 'from',
          align: 'left',
          width: '300px'
        },
        {
          text: 'To',
          value: 'to',
          align: 'left',
          width: '300px'
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
