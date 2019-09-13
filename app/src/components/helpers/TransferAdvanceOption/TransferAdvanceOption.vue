<template>
  <v-dialog v-model="dialog" persistent>
    <template v-slot:activator="{ on }">
      <a id="advance-option-link" class="float-right primary--text advance-option subtitle-2" v-show="displayAmount" v-on="on">Advanced Options</a>
    </template>
    <v-card class="advance-option py-4">
      <v-container>
        <v-form ref="advanceOptionForm" :value="advanceOptionFormValid" @submit.prevent="saveOptions" lazy-validation>
          <v-layout wrap>
            <v-flex xs12 px-4>
              <div class="font-weight-bold headline">{{ pageHeader }}</div>
              <div class="font-weight-bold subtitle-2">Customize Gas</div>
            </v-flex>
            <v-flex xs12 mt-4>
              <v-layout wrap>
                <v-flex xs12 sm6 px-4>
                  <span class="subtitle-2">
                    Gas Price (GWEI)
                    <HelpTooltip title="Gas Price">
                      <template v-slot:description>
                        <div class="body-2 text-justify">
                          <span class="font-weight-medium">Gas</span>
                          is needed to power blockchain transactions.
                          <span class="font-weight-medium">Gas Price</span>
                          is the amount per unit Gas to pay for a transaction. It is measured in ‘Gwei’.
                        </div>
                        <div class="caption mt-1">
                          1 Gwei=10
                          <sup>-9</sup>
                          ETH
                          <small>(very small USD value)</small>
                        </div>
                      </template>
                    </HelpTooltip>
                  </span>
                  <v-text-field
                    id="gas-price"
                    placeholder="Enter Value"
                    outlined
                    v-model="advancedActiveGasPrice"
                    required
                    type="number"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 px-4>
                  <span class="subtitle-2">
                    Gas Limit
                    <HelpTooltip
                      title="Gas Limit"
                      description="This is the maximum amount of gas you're willing to spend on a transaction.
                      A standard ETH transfer requires a gas limit of 21,000 units of gas."
                    ></HelpTooltip>
                  </span>
                  <v-text-field readonly outlined :value="advancedGas" required type="number"></v-text-field>
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
                    <span class="float-right">
                      <span id="transaction-fee-mobile">{{ gasAmountDisplay }}</span>
                      {{ symbol }}
                    </span>
                    <v-divider class="mt-1 mb-2"></v-divider>
                  </template>
                  <v-text-field
                    id="transaction-fee"
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
                  <v-text-field
                    v-else
                    :suffix="symbol"
                    outlined
                    readonly
                    :value="totalCost"
                    persistent-hint
                    :hint="totalCostConverted"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-layout mt-4 pr-4>
            <v-spacer></v-spacer>
            <v-btn large text @click="onCancel">Cancel</v-btn>
            <v-btn id="adv-opt-submit-btn" large depressed color="primary" class="ml-4" type="submit" :disabled="!advanceOptionFormValid">Save</v-btn>
          </v-layout>
        </v-form>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { significantDigits } from '../../../utils/utils'
import HelpTooltip from '../HelpTooltip'
import { WALLET_HEADERS_TRANSFER } from '../../../utils/enums'

export default {
  components: {
    HelpTooltip
  },
  props: ['activeGasPrice', 'gas', 'displayAmount', 'symbol'],
  data() {
    return {
      pageHeader: WALLET_HEADERS_TRANSFER,
      dialog: false,
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
      const maxLength = Math.max(this.gasAmountDisplay.toString().length, this.displayAmount.toString().length)
      return significantDigits(parseFloat(this.displayAmount) + parseFloat(this.gasAmount), false, maxLength - 2)
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
      this.dialog = false
    },
    saveOptions() {
      const payload = {
        advancedGas: this.advancedGas,
        advancedActiveGasPrice: this.advancedActiveGasPrice
      }

      this.$emit('onSave', payload)
      this.dialog = false
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
@import 'TransferAdvanceOption.scss';
</style>
