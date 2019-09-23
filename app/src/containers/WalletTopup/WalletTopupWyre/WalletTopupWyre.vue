<template>
  <v-layout wrap class="wallet-topup-wyre">
    <v-flex xs12>
      <p class="body-2">
        Wyre is a secure way to buy cryptocurrency with your debit card. Start by entering an amount to make your purchase
      </p>
    </v-flex>

    <v-flex xs12>
      <v-form ref="inputForm" v-model="formValid" lazy-validation @submit.prevent>
        <div class="subtitle-2">You send</div>
        <v-text-field
          class="unique-hint"
          placeholder="0.00 (Min 5.00)"
          outlined
          :value="fiatValue"
          @input="watchFiatValue"
          :rules="[rules.required, rules.validNumber, rules.maxValidation, rules.minValidation]"
        >
          <template v-slot:append>
            <v-btn outlined small color="primary" @click="watchFiatValue(20)">20</v-btn>
            <v-btn outlined small color="primary" @click="watchFiatValue(40)" class="ml-2">40</v-btn>
            <div class="primary--text font-weight-medium subtitle-2 pt-1 ml-2">USD*</div>
          </template>
        </v-text-field>
        <div class="v-text-field__details torus-hint mb-6">
          <div class="v-messages">
            <div class="v-messages__wrapper">
              <div class="v-messages__message d-flex text_2--text">
                <v-flex class="px-3">
                  * Includes 2.9% + 30¢ Wyre Service Fees ($40 Limit)
                  <v-tooltip class="torus-tooltip" bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon small v-text="'$vuetify.icons.question'" v-on="on"></v-icon>
                    </template>
                    <span>
                      <div class="primary--text subtitle-2">Wyre Service Fee</div>
                      <v-divider class="my-2"></v-divider>
                      <div class="body-2">
                        This fee goes entirely to Wyre for their services in debit card processing, mitigation and fraud detection.
                      </div>
                    </span>
                  </v-tooltip>
                </v-flex>
                <v-flex grow-shrink-0>
                  <span>max 40 USD*</span>
                </v-flex>
              </div>
            </div>
          </div>
        </div>
      </v-form>
    </v-flex>
    <v-flex xs12>
      <div class="text-right">
        <v-tooltip bottom :disabled="formValid">
          <template v-slot:activator="{ on }">
            <span v-on="on">
              <v-btn :disabled="!formValid" depressed color="primary" type="submit" @click.prevent="startWyre">
                Continue
              </v-btn>
            </span>
          </template>
          <span>Resolve the errors</span>
        </v-tooltip>
        <div class="caption text_2--text">You will be shown a widget</div>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import { setInterval, clearInterval } from 'timers'
import { significantDigits, formatCurrencyNumber } from '../../../utils/utils'
const MAX_ORDER_VALUE = 40
const MIN_ORDER_VALUE = 5
var widget
export default {
  data() {
    return {
      isWyreLoaded: false,
      fiatValue: 0,
      formValid: true,
      rules: {
        required: value => !!value || 'Required',
        validNumber: value => !isNaN(parseFloat(value)) || 'Enter a valid number',
        maxValidation: value => parseFloat(value) <= MAX_ORDER_VALUE || `Max topup amount is ${formatCurrencyNumber(MAX_ORDER_VALUE, 0)}`,
        minValidation: value => parseFloat(value) >= MIN_ORDER_VALUE || `Min topup amount is ${MIN_ORDER_VALUE}`
      }
    }
  },
  methods: {
    watchFiatValue(newValue) {
      this.fiatValue = newValue
    },
    startWyre() {
      if (this.$refs.inputForm.validate()) {
        var deviceToken = localStorage.getItem('DEVICE_TOKEN')
        if (!deviceToken) {
          var array = new Uint8Array(25)
          window.crypto.getRandomValues(array)
          deviceToken = Array.prototype.map.call(array, x => ('00' + x.toString(16)).slice(-2)).join('')
          localStorage.setItem('DEVICE_TOKEN', deviceToken)
        }
        widget = new Wyre.Widget({
          env: 'test',
          accountId: 'AC_L7FFXAJEV4Q',
          auth: {
            type: 'secretKey',
            secretKey: deviceToken
          },
          operation: {
            type: 'debitcard',
            destCurrency: 'ETH',
            destAmount: this.fiatValue,
            dest: this.$store.state.selectedAddress
          }
        })
        widget.on('close', function(e) {
          // the widget closed before completing the process
          if (e.error) {
            console.log('there was a problem: ', e.error)
          } else {
            console.log('the customer closed the widget')
          }
        })

        widget.on('complete', function(e) {
          // onboarding was completed successfully!
          console.log(e, 'completed')
        })
        widget.open()
      }
    }
  },
  mounted() {
    const scriptNode = document.createElement('script')
    scriptNode.src = 'https://verify.sendwyre.com/js/widget-loader.js'
    scriptNode.type = 'text/javascript'
    scriptNode.charset = 'utf-8'
    document.getElementsByTagName('body')[0].appendChild(scriptNode)

    const interval = setInterval(() => {
      if (window.Wyre) {
        this.isWyreLoaded = true
        clearInterval(interval)
      }
    }, 1000)
  }
}
</script>

<style lang="scss" scoped>
@import 'WalletTopupWyre.scss';
</style>
