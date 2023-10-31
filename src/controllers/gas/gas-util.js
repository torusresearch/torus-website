import BigNumber from 'bignumber.js'
import BN from 'bn.js'

import { decGWEIToHexWEI, hexWEIToDecGWEI } from '../../utils/conversionUtils'
import { get } from '../../utils/httpHelpers'

export function normalizeGWEIDecimalNumbers(n) {
  const numberAsWEIHex = decGWEIToHexWEI(n)
  const numberAsGWEI = hexWEIToDecGWEI(numberAsWEIHex)
  return numberAsGWEI
}

export async function fetchGasEstimates(url) {
  const estimates = await get(url)
  const normalizedEstimates = {
    estimatedBaseFee: normalizeGWEIDecimalNumbers(estimates.estimatedBaseFee),
    low: {
      ...estimates.low,
      suggestedMaxPriorityFeePerGas: normalizeGWEIDecimalNumbers(estimates.low.suggestedMaxPriorityFeePerGas),
      suggestedMaxFeePerGas: normalizeGWEIDecimalNumbers(estimates.low.suggestedMaxFeePerGas),
    },
    medium: {
      ...estimates.medium,
      suggestedMaxPriorityFeePerGas: normalizeGWEIDecimalNumbers(estimates.medium.suggestedMaxPriorityFeePerGas),
      suggestedMaxFeePerGas: normalizeGWEIDecimalNumbers(estimates.medium.suggestedMaxFeePerGas),
    },
    high: {
      ...estimates.high,
      suggestedMaxPriorityFeePerGas: normalizeGWEIDecimalNumbers(estimates.high.suggestedMaxPriorityFeePerGas),
      suggestedMaxFeePerGas: normalizeGWEIDecimalNumbers(estimates.high.suggestedMaxFeePerGas),
    },
  }
  return normalizedEstimates
}

export async function fetchGasEstimatesViaEthFeeHistory(ethQuery) {
  const noOfBlocks = 10
  const newestBlock = 'latest'
  // get the 10, 50 and 95th percentile of the tip fees from the last 10 blocks
  const percentileValues = [10, 50, 95]
  const feeHistory = await ethQuery.sendAsync({
    method: 'eth_feeHistory',
    params: [noOfBlocks, newestBlock, percentileValues],
  })
  // this is in hex wei
  const finalBaseFeePerGas = feeHistory.baseFeePerGas.at(-1)
  // this is in hex wei
  const priorityFeeCalcs = feeHistory.reward.reduce(
    (acc, curr) => ({
      slow: acc.slow.plus(new BigNumber(curr[0], 16)),
      average: acc.average.plus(new BigNumber(curr[1], 16)),
      fast: acc.fast.plus(new BigNumber(curr[2], 16)),
    }),
    { slow: new BigNumber(0), average: new BigNumber(0), fast: new BigNumber(0) }
  )
  return {
    estimatedBaseFee: hexWEIToDecGWEI(finalBaseFeePerGas).toString(10),
    high: {
      maxWaitTimeEstimate: 30_000,
      minWaitTimeEstimate: 15_000,
      suggestedMaxFeePerGas: hexWEIToDecGWEI(priorityFeeCalcs.fast.plus(finalBaseFeePerGas).toString(16)).toString(),
      suggestedMaxPriorityFeePerGas: hexWEIToDecGWEI(priorityFeeCalcs.fast.toString(16)).toString(),
    },
    medium: {
      maxWaitTimeEstimate: 45_000,
      minWaitTimeEstimate: 15_000,
      suggestedMaxFeePerGas: hexWEIToDecGWEI(priorityFeeCalcs.average.plus(finalBaseFeePerGas).toString(16)).toString(),
      suggestedMaxPriorityFeePerGas: hexWEIToDecGWEI(priorityFeeCalcs.average.toString(16)).toString(),
    },
    low: {
      maxWaitTimeEstimate: 60_000,
      minWaitTimeEstimate: 15_000,
      suggestedMaxFeePerGas: hexWEIToDecGWEI(priorityFeeCalcs.slow.plus(finalBaseFeePerGas).toString(16)).toString(),
      suggestedMaxPriorityFeePerGas: hexWEIToDecGWEI(priorityFeeCalcs.slow.toString(16)).toString(),
    },
  }
}

/**
 * Hit the legacy MetaSwaps gasPrices estimate api and return the low, medium
 * high values from that API.
 */
export async function fetchLegacyGasPriceEstimates(url) {
  const result = await get(url, {
    referrer: url,
    referrerPolicy: 'no-referrer-when-downgrade',
    method: 'GET',
    mode: 'cors',
  })
  return {
    low: result.SafeGasPrice,
    medium: result.ProposeGasPrice,
    high: result.FastGasPrice,
  }
}

export async function fetchEthGasPriceEstimate(ethQuery) {
  const gasPrice = await ethQuery.gasPrice()
  return {
    gasPrice: hexWEIToDecGWEI(gasPrice).toString(),
  }
}

export function calculateTimeEstimate(maxPriorityFeePerGas, maxFeePerGas, gasFeeEstimates) {
  const { low, medium, high, estimatedBaseFee } = gasFeeEstimates

  const maxPriorityFeePerGasInWEI = new BN(decGWEIToHexWEI(maxPriorityFeePerGas), 16)
  const maxFeePerGasInWEI = new BN(decGWEIToHexWEI(maxFeePerGas), 16)
  const estimatedBaseFeeInWEI = new BN(decGWEIToHexWEI(estimatedBaseFee), 16)

  const effectiveMaxPriorityFee = BN.min(maxPriorityFeePerGasInWEI, maxFeePerGasInWEI.sub(estimatedBaseFeeInWEI))

  const lowMaxPriorityFeeInWEI = new BN(decGWEIToHexWEI(low.suggestedMaxPriorityFeePerGas), 16)
  const mediumMaxPriorityFeeInWEI = new BN(decGWEIToHexWEI(medium.suggestedMaxPriorityFeePerGas), 16)
  const highMaxPriorityFeeInWEI = new BN(decGWEIToHexWEI(high.suggestedMaxPriorityFeePerGas), 16)

  let lowerTimeBound
  let upperTimeBound

  if (effectiveMaxPriorityFee.lt(lowMaxPriorityFeeInWEI)) {
    lowerTimeBound = null
    upperTimeBound = 'unknown'
  } else if (effectiveMaxPriorityFee.gte(lowMaxPriorityFeeInWEI) && effectiveMaxPriorityFee.lt(mediumMaxPriorityFeeInWEI)) {
    lowerTimeBound = low.minWaitTimeEstimate
    upperTimeBound = low.maxWaitTimeEstimate
  } else if (effectiveMaxPriorityFee.gte(mediumMaxPriorityFeeInWEI) && effectiveMaxPriorityFee.lt(highMaxPriorityFeeInWEI)) {
    lowerTimeBound = medium.minWaitTimeEstimate
    upperTimeBound = medium.maxWaitTimeEstimate
  } else if (effectiveMaxPriorityFee.eq(highMaxPriorityFeeInWEI)) {
    lowerTimeBound = high.minWaitTimeEstimate
    upperTimeBound = high.maxWaitTimeEstimate
  } else {
    lowerTimeBound = 0
    upperTimeBound = high.maxWaitTimeEstimate
  }

  return {
    lowerTimeBound,
    upperTimeBound,
  }
}
