<template>
  <v-container class="dapp-parent d-flex flex-column justify-start align-center" :class="$vuetify.breakpoint.xsOnly ? 'xs-parent px-4' : ''">
    <v-form v-model="valid">
      <div class="body-2 mb-2">From Token</div>
      <span>
        <v-text-field :value="fromValue" required type="number" @change="fromValueChanged" />
        <v-combobox :value="fromToken" :items="tokenSymbols" required @change="fromTokenChanged" />
      </span>
      <div class="body-2 mb-2">To Token</div>
      <span>
        <v-text-field :value="toValue" type="number" @change="toValueChanged" />
        <v-combobox :value="toToken" :items="tokenSymbols" required @input="toTokenChanged" />
      </span>
      <div>
        <v-btn @click="sendTx">Submit</v-btn>
      </div>
    </v-form>
  </v-container>
</template>
<script>
import TokenList from '@uniswap/default-token-list'
// import { SwapRouter } from '@uniswap/router-sdk'
import { Percent, Token, TradeType } from '@uniswap/sdk-core'
import { AlphaRouter, CurrencyAmount, nativeOnChain } from '@uniswap/smart-order-router'
// import { Position } from '@uniswap/v3-sdk'
import BigNum from 'bignumber.js'
import { ethers } from 'ethers'
import log from 'loglevel'
import { mapState } from 'vuex'

import torus from '../../torus'

export default {
  name: 'WalletDiscover',
  data() {
    return {
      fromValue: 0.01,
      toValue: 0,
      fromToken: 'MATIC',
      toToken: 'USDC',
      valueRules: [(v) => !!v || 'Value is required'],
      swapQuote: null,
      valid: true,
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
    this.getSwapQuote()
  },
  methods: {
    fromTokenChanged(value) {
      log.info('fromTokenChanged', value)
      this.fromToken = value
      this.getSwapQuote()
    },
    toTokenChanged(value) {
      log.info('toTokenChanged', value)
      this.toToken = value
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
      log.info('getSwapQuote')
      if (!this.fromToken || !this.toToken || !this.fromValue) {
        return
      }

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
      // router.buildSwapAndAddMethodParameters = async function (trade, swapAndAddOptions, swapAndAddParameters) {
      //   const {
      //     swapOptions: { recipient, slippageTolerance, deadline, inputTokenPermit },
      //     addLiquidityOptions: addLiquidityConfig,
      //   } = swapAndAddOptions
      //   const { preLiquidityPosition } = swapAndAddParameters
      //   const finalBalanceTokenIn = swapAndAddParameters.initialBalanceTokenIn.subtract(trade.inputAmount)
      //   const finalBalanceTokenOut = swapAndAddParameters.initialBalanceTokenOut.add(trade.outputAmount)
      //   const approvalTypes = await this.swapRouterProvider.getApprovalType(finalBalanceTokenIn, finalBalanceTokenOut)
      //   const zeroForOne = finalBalanceTokenIn.currency.wrapped.sortsBefore(finalBalanceTokenOut.currency.wrapped)
      //   return SwapRouter.swapAndAddCallParameters(
      //     trade,
      //     {
      //       recipient,
      //       slippageTolerance,
      //       deadlineOrPreviousBlockhash: deadline,
      //       inputTokenPermit,
      //       fee: {
      //         fee: new Percent(50),
      //         recipient: '0x3E2a1F4f6b6b5d281Ee9a9B36Bb33F7FBf0614C3',
      //       },
      //     },
      //     Position.fromAmounts({
      //       pool: preLiquidityPosition.pool,
      //       tickLower: preLiquidityPosition.tickLower,
      //       tickUpper: preLiquidityPosition.tickUpper,
      //       amount0: zeroForOne ? finalBalanceTokenIn.quotient.toString() : finalBalanceTokenOut.quotient.toString(),
      //       amount1: zeroForOne ? finalBalanceTokenOut.quotient.toString() : finalBalanceTokenIn.quotient.toString(),
      //       useFullPrecision: false,
      //     }),
      //     addLiquidityConfig,
      //     approvalTypes.approvalTokenIn,
      //     approvalTypes.approvalTokenOut
      //   )
      // }.bind(router)
      const swapRoute = await router.route(
        fromAmount,
        toTokenInstance,
        TradeType.EXACT_INPUT,
        {
          recipient: this.selectedAddress,
          slippageTolerance: new Percent(5, 100),
          deadline: Math.floor(Date.now() / 1000 + 1800),
        },
        {
          maxSwapsPerPath: 10,
        }
      )
      log.info(swapRoute)
      log.info(`Quote Exact In: ${swapRoute.quote.toFixed(2)}`)
      log.info(`Gas Adjusted Quote In: ${swapRoute.quoteGasAdjusted.toFixed(2)}`)
      log.info(`Gas Used USD: ${swapRoute.estimatedGasUsedUSD.toFixed(6)}`)
      this.toValue = swapRoute.quote.toFixed(2)
      this.currentSwapQuote = swapRoute
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
      const transaction = {
        data: this.currentSwapQuote.methodParameters.calldata,
        to: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
        value: this.currentSwapQuote.methodParameters.value,
        from: this.selectedAddress,
        gasPrice: this.currentSwapQuote.gasPriceWei.toHexString(),
      }
      log.info(transaction)
      await torus.web3.eth.sendTransaction(transaction)
    },
  },
}
</script>
<style lang="scss" scoped>
@import 'WalletSwap.scss';
</style>
