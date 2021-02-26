<template>
  <v-dialog v-model="addTokenDialog" max-width="375" persistent>
    <template #activator="{ on }">
      <v-btn v-if="isHideMode" icon x-small v-on="on">
        <v-icon class="white--text" x-small>$vuetify.icons.close</v-icon>
      </v-btn>
      <a v-else class="torusBrand1--text caption font-weight-medium gtm-add-token-cta" v-on="on">{{ t('homeToken.addTokenHere') }}</a>
    </template>
    <v-card class="add-token">
      <v-tabs-items v-model="tab" touchless>
        <v-tab-item>
          <v-layout class="card-header" wrap>
            <v-flex text-center xs12 py-10 px-6>
              <div class="display-1">{{ isHideMode ? t('homeToken.hideTokens') : t('homeToken.addTokens') }}</div>
              <v-btn class="close-btn" icon aria-label="Close Add Token" title="Close Add Token" @click="closeForm">
                <v-icon>$vuetify.icons.close</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
          <v-form ref="addTokenForm" v-model="addTokenFormValid" class="fill-height" lazy-validation @submit.prevent="nextTab">
            <v-layout mx-6 pt-6 pb-10 wrap>
              <v-flex xs12>
                <div class="body-2 mb-2">{{ t('homeToken.contract') }}</div>
                <v-text-field
                  :value="customAddress"
                  :rules="[rules.required, duplicateTokenRule, addressValidityRule]"
                  outlined
                  @change="onCustomAddressChange"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <div class="body-2 mb-2">{{ t('homeToken.symbol') }}</div>
                <v-text-field v-model="customSymbol" :rules="[rules.required]" outlined></v-text-field>
              </v-flex>
              <v-flex xs12>
                <div class="body-2 mb-2">{{ t('homeToken.name') }}</div>
                <v-text-field v-model="customName" :rules="[rules.required]" outlined></v-text-field>
              </v-flex>
              <v-flex xs12>
                <div class="body-2 mb-2">{{ t('homeToken.decimal') }}</div>
                <v-text-field v-model="customDecimals" :rules="[rules.required]" type="number" outlined></v-text-field>
              </v-flex>

              <v-flex xs12 mt-15>
                <v-layout mx-n2>
                  <v-flex xs6 px-2>
                    <v-btn block large text @click="closeForm">{{ t('homeToken.cancel') }}</v-btn>
                  </v-flex>
                  <v-flex xs6 px-2>
                    <v-btn block large color="torusBrand1" class="white--text" type="submit" :disabled="!addTokenFormValid">
                      {{ t('homeToken.next') }}
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-form>
        </v-tab-item>
        <v-tab-item>
          <v-layout class="card-header" wrap>
            <v-flex text-center xs12 py-10 px-6>
              <div class="display-1">{{ isHideMode ? t('homeToken.hideTokens') : t('homeToken.addTokens') }}</div>
              <v-btn class="close-btn" icon aria-label="Close Add Token" title="Close Add Token" @click="closeForm">
                <v-icon>$vuetify.icons.close</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
          <v-layout mx-6 pt-6 pb-4 wrap>
            <v-flex xs12>
              <div class="title">{{ isHideMode ? t('homeToken.likeToHideToken') : t('homeToken.likeToAddToken') }}</div>
            </v-flex>
          </v-layout>
          <v-divider></v-divider>
          <v-layout mb-8 mx-6 pt-6 wrap class="align-center">
            <v-flex xs8 mb-3>
              <div class="body-2 font-weight-bold">{{ t('homeToken.token') }}</div>
            </v-flex>
            <v-flex xs4 text-right mb-3>
              <div class="body-2 font-weight-bold">{{ t('homeToken.balance') }}</div>
            </v-flex>
            <v-flex xs8>
              <div class="d-flex align-center">
                <img :src="`${logosUrl}/eth.svg`" class="inline-small d-inline-flex" height="36" />
                <div class="ml-2 body-1">{{ customName }}</div>
              </div>
            </v-flex>
            <v-flex xs4 text-right>
              <div class="body-2">{{ customBalance }}</div>
            </v-flex>
          </v-layout>
          <v-layout v-if="isHideMode" mb-15 mx-6 wrap>
            <v-flex xs12>
              <div class="body-2 text_2--text">{{ t('homeToken.hideTokenDesc') }}</div>
            </v-flex>
          </v-layout>
          <v-layout mx-6 pt-6 pb-10 wrap :class="isHideMode ? '' : 'pt-15'">
            <v-flex xs12>
              <v-layout mx-n2>
                <v-flex xs6 px-2>
                  <v-btn v-if="isHideMode" block large text @click="closeForm">{{ t('homeToken.cancel') }}</v-btn>
                  <v-btn v-else block large text @click="tab = 0">{{ t('homeToken.back') }}</v-btn>
                </v-flex>
                <v-flex xs6 px-2>
                  <v-btn v-if="isHideMode" block large color="torusBrand1" class="white--text" type="button" @click="callDeleteToken">
                    {{ t('homeToken.hideToken') }}
                  </v-btn>
                  <v-btn v-else block large color="torusBrand1" class="white--text" type="button" @click="addToken">
                    {{ t('homeToken.addToken') }}
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-dialog>
</template>

