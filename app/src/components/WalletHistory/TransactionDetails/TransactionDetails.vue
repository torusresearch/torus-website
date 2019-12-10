<template>
  <v-card color="card-shadow activity mb-4 pa-5" :ripple="false" @click="showDetails = !showDetails">
    <v-layout wrap>
      <v-flex :class="$vuetify.breakpoint.xsOnly ? 'xs4' : 'xs2'">
        <div class="caption font-weight-medium">{{ transaction.dateFormatted }}</div>
        <div class="info font-weight-light">{{ transaction.timeFormatted }}</div>
      </v-flex>
      <v-flex xs4>
        <v-icon large color="primary" class="float-left mr-2">{{ transaction.actionIcon }}</v-icon>
        <div class="caption font-weight-medium">
          {{ transaction.actionText }}{{ transaction.action === ACTIVITY_ACTION_TOPUP ? ` - ${transaction.from}` : '' }}
        </div>
        <div class="info font-weight-light">to {{ transaction.slicedTo }}</div>
      </v-flex>
      <v-flex class="text-right" :class="$vuetify.breakpoint.xsOnly ? 'xs4' : 'xs2'">
        <div class="caption font-weight-medium">
          <span v-if="transaction.action === ACTIVITY_ACTION_SEND" class="error--text">-</span>
          {{ transaction.totalAmountString }}
        </div>
        <div class="info font-weight-light">{{ transaction.currencyAmountString }}</div>
      </v-flex>
      <v-flex xs2 v-if="!$vuetify.breakpoint.xsOnly"></v-flex>
      <v-flex :class="$vuetify.breakpoint.xsOnly ? 'xs12 text-right mt-4' : 'xs2 text-center'">
        <v-chip class="status-chip" :color="getChipColor(transaction.statusText)" small>
          {{ transaction.statusText }}
        </v-chip>
      </v-flex>
    </v-layout>
    <v-divider v-if="this.showDetails" class="mt-2"></v-divider>
    <v-layout wrap v-if="this.showDetails">
      <v-flex x12 class="activity-details">
        <v-list class="mx-n4 caption">
          <v-list-item>
            <v-list-item-content class="details-label">Started at:</v-list-item-content>
            <v-list-item-content class="details-value text_2--text">
              <span>{{ transaction.timeFormatted }} - {{ transaction.dateFormatted }}</span>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content class="details-label">Send to:</v-list-item-content>
            <v-list-item-content class="details-value text_2--text">
              <span>{{ transaction.to }}</span>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content class="details-label">Rate:</v-list-item-content>
            <v-list-item-content class="details-value text_2--text">
              <span>1 ETH = {{ transaction.ethRate }} {{ transaction.currencyUsed }}</span>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content class="details-label">Amount:</v-list-item-content>
            <v-list-item-content class="details-value text_2--text amount-text">
              {{ transaction.totalAmountString }} /{{ transaction.currencyAmountString }}
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content class="details-label">Network:</v-list-item-content>
            <v-list-item-content class="details-value text_2--text">
              <network-display :network="transaction.networkType"></network-display>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="transaction.etherscanLink">
            <v-list-item-content class="details-value text_2--text text-right mt-1">
              <a class="etherscan-lnk" color="primary" :href="transaction.etherscanLink" target="_blank">View On Etherscan</a>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
const {
  ACTIVITY_ACTION_SEND,
  ACTIVITY_STATUS_SUCCESSFUL,
  ACTIVITY_STATUS_UNSUCCESSFUL,
  ACTIVITY_STATUS_PENDING,
  ACTIVITY_ACTION_TOPUP
} = require('../../../utils/enums')

import NetworkDisplay from '../../helpers/NetworkDisplay'

export default {
  props: ['transaction'],
  components: {
    NetworkDisplay
  },
  data() {
    return {
      showDetails: false,
      ACTIVITY_ACTION_SEND,
      ACTIVITY_STATUS_SUCCESSFUL,
      ACTIVITY_STATUS_UNSUCCESSFUL,
      ACTIVITY_STATUS_PENDING,
      ACTIVITY_ACTION_TOPUP
    }
  },
  methods: {
    getChipColor(status) {
      return status === ACTIVITY_STATUS_SUCCESSFUL ? '#9BE8C7' : status === ACTIVITY_STATUS_UNSUCCESSFUL ? '#FEA29F' : '#E0E0E0'
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'TransactionDetails.scss';
</style>
