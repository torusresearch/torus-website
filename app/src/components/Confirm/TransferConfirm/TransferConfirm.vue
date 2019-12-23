<template>
  <v-card class="advance-option">
    <v-card-text class="text_1--text py-12">
      <v-layout wrap>
        <v-flex xs12 px-4>
          <div class="font-weight-bold headline">{{ pageHeader }}</div>
        </v-flex>
        <v-flex xs12 mt-4>
          <v-layout wrap>
            <v-flex xs12 px-4 pb-4>
              <div class="subtitle-2">Sending to:</div>
              <v-divider class="my-1" />
              <div class="caption text_2--text">{{ toAddress }}</div>
            </v-flex>
            <v-flex xs12 px-4 pb-4>
              <div class="subtitle-2">
                {{ isNonFungibleToken ? 'Asset to send:' : 'Amount to send:' }}
              </div>
              <v-divider class="my-1" />
              <div class="mt-2" v-if="isNonFungibleToken">
                <img class="mr-2 float-left" :src="assetSelected.image" height="24px" />
                {{ assetSelected.name }}
              </div>
              <div v-else>
                <div class="float-right text-right">
                  <div class="body-1 font-weight-bold">{{ displayAmount }}</div>
                  <div class="caption text_2--text">{{ convertedAmount }}</div>
                </div>
              </div>
            </v-flex>
            <v-flex xs12 px-4 pb-4>
              <div class="subtitle-2">Transaction Fee:</div>
              <v-divider class="my-1" />
              <div>
                <div class="float-right text-right">
                  <div class="body-1 font-weight-bold">~ {{ speedSelected }} Mins</div>
                  <div class="caption text_2--text">{{ significantDigits(transactionFee) }} {{ selectedCurrency }}</div>
                </div>
              </div>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
      <v-layout mt-4 pr-4>
        <v-spacer></v-spacer>
        <v-btn large text @click="onCancel">Cancel</v-btn>
        <v-btn id="confirm-transfer-btn" large color="primary" class="ml-4" type="button" @click="onConfirm">Confirm</v-btn>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
import { significantDigits } from '../../../utils/utils'
import { WALLET_HEADERS_CONFIRM } from '../../../utils/enums'

export default {
  props: [
    'toAddress',
    'selectedCurrency',
    'convertedAmount',
    'displayAmount',
    'speedSelected',
    'transactionFee',
    'assetSelected',
    'isNonFungibleToken'
  ],
  data() {
    return {
      pageHeader: WALLET_HEADERS_CONFIRM
    }
  },
  methods: {
    onCancel(step) {
      this.$emit('onClose')
    },
    onConfirm() {
      this.$emit('onConfirm')
      this.$emit('onClose')
    },
    significantDigits: significantDigits
  }
}
</script>
