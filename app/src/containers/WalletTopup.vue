<template>
  <div class="wallet-topup-view">
    <v-layout mt-4 wrap row>
      <v-flex xs12 mb-2>
        <div class="text-black font-weight-bold headline px-3 mb-3">
          <span v-if="provider">
            Purchase Cryptocurrency with your credit card via
            <span class="text-capitalize">{{ provider }}</span>
          </span>
          <span v-else>Select a Provider</span>
        </div>
      </v-flex>
      <TopupProviders
        @onSelectProvider="
          selected => {
            provider = selected
          }
        "
      />

      <v-flex xs12 sm6 mb-3 px-3>
        <v-layout wrap row v-if="provider === 'simplex'">
          <v-flex xs12>
            <p class="body-2 px-3">
              Simplex is a secure way to buy cryptoccurrency with your credit card. Start by entering an amount to get a quote before making your
              purchase.
            </p>
          </v-flex>

          <v-flex xs12>
            <v-form ref="inputForm" v-model="formValid" lazy-validation @submit.prevent class="px-3">
              <small class="mb-2 d-block">Pay</small>
              <v-flex xs12>
                <v-text-field
                  class="pay-text-input"
                  placeholder="0.00 (Min 50.00)"
                  :suffix="`${selectedCurrency}*`"
                  solo
                  :value="fiatValue"
                  @input="watchFiatValue"
                  :rules="[rules.required, rules.validNumber, rules.maxValidation, rules.minValidation]"
                ></v-text-field>

                <div class="v-text-field__details mb-4">
                  <div class="v-messages">
                    <div class="v-messages__wrapper">
                      <div class="v-messages__message">
                        <div class="d-flex torus_text--text text--lighten-4">
                          <div>
                            <small>* Includes 5% Simplex Service Fees or 10 USD (whichever higher)</small>
                            <img :src="require(`../../public/img/icons/help-circle.svg`)" class="inline-small ml-2 help-icon" />
                          </div>
                          <small class="text-right">min 50 USD*</small>
                        </div>
                        <v-tooltip bottom>
                          <span>
                            This fee goes entirely to Simplex for their services
                            <br />
                            in credit card processing, fraud detection and mitigation
                          </span>
                        </v-tooltip>
                      </div>
                    </div>
                  </div>
                </div>
              </v-flex>

              <small class="mb-2 d-block">Receive</small>
              <v-flex xs12>
                <v-text-field class="receive-text-input" disabled placeholder="0.00" suffix="ETH" v-model="ethValue" solo></v-text-field>

                <div class="v-text-field__details">
                  <div class="v-messages">
                    <div class="v-messages__wrapper">
                      <div class="v-messages__message">Rate : 1 ETH = {{ this.displayRateString }} {{ this.selectedCurrency }}</div>
                    </div>
                  </div>
                </div>
              </v-flex>
            </v-form>
          </v-flex>

          <v-flex xs12>
            <div class="px-3 mt-5 mb-4 torus_text--text text--lighten-4">
              <div>
                <img :src="require(`../../public/img/icons/info-circle.svg`)" class="inline-small help-icon" />
                <small class="d-inline ml-2">The process would take approximately 10 - 15 mins.</small>
              </div>

              <div>
                <img :src="require(`../../public/img/icons/info-circle.svg`)" class="inline-small help-icon" />
                <small class="d-inline ml-2">Please prepare your Identity Card/Passport to complete the purchase.</small>
              </div>
            </div>
          </v-flex>
          <v-flex xs12>
            <div class="text-xs-center text-sm-right">
              <v-tooltip bottom :disabled="formValid">
                <template v-slot:activator="{ on }">
                  <span v-on="on">
                    <v-btn
                      :disabled="!formValid"
                      class="torus-button text-xs-center px-5 py-3 mb-2"
                      color="primary"
                      type="submit"
                      @click.prevent="sendOrder"
                    >
                      Continue
                    </v-btn>
                  </span>
                </template>
                <span>Resolve the errors</span>
              </v-tooltip>
              <p>
                <small class="text-gray">You will be redirected to Simplex Page</small>
              </p>
            </div>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
/* eslint-disable camelcase */
import { postQuote, postOrder } from '../plugins/simplex'
import throttle from 'lodash.throttle'
import { significantDigits, formatCurrencyNumber } from '../utils/utils'

import TopupProviders from '../components/TopupProviders'

const MIN_ORDER_VALUE = 50
const MAX_ORDER_VALUE = 20000

