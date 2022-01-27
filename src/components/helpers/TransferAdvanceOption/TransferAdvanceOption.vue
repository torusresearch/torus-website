<template>
  <v-dialog v-model="dialog" persistent>
    <template #activator="{ on }">
      <a v-show="displayAmount" id="advance-option-link" class="float-right torusBrand1--text" :class="isConfirm ? 'caption' : 'body-2'" v-on="on">
        {{ isConfirm ? 'Edit' : t('walletTransfer.advancedOptions') }}
      </a>
    </template>
    <v-card class="advance-option py-4">
      <v-container>
        <v-form ref="advanceOptionForm" v-model="advanceOptionFormValid" lazy-validation @submit.prevent="saveOptions">
          <v-layout wrap>
            <v-flex xs12 px-4>
              <div class="font-weight-bold headline">{{ t('walletTransfer.transferDetails') }}</div>
              <div class="font-weight-bold text-subtitle-2">{{ t('walletTransfer.customizeGas') }}</div>
            </v-flex>
            <v-flex xs12 mt-4>
              <v-layout wrap>
                <v-flex xs12 sm6 px-4>
                  <div class="text-subtitle-2 mb-2">
                    {{ t('walletTransfer.gasPrice') }} (GWEI)
                    <HelpTooltip :title="t('walletTransfer.gasPrice')">
                      <template #description>
                        <div class="body-2 text_3--text text-justify">
                          <span class="font-weight-medium">{{ t('walletTransfer.gasPriceDesc1') }}</span>
                          {{ t('walletTransfer.gasPriceDesc2') }}
                          <span class="font-weight-medium">{{ t('walletTransfer.gasPriceDesc3') }}</span>
                          {{ t('walletTransfer.gasPriceDesc4') }}
                        </div>
                        <div class="caption mt-1 text_3--text">
                          1 Gwei=10
                          <sup>-9</sup>
                          {{ networkTicker }}
                          <small>({{ t('walletTransfer.gasPriceDesc5') }})</small>
                        </div>
                      </template>
                    </HelpTooltip>
                  </div>
                  <v-text-field
                    id="gas-price"
                    :placeholder="t('walletTransfer.enterValue')"
                    outlined
                    :value="advancedActiveGasPrice"
                    :rules="[rules.valid, rules.moreThanZero]"
                    type="number"
                    @change="onChangeActiveGasPrice"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 px-4>
                  <div class="text-subtitle-2 mb-2">
                    {{ t('walletTransfer.gasLimit') }}
                    <HelpTooltip :title="t('walletTransfer.gasLimit')" :description="t('walletTransfer.gasLimitDesc')"></HelpTooltip>
                  </div>
                  <v-text-field
                    id="advanced-gas"
                    :value="advancedGas"
                    outlined
                    :rules="[rules.valid, rules.moreThanZero]"
                    type="number"
                    @change="onChangeGasLimit"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 px-4>
                  <div class="text-subtitle-2 mb-2">Nonce</div>
                  <v-combobox id="nonce" v-model="newNonce" outlined :items="nonceItems" :rules="[rules.validNonce]">
                    <template #item="props">
                      {{ t(props.item.text) }}
                    </template>
                    <template #selection="{ item }">
                      {{ item.text ? t(item.text) : item }}
                    </template>
                  </v-combobox>
                </v-flex>
                <v-flex xs12 sm6 px-4>
                  <div class="text-subtitle-2 mb-2">{{ t('walletTransfer.transferFee') }}</div>
                  <template v-if="$vuetify.breakpoint.xsOnly">
                    <span class="float-right">
                      <span id="transaction-fee-mobile">{{ gasAmountDisplay }}</span>
                      {{ networkTicker }}
                    </span>
                    <v-divider class="mt-1 mb-2"></v-divider>
                  </template>
                  <v-text-field
                    v-else
                    id="transaction-fee"
                    :suffix="networkTicker"
                    outlined
                    readonly
                    :value="gasAmountDisplay"
                    persistent-hint
                    :hint="gasAmountConverted"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 px-4 :class="$vuetify.breakpoint.xsOnly ? 'mt-5' : ''">
                  <div class="text-subtitle-2 mb-2">{{ t('walletTransfer.newTotal') }}</div>
                  <template v-if="$vuetify.breakpoint.xsOnly">
                    <span class="float-right text-subtitle-1 font-weight-bold torusBrand1--text">{{ totalCost }}{{ networkTicker }}</span>
                    <v-divider class="mt-1 mb-2"></v-divider>
                  </template>
                  <v-text-field
                    v-else
                    :suffix="networkTicker"
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
            <v-btn
              id="adv-opt-submit-btn"
              large
              color="torusBrand1"
              class="white--text ml-4 gmt-advance-option"
              type="submit"
              :disabled="!advanceOptionFormValid"
            >
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

