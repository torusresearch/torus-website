<template>
  <v-dialog v-model="dialog" persistent width="375">
    <template #activator="{ on }">
      <a id="advance-option-link" class="float-right torusBrand1--text" v-on="on">{{ t('walletTransfer.fee-edit') }}</a>
    </template>
    <v-card class="advance-option">
      <v-card-text class="pa-0">
        <div class="card-header text-center py-10 px-5">
          <div class="display-1 text_1--text font-weight-bold">{{ t('walletTransfer.fee-max-transaction') }}</div>
          <v-btn class="close-btn" icon aria-label="Close Edit Transfer" title="Close Edit Transfer" @click="dialog = false">
            <v-icon>$vuetify.icons.close</v-icon>
          </v-btn>
        </div>
        <div class="px-6 py-4">
          <div class="text-center">
            <div class="title text_1--text mb-1">{{ t('walletTransfer.fee-edit-subtitle1') }}</div>
            <div class="body-2 text_2--text">{{ t('walletTransfer.fee-edit-subtitle2') }}</div>
          </div>
          <v-divider class="my-4" />
          <div>
            <v-list class="speed-list">
              <v-list-item
                v-for="speed in speedList"
                :key="speed.value"
                :class="{ 'is-selected': speed.isSelected }"
                @click="selectSpeed(speed.value)"
              >
                <v-list-item-icon class="align-self-center mr-3">
                  <v-icon :class="speed.isSelected ? 'torusBrand1--text' : $vuetify.theme.isDark ? 'torusLight--text' : 'torusBlack--text'">
                    $vuetify.icons.{{ speed.isSelected ? 'radioOn' : 'radioOff' }}
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-content class="py-2">
                  <div class="d-flex align-center">
                    <div class="body-2 font-weight-bold text_1--text speed-list_label">{{ speed.label }}</div>
                    <div class="ml-4">
                      <div class="body-2 font-weight-bold text_1--text">{{ t('walletTransfer.fee-upto').replace(/{amount}/gi, speed.amount) }}</div>
                      <div class="body-2 text_2--text">{{ speed.time }}</div>
                    </div>
                  </div>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </div>
          <v-divider class="mt-4 mb-2" />
          <div class="text-center mb-6">
            <div class="body-2 text_2--text mb-3">{{ t('walletTransfer.fee-edit-or') }}</div>
            <div>
              <a class="body-2 torusBrand1--text text-decoration-none" @click="showAdvance = !showAdvance">
                {{ showAdvance ? t('walletTransfer.fee-edit-adv-hide') : t('walletTransfer.fee-edit-adv-show') }}
              </a>
            </div>
          </div>
          <div v-if="showAdvance">
            <div>
              <div class="text-subtitle-2 mb-2">
                {{ t('walletTransfer.fee-edit-gas-limit') }}
                <HelpTooltip :title="t('walletTransfer.fee-edit-gas-limit')" :description="t('walletTransfer.fee-edit-gas-limit-desc')" />
              </div>
              <v-text-field outlined :value="newGas" type="number" :rules="[rules.valid, rules.validMinimumGas]" @change="setGasLimit" />
            </div>
            <div>
              <div class="text-subtitle-2 mb-2">
                Nonce
                <HelpTooltip title="Nonce" :description="t('walletTransfer.fee-edit-nonce-desc')" />
              </div>
              <v-combobox id="nonce" v-model="newNonce" outlined :items="nonceItems" :rules="[rules.validNonce]">
                <template #item="props">
                  {{ t(props.item.text) }}
                </template>
                <template #selection="{ item }">
                  {{ item.text ? t(item.text) : item }}
                </template>
              </v-combobox>
            </div>
            <div>
              <div class="text-subtitle-2 mb-2">
                {{ t('walletTransfer.fee-edit-base-fee') }}
                <HelpTooltip :title="t('walletTransfer.fee-edit-base-fee')" :description="t('walletTransfer.fee-edit-base-fee-desc')" />
              </div>
              <v-text-field :value="baseFee" outlined type="number" :hint="` `" persistent-hint suffix="GWEI" disabled>
                <template #message="{ message }">
                  <div class="d-flex caption">
                    <div class="text-left mr-2">{{ message }}</div>
                    <div class="ml-auto text-right" :style="{ minWidth: '100px' }">
                      <div class="text_2--text">{{ baseFeeConverted }}</div>
                    </div>
                  </div>
                </template>
              </v-text-field>
            </div>
            <div>
              <div class="text-subtitle-2 mb-2">
                {{ t('walletTransfer.fee-edit-max') }}
                <HelpTooltip :title="t('walletTransfer.fee-edit-max')" :description="t('walletTransfer.fee-edit-max-desc')" />
              </div>
              <v-text-field
                :value="maxPriorityFee"
                outlined
                type="number"
                :rules="[validateMaxPriorityFee]"
                :hint="maxPriorityFeeHint"
                persistent-hint
                class="max-priority-fee"
                suffix="GWEI"
                @change="setMaxPriorityFee"
              >
                <template #message="{ message }">
                  <div class="d-flex caption">
                    <div class="text-left mr-2">{{ message }}</div>
                    <div class="ml-auto text-right" :style="{ minWidth: '100px' }">
                      <div class="text_2--text">{{ maxPriorityFeeConverted }}</div>
                    </div>
                  </div>
                </template>
              </v-text-field>
            </div>
            <div>
              <div class="text-subtitle-2 mb-2">
                <span class="text_1--text font-weight-bold">{{ t('walletTransfer.fee-max-transaction') }}</span>
                <HelpTooltip :title="t('walletTransfer.fee-max-transaction')" :description="t('walletTransfer.fee-max-transaction-desc')" />
              </div>
              <v-text-field
                :value="maxTransactionFee"
                outlined
                type="number"
                :hint="maxTransactionFeeHint"
                :rules="[validateMaxTransactionFee]"
                class="max-transaction-fee"
                suffix="GWEI"
                persistent-hint
                @change="setMaxTransactionFee"
              >
                <template #message="{ message }">
                  <div class="d-flex caption">
                    <div class="text-left mr-2">{{ message }}</div>
                    <div class="ml-auto text-right" :style="{ minWidth: '100px' }">
                      <div class="text_2--text">{{ maxTransactionFeeConverted }}</div>
                    </div>
                  </div>
                </template>
              </v-text-field>
            </div>
          </div>
        </div>
      </v-card-text>
      <v-card-actions class="pb-7 px-5">
        <v-layout>
          <v-flex xs-6>
            <v-btn large block text color="text_2" @click="dialog = false">{{ t('walletTransfer.cancel') }}</v-btn>
          </v-flex>
          <v-flex xs-6>
            <v-btn large color="torusBrand1" depressed block class="py-1 white--text" @click="save">{{ t('walletTransfer.save') }}</v-btn>
          </v-flex>
        </v-layout>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import BigNumber from 'bignumber.js'
