<template>
  <div>
    <v-card class="card-shadow pa-6">
      <v-layout wrap class="wallet-topup">
        <v-flex xs12>
          <p class="body-2">
            <span class="text-capitalize selected-provider">{{ selectedProvider }}</span>
            {{ t('walletTopUp.description') }}
          </p>
        </v-flex>

        <v-flex xs12>
          <v-form ref="paymentForm" v-model="formValid" lazy-validation @submit.prevent>
            <v-flex xs12>
              <div class="subtitle-2">{{ t('walletTopUp.wannaBuy') }}</div>
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
            <v-flex xs12>
              <div class="subtitle-2">{{ t('walletTopUp.youSend') }}</div>
              <v-text-field
                id="you-send"
                class="unique-hint"
                :placeholder="sendPlaceholder"
                outlined
                :value="fiatValue"
                :rules="[rules.required, rules.validNumber, rules.maxValidation, rules.minValidation]"
                aria-label="Amount to Buy"
                @input="setFiatValue"
              >
                <template v-slot:append>
                  <v-btn outlined small color="primary" @click="setFiatValue(100)">100</v-btn>
                  <v-btn outlined small color="primary" class="ml-2" @click="setFiatValue(200)">200</v-btn>
                  <div class="primary--text font-weight-medium subtitle-2 pt-1 ml-2">{{ selectedCurrency }}*</div>
                </template>
              </v-text-field>

              <div class="v-text-field__details torus-hint mb-6">
                <div class="v-messages">
                  <div class="v-messages__wrapper">
                    <div class="v-messages__message d-flex text_2--text">
                      <v-flex class="font-weight-medium">
                        <span v-if="selectedProviderObj.includeFees">{{ t('walletTopUp.includes') }} &nbsp;&nbsp;</span>
                        <span v-else>{{ t('walletTopUp.doesntInclude') }} &nbsp;&nbsp;</span>
                        <span v-html="selectedProviderObj.line2 || ''"></span>
                        <HelpTooltip
                          :title="t('walletTopUp.serviceFee')"
                          :description="`${t('walletTopUp.serviceFeeDesc1')} ${selectedProvider} ${t('walletTopUp.serviceFeeDesc2')}`"
                        ></HelpTooltip>
                      </v-flex>
                      <v-flex grow-shrink-0>
                        <span>
                          {{ t('walletTopUp.min') }} {{ minOrderValue }}, {{ t('walletTopUp.max') }} {{ maxOrderValue }} {{ selectedCurrency }}*
                        </span>
                      </v-flex>
                    </div>
                  </div>
                </div>
              </div>
            </v-flex>

            <v-flex xs12>
              <div class="subtitle-2">
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
              ></v-text-field>
            </v-flex>
          </v-form>
        </v-flex>

        <v-flex xs12 class="mt-10">
          <div class="text-right">
            <v-tooltip bottom :disabled="formValid">
              <template v-slot:activator="{ on }">
                <span v-on="on">
                  <v-btn
                    class="px-10"
                    :disabled="!formValid || !isQuoteFetched"
                    x-large
                    depressed
                    color="primary"
                    type="submit"
                    @click.prevent="sendOrder"
                  >
                    {{ t('walletTopUp.continue') }}
                  </v-btn>
                </span>
              </template>
              <span>{{ t('walletTopUp.resolveErrors') }}</span>
            </v-tooltip>
            <div class="caption text_2--text">{{ t('walletTopUp.redirectMessage') }}</div>
          </div>
        </v-flex>

        <v-flex class="mt-10 text-center text_2--text caption">
          {{ t('walletTopUp.contact1') }}
          <a href="mailto:hello@tor.us?Subject=Topup%20Support%20or%20Inquiry" target="_blank">
            {{ t('walletTopUp.contact2') }}
          </a>
          {{ t('walletTopUp.contact3') }}
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
import { formatCurrencyNumber, paymentProviders, significantDigits } from '../../../utils/utils'
import HelpTooltip from '../../helpers/HelpTooltip'

export default {
  components: {
    HelpTooltip
  },
  props: {
    selectedProvider: {
      type: String,
      default: ''
    },
    cryptoCurrencyValue: {
      type: [Number, String],
      default: 0
    },
    currencyRate: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {
      isQuoteFetched: false,
      formValid: true,
      fiatValue: '',
      selectedCryptoCurrency: '',
      paymentProviders,
      rules: {
        required: value => !!value || 'Required',
        validNumber: value => !Number.isNaN(parseFloat(value)) || 'Enter a valid number',
        maxValidation: value => parseFloat(value) <= this.maxOrderValue || `Max topup amount is ${formatCurrencyNumber(this.maxOrderValue, 0)}`,
        minValidation: value => parseFloat(value) >= this.minOrderValue || `Min topup amount is ${this.minOrderValue}`
      },
      snackbar: false,
      snackbarText: '',
      snackbarColor: 'success'
    }
  },
  computed: {
    sendPlaceholder() {
      return `0.00 (Min ${formatCurrencyNumber(this.minOrderValue)})`
    },
    selectedProviderObj() {
      return this.paymentProviders[this.selectedProvider]
    },
    selectedCurrency() {
      if (this.selectedProviderObj && this.selectedProviderObj.validCurrencies.includes(this.$store.state.selectedCurrency)) {
        return this.$store.state.selectedCurrency
      }
      return this.selectedProviderObj.validCurrencies[0]
    },
    maxOrderValue() {
      return this.selectedProviderObj.maxOrderValue
    },
    minOrderValue() {
      return this.selectedProviderObj.minOrderValue
    },
    displayRateString() {
      if (parseFloat(this.currencyRate) !== 0) return significantDigits(1 / this.currencyRate)
      return 0
    }
  },
  watch: {
    cryptoCurrencyValue(newValue, oldValue) {
      if (newValue !== oldValue) {
        if (parseFloat(newValue) > 0) this.isQuoteFetched = true
      }
    }
  },
  mounted() {
    this.selectedCryptoCurrency = 'ETH'
    this.setFiatValue(this.minOrderValue)
  },
  methods: {
    significantDigits,
    setFiatValue(newValue) {
      this.fiatValue = newValue
      if (newValue <= this.maxOrderValue && newValue >= this.minOrderValue) {
        this.fetchQuote()
      }
    },
    fetchQuote() {
      this.$emit('fetchQuote', {
        selectedCurrency: this.selectedCurrency,
        fiatValue: this.fiatValue,
        selectedCryptoCurrency: this.selectedCryptoCurrency
      })
    },
    sendOrder() {
      if (this.$refs.paymentForm.validate()) {
        const callback = p => {
          p.then(({ success }) => {
            if (success) this.$router.push({ name: 'walletHistory' })
            else {
              this.snackbar = true
              this.snackbarColor = 'error'
              this.snackbarText = 'Something went wrong'
            }
          }).catch(error => {
            this.snackbar = true
            this.snackbarColor = 'error'
            this.snackbarText = error
            this.isQuoteFetched = false
            this.$emit('clearQuote', {
              selectedCurrency: this.selectedCurrency,
              fiatValue: this.fiatValue,
              selectedCryptoCurrency: this.selectedCryptoCurrency
            })
          })
        }
        this.$emit('sendOrder', callback)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'WalletTopupBase.scss';
</style>
