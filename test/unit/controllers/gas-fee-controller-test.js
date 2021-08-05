/* eslint-disable no-console */
import assert from 'assert'
import nock from 'nock'
import { stub } from 'sinon'

import GasFeeController from '../../../src/controllers/gas/GasFeeController'

const TEST_GAS_FEE_API = 'https://mock-gas-server.herokuapp.com/<chain_id>'
const TEST_LEGACY_FEE_API = 'https://test/<chain_id>'

describe('GasFeeController', () => {
  let gasFeeController
  let getCurrentNetworkLegacyGasAPICompatibility
  let getIsEIP1559Compatible
  let getChainId

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
  })

  it('should initialize', async () => {
    assert.strictEqual(gasFeeController.legacyAPIEndpoint, TEST_LEGACY_FEE_API)
  })

  it('should getGasFeeEstimatesAndStartPolling', async () => {
    // assert.strictEqual(gasFeeController.state.gasFeeEstimates, {})
    console.log('gasFeeController.state.gasFeeEstimates', gasFeeController.state.gasFeeEstimates)
    const result = await gasFeeController.getGasFeeEstimatesAndStartPolling(undefined)
    assert.strictEqual(result.length, 36)
    console.log('gasFeeController.state.gasFeeEstimates', gasFeeController.state.gasFeeEstimates)
    assert.ok('low' in gasFeeController.state.gasFeeEstimates)
    assert.ok('medium' in gasFeeController.state.gasFeeEstimates)
    assert.ok('high' in gasFeeController.state.gasFeeEstimates)
    assert.ok('estimatedBaseFee' in gasFeeController.state.gasFeeEstimates)
  })

  describe('when on any network supporting legacy gas estimation api', () => {
    it('should _fetchGasFeeEstimateData', async () => {
      getCurrentNetworkLegacyGasAPICompatibility.mockImplementation(() => true)
      getIsEIP1559Compatible.mockImplementation(() => Promise.resolve(false))
      assert.strictEqual(gasFeeController.state.gasFeeEstimates, {})
      const estimates = await gasFeeController._fetchGasFeeEstimateData()
      assert.ok('gasFeeEstimates' in estimates)
      assert.strictEqual(gasFeeController.state.gasFeeEstimates.high, '30')
    })
  })

  describe('getChainId', () => {
    it('should work with a number input', async () => {
      getChainId.mockImplementation(() => 1)
      getCurrentNetworkLegacyGasAPICompatibility.mockImplementation(() => true)
      getIsEIP1559Compatible.mockImplementation(() => Promise.resolve(false))
      assert.strictEqual(gasFeeController.state.gasFeeEstimates, {})
      const estimates = await gasFeeController._fetchGasFeeEstimateData()
      assert.ok('gasFeeEstimates' in estimates)
      assert.strictEqual(gasFeeController.state.gasFeeEstimates.high, '30')
    })

    it('should work with a hexstring input', async () => {
      getChainId.mockImplementation(() => '0x1')
      getCurrentNetworkLegacyGasAPICompatibility.mockImplementation(() => true)
      getIsEIP1559Compatible.mockImplementation(() => Promise.resolve(false))
      assert.strictEqual(gasFeeController.state.gasFeeEstimates, {})
      const estimates = await gasFeeController._fetchGasFeeEstimateData()
      assert.ok('gasFeeEstimates' in estimates)
      assert.strictEqual(gasFeeController.state.gasFeeEstimates.high, '30')
    })

    it('should work with a numeric string input', async () => {
      getChainId.mockImplementation(() => '1')
      getCurrentNetworkLegacyGasAPICompatibility.mockImplementation(() => true)
      getIsEIP1559Compatible.mockImplementation(() => Promise.resolve(false))
      assert.strictEqual(gasFeeController.state.gasFeeEstimates, {})
      const estimates = await gasFeeController._fetchGasFeeEstimateData()
      assert.ok('gasFeeEstimates' in estimates)
      assert.strictEqual(gasFeeController.state.gasFeeEstimates.high, '30')
    })
  })

  describe('when on any network supporting EIP-1559', () => {
    it('should _fetchGasFeeEstimateData', async () => {
      getCurrentNetworkLegacyGasAPICompatibility.mockImplementation(() => true)
      assert.strictEqual(gasFeeController.state.gasFeeEstimates, {})
      const estimates = await gasFeeController._fetchGasFeeEstimateData()
      assert.ok('gasFeeEstimates' in estimates)
      assert.ok('estimatedBaseFee' in gasFeeController.state.gasFeeEstimates)
    })
  })
})
