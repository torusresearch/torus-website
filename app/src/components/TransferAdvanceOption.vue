<template>
  <v-card class="advance-option">
    <v-card-text class="torus_text--text">
      <v-container>
        <v-form ref="advanceOptionForm" :value="advanceOptionFormValid" @submit.prevent="saveOptions" lazy-validation>
          <v-layout wrap>
            <v-flex xs12 px-4>
              <div class="font-weight-bold headline">Transfer Details</div>
              <div class="font-weight-bold subtitle-2">AdjustGas</div>
            </v-flex>
            <v-flex xs12 mt-4>
              <v-layout wrap>
                <v-flex xs12 sm6 px-4>
                  <span class="subtitle-2">Gas Price (GWEI)</span>
                  <v-text-field outlined v-model="advancedActiveGasPrice" required type="number"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 px-4>
                  <span class="subtitle-2">Gas Value</span>
                  <v-text-field outlined v-model="advancedGas" required type="number"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 px-4>
                  <span class="subtitle-2">Send Amount</span>
                  <v-text-field outlined readonly :value="displayAmount"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 px-4>
                  <span class="subtitle-2">Transaction Fee</span>
                  <v-text-field outlined readonly :value="gasAmount"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 px-4>
                  <span class="subtitle-2">New Total</span>
                  <v-text-field outlined readonly :value="totalCost"></v-text-field>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-layout mt-4 pr-4>
            <v-spacer></v-spacer>
            <v-btn large text @click="onCancel">Cancel</v-btn>
            <v-btn large color="primary" class="ml-4" type="submit" :disabled="!advanceOptionFormValid">Save</v-btn>
          </v-layout>
        </v-form>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import { significantDigits } from '../utils/utils'

export default {
  props: ['activeGasPrice', 'gas', 'displayAmount', 'dialog'],
  data() {
    return {
      advanceOptionFormValid: true,
      advancedActiveGasPrice: 0,
      advancedGas: 0
    }
  },
  computed: {
    selectedCurrency() {
      return this.$store.state.selectedCurrency
    },
    totalCost() {
      return significantDigits(parseFloat(this.displayAmount) + parseFloat(this.gasAmount))
    },
    gasAmount() {
      const ethFee = this.advancedGas * this.advancedActiveGasPrice * 10 ** -9
      return significantDigits(ethFee)
    }
  },
  methods: {
    onCancel(step) {
      this.$emit('onClose')
    },
    saveOptions() {
      const payload = {
        advancedGas: this.advancedGas,
        advancedActiveGasPrice: this.advancedActiveGasPrice
      }

      this.$emit('onSave', payload)
    },
    updateDetails() {
      this.advancedActiveGasPrice = this.activeGasPrice
      this.advancedGas = this.gas
    }
  },
  watch: {
    dialog(val) {
      if (val) {
        this.updateDetails()
      }
    }
  },
  created() {
    this.updateDetails()
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/nav-selector.mixin';

.advance-option {
  .form-selector {
    @include navSelector();
    display: flex;
  }
}
</style>
