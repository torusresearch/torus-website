import assert from 'assert'
import nock from 'nock'
import { createSandbox, stub } from 'sinon'

import GasFeeController from '../../../src/controllers/gas/GasFeeController'

const TEST_GAS_FEE_API = 'https://mock-gas-server.herokuapp.com/<chain_id>'
const TEST_LEGACY_FEE_API = 'https://test/<chain_id>'

describe('GasFeeController', () => {
  let gasFeeController
  let getCurrentNetworkLegacyGasAPICompatibility
  let getIsEIP1559Compatible
  let getChainId
  const sandbox = createSandbox()

  before(() => {
    nock.disableNetConnect()
  })

  after(() => {
    nock.enableNetConnect()
  })

  beforeEach(() => {
    getChainId = () => '0x1'
    getCurrentNetworkLegacyGasAPICompatibility = () => false
    getIsEIP1559Compatible = () => Promise.resolve(true)
    nock(TEST_GAS_FEE_API.replace('<chain_id>', '1'))
      .get(/.+/u)
      .reply(200, {
        low: {
          minWaitTimeEstimate: 60_000,
          maxWaitTimeEstimate: 600_000,
          suggestedMaxPriorityFeePerGas: '1',
          suggestedMaxFeePerGas: '35',
        },
        medium: {
          minWaitTimeEstimate: 15_000,
          maxWaitTimeEstimate: 60_000,
          suggestedMaxPriorityFeePerGas: '1.8',
          suggestedMaxFeePerGas: '38',
        },
        high: {
          minWaitTimeEstimate: 0,
          maxWaitTimeEstimate: 15_000,
          suggestedMaxPriorityFeePerGas: '2',
          suggestedMaxFeePerGas: '50',
        },
        estimatedBaseFee: '28',
      })
      .persist()

    nock(TEST_LEGACY_FEE_API.replace('<chain_id>', '0x1'))
      .get(/.+/u)
      .reply(200, {
        SafeGasPrice: '22',
        ProposeGasPrice: '25',
        FastGasPrice: '30',
      })
      .persist()
    gasFeeController = new GasFeeController({
      interval: 10_000,
      getProvider: () => stub(),
      getChainId,
      legacyAPIEndpoint: TEST_LEGACY_FEE_API,
      EIP1559APIEndpoint: TEST_GAS_FEE_API,
      getCurrentNetworkLegacyGasAPICompatibility,
      getCurrentAccountEIP1559Compatibility: () => false,
      getCurrentNetworkEIP1559Compatibility: getIsEIP1559Compatible, // change this for networkController.state.properties.isEIP1559Compatible ???
    })
  })

  afterEach(() => {
    nock.cleanAll()
    gasFeeController.destroy()
    sandbox.reset()
  })

  it('should initialize', async () => {
    assert.strictEqual(gasFeeController.legacyAPIEndpoint, TEST_LEGACY_FEE_API)
  })

  it('should getGasFeeEstimatesAndStartPolling', async () => {
    sandbox.stub(gasFeeController, 'getCurrentAccountEIP1559Compatibility').returns(true)
    assert.deepStrictEqual(gasFeeController.state.gasFeeEstimates, {})
    await gasFeeController.getGasFeeEstimatesAndStartPolling(undefined)
    assert('low' in gasFeeController.state.gasFeeEstimates)
    assert('medium' in gasFeeController.state.gasFeeEstimates)
    assert('high' in gasFeeController.state.gasFeeEstimates)
    assert('estimatedBaseFee' in gasFeeController.state.gasFeeEstimates)
  })

  describe('when on any network supporting legacy gas estimation api', () => {
    it('should _fetchGasFeeEstimateData', async () => {
      sandbox.stub(gasFeeController, 'getCurrentNetworkLegacyGasAPICompatibility').returns(true)
      sandbox.stub(gasFeeController, 'getCurrentNetworkEIP1559Compatibility').returns(() => Promise.resolve(false))
      assert.deepStrictEqual(gasFeeController.state.gasFeeEstimates, {})
      const estimates = await gasFeeController._fetchGasFeeEstimateData()
      assert('gasFeeEstimates' in estimates)
      assert.strictEqual(gasFeeController.state.gasFeeEstimates.high, '30')
    })
  })

  describe('getChainId', () => {
    it('should work with a number input', async () => {
      sandbox.stub(gasFeeController, 'getChainId').returns(1)
      sandbox.stub(gasFeeController, 'getCurrentNetworkLegacyGasAPICompatibility').returns(true)
      sandbox.stub(gasFeeController, 'getCurrentNetworkEIP1559Compatibility').returns(() => Promise.resolve(false))
      assert.deepStrictEqual(gasFeeController.state.gasFeeEstimates, {})
      const estimates = await gasFeeController._fetchGasFeeEstimateData()
      assert('gasFeeEstimates' in estimates)
      assert.strictEqual(gasFeeController.state.gasFeeEstimates.high, '30')
    })

    it('should work with a hexstring input', async () => {
      sandbox.stub(gasFeeController, 'getChainId').returns('0x1')
      sandbox.stub(gasFeeController, 'getCurrentNetworkLegacyGasAPICompatibility').returns(true)
      sandbox.stub(gasFeeController, 'getCurrentNetworkEIP1559Compatibility').returns(() => Promise.resolve(false))
      assert.deepStrictEqual(gasFeeController.state.gasFeeEstimates, {})
      const estimates = await gasFeeController._fetchGasFeeEstimateData()
      assert('gasFeeEstimates' in estimates)
      assert.strictEqual(gasFeeController.state.gasFeeEstimates.high, '30')
    })

    it('should work with a numeric string input', async () => {
      sandbox.stub(gasFeeController, 'getChainId').returns(1)
      sandbox.stub(gasFeeController, 'getCurrentNetworkLegacyGasAPICompatibility').returns(true)
      sandbox.stub(gasFeeController, 'getCurrentNetworkEIP1559Compatibility').returns(() => Promise.resolve(false))
      assert.deepStrictEqual(gasFeeController.state.gasFeeEstimates, {})
      const estimates = await gasFeeController._fetchGasFeeEstimateData()
      assert('gasFeeEstimates' in estimates)
      assert.strictEqual(gasFeeController.state.gasFeeEstimates.high, '30')
    })
  })

  describe('when on any network supporting EIP-1559', () => {
    it('should _fetchGasFeeEstimateData', async () => {
      sandbox.stub(gasFeeController, 'getCurrentAccountEIP1559Compatibility').returns(true)
      sandbox.stub(gasFeeController, 'getCurrentNetworkEIP1559Compatibility').returns(() => Promise.resolve(true))
      sandbox.stub(gasFeeController, 'getCurrentNetworkLegacyGasAPICompatibility').returns(true)
      assert.deepStrictEqual(gasFeeController.state.gasFeeEstimates, {})
      const estimates = await gasFeeController._fetchGasFeeEstimateData()
      assert('gasFeeEstimates' in estimates)
      assert('estimatedBaseFee' in gasFeeController.state.gasFeeEstimates)
    })
  })
})
