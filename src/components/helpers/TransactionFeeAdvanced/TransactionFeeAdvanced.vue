<template>
  <v-dialog ref="advanceOption" v-model="dialog" persistent width="375" eager>
    <template #activator="{ on }">
      <a id="advance-option-link" class="float-right torusBrand1--text" text height="24" v-on="on">
        {{ t('walletTransfer.fee-edit') }}
      </a>
    </template>
    <v-card class="advance-option">
      <v-form ref="advanceOptionForm" v-model="advanceOptionFormValid" lazy-validation @submit.prevent="save">
        <v-card-text class="pa-0">
          <div class="card-header text-center py-10 px-5">
            <div class="display-1 text_1--text font-weight-bold">{{ t('walletTransfer.fee-max-transaction') }}</div>
            <v-btn class="close-btn" icon aria-label="Close Edit Transfer" title="Close Edit Transfer" @click="cancel">
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
              <!-- <div>
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
              </div> -->
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
        <v-card-actions ref="actions" class="pb-7 px-5">
          <v-layout>
            <v-flex xs-6>
              <v-btn large block text color="text_2" @click="cancel">
                {{ t('walletTransfer.cancel') }}
              </v-btn>
            </v-flex>
            <v-flex xs-6>
              <v-btn :disabled="!advanceOptionFormValid" large color="torusBrand1" depressed block class="py-1 white--text" type="submit">
                {{ t('walletTransfer.save') }}
              </v-btn>
            </v-flex>
          </v-layout>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import BigNumber from 'bignumber.js'
import { isEqual } from 'lodash'
import log from 'loglevel'

