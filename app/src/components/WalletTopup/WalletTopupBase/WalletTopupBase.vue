<template>
  <v-card class="card-shadow pa-6">
    <v-layout wrap class="wallet-topup">
      <v-flex xs12>
        <p class="body-2">
          <span class="text-capitalize">{{ selectedProvider }}</span>
          is a secure way to buy cryptocurrency with your payment method. Start by entering an amount below to get a quote before making a purchase
        </p>
      </v-flex>

      <v-flex xs12>
        <v-form ref="paymentForm" v-model="formValid" lazy-validation @submit.prevent>
          <v-flex xs12>
            <div class="subtitle-2">You wanna buy?</div>
            <v-select
              id="cryptocurrency"
              class="cryptocurrency-selector"
              outlined
              append-icon="$vuetify.icons.select"
              :items="selectedProviderObj.validCryptoCurrencies"
              v-model="selectedCryptoCurrency"
              @change="fetchQuote"
            ></v-select>
          </v-flex>
          <v-flex xs12>
            <div class="subtitle-2">You send</div>
            <v-text-field
              id="you-send"
              class="unique-hint"
              :placeholder="sendPlaceholder"
              outlined
              :value="fiatValue"
              @input="setFiatValue"
              :rules="[rules.required, rules.validNumber, rules.maxValidation, rules.minValidation]"
            >
              <template v-slot:append>
                <v-btn outlined small color="primary" @click="setFiatValue(100)">100</v-btn>
                <v-btn outlined small color="primary" @click="setFiatValue(200)" class="ml-2">200</v-btn>
                <div class="primary--text font-weight-medium subtitle-2 pt-1 ml-2">{{ selectedCurrency }}*</div>
              </template>
            </v-text-field>

            <div class="v-text-field__details torus-hint mb-6">
              <div class="v-messages">
                <div class="v-messages__wrapper">
                  <div class="v-messages__message d-flex text_2--text">
                    <v-flex class="font-weight-medium">
                      <span v-if="selectedProviderObj.includeFees">Includes &nbsp;&nbsp;</span>
                      <span v-else>Doesn't Include &nbsp;&nbsp;</span>
                      <span v-html="selectedProviderObj.line2 || ''"></span>
                      <HelpTooltip
                        title="Service Fee"
                        :description="
                          `This fee goes entirely to ${selectedProvider} for their services in card processing, mitigation and fraud detection`
                        "
                      ></HelpTooltip>
                    </v-flex>
                    <v-flex grow-shrink-0>
                      <span>min {{ minOrderValue }}, max {{ maxOrderValue }} {{ selectedCurrency }}*</span>
                    </v-flex>
                  </div>
                </div>
              </div>
            </div>
          </v-flex>

          <v-flex xs12>
            <div class="subtitle-2">
              Receive
              <span class="caption float-right text_2--text">
                Rate : 1 {{ selectedCryptoCurrency }} = {{ displayRateString }} {{ selectedCurrency }}
              </span>
            </div>
            <v-text-field
              id="receive"
              readonly
              placeholder="0.00"
              :suffix="selectedCryptoCurrency"
              :value="cryptoCurrencyValue"
              hint="Please prepare your Identity Card/Passport to complete the purchase."
              persistent-hint
              outlined
            ></v-text-field>
          </v-flex>
        </v-form>
      </v-flex>

      <v-flex xs12 class="mt-10">
        <div class="text-right">
          <v-tooltip bottom :disabled="formValid">
            <template v-slot:activator="{ on }">
              <span v-on="on">
                <v-btn class="px-10" :disabled="!formValid" x-large depressed color="primary" type="submit" @click.prevent="sendOrder">
                  Continue
                </v-btn>
              </span>
            </template>
            <span>Resolve the errors</span>
          </v-tooltip>
          <div class="caption text_2--text">You will be redirected to the third party page</div>
        </div>
      </v-flex>

      <v-flex class="mt-10 text-center text_2--text caption">
        Feel free to
        <a href="mailto:hello@tor.us?Subject=Topup%20Support%20or%20Inquiry" target="_blank">contact us</a>
        for support or any inquiry
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import config from '../../../config'
import { paymentProviders, formatCurrencyNumber, significantDigits } from '../../../utils/utils'
import HelpTooltip from '../../helpers/HelpTooltip'

export default {
  components: {
    HelpTooltip
  },
  props: ['selectedProvider', 'cryptoCurrencyValue', 'currencyRate'],
  data() {
    return {
      formValid: true,
      fiatValue: '',
      selectedCryptoCurrency: '',
      paymentProviders: paymentProviders,
      rules: {
        required: value => !!value || 'Required',
        validNumber: value => !isNaN(parseFloat(value)) || 'Enter a valid number',
        maxValidation: value => parseFloat(value) <= this.maxOrderValue || `Max topup amount is ${formatCurrencyNumber(this.maxOrderValue, 0)}`,
        minValidation: value => parseFloat(value) >= this.minOrderValue || `Min topup amount is ${this.minOrderValue}`
      }
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
      if (this.selectedProviderObj && this.selectedProviderObj.validCurrencies.includes(this.$store.state.selectedCurrency))
        return this.$store.state.selectedCurrency
      return 'USD'
    },
    maxOrderValue() {
      return this.selectedProviderObj.maxOrderValue
    },
    minOrderValue() {
      return this.selectedProviderObj.minOrderValue
    },
    displayRateString() {
      if (parseFloat(this.currencyRate) !== 0) return significantDigits(1 / this.currencyRate)
      else return 0
    }
  },
  methods: {
    significantDigits: significantDigits,
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
      if (this.$refs.paymentForm.validate()) this.$emit('sendOrder')
    }
  },
  mounted() {
    this.selectedCryptoCurrency = 'ETH'
    this.setFiatValue(this.minOrderValue)
  }
}
</script>

<style lang="scss" scoped>
@import 'WalletTopupBase.scss';
</style>