import { CONTRACT_TYPE_ERC20, CONTRACT_TYPE_ETH } from '../../../utils/enums'
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
    isConfirm: {
      type: Boolean,
      default: false,
    },
    selectedCurrency: {
      type: String,
      default: 'USD',
    },
    currencyMultiplier: {
      type: BigNumber,
      default: new BigNumber('0'),
    },
    currencyMultiplierEth: {
      type: BigNumber,
      default: new BigNumber('0'),
    },
    contractType: {
      type: String,
      default: CONTRACT_TYPE_ETH,
    },
    nonce: {
      type: Number,
      default: 0,
    },
    networkTicker: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      dialog: false,
      advanceOptionFormValid: true,
      advancedActiveGasPrice: new BigNumber('0'),
      advancedGas: new BigNumber('0'),
      CONTRACT_TYPE_ERC20,
      rules: {
        moreThanZero: (value) => new BigNumber(value || '0').gt(new BigNumber('0')) || this.t('walletTransfer.invalidAmount'),
        valid: (value) => !!value || this.t('walletTransfer.required'),
        validNonce: (value) => {
          if (value === null) return this.t('walletTransfer.invalidInput')
          const newValue = Number(value.value || value)
          if (Number.isNaN(newValue)) {
            return value.value === 'default' || this.t('walletTransfer.invalidInput')
          }
          return newValue >= 0 || this.t('walletTransfer.invalidInput')
        },
      },
      newNonce: 0,
      nonceItems: [
        {
          text: 'walletTransfer.default',
          value: 'default',
        },
      ],
    }
  },
  computed: {
    totalCost() {
      let totalCost = ''
      if (this.contractType === CONTRACT_TYPE_ETH) {
        totalCost = new BigNumber(this.displayAmount).plus(this.gasAmount).toString()
      } else if (this.contractType === CONTRACT_TYPE_ERC20) {
        totalCost = `${this.displayAmount} ${this.symbol} + ${this.gasAmount.toString()} ${this.networkTicker}`
      } else {
        totalCost = this.gasAmount.toString()
      }
      return totalCost
    },
    gasAmount() {
      const advancedGas = BigNumber.isBigNumber(this.advancedGas) ? this.advancedGas : new BigNumber(this.advancedGas)
      return advancedGas.times(this.advancedActiveGasPrice).times(new BigNumber(10).pow(new BigNumber(-9)))
    },
    gasAmountDisplay() {
      return significantDigits(this.gasAmount)
    },
    gasAmountConverted() {
      const converted = significantDigits(this.convertedDisplay(this.gasAmount, this.currencyMultiplierEth))
      return `~ ${converted} ${this.selectedCurrency}`
    },
    displayAmountConverted() {
      const converted = significantDigits(this.convertedDisplay(this.displayAmount, this.currencyMultiplier))
      return `~ ${converted} ${this.selectedCurrency}`
    },
    totalCostConverted() {
      const gasConverted = this.convertedDisplay(this.gasAmount, this.currencyMultiplierEth)
      const amountConverted = this.convertedDisplay(this.displayAmount, this.currencyMultiplier)
      return `~ ${significantDigits(gasConverted.plus(amountConverted))} ${this.selectedCurrency}`
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
      if (value) this.advancedActiveGasPrice = new BigNumber(value)
    },
    onChangeGasLimit(value) {
      if (value) this.advancedGas = new BigNumber(value)
    },
    onCancel() {
      this.dialog = false
    },
    saveOptions() {
      if (this.$refs.advanceOptionForm.validate()) {
        const nonce = Number(this.newNonce.value || this.newNonce)
        const advancedGas = BigNumber.isBigNumber(this.advancedGas) ? this.advancedGas : new BigNumber(this.advancedGas)
        const payload = {
          advancedGas,
          advancedActiveGasPrice: this.advancedActiveGasPrice,
          nonce: Number.isNaN(nonce) ? 0 : nonce,
        }

        this.$emit('onSave', payload)
        this.dialog = false
        this.$refs.advanceOptionForm.resetValidation()
      }
    },
    updateDetails() {
      this.advancedActiveGasPrice = this.activeGasPrice
      this.advancedGas = this.gas
      this.newNonce = this.nonce >= 0 ? this.nonce : this.nonceItems[0]
    },
    convertedDisplay(amount, multiplier) {
      return !BigNumber.isBigNumber(amount) ? new BigNumber(amount).times(multiplier) : amount.times(multiplier)
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'TransferAdvanceOption.scss';
</style>
