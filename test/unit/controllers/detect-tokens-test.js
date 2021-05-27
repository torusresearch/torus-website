import assert from 'assert'
import nock from 'nock'
import sinon from 'sinon'

import DetectTokensController from '../../../src/controllers/DetectTokensController'
import NetworkController from '../../../src/controllers/NetworkController'

const TEMP_ADDRESS = '0x0dcd5d886577d5081b0c52e242ef29e70be3e7bc'
const noop = () => {}

describe('DetectTokensController', () => {
  const sandbox = sinon.createSandbox()
  let clock
  let network
  let controller

  const networkControllerProviderConfig = {
    getAccounts: noop,
  }

  beforeEach(async () => {
    nock.cleanAll()
    nock.disableNetConnect()
    nock('https://min-api.cryptocompare.com').get(/.*/).query(true).reply(200)

    network = new NetworkController()
    network.initializeProvider(networkControllerProviderConfig)
    controller = new DetectTokensController({ network })
  })

  afterEach(() => {
    sandbox.restore()
    nock.cleanAll()
  })

  it('should poll on correct interval', async () => {
    const stub = sinon.stub(global, 'setInterval')
    new DetectTokensController({ interval: 1337 }) // eslint-disable-line no-new
    assert.strictEqual(stub.getCall(0).args[1], 1337)
    stub.restore()
  })

  it('should be called on every polling period', async () => {
    clock = sandbox.useFakeTimers()
    const localNetworkController = new NetworkController()
    localNetworkController.initializeProvider(networkControllerProviderConfig)
    localNetworkController.setProviderType('mainnet')
    const localController = new DetectTokensController({ network: localNetworkController })

    const stub = sandbox.stub(localController, 'detectNewTokens')

    clock.tick(1)
    sandbox.assert.notCalled(stub)
    clock.tick(180000)
    sandbox.assert.called(stub)
    clock.tick(180000)
    sandbox.assert.calledTwice(stub)
    clock.tick(180000)
    sandbox.assert.calledThrice(stub)
  })

  it('should not check tokens while in test network', async () => {
    const stub = sandbox
      .stub(controller, 'detectCovalentTokenBalance')
      .withArgs('0x0D262e5dC4A06a0F1c90cE79C7a60C09DfC884E4')
      .returns(true)
      .withArgs('0xBC86727E770de68B1060C91f6BB6945c73e10388')
      .returns(true)

    await controller.startTokenDetection(TEMP_ADDRESS)
    sandbox.assert.notCalled(stub)
  })

  it('should only check and add tokens while in main network', async () => {
    await controller.startTokenDetection(TEMP_ADDRESS)
    sandbox
      .stub(controller, 'detectCovalentTokenBalance')
      .withArgs('0x0D262e5dC4A06a0F1c90cE79C7a60C09DfC884E4', { decimals: 8, symbol: 'J8T' })
      .returns(
        controller.detectedTokensStore.putState({
          tokens: [
            {
              tokenAddress: '0x0D262e5dC4A06a0F1c90cE79C7a60C09DfC884E4',
              symbol: 'J8T',
              decimals: 8,
            },
          ],
        })
      )
      .withArgs('0xBC86727E770de68B1060C91f6BB6945c73e10388', { decimals: 18, symbol: 'XNK' })
      .returns(
        controller.detectedTokensStore.putState({
          tokens: [
            {
              tokenAddress: '0x0D262e5dC4A06a0F1c90cE79C7a60C09DfC884E4',
              symbol: 'J8T',
              decimals: 8,
            },
            {
              tokenAddress: '0xBC86727E770de68B1060C91f6BB6945c73e10388',
              symbol: 'XNK',
              decimals: 18,
            },
          ],
        })
      )
    assert.deepStrictEqual(
      controller.detectedTokensStore.getState().tokens.map((x) => ({ address: x.tokenAddress, decimals: x.decimals, symbol: x.symbol })),
      [
        { address: '0x0D262e5dC4A06a0F1c90cE79C7a60C09DfC884E4', decimals: 8, symbol: 'J8T' },
        { address: '0xBC86727E770de68B1060C91f6BB6945c73e10388', decimals: 18, symbol: 'XNK' },
      ]
    )
  })

  it('should not detect same token while in main network', async () => {
    const localController = new DetectTokensController({ network })
    await localController.startTokenDetection(TEMP_ADDRESS)
    localController.detectedTokensStore.putState({
      tokens: [
        {
          tokenAddress: '0x0D262e5dC4A06a0F1c90cE79C7a60C09DfC884E4',
          symbol: 'J8T',
          decimals: 8,
        },
      ],
    })

    sandbox
      .stub(localController, 'detectCovalentTokenBalance')
      .withArgs('0x0D262e5dC4A06a0F1c90cE79C7a60C09DfC884E4', { decimals: 8, symbol: 'J8T' })
      .returns(
        localController.detectedTokensStore.putState({
          tokens: [
            {
              tokenAddress: '0x0D262e5dC4A06a0F1c90cE79C7a60C09DfC884E4',
              symbol: 'J8T',
              decimals: 8,
            },
          ],
        })
      )
      .withArgs('0xBC86727E770de68B1060C91f6BB6945c73e10388', { decimals: 18, symbol: 'XNK' })
      .returns(
        localController.detectedTokensStore.putState({
          tokens: [
            {
              tokenAddress: '0x0D262e5dC4A06a0F1c90cE79C7a60C09DfC884E4',
              symbol: 'J8T',
              decimals: 8,
            },
            {
              tokenAddress: '0xBC86727E770de68B1060C91f6BB6945c73e10388',
              symbol: 'XNK',
              decimals: 18,
            },
          ],
        })
      )

    assert.deepStrictEqual(
      localController.detectedTokensStore.getState().tokens.map((x) => ({ address: x.tokenAddress, decimals: x.decimals, symbol: x.symbol })),
      [
        { address: '0x0D262e5dC4A06a0F1c90cE79C7a60C09DfC884E4', decimals: 8, symbol: 'J8T' },
        { address: '0xBC86727E770de68B1060C91f6BB6945c73e10388', decimals: 18, symbol: 'XNK' },
      ]
    )
  })
})
