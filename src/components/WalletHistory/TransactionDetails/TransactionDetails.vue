<template>
  <v-card color="elevation-1 activity mb-4 pa-5" :ripple="false" @click="showDetails = !showDetails">
    <v-layout wrap mx-n4 mb-5 mb-sm-0>
      <v-flex
        px-4
        :class="$vuetify.breakpoint.xsOnly ? 'order-2 pt-2' : 'order-0'"
        :style="{ marginLeft: $vuetify.breakpoint.xsOnly ? '48px' : '0', maxWidth: $vuetify.breakpoint.xsOnly ? '150px' : '105px' }"
      >
        <div class="caption text_1--text" :class="{ 'font-weight-medium': !$vuetify.breakpoint.xsOnly }">{{ transaction.dateFormatted }}</div>
        <div class="info text_2--text font-weight-light">{{ transaction.timeFormatted }}</div>
      </v-flex>
      <v-divider v-if="!$vuetify.breakpoint.xsOnly" vertical class="mx-4"></v-divider>
      <v-flex :class="$vuetify.breakpoint.xsOnly ? 'xs8 order-0 pr-4 pl-3' : 'xs5 order-1 pl-0 pr-4'">
        <TransactionImage :transaction="transaction" />
      </v-flex>
      <v-flex class="text-right" :class="$vuetify.breakpoint.xsOnly ? 'xs4 order-1' : 'xs2 order-2'" px-4>
        <div class="caption text_1--text font-weight-medium">
          <span
            v-if="
              transaction.type !== CONTRACT_TYPE_ERC721 && transaction.type !== CONTRACT_TYPE_ERC1155 && transaction.action === ACTIVITY_ACTION_SEND
            "
            class="error--text"
          >
            -
          </span>
          {{ transaction.totalAmountString }}
        </div>
        <div class="info text_2--text font-weight-light">{{ transaction.currencyAmountString }}</div>
      </v-flex>
      <v-flex :class="$vuetify.breakpoint.xsOnly ? 'xs6 ml-auto text-right mt-3 order-3' : 'xs2 ml-auto text-right order-4'" px-4>
        <v-chip class="status-chip black--text" :color="getChipColor(transaction.statusText)" small>
          {{ t(transaction.statusText) }}
        </v-chip>
      </v-flex>
    </v-layout>
    <v-divider v-if="$vuetify.breakpoint.xsOnly && showDetails" class="my-4"></v-divider>
    <TransactionDetailsMore v-if="showDetails" :transaction="transaction" @showCancelTransaction="cancelTransactionModal = true" />
    <CancellationModal :cancel-dialog="cancelTransactionModal" :transaction="transaction" @close="cancelTransactionModal = false" />
  </v-card>
</template>

<script>
import config from '../../../config'
import {
  ACTIVITY_ACTION_SEND,
  ACTIVITY_STATUS_SUCCESSFUL,
  ACTIVITY_STATUS_UNSUCCESSFUL,
  CONTRACT_TYPE_ERC721,
  CONTRACT_TYPE_ERC1155,
} from '../../../utils/enums'
import CancellationModal from '../CancellationModal'
import TransactionDetailsMore from '../TransactionDetailsMore'
import TransactionImage from '../TransactionImage'

export default {
  components: {
    CancellationModal,
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
  },
  data() {
    return {
      showDetails: false,
      cancelTransactionModal: false,
      ACTIVITY_ACTION_SEND,
      ACTIVITY_STATUS_SUCCESSFUL,
      ACTIVITY_STATUS_UNSUCCESSFUL,
      CONTRACT_TYPE_ERC721,
      CONTRACT_TYPE_ERC1155,
      logosUrl: config.logosUrl,
    }
  },
  methods: {
    getChipColor(status) {
      if (status === ACTIVITY_STATUS_SUCCESSFUL) return '#9BE8C7'
      if (status === ACTIVITY_STATUS_UNSUCCESSFUL) return '#FEA29F'
      return '#E0E0E0'
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'TransactionDetails.scss';
</style>
