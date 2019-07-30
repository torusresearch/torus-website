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
        {{ item.action }}
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
      <td :colspan="headers.length" class="pa-0 ma-0" style="height: inherit">
        <v-flex xs12 white class="card-shadow dark pa-4">
          <v-layout wrap>
            <v-flex xs4 sm1 pr-2>
              Rate
              <span class="float-right">:</span>
            </v-flex>
            <v-flex xs8 sm11>1 ETH = 240.00 USD @ 12:34:20 PM</v-flex>
            <v-flex xs4 sm1 pr-2>
              Network
              <span class="float-right">:</span>
            </v-flex>
            <v-flex xs8 sm11>Main Ethereum Network</v-flex>
            <v-flex xs4 sm1 pr-2>
              Type
              <span class="float-right">:</span>
            </v-flex>
            <v-flex xs8 sm11>Contract Interaction</v-flex>
            <v-flex xs4 sm1 pr-2>
              Data
              <span class="float-right">:</span>
            </v-flex>
            <v-flex xs8 sm11>
              <v-card flat class="grey lighten-3">
                <v-card-text></v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12 class="text-right">
              <v-btn text small color="primary" :href="item.etherscanLink" target="_blank">View On Etherscan</v-btn>
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
      ]
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
      return date.substring(0, 6)
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
.activity-table {
  .text-successful,
  .text-confirmed {
    color: #2dcc70;
  }

  .text-denied,
  .text-rejected,
  .text-unapproved {
    color: #e20d0d;
  }

  .text-pending,
  .text-submitted {
    color: #b3c0ce;
  }

  .text-gray {
    color: #5c6c7f;
  }

  ::v-deep tr > td {
    cursor: pointer;
  }

  ::v-deep .expanded__content {
    box-shadow: none !important;
  }
}
</style>
