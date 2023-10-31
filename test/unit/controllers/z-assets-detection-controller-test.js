import assert from 'assert'
import { createSandbox } from 'sinon'
import { MockAgent, setGlobalDispatcher } from 'undici'

import config from '../../../src/config'
import AssetsContractController from '../../../src/controllers/AssetsContractController'
import AssetsController from '../../../src/controllers/AssetsController'
import AssetsDetectionController from '../../../src/controllers/AssetsDetectionController'
import NetworkController from '../../../src/controllers/network/NetworkController'
import PreferencesController from '../../../src/controllers/PreferencesController'
import { BSC_MAINNET, GOERLI, MAINNET, MATIC, MUMBAI } from '../../../src/utils/enums'
import * as utils from '../../../src/utils/utils'
import { userBalances } from '../../data/backend-nft-data'
import { openseaNfts } from '../../data/opensea-nft-data'

const noop = () => {}
const TEST_ADDRESS = '0x0DCD5D886577d5081B0c52e242Ef29E70Be3E7bc'
const TORUS_API = config.api
const OPEN_SEA_API = config.api

describe('AssetsDetectionController', () => {
  let assetsDetection
  let network
  let assets
  let assetsContract
  let prefsController
  const sandbox = createSandbox()
  let clock

  before(() => {
    clock = sandbox.useFakeTimers()
  })

  // let validateImageUrlStub

  beforeEach(async () => {
    network = new NetworkController()
    const networkControllerProviderConfig = {
      getAccounts: noop,
    }
    sandbox.stub(network, 'getLatestBlock').returns({})
    network.initializeProvider(networkControllerProviderConfig)
    network.setProviderType(MAINNET)

    prefsController = new PreferencesController({
      network,
    })
    sandbox.stub(prefsController, 'sync')
    sandbox.stub(prefsController, 'createUser')
    sandbox.stub(prefsController, 'storeUserLogin')
    prefsController.init({ address: TEST_ADDRESS, rehydrate: true, jwtToken: 'hello', dispatch: noop, commit: noop })
    prefsController.setSelectedAddress(TEST_ADDRESS)

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
      assetController: assets,
      getNfts: prefsController.getNfts.bind(prefsController),
      preferencesStore: prefsController.store,
      provider: network._providerProxy,
    })

    // do it only if the method is not already wrapped
    if (!utils.validateImageUrl.restore && !utils.validateImageUrl.restore?.sinon) {
      sandbox.stub(utils, 'validateImageUrl').returns(true)
    }
    const mockAgent = new MockAgent()
    setGlobalDispatcher(mockAgent)
    const torusMockPool = mockAgent.get(TORUS_API)
    // eth mainnet
    torusMockPool
      .intercept({ path: '/nfts?userAddress=0x0DCD5D886577d5081B0c52e242Ef29E70Be3E7bc&network=mainnet', method: 'get' })
      .defaultReplyHeaders({ 'content-type': 'application/json' })
      .reply(200, {
        data: userBalances['0x0DCD5D886577d5081B0c52e242Ef29E70Be3E7bc'],
      })
      .persist()

    // polygon
    torusMockPool
      .intercept({ path: '/nfts?userAddress=0x0DCD5D886577d5081B0c52e242Ef29E70Be3E7bc&network=matic', method: 'get' })
      .defaultReplyHeaders({ 'content-type': 'application/json' })
      .reply(200, {
        data: userBalances['0x0DCD5D886577d5081B0c52e242Ef29E70Be3E7bc'],
      })
      .persist(true)

    // polygon mumbai
    torusMockPool
      .intercept({ path: '/nfts?userAddress=0x0DCD5D886577d5081B0c52e242Ef29E70Be3E7bc&network=mumbai', method: 'get' })
      .defaultReplyHeaders({ 'content-type': 'application/json' })
      .reply(200, {
        data: userBalances['0x0DCD5D886577d5081B0c52e242Ef29E70Be3E7bc'],
      })
      .persist(true)

    // bsc mainnet
    torusMockPool
      .intercept({ path: '/nfts?userAddress=0x0DCD5D886577d5081B0c52e242Ef29E70Be3E7bc&network=bsc_mainnet', method: 'get' })
      .defaultReplyHeaders({ 'content-type': 'application/json' })
      .reply(200, {
        data: userBalances['0x0DCD5D886577d5081B0c52e242Ef29E70Be3E7bc'],
      })
      .persist(true)

    const openseaMockPool = mockAgent.get(OPEN_SEA_API)
    openseaMockPool
      .intercept({
        path: /opensea\?url=https:\/\/api.opensea.io\/api\/v1\/assets\?owner=0x0DCD5D886577d5081B0c52e242Ef29E70Be3E7bc&limit=300/,
        method: 'get',
      })
      .defaultReplyHeaders({ 'content-type': 'application/json' })
      .reply(200, {
        data: openseaNfts['0x0DCD5D886577d5081B0c52e242Ef29E70Be3E7bc'],
      })
      .persist(true)
  })

  afterEach(() => {
    sandbox.reset()
  })

  it('should poll and detect assets on interval while on mainnet, binance net, matic mainnet and matic testnet', () =>
    new Promise((resolve) => {
      const localNetwork = new NetworkController()
      const networkControllerProviderConfig = {
        getAccounts: noop,
      }
      sandbox.stub(localNetwork, 'getLatestBlock').returns({})
      localNetwork.initializeProvider(networkControllerProviderConfig)
      localNetwork.setProviderType(MAINNET)

      const assetsController = new AssetsController({
        selectedAddress: TEST_ADDRESS,
        assetContractController: assetsContract,
        network,
        getNftMetadata: prefsController.getNftMetadata.bind(prefsController),
      })
      const assetCtrlr = new AssetsDetectionController({
        assetController: assetsController,
        network: localNetwork,
        selectedAddress: TEST_ADDRESS,
        provider: localNetwork._providerProxy,
      })
      const mockCollectibles = sandbox.stub(assetCtrlr, 'detectCollectibles')
      clock.tick(60_000)
      sandbox.assert.calledOnce(mockCollectibles)
      clock.tick(60_000)
      sandbox.assert.calledTwice(mockCollectibles)
      localNetwork.setProviderType(BSC_MAINNET)
      clock.tick(60_000)
      sandbox.assert.calledThrice(mockCollectibles)
      localNetwork.setProviderType(MATIC)
      clock.tick(60_000)
      sandbox.assert.callCount(mockCollectibles, 4)
      localNetwork.setProviderType(MUMBAI)
      clock.tick(60_000)
      sandbox.assert.callCount(mockCollectibles, 5)
      mockCollectibles.restore()
      resolve()
    }))

  it('should detect mainnet correctly', () => {
    network.setProviderType(MAINNET)
    assert(assetsDetection.isMainnet() === true)
    network.setProviderType(GOERLI)
    assert(assetsDetection.isMainnet() === false)
  })

  it('should start detection when selected address changes', () =>
    new Promise((resolve) => {
      const localNetwork = new NetworkController()
      const networkControllerProviderConfig = {
        getAccounts: noop,
      }
      sandbox.stub(localNetwork, 'getLatestBlock').returns({})
      localNetwork.initializeProvider(networkControllerProviderConfig)
      localNetwork.setProviderType(MAINNET)
      const assetController = new AssetsController({
        selectedAddress: TEST_ADDRESS,
        assetContractController: assetsContract,
        network,
        getNftMetadata: prefsController.getNftMetadata.bind(prefsController),
      })
      const assetCtrlr = new AssetsDetectionController({ assetController, network: localNetwork, provider: localNetwork._providerProxy })
      const mockCollectibles = sandbox.stub(assetCtrlr, 'detectCollectibles')
      assetCtrlr.startAssetDetection(TEST_ADDRESS)
      clock.tick(1)
      sandbox.assert.calledOnce(mockCollectibles)
      mockCollectibles.restore()
      resolve()
    }))

  it('should restart detection', () =>
    new Promise((resolve) => {
      const localNetwork = new NetworkController()
      const networkControllerProviderConfig = {
        getAccounts: noop,
      }
      sandbox.stub(localNetwork, 'getLatestBlock').returns({})
      localNetwork.initializeProvider(networkControllerProviderConfig)
      localNetwork.setProviderType(MAINNET)
      const assetController = new AssetsController({
        selectedAddress: TEST_ADDRESS,
        assetContractController: assetsContract,
        network,
        getNftMetadata: prefsController.getNftMetadata.bind(prefsController),
      })
      const assetCtrlr = new AssetsDetectionController({ assetController, network: localNetwork, provider: localNetwork._providerProxy })
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
        collectibleIndex: '0x1d963688FE2209A98db35c67A041524822CF04gg_2577',
        video: undefined,
      },
      {
        address: '0x1d963688FE2209A98db35c67A041524822CF04ii',
        tokenId: '2578',
        name: 'ID 2578',
        image: 'url II',
        standard: 'erc721',
        tokenBalance: '1',
        description: 'Description 2578',
        collectibleIndex: '0x1d963688FE2209A98db35c67A041524822CF04ii_2578',
        video: undefined,
      },
      {
        address: '0x1d963688FE2209A98db35c67A041524822CF04hh',
        tokenId: '2574',
        name: 'ID 2574',
        image: 'url HH',
        standard: 'erc721',
        tokenBalance: '1',
        description: 'Description 2574',
        collectibleIndex: '0x1d963688FE2209A98db35c67A041524822CF04hh_2574',
        video: undefined,
      },
    ]

    const expectedContracts = [
      {
        standard: 'erc721',
        address: '0x1d963688FE2209A98db35c67A041524822CF04gg',
        description: '',
        logo: 'url',
        name: 'MARBLE-NFT (ERC721)',
        symbol: 'MRBLNFT1',
      },
      {
        standard: 'erc721',
        address: '0x1d963688FE2209A98db35c67A041524822CF04ii',
        description: '',
        logo: 'url',
        name: 'MARBLE-NFT (ERC721)',
        symbol: 'MRBLNFT2',
      },
      {
        standard: 'erc721',
        address: '0x1d963688FE2209A98db35c67A041524822CF04hh',
        description: '',
        logo: 'url',
        name: 'MARBLE-NFT (ERC721)',
        symbol: 'MRBLNFT3',
      },
    ]
    assert.deepStrictEqual(assets.state.collectibles, expectedCollectibles)
    assert.deepStrictEqual(assets.state.collectibleContracts, expectedContracts)

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
