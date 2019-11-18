<template>
  <div class="activity-table" :data-count="transactions.length" :data-per-page="itemsPerPage" :data-count-transfer="nonTopupTransactionCount">
    <v-dialog width="400" :fullscreen="$vuetify.breakpoint.xsOnly" v-for="transaction in filteredTransactions" :key="transaction.id">
      <template v-slot:activator="{ on }">
        <v-card color="card-shadow activity mb-4 pa-5" v-on="on">
          <v-layout>
            <v-flex xs2>
              <div class="caption font-weight-medium">{{ transaction.dateFormatted }}</div>
              <div class="info font-weight-light">{{ transaction.dateFormatted }}</div>
            </v-flex>
            <v-flex xs5>
              <v-icon large color="primary" class="float-left mr-2">{{ transaction.actionIcon }}</v-icon>
              <div class="caption font-weight-medium">{{ transaction.action }}</div>
              <div class="info font-weight-light">to {{ transaction.to }}</div>
            </v-flex>
            <v-flex xs4 class="text-right">
              <div class="caption font-weight-medium">{{ transaction.totalAmountString }}</div>
              <div class="info font-weight-light">{{ transaction.currencyAmountString }}</div>
            </v-flex>
            <v-flex xs2></v-flex>
            <v-flex xs2 class="text-center">
              <template v-if="transaction.statusText === 'Pending'">
                <div class="caption font-weight-medium mb-1">{{ transaction.statusText }}</div>
                <v-progress-linear color="success" value="15"></v-progress-linear>
              </template>
              <v-chip v-else :color="transaction.statusText === 'Successful' ? '#9BE8C7' : '#FEA29F'" x-small>
                {{ transaction.statusText }}
              </v-chip>
            </v-flex>
          </v-layout>
        </v-card>
      </template>
      <transaction-details :transaction="transaction" />
    </v-dialog>
    <!-- <v-data-table
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
          <v-flex xs12 class="pa-4" :class="$vuetify.theme.dark ? 'background lighten-2' : ''">
            <v-layout wrap>
              <v-flex xs4 sm1 pr-2>
                Rate
                <span class="float-right">:</span>
              </v-flex>
              <v-flex xs8 sm11>1 ETH = {{ item.ethRate }} {{ item.currencyUsed }} @ {{ item.timeFormatted }} {{ JSON.stringify(item.gas) }}</v-flex>
              <v-flex xs4 sm1 pr-2>
                Network
                <span class="float-right">:</span>
              </v-flex>
              <v-flex xs8 sm11>{{ (mapper[item.networkType] && mapper[item.networkType].networkName) || '' }}</v-flex>

              <v-flex xs12 class="text-right" v-if="Object.keys(item.gas).length">
                <v-btn color="primary" class="px-6" @click="speedUpTx = true">Speed up transaction</v-btn>
              </v-flex>

              <v-dialog v-model="speedUpTx" max-width="1000" :fullscreen="$vuetify.breakpoint.xsOnly">
                <SpeedUpTransaction :gas="item.gas" @onClose="speedUpTx = false" />
              </v-dialog>
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
    </div> -->
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
      pageCount: 0,
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
