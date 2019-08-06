<template>
  <v-data-table
    class="activity-table"
    :headers="headers"
    :items="filteredTransactions"
    :expanded.sync="expanded"
    item-key="id"
    single-expand
    @click:row="rowClicked"
    hide-default-footer
  >
    <template v-slot:item.action="{ item }">
      <span>
        <v-icon>{{ getIcon(item.action) }}</v-icon>
        {{ item.action === 'Sending' && item.status === 'confirmed' ? 'Sent' : item.action }}
      </span>
    </template>
    <template v-slot:item.from="{ item }">
      <span style="word-break: break-all">{{ item.from }}</span>
    </template>
    <template v-slot:item.to="{ item }">
      <span style="word-break: break-all">{{ item.to }}</span>
    </template>
    <template v-slot:item.date="{ item }">
      <span>{{ formatDate(item.date) }}</span>
    </template>
    <template v-slot:item.status="{ item }">
      <span class="text-capitalize" :class="`text-${item.status.toLowerCase()}`">{{ item.status }}</span>
    </template>
    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length" class="pa-0 ma-0" style="height: inherit" v-show="item.etherscanLink !== ''">
        <v-flex xs12 white class="card-shadow dark pa-4">
          <v-layout wrap>
            <v-flex xs4 sm1 pr-2>
              Rate
              <span class="float-right">:</span>
            </v-flex>
            <v-flex xs8 sm11>1 ETH = {{ item.ethRate }} {{ item.currencyUsed }} @ {{ formatTime(item.date) }}</v-flex>
            <v-flex xs4 sm1 pr-2>
              Network
              <span class="float-right">:</span>
            </v-flex>
            <v-flex xs8 sm11>{{ mapper[item.networkType] || '' }}</v-flex>
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
</template>

<script>
const {
  ROPSTEN,
  RINKEBY,
  KOVAN,
  MAINNET,
  LOCALHOST,
  GOERLI,
  RPC,
  ROPSTEN_DISPLAY_NAME,
  RINKEBY_DISPLAY_NAME,
  KOVAN_DISPLAY_NAME,
  MAINNET_DISPLAY_NAME,
  LOCALHOST_DISPLAY_NAME,
  GOERLI_DISPLAY_NAME,
  RPC_DISPLAY_NAME
} = require('../../../utils/enums')

const mapper = {
  [ROPSTEN]: ROPSTEN_DISPLAY_NAME,
  [RINKEBY]: RINKEBY_DISPLAY_NAME,
  [KOVAN]: KOVAN_DISPLAY_NAME,
  [MAINNET]: MAINNET_DISPLAY_NAME,
  [LOCALHOST]: LOCALHOST_DISPLAY_NAME,
  [GOERLI]: GOERLI_DISPLAY_NAME,
  [RPC]: RPC_DISPLAY_NAME
}

export default {
  props: ['transactions', 'selectedAction', 'selectedPeriod'],
  data() {
    return {
      expanded: [],
      expand: false,
      pagination: {},
      defaultSort: 'date',
      search: '',
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
          width: '350px'
        },
        {
          text: 'To',
          value: 'to',
          align: 'left',
          width: '350px'
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
      ],
      mapper: mapper
    }
  },
  computed: {
    showFooter() {
      return this.transactions && this.transactions.length > 5
    },
    filteredTransactions() {
      const selectedAction = this.selectedAction === 'All Transactions' ? '' : this.selectedAction
      var regExAction = new RegExp(selectedAction, 'i')

      return this.transactions.filter(item => {
        // GET Date Scope
        let isScoped = false
        if (this.selectedPeriod === 'Period') {
          isScoped = true
        } else {
          let minDate = new Date()
          let itemDate = new Date(item.date)
          if (this.selectedPeriod === 'Last Week') {
            minDate.setDate(minDate.getDate() - 7)
          } else {
            minDate.setMonth(minDate.getMonth() - 1)
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
    formatDate(date) {
      return date
        .toString()
        .substring(4)
        .substring(0, 20)
    },
    formatTime(time) {
      return time.toTimeString().substring(0, 8)
    },
    getIcon(action) {
      if (action === 'Top-up') {
        return '$vuetify.icons.arrow_up_circle'
      } else if (action === 'Sending') {
        return '$vuetify.icons.arrow_left_circle'
      } else if (action === 'Received') {
        return '$vuetify.icons.arrow_right_circle'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'TxHistoryTable.scss';
</style>
