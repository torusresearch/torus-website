<template>
  <v-container class="activity-table-mobile" :data-count-transfer="nonTopupTransactionCount">
    <v-expansion-panels multiple>
      <v-expansion-panel v-for="transaction in filteredTransactions" :key="`${transaction.id}`">
        <v-expansion-panel-header class="px-2">
          <div>
            <v-layout>
              <v-flex xs6 my-2 class="subtitle-2">
                <v-icon small>{{ transaction.actionIcon }}</v-icon>
                <span class="transaction-action">{{ transaction.action }}</span>
              </v-flex>
              <v-flex xs6 my-2 class="body-2 text-right text-capitalize" :class="`text-${transaction.status.toLowerCase()}`">
                {{ transaction.statusText }}
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
            <v-layout>
              <v-flex xs6 my-2 class="caption text_1--text text--lighten-4">
                Date:
              </v-flex>
              <v-flex xs6 my-2 class="caption text-right">
                <span class="transaction-date">{{ transaction.dateFormatted }}</span>
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
            <v-layout>
              <v-flex xs6 my-2 class="caption text_1--text text--lighten-4">
                Amount:
              </v-flex>
              <v-flex xs6 my-2 class="caption text-right">
                {{ transaction.amount }}
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
            <v-layout>
              <v-flex xs2 my-2 class="caption text_1--text text--lighten-4">
                To:
              </v-flex>
              <v-flex xs10 my-2 class="caption text-right">
                {{ transaction.slicedTo }}
              </v-flex>
            </v-layout>
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-card class="pa-3" color="background lighten-2" :key="`${transaction.id}-details`" v-show="transaction.etherscanLink !== ''">
            <v-layout wrap>
              <v-flex xs4 sm1 pr-2>
                Rate
                <span class="float-right">:</span>
              </v-flex>
              <v-flex xs8 sm11>1 ETH = {{ transaction.ethRate }} {{ transaction.currencyUsed }} @ {{ transaction.timeFormatted }}</v-flex>
              <v-flex xs4 sm1 pr-2>
                Network
                <span class="float-right">:</span>
              </v-flex>
              <v-flex xs8 sm11>{{ (mapper[transaction.networkType] && mapper[transaction.networkType].networkName) || '' }}</v-flex>
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
                <a class="v-btn" color="primary" :href="transaction.etherscanLink" target="_blank">View On Etherscan</a>
              </v-flex>
            </v-layout>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script>
import TxHistoryMixin from '../TxHistoryMixin'

export default {
  mixins: [TxHistoryMixin],
  data() {
    return {
      expand: false,
      pagination: {},
      defaultSort: 'date',
      search: ''
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'TxHistoryTableMobile.scss';
</style>
