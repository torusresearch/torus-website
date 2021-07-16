<template>
  <v-dialog :value="cancelDialog" persistent width="275">
    <v-card class="cancel-transaction-modal">
      <v-card-text class="pa-0">
        <div class="card-header text-center xs12 py-6 px-6">
          <div class="text-body2 text_1--text font-weight-bold">{{ t('walletActivity.cancelModalTitle') }}</div>
          <v-btn class="close-btn" icon aria-label="Close cancel status" title="Close cancel status" @click="close">
            <v-icon>$vuetify.icons.close</v-icon>
          </v-btn>
        </div>
        <div class="px-4 pt-5 pb-8">
          <div class="text-caption text-center text_1--text font-weight-bold mb-7">
            {{ t('walletActivity.cancelModalDesc') }}
            <span class="error--text">{{ t('walletActivity.cancelModalUnsuccessful') }}</span>
          </div>
          <div class="d-flex transaction-details pb-10">
            <TransactionImage :is-cancel="true" :transaction="transaction" />
            <div class="ml-auto amount-container">
              <div class="caption text_1--text font-weight-medium">
                <span
                  v-if="
                    transaction.type !== CONTRACT_TYPE_ERC721 &&
                    transaction.type !== CONTRACT_TYPE_ERC1155 &&
                    transaction.action === ACTIVITY_ACTION_SEND
                  "
                  class="error--text"
                >
                  -
                </span>
                {{ transaction.totalAmountString }}
              </div>
              <div class="info text_2--text font-weight-light">{{ transaction.currencyAmountString }}</div>
            </div>
          </div>
          <div class="ma-2 text-caption text-center">{{ t('walletActivity.cancelModalNote') }}</div>
        </div>
      </v-card-text>
      <v-card-actions class="pb-4">
        <v-btn block text color="text_2" @click="close">{{ t('walletActivity.cancelModalClose') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ACTIVITY_ACTION_SEND, CONTRACT_TYPE_ERC721, CONTRACT_TYPE_ERC1155 } from '../../../utils/enums'
import TransactionImage from '../TransactionImage'

export default {
  components: {
    TransactionImage,
  },
  props: {
    cancelDialog: {
      type: Boolean,
      default: false,
    },
    transaction: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      ACTIVITY_ACTION_SEND,
      CONTRACT_TYPE_ERC721,
      CONTRACT_TYPE_ERC1155,
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'CancellationFailedModal.scss';
</style>