import log from 'loglevel'

import { TRANSACTION_SPEED } from '../../../utils/enums'
import { GAS_FORM_ERRORS, getGasFormErrorText } from '../../../utils/gas/utils'
import { bnGreaterThan, bnLessThan, bnLessThanEqualTo, gasTiming, significantDigits } from '../../../utils/utils'
import HelpTooltip from '../HelpTooltip'

const HIGH_FEE_WARNING_MULTIPLIER = 1.5

export default {
  components: {
    HelpTooltip,
  },
  props: {
    nonce: {
      type: Number,
      default: 0,
    },
    selectedSpeed: {
      type: String,
      default: '',
    },
    gas: { type: BigNumber, default: new BigNumber('0') },
    gasFees: {
      type: Object,
      default() {
        return {}
      },
    },
    selectedCurrency: { type: String, default: 'USD' },
    currencyMultiplier: {
      type: BigNumber,
      default: new BigNumber('0'),
    },
  },
  data() {
    return {
      dialog: false,
      showAdvance: false,
      maxPriorityFee: new BigNumber('0'),
      baseFee: '',
      newSelectedSpeed: '',
      newGas: new BigNumber('0'),
      maxTransactionFee: new BigNumber('0'),
      newNonce: 0,
      nonceItems: [
        {
          text: 'walletTransfer.default',
          value: 'default',
        },
      ],
      rules: {
        validMinimumGas: (value) => new BigNumber(value || '0').gte(new BigNumber('21000')) || this.t('walletTransfer.invalidAmount'),
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
    }
  },
  computed: {
    speedList() {
      return [
        {
          value: TRANSACTION_SPEED.HIGH,
          label: this.t('walletTransfer.fee-edit-speed-high'),
          amount: this.getFeeAmount(TRANSACTION_SPEED.HIGH),
          time: this.getFeeTime(TRANSACTION_SPEED.HIGH),
          isSelected: this.newSelectedSpeed === TRANSACTION_SPEED.HIGH,
        },
        {
          value: TRANSACTION_SPEED.MEDIUM,
          label: this.t('walletTransfer.fee-edit-speed-average'),
          amount: this.getFeeAmount(TRANSACTION_SPEED.MEDIUM),
          time: this.getFeeTime(TRANSACTION_SPEED.MEDIUM),
          isSelected: this.newSelectedSpeed === TRANSACTION_SPEED.MEDIUM,
        },
        {
          value: TRANSACTION_SPEED.LOW,
          label: this.t('walletTransfer.fee-edit-speed-low'),
          amount: this.getFeeAmount(TRANSACTION_SPEED.LOW),
          time: this.getFeeTime(TRANSACTION_SPEED.LOW),
          isSelected: this.newSelectedSpeed === TRANSACTION_SPEED.LOW,
        },
      ]
    },
    maxPriorityFeeHint() {
      if (!this.gasFees.gasFeeEstimates) return ' '
      return this.getCustomGasFeeWarnings()
    },
    maxTransactionFeeHint() {
      if (!this.gasFees.gasFeeEstimates) return ' '
      return this.getCustomGasFeeWarnings()
    },
    maxPriorityFeeConverted() {
      return this.convertEth(this.maxPriorityFee)
    },
    baseFeeConverted() {
      return this.convertEth(new BigNumber(this.baseFee))
    },
    maxTransactionFeeConverted() {
      return this.convertEth(this.maxTransactionFee)
    },
  },
  watch: {
    dialog(value) {
      if (value) {
        this.updateDetails(this.selectedSpeed)
      }
    },
  },
  mounted() {
    this.updateDetails(this.selectedSpeed)
  },
  methods: {
    updateDetails(speed) {
      log.info('this.gasFees', this.gasFees)
      this.newSelectedSpeed = speed
      this.newGas = this.gas
      this.newNonce = this.nonce >= 0 ? this.nonce : this.nonceItems[0]
      if (!(this.gasFees.gasFeeEstimates && this.gasFees.gasFeeEstimates[speed])) return
      this.baseFee = this.gasFees.gasFeeEstimates.estimatedBaseFee
      this.maxPriorityFee = new BigNumber(this.gasFees.gasFeeEstimates[speed].suggestedMaxPriorityFeePerGas)
      this.maxTransactionFee = new BigNumber(this.gasFees.gasFeeEstimates[speed].suggestedMaxFeePerGas)
    },
    getFeeAmount(speed) {
      const gasFeeEstimate = this.gasFees.gasFeeEstimates
      if (!(gasFeeEstimate && gasFeeEstimate[speed])) return ''
      const maxPriorityFee = gasFeeEstimate[speed].suggestedMaxPriorityFeePerGas
      const baseFeeBn = new BigNumber(gasFeeEstimate.estimatedBaseFee)
      const maxPriorityFeeBn = new BigNumber(maxPriorityFee)
      const gasPrice = baseFeeBn.plus(maxPriorityFeeBn)
      const cost = this.gas.times(gasPrice).div(new BigNumber(10).pow(new BigNumber(9)))
      const costConverted = this.currencyMultiplier.times(cost)
      return `${significantDigits(costConverted)} ${this.selectedCurrency}`
    },
    getFeeTime(speed) {
      if (!(this.gasFees.gasFeeEstimates && this.gasFees.gasFeeEstimates[speed])) return ''

      return gasTiming(this.gasFees.gasFeeEstimates[speed].suggestedMaxPriorityFeePerGas, this.gasFees, this.t, 'walletTransfer.fee-edit-process-in')
    },
    selectSpeed(speed) {
      this.updateDetails(speed)
    },
    setGasLimit(limit) {
      log.info('setGasLimit', limit)
      this.newGas = new BigNumber(limit)
      this.newSelectedSpeed = ''
    },
    setMaxPriorityFee(fee) {
      this.maxPriorityFee = new BigNumber(fee)
      // this.maxTransactionFee = new BigNumber(this.baseFee).plus(this.maxPriorityFee)
      this.newSelectedSpeed = ''
    },
    setMaxTransactionFee(fee) {
      this.maxTransactionFee = new BigNumber(fee)
      // this.maxPriorityFee = new BigNumber(this.maxTransactionFee).minus(this.baseFee)
      this.newSelectedSpeed = ''
    },
    validateMaxPriorityFee(value) {
      const { gasFeeEstimates } = this.gasFees
      if (bnLessThanEqualTo(value, 0)) {
        return getGasFormErrorText(GAS_FORM_ERRORS.MAX_PRIORITY_FEE_BELOW_MINIMUM)
      }
      if (bnLessThan(value, gasFeeEstimates?.low?.suggestedMaxPriorityFeePerGas)) {
        return getGasFormErrorText(GAS_FORM_ERRORS.MAX_PRIORITY_FEE_TOO_LOW)
      }
      if (bnGreaterThan(value, this.maxTransactionFee)) {
        return getGasFormErrorText(GAS_FORM_ERRORS.MAX_FEE_IMBALANCE)
      }

      return true
    },
    validateMaxTransactionFee(value) {
      const { gasFeeEstimates } = this.gasFees

      if (bnGreaterThan(this.maxPriorityFee, value)) {
        return getGasFormErrorText(GAS_FORM_ERRORS.MAX_FEE_IMBALANCE)
      }
      if (bnLessThan(value, gasFeeEstimates?.low?.suggestedMaxFeePerGas)) {
        return getGasFormErrorText(GAS_FORM_ERRORS.MAX_FEE_TOO_LOW)
      }

      return true
    },
    getCustomGasFeeWarnings() {
      const { gasFeeEstimates } = this.gasFees
      if (
        gasFeeEstimates?.high &&
        bnGreaterThan(this.maxPriorityFee, gasFeeEstimates.high.suggestedMaxPriorityFeePerGas * HIGH_FEE_WARNING_MULTIPLIER)
      ) {
        return getGasFormErrorText(GAS_FORM_ERRORS.MAX_PRIORITY_FEE_HIGH_WARNING)
      }

      if (gasFeeEstimates?.high && bnGreaterThan(this.maxTransactionFee, gasFeeEstimates.high.suggestedMaxFeePerGas * HIGH_FEE_WARNING_MULTIPLIER)) {
        return getGasFormErrorText(GAS_FORM_ERRORS.MAX_FEE_HIGH_WARNING)
      }
      return ''
    },
    save() {
      const { newSelectedSpeed: selectedSpeed, newGas: gas, newNonce, maxPriorityFee, maxTransactionFee, baseFee } = this

      const nonce = Number(newNonce.value || newNonce)
      this.$emit('save', {
        selectedSpeed,
        gas,
        nonce: Number.isNaN(nonce) ? 0 : nonce,
        maxPriorityFee,
        maxTransactionFee,
        baseFee,
      })
      this.dialog = false
    },
    convertEth(amountInGwei) {
      const amountInEth = this.gas.times(amountInGwei.div(new BigNumber(10).pow(new BigNumber(9))))
      const converted = significantDigits(amountInEth.times(this.currencyMultiplier))
      return `~ ${converted} ${this.selectedCurrency}`
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'TransactionFeeAdvanced.scss';
</style>
