import assert from 'assert'
import nock from 'nock'

import { fetchGasEstimates, fetchLegacyGasPriceEstimates, normalizeGWEIDecimalNumbers } from '../../../src/controllers/gas/gas-util'

const mockEIP1559ApiResponses = [
  {
    low: {
      minWaitTimeEstimate: 120_000,
      maxWaitTimeEstimate: 300_000,
      suggestedMaxPriorityFeePerGas: '1',
      suggestedMaxFeePerGas: '35',
    },
    medium: {
      minWaitTimeEstimate: 0,
      maxWaitTimeEstimate: 30_000,
      suggestedMaxPriorityFeePerGas: '2',
      suggestedMaxFeePerGas: '40',
    },
    high: {
      minWaitTimeEstimate: 0,
      maxWaitTimeEstimate: 15_000,
      suggestedMaxPriorityFeePerGas: '3',
      suggestedMaxFeePerGas: '60',
    },
    estimatedBaseFee: '30',
  },
  {
    low: {
      minWaitTimeEstimate: 180_000,
      maxWaitTimeEstimate: 360_000,
      suggestedMaxPriorityFeePerGas: '1.0000000162',
      suggestedMaxFeePerGas: '40',
    },
    medium: {
      minWaitTimeEstimate: 15_000,
      maxWaitTimeEstimate: 60_000,
      suggestedMaxPriorityFeePerGas: '1.0000000160000028',
      suggestedMaxFeePerGas: '45',
    },
    high: {
      minWaitTimeEstimate: 0,
      maxWaitTimeEstimate: 15_000,
      suggestedMaxPriorityFeePerGas: '3',
      suggestedMaxFeePerGas: '1.000000016522',
    },
    estimatedBaseFee: '32.000000016522',
  },
]

