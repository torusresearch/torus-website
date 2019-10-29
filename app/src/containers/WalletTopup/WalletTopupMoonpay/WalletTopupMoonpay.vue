<template>
  <v-layout wrap class="wallet-topup-moonpay">
    <v-flex xs12>
      <p class="body-2">
        Moonpay is a secure way to buy cryptocurrency with your credit card. Start by entering a amount below to get a quote before making a purchase
      </p>
    </v-flex>

    <v-flex xs9>
      <v-form ref="inputForm" v-model="formValid" lazy-validation @submit.prevent>
        <v-flex xs12>
          <div class="subtitle-2">You send</div>
          <v-text-field
            id="simplex-you-send"
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
                <div class="v-messages__message d-flex text_2--text">
                  <v-flex class="px-3">
                    * Includes 5% Simplex Service Fees or 10 USD (whichever higher)
                    <HelpTooltip
                      title="Simplex Service Fee"
                      description="This fee goes entirely to Simplex for their services in credit card processing, mitigation and fraud detection."
                    ></HelpTooltip>
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
            id="simplex-receive"
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
      <div class="mt-12 mb-6 text_2--text">
        <div>
          <img :src="require(`../../../../public/img/icons/info-circle.svg`)" class="help-icon" />
          <small class="d-inline ml-2">The process would take approximately 10 - 15 mins.</small>
        </div>

        <div>
          <img :src="require(`../../../../public/img/icons/info-circle.svg`)" class="help-icon" />
          <small class="d-inline ml-2">Please prepare your Identity Card/Passport to complete the purchase.</small>
        </div>
      </div>
    </v-flex>
    <v-flex xs12>
      <div class="text-right">
        <v-tooltip bottom :disabled="formValid">
          <template v-slot:activator="{ on }">
            <span v-on="on">
              <v-btn :disabled="!formValid" depressed color="primary" type="submit" @click.prevent="sendOrder">Continue</v-btn>
            </span>
          </template>
          <span>Resolve the errors</span>
        </v-tooltip>
        <div class="caption text_2--text">You will be sent to Simplex</div>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import config from '../../../config'
import { GOOGLE } from '../../../utils/enums'
import HelpTooltip from '../../../components/helpers/HelpTooltip'

const { moonpayLiveAPIKEY, moonpayHost } = config

export default {
  components: {
    HelpTooltip
  },
  data() {
    return {
      url: '',
      loaded: false,
      currencyCode: 'eth',
      path: moonpayHost,
      apiKey: moonpayLiveAPIKEY,
      // Modify before deploying.
      redirectURL: '',
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
  methods: {},
  mounted() {
    this.redirectURL = 'javascript:window.top.location.href="' + window.location.origin + '/wallet/history"'
    const userEmailString = this.$store.state.userInfo.email !== '' ? '&email=' + this.$store.state.userInfo.email : ''
    this.url =
      this.path +
      'apiKey=' +
      this.apiKey +
      '&currencyCode=' +
      this.currencyCode +
      '&walletAddress=' +
      this.$store.state.selectedAddress +
      userEmailString +
      '&redirectURL=' +
      this.redirectURL +
      '&colorCode=' +
      encodeURIComponent(this.$vuetify.theme.themes.light.primary) +
      '&externalCustomerId=' +
      this.$store.state.selectedAddress

    this.loaded = true
    // log.info('this is', this)
  }
}
</script>
