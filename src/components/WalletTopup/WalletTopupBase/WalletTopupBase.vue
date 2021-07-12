<template>
  <div>
    <v-card class="elevation-1 pa-6">
      <v-form ref="paymentForm" v-model="formValid" lazy-validation @submit.prevent="">
        <v-layout wrap class="wallet-topup">
          <v-flex xs12>
            <p class="body-2 text_1--text">
              <span class="text-capitalize selected-provider">{{ selectedProvider }}</span>
              {{ t('walletTopUp.description') }}
            </p>
          </v-flex>

          <v-flex xs12 sm4>
            <div class="body-2 mb-2">{{ t('walletTopUp.wannaBuy') }}</div>
            <v-select
              id="cryptocurrency"
              v-model="selectedCryptoCurrency"
              class="cryptocurrency-selector"
              outlined
              append-icon="$vuetify.icons.select"
              :items="selectedCryptoCurrencies"
              item-value="key"
              item-text="displayValue"
              aria-label="Cryptocurrency Selector"
              @change="fetchQuote"
            ></v-select>
          </v-flex>
          <v-flex v-if="!$vuetify.breakpoint.xsOnly" xs8></v-flex>

          <v-layout wrap mx-n2>
            <v-flex xs12 sm8 px-2>
              <div class="mb-2 d-flex align-center">
                <span class="body-2">{{ t('walletTopUp.youSend') }}</span>
                <span class="caption ml-auto">
                  {{ t('walletTopUp.min') }} {{ selectedProvider === XANPOOL ? '0.1 ETH' : minOrderValue }}, {{ t('walletTopUp.max') }}
                  {{ maxOrderValue }} USD*
                </span>
              </div>
              <v-text-field
                id="you-send"
                class="unique-hint"
                :placeholder="sendPlaceholder"
                outlined
                :value="fiatValue"
                :rules="amountRules"
                aria-label="Amount to Buy"
                @input="setFiatValue"
              >
                <template #append>
                  <v-btn outlined small color="torusBrand1" @click="setFiatValue(100)">100</v-btn>
                  <v-btn outlined small color="torusBrand1" class="ml-2" @click="setFiatValue(200)">200</v-btn>
                  <!-- <div class="torusBrand1--text font-weight-medium body-2 pt-1 ml-2">{{ selectedCurrency }}*</div> -->
                </template>
              </v-text-field>

              <div class="v-text-field__details mb-6">
                <div class="v-messages">
                  <div class="v-messages__wrapper">
                    <div class="v-messages__message d-flex">
                      <v-flex class="description text_2--text">
                        <span v-if="selectedProviderObj.includeFees">{{ t('walletTopUp.includes') }} &nbsp;&nbsp;</span>
                        <span v-else>{{ t('walletTopUp.doesntInclude') }} &nbsp;&nbsp;</span>
                        <span v-html="selectedProviderObj.line2 || ''"></span>
                        <HelpTooltip
                          :title="t('walletTopUp.serviceFee')"
                          :description="`${t('walletTopUp.serviceFeeDesc1')} ${selectedProvider} ${t('walletTopUp.serviceFeeDesc2')}`"
                        ></HelpTooltip>
                      </v-flex>
                    </div>
                  </div>
                </div>
              </div>
            </v-flex>
            <v-flex xs12 sm4 px-2>
              <div v-if="!$vuetify.breakpoint.xsOnly" class="mb-2 d-flex align-center" :style="{ height: '20px' }">
                <span class="body-2">&nbsp;</span>
              </div>
              <v-select
                id="currency-selector"
                v-model="selectedCurrency"
                class="curency-selector"
                outlined
                :items="supportedCurrencies"
                append-icon="$vuetify.icons.select"
                @change="onCurrencyChange"
              ></v-select>
            </v-flex>
          </v-layout>

          <v-flex xs12 class="text-right">
            <div class="body-2">{{ t('walletTopUp.receive') }}</div>
            <div class="display-1">{{ cryptoCurrencyValue || 0 }} {{ selectedCryptoCurrencyDisplay }}</div>
            <div class="description">
              {{ t('walletTopUp.rate') }} : 1 {{ selectedCryptoCurrencyDisplay }} = {{ displayRateString }} {{ selectedCurrency }}
            </div>

            <div class="description mt-6">{{ t('walletTopUp.theProcess') }} 10 - 15 {{ t('walletTopUp.minSmall') }}.</div>
            <div class="description mt-1">
              {{ selectedProviderObj.receiveHint ? t(selectedProviderObj.receiveHint) : t('walletTopUp.receiveHint') }}
            </div>
          </v-flex>
        </v-layout>
      </v-form>
      <v-layout wrap>
        <v-flex xs12 class="mt-10">
          <div class="text-right">
            <v-tooltip bottom :disabled="formValid">
              <template #activator="{ on }">
                <span v-on="on">
                  <v-btn
                    class="px-8 white--text gmt-topup"
                    :disabled="!formValid || !isQuoteFetched"
                    large
                    depressed
                    color="torusBrand1"
                    type="submit"
                    @click.prevent="sendOrder"
                  >
                    {{ t('walletTopUp.continue') }}
                  </v-btn>
                </span>
              </template>
              <span>{{ t('walletTopUp.resolveErrors') }}</span>
            </v-tooltip>
            <div class="description mt-1">{{ t('walletTopUp.redirectMessage') }}</div>
          </div>
        </v-flex>
      </v-layout>
    </v-card>
    <v-snackbar v-model="snackbar" :color="snackbarColor">
      {{ snackbarText }}
      <v-btn dark text @click="snackbar = false">{{ t('walletTopUp.close') }}</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { BroadcastChannel } from 'broadcast-channel'
