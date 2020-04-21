<template>
  <div>
    <v-card class="elevation-1 pa-6">
      <v-form ref="paymentForm" v-model="formValid" lazy-validation @submit.prevent>
        <v-layout wrap class="wallet-topup">
          <v-flex xs12>
            <p class="body-2 text_1--text">
              <span class="text-capitalize selected-provider">{{ selectedProvider }}</span>
              {{ t('walletTopUp.description') }}
            </p>
          </v-flex>

          <v-flex xs12 sm4>
            <div class="body-2">{{ t('walletTopUp.wannaBuy') }}</div>
            <v-select
              id="cryptocurrency"
              v-model="selectedCryptoCurrency"
              class="cryptocurrency-selector"
              outlined
              append-icon="$vuetify.icons.select"
              :items="selectedProviderObj.validCryptoCurrencies"
              aria-label="Cryptocurrency Selector"
              @change="fetchQuote"
            ></v-select>
          </v-flex>
          <v-flex v-if="!$vuetify.breakpoint.xsOnly" xs8></v-flex>

          <v-layout wrap mx-n2>
            <v-flex xs12 sm8 px-2>
              <div>
                <span class="body-2">{{ t('walletTopUp.youSend') }}</span>
                <span class="caption float-right">
                  {{ t('walletTopUp.min') }} {{ minOrderValue }}, {{ t('walletTopUp.max') }} {{ maxOrderValue }} USD*
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
                <template v-slot:append>
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
            <div class="display-1">{{ cryptoCurrencyValue || 0 }} {{ selectedCryptoCurrency }}</div>
            <div class="description">
              {{ t('walletTopUp.rate') }} : 1 {{ selectedCryptoCurrency }} = {{ displayRateString }} {{ selectedCurrency }}
            </div>

            <div class="description mt-6">
              The process would take approximately 10 - 15 mins.
            </div>
            <div class="description mt-1">
              {{ selectedProviderObj.receiveHint || t('walletTopUp.receiveHint') }}
            </div>
            <!-- <div class="body-2">
              {{ t('walletTopUp.receive') }}
              <span class="caption float-right text_2--text">
                {{ t('walletTopUp.rate') }} : 1 {{ selectedCryptoCurrency }} = {{ displayRateString }} {{ selectedCurrency }}
              </span>
            </div>
            <v-text-field
              id="receive"
              readonly
              placeholder="0.00"
              :suffix="selectedCryptoCurrency"
              :value="cryptoCurrencyValue"
              :hint="selectedProviderObj.receiveHint || t('walletTopUp.receiveHint')"
              persistent-hint
              outlined
              aria-label="Amount to Receive"
            ></v-text-field> -->
          </v-flex>
        </v-layout>
      </v-form>
      <v-layout wrap>
        <v-flex xs12 class="mt-10">
          <div class="text-right">
            <v-tooltip bottom :disabled="formValid">
              <template v-slot:activator="{ on }">
                <span v-on="on">
                  <v-btn
                    class="torus-btn1 torusBrand1--text"
                    :disabled="!formValid || !isQuoteFetched"
                    large
                    depressed
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
        <!-- <v-flex class="mt-10 text-center text_2--text caption">
          {{ t('walletTopUp.contact1') }}
          <a href="mailto:hello@tor.us?Subject=Topup%20Support%20or%20Inquiry" target="_blank">
            {{ t('walletTopUp.contact2') }}
          </a>
          {{ t('walletTopUp.contact3') }}
        </v-flex> -->
      </v-layout>
    </v-card>
    <v-snackbar v-model="snackbar" :color="snackbarColor">
      {{ snackbarText }}
      <v-btn dark text @click="snackbar = false">{{ t('walletTopUp.close') }}</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { formatCurrencyNumber, paymentProviders, significantDigits } from '../../../utils/utils'
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
  },
  watch: {
    cryptoCurrencyValue(newValue, oldValue) {
      if (newValue !== oldValue) {
        if (Number.parseFloat(newValue) > 0) this.isQuoteFetched = true
      }
    },
  },
  mounted() {
    this.selectedCryptoCurrency = 'ETH'
    if (this.selectedProviderObj && this.selectedProviderObj.validCurrencies.includes(this.$store.state.selectedCurrency)) {
      this.selectedCurrency = this.$store.state.selectedCurrency
    } else {
      ;[this.selectedCurrency] = this.selectedProviderObj.validCurrencies
    }
    this.setFiatValue(this.minOrderValue)
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
        const callback = (p) => {
          p.then(({ success }) => {
            if (success) this.$router.push({ name: 'walletHistory' })
            else {
              this.snackbar = true
              this.snackbarColor = 'error'
              this.snackbarText = 'Something went wrong'
            }
          }).catch((error) => {
            this.snackbar = true
            this.snackbarColor = 'error'
            this.snackbarText = error
            this.isQuoteFetched = false
            this.$emit('clearQuote', {
              selectedCurrency: this.selectedCurrency,
              fiatValue: this.fiatValue,
              selectedCryptoCurrency: this.selectedCryptoCurrency,
            })
          })
        }
        this.$emit('sendOrder', callback)
      }
    },
    onCurrencyChange() {
      this.fetchQuote()
      // this.$store.dispatch('setSelectedCurrency', { selectedCurrency: value, origin: 'home' })
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'WalletTopupBase.scss';
</style>
