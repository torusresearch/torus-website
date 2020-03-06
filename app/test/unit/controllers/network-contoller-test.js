/* eslint-disable */
const assert = require('assert')
const nock = require('nock')
const NetworkController = require('../../../src/controllers/NetworkController').default
// const { getNetworkDisplayName } = require('../../../../app/scripts/controllers/network/util')

describe('# Network Controller', () => {
  let networkController
  const noop = () => {}
  const networkControllerProviderConfig = {
    getAccounts: noop
  }

  beforeEach(() => {
    nock('https://rinkeby.infura.io')
      .persist()
      .post('/metamask')
      .reply(200)

    networkController = new NetworkController()

    networkController.initializeProvider(networkControllerProviderConfig)
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe('network', () => {
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
        const networkState = networkController.getNetworkState()
        assert.strictEqual(networkState, 'loading', 'network is loading')
      })
    })

    describe('#setNetworkState', () => {
      it('should update the network', () => {
        networkController.setNetworkState(1, 'rpc')
        const networkState = networkController.getNetworkState()
        assert.strictEqual(networkState, 1, 'network is 1')
      })
    })

    describe('#setProviderType', () => {
      it('should update provider.type', () => {
        networkController.setProviderType('mainnet')
        const { type } = networkController.getProviderConfig()
        assert.strictEqual(type, 'mainnet', 'provider type is updated')
      })
      it('should set the network to loading', () => {
        networkController.setProviderType('mainnet')
        const loading = networkController.isNetworkLoading()
        assert.ok(loading, 'network is loading')
      })
    })
  })
})

// describe('Network utils', () => {
//   it('getNetworkDisplayName should return the correct network name', () => {
//     const tests = [
//       {
//         input: 3,
//         expected: 'Ropsten'
//       },
//       {
//         input: 4,
//         expected: 'Rinkeby'
//       },
//       {
//         input: 42,
//         expected: 'Kovan'
//       },
//       {
//         input: 'ropsten',
//         expected: 'Ropsten'
//       },
//       {
//         input: 'rinkeby',
//         expected: 'Rinkeby'
//       },
//       {
//         input: 'kovan',
//         expected: 'Kovan'
//       },
//       {
//         input: 'mainnet',
//         expected: 'Main Ethereum Network'
//       }
//     ]

//     tests.forEach(({ input, expected }) => assert.strictEqual(getNetworkDisplayName(input), expected))
//   })
// })