const validSimplexCurrencies = ['USD', 'EUR']
export default {
  components: {
    TopupProviders
  },
  data() {
    return {
      fiatValue: 0,
      ethValue: 0,
      currencyRate: 0,
      currentOrder: {},
      formValid: true,
      rules: {
        required: value => !!value || 'Required',
        validNumber: value => !isNaN(parseFloat(value)) || 'Enter a valid number',
        maxValidation: value => parseFloat(value) <= MAX_ORDER_VALUE || `Max topup amount is ${formatCurrencyNumber(MAX_ORDER_VALUE, 0)}`,
        minValidation: value => parseFloat(value) >= MIN_ORDER_VALUE || `Min topup amount is ${MIN_ORDER_VALUE}`
      },
      provider: ''
    }
  },
  computed: {
    selectedCurrency() {
      if (validSimplexCurrencies.includes(this.$store.state.selectedCurrency)) return this.$store.state.selectedCurrency
      else return 'USD'
    },
    displayRateString() {
      if (parseFloat(this.currencyRate) !== 0) return significantDigits(1 / this.currencyRate)
      else return 0
    }
  },
  methods: {
    significantDigits: significantDigits,
    watchFiatValue: function(newValue) {
      this.fiatValue = newValue
      if (parseFloat(newValue) <= 20000 && parseFloat(newValue) >= 50) this.fetchQuote()
    },
    fetchQuote: throttle(async function() {
      postQuote({
        digital_currency: 'ETH',
        fiat_currency: this.selectedCurrency,
        requested_currency: this.selectedCurrency,
        requested_amount: +parseFloat(this.fiatValue)
      })
        .then(result => {
          this.ethValue = result.result.digital_money.amount
          this.currencyRate = result.result.digital_money.amount / result.result.fiat_money.total_amount
          this.currentOrder = result.result
        })
        .catch(err => console.log(err))
    }, 0),
    sendOrder() {
      if (this.$refs.inputForm.validate()) {
        postOrder({
          'g-recaptcha-response': '',
          account_details: {
            app_end_user_id: this.currentOrder.user_id
          },
          transaction_details: {
            payment_details: {
              fiat_total_amount: {
                currency: this.currentOrder.fiat_money.currency,
                amount: this.currentOrder.fiat_money.total_amount
              },
              requested_digital_amount: {
                currency: this.currentOrder.digital_money.currency,
                amount: this.currentOrder.digital_money.amount
              },
              destination_wallet: {
                currency: this.currentOrder.digital_money.currency,
                address: this.$store.state.selectedAddress
              }
            }
          }
        }).then(result => {
          const {
            version,
            partner,
            return_url,
            quote_id,
            payment_id,
            user_id,
            destination_wallet_address,
            destination_wallet_currency,
            fiat_total_amount_amount,
            fiat_total_amount_currency,
            digital_total_amount_amount,
            digital_total_amount_currency
          } = result.result
          this.post(result.result.payment_post_url, {
            payment_flow_type: 'wallet',
            version: version,
            partner: partner,
            return_url: return_url,
            quote_id: quote_id,
            payment_id: payment_id,
            user_id: user_id,
            'destination_wallet[address]': destination_wallet_address,
            'destination_wallet[currency]': destination_wallet_currency,
            'fiat_total_amount[amount]': fiat_total_amount_amount,
            'fiat_total_amount[currency]': fiat_total_amount_currency,
            'digital_total_amount[amount]': digital_total_amount_amount,
            'digital_total_amount[currency]': digital_total_amount_currency
          })
        })
      }
    },
    post(path, params, method = 'post') {
      const form = document.createElement('form')
      form.method = method
      form.action = path
      form.target = '_blank'
      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          const hiddenField = document.createElement('input')
          hiddenField.type = 'hidden'
          hiddenField.name = key
          hiddenField.value = params[key]
          form.appendChild(hiddenField)
        }
      }
      document.body.appendChild(form)
      form.submit()
    }
  },
  async mounted() {
    this.fiatValue = 50
    this.currencyRate = this.$store.state.currencyData[this.selectedCurrency] || 0
    this.fetchQuote()
  }
}
</script>

<style lang="scss">
.wallet-topup-view {
  .help-icon {
    height: 13px;
    vertical-align: middle;
  }
  .v-text-field__suffix {
    color: #5495f7;
  }

  .info-notes {
    color: #5c6c7f;
  }

  .input-notes {
    align-items: center;
    justify-content: space-between;

    small {
      font-size: 12px;
    }
  }

  .pay-text-input {
    .v-input__slot {
      background: transparent !important;
      box-shadow: none !important;
      border: 1px solid #d3d5e2 !important;
    }
  }

  .receive-text-input {
    .v-input__slot {
      background: transparent !important;
      box-shadow: none !important;
      border: 1px solid #d3d5e2 !important;
    }
  }

  .text-right {
    text-align: right;
  }

  .provider {
    min-height: 63px;
    width: 100%;

    &-checkbox {
      display: flex;
      align-items: center;
    }

    &-description {
      padding-left: 3rem;
    }

    &-logo {
      max-height: 40px;
      margin-bottom: 20px;
      margin-left: 10px;
    }
  }

  .torus-button {
    height: auto !important;
  }

  @media screen and (min-width: 768px) {
    .provider {
      display: flex;
      align-items: center;
      justify-content: space-between;

      &-description {
        text-align: right;
        padding-left: 0;
      }

      &-logo {
        margin-bottom: 0;
      }
    }
  }
}
</style>
