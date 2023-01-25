<template>
  <v-container class="dapp-parent d-flex flex-column justify-start align-center pt-6" :class="$vuetify.breakpoint.xsOnly ? 'xs-parent px-4' : ''">
    <NetworkDisplay :store-network-type="networkType" :is-network-pill="true" />
    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="sendTx">
      <v-card class="swap-container elevation-1 pa-4">
        <div class="font-weight-bold mb-2">{{ t('walletSwap.swap') }}</div>
        <v-card flat outlined class="mb-2 pa-1">
          <v-row class="align-center" no-gutters>
            <v-col>
              <v-text-field
                class="swap-amount"
                :value="fromValue"
                hide-details
                outlined
                type="number"
                :rules="[rules.required]"
                @change="fromValueChanged"
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-combobox
                :value="fromToken"
                class="swap-token"
                flat
                outlined
                hide-details
                solo
                :items="tokenList"
                item-text="symbol"
                item-value="symbol"
                :rules="[rules.required]"
                @change="fromTokenChanged"
              ></v-combobox>
            </v-col>
          </v-row>
        </v-card>
        <v-card flat outlined class="pa-1 mb-4">
          <v-row class="align-center" no-gutters>
            <v-col>
              <v-text-field class="swap-amount" :value="toValue" hide-details outlined type="number" @change="toValueChanged" />
            </v-col>
            <v-col cols="3">
              <v-combobox
                :value="toToken"
                class="swap-token"
                flat
                outlined
                hide-details
                solo
                :items="tokenList"
                item-text="symbol"
                item-value="symbol"
                :rules="[rules.required]"
                @change="toTokenChanged"
              ></v-combobox>
            </v-col>
          </v-row>
        </v-card>
        <div v-if="!!currentSwapQuote">
          <div>{{ t('walletSwap.expectedOutput') }}: {{ toValue }} {{ toToken }}</div>
          <div>{{ t('walletSwap.priceImpact') }}: {{ priceImpact }} %</div>
          <div>{{ t('walletSwap.networkFee') }}: {{ gasFees }} USD</div>
        </div>
        <div v-else-if="!currentSwapQuote && valid && fetchingQuote">
          <div>{{ t('walletSwap.fetching') }}</div>
        </div>
        <v-btn class="text-h6 mt-2" color="primary" x-large block type="submit" :disabled="!currentSwapQuote" :loading="sendingTx">
          {{ t('walletSwap.swap') }}
        </v-btn>
      </v-card>
    </v-form>
    <v-dialog v-model="messageModalShow" max-width="375" persistent>
      <MessageModal
        :detail-text="messageModalDetails"
        :modal-type="messageModalType"
        :title="messageModalTitle"
        :no-close="messageModalType === MESSAGE_MODAL_TYPE_SUCCESS"
        @onClose="messageModalShow = false"
      >
        <template v-if="messageModalType === MESSAGE_MODAL_TYPE_SUCCESS" #link>
          <div class="mb-4">
            <v-btn text class="share-btn" :href="etherscanLink" target="_blank">
              <span class="body-2 font-weight-bold">{{ t('walletSwap.viewEtherscan') }}</span>
            </v-btn>
          </div>
        </template>
      </MessageModal>
    </v-dialog>
  </v-container>
</template>
<script>
import TokenList from '@uniswap/default-token-list'
import { Percent, Token, TradeType } from '@uniswap/sdk-core'
import { CurrencyAmount, nativeOnChain } from '@uniswap/smart-order-router'
import BigNum from 'bignumber.js'
import { ethers } from 'ethers'
import log from 'loglevel'
import { mapState } from 'vuex'

import NetworkDisplay from '../../components/helpers/NetworkDisplay/NetworkDisplay.vue'
import MessageModal from '../../components/WalletTransfer/MessageModal'
import AlphaRouter from '../../plugins/uniswap'
import torus from '../../torus'
import { MESSAGE_MODAL_TYPE_FAIL, MESSAGE_MODAL_TYPE_SUCCESS } from '../../utils/enums'
import { getEtherScanHashLink } from '../../utils/utils'

