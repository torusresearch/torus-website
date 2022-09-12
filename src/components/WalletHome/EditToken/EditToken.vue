<template>
  <v-dialog v-model="addTokenDialog" max-width="375" persistent>
    <template #activator="{ props }">
      <v-btn v-if="isHideMode" icon size="x-small" v-bind="props">
        <v-icon class="text-white" size="x-small">$close</v-icon>
      </v-btn>
      <v-btn v-else class="text-torusBrand1 text-caption font-weight-medium gtm-add-token-cta" variant="text" height="16" v-bind="props">
        {{ $t('homeToken.addTokenHere') }}
      </v-btn>
    </template>
    <v-card class="add-token">
      <v-window v-model="tab">
        <v-window-item>
          <v-row class="card-header bg-torusBlack2" wrap no-gutters>
            <v-col cols="12" class="py-10 text-center">
              <div class="text-h5 font-weight-bold">{{ isHideMode ? $t('homeToken.hideTokens') : $t('homeToken.addTokens') }}</div>
              <v-btn variant="plain" class="close-btn" icon aria-label="Close Add Token" title="Close Add Token" @click="closeForm">
                <v-icon>$close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-form ref="addTokenForm" v-model="addTokenFormValid" class="fill-height add-token-form" lazy-validation @submit.prevent="nextTab">
            <v-row class="mx-6 pt-6 pb-10" wrap no-gutters>
              <v-col cols="12">
                <div class="body-2 mb-2">{{ $t('homeToken.contract') }}</div>
                <v-text-field
                  :model-value="customAddress"
                  :rules="[rules.required, duplicateTokenRule, addressValidityRule]"
                  variant="outlined"
                  @update:modelValue="onCustomAddressChange"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <div class="body-2 mb-2">{{ $t('homeToken.symbol') }}</div>
                <v-text-field v-model="customSymbol" :rules="[rules.required]" variant="outlined"></v-text-field>
              </v-col>
              <v-col cols="12">
                <div class="body-2 mb-2">{{ $t('homeToken.name') }}</div>
                <v-text-field v-model="customName" :rules="[rules.required]" variant="outlined"></v-text-field>
              </v-col>
              <v-col cols="12">
                <div class="body-2 mb-2">{{ $t('homeToken.decimal') }}</div>
                <v-text-field v-model="customDecimals" :rules="[rules.required]" type="number" variant="outlined"></v-text-field>
              </v-col>

              <v-col cols="12" class="mt-15">
                <v-row class="mx-n2">
                  <v-col cols="6" class="px-2">
                    <v-btn block size="large" variant="text" class="text-body-2" @click="closeForm">{{ $t('homeToken.cancel') }}</v-btn>
                  </v-col>
                  <v-col cols="6" class="px-2">
                    <v-btn block size="large" color="torusBrand1" class="text-body-2 text-white" type="submit" :disabled="!addTokenFormValid">
                      {{ $t('homeToken.next') }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-form>
        </v-window-item>
        <v-window-item>
          <v-row class="card-header" wrap no-gutters>
            <v-col class="text-center py-10 px-6>" cols="12">
              <div class="display-1">{{ isHideMode ? $t('homeToken.hideTokens') : $t('homeToken.addTokens') }}</div>
              <v-btn variant="plain" class="close-btn" icon aria-label="Close Add Token" title="Close Add Token" @click="closeForm">
                <v-icon>$close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row class="mx-6 pt-6 pb-4" wrap>
            <v-col cols="12">
              <div class="title">{{ isHideMode ? $t('homeToken.likeToHideToken') : $t('homeToken.likeToAddToken') }}</div>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row wrap class="align-center mb-8 mx-6 pt-6">
            <v-col cols="8" class="mb-3">
              <div class="body-2 font-weight-bold">{{ $t('homeToken.token') }}</div>
            </v-col>
            <v-col cols="4" class="text-right mb-3">
              <div class="body-2 font-weight-bold">{{ $t('homeToken.balance') }}</div>
            </v-col>
            <v-col cols="8">
              <div class="d-flex align-center">
                <img :src="`${logosUrl}/eth.svg`" class="inline-small d-inline-flex" height="36" />
                <div class="ml-2 body-1">{{ customName }}</div>
              </div>
            </v-col>
            <v-col cols="4" class="text-right">
              <div class="body-2">{{ customBalance }}</div>
            </v-col>
          </v-row>
          <v-row v-if="isHideMode" class="mb-15 mx-6" wrap>
            <v-col cols="12">
              <div class="body-2 text-text_2">{{ $t('homeToken.hideTokenDesc') }}</div>
            </v-col>
          </v-row>
          <v-row class="mx-6 pt-6 pb-10" wrap :class="isHideMode ? '' : 'pt-15'">
            <v-col cols="12">
              <v-row class="mx-n2">
                <v-col cols="6" class="px-2">
                  <v-btn v-if="isHideMode" block size="large" variant="text" @click="closeForm">{{ $t('homeToken.cancel') }}</v-btn>
                  <v-btn v-else block size="large" variant="text" @click="tab = 0">{{ $t('homeToken.back') }}</v-btn>
                </v-col>
                <v-col cols="6" class="px-2">
                  <v-btn v-if="isHideMode" block size="large" color="torusBrand1" class="text-white" type="button" @click="callDeleteToken">
                    {{ $t('homeToken.hideToken') }}
                  </v-btn>
                  <v-btn v-else block size="large" color="torusBrand1" class="text-white" type="button" @click="addToken">
                    {{ $t('homeToken.addToken') }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-window-item>
      </v-window>
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
        required: (value) => !!value || this.$t('walletSettings.required'),
      },
      logosUrl: config.logosUrl,
    }
  },
  computed: {
    ...mapState(['selectedAddress', 'networkType', 'tokenData']),
    duplicateTokenRule() {
      if (!this.tokenData[this.selectedAddress]) return true
      const found = this.tokenData[this.selectedAddress].find(
        (token) => token.tokenAddress.toLocaleLowerCase() === this.customAddress?.toLocaleLowerCase()
      )
      return found ? this.$t('homeToken.duplicateToken') : true
    },
    addressValidityRule() {
      if (this.isValidAddress) return true
      return this.$t('homeToken.invalidContractAddress')
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
      this.isValidAddress = await validateContractAddress(torus.web3, this.customAddress, this.$store.state.networkId)
      if (this.isValidAddress) {
        try {
          this.currentToken = new TokenHandler({ address: this.customAddress.toLowerCase(), web3: torus.web3 })
          const [symbol, name, balance, decimals] = await Promise.all([
            this.currentToken.getSymbol(),
            this.currentToken.getName(),
            this.currentToken.getUserBalance(this.selectedAddress.toLowerCase()),
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
