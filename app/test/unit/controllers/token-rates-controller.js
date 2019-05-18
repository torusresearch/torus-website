const assert = require('assert')
const sinon = require('sinon')
const TokenRatesController = require('../../../src/controllers/TokenRatesController').default
const ObservableStore = require('obs-store')

describe('TokenRatesController', () => {
  it('should listen for preferences store updates', () => {
    const tokensStore = new ObservableStore({ tokens: [] })
    const controller = new TokenRatesController({ tokensStore })
    tokensStore.putState({ tokens: [{ tokenAddress: 'foo' }] })
    assert.deepStrictEqual(controller._tokens, [{ tokenAddress: 'foo' }])
  })

  it('should poll on correct interval', async () => {
    const stub = sinon.stub(global, 'setInterval')
    new TokenRatesController({ interval: 1337 }) // eslint-disable-line no-new
    assert.strictEqual(stub.getCall(0).args[1], 1337)
    stub.restore()
  })
})
