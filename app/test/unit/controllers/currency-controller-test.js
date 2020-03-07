/* eslint-disable */
import assert from 'assert'
import nock from 'nock'

import CurrencyController from '../../../src/controllers/CurrencyController'

describe('currency-controller', () => {
  let currencyController

  beforeEach(() => {
    currencyController = new CurrencyController()
  })

  describe('currency conversions', () => {
    describe('#setCurrentCurrency', () => {
      it('should return USD as default', () => {
        assert.strictEqual(currencyController.getCurrentCurrency(), 'usd')
      })

      it('should be able to set to other currency', () => {
        assert.strictEqual(currencyController.getCurrentCurrency(), 'usd')
        currencyController.setCurrentCurrency('JPY')
        const result = currencyController.getCurrentCurrency()
        assert.strictEqual(result, 'JPY')
      })
    })

    describe('#getConversionRate', () => {
      it('should return undefined if non-existent', () => {
        const result = currencyController.getConversionRate()
        assert.ok(!result)
      })
    })

    describe('#updateConversionRate', () => {
      it('should retrieve an update for ETH to USD and set it in memory', function finish(done) {
        this.timeout(15000)
        nock('https://api.infura.io')
          .get('/v1/ticker/ethusd')
          .reply(
            200,
            '{"base": "ETH", "quote": "USD", "bid": 288.45, "ask": 288.46, "volume": 112888.17569277, "exchange": "bitfinex", "total_volume": 272175.00106721005, "num_exchanges": 8, "timestamp": 1506444677}'
          )

        assert.strictEqual(currencyController.getConversionRate(), 0)
        currencyController.setCurrentCurrency('usd')
        currencyController
          .updateConversionRate()
          .then(() => {
            const result = currencyController.getConversionRate()
            assert.strictEqual(typeof result, 'number')
            done()
          })
          .catch(error => {
            done(error)
          })
      })

      it('should work for JPY as well.', function() {
        this.timeout(15000)
        assert.strictEqual(currencyController.getConversionRate(), 0)

        nock('https://api.infura.io')
          .get('/v1/ticker/ethjpy')
          .reply(
            200,
            '{"base": "ETH", "quote": "JPY", "bid": 32300.0, "ask": 32400.0, "volume": 247.4616071, "exchange": "kraken", "total_volume": 247.4616071, "num_exchanges": 1, "timestamp": 1506444676}'
          )

        const promise = new Promise((resolve, reject) => {
          currencyController.setCurrentCurrency('jpy')
          currencyController.updateConversionRate().then(() => {
            resolve()
          })
        })

        promise
          .then(() => {
            const result = currencyController.getConversionRate()
            assert.strictEqual(typeof result, 'number')
          })
          .catch((error, error_) => {
            error(error_)
          })
      })
    })
  })
})