export default {
  name: 'WalletDiscover',
  components: { MessageModal, NetworkDisplay },
  data() {
    return {
      fromValue: 0.01,
      toValue: 0,
      fromToken: '',
      toToken: '',
      rules: {
        required: (v) => !!v || this.t('walletSwap.valueRequired'),
      },
      currentSwapQuote: null,
      valid: false,
      priceImpact: 0,
      gasFees: 0,
      sendingTx: false,
      messageModalShow: false,
      messageModalType: '',
      messageModalTitle: '',
      messageModalDetails: '',
      MESSAGE_MODAL_TYPE_SUCCESS,
      etherscanLink: '',
      fetchingQuote: false,
    }
  },
  computed: {
    ...mapState({
      networkType: 'networkType',
      selectedAddress: 'selectedAddress',
    }),
    chainId() {
      return Number.parseInt(this.networkType.chainId, 10)
    },
    nativeToken() {
      return {
        chainId: this.chainId,
        name: this.networkType.tickerName,
        symbol: this.networkType.ticker,
        logoURI: this.networkType.logo,
        decimals: this.networkType.decimals || 18,
      }
    },
    tokenList() {
      return [this.nativeToken, ...TokenList.tokens.filter((x) => x.chainId === this.chainId)]
    },
    tokenSymbols() {
      return this.tokenList.map((x) => x.symbol)
    },
  },
  async mounted() {
    this.fromToken = this.nativeToken.symbol
    this.getSwapQuote()
  },
  methods: {
    fromTokenChanged(value) {
      log.info('fromTokenChanged', value)
      this.fromToken = value.symbol
      this.getSwapQuote()
    },
    toTokenChanged(value) {
      log.info('toTokenChanged', value)
      this.toToken = value.symbol
      this.getSwapQuote()
    },
    fromValueChanged(value) {
      this.fromValue = value
      this.getSwapQuote()
    },
    toValueChanged(value) {
      this.toValue = value
      this.getSwapQuote(true)
    },
    async getSwapQuote(reverse = false) {
      try {
        const valid = this.$refs.form.validate()
        log.info(valid, 'valid')
        log.info('getting swap quote after validation', valid)
        if (!valid) return

        // reset values
        this.fetchingQuote = true
        this.currentSwapQuote = null
        this.priceImpact = 0
        this.gasFees = 0

        log.info(this.chainId, 'chainId')
        let swapParams = []
        if (reverse) {
          const toCurrencyAmount = this.getCurrencyAmount(this.toValue, this.toToken)
          const fromTokenInstance = this.getTokenInstance(this.fromToken)
          swapParams = [toCurrencyAmount, fromTokenInstance, TradeType.EXACT_OUTPUT]
        } else {
          const fromCurrencyAmount = this.getCurrencyAmount(this.fromValue, this.fromToken)
          const toTokenInstance = this.getTokenInstance(this.toToken)
          swapParams = [fromCurrencyAmount, toTokenInstance, TradeType.EXACT_INPUT]
        }

        log.info(torus.torusController.provider)
        const router = new AlphaRouter({ chainId: this.chainId, provider: new ethers.providers.Web3Provider(torus.torusController.provider) })
        const swapRoute = await router.route(
          ...swapParams,
          {
            recipient: this.selectedAddress,
            slippageTolerance: new Percent(5, 100),
            deadline: Math.floor(Date.now() / 1000 + 1800),
            fee: {
              fee: new Percent(1, 100), // use 1% fees
              // TODO: change addr
              recipient: '0x3E2a1F4f6b6b5d281Ee9a9B36Bb33F7FBf0614C3',
            },
          },
          {}
        )
        log.info(swapRoute)
        log.info(`Quote Exact In: ${swapRoute.quote.toSignificant()}`)
        log.info(`Gas Adjusted Quote In: ${swapRoute.quoteGasAdjusted.toSignificant()}`)
        log.info(`Gas Used USD: ${swapRoute.estimatedGasUsedUSD.toSignificant()}`)
        if (reverse) {
          this.fromValue = swapRoute.quote.toSignificant()
        } else {
          this.toValue = swapRoute.quote.toSignificant()
        }
        this.priceImpact = swapRoute.trade.priceImpact.toFixed(2)
        this.gasFees = swapRoute.estimatedGasUsedUSD.toSignificant()
        this.currentSwapQuote = {
          methodParameters: {
            calldata: swapRoute.methodParameters.calldata,
            value: swapRoute.methodParameters.value,
          },
          gasPriceWei: swapRoute.gasPriceWei.toHexString(),
        }
      } catch (error) {
        log.error(error)
      } finally {
        this.fetchingQuote = false
      }
    },
    getTokenInstance(symbol) {
      if (symbol === this.nativeToken.symbol) {
        return nativeOnChain(this.chainId)
      }
      const tokenData = TokenList.tokens.find((x) => x.symbol === symbol && x.chainId === this.chainId)
      log.info(symbol, tokenData)
      const tokenInstance = new Token(this.chainId, tokenData.address, tokenData.decimals, tokenData.symbol, tokenData.name)
      return tokenInstance
    },
    getCurrencyAmount(value, token) {
      const tokenInstance = this.getTokenInstance(token)
      return CurrencyAmount.fromRawAmount(
        tokenInstance,
        new BigNum(value).multipliedBy(new BigNum(10).pow(new BigNum(tokenInstance.decimals))).toString()
      )
    },
    async sendTx() {
      log.info('sendTx')
      if (!this.currentSwapQuote) {
        return
      }
      this.sendingTx = true
      const transaction = {
        data: this.currentSwapQuote.methodParameters.calldata,
        to: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
        value: this.currentSwapQuote.methodParameters.value,
        from: this.selectedAddress,
        gasPrice: this.currentSwapQuote.gasPriceWei,
      }
      log.info(transaction)
      torus.web3.eth.sendTransaction(transaction, (err, txHash) => {
        log.info(err, txHash)
        if (err) {
          this.messageModalShow = true
          this.messageModalType = MESSAGE_MODAL_TYPE_FAIL
          this.messageModalTitle = this.t('walletSwap.swapFailTitle')
          this.messageModalDetails = this.t('walletSwap.swapFailMessage')
        } else {
          this.messageModalShow = true
          this.messageModalType = MESSAGE_MODAL_TYPE_SUCCESS
          this.messageModalTitle = this.t('walletSwap.swapSuccessTitle')
          this.messageModalDetails = ''
          this.etherscanLink = getEtherScanHashLink(txHash, this.networkType.host)
        }
        this.sendingTx = false
        // TODO: Handle error and success
        // Maybe show tx success modal in etherscan
        // Do correct etherscan url depending on chainId from wallet transfer page
      })
    },
  },
}
</script>
<style lang="scss" scoped>
@import 'WalletSwap.scss';
</style>
