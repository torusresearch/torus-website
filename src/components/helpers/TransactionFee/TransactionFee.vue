<template>
  <v-flex xs12 mb-3>
    <v-layout>
      <v-flex class="body-2 mb-2">
        <span v-if="!isConfirm">
          <span>{{ $t('walletTransfer.fee-max-transaction') }}*</span>
          <HelpTooltip :title="$t('walletTransfer.fee-max-transaction')" :description="$t('walletTransfer.fee-max-transaction-desc')"></HelpTooltip>
        </span>
        <TransactionFeeAdvanced
          :gas="gas"
          :nonce="nonce"
          :selected-speed="selectedSpeed"
          :gas-fees="gasFees"
          :selected-currency="selectedCurrency"
          :currency-multiplier="currencyMultiplier"
          :initial-max-fee-per-gas="initialMaxFeePerGas"
          :initial-max-priority-fee-per-gas="initialMaxPriorityFeePerGas"
          @save="onSave"
        />
      </v-flex>
    </v-layout>
    <v-layout :class="isConfirm ? 'align-top' : 'align-center'">
      <v-flex v-if="isConfirm" xs3 class="caption mt-2">
        <span>{{ $t('walletTransfer.fee-max-transaction') }}*</span>
        <HelpTooltip :title="$t('walletTransfer.fee-max-transaction')" :description="$t('walletTransfer.fee-max-transaction-desc')"></HelpTooltip>
      </v-flex>
      <v-flex mb-1 :class="[isConfirm ? 'xs9' : 'xs12']">
        <v-text-field
          outlined
          :value="$t('walletTransfer.fee-upto').replace(/{amount}/gi, maxFeeDisplay)"
          disabled
          :hint="`*${t('walletTransfer.fee-max-transaction-hint')}`"
          persistent-hint
          :suffix="toggleExclusive ? selectedCurrency : `ETH`"
        >
          <template #message="{ message }">
            <div class="d-flex caption">
              <div class="text-left mr-2">{{ message }}</div>
              <div class="ml-auto" :style="{ minWidth: '100px' }">
                <div>~{{ maxTransactionFeeConverted }}</div>
                <div class="font-italic">{{ feeTime }}</div>
              </div>
            </div>
          </template>
        </v-text-field>
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script>
import BigNumber from 'bignumber.js'
import { isEqual } from 'lodash'

import { bnGreaterThan, gasTiming, significantDigits } from '../../../utils/utils'
import HelpTooltip from '../HelpTooltip'
import TransactionFeeAdvanced from '../TransactionFeeAdvanced'

export default {
  name: 'TransactionFee',
  components: {
    HelpTooltip,
    TransactionFeeAdvanced,
  },
  props: {
    isConfirm: { type: Boolean, default: false },
    toggleExclusive: { type: Number, default: 0 },
    nonce: { type: Number, default: 0 },
    selectedSpeed: { type: String, default: '' },
    selectedCurrency: { type: String, default: 'USD' },
    currencyMultiplier: {
      type: BigNumber,
      default: new BigNumber('0'),
    },
    gas: { type: BigNumber, default: new BigNumber('0') },
    gasFees: {
      type: Object,
      default() {
        return {}
      },
    },
    initialMaxFeePerGas: {
      type: BigNumber,
      default() {
        return new BigNumber('0')
      },
    },
    initialMaxPriorityFeePerGas: {
      type: BigNumber,
      default() {
        return new BigNumber('0')
      },
    },
  },
  data() {
    return {
      maxTransactionFeeEth: '',
      feeTime: '',
      // maxPriorityFee: new BigNumber(0),
      // maxTransactionFee: new BigNumber(0),
    }
  },
  computed: {
    maxFeeDisplay() {
      if (!this.toggleExclusive) return significantDigits(this.maxTransactionFeeEth, false, 6)
      const costConverted = this.currencyMultiplier.times(this.maxTransactionFeeEth)
      return significantDigits(costConverted)
    },
    maxTransactionFeeConverted() {
      if (this.toggleExclusive) return `${significantDigits(this.maxTransactionFeeEth, false, 6)} ETH`
      const costConverted = this.currencyMultiplier.times(this.maxTransactionFeeEth)
      return `${significantDigits(costConverted)} ${this.selectedCurrency}`
    },
  },
  watch: {
    gasFees(newValue, oldValue) {
      if (!isEqual(newValue, oldValue)) {
        const gasFeeEstimate = newValue.gasFeeEstimates
        if (this.selectedSpeed && gasFeeEstimate[this.selectedSpeed]) {
          const maxPriorityFee = gasFeeEstimate[this.selectedSpeed].suggestedMaxPriorityFeePerGas
          this.feeTime = gasTiming(maxPriorityFee, newValue, this.t, 'walletTransfer.fee-edit-in')
          this.setMaxTransactionFee(this.gas, maxPriorityFee, gasFeeEstimate.estimatedBaseFee)
        }
      }
    },
  },
  mounted() {
    const gasFeeEstimate = this.gasFees.gasFeeEstimates
    // overide initial provided fee selected speed is available
    if (this.selectedSpeed && gasFeeEstimate?.[this.selectedSpeed]) {
      const maxPriorityFee = new BigNumber(gasFeeEstimate[this.selectedSpeed].suggestedMaxPriorityFeePerGas)
      this.feeTime = gasTiming(maxPriorityFee, this.gasFees, this.t, 'walletTransfer.fee-edit-in')
      this.setMaxTransactionFee(this.gas, maxPriorityFee, gasFeeEstimate.estimatedBaseFee)
    } else {
      const maxFeePerGas = new BigNumber(this.initialMaxFeePerGas)
      this.maxTransactionFeeEth = this.gas.times(maxFeePerGas).div(new BigNumber(10).pow(new BigNumber(9)))
    }
  },
  methods: {
    onSave(details) {
      const maxPriorityFee = bnGreaterThan(details.customMaxPriorityFee, 0) ? details.customMaxPriorityFee : details.maxPriorityFee

      this.setMaxTransactionFee(details.gas, maxPriorityFee, details.baseFee, details.customMaxTransactionFee)
      this.feeTime = gasTiming(maxPriorityFee, this.gasFees, this.t, 'walletTransfer.fee-edit-in')
      this.$emit('save', details)
    },
    setMaxTransactionFee(gas, maxPriorityFee, baseFee, customMaxTxFee = null) {
      if (customMaxTxFee && bnGreaterThan(customMaxTxFee, 0)) {
        this.maxTransactionFeeEth = gas.times(customMaxTxFee).div(new BigNumber(10).pow(new BigNumber(9)))
        return
      }
      const baseFeeBn = new BigNumber(baseFee)
      const maxPriorityFeeBn = new BigNumber(maxPriorityFee)
      const gasPrice = baseFeeBn.plus(maxPriorityFeeBn)
      this.maxTransactionFeeEth = gas.times(gasPrice).div(new BigNumber(10).pow(new BigNumber(9)))
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'TransactionFee.scss';
</style>