import { TRANSACTION_SPEED } from '../../../utils/enums'
import { GAS_FORM_ERRORS, getGasFormErrorText } from '../../../utils/gas/utils'
import { bnEqualTo, bnGreaterThan, bnLessThan, bnLessThanEqualTo, gasTiming, significantDigits } from '../../../utils/utils'
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
    gas: {
      type: BigNumber,
      default() {
        return new BigNumber('0')
      },
    },
    gasFees: {
      type: Object,
      default() {
        return {}
      },
    },
    selectedCurrency: { type: String, default: 'USD' },
    currencyMultiplier: {
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
    initialMaxFeePerGas: {
      type: BigNumber,
      default() {
        return new BigNumber('0')
      },
    },
  },
  data() {
    return {
      dialog: false,
      showAdvance: false,
      advanceOptionFormValid: true,
      maxPriorityFee: new BigNumber('0'),
      customMaxPriorityFee: new BigNumber('0'),
      baseFee: '',
      newSelectedSpeed: '',
      oldSelectedSpeed: '', // last selected speed before user adds custom fee values
      newGas: new BigNumber('0'),
      maxTransactionFee: new BigNumber('0'),
      customMaxTransactionFee: new BigNumber('0'),
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
      const { gasFeeEstimates } = this.gasFees
      if (
        gasFeeEstimates?.high &&
        bnGreaterThan(this.maxPriorityFee, gasFeeEstimates.high.suggestedMaxPriorityFeePerGas * HIGH_FEE_WARNING_MULTIPLIER)
      ) {
        return getGasFormErrorText(GAS_FORM_ERRORS.MAX_PRIORITY_FEE_HIGH_WARNING, this.t)
      }
      return ' '
    },
    maxTransactionFeeHint() {
      const { gasFeeEstimates } = this.gasFees
      if (gasFeeEstimates?.high && bnGreaterThan(this.maxTransactionFee, gasFeeEstimates.high.suggestedMaxFeePerGas * HIGH_FEE_WARNING_MULTIPLIER)) {
        return getGasFormErrorText(GAS_FORM_ERRORS.MAX_FEE_HIGH_WARNING, this.t)
      }
      return ' '
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
    gasFees(newValue, oldValue) {
      if (!isEqual(newValue, oldValue)) {
        this.updateDetails(this.newSelectedSpeed !== '' ? this.newSelectedSpeed : this.oldSelectedSpeed)
      }
    },
    showAdvance(value) {
      if (value) {
        this.$vuetify.goTo(this.$refs.actions, { container: '.v-dialog' })
      }
    },
  },
  mounted() {
    this.updateDetails(this.selectedSpeed)
  },
  methods: {
    updateDetails(speed) {
      this.newGas = this.gas
      this.newNonce = this.nonce >= 0 ? this.nonce : this.nonceItems[0]
      this.baseFee = this.gasFees.gasFeeEstimates?.estimatedBaseFee
      this.newSelectedSpeed = speed
      if (speed) {
        if (!(this.gasFees.gasFeeEstimates && this.gasFees.gasFeeEstimates[speed])) return
        // don't update to new values if custom fee values are added by user
        this.maxPriorityFee = bnGreaterThan(this.customMaxPriorityFee, 0)
          ? this.customMaxPriorityFee
          : new BigNumber(this.gasFees.gasFeeEstimates[speed].suggestedMaxPriorityFeePerGas)
        this.maxTransactionFee = bnGreaterThan(this.customMaxTransactionFee, 0)
          ? this.customMaxTransactionFee
          : new BigNumber(this.maxPriorityFee).plus(this.baseFee)
      } else {
        this.refreshCustomFeeParams()
      }
    },
    /**
     * This function is used update custom fee options as default fee params
     * props which are sent by dapp initially. These options will be not be
     * used once user will select speed or set custom fee values from advance options inputs.
     *
     */
    refreshCustomFeeParams() {
      /**
       *
       * Speed will be not available in two scenarios:-
       *
       * 1. Dapp has sent gas fee options in tx params.
       * In this case initialMaxPriorityFeePerGas and initialMaxFeePerGas will be sent as props.
       *
       * 2. User has modified fee input values from advance options. In this case
       * initialMaxPriorityFeePerGas and initialMaxFeePerGas should not be used if
       * values of customMaxPriorityFee and customMaxTransactionFee are diff from them.
       *
       */
      if (!this.newSelectedSpeed) {
        this.showAdvance = true
        this.customMaxPriorityFee = this.getActivePriorityFeePerGas()
        this.customMaxTransactionFee = this.getActiveMaxFeePerGas()
        this.maxPriorityFee = this.customMaxPriorityFee
        this.maxTransactionFee = this.customMaxTransactionFee
      }
    },
    getActivePriorityFeePerGas() {
      if (bnGreaterThan(this.initialMaxPriorityFeePerGas, 0)) {
        if (bnGreaterThan(this.customMaxPriorityFee, 0) && !bnEqualTo(this.initialMaxPriorityFeePerGas, this.customMaxPriorityFee)) {
          return this.customMaxPriorityFee
        }
        return this.initialMaxPriorityFeePerGas
      }
      if (bnGreaterThan(this.customMaxPriorityFee, 0)) {
        return this.customMaxPriorityFee
      }
      return this.maxPriorityFee()
    },
    getActiveMaxFeePerGas() {
      if (bnGreaterThan(this.initialMaxFeePerGas, 0)) {
        if (bnGreaterThan(this.customMaxTransactionFee, 0) && !bnEqualTo(this.initialMaxFeePerGas, this.customMaxTransactionFee)) {
          return this.customMaxTransactionFee
        }
        return this.initialMaxFeePerGas
      }
      if (bnGreaterThan(this.customMaxTransactionFee, 0)) {
        return this.customMaxTransactionFee
      }
      return this.maxTransactionFee()
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
      // reset custom values if user is changing tx speed
      this.customMaxPriorityFee = new BigNumber(0)
      this.customMaxTransactionFee = new BigNumber(0)
      this.updateDetails(speed)
    },
    setGasLimit(limit) {
      log.info('setGasLimit', limit)
      if (limit) {
        this.newGas = new BigNumber(limit)
        this.oldSelectedSpeed = this.newSelectedSpeed
        this.newSelectedSpeed = ''
      }
    },
    setMaxPriorityFee(fee) {
      log.info('fee', fee)
      if (fee) {
        this.maxPriorityFee = new BigNumber(fee)
        this.customMaxPriorityFee = this.maxPriorityFee
        const minFeeRequired = this.maxPriorityFee.plus(new BigNumber(this.baseFee))
        if (bnLessThan(this.maxTransactionFee, minFeeRequired)) {
          this.maxTransactionFee = minFeeRequired
          this.customMaxTransactionFee = minFeeRequired
        }
        this.oldSelectedSpeed = this.newSelectedSpeed
        this.newSelectedSpeed = ''
      }
    },
    setMaxTransactionFee(fee) {
      if (fee) {
        this.maxTransactionFee = new BigNumber(fee)
        this.customMaxTransactionFee = this.maxTransactionFee
        this.customMaxPriorityFee = bnGreaterThan(this.customMaxPriorityFee, 0) ? this.customMaxPriorityFee : this.maxPriorityFee
        this.oldSelectedSpeed = this.newSelectedSpeed
        this.newSelectedSpeed = ''
      }
    },
    validateMaxPriorityFee(value) {
      const { gasFeeEstimates } = this.gasFees
      if (!value || !value.toString()) {
        return getGasFormErrorText(GAS_FORM_ERRORS.MAX_PRIORITY_FEE_BELOW_MINIMUM, this.t)
      }
      if (bnLessThanEqualTo(value, 0)) {
        return getGasFormErrorText(GAS_FORM_ERRORS.MAX_PRIORITY_FEE_BELOW_MINIMUM, this.t)
      }
      if (bnLessThan(value, gasFeeEstimates?.low?.suggestedMaxPriorityFeePerGas)) {
        return getGasFormErrorText(GAS_FORM_ERRORS.MAX_PRIORITY_FEE_TOO_LOW, this.t)
      }
      if (bnGreaterThan(value, this.maxTransactionFee)) {
        return getGasFormErrorText(GAS_FORM_ERRORS.MAX_FEE_IMBALANCE, this.t)
      }

      return true
    },
    validateMaxTransactionFee(value) {
      if (bnGreaterThan(this.maxPriorityFee, value)) {
        return getGasFormErrorText(GAS_FORM_ERRORS.MAX_FEE_IMBALANCE, this.t)
      }
      if (bnLessThan(value, new BigNumber(this.maxPriorityFee).plus(new BigNumber(this.baseFee)))) {
        return getGasFormErrorText(GAS_FORM_ERRORS.MAX_FEE_TOO_LOW, this.t)
      }

      return true
    },
    save() {
      const {
        newSelectedSpeed: selectedSpeed,
        newGas: gas,
        newNonce,
        maxPriorityFee,
        maxTransactionFee,
        baseFee,
        customMaxPriorityFee,
        customMaxTransactionFee,
      } = this

      const nonce = Number(newNonce.value || newNonce)
      this.$emit('save', {
        selectedSpeed,
        gas,
        nonce: Number.isNaN(nonce) ? 0 : nonce,
        maxPriorityFee,
        maxTransactionFee,
        customMaxPriorityFee,
        customMaxTransactionFee,
        baseFee,
      })
      this.cancel()
    },
    cancel() {
      this.showAdvance = false
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
