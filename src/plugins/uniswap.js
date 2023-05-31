import { Protocol, SwapRouter } from '@uniswap/router-sdk'
import { TradeType } from '@uniswap/sdk-core'
import { AlphaRouter as AlphaBaseRouter, ChainId, CurrencyAmount, V2_SUPPORTED } from '@uniswap/smart-order-router'
import { DEFAULT_ROUTING_CONFIG_BY_CHAIN } from '@uniswap/smart-order-router/build/module/routers/alpha-router/config'
import { getBestSwapRoute } from '@uniswap/smart-order-router/build/module/routers/alpha-router/functions/best-swap-route'
import { buildTrade } from '@uniswap/smart-order-router/build/module/util/methodParameters'
import BigNumber from 'bignumber.js'
import _ from 'lodash'
import log from 'loglevel'

export function buildSwapMethodParameters(trade, swapConfig) {
  const { recipient, slippageTolerance, deadline, inputTokenPermit, fee } = swapConfig
  return SwapRouter.swapCallParameters(trade, {
    recipient,
    slippageTolerance,
    deadlineOrPreviousBlockhash: deadline,
    inputTokenPermit,
    fee,
  })
}

export default class AlphaRouter extends AlphaBaseRouter {
  async route(amount, quoteCurrency, tradeType, swapConfig, partialRoutingConfig = {}) {
    // Get a block number to specify in all our calls. Ensures data we fetch from chain is
    // from the same block.
    const blockNumber = partialRoutingConfig.blockNumber ?? this.getBlockNumberPromise()

    const routingConfig = _.merge({}, DEFAULT_ROUTING_CONFIG_BY_CHAIN(this.chainId), partialRoutingConfig, { blockNumber })

    const { protocols } = routingConfig

    const currencyIn = tradeType === TradeType.EXACT_INPUT ? amount.currency : quoteCurrency
    const currencyOut = tradeType === TradeType.EXACT_INPUT ? quoteCurrency : amount.currency
    const tokenIn = currencyIn.wrapped
    const tokenOut = currencyOut.wrapped

    // Generate our distribution of amounts, i.e. fractions of the input amount.
    // We will get quotes for fractions of the input amount for different routes, then
    // combine to generate split routes.
    const [percents, amounts] = this.getAmountDistribution(amount, routingConfig)

    // Get an estimate of the gas price to use when estimating gas cost of different routes.

    const { gasPriceWei } = await this.gasPriceProvider.getGasPrice()

    const quoteToken = quoteCurrency.wrapped

    const quotePromises = []

    const protocolsSet = new Set(protocols ?? [])

    const [v3gasModel, mixedRouteGasModel] = await Promise.all([
      this.v3GasModelFactory.buildGasModel({
        chainId: this.chainId,
        gasPriceWei,
        v3poolProvider: this.v3PoolProvider,
        token: quoteToken,
        v2poolProvider: this.v2PoolProvider,
        l2GasDataProvider: this.l2GasDataProvider,
      }),
      this.mixedRouteGasModelFactory.buildGasModel({
        chainId: this.chainId,
        gasPriceWei,
        v3poolProvider: this.v3PoolProvider,
        token: quoteToken,
        v2poolProvider: this.v2PoolProvider,
      }),
    ])

    if ((protocolsSet.size === 0 || (protocolsSet.has(Protocol.V2) && protocolsSet.has(Protocol.V3))) && V2_SUPPORTED.includes(this.chainId)) {
      log.info({ protocols, tradeType }, 'Routing across all protocols')
      quotePromises.push(this.getV3Quotes(tokenIn, tokenOut, amounts, percents, quoteToken, v3gasModel, tradeType, routingConfig))
      quotePromises.push(this.getV2Quotes(tokenIn, tokenOut, amounts, percents, quoteToken, gasPriceWei, tradeType, routingConfig))
      /// @dev only add mixedRoutes in the case where no protocols were specified, and if TradeType is correct
      if (
        tradeType === TradeType.EXACT_INPUT &&
        (this.chainId === ChainId.MAINNET || this.chainId === ChainId.GÖRLI) &&
        /// The cases where protocols = [] and protocols = [V2, V3, MIXED]
        (protocolsSet.size === 0 || protocolsSet.has(Protocol.MIXED))
      ) {
        log.info({ protocols, swapType: tradeType }, 'Routing across MixedRoutes')
        quotePromises.push(this.getMixedRouteQuotes(tokenIn, tokenOut, amounts, percents, quoteToken, mixedRouteGasModel, tradeType, routingConfig))
      }
    } else {
      if (protocolsSet.has(Protocol.V3) || (protocolsSet.size === 0 && !V2_SUPPORTED.includes(this.chainId))) {
        log.info({ protocols, swapType: tradeType }, 'Routing across V3')
        quotePromises.push(this.getV3Quotes(tokenIn, tokenOut, amounts, percents, quoteToken, v3gasModel, tradeType, routingConfig))
      }
      if (protocolsSet.has(Protocol.V2)) {
        log.info({ protocols, swapType: tradeType }, 'Routing across V2')
        quotePromises.push(this.getV2Quotes(tokenIn, tokenOut, amounts, percents, quoteToken, gasPriceWei, tradeType, routingConfig))
      }
      /// If protocolsSet is not empty, and we specify mixedRoutes, consider them if the chain has v2 liq
      /// and tradeType === EXACT_INPUT
      if (
        protocolsSet.has(Protocol.MIXED) &&
        (this.chainId === ChainId.MAINNET || this.chainId === ChainId.GÖRLI) &&
        tradeType === TradeType.EXACT_INPUT
      ) {
        log.info({ protocols, swapType: tradeType }, 'Routing across MixedRoutes')
        quotePromises.push(this.getMixedRouteQuotes(tokenIn, tokenOut, amounts, percents, quoteToken, mixedRouteGasModel, tradeType, routingConfig))
      }
    }

    const routesWithValidQuotesByProtocol = await Promise.all(quotePromises)

    let allRoutesWithValidQuotes = []
    let allCandidatePools = []
    for (const { routesWithValidQuotes, candidatePools } of routesWithValidQuotesByProtocol) {
      allRoutesWithValidQuotes = [...allRoutesWithValidQuotes, ...routesWithValidQuotes]
      allCandidatePools = [...allCandidatePools, candidatePools]
    }

    if (allRoutesWithValidQuotes.length === 0) {
      log.info({ allRoutesWithValidQuotes }, 'Received no valid quotes')
      return null
    }

    // Given all the quotes for all the amounts for all the routes, find the best combination.

    const swapRouteRaw = await getBestSwapRoute(amount, percents, allRoutesWithValidQuotes, tradeType, this.chainId, routingConfig, v3gasModel)

    if (!swapRouteRaw) {
      return null
    }

    const { quote, quoteGasAdjusted, estimatedGasUsed, routes: routeAmounts, estimatedGasUsedQuoteToken, estimatedGasUsedUSD } = swapRouteRaw

    // Build Trade object that represents the optimal swap.
    const trade = buildTrade(currencyIn, currencyOut, tradeType, routeAmounts)

    let methodParameters

    // If user provided recipient, deadline etc. we also generate the calldata required to execute
    // the swap and return it too.
    if (swapConfig) {
      log.info('using swapConfig')
      methodParameters = buildSwapMethodParameters(trade, swapConfig)
    }

    this.emitPoolSelectionMetrics(swapRouteRaw, allCandidatePools)

    const blockNumberFinal = await blockNumber

    const swapRoute = {
      quote,
      quoteGasAdjusted,
      estimatedGasUsed,
      estimatedGasUsedQuoteToken,
      estimatedGasUsedUSD,
      gasPriceWei,
      route: routeAmounts,
      trade,
      methodParameters,
      blockNumber: BigNumber(blockNumberFinal),
    }

    if (swapConfig && swapConfig.simulate && methodParameters && methodParameters.calldata) {
      if (!this.simulator) {
        throw new Error('Simulator not initialized!')
      }
      const { fromAddress } = swapConfig.simulate

      const swapRouteWithSimulation = await this.simulator.simulate(
        fromAddress,
        swapRoute,
        amount,
        // Quote will be in WETH even if quoteCurrency is ETH
        // So we init a new CurrencyAmount object here
        CurrencyAmount.fromRawAmount(quoteCurrency, quote.quotient.toString()),
        this.l2GasDataProvider ? await this.l2GasDataProvider.getGasData() : undefined
      )
      return swapRouteWithSimulation
    }

    return swapRoute
  }
}