describe('gas utils', () => {
  describe('fetchGasEstimates', () => {
    it('should fetch external gasFeeEstimates when data is valid', async () => {
      const scope = nock('https://not-a-real-url/').get(/.+/u).reply(200, mockEIP1559ApiResponses[0]).persist()
      const result = await fetchGasEstimates('https://not-a-real-url/')
      assert.deepStrictEqual(result, mockEIP1559ApiResponses[0], 'invalid gas estimates')

      scope.done()
      nock.cleanAll()
    })

    it('should fetch and normalize external gasFeeEstimates when data is has an invalid number of decimals', async () => {
      const expectedResult = {
        low: {
          minWaitTimeEstimate: 180_000,
          maxWaitTimeEstimate: 360_000,
          suggestedMaxPriorityFeePerGas: '1.000000016',
          suggestedMaxFeePerGas: '40',
        },
        medium: {
          minWaitTimeEstimate: 15_000,
          maxWaitTimeEstimate: 60_000,
          suggestedMaxPriorityFeePerGas: '1.000000016',
          suggestedMaxFeePerGas: '45',
        },
        high: {
          minWaitTimeEstimate: 0,
          maxWaitTimeEstimate: 15_000,
          suggestedMaxPriorityFeePerGas: '3',
          suggestedMaxFeePerGas: '1.000000017',
        },
        estimatedBaseFee: '32.000000017',
      }

      const scope = nock('https://not-a-real-url/').get(/.+/u).reply(200, mockEIP1559ApiResponses[1]).persist()
      const result = await fetchGasEstimates('https://not-a-real-url/')
      assert.deepStrictEqual(result, expectedResult, 'failed to normalize gas estimates')
      scope.done()
      nock.cleanAll()
    })
  })

  describe('fetchLegacyGasPriceEstimates', () => {
    it('should fetch external gasPrices and return high/medium/low', async () => {
      const scope = nock('https://not-a-real-url/')
        .get(/.+/u)
        .reply(200, {
          SafeGasPrice: '22',
          ProposeGasPrice: '25',
          FastGasPrice: '30',
        })
        .persist()
      const result = await fetchLegacyGasPriceEstimates('https://not-a-real-url/')
      assert.deepStrictEqual(
        result,
        {
          high: '30',
          medium: '25',
          low: '22',
        },
        'failed to fetch external gasPrices and return high/medium/lo'
      )

      scope.done()
      nock.cleanAll()
    })
  })

  describe('normalizeGWEIDecimalNumbers', () => {
    it('should convert a whole number to WEI', () => {
      assert.strictEqual(normalizeGWEIDecimalNumbers(1), '1')
      assert.strictEqual(normalizeGWEIDecimalNumbers(123), '123')
      assert.strictEqual(normalizeGWEIDecimalNumbers(101), '101')
      assert.strictEqual(normalizeGWEIDecimalNumbers(1234), '1234')
      assert.strictEqual(normalizeGWEIDecimalNumbers(1000), '1000')
    })

    it('should convert a number with a decimal part to WEI', () => {
      assert.strictEqual(normalizeGWEIDecimalNumbers(1.1), '1.1')
      assert.strictEqual(normalizeGWEIDecimalNumbers(123.01), '123.01')
      assert.strictEqual(normalizeGWEIDecimalNumbers(101.001), '101.001')
      assert.strictEqual(normalizeGWEIDecimalNumbers(100.001), '100.001')
      assert.strictEqual(normalizeGWEIDecimalNumbers(1234.567), '1234.567')
    })

    it('should convert a number < 1 to WEI', () => {
      assert.strictEqual(normalizeGWEIDecimalNumbers(0.1), '0.1')
      assert.strictEqual(normalizeGWEIDecimalNumbers(0.01), '0.01')
      assert.strictEqual(normalizeGWEIDecimalNumbers(0.001), '0.001')
      assert.strictEqual(normalizeGWEIDecimalNumbers(0.567), '0.567')
    })

    it('should round to whole WEI numbers', () => {
      assert.strictEqual(normalizeGWEIDecimalNumbers(0.1001), '0.1001')
      assert.strictEqual(normalizeGWEIDecimalNumbers(0.0109), '0.0109')
      assert.strictEqual(normalizeGWEIDecimalNumbers(0.0014), '0.0014')
      assert.strictEqual(normalizeGWEIDecimalNumbers(0.5676), '0.5676')
    })

    it('should handle inputs with more than 9 decimal places', () => {
      assert.strictEqual(normalizeGWEIDecimalNumbers(1.000_000_016_2), '1.000000016')
      assert.strictEqual(normalizeGWEIDecimalNumbers(1.000_000_016_5), '1.000000017')
      assert.strictEqual(normalizeGWEIDecimalNumbers(1.000_000_019_9), '1.00000002')
      assert.strictEqual(normalizeGWEIDecimalNumbers(1.999_999_999_9), '2')
      assert.strictEqual(normalizeGWEIDecimalNumbers(1.000_000_599_8), '1.0000006')
      assert.strictEqual(normalizeGWEIDecimalNumbers(123_456.000_000_599_8), '123456.0000006')
      assert.strictEqual(normalizeGWEIDecimalNumbers(1.000_000_016_025), '1.000000016')
      // eslint-disable-next-line no-loss-of-precision
      assert.strictEqual(normalizeGWEIDecimalNumbers(1.000_000_016_000_002_8), '1.000000016')
      assert.strictEqual(normalizeGWEIDecimalNumbers(1.000_000_016_522), '1.000000017')
      assert.strictEqual(normalizeGWEIDecimalNumbers(1.000_000_016_800_022), '1.000000017')
    })

    it('should work if there are extraneous trailing decimal zeroes', () => {
      assert.strictEqual(normalizeGWEIDecimalNumbers('0.5000'), '0.5')
      assert.strictEqual(normalizeGWEIDecimalNumbers('123.002300'), '123.0023')
      assert.strictEqual(normalizeGWEIDecimalNumbers('123.002300000000'), '123.0023')
      assert.strictEqual(normalizeGWEIDecimalNumbers('0.00000200000'), '0.000002')
    })

    it('should work if there is no whole number specified', () => {
      assert.strictEqual(normalizeGWEIDecimalNumbers('.1'), '0.1')
      assert.strictEqual(normalizeGWEIDecimalNumbers('.01'), '0.01')
      assert.strictEqual(normalizeGWEIDecimalNumbers('.001'), '0.001')
      assert.strictEqual(normalizeGWEIDecimalNumbers('.567'), '0.567')
    })

    it('should handle NaN', () => {
      assert.strictEqual(normalizeGWEIDecimalNumbers(Number.NaN), '0')
    })
  })
})
