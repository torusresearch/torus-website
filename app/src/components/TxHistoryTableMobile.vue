<template>
  <v-container class="activity-table-mobile">
    <v-expansion-panels multiple>
      <v-expansion-panel v-for="transaction in filteredTransactions" :key="`${transaction.id}`">
        <v-expansion-panel-header class="px-2">
          <div>
            <v-layout>
              <v-flex xs6 my-2 class="subtitle-2">
                <v-icon small>{{ getIcon(transaction.action) }}</v-icon>
                {{ transaction.action === 'Sending' && transaction.status === 'confirmed' ? 'Sent' : transaction.action }}
              </v-flex>
              <v-flex xs6 my-2 class="body-2 text-right torus_text--text text--lighten-4 text-capitalize">
                {{ transaction.status }}
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
            <v-layout>
              <v-flex xs6 my-2 class="caption torus_text--text text--lighten-4">
                Date:
              </v-flex>
              <v-flex xs6 my-2 class="caption text-right">
                {{ formatDate(transaction.date) }}
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
            <v-layout>
              <v-flex xs6 my-2 class="caption torus_text--text text--lighten-4">
                Amount:
              </v-flex>
              <v-flex xs6 my-2 class="caption text-right">
                {{ transaction.amount }}
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
            <v-layout>
              <v-flex xs2 my-2 class="caption torus_text--text text--lighten-4">
                To:
              </v-flex>
              <v-flex xs10 my-2 class="caption text-right">
                {{ transaction.slicedTo }}
              </v-flex>
            </v-layout>
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-card class="pa-3" color="background_2" :key="`${transaction.id}-details`">
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
                <v-btn text small color="primary" href="" target="_blank">View On Etherscan</v-btn>
              </v-flex>
            </v-layout>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
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
.activity-table-mobile {
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

  ::v-deep .v-expansion-panel-content__wrap {
    padding: 0 8px 8px;
  }
}
</style>
