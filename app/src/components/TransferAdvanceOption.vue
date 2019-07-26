<template>
  <v-card class="advance-option">
    <v-container>
      <v-form ref="advanceOptionForm" :value="advanceOptionFormValid" @submit.prevent="saveOptions" lazy-validation>
        <v-layout wrap>
          <v-flex xs12 px-4>
            <div class="font-weight-bold headline">Transfer Details</div>
            <div class="font-weight-bold subtitle-2">Customize Gas</div>
          </v-flex>
          <v-flex xs12 mt-4>
            <v-layout wrap>
              <v-flex xs12 sm6 px-4>
                <span class="subtitle-2">
                  Gas Price (GWEI)
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-icon small v-text="'$vuetify.icons.question'" v-on="on"></v-icon>
                    </template>
                    <span>Gas Price Info</span>
                  </v-tooltip>
                </span>
                <v-text-field placeholder="Enter Value" outlined v-model="advancedActiveGasPrice" required type="number"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 px-4>
                <span class="subtitle-2">
                  Gas Value
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-icon small v-text="'$vuetify.icons.question'" v-on="on"></v-icon>
                    </template>
                    <span>Gas Value Info</span>
                  </v-tooltip>
                </span>
                <v-text-field outlined v-model="advancedGas" required type="number"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 px-4>
                <span class="subtitle-2">Send Amount</span>
                <template v-if="$vuetify.breakpoint.xsOnly">
                  <span class="float-right">{{ displayAmount }} {{ symbol }}</span>
                  <v-divider class="mt-1 mb-2"></v-divider>
                </template>
                <v-text-field
                  v-else
                  :suffix="symbol"
                  outlined
                  readonly
                  :value="displayAmount"
                  persistent-hint
                  :hint="displayAmountConverted"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 px-4>
                <span class="subtitle-2">Transaction Fee</span>
                <template v-if="$vuetify.breakpoint.xsOnly">
                  <span class="float-right">{{ gasAmountDisplay }} {{ symbol }}</span>
                  <v-divider class="mt-1 mb-2"></v-divider>
                </template>
                <v-text-field
                  v-else
                  :suffix="symbol"
                  outlined
                  readonly
                  :value="gasAmountDisplay"
                  persistent-hint
                  :hint="gasAmountConverted"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 px-4 :class="$vuetify.breakpoint.xsOnly ? 'mt-5' : ''">
                <span class="subtitle-2">New Total</span>
                <template v-if="$vuetify.breakpoint.xsOnly">
                  <span class="float-right subtitle-1 font-weight-bold primary--text">{{ totalCost }} {{ symbol }}</span>
                  <v-divider class="mt-1 mb-2"></v-divider>
                </template>
                <v-text-field v-else :suffix="symbol" outlined readonly :value="totalCost" persistent-hint :hint="totalCostConverted"></v-text-field>
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
  </v-card>
</template>

<script>
import { significantDigits } from '../utils/utils'

export default {
  props: ['activeGasPrice', 'gas', 'displayAmount', 'dialog', 'symbol'],
  data() {
    return {
      advanceOptionFormValid: true,
      advancedActiveGasPrice: 0,
      advancedGas: 0
    }
  },
  computed: {
    getCurrencyMultiplier() {
      const { selectedCurrency, currencyData } = this.$store.state || {}
      let currencyMultiplier = 1
      if (selectedCurrency !== 'ETH') currencyMultiplier = currencyData[selectedCurrency.toLowerCase()] || 1
      return currencyMultiplier
    },
    selectedCurrency() {
      return this.$store.state.selectedCurrency
    },
    totalCost() {
      return parseFloat(this.displayAmount) + parseFloat(this.gasAmount)
    },
    gasAmount() {
      return this.advancedGas * this.advancedActiveGasPrice * 10 ** -9
    },
    gasAmountDisplay() {
      return significantDigits(this.gasAmount)
    },
    gasAmountConverted() {
      return this.convertedDisplay(this.gasAmount)
    },
    displayAmountConverted() {
      return this.convertedDisplay(parseFloat(this.displayAmount))
    },
    totalCostConverted() {
      return this.convertedDisplay(this.totalCost)
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
    },
    convertedDisplay(amount) {
      const currencyMultiplier = this.getCurrencyMultiplier
      const converted = significantDigits(amount * currencyMultiplier)

      return `~ ${converted} ${this.selectedCurrency}`
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

  ::v-deep .v-messages {
    text-align: right;
  }
}
</style>
