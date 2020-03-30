<template>
  <v-dialog v-model="dialog" persistent>
    <template v-slot:activator="{ on }">
      <a v-show="displayAmount" id="advance-option-link" class="float-right torus_brand1--text body-2" v-on="on">
        {{ t('walletTransfer.advancedOptions') }}
      </a>
    </template>
    <v-card class="advance-option py-4">
      <v-container>
        <v-form ref="advanceOptionForm" :value="advanceOptionFormValid" lazy-validation @submit.prevent="saveOptions">
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
                    <HelpTooltip :title="t('walletTransfer.gasPrice')">
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
                    :value="advancedActiveGasPrice"
                    required
                    type="number"
                    @change="onChangeActiveGasPrice"
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
                    v-else
                    id="transaction-fee"
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
                    <span class="float-right subtitle-1 font-weight-bold torus_brand1--text">{{ totalCost }} {{ symbol }}</span>
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
            <v-btn id="adv-opt-submit-btn" large depressed color="torus_brand1" class="ml-4" type="submit" :disabled="!advanceOptionFormValid">
              {{ t('walletTransfer.save') }}
            </v-btn>
          </v-layout>
        </v-form>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import BigNumber from 'bignumber.js'

import { significantDigits } from '../../../utils/utils'
import HelpTooltip from '../HelpTooltip'

export default {
  components: {
    HelpTooltip,
  },
  props: {
    activeGasPrice: { type: BigNumber, default: new BigNumber('0') },
    gas: { type: BigNumber, default: new BigNumber('0') },
    displayAmount: { type: BigNumber, default: new BigNumber('0') },
    symbol: { type: String, default: '' },
  },
  data() {
    return {
      dialog: false,
      advanceOptionFormValid: true,
      advancedActiveGasPrice: new BigNumber('0'),
      advancedGas: new BigNumber('0'),
    }
  },
  computed: {
    getCurrencyMultiplier() {
      const { selectedCurrency, currencyData } = this.$store.state || {}
      const currencyMultiplierNumber = selectedCurrency !== 'ETH' ? currencyData[selectedCurrency.toLowerCase()] || 1 : 1
      return new BigNumber(currencyMultiplierNumber)
    },
    selectedCurrency() {
      return this.$store.state.selectedCurrency
    },
    totalCost() {
      const maxLength = Math.max(this.gasAmountDisplay.toString().length, this.displayAmount.toString().length)
      return significantDigits(new BigNumber(this.displayAmount).plus(this.gasAmount).toString(), false, maxLength - 2)
    },
    gasAmount() {
      return this.advancedGas.times(this.advancedActiveGasPrice).times(new BigNumber(10).pow(new BigNumber(-9)))
    },
    gasAmountDisplay() {
      return significantDigits(this.gasAmount)
    },
    gasAmountConverted() {
      return this.convertedDisplay(this.gasAmount)
    },
    displayAmountConverted() {
      return this.convertedDisplay(this.displayAmount)
    },
    totalCostConverted() {
      return this.convertedDisplay(this.totalCost)
    },
  },
  watch: {
    dialog(value) {
      if (value) {
        this.updateDetails()
      }
    },
  },
  mounted() {
    this.updateDetails()
  },
  methods: {
    onChangeActiveGasPrice(value) {
      this.advancedActiveGasPrice = new BigNumber(value)
    },
    onCancel() {
      this.dialog = false
    },
    saveOptions() {
      if (this.$refs.advanceOptionForm.validate()) {
        const payload = {
          advancedGas: this.advancedGas,
          advancedActiveGasPrice: this.advancedActiveGasPrice,
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
      const bigNumber = !BigNumber.isBigNumber(amount) ? new BigNumber(amount).times(currencyMultiplier) : amount.times(currencyMultiplier)
      const converted = significantDigits(bigNumber)

      return `~ ${converted} ${this.selectedCurrency}`
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'TransferAdvanceOption.scss';
</style>
