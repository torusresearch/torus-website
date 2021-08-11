<template>
  <v-flex xs12 mb-3>
    <v-layout>
      <v-flex class="body-2 mb-2">
        <span>{{ t('walletTransfer.fee-max-transaction') }}*</span>
        <HelpTooltip :title="t('walletTransfer.fee-max-transaction')" :description="t('walletTransfer.fee-max-transaction-desc')"></HelpTooltip>
        <TransactionFeeAdvanced
          :gas="gas"
          :nonce="nonce"
          :selected-speed="selectedSpeed"
          :gas-fees="gasFees"
          :selected-currency="selectedCurrency"
          :currency-multiplier="currencyMultiplier"
          @save="onSave"
        />
      </v-flex>
    </v-layout>
    <v-layout align-center>
      <v-flex xs12 mb-1>
        <v-text-field
          outlined
          :value="t('walletTransfer.fee-upto').replace(/{amount}/gi, maxTransactionFeeEth)"
          disabled
          :hint="`*${t('walletTransfer.fee-max-transaction-hint')}`"
          persistent-hint
          :suffix="`ETH`"
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

import { gasTiming, significantDigits } from '../../../utils/utils'
import HelpTooltip from '../HelpTooltip'
import TransactionFeeAdvanced from '../TransactionFeeAdvanced'

export default {
  components: {
    HelpTooltip,
    TransactionFeeAdvanced,
  },
  props: {
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
  },
  data() {
    return {
      maxTransactionFeeEth: '',
      feeTime: '',
    }
  },
  computed: {
    maxTransactionFeeConverted() {
      const costConverted = this.currencyMultiplier.times(this.maxTransactionFeeEth)
      return `${significantDigits(costConverted)} ${this.selectedCurrency}`
    },
  },
  mounted() {
    const gasFeeEstimate = this.gasFees.gasFeeEstimates
    const maxPriorityFee = gasFeeEstimate[this.selectedSpeed].suggestedMaxPriorityFeePerGas
    this.feeTime = gasTiming(maxPriorityFee, this.gasFees, this.t, 'walletTransfer.fee-edit-in')
    this.setMaxTransactionFee(this.gas, maxPriorityFee, gasFeeEstimate.estimatedBaseFee)
  },
  methods: {
    onSave(details) {
      this.setMaxTransactionFee(details.gas, details.maxTransactionFee)
      this.feeTime = gasTiming(details.maxPriorityFee, this.gasFees, this.t, 'walletTransfer.fee-edit-in')
      this.$emit('save', details)
    },
    setMaxTransactionFee(gas, maxPriorityFee, baseFee) {
      const baseFeeBn = new BigNumber(baseFee)
      const maxPriorityFeeBn = new BigNumber(maxPriorityFee)
      const gasPrice = baseFeeBn.plus(maxPriorityFeeBn)
      const cost = gas.times(gasPrice).div(new BigNumber(10).pow(new BigNumber(9)))
      this.maxTransactionFeeEth = significantDigits(cost)
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'TransactionFee.scss';
</style>
