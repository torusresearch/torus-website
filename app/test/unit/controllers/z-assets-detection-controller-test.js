import assert from 'assert'
import nock from 'nock'
import { createSandbox } from 'sinon'

import AssetsContractController from '../../../src/controllers/AssetsContractController'
import AssetsController from '../../../src/controllers/AssetsController'
import AssetsDetectionController from '../../../src/controllers/AssetsDetectionController'
import NetworkController from '../../../src/controllers/NetworkController'
import PreferencesController from '../../../src/controllers/PreferencesController'

const MAINNET = 'mainnet'
const ROPSTEN = 'ropsten'
const noop = () => {}
const TEST_ADDRESS = '0x0DCD5D886577d5081B0c52e242Ef29E70Be3E7bc'
const OPEN_SEA_API = 'https://api.tor.us'
const testAccount = {
  key: '08506248462eadf53f05b6c3577627071757644b3a0547315788357ec93e7b77',
  address: '0xa12164FeD66719297D2cF407bb314D07FEb12C02',
}
describe('AssetsDetectionController', () => {
  let assetsDetection
  let network
  let assets
  let assetsContract
  let prefsController
  const sandbox = createSandbox()

  beforeEach(async () => {
    network = new NetworkController()
    const networkControllerProviderConfig = {
      getAccounts: noop,
    }
    network.initializeProvider(networkControllerProviderConfig)
    network.setProviderType(MAINNET)

    prefsController = new PreferencesController()
    sandbox.stub(prefsController, 'sync')
    sandbox.stub(prefsController, 'createUser')
    await prefsController.init({ address: testAccount.address, rehydrate: true, jwtToken: 'hello', dispatch: noop, commit: noop })
    prefsController.setSelectedAddress(testAccount.address)

    assetsContract = new AssetsContractController({
      provider: network._providerProxy,
    })
    assets = new AssetsController({
      selectedAddress: TEST_ADDRESS,
      assetContractController: assetsContract,
      network,
      getOpenSeaCollectibles: prefsController.getOpenSeaCollectibles.bind(prefsController),
    })

    assetsDetection = new AssetsDetectionController({
      network,
      assetContractController: assetsContract,
      assetController: assets,
      getOpenSeaCollectibles: prefsController.getOpenSeaCollectibles.bind(prefsController),
    })

    nock(OPEN_SEA_API)
      .get('/opensea?url=https://api.opensea.io/api/v1/asset_contract/0x1d963688FE2209A98dB35C67A041524822Cf04ff')
      .reply(200, {
        data: {
          description: 'Description',
          image_url: 'url',
          name: 'Name',
          symbol: 'FOO',
          total_supply: 0,
        },
      })

    nock(OPEN_SEA_API)
      .persist()
      .get('/opensea?url=https://api.opensea.io/api/v1/assets?owner=0x2&limit=300')
      .reply(200, {
        data: {
          assets: [
            {
              asset_contract: {
                address: '0x1d963688fe2209a98db35c67a041524822cf04ff',
                name: 'Name FF',
                symbol: 'FF',
                image_url: 'url FF',
                total_supply: 10,
                description: 'Description FF',
              },
              description: 'Description 2577',
              image_original_url: 'image/2577.png',
              name: 'ID 2577',
              token_id: '2577',
            },
          ],
        },
      })

    nock(OPEN_SEA_API)
      .get(`/opensea?url=https://api.opensea.io/api/v1/assets?owner=${TEST_ADDRESS}&limit=300 `)
      .reply(200, {
        data: {
          assets: [
            {
              asset_contract: {
                address: '0x1d963688fe2209a98db35c67a041524822cf04ff',
                name: 'Name FF',
                symbol: 'FF',
                image_url: 'url FF',
                total_supply: 10,
                description: 'Description FF',
              },
              description: 'Description 2577',
              image_original_url: 'image/2577.png',
              name: 'ID 2577',
              token_id: '2577',
            },
            {
              asset_contract: {
                address: '0x1d963688fe2209a98db35c67a041524822cf04ff',
                name: 'Name FF',
                symbol: 'FF',
                image_url: 'url FF',
                total_supply: 10,
                description: 'Description FF',
              },
              description: 'Description 2574',
              image_original_url: 'image/2574.png',
              name: 'ID 2574',
              token_id: '2574',
            },
          ],
        },
      })

    nock(OPEN_SEA_API)
      .get('/opensea?url=https://api.opensea.io/api/v1/asset_contract/0x1D963688FE2209A98db35c67A041524822cf04Hh')
      .reply(200, {
        data: {
          description: 'Description HH',
          image_url: 'url HH',
          name: 'Name HH',
          symbol: 'HH',
          total_supply: 10,
        },
      })

    nock(OPEN_SEA_API)
      .get('/opensea?url=https://api.opensea.io/api/v1/asset_contract/0x1d963688FE2209A98db35c67A041524822CF04gg')
      .replyWithError(new TypeError('Failed to fetch'))

    nock(OPEN_SEA_API)
      .get('/opensea?url=https://api.opensea.io/api/v1/asset_contract/0x1D963688fe2209a98dB35c67a041524822Cf04ii')
      .replyWithError(new TypeError('Failed to fetch'))

    nock(OPEN_SEA_API)
      .get(/opensea\?url=https:\/\/api.opensea.io\/api\/v1\/assets\?owner=0x0DCD5D886577d5081B0c52e242Ef29E70Be3E7bc&limit=300/)
      .reply(200, {
        data: {
          assets: [
            {
              asset_contract: {
                address: '0x1d963688FE2209A98db35c67A041524822CF04gg',
                name: 'Name GG',
                symbol: 'GG',
                image_url: 'url GG',
                total_supply: 10,
                description: 'Description GG',
              },
              description: 'Description 2577',
              image_original_url: 'image/2577.png',
              name: 'ID 2577',
              token_id: '2577',
            },
            {
              asset_contract: {
                address: '0x1d963688FE2209A98db35c67A041524822CF04ii',
                name: 'Name II',
                symbol: 'II',
                image_url: 'url II',
                total_supply: 10,
                description: 'Description II',
              },
              description: 'Description 2578',
              image_original_url: 'image/2578.png',
              name: 'ID 2578',
              token_id: '2578',
            },
            {
              asset_contract: {
                address: '0x1d963688FE2209A98db35c67A041524822CF04hh',
                name: 'Name HH',
                symbol: 'HH',
                image_url: 'url HH',
                total_supply: 10,
                description: 'Description HH',
              },
              description: 'Description 2574',
              image_original_url: 'image/2574.png',
              name: 'ID 2574',
              token_id: '2574',
            },
          ],
        },
      })
  })

  afterEach(() => {
    sandbox.reset()
    nock.cleanAll()
  })

  it('should poll and detect assets on interval while on mainnet', () =>
    new Promise((resolve) => {
      const clock = sandbox.useFakeTimers()
      const localNetwork = new NetworkController()
      const networkControllerProviderConfig = {
        getAccounts: noop,
      }
      localNetwork.initializeProvider(networkControllerProviderConfig)
      localNetwork.setProviderType(MAINNET)

      const assetCtrlr = new AssetsDetectionController({ network: localNetwork, selectedAddress: TEST_ADDRESS })
      const mockCollectibles = sandbox.stub(assetCtrlr, 'detectCollectibles')
      clock.tick(60000)
      sandbox.assert.calledOnce(mockCollectibles)
      clock.tick(60000)
      sandbox.assert.calledTwice(mockCollectibles)
      mockCollectibles.restore()
      resolve()
    }))

  it('should detect mainnet correctly', () => {
    network.setProviderType(MAINNET)
    assert(assetsDetection.isMainnet() === true)
    network.setProviderType(ROPSTEN)
    assert(assetsDetection.isMainnet() === false)
  })

  it('should not autodetect while not on mainnet', () =>
    new Promise((resolve) => {
      const clock = sandbox.useFakeTimers()
      const localNetwork = new NetworkController()
      const networkControllerProviderConfig = {
        getAccounts: noop,
      }
      localNetwork.initializeProvider(networkControllerProviderConfig)
      localNetwork.setProviderType(ROPSTEN)

      const assetCtrlr = new AssetsDetectionController({ network: localNetwork, selectedAddress: TEST_ADDRESS })
      assetCtrlr.selectedAddress = TEST_ADDRESS
      const mockCollectibles = sandbox.stub(assetCtrlr, 'detectCollectibles')
      clock.tick(60000)
      sandbox.assert.notCalled(mockCollectibles)
      mockCollectibles.restore()
      resolve()
    }))

  it('should start detection when selected address changes', () =>
    new Promise((resolve) => {
      const clock = sandbox.useFakeTimers()
      const localNetwork = new NetworkController()
      const networkControllerProviderConfig = {
        getAccounts: noop,
      }
      localNetwork.initializeProvider(networkControllerProviderConfig)
      localNetwork.setProviderType(MAINNET)

      const assetCtrlr = new AssetsDetectionController({ network: localNetwork })
      const mockCollectibles = sandbox.stub(assetCtrlr, 'detectCollectibles')
      assetCtrlr.startAssetDetection(TEST_ADDRESS)
      clock.tick(1)
      sandbox.assert.calledOnce(mockCollectibles)
      mockCollectibles.restore()
      resolve()
    }))

  it('should restart detection', () =>
    new Promise((resolve) => {
      const clock = sandbox.useFakeTimers()
      const localNetwork = new NetworkController()
      const networkControllerProviderConfig = {
        getAccounts: noop,
      }
      localNetwork.initializeProvider(networkControllerProviderConfig)
      localNetwork.setProviderType(MAINNET)

      const assetCtrlr = new AssetsDetectionController({ network: localNetwork })
      const mockCollectibles = sandbox.stub(assetCtrlr, 'detectCollectibles')
      clock.tick(1)
      sandbox.assert.notCalled(mockCollectibles)
      assetCtrlr.startAssetDetection(TEST_ADDRESS)
      clock.tick(1)
      sandbox.assert.calledOnce(mockCollectibles)
      assetCtrlr.restartAssetDetection()
      clock.tick(1)
      sandbox.assert.calledTwice(mockCollectibles)
      mockCollectibles.restore()
      resolve()
    }))

  it('should detect and add collectibles correctly', async () => {
    network.setProviderType(MAINNET)
    assetsDetection.selectedAddress = TEST_ADDRESS
    await assetsDetection.detectCollectibles()
    assert.deepStrictEqual(assets.state.collectibles, [
      {
        address: '0x1d963688FE2209A98db35c67A041524822CF04gg',
        tokenId: '2577',
        name: 'ID 2577',
        image: 'url GG',
        description: 'Description 2577',
      },
      {
        address: '0x1d963688FE2209A98db35c67A041524822CF04ii',
        tokenId: '2578',
        name: 'ID 2578',
        image: 'url II',
        description: 'Description 2578',
      },
      {
        address: '0x1d963688FE2209A98db35c67A041524822CF04hh',
        tokenId: '2574',
        name: 'ID 2574',
        image: 'url HH',
        description: 'Description 2574',
      },
    ])
  })

  it('should not detect and add collectibles if there is no selectedAddress', async () => {
    await assetsDetection.detectCollectibles()
    assert.deepStrictEqual(assets.state.collectibles, [])
  })
})
