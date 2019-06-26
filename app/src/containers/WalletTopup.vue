<template>
  <v-flex fill-height class="simplex-page mt-2">
    <v-form ref="inputForm" v-model="formValid" lazy-validation>
      <v-container align-content-center>
        <v-layout column text-sm-center>
          <v-flex sm6>
            <h1 class="page-title">Purchase Cryptocurrency with your credit card via Simplex</h1>
          </v-flex>
          <v-flex sm6>
            <p class="page-description">
              Simplex is a secure way to buy cryptoccurrency with your credit card.
              <br />Start by entering an amount to get a quote before making your purchase.
            </p>
          </v-flex>
        </v-layout>

        <v-layout row justify-center>
          <v-flex sm2 lg1>
            <v-subheader>Pay</v-subheader>
          </v-flex>
          <v-flex sm4 lg4>
            <v-text-field
              class="torus-text-input"
              placeholder="0.00 (Min 50.00)"
              :suffix="`${selectedCurrency}*`"
              solo
              :value="fiatValue"
              @input="watchFiatValue"
              :rules="[rules.required, rules.validNumber, rules.maxValidation, rules.minValidation]"
            ></v-text-field>
            <div class="v-text-field__details">
              <div class="v-messages theme--light">
                <div class="v-messages__wrapper">
                  <div class="v-messages__message">
                    * Includes 5% Simplex Service Fees
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon class="torus-hint-icon" color="primary" small v-on="on">error_outline</v-icon>
                      </template>
                      <span>
                        This fee goes entirely to Simplex for their services <br />in credit card processing, fraud detection and mitigation
                      </span>
                    </v-tooltip>
                  </div>
                </div>
              </div>
            </div>
          </v-flex>
        </v-layout>

        <v-layout row justify-center class="pay-form">
          <v-flex sm2 lg1>
            <v-subheader>Receive</v-subheader>
          </v-flex>
          <v-flex sm4 lg4>
            <v-text-field class="torus-text-input-disabled" disabled placeholder="0.00" suffix="ETH" v-model="ethValue" solo></v-text-field>
            <div class="v-text-field__details">
              <div class="v-messages theme--light">
                <div class="v-messages__wrapper">
                  <div class="v-messages__message">Rate : 1 ETH = {{ this.displayRateString }} {{ this.selectedCurrency }}</div>
                </div>
              </div>
            </div>
          </v-flex>
        </v-layout>

        <v-layout class="torus-notes" column text-sm-center>
          <v-flex sm6>
            <v-layout row justify-center>
              <img class="torus-note-icon" src="/images/clock-regular.svg" />
              <span>The process would take approximately 10 - 15 mins.</span>
            </v-layout>
          </v-flex>
          <v-flex sm6>
            <v-layout row justify-center>
              <img class="torus-note-icon" src="/images/address-card-regular.svg" />
              <span>Please prepare your Identity Card/Passport to complete the purchase.</span>
            </v-layout>
          </v-flex>
        </v-layout>
        <div class="text-xs-center">
          <v-tooltip bottom :disabled="formValid">
            <template v-slot:activator="{ on }">
              <span v-on="on">
                <v-btn :disabled="!formValid" class="torus-button text-xs-center" color="primary" type="submit" @click.prevent="sendOrder"
                  >Checkout with Simplex</v-btn
                >
              </span>
            </template>
            <span>Resolve the errors</span>
          </v-tooltip>
        </div>
      </v-container>
    </v-form>
  </v-flex>
</template>

<script>
/* eslint-disable camelcase */
import { getQuote, getOrder } from '../plugins/simplex'
import throttle from 'lodash.throttle'
import { significantDigits, formatCurrencyNumber } from '../utils/utils'

const MIN_ORDER_VALUE = 50
const MAX_ORDER_VALUE = 20000

