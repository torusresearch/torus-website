<template>
  <v-card class="activity-details py-6 px-8">
    <v-layout wrap>
      <v-flex xs12>
        <div class="font-weight-bold headline">{{ transaction.action }}</div>
      </v-flex>
      <v-flex xs12>
        <v-chip
          :color="transaction.statusText === 'Successful' ? '#9BE8C7' : transaction.statusText === 'Unsuccessful' ? '#FEA29F' : '#E0E0E0'"
          x-small
        >
          {{ transaction.statusText }}
        </v-chip>
        <a class="caption v-btn float-right" color="primary" :href="transaction.etherscanLink" target="_blank">View On Etherscan</a>
      </v-flex>
      <v-flex xs12>
        <v-layout>
          <v-flex xs6 class="mr-1">
            <speed-up-transaction :transaction="transaction"></speed-up-transaction>
          </v-flex>
          <v-flex xs6 class="ml-1">
            <cancel-transaction :transaction="transaction"></cancel-transaction>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12>
        <v-list>
          <v-list-item>
            <v-list-item-content>Started at:</v-list-item-content>
            <v-list-item-content class="align-end">{{ transaction.dateFormatted }}</v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>Send to:</v-list-item-content>
            <v-list-item-content class="align-end">{{ transaction.to }}</v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>Rate:</v-list-item-content>
            <v-list-item-content class="align-end">
              1 ETH = {{ transaction.ethRate }} {{ transaction.currencyUsed }} @ {{ transaction.timeFormatted }} {{ JSON.stringify(transaction.gas) }}
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>Amount:</v-list-item-content>
            <v-list-item-content class="align-end">
              <div class="caption font-weight-medium">{{ transaction.totalAmountString }}</div>
              <div class="caption font-weight-light">{{ transaction.currencyAmountString }}</div>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>Network:</v-list-item-content>
            <v-list-item-content class="align-end">{{ transaction.networkType }}</v-list-item-content>
          </v-list-item>
        </v-list>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import SpeedUpTransaction from '../SpeedUpTransaction'
import CancelTransaction from '../CancelTransaction'

export default {
  props: ['transaction'],
  components: {
    SpeedUpTransaction,
    CancelTransaction
  }
}
</script>
