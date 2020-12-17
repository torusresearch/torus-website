/* eslint-disable */
import assert from 'assert'
import nock from 'nock'
import NetworkController from '../../../src/controllers/NetworkController'
import { getNetworkDisplayName } from '../../../src/utils/utils'

describe('NetworkController', function () {
  describe('controller', function () {
    let networkController
    const noop = () => {}
    const networkControllerProviderConfig = {
      getAccounts: noop,
    }

    beforeEach(function () {
      nock('https://rinkeby.infura.io').persist().post('/metamask').reply(200)

      networkController = new NetworkController()
      networkController.initializeProvider(networkControllerProviderConfig)
    })

    afterEach(function () {
      nock.cleanAll()
    })

    describe('#provider', function () {
      it('provider should be updatable without reassignment', function () {
        networkController.initializeProvider(networkControllerProviderConfig)
        const providerProxy = networkController.getProviderAndBlockTracker().provider
        assert.strictEqual(providerProxy.test, undefined)
        providerProxy.setTarget({ test: true })
        assert.strictEqual(providerProxy.test, true)
      })
    })
    describe('#getNetworkState', function () {
      it('should return loading when new', function () {
        const networkState = networkController.getNetworkState()
        assert.strictEqual(networkState, 'loading', 'network is loading')
      })
    })

    describe('#setNetworkState', function () {
      it('should update the network', function () {
        networkController.setNetworkState(1, 'rpc')
        const networkState = networkController.getNetworkState()
        assert.strictEqual(networkState, 1, 'network is 1')
      })
    })

    describe('#setProviderType', function () {
      it('should update provider.type', function () {
        networkController.setProviderType('mainnet')
        const type = networkController.getProviderConfig().type
        assert.strictEqual(type, 'mainnet', 'provider type is updated')
      })
      it('should set the network to loading', function () {
        networkController.setProviderType('mainnet')
        const loading = networkController.isNetworkLoading()
        assert.ok(loading, 'network is loading')
      })
    })
  })

  describe('utils', function () {
    it('getNetworkDisplayName should return the correct network name', function () {
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