<script>
import BigNumber from 'bignumber.js'
import log from 'loglevel'
import { mapActions, mapState } from 'vuex'

import config from '../../../config'
import TokenHandler from '../../../handlers/Token/TokenHandler'
import torus from '../../../torus'
import { significantDigits, validateContractAddress } from '../../../utils/utils'

export default {
  props: {
    isHideMode: {
      type: Boolean,
      default: false,
    },
    deleteToken: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      tab: 0,
      addTokenDialog: false,
      addTokenFormValid: false,
      customAddress: '',
      customSymbol: '',
      customDecimals: 0,
      customName: '',
      customBalance: '',
      currentToken: undefined,
      isValidAddress: true,
      rules: {
        required: (value) => !!value || this.t('walletSettings.required'),
      },
      logosUrl: config.logosUrl,
    }
  },
  computed: {
    ...mapState(['selectedAddress', 'networkType', 'tokenData']),
    duplicateTokenRule() {
      if (!this.tokenData[this.selectedAddress]) return true
      const found = this.tokenData[this.selectedAddress].find(
        (token) => token.tokenAddress.toLocaleLowerCase() === this.customAddress.toLocaleLowerCase()
      )
      return found ? this.t('homeToken.duplicateToken') : true
    },
    addressValidityRule() {
      if (this.isValidAddress) return true
      return this.t('homeToken.invalidContractAddress')
    },
  },
  mounted() {
    if (this.isHideMode) {
      this.tab = 1
      this.customSymbol = this.deleteToken.symbol
      this.customDecimals = this.deleteToken.decimals
      this.customName = this.deleteToken.name
      this.customBalance = this.deleteToken.formattedBalance
    }
  },
  methods: {
    ...mapActions(['addCustomToken', 'deleteCustomToken']),
    async onCustomAddressChange(value) {
      this.customAddress = value
      // log.debug(await torus.web3.eth.getCode(value))
      this.isValidAddress = await validateContractAddress(torus.web3, value)
      if (this.isValidAddress) {
        try {
          this.currentToken = new TokenHandler({ address: value, web3: torus.web3 })
          const [symbol, name, balance, decimals] = await Promise.all([
            this.currentToken.getSymbol(),
            this.currentToken.getName(),
            this.currentToken.getUserBalance(this.selectedAddress),
            this.currentToken.getDecimals(),
          ])
          const computedBalance = new BigNumber(`0x${balance}`).dividedBy(new BigNumber(10).pow(new BigNumber(decimals))) || new BigNumber(0)

          this.customSymbol = symbol
          this.customDecimals = decimals
          this.customName = name
          this.customBalance = `${significantDigits(computedBalance, false, 3)} ${this.customSymbol}`
        } catch (error) {
          log.error('Error while adding custom token.', error)
        }
      }
    },
    addToken() {
      this.addCustomToken({
        token_address: this.customAddress,
        network: this.networkType.host,
        token_symbol: this.customSymbol,
        token_name: this.customName,
        decimals: this.customDecimals,
      })
      this.closeForm()
    },
    nextTab() {
      if (this.$refs.addTokenForm.validate()) {
        this.tab = 1
      }
    },
    closeForm() {
      if (!this.isHideMode) {
        this.$refs.addTokenForm.reset()
        this.tab = 0
      }
      this.addTokenDialog = false
    },
    callDeleteToken() {
      this.deleteCustomToken(this.deleteToken.customTokenId)
      this.closeForm()
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'EditToken.scss';
</style>
