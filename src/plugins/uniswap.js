import { SwapRouter as SwapRouter02 } from '@uniswap/router-sdk'
import { TradeType } from '@uniswap/sdk-core'
import {
  AlphaRouter as AlphaBaseRouter,
  CachedRoutes,
  CacheMode,
  CurrencyAmount,
  metric,
  MetricLoggerUnit,
  SWAP_ROUTER_02_ADDRESSES,
  SwapType,
} from '@uniswap/smart-order-router'
import { DEFAULT_ROUTING_CONFIG_BY_CHAIN } from '@uniswap/smart-order-router/build/module/routers/alpha-router/config'
import { buildTrade } from '@uniswap/smart-order-router/build/module/util/methodParameters'
import { SwapRouter as UniversalRouter, UNIVERSAL_ROUTER_ADDRESS } from '@uniswap/universal-router-sdk'
import BigNumber from 'bignumber.js'
import { merge } from 'lodash'
import log from 'loglevel'

export function buildSwapMethodParameters(trade, swapConfig, chainId) {
  if (swapConfig.type === SwapType.UNIVERSAL_ROUTER) {
    return {
      ...UniversalRouter.swapERC20CallParameters(trade, swapConfig),
      to: UNIVERSAL_ROUTER_ADDRESS(chainId),
    }
  }
  if (swapConfig.type === SwapType.SWAP_ROUTER_02) {
    const { recipient, slippageTolerance, deadline, inputTokenPermit, fee } = swapConfig

    return {
      ...SwapRouter02.swapCallParameters(trade, {
        recipient,
        slippageTolerance,
        deadlineOrPreviousBlockhash: deadline,
        inputTokenPermit,
        fee,
      }),
      to: SWAP_ROUTER_02_ADDRESSES(chainId),
    }
  }

  throw new Error(`Unsupported swap type ${JSON.stringify(swapConfig)}`)
}

