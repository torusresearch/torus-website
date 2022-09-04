<template>
  <v-card color="elevation-1 activity mb-4 pa-5" :ripple="false" @click="showDetails = !showDetails" @keydown.enter="showDetails = !showDetails">
    <v-row wrap class="mx-n4 mb-5 mb-sm-0">
      <v-col
        px-4
        :class="$vuetify.display.xs ? 'order-2 pt-2' : 'order-0'"
        :style="{ marginLeft: $vuetify.display.xs ? '48px' : '0', maxWidth: $vuetify.display.xs ? '150px' : '105px' }"
      >
        <div class="caption text-text_1" :class="{ 'font-weight-medium': !$vuetify.display.xs }">{{ transaction.dateFormatted }}</div>
        <div class="info text-text_2 font-weight-light">{{ transaction.timeFormatted }}</div>
      </v-col>
      <v-divider v-if="!$vuetify.display.xs" vertical class="mx-4"></v-divider>
      <v-col :cols="$vuetify.display.xs ? '8' : '5'" :class="$vuetify.display.xs ? 'order-0 pr-4 pl-3' : 'order-1 pl-0 pr-4'">
        <TransactionImage :transaction="transaction" />
      </v-col>
      <v-col :cols="$vuetify.display.xs ? '4' : '2'" class="text-right px-4" :class="$vuetify.display.xs ? 'order-1' : 'order-2'">
        <div class="caption text-text_1 font-weight-medium">
          <span
            v-if="
              transaction.type !== CONTRACT_TYPE_ERC721 && transaction.type !== CONTRACT_TYPE_ERC1155 && transaction.action === ACTIVITY_ACTION_SEND
            "
            class="text-error"
          >
            -
          </span>
          {{ transaction.totalAmountString }}
        </div>
        <div class="info text-text_2 font-weight-light">{{ transaction.currencyAmountString }}</div>
      </v-col>
      <v-col
        :cols="$vuetify.display.xs ? '6' : '2'"
        :class="$vuetify.display.xs ? 'ml-auto text-right mt-3 order-3' : 'ml-auto text-right order-4'"
        class="px-4"
      >
        <v-chip class="status-chip text-black" :color="getChipColor(transaction.statusText)" size="small">
          {{ $t(transaction.statusText) }}
        </v-chip>
      </v-col>
    </v-row>
    <v-divider v-if="$vuetify.display.xs && showDetails" class="my-4"></v-divider>
    <TransactionDetailsMore
      v-if="showDetails"
      :transaction="transaction"
      :cancellation-fee-estimate="cancellationFeeEstimate"
      :cancellation-fee="cancellationFee"
      @showCancelTransaction="cancelTransactionModal = true"
    />
    <CancellationModal
      :cancel-dialog="cancelTransactionModal"
      :transaction="transaction"
      :cancellation-fee-estimate="cancellationFeeEstimate"
      @close="cancelTransactionModal = false"
      @cancelTransaction="cancelTransaction"
    />
    <CancellationFailedModal :cancel-dialog="failedCancelModal" :transaction="transaction" @close="failedCancelModal = false" />
  </v-card>
</template>

<script>
import BigNumber from 'bignumber.js'

import config from '../../../config'
import {
  ACTIVITY_ACTION_SEND,
  ACTIVITY_STATUS_CANCELLED,
  ACTIVITY_STATUS_SUCCESSFUL,
  ACTIVITY_STATUS_UNSUCCESSFUL,
  CONTRACT_TYPE_ERC721,
  CONTRACT_TYPE_ERC1155,
} from '../../../utils/enums'
import { significantDigits } from '../../../utils/utils'
import CancellationFailedModal from '../CancellationFailedModal'
import CancellationModal from '../CancellationModal'
import TransactionDetailsMore from '../TransactionDetailsMore'
import TransactionImage from '../TransactionImage'

const weiInGwei = new BigNumber('10').pow(new BigNumber('9'))

export default {
  components: {
    CancellationModal,
    CancellationFailedModal,
    TransactionDetailsMore,
    TransactionImage,
  },
  props: {
    transaction: {
      type: Object,
      default() {
        return {}
      },
    },
    currencyMultiplier: {
      type: BigNumber,
      default: new BigNumber('0'),
    },
    selectedCurrency: {
      type: String,
      default: 'USD',
    },
    cancelGasPrice: {
      type: BigNumber,
      default: new BigNumber('5'),
    },
  },
  data() {
    return {
      showDetails: false,
      cancelTransactionModal: false,
      failedCancelModal: false,
      ACTIVITY_ACTION_SEND,
      ACTIVITY_STATUS_SUCCESSFUL,
      ACTIVITY_STATUS_UNSUCCESSFUL,
      CONTRACT_TYPE_ERC721,
      CONTRACT_TYPE_ERC1155,
      logosUrl: config.logosUrl,
    }
  },
  computed: {
    cancellationFeeEstimate() {
      const { gas } = this.transaction
      const gweiGasPrice = this.cancelGasPrice
      const gasCost = gweiGasPrice.times(new BigNumber(gas)).div(new BigNumber('10').pow(new BigNumber('9')))
      const txFee = gasCost.times(this.currencyMultiplier)

      return `${significantDigits(txFee, false, 2)} ${this.selectedCurrency}`
    },
    cancellationFee() {
      if (!this.transaction.hasCancel) return ''
      const { cancelGas: gas, cancelGasPrice: gasPrice } = this.transaction
      const gweiGasPrice = new BigNumber(gasPrice).div(weiInGwei)
      const gasCost = gweiGasPrice.times(new BigNumber(gas)).div(new BigNumber('10').pow(new BigNumber('9')))
      const txFee = gasCost.times(this.currencyMultiplier)

      return `${significantDigits(txFee, false, 2)} ${this.selectedCurrency}`
    },
  },
  watch: {
    transaction: {
      handler(newVal, oldVal) {
        // alert when cancel transaction fails
        const failingList = new Set(['cancelling', 'cancelled'])
        if (oldVal.status === 'cancelling' && !failingList.has(newVal.status)) {
          this.failedCancelModal = true
        }
      },
      deep: true,
    },
  },
  methods: {
    getChipColor(status) {
      if (status === ACTIVITY_STATUS_SUCCESSFUL) return '#9BE8C7'
      if (status === ACTIVITY_STATUS_UNSUCCESSFUL || status === ACTIVITY_STATUS_CANCELLED) return '#FEA29F'
      return '#E0E0E0'
    },
    cancelTransaction() {
      this.$emit('cancelTransaction', this.transaction)
      this.cancelTransactionModal = false
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'TransactionDetails.scss';
</style>
