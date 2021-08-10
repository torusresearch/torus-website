<template>
  <v-dialog :value="cancelDialog" persistent width="275">
    <v-card class="cancel-transaction-modal">
      <v-card-text class="pa-0">
        <div class="card-header text-center xs12 py-6 px-6">
          <div class="text-body2 text_1--text font-weight-bold">{{ t('walletActivity.cancelModalTitle') }}</div>
          <v-btn class="close-btn" icon aria-label="Close cancel transaction" title="Close cancel transaction" @click="close">
            <v-icon>$vuetify.icons.close</v-icon>
          </v-btn>
        </div>
        <div class="px-4 py-5">
          <div class="d-flex transaction-details pb-12">
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
          <div class="mx-2 mb-6 d-flex align-center">
            <v-checkbox
              id="is-confirmed"
              v-model="isConfirmed"
              class="mt-0 is-confirmed"
              hide-details
              on-icon="$vuetify.icons.checkbox_checked"
              off-icon="$vuetify.icons.checkbox_unchecked"
              color="text_3"
              :ripple="false"
            />
            <label for="is-confirmed" class="text-caption is-confirmed-label">
              {{ t('walletActivity.cancelModalDesc') }} {{ cancellationFeeEstimate }}.
            </label>
          </div>
          <div class="ma-2 text-caption">{{ t('walletActivity.cancelModalNote') }}</div>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-layout class="pb-4">
          <v-flex xs6>
            <v-btn block text color="text_2" @click="close">{{ t('walletActivity.cancelModalClose') }}</v-btn>
          </v-flex>
          <v-divider vertical></v-divider>
          <v-flex xs6>
            <v-btn color="torusBrand1" depressed block class="py-1 white--text" :disabled="!isConfirmed" @click="cancelTransaction">
              {{ t('walletActivity.cancelModalConfirm') }}
            </v-btn>
          </v-flex>
        </v-layout>
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
    cancellationFeeEstimate: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      cancelFormValid: false,
      isConfirmed: false,
      ACTIVITY_ACTION_SEND,
      CONTRACT_TYPE_ERC721,
      CONTRACT_TYPE_ERC1155,
    }
  },
  methods: {
    cancelTransaction() {
      this.$emit('cancelTransaction')
    },
    close() {
      this.$emit('close')
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'CancellationModal.scss';
</style>
