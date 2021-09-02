import assert from 'assert'
import BigNumber from 'bignumber.js'

import { addCurrencies, conversionUtil } from '../../../src/utils/conversionUtils'

describe('conversion utils', () => {
  describe('addCurrencies()', () => {
    it('add whole numbers', () => {
      const result = addCurrencies(3, 9, {
        aBase: 10,
        bBase: 10,
      })
      assert.strictEqual(result.toNumber(), 12)
    })

    it('add decimals', () => {
      const result = addCurrencies(1.3, 1.9, {
        aBase: 10,
        bBase: 10,
      })
      assert.strictEqual(result.toNumber(), 3.2)
    })

    it('add repeating decimals', () => {
      const result = addCurrencies(1 / 3, 1 / 9, {
        aBase: 10,
        bBase: 10,
      })
      assert.strictEqual(result.toNumber(), 0.444_444_444_444_444_4)
    })
  })

  describe('conversionUtil', () => {
    it('returns expected types', () => {
      const conv1 = conversionUtil(1_000_000_000_000_000_000, {
        fromNumericBase: 'dec',
        toNumericBase: 'hex',
      })
      const conv2 = conversionUtil(1, {
        fromNumericBase: 'dec',
        fromDenomination: 'ETH',
        toDenomination: 'WEI',
      })
      assert.strictEqual(typeof conv1 === 'string', true)
      assert.strictEqual(conv2 instanceof BigNumber, true)
    })
    it('converts from dec to hex', () => {
      assert.strictEqual(
        conversionUtil('1000000000000000000', {
          fromNumericBase: 'dec',
          toNumericBase: 'hex',
        }),
        'de0b6b3a7640000'
      )
      assert.strictEqual(
        conversionUtil('1500000000000000000', {
          fromNumericBase: 'dec',
          toNumericBase: 'hex',
        }),
        '14d1120d7b160000'
      )
    })
    it('converts hex formatted numbers to dec', () => {
      assert.strictEqual(
        conversionUtil('0xde0b6b3a7640000', {
          fromNumericBase: 'hex',
          toNumericBase: 'dec',
        }),
        '1000000000000000000'
      )
      assert.strictEqual(
        conversionUtil('0x14d1120d7b160000', {
          fromNumericBase: 'hex',
          toNumericBase: 'dec',
        }),
        '1500000000000000000'
      )
    })
    it('converts WEI to ETH', () => {
      assert.strictEqual(
        conversionUtil('0xde0b6b3a7640000', {
          fromNumericBase: 'hex',
          toNumericBase: 'dec',
          fromDenomination: 'WEI',
          toDenomination: 'ETH',
        }),
        '1'
      )
      assert.strictEqual(
        conversionUtil('0x14d1120d7b160000', {
          fromNumericBase: 'hex',
          toNumericBase: 'dec',
          fromDenomination: 'WEI',
          toDenomination: 'ETH',
        }),
        '1.5'
      )
    })
    it('converts ETH to WEI', () => {
      assert.strictEqual(
        conversionUtil('1', {
          fromNumericBase: 'dec',
          fromDenomination: 'ETH',
          toDenomination: 'WEI',
        }).toNumber(),
        1_000_000_000_000_000_000
      )
      assert.strictEqual(
        conversionUtil('1.5', {
          fromNumericBase: 'dec',
          fromDenomination: 'ETH',
          toDenomination: 'WEI',
        }).toNumber(),
        1_500_000_000_000_000_000
      )
    })
    it('converts ETH to GWEI', () => {
      assert.strictEqual(
        conversionUtil('1', {
          fromNumericBase: 'dec',
          fromDenomination: 'ETH',
          toDenomination: 'GWEI',
        }).toNumber(),
        1_000_000_000
      )
      assert.strictEqual(
        conversionUtil('1.5', {
          fromNumericBase: 'dec',
          fromDenomination: 'ETH',
          toDenomination: 'GWEI',
        }).toNumber(),
        1_500_000_000
      )
    })
    it('converts ETH to USD', () => {
      assert.strictEqual(
        conversionUtil('1', {
          fromNumericBase: 'dec',
          toNumericBase: 'dec',
          toCurrency: 'usd',
          conversionRate: 468.58,
          numberOfDecimals: 2,
        }),
        '468.58'
      )
      assert.strictEqual(
        conversionUtil('1.5', {
          fromNumericBase: 'dec',
          toNumericBase: 'dec',
          toCurrency: 'usd',
          conversionRate: 468.58,
          numberOfDecimals: 2,
        }),
        '702.87'
      )
    })
    it('converts USD to ETH', () => {
      assert.strictEqual(
        conversionUtil('468.58', {
          fromNumericBase: 'dec',
          toNumericBase: 'dec',
          toCurrency: 'usd',
          conversionRate: 468.58,
          numberOfDecimals: 2,
          invertConversionRate: true,
        }),
        '1'
      )
      assert.strictEqual(
        conversionUtil('702.87', {
          fromNumericBase: 'dec',
          toNumericBase: 'dec',
          toCurrency: 'usd',
          conversionRate: 468.58,
          numberOfDecimals: 2,
          invertConversionRate: true,
        }),
        '1.5'
      )
    })
  })
})