export default class AlphaRouter extends AlphaBaseRouter {
  async route(amount, quoteCurrency, tradeType, swapConfig, partialRoutingConfig = {}) {
    const { currencyIn, currencyOut } = this.determineCurrencyInOutFromTradeType(tradeType, amount, quoteCurrency)

    const tokenIn = currencyIn.wrapped
    const tokenOut = currencyOut.wrapped

    metric.setProperty('chainId', this.chainId)
    metric.setProperty('pair', `${tokenIn.symbol}/${tokenOut.symbol}`)
    metric.setProperty('tokenIn', tokenIn.address)
    metric.setProperty('tokenOut', tokenOut.address)
    metric.setProperty('tradeType', tradeType === TradeType.EXACT_INPUT ? 'ExactIn' : 'ExactOut')

    metric.putMetric(`QuoteRequestedForChain${this.chainId}`, 1, MetricLoggerUnit.Count)

    // Get a block number to specify in all our calls. Ensures data we fetch from chain is
    // from the same block.
    const blockNumber = partialRoutingConfig.blockNumber ?? this.getBlockNumberPromise()

    const routingConfig = merge({}, DEFAULT_ROUTING_CONFIG_BY_CHAIN(this.chainId), partialRoutingConfig, { blockNumber })

    const gasPriceWei = await this.getGasPriceWei()

    const quoteToken = quoteCurrency.wrapped

    const [v3GasModel, mixedRouteGasModel] = await this.getGasModels(gasPriceWei, amount.currency.wrapped, quoteToken)

    // Create a Set to sanitize the protocols input, a Set of undefined becomes an empty set,
    // Then create an Array from the values of that Set.
    const protocols = [...new Set(routingConfig.protocols).values()]

    const cacheMode = await this.routeCachingProvider?.getCacheMode(this.chainId, amount, quoteToken, tradeType, protocols)

    // Fetch CachedRoutes
    let cachedRoutes
    if (cacheMode !== CacheMode.Darkmode) {
      cachedRoutes = await this.routeCachingProvider?.getCachedRoute(this.chainId, amount, quoteToken, tradeType, protocols, await blockNumber)
    }

    if (cacheMode && cacheMode !== CacheMode.Darkmode && !cachedRoutes) {
      metric.putMetric(`GetCachedRoute_miss_${cacheMode}`, 1, MetricLoggerUnit.Count)
      log.info(
        {
          tokenIn: tokenIn.symbol,
          tokenInAddress: tokenIn.address,
          tokenOut: tokenOut.symbol,
          tokenOutAddress: tokenOut.address,
          cacheMode,
          amount: amount.toExact(),
          chainId: this.chainId,
          tradeType: this.tradeTypeStr(tradeType),
        },
        `GetCachedRoute miss ${cacheMode} for ${this.tokenPairSymbolTradeTypeChainId(tokenIn, tokenOut, tradeType)}`
      )
    } else if (cachedRoutes) {
      metric.putMetric(`GetCachedRoute_hit_${cacheMode}`, 1, MetricLoggerUnit.Count)
      log.info(
        {
          tokenIn: tokenIn.symbol,
          tokenInAddress: tokenIn.address,
          tokenOut: tokenOut.symbol,
          tokenOutAddress: tokenOut.address,
          cacheMode,
          amount: amount.toExact(),
          chainId: this.chainId,
          tradeType: this.tradeTypeStr(tradeType),
        },
        `GetCachedRoute hit ${cacheMode} for ${this.tokenPairSymbolTradeTypeChainId(tokenIn, tokenOut, tradeType)}`
      )
    }

    let swapRouteFromCachePromise = Promise.resolve(null)
    if (cachedRoutes) {
      swapRouteFromCachePromise = this.getSwapRouteFromCache(
        cachedRoutes,
        await blockNumber,
        amount,
        quoteToken,
        tradeType,
        routingConfig,
        v3GasModel,
        mixedRouteGasModel,
        gasPriceWei
      )
    }

    let swapRouteFromChainPromise = Promise.resolve(null)
    if (!cachedRoutes || cacheMode !== CacheMode.Livemode) {
      swapRouteFromChainPromise = this.getSwapRouteFromChain(
        amount,
        tokenIn,
        tokenOut,
        protocols,
        quoteToken,
        tradeType,
        routingConfig,
        v3GasModel,
        mixedRouteGasModel,
        gasPriceWei
      )
    }

    const [swapRouteFromCache, swapRouteFromChain] = await Promise.all([swapRouteFromCachePromise, swapRouteFromChainPromise])

    let swapRouteRaw
    if (cacheMode === CacheMode.Livemode && swapRouteFromCache) {
      log.info(`CacheMode is ${cacheMode}, and we are using swapRoute from cache`)
      swapRouteRaw = swapRouteFromCache
    } else {
      log.info(`CacheMode is ${cacheMode}, and we are using materialized swapRoute`)
      swapRouteRaw = swapRouteFromChain
    }

    if (cacheMode === CacheMode.Tapcompare && swapRouteFromCache && swapRouteFromChain) {
      const quoteDiff = swapRouteFromChain.quote.subtract(swapRouteFromCache.quote)
      const quoteGasAdjustedDiff = swapRouteFromChain.quoteGasAdjusted.subtract(swapRouteFromCache.quoteGasAdjusted)
      const gasUsedDiff = swapRouteFromChain.estimatedGasUsed.sub(swapRouteFromCache.estimatedGasUsed)

      // Only log if quoteDiff is different from 0, or if quoteGasAdjustedDiff and gasUsedDiff are both different from 0
      if (!quoteDiff.equalTo(0) || !(quoteGasAdjustedDiff.equalTo(0) || gasUsedDiff.eq(0))) {
        // Calculates the percentage of the difference with respect to the quoteFromChain (not from cache)
        const misquotePercent = quoteGasAdjustedDiff.divide(swapRouteFromChain.quoteGasAdjusted).multiply(100)

        metric.putMetric('TapcompareCachedRoute_quoteGasAdjustedDiffPercent', Number(misquotePercent.toExact()), MetricLoggerUnit.Percent)

        log.warn(
          {
            quoteFromChain: swapRouteFromChain.quote.toExact(),
            quoteFromCache: swapRouteFromCache.quote.toExact(),
            quoteDiff: quoteDiff.toExact(),
            quoteGasAdjustedFromChain: swapRouteFromChain.quoteGasAdjusted.toExact(),
            quoteGasAdjustedFromCache: swapRouteFromCache.quoteGasAdjusted.toExact(),
            quoteGasAdjustedDiff: quoteGasAdjustedDiff.toExact(),
            gasUsedFromChain: swapRouteFromChain.estimatedGasUsed.toString(),
            gasUsedFromCache: swapRouteFromCache.estimatedGasUsed.toString(),
            gasUsedDiff: gasUsedDiff.toString(),
            routesFromChain: swapRouteFromChain.routes.toString(),
            routesFromCache: swapRouteFromCache.routes.toString(),
            amount: amount.toExact(),
            originalAmount: cachedRoutes?.originalAmount,
            pair: this.tokenPairSymbolTradeTypeChainId(tokenIn, tokenOut, tradeType),
            blockNumber,
          },
          `Comparing quotes between Chain and Cache for ${this.tokenPairSymbolTradeTypeChainId(tokenIn, tokenOut, tradeType)}`
        )
      }
    }

    if (!swapRouteRaw) {
      return null
    }

    const { quote, quoteGasAdjusted, estimatedGasUsed, routes: routeAmounts, estimatedGasUsedQuoteToken, estimatedGasUsedUSD } = swapRouteRaw

    if (this.routeCachingProvider && cacheMode !== CacheMode.Darkmode && swapRouteFromChain) {
      // Generate the object to be cached
      const routesToCache = CachedRoutes.fromRoutesWithValidQuotes(
        swapRouteFromChain.routes,
        this.chainId,
        tokenIn,
        tokenOut,
        protocols.sort(), // sort it for consistency in the order of the protocols.
        await blockNumber,
        tradeType,
        amount.toExact()
      )

      if (routesToCache) {
        // Attempt to insert the entry in cache. This is fire and forget promise.
        // The catch method will prevent any exception from blocking the normal code execution.
        this.routeCachingProvider
          .setCachedRoute(routesToCache, amount)
          .then((success) => {
            const status = success ? 'success' : 'rejected'
            metric.putMetric(`SetCachedRoute_${status}`, 1, MetricLoggerUnit.Count)
          })
          .catch((error) => {
            log.error(
              {
                reason: error,
                tokenPair: this.tokenPairSymbolTradeTypeChainId(tokenIn, tokenOut, tradeType),
              },
              'SetCachedRoute failure'
            )

            metric.putMetric('SetCachedRoute_failure', 1, MetricLoggerUnit.Count)
          })
      }
    }

    metric.putMetric(`QuoteFoundForChain${this.chainId}`, 1, MetricLoggerUnit.Count)

    // Build Trade object that represents the optimal swap.
    const trade = buildTrade(currencyIn, currencyOut, tradeType, routeAmounts)

    let methodParameters

    // If user provided recipient, deadline etc. we also generate the calldata required to execute
    // the swap and return it too.
    if (swapConfig) {
      methodParameters = buildSwapMethodParameters(trade, swapConfig, this.chainId)
    }

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
      blockNumber: new BigNumber(await blockNumber),
    }

    if (swapConfig && swapConfig.simulate && methodParameters && methodParameters.calldata) {
      if (!this.simulator) {
        throw new Error('Simulator not initialized!')
      }
      log.info({ swapConfig, methodParameters }, 'Starting simulation')
      const { fromAddress } = swapConfig.simulate
      const beforeSimulate = Date.now()
      const swapRouteWithSimulation = await this.simulator.simulate(
        fromAddress,
        swapConfig,
        swapRoute,
        amount,
        // Quote will be in WETH even if quoteCurrency is ETH
        // So we init a new CurrencyAmount object here
        CurrencyAmount.fromRawAmount(quoteCurrency, quote.quotient.toString()),
        this.l2GasDataProvider ? await this.l2GasDataProvider.getGasData() : undefined,
        { blockNumber }
      )
      metric.putMetric('SimulateTransaction', Date.now() - beforeSimulate, MetricLoggerUnit.Milliseconds)
      return swapRouteWithSimulation
    }

    return swapRoute
  }
}
