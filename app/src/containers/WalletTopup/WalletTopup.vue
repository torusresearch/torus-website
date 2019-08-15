<template>
  <div class="wallet-topup-view">
    <v-layout mt-3 wrap>
      <v-flex xs12 mb-2>
        <div class="text-black font-weight-bold headline px-4 mb-4">
          <span v-if="provider && !$vuetify.breakpoint.xsOnly">
            Purchase Cryptocurrency with your credit card via
            <span class="text-capitalize">{{ provider }}</span>
          </span>
          <span v-else>Select a Provider</span>
        </div>
      </v-flex>
      <TopupProviders
        :provider="provider"
        @onSelectProvider="
          selected => {
            provider = selected
          }
        "
      />

      <v-flex xs12 mb-2 v-if="provider && $vuetify.breakpoint.xsOnly">
        <div class="text-black font-weight-bold headline px-4 mb-4">
          <span>
            Purchase Cryptocurrency with your credit card via
            <span class="text-capitalize">{{ provider }}</span>
          </span>
        </div>
      </v-flex>

      <v-flex xs12 sm6 mb-4 px-4>
        <v-layout wrap v-if="provider === 'simplex'">
          <v-flex xs12>
            <p class="body-2">
              Simplex is a secure way to buy cryptoccurrency with your credit card. Start by entering an amount to get a quote before making your
              purchase.
            </p>
          </v-flex>

          <v-flex xs12>
            <v-form ref="inputForm" v-model="formValid" lazy-validation @submit.prevent>
              <v-flex xs12>
                <div class="subtitle-2">You send</div>
                <v-text-field
                  class="unique-hint"
                  placeholder="0.00 (Min 50.00)"
                  outlined
                  :value="fiatValue"
                  @input="watchFiatValue"
                  :rules="[rules.required, rules.validNumber, rules.maxValidation, rules.minValidation]"
                >
                  <template v-slot:append>
                    <v-btn outlined small color="primary" @click="watchFiatValue(100)">100</v-btn>
                    <v-btn outlined small color="primary" @click="watchFiatValue(200)" class="ml-2">200</v-btn>
                    <div class="primary--text font-weight-medium subtitle-2 pt-1 ml-2">{{ selectedCurrency }}*</div>
                  </template>
                </v-text-field>

                <div class="v-text-field__details torus-hint mb-6">
                  <div class="v-messages">
                    <div class="v-messages__wrapper">
                      <div class="v-messages__message d-flex torus_text--text text--lighten-4">
                        <v-flex class="px-3">
                          * Includes 5% Simplex Service Fees or 10 USD (whichever higher)
                          <v-tooltip class="torus-tooltip" bottom>
                            <template v-slot:activator="{ on }">
                              <v-icon small v-text="'$vuetify.icons.question'" v-on="on"></v-icon>
                            </template>
                            <span>
                              <div class="primary--text subtitle-2">Simplex Service Fee</div>
                              <v-divider class="my-2"></v-divider>
                              <div class="body-2">
                                This fee goes entirely to Simplex for their services in credit card processing, mitigation and fraud detection.
                              </div>
                            </span>
                          </v-tooltip>
                        </v-flex>
                        <v-flex grow-shrink-0>
                          <span>min 50 USD*</span>
                        </v-flex>
                      </div>
                    </div>
                  </div>
                </div>
              </v-flex>

              <v-flex xs12>
                <div class="subtitle-2">Receive</div>
                <v-text-field
                  readonly
                  placeholder="0.00"
                  suffix="ETH"
                  v-model="ethValue"
                  :hint="`Rate : 1 ETH = ${displayRateString} ${selectedCurrency}`"
                  persistent-hint
                  outlined
                ></v-text-field>
              </v-flex>
            </v-form>
          </v-flex>

          <v-flex xs12>
            <div class="mt-12 mb-6 torus_text--text text--lighten-4">
              <div>
                <img :src="require(`../../../public/img/icons/info-circle.svg`)" class="help-icon" />
                <small class="d-inline ml-2">The process would take approximately 10 - 15 mins.</small>
              </div>

              <div>
                <img :src="require(`../../../public/img/icons/info-circle.svg`)" class="help-icon" />
                <small class="d-inline ml-2">Please prepare your Identity Card/Passport to complete the purchase.</small>
              </div>
            </div>
          </v-flex>
          <v-flex xs12>
            <div class="text-right">
              <v-btn class="mr-3" text @click.prevent="provider = ''">Back</v-btn>
              <v-tooltip bottom :disabled="formValid">
                <template v-slot:activator="{ on }">
                  <span v-on="on">
                    <v-btn :disabled="!formValid" depressed color="primary" type="submit" @click.prevent="sendOrder">
                      Continue
                    </v-btn>
                  </span>
                </template>
                <span>Resolve the errors</span>
              </v-tooltip>
              <div class="caption torus_text--text text--lighten-4">You will be redirected to Simplex Page</div>
            </div>
          </v-flex>
        </v-layout>
        <v-layout wrap v-if="provider === 'moonpay'">
          <span>
            Moonpay is a secure way to buy cryptocurrency with your credit card. Start by entering a amount below to get a quote before making a
            purchase
          </span>

          <div style="height:500px; width:100%">
            <iframe v-if="moonPay.loaded" :src="moonPay.url" height="100%" width="100%" style="border:none"></iframe>
          </div>
        </v-layout>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
/* eslint-disable camelcase */
import { postQuote, postOrder } from '../../plugins/simplex'
import throttle from 'lodash.throttle'
import { significantDigits, formatCurrencyNumber } from '../../utils/utils'
import config from '../../config.js'
const { moonpayLiveAPIKEY, moonpayHost } = config

import TopupProviders from '../../components/WalletTopup/TopupProviders'

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
      moonPay: {
        url: '',
        loaded: false,
        currencyCode: 'eth',
        path: moonpayHost,
        apiKey: moonpayLiveAPIKEY,

        // Modify before deploying.
        redirectURL: ''
      },
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
    runMoonPaySafariFix() {
      var isSafari = navigator.userAgent.indexOf('Safari') > -1
      if (!isSafari) {
        return
      }
      var isChrome = navigator.userAgent.indexOf('Chrome') > -1
      if (isChrome) {
        return
      }
      if (!document.cookie.match(/^(.*;)?\s*moonpay-fixed\s*=\s*[^;]+(.*)?$/)) {
        document.cookie = 'moonpay-fixed=fixed; expires=Tue, 19 Jan 2038 03:14:07 UTC; path=/'
        window.location.replace('https://buy.moonpay.io/safari_fix')
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

    this.runMoonPaySafariFix()

    /**
     * iframe init for moon pay.
     */
    this.moonPay.redirectURL = 'javascript:window.top.location.href="' + window.location.origin + '/wallet/history"'
    this.moonPay.url =
      this.moonPay.path +
      'apiKey=' +
      this.moonPay.apiKey +
      '&currencyCode=' +
      this.moonPay.currencyCode +
      '&walletAddress=' +
      this.$store.state.selectedAddress +
      '&email=' +
      this.$store.state.userInfo.email +
      '&redirectURL=' +
      this.moonPay.redirectURL

    this.moonPay.loaded = true
    // console.log('this.moonpay is', this.moonPay)

    this.fetchQuote()
  }
}
</script>

<style lang="scss" scoped>
@import 'WalletTopup.scss';
</style>
