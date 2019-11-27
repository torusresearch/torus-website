<template>
  <v-dialog v-model="dialog" width="400">
    <template v-slot:activator="{ on }">
      <v-card color="card-shadow activity mb-4 pa-5" v-on="on">
        <v-layout wrap>
          <v-flex :class="$vuetify.breakpoint.xsOnly ? 'xs4' : 'xs2'">
            <div class="caption font-weight-medium">{{ transaction.dateFormatted }}</div>
            <div class="info font-weight-light">{{ transaction.timeFormatted }}</div>
          </v-flex>
          <v-flex :class="$vuetify.breakpoint.xsOnly ? 'xs4' : 'xs2'">
            <v-icon large color="primary" class="float-left mr-2">{{ transaction.actionIcon }}</v-icon>
            <div class="caption font-weight-medium">{{ transaction.actionText }}</div>
            <div class="info font-weight-light">to {{ transaction.slicedTo }}</div>
          </v-flex>
          <v-flex xs4 class="text-right">
            <div class="caption font-weight-medium">
              <span v-if="transaction.action === ACTIVITY_ACTION_SEND" class="error--text">-</span>
              {{ transaction.totalAmountString }}
            </div>
            <div class="info font-weight-light">{{ transaction.currencyAmountString }}</div>
          </v-flex>
          <v-flex xs2 v-if="!$vuetify.breakpoint.xsOnly"></v-flex>
          <v-flex :class="$vuetify.breakpoint.xsOnly ? 'xs12 text-right mt-4' : 'xs2 text-center'">
            <!-- <template v-if="transaction.statusText === 'Pending'">
              <div class="caption font-weight-medium mb-1">{{ transaction.statusText }}</div>
              <v-progress-linear color="success" value="15"></v-progress-linear>
            </template> -->
            <v-chip :color="getChipColor(transaction.statusText)" small>
              {{ transaction.statusText }}
            </v-chip>
          </v-flex>
        </v-layout>
      </v-card>
    </template>
    <v-card class="activity-details py-6 px-8">
      <v-layout wrap>
        <v-flex xs12 class="mb-2">
          <div class="font-weight-bold headline">{{ transaction.actionText }}</div>
          <span class="float-right"></span>
        </v-flex>
        <v-flex xs12>
          <v-chip :color="getChipColor(transaction.statusText)" small>
            {{ transaction.statusText }}
          </v-chip>
          <a class="caption v-btn float-right" color="primary" :href="transaction.etherscanLink" target="_blank">View On Etherscan</a>
        </v-flex>
        <!-- <v-flex xs12 class="mt-4" v-if="transaction.statusText === ACTIVITY_STATUS_PENDING">
          <v-layout>
            <v-flex xs6 class="mr-1 text-right">
              <speed-up-transaction :transaction="transaction"></speed-up-transaction>
            </v-flex>
            <v-flex xs6 class="ml-1">
              <cancel-transaction :transaction="transaction" @onConfirm="cancelTransaction"></cancel-transaction>
            </v-flex>
          </v-layout>
        </v-flex> -->
        <v-flex xs12>
          <v-list class="mx-n4 body-2">
            <v-list-item>
              <v-list-item-content>Started at:</v-list-item-content>
              <v-list-item-content class="text-end">
                <span>
                  <span class="font-weight-medium">{{ transaction.timeFormatted }}</span>
                  - {{ transaction.dateFormatted }}
                </span>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>Send to:</v-list-item-content>
              <v-list-item-content class="text-end address-text">
                <span>{{ transaction.to }}</span>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>Rate:</v-list-item-content>
              <v-list-item-content class="text-end">
                <span>1 ETH = {{ transaction.ethRate }} {{ transaction.currencyUsed }}</span>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>Amount:</v-list-item-content>
              <v-list-item-content class="text-end amount-text">
                <div class="caption font-weight-medium">
                  {{ transaction.action === ACTIVITY_ACTION_SEND ? '- ' : '' }}{{ transaction.totalAmountString }}
                </div>
                <div class="caption font-weight-light">{{ transaction.currencyAmountString }}</div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>Network:</v-list-item-content>
              <v-list-item-content>
                <network-display :network="transaction.networkType"></network-display>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-flex>
      </v-layout>
    </v-card>
  </v-dialog>
</template>

<script>
const { ACTIVITY_ACTION_SEND, ACTIVITY_STATUS_SUCCESSFUL, ACTIVITY_STATUS_UNSUCCESSFUL, ACTIVITY_STATUS_PENDING } = require('../../../utils/enums')

import NetworkDisplay from '../../helpers/NetworkDisplay'
import SpeedUpTransaction from '../SpeedUpTransaction'
import CancelTransaction from '../CancelTransaction'

export default {
  props: ['transaction'],
  components: {
    NetworkDisplay
    // SpeedUpTransaction,
    // CancelTransaction
  },
  data() {
    return {
      dialog: false,
      ACTIVITY_ACTION_SEND,
      ACTIVITY_STATUS_SUCCESSFUL,
      ACTIVITY_STATUS_UNSUCCESSFUL,
      ACTIVITY_STATUS_PENDING
    }
  },
  methods: {
    cancelTransaction(data) {
      this.$emit('onCancelTransaction', data)
      this.dialog = false
    },
    getChipColor(status) {
      return transaction.statusText === ACTIVITY_STATUS_SUCCESSFUL
        ? '#9BE8C7'
        : transaction.statusText === ACTIVITY_STATUS_UNSUCCESSFUL
        ? '#FEA29F'
        : '#E0E0E0'
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'TransactionDetails.scss';
</style>
