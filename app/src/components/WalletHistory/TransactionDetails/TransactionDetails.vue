<template>
  <v-dialog v-model="dialog" width="400" :fullscreen="$vuetify.breakpoint.xsOnly">
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
              <cancel-transaction :transaction="transaction" @onConfirm="cancelTransaction"></cancel-transaction>
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
                1 ETH = {{ transaction.ethRate }} {{ transaction.currencyUsed }} @ {{ transaction.timeFormatted }}
                {{ JSON.stringify(transaction.gas) }}
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
  </v-dialog>
</template>

<script>
import SpeedUpTransaction from '../SpeedUpTransaction'
import CancelTransaction from '../CancelTransaction'

export default {
  props: ['transaction'],
  components: {
    SpeedUpTransaction,
    CancelTransaction
  },
  data() {
    return {
      dialog: false
    }
  },
  methods: {
    cancelTransaction(data) {
      this.$emit('onCancelTransaction', data)
      this.dialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'TransactionDetails.scss';
</style>