import { mapState } from 'vuex'

import { RAMPNETWORK, XANPOOL } from '../../../utils/enums'
import { broadcastChannelOptions, formatCurrencyNumber, paymentProviders, significantDigits } from '../../../utils/utils'
import HelpTooltip from '../../helpers/HelpTooltip'

export default {
  components: {
    HelpTooltip,
  },
  props: {
    selectedProvider: {
      type: String,
      default: '',
    },
    cryptoCurrencyValue: {
      type: [Number, String],
      default: 0,
    },
    currencyRate: {
      type: [Number, String],
      default: 0,
    },
  },
  data() {
    return {
      isQuoteFetched: false,
      formValid: true,
      fiatValue: '',
      selectedCryptoCurrency: '',
      paymentProviders,
      rules: {
        required: (value) => !!value || 'Required',
        validNumber: (value) => !Number.isNaN(Number.parseFloat(value)) || 'Enter a valid number',
        maxValidation: (value) =>
          Number.parseFloat(value) <= this.maxOrderValue || `Max topup amount is ${formatCurrencyNumber(this.maxOrderValue, 0)}`,
        minValidation: (value) => Number.parseFloat(value) >= this.minOrderValue || `Min topup amount is ${this.minOrderValue}`,
      },
      snackbar: false,
      snackbarText: '',
      snackbarColor: 'success',
      selectedCurrency: '',
      XANPOOL,
    }
  },
  computed: {
    amountRules() {
      const rules = [this.rules.required, this.rules.validNumber, this.rules.minValidation]
      if (this.selectedProviderObj.enforceMax) rules.push(this.rules.maxValidation)
      return rules
    },
    supportedCurrencies() {
      return this.selectedProviderObj.validCurrencies
    },
    ...mapState({
      storeSelectedCurrency: 'selectedCurrency',
    }),
    sendPlaceholder() {
      return `0.00 (Min ${formatCurrencyNumber(this.minOrderValue)})`
    },
    selectedProviderObj() {
      return this.paymentProviders[this.selectedProvider]
    },
    maxOrderValue() {
      return this.selectedProviderObj.maxOrderValue
    },
    minOrderValue() {
      return this.selectedProviderObj.minOrderValue
    },
    displayRateString() {
      if (Number.parseFloat(this.currencyRate) !== 0) return significantDigits(1 / this.currencyRate)
      return 0
    },
    selectedCryptoCurrencies() {
      return this.selectedProviderObj.validCryptoCurrencies.map((x) => {
        const splits = x.split('_')
        let displayValue = splits[0]
        if (this.selectedProvider === RAMPNETWORK && splits.length > 1) {
          displayValue = splits[1]
        }
        return {
          key: x,
          displayValue,
        }
      })
    },
    selectedCryptoCurrencyDisplay() {
      const splits = this.selectedCryptoCurrency.split('_')
      if (this.selectedProvider === RAMPNETWORK && splits.length > 1) {
        return splits[1]
      }
      return splits[0]
    },
  },
  watch: {
    cryptoCurrencyValue(newValue, oldValue) {
      if (newValue !== oldValue && Number.parseFloat(newValue) > 0) this.isQuoteFetched = true
    },
  },
  mounted() {
    const { selectedCryptoCurrency, selectedCurrency, fiatValue } = this.$route.query
    const currentCurrency = selectedCurrency || this.storeSelectedCurrency
    if (this.selectedProviderObj) {
      if (this.selectedProviderObj.validCurrencies.includes(currentCurrency)) this.selectedCurrency = currentCurrency
      else {
        ;[this.selectedCurrency] = this.selectedProviderObj.validCurrencies
      }

      if (this.selectedProviderObj.validCryptoCurrencies.includes(selectedCryptoCurrency)) this.selectedCryptoCurrency = selectedCryptoCurrency
      else {
        ;[this.selectedCryptoCurrency] = this.selectedProviderObj.validCryptoCurrencies
      }
    }
    this.setFiatValue(fiatValue || this.minOrderValue)
  },
  methods: {
    significantDigits,
    setFiatValue(newValue) {
      this.fiatValue = newValue
      if (
        (this.selectedProviderObj.enforceMax && newValue <= this.maxOrderValue && newValue >= this.minOrderValue) ||
        (!this.selectedProviderObj.enforceMax && newValue >= this.minOrderValue)
      ) {
        this.fetchQuote()
      }
    },
    fetchQuote() {
      this.$emit('fetchQuote', {
        selectedCurrency: this.selectedCurrency,
        fiatValue: this.fiatValue,
        selectedCryptoCurrency: this.selectedCryptoCurrency,
      })
    },
    sendOrder() {
      if (this.$refs.paymentForm.validate()) {
        const { instanceId } = this.$route.query
        let bc
        if (instanceId) bc = new BroadcastChannel(`redirect_channel_${instanceId}`, broadcastChannelOptions)
        const callback = (p) => {
          p.then(async ({ success }) => {
            if (success) {
              // eslint-disable-next-line
              this.$router.push({ name: 'walletHistory' }).catch((_) => {})
            } else {
              this.snackbar = true
              this.snackbarColor = 'error'
              this.snackbarText = 'Something went wrong'
            }
            if (bc) {
              await bc.postMessage({
                data: { instanceParams: { provider: this.selectedProvider }, queryParams: { transactionStatus: success ? 'success' : 'failed' } },
              })
              bc.close()
            }
          }).catch(async (error) => {
            this.snackbar = true
            this.snackbarColor = 'error'
            this.snackbarText = error
            this.isQuoteFetched = false
            this.$emit('clearQuote', {
              selectedCurrency: this.selectedCurrency,
              fiatValue: this.fiatValue,
              selectedCryptoCurrency: this.selectedCryptoCurrency,
            })
            if (bc) {
              await bc.postMessage({
                data: { instanceParams: { provider: this.selectedProvider }, queryParams: { transactionStatus: 'failed' } },
              })
              bc.close()
            }
          })
        }
        this.$emit('sendOrder', callback)
      }
    },
    onCurrencyChange() {
      this.fetchQuote()
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'WalletTopupBase.scss';
</style>
