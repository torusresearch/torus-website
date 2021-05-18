import assert from 'assert'
import nock from 'nock'
import { createSandbox } from 'sinon'

import AssetsContractController from '../../../src/controllers/AssetsContractController'
import AssetsController from '../../../src/controllers/AssetsController'
import AssetsDetectionController from '../../../src/controllers/AssetsDetectionController'
import NetworkController from '../../../src/controllers/NetworkController'
import PreferencesController from '../../../src/controllers/PreferencesController'
import { BSC_MAINNET, MAINNET, MATIC, MUMBAI } from '../../../src/utils/enums'
import { userBalances } from '../../data/covalent-nft-data'

const ROPSTEN = 'ropsten'
const noop = () => {}
const TEST_ADDRESS = '0x0DCD5D886577d5081B0c52e242Ef29E70Be3E7bc'
const COVALENT_API = 'https://api.covalenthq.com'

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
    sandbox.stub(prefsController, 'storeUserLogin')
    await prefsController.init({ address: testAccount.address, rehydrate: true, jwtToken: 'hello', dispatch: noop, commit: noop })
    prefsController.setSelectedAddress(testAccount.address)

    assetsContract = new AssetsContractController({
      provider: network._providerProxy,
    })
    assets = new AssetsController({
      selectedAddress: TEST_ADDRESS,
      assetContractController: assetsContract,
      network,
      getNftMetadata: prefsController.getNftMetadata.bind(prefsController),
    })

    assetsDetection = new AssetsDetectionController({
      network,
      assetContractController: assetsContract,
      assetController: assets,
      getCovalentNfts: prefsController.getCovalentNfts.bind(prefsController),
    })

    // eth mainnet
    nock(COVALENT_API)
      .get('/v1/1/address/0x0DCD5D886577d5081B0c52e242Ef29E70Be3E7bc/balances_v2/?nft=true&no-nft-fetch=false')
      .reply(200, {
        data: userBalances['0x0DCD5D886577d5081B0c52e242Ef29E70Be3E7bc'],
      })
      .persist(true)

    // polygon
    nock(COVALENT_API)
      .get('/v1/137/address/0x0DCD5D886577d5081B0c52e242Ef29E70Be3E7bc/balances_v2/?nft=true&no-nft-fetch=false')
      .reply(200, {
        data: userBalances['0x0DCD5D886577d5081B0c52e242Ef29E70Be3E7bc'],
      })
      .persist(true)

    // polygon mumbai
    nock(COVALENT_API)
      .get('/v1/80001/address/0x0DCD5D886577d5081B0c52e242Ef29E70Be3E7bc/balances_v2/?nft=true&no-nft-fetch=false')
      .reply(200, {
        data: userBalances['0x0DCD5D886577d5081B0c52e242Ef29E70Be3E7bc'],
      })
      .persist(true)

    // bsc mainnet
    nock(COVALENT_API)
      .get('/v1/56/address/0x0DCD5D886577d5081B0c52e242Ef29E70Be3E7bc/balances_v2/?nft=true&no-nft-fetch=false')
      .reply(200, {
        data: userBalances['0x0DCD5D886577d5081B0c52e242Ef29E70Be3E7bc'],
      })
      .persist(true)
  })

  afterEach(() => {
    sandbox.reset()
    nock.cleanAll()
  })

  it('should poll and detect assets on interval while on mainnet, binance net, matic mainnet and matic testnet', () =>
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
      localNetwork.setProviderType(BSC_MAINNET)
      clock.tick(60000)
      sandbox.assert.calledThrice(mockCollectibles)
      localNetwork.setProviderType(MATIC)
      clock.tick(60000)
      sandbox.assert.callCount(mockCollectibles, 4)
      localNetwork.setProviderType(MUMBAI)
      clock.tick(60000)
      sandbox.assert.callCount(mockCollectibles, 5)
      mockCollectibles.restore()
      resolve()
    }))

  it('should detect mainnet correctly', () => {
    network.setProviderType(MAINNET)
    assert(assetsDetection.isMainnet() === true)
    network.setProviderType(ROPSTEN)
    assert(assetsDetection.isMainnet() === false)
  })

  it('should not autodetect while not on covalent supported networks(ie. bsc, matic, mainnet, matic mumbai)', () =>
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

  it('should detect and add erc721 and erc1155 collectibles correctly', async () => {
    network.setProviderType(MAINNET)
    assetsDetection.selectedAddress = TEST_ADDRESS
    await assetsDetection.detectCollectibles()
    const expectedCollectibles = [
      {
        address: '0x1d963688FE2209A98db35c67A041524822CF04gg',
        tokenId: '2577',
        name: 'ID 2577',
        image: 'url GG',
        standard: 'erc721',
        tokenBalance: '1',
        description: 'Description 2577',
      },
      {
        address: '0x1d963688FE2209A98db35c67A041524822CF04ii',
        tokenId: '2578',
        name: 'ID 2578',
        image: 'url II',
        standard: 'erc721',
        tokenBalance: '1',
        description: 'Description 2578',
      },
      {
        address: '0x1d963688FE2209A98db35c67A041524822CF04hh',
        tokenId: '2574',
        name: 'ID 2574',
        image: 'url HH',
        standard: 'erc721',
        tokenBalance: '1',
        description: 'Description 2574',
      },
      {
        address: '0x1d963688FE2209A98db35c67A041524822CF04jj',
        tokenId: '2579',
        name: 'ID 2579',
        image: 'url GG',
        standard: 'erc1155',
        tokenBalance: '10',
        description: 'Description 2579',
      },
      {
        address: '0x1d963688FE2209A98db35c67A041524822CF04kk',
        tokenId: '2580',
        name: 'ID 2580',
        image: 'url II',
        standard: 'erc1155',
        tokenBalance: '10',
        description: 'Description 2580',
      },
      {
        address: '0x1d963688FE2209A98db35c67A041524822CF04ll',
        tokenId: '2581',
        name: 'ID 2581',
        image: 'url HH',
        standard: 'erc1155',
        tokenBalance: '1',
        description: 'Description 2581',
      },
    ]
    assert.deepStrictEqual(assets.state.collectibles, expectedCollectibles)
    network.setProviderType(MUMBAI)
    assert.deepStrictEqual(assets.state.collectibles, [])
    await assetsDetection.detectCollectibles()
    assert.deepStrictEqual(assets.state.collectibles, expectedCollectibles)
    network.setProviderType(MATIC)
    assert.deepStrictEqual(assets.state.collectibles, [])
    await assetsDetection.detectCollectibles()
    assert.deepStrictEqual(assets.state.collectibles, expectedCollectibles)
    network.setProviderType(BSC_MAINNET)
    assert.deepStrictEqual(assets.state.collectibles, [])
    await assetsDetection.detectCollectibles()
    assert.deepStrictEqual(assets.state.collectibles, expectedCollectibles)
  })

  it('should not detect and add collectibles if there is no selectedAddress', async () => {
    await assetsDetection.detectCollectibles()
    assert.deepStrictEqual(assets.state.collectibles, [])
  })
})
