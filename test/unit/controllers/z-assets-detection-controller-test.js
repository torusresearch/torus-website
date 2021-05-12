import assert from 'assert'
import nock from 'nock'
import { createSandbox } from 'sinon'

import config from '../../../src/config'
import AssetsContractController from '../../../src/controllers/AssetsContractController'
import AssetsController from '../../../src/controllers/AssetsController'
import AssetsDetectionController from '../../../src/controllers/AssetsDetectionController'
import NetworkController from '../../../src/controllers/NetworkController'
import PreferencesController from '../../../src/controllers/PreferencesController'

const MAINNET = 'mainnet'
const ROPSTEN = 'ropsten'
const noop = () => {}
const TEST_ADDRESS = '0x0DCD5D886577d5081B0c52e242Ef29E70Be3E7bc'
const COVALENT_API = config.api
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
      getCollectibleMetadata: prefsController.getCollectibleMetadata.bind(prefsController),
    })

    assetsDetection = new AssetsDetectionController({
      network,
      assetContractController: assetsContract,
      assetController: assets,
      getCovalentNfts: prefsController.getCovalentNfts.bind(prefsController),
    })
    nock(COVALENT_API)
      .get('/covalent?url=https://api.covalenthq.com/v1/1/address/0x0DCD5D886577d5081B0c52e242Ef29E70Be3E7bc/balances_v2/')
      .reply(200, {
        data: {
          data: {
            address: '0x0DCD5D886577d5081B0c52e242Ef29E70Be3E7bc',
            updated_at: '2021-05-11T18:42:05.805590708Z',
            next_update_at: '2021-05-11T18:47:05.805591268Z',
            quote_currency: 'USD',
            chain_id: 1,
            items: [
              {
                contract_decimals: 0,
                contract_name: 'MARBLE-NFT',
                contract_ticker_symbol: 'MRBLNFT',
                contract_address: '0x1d963688FE2209A98db35c67A041524822CF04gg',
                supports_erc: ['erc20', 'erc721'],
                logo_url: 'url',
                type: 'nft',
                balance: '2',
                quote_rate: 0,
                quote: 0,
                nft_data: [
                  {
                    token_id: '2577',
                    token_balance: '1',
                    token_url: 'https://ws.marble.cards/marble/token/11740',
                    supports_erc: ['erc20', 'erc721'],
                    token_price_wei: null,
                    token_quote_rate_eth: null,
                    external_data: {
                      name: 'ID 2577',
                      description: 'Description 2577',
                      image: 'url GG',
                      owner: '0x0DCD5D886577d5081B0c52e242Ef29E70Be3E7bc',
                    },
                    owner: '0x0DCD5D886577d5081B0c52e242Ef29E70Be3E7bc',
                  },
                ],
              },
              {
                contract_decimals: 0,
                contract_name: 'MARBLE-NFT',
                contract_ticker_symbol: 'MRBLNFT',
                contract_address: '0x1d963688FE2209A98db35c67A041524822CF04ii',
                supports_erc: ['erc20', 'erc721'],
                logo_url: 'url',
                type: 'nft',
                balance: '2',
                quote_rate: 0,
                quote: 0,
                nft_data: [
                  {
                    token_id: '2578',
                    token_balance: '1',
                    token_url: 'https://ws.marble.cards/marble/token/11740',
                    supports_erc: ['erc20', 'erc721'],
                    token_price_wei: null,
                    token_quote_rate_eth: null,
                    external_data: {
                      name: 'ID 2578',
                      description: 'Description 2578',
                      image: 'url II',
                      owner: '0x0DCD5D886577d5081B0c52e242Ef29E70Be3E7bc',
                    },
                    owner: '0x0DCD5D886577d5081B0c52e242Ef29E70Be3E7bc',
                  },
                ],
              },
              {
                contract_decimals: 0,
                contract_name: 'MARBLE-NFT',
                contract_ticker_symbol: 'MRBLNFT',
                contract_address: '0x1d963688FE2209A98db35c67A041524822CF04hh',
                supports_erc: ['erc20', 'erc721'],
                logo_url: 'url',
                type: 'nft',
                balance: '2',
                quote_rate: 0,
                quote: 0,
                nft_data: [
                  {
                    token_id: '2574',
                    token_balance: '1',
                    token_url: 'https://ws.marble.cards/marble/token/11740',
                    supports_erc: ['erc20', 'erc721'],
                    token_price_wei: null,
                    token_quote_rate_eth: null,
                    external_data: {
                      name: 'ID 2574',
                      description: 'Description 2574',
                      image: 'url HH',
                      external_url: 'https://marble.cards/card/11740',
                      owner: '0x0DCD5D886577d5081B0c52e242Ef29E70Be3E7bc',
                    },
                    owner: '0x0DCD5D886577d5081B0c52e242Ef29E70Be3E7bc',
                  },
                ],
              },
            ],
          },
        },
      })
      .persist(true)

    nock(COVALENT_API)
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

    nock(COVALENT_API)
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

    nock(COVALENT_API)
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

    nock(COVALENT_API)
      .get('/opensea?url=https://api.opensea.io/api/v1/asset_contract/0x1d963688FE2209A98db35c67A041524822CF04gg')
      .replyWithError(new TypeError('Failed to fetch'))

    nock(COVALENT_API)
      .get('/opensea?url=https://api.opensea.io/api/v1/asset_contract/0x1D963688fe2209a98dB35c67a041524822Cf04ii')
      .replyWithError(new TypeError('Failed to fetch'))

    nock(COVALENT_API)
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
    ])
  })

  it('should not detect and add collectibles if there is no selectedAddress', async () => {
    await assetsDetection.detectCollectibles()
    assert.deepStrictEqual(assets.state.collectibles, [])
  })
})
