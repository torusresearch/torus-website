<template>
  <v-dialog v-model="dialog" persistent>
    <template v-slot:activator="{ on }">
      <a id="advance-option-link" class="float-right primary--text subtitle-2" v-show="displayAmount" v-on="on">
        {{ t('walletTransfer.advancedOptions') }}
      </a>
    </template>
    <v-card class="advance-option py-4">
      <v-container>
        <v-form ref="advanceOptionForm" :value="advanceOptionFormValid" @submit.prevent="saveOptions" lazy-validation>
          <v-layout wrap>
            <v-flex xs12 px-4>
              <div class="font-weight-bold headline">{{ t('walletTransfer.transferDetails') }}</div>
              <div class="font-weight-bold subtitle-2">{{ t('walletTransfer.customizeGas') }}</div>
            </v-flex>
            <v-flex xs12 mt-4>
              <v-layout wrap>
                <v-flex xs12 sm6 px-4>
                  <span class="subtitle-2">
                    {{ t('walletTransfer.gasPrice') }} (GWEI)
                    <HelpTooltip title="Gas Price">
                      <template v-slot:description>
                        <div class="body-2 text-justify">
                          <span class="font-weight-medium">{{ t('walletTransfer.gasPriceDesc1') }}</span>
                          {{ t('walletTransfer.gasPriceDesc2') }}
                          <span class="font-weight-medium">{{ t('walletTransfer.gasPriceDesc3') }}</span>
                          {{ t('walletTransfer.gasPriceDesc4') }}
                        </div>
                        <div class="caption mt-1">
                          1 Gwei=10
                          <sup>-9</sup>
                          ETH
                          <small>({{ t('walletTransfer.gasPriceDesc5') }})</small>
                        </div>
                      </template>
                    </HelpTooltip>
                  </span>
                  <v-text-field
                    id="gas-price"
                    :placeholder="t('walletTransfer.enterValue')"
                    outlined
                    v-model="advancedActiveGasPrice"
                    required
                    type="number"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 px-4>
                  <span class="subtitle-2">
                    {{ t('walletTransfer.gasLimit') }}
                    <HelpTooltip :title="t('walletTransfer.gasLimit')" :description="t('walletTransfer.gasLimitDesc')"></HelpTooltip>
                  </span>
                  <v-text-field id="advanced-gas" readonly outlined :value="advancedGas" required type="number"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 px-4>
                  <span class="subtitle-2">{{ t('walletTransfer.sendAmount') }}</span>
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
                  <span class="subtitle-2">{{ t('walletTransfer.transferFee') }}</span>
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
                  <span class="subtitle-2">{{ t('walletTransfer.newTotal') }}</span>
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
            <v-btn large text @click="onCancel">{{ t('walletTransfer.cancel') }}</v-btn>
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

export default {
  components: {
    HelpTooltip
  },
  props: ['activeGasPrice', 'gas', 'displayAmount', 'symbol'],
  data() {
    return {
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
      if (this.$refs.advanceOptionForm.validate()) {
        const payload = {
          advancedGas: this.advancedGas,
          advancedActiveGasPrice: this.advancedActiveGasPrice
        }

        this.$emit('onSave', payload)
        this.dialog = false
        this.$refs.advanceOptionForm.resetValidation()
      }
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
