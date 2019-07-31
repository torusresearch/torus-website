<template>
  <v-card class="advance-option">
    <v-card-text class="torus_text--text py-12">
      <v-layout wrap>
        <v-flex xs12 px-4>
          <div class="font-weight-bold headline">Confirm your Transfer</div>
        </v-flex>
        <v-flex xs12 mt-4>
          <v-layout wrap>
            <v-flex xs12 px-4 pb-4>
              <div class="subtitle-2">Sending to:</div>
              <v-divider class="my-1" />
              <div class="caption torus_text--text text--lighten-4">{{ toAddress }}</div>
            </v-flex>
            <v-flex xs12 px-4 pb-4>
              <div class="subtitle-2">Amount to send:</div>
              <v-divider class="my-1" />
              <div>
                <div class="float-left torus_text--text text--lighten-4">{{ selectedCoin }}</div>
                <div class="float-right text-right">
                  <div class="body-1 font-weight-bold">{{ displayAmount }} ETH</div>
                  <div class="caption torus_text--text text--lighten-4">{{ convertedAmount }} {{ selectedCurrency }}</div>
                </div>
              </div>
            </v-flex>
            <v-flex xs12 px-4 pb-4>
              <div class="subtitle-2">Transaction Fee:</div>
              <v-divider class="my-1" />
              <div>
                <div class="float-right text-right">
                  <div class="body-1 font-weight-bold">~ {{ speedSelected }} Mins</div>
                  <div class="caption torus_text--text text--lighten-4">{{ significantDigits(transactionFee) }} {{ selectedCurrency }}</div>
                </div>
              </div>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
      <v-layout mt-4 pr-4>
        <v-spacer></v-spacer>
        <v-btn large text @click="onCancel">Cancel</v-btn>
        <v-btn large color="primary" class="ml-4" type="button" @click="onConfirm">Confirm</v-btn>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
import { significantDigits } from '../utils/utils'

export default {
  props: ['toAddress', 'selectedCoin', 'selectedCurrency', 'convertedAmount', 'displayAmount', 'speedSelected', 'transactionFee'],
  methods: {
    onCancel(step) {
      this.$emit('onClose')
    },
    onConfirm() {
      this.$emit('onConfirm')
      this.$emit('onClose')
    },
    significantDigits:significantDigits
  }
}
</script>
