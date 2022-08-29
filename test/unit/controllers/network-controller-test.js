import assert from 'assert'
import nock from 'nock'
import { createSandbox } from 'sinon'

import NetworkController from '../../../src/controllers/network/NetworkController'
import { getNetworkDisplayName } from '../../../src/utils/utils'

const noop = () => {}

describe('NetworkController', () => {
  describe('controller', () => {
    let networkController
    const sandbox = createSandbox()
    const networkControllerProviderConfig = {
      getAccounts: noop,
    }

    let setProviderTypeAndWait
    let getLatestBlockStub
    beforeEach(() => {
      nock('https://rinkeby.infura.io').persist().post('/metamask').reply(200)

      networkController = new NetworkController()
      setProviderTypeAndWait = (networkType) =>
        new Promise((resolve) => {
          networkController.on('networkDidChange', () => {
            resolve()
          })
          networkController.setProviderType(networkType)
        })

      getLatestBlockStub = sandbox.stub(networkController, 'getLatestBlock').returns({})
    })

    afterEach(() => {
      sandbox.reset()
      nock.cleanAll()
    })

    describe('#provider', () => {
      it('provider should be updatable without reassignment', () => {
        networkController.initializeProvider(networkControllerProviderConfig)
        const providerProxy = networkController.getProviderAndBlockTracker().provider
        assert.strictEqual(providerProxy.test, undefined)
        providerProxy.setTarget({ test: true })
        assert.strictEqual(providerProxy.test, true)
      })
    })
    describe('#getNetworkState', () => {
      it('should return loading when new', () => {
        const state = networkController.networkState
        assert.strictEqual(state, 'loading', 'network is loading')
      })
    })

    describe('#setNetworkState', () => {
      it('should update the network', () => {
        networkController.setNetworkState(1, 'rpc')
        const state = networkController.networkState
        assert.strictEqual(state, 1, 'network is 1')
      })
    })

    describe('#setProviderType', () => {
      it('should update provider.type', async () => {
        networkController.initializeProvider(networkControllerProviderConfig)
        await setProviderTypeAndWait('mainnet')
        const { type } = networkController.getProviderConfig()
        assert.strictEqual(type, 'mainnet', 'provider type is updated')
      })
      it('should set the network to loading', async () => {
        networkController.initializeProvider(networkControllerProviderConfig)
        await setProviderTypeAndWait('mainnet')
        const loading = networkController.isNetworkLoading()
        assert.ok(loading, 'network is loading')
      })
    })

    describe('#getEIP1559Compatibility', () => {
      it('should return false when baseFeePerGas is not in the block header', async () => {
        networkController.initializeProvider(networkControllerProviderConfig)
        const supportsEIP1559 = await networkController.getEIP1559Compatibility()
        assert.equal(supportsEIP1559, false)
      })

      it('should return true when baseFeePerGas is in block header', async () => {
        getLatestBlockStub.restore()
        networkController.initializeProvider(networkControllerProviderConfig)
        sandbox.stub(networkController, 'getLatestBlock').returns({ baseFeePerGas: '0xa ' })

        const supportsEIP1559 = await networkController.getEIP1559Compatibility()
        assert.equal(supportsEIP1559, true)
      })

      it('should store EIP1559 support in state to reduce calls to getLatestBlock', async () => {
        getLatestBlockStub.restore()
        networkController.initializeProvider(networkControllerProviderConfig)
        const getLatestBlockStubNew = sandbox.stub(networkController, 'getLatestBlock').returns({ baseFeePerGas: '0xa ' })

        await networkController.getEIP1559Compatibility()
        const supportsEIP1559 = await networkController.getEIP1559Compatibility()
        assert.equal(getLatestBlockStubNew.calledOnce, true)
        assert.equal(supportsEIP1559, true)
      })

      it('should clear stored EIP1559 support when changing networks', async () => {
        getLatestBlockStub.restore()
        networkController.initializeProvider(networkControllerProviderConfig)
        // networkController.consoleThis = true;
        const getLatestBlockSandbox = sandbox.stub(networkController, 'getLatestBlock').returns({ baseFeePerGas: '0xa ' })
        await networkController.getEIP1559Compatibility()
        assert.equal(networkController.networkDetails.getState().EIPS[1559], true)
        getLatestBlockSandbox.restore()
        sandbox.stub(networkController, 'getLatestBlock').returns({})
        await setProviderTypeAndWait('mainnet')
        assert.equal(networkController.networkDetails.getState().EIPS[1559], undefined)
        await networkController.getEIP1559Compatibility()
        assert.equal(networkController.networkDetails.getState().EIPS[1559], false)
      })
    })
  })

  describe('utils', () => {
    it('getNetworkDisplayName should return the correct network name', () => {
      const tests = [
        {
          input: 3,
          expected: 'Ropsten Test Network',
        },
        {
          input: 4,
          expected: 'Rinkeby Test Network',
        },
        {
          input: 42,
          expected: 'Kovan Test Network',
        },
        {
          input: 'ropsten',
          expected: 'Ropsten Test Network',
        },
        {
          input: 'rinkeby',
          expected: 'Rinkeby Test Network',
        },
        {
          input: 'kovan',
          expected: 'Kovan Test Network',
        },
        {
          input: 'mainnet',
          expected: 'Main Ethereum Network',
        },
        {
          input: 'goerli',
          expected: 'Goerli Test Network',
        },
      ]

      tests.forEach(({ input, expected }) => assert.strictEqual(getNetworkDisplayName(input), expected))
    })
  })
})