const validSimplexCurrencies = ['USD', 'EUR']
export default {
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
      }
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
      getQuote({
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
        getOrder({
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

<style lang="scss" scoped>
.simplex-page {
  // background: url('/images/footer_waves.png') no-repeat;
  // background-position: center bottom;

  .header {
    padding: 25px 25px;
  }

  .header-title {
    display: flex;
    img {
      margin-right: 10px;
      width: 25px;
    }
    span {
      font-size: 14px;
    }
  }

  .page-title {
    font-size: 25px;
    line-height: 28px;
    margin-bottom: 10px;
  }

  .page-description {
    font-size: 14px;
    line-height: 17px;
    margin-bottom: 20px;
  }

  .torus-button {
    border-radius: 5px;
    background-image: linear-gradient(to right, #5495f7, #295dab);
    text-transform: none;
    font-size: 16px;
    padding: 10px 20px;
    height: inherit;
  }

  .pay-form {
    margin-bottom: 20px !important;
  }

  .torus-notes {
    margin-bottom: 15px !important;
  }

  .torus-note-icon {
    margin-right: 10px;
  }

  .torus-text-input.v-text-field--solo {
    font-size: 20px;

    & /deep/ .v-input__slot {
      box-shadow: none;
      margin-bottom: 5px;
      border-radius: 5px;
      background-image: linear-gradient(to right, #5495f7, #295dab);
      padding: 2px;
    }
    & /deep/ .v-text-field__slot {
      background-color: rgba(255, 255, 255, 0.3);
      border-radius: 4px;
      height: 44px;
      input {
        &::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }
        text-align: center;
        color: #ffffff;
      }
    }
    & /deep/ .v-text-field__suffix {
      background-color: #295dab;
      height: 100%;
      line-height: 42px;
      color: #ffffff;
      padding: 0 15px;
      min-width: 90px;
      text-align: center;
    }
  }

  .torus-text-input-disabled.v-text-field--solo {
    font-size: 20px;

    & /deep/ .v-input__slot {
      box-shadow: none;
      margin-bottom: 5px;
      border-radius: 5px;
      background-image: linear-gradient(to right, #5495f7, #295dab);
      padding: 2px;
    }
    & /deep/ .v-text-field__slot {
      background-image: linear-gradient(to right, #5495f7, #295dab);
      border-radius: 4px;
      height: 44px;
      input {
        &::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }
        text-align: center;
        color: #ffffff;
      }
    }
    & /deep/ .v-text-field__suffix {
      height: 100%;
      line-height: 42px;
      color: #ffffff;
      padding: 0 15px;
      min-width: 90px;
      text-align: center;
    }
  }

  & /deep/ .v-text-field__details {
    margin-bottom: 0;
    padding: 0 12px;
  }

  & /deep/ .v-messages {
    min-height: 0;
  }
}

@media only screen and (min-width: 600px) {
  .simplex-page {
    .header {
      padding: 45px 50px 30px;
      align-items: center;
    }

    .header-title {
      img {
        margin-right: 20px;
      }
      span {
        font-size: 14px;
      }
    }

    .page-title {
      font-size: 25px;
      line-height: 30px;
    }

    .page-description {
      font-size: 17px;
      line-height: 21px;
      margin-bottom: 40px;
    }

    .torus-button {
      font-size: 21px;
      padding: 15px 30px;
    }

    .pay-form {
      margin-bottom: 40px !important;
    }

    .torus-notes {
      margin-bottom: 20px !important;
    }

    .torus-note-icon {
      margin-right: 15px;
    }
  }
}

@media only screen and (min-width: 1264px) {
  .simplex-page {
    background-size: 100%;
  }

  .container {
    max-width: 1185px;
  }
}

@media only screen and (max-height: 750px) {
  .simplex-page {
    .header {
      padding: 45px 50px 0;
    }

    .page-title {
      margin-bottom: 0;
    }

    .page-description {
      margin-bottom: 20px;
    }

    .pay-form {
      margin-bottom: 10px !important;
    }

    .torus-notes {
      margin-bottom: 10px !important;
    }

    .torus-note-icon {
      margin-right: 15px;
    }
  }
}
</style>
