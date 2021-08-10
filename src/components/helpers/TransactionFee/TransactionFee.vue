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
          @onSave="onSave"
        />
      </v-flex>
    </v-layout>
    <v-layout align-center>
      <v-flex xs12 mb-1>
        <v-text-field
          outlined
          :value="t('walletTransfer.fee-upto').replace(/{amount}/gi, maxTransactionFee)"
          disabled
          :hint="`*${t('walletTransfer.fee-max-transaction-hint')}`"
          persistent-hint
          :suffix="`ETH`"
        >
          <template #message="{ message }">
            <div class="d-flex caption">
              <div class="text-left mr-2">{{ message }}</div>
              <div class="ml-auto" :style="{ minWidth: '100px' }">
                <div>~{{ maxTransactionFee }} {{ selectedCurrency }}</div>
                <div class="font-italic">{{ t('walletTransfer.fee-in').replace(/{time}/gi, `~${feeTime}`) }}</div>
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
import log from 'loglevel'

import { significantDigits } from '../../../utils/utils'
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
      maxTransactionFee: '',
    }
  },
  computed: {
    maxTransactionFeeConverted() {
      const costConverted = this.currencyMultiplier.times(this.maxTransactionFee)
      return `${significantDigits(costConverted)} ${this.selectedCurrency}`
    },
    feeTime() {
      const estTime = this.gasFees.gasFeeEstimates[this.selectedSpeed].maxWaitTimeEstimate / 1000
      return `${estTime} seconds`
    },
  },
  mounted() {
    this.setMaxTransactionFee({
      gas: this.gas,
      maxPriorityFee: new BigNumber(this.gasFees.gasFeeEstimates[this.selectedSpeed].suggestedMaxPriorityFeePerGas),
    })
  },
  methods: {
    onSave(details) {
      log.info('onSave', details)
      this.setMaxTransactionFee(details)
    },
    setMaxTransactionFee({ gas, maxPriorityFee }) {
      const gasPrice = new BigNumber(maxPriorityFee)
      const cost = gas.times(gasPrice).div(new BigNumber(10).pow(new BigNumber(9)))
      this.maxTransactionFee = significantDigits(cost)
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'TransactionFee.scss';
</style>
