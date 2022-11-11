<template>
  <v-container class="dapp-parent d-flex flex-column justify-start align-center" :class="$vuetify.breakpoint.xsOnly ? 'xs-parent px-4' : ''">
    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="sendTx">
      <v-card class="swap-container elevation-1 pa-4">
        <div class="font-weight-bold mb-2">Swap</div>
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
              <v-text-field class="swap-amount" :value="toValue" readonly hide-details outlined type="number" @change="toValueChanged"></v-text-field>
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
          <div>Expected Output: {{ toValue }} {{ toToken }}</div>
          <div>Price Impact: {{ priceImpact }} %</div>
          <div>Network Fee: {{ gasFees }} USD</div>
        </div>
        <div v-else-if="!currentSwapQuote && valid">
          <div>Fetching best price</div>
        </div>
        <v-btn class="text-h6 mt-2" color="primary" x-large block type="submit" :loading="sendingTx">Swap</v-btn>
      </v-card>
    </v-form>
  </v-container>
</template>
<script>
import TokenList from '@uniswap/default-token-list'
// import { SwapRouter } from '@uniswap/router-sdk'
import { Percent, Token, TradeType } from '@uniswap/sdk-core'
import { CurrencyAmount, nativeOnChain } from '@uniswap/smart-order-router'
// import { Position } from '@uniswap/v3-sdk'
import BigNum from 'bignumber.js'
import { ethers } from 'ethers'
import log from 'loglevel'
import { mapState } from 'vuex'

import AlphaRouter from '../../plugins/uniswap'
import torus from '../../torus'

export default {
  name: 'WalletDiscover',
  data() {
    return {
      fromValue: 0.01,
      toValue: 0,
      fromToken: '',
      toToken: '',
      rules: {
        required: (v) => !!v || 'Value is required',
      },
      currentSwapQuote: null,
      valid: false,
      priceImpact: 0,
      gasFees: 0,
      sendingTx: false,
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
    ethersProvider() {
      return new ethers.providers.Web3Provider(torus.torusController.provider)
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
      this.getSwapQuote()
    },
    async getSwapQuote() {
      try {
        const valid = this.$refs.form.validate()
        log.info(valid, 'valid')
        log.info('getting swap quote after validation', valid)
        if (!valid) return

        // reset values
        this.currentSwapQuote = null
        this.priceImpact = 0
        this.gasFees = 0

        log.info(this.chainId, 'chainId')
        const fromTokenInstance = this.getTokenInstance(this.fromToken)
        const toTokenInstance = this.getTokenInstance(this.toToken)
        const fromAmount = CurrencyAmount.fromRawAmount(
          fromTokenInstance,
          new BigNum(this.fromValue).multipliedBy(new BigNum(10).pow(new BigNum(fromTokenInstance.decimals))).toString()
        )
        // Do something here
        log.info(torus.torusController.provider)
        const router = new AlphaRouter({ chainId: this.chainId, provider: this.ethersProvider })
        const swapRoute = await router.route(
          fromAmount,
          toTokenInstance,
          TradeType.EXACT_INPUT,
          {
            recipient: this.selectedAddress,
            slippageTolerance: new Percent(5, 100),
            deadline: Math.floor(Date.now() / 1000 + 1800),
            fee: {
              fee: new Percent(1, 100), // use 1% fees
              recipient: '0x3E2a1F4f6b6b5d281Ee9a9B36Bb33F7FBf0614C3',
            },
          },
          {}
        )
        log.info(swapRoute)
        log.info(`Quote Exact In: ${swapRoute.quote.toSignificant()}`)
        log.info(`Gas Adjusted Quote In: ${swapRoute.quoteGasAdjusted.toSignificant()}`)
        log.info(`Gas Used USD: ${swapRoute.estimatedGasUsedUSD.toSignificant()}`)
        this.toValue = swapRoute.quote.toSignificant()
        this.priceImpact = swapRoute.trade.priceImpact.toFixed(2)
        this.gasFees = swapRoute.estimatedGasUsedUSD.toSignificant()
        this.currentSwapQuote = swapRoute
      } catch (error) {
        log.error(error)
      }
    },
    getTokenInstance(symbol) {
      if (symbol === this.nativeToken.symbol) {
        return nativeOnChain(this.chainId)
      }
      const tokenData = TokenList.tokens.find((x) => x.symbol === symbol && x.chainId === this.chainId)
      log.info(TokenList, symbol, tokenData)
      const chainId = Number.parseInt(this.networkType.chainId, 10)
      const tokenInstance = new Token(chainId, tokenData.address, tokenData.decimals, tokenData.symbol, tokenData.name)
      return tokenInstance
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
        gasPrice: this.currentSwapQuote.gasPriceWei.toHexString(),
      }
      log.info(transaction)
      torus.web3.eth.sendTransaction(transaction, (err, txHash) => {
        log.info(err, txHash)
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
