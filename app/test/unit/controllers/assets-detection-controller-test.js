import assert from 'assert'
import fetchMock from 'fetch-mock'
import { createSandbox } from 'sinon'

import AssetsContractController from '../../../src/controllers/AssetsContractController'
import AssetsController from '../../../src/controllers/AssetsController'
import AssetsDetectionController from '../../../src/controllers/AssetsDetectionController'
import NetworkController from '../../../src/controllers/NetworkController'

const MAINNET = 'mainnet'
const ROPSTEN = 'ropsten'
const noop = () => {}
const TEST_ADDRESS = '0x0DCD5D886577d5081B0c52e242Ef29E70Be3E7bc'
const OPEN_SEA_API = 'https://api.tor.us/opensea?url=https://api.opensea.io/api/v1/'

describe('AssetsDetectionController', () => {
  let assetsDetection
  let network
  let assets
  let assetsContract
  const sandbox = createSandbox()

  beforeEach(() => {
    network = new NetworkController()
    const networkControllerProviderConfig = {
      getAccounts: noop
    }
    network.initializeProvider(networkControllerProviderConfig)
    network.setProviderType('mainnet')

    assetsContract = new AssetsContractController({
      provider: network._providerProxy
    })
    assets = new AssetsController({
      selectedAddress: TEST_ADDRESS,
      assetContractController: assetsContract,
      network
    })
    assets.setJwtToken('hello')

    assetsDetection = new AssetsDetectionController({
      network,
      assetContractController: assetsContract,
      assetController: assets
    })

    fetchMock.getOnce(
      `${OPEN_SEA_API}${'asset_contract/0x1d963688FE2209A98dB35C67A041524822Cf04ff'}`,
      () => ({
        body: JSON.stringify({
          data: {
            description: 'Description',
            image_url: 'url',
            name: 'Name',
            symbol: 'FOO',
            total_supply: 0
          }
        })
      }),
      { overwriteRoutes: true, method: 'GET' }
    )

    fetchMock.get(
      `${OPEN_SEA_API}${'assets?owner=0x2&limit=300'}`,
      () => ({
        body: JSON.stringify({
          data: {
            assets: [
              {
                asset_contract: {
                  address: '0x1d963688fe2209a98db35c67a041524822cf04ff',
                  name: 'Name FF',
                  symbol: 'FF',
                  image_url: 'url FF',
                  total_supply: 10,
                  description: 'Description FF'
                },
                description: 'Description 2577',
                image_original_url: 'image/2577.png',
                name: 'ID 2577',
                token_id: '2577'
              }
            ]
          }
        })
      }),
      { overwriteRoutes: true, method: 'GET' }
    )

    fetchMock.getOnce(
      `${OPEN_SEA_API}assets?owner=${TEST_ADDRESS}&limit=300 `,
      () => ({
        body: JSON.stringify({
          data: {
            assets: [
              {
                asset_contract: {
                  address: '0x1d963688fe2209a98db35c67a041524822cf04ff',
                  name: 'Name FF',
                  symbol: 'FF',
                  image_url: 'url FF',
                  total_supply: 10,
                  description: 'Description FF'
                },
                description: 'Description 2577',
                image_original_url: 'image/2577.png',
                name: 'ID 2577',
                token_id: '2577'
              },
              {
                asset_contract: {
                  address: '0x1d963688fe2209a98db35c67a041524822cf04ff',
                  name: 'Name FF',
                  symbol: 'FF',
                  image_url: 'url FF',
                  total_supply: 10,
                  description: 'Description FF'
                },
                description: 'Description 2574',
                image_original_url: 'image/2574.png',
                name: 'ID 2574',
                token_id: '2574'
              }
            ]
          }
        })
      }),
      { overwriteRoutes: true, method: 'GET' }
    )

    fetchMock.getOnce(
      `${OPEN_SEA_API}${'asset_contract/0x1D963688FE2209A98db35c67A041524822cf04Hh'}`,
      () => ({
        body: JSON.stringify({
          data: {
            description: 'Description HH',
            image_url: 'url HH',
            name: 'Name HH',
            symbol: 'HH',
            total_supply: 10
          }
        })
      }),
      { overwriteRoutes: true, method: 'GET' }
    )

    fetchMock.getOnce(
      `${OPEN_SEA_API}${'asset_contract/0x1d963688FE2209A98db35c67A041524822CF04gg'} `,
      () => ({
        throws: new TypeError('Failed to fetch')
      }),
      { overwriteRoutes: true, method: 'GET' }
    )

    fetchMock.getOnce(
      `${OPEN_SEA_API}${'asset_contract/0x1D963688fe2209a98dB35c67a041524822Cf04ii'}`,
      () => ({
        throws: new TypeError('Failed to fetch')
      }),
      { overwriteRoutes: true, method: 'GET' }
    )

    fetchMock.getOnce(
      `${OPEN_SEA_API}assets?owner=${TEST_ADDRESS}&limit=300`,
      () => ({
        body: JSON.stringify({
          data: {
            assets: [
              {
                asset_contract: {
                  address: '0x1d963688FE2209A98db35c67A041524822CF04gg',
                  name: 'Name GG',
                  symbol: 'GG',
                  image_url: 'url GG',
                  total_supply: 10,
                  description: 'Description GG'
                },
                description: 'Description 2577',
                image_original_url: 'image/2577.png',
                name: 'ID 2577',
                token_id: '2577'
              },
              {
                asset_contract: {
                  address: '0x1d963688FE2209A98db35c67A041524822CF04ii',
                  name: 'Name II',
                  symbol: 'II',
                  image_url: 'url II',
                  total_supply: 10,
                  description: 'Description II'
                },
                description: 'Description 2578',
                image_original_url: 'image/2578.png',
                name: 'ID 2578',
                token_id: '2578'
              },
              {
                asset_contract: {
                  address: '0x1d963688FE2209A98db35c67A041524822CF04hh',
                  name: 'Name HH',
                  symbol: 'HH',
                  image_url: 'url HH',
                  total_supply: 10,
                  description: 'Description HH'
                },
                description: 'Description 2574',
                image_original_url: 'image/2574.png',
                name: 'ID 2574',
                token_id: '2574'
              }
            ]
          }
        })
      }),
      { overwriteRoutes: true, method: 'GET' }
    )
  })

  afterEach(() => {
    sandbox.reset()
  })

  it('should detect mainnet correctly', () => {
    network.setProviderType(MAINNET)
    assert(assetsDetection.isMainnet() === true)
    network.setProviderType(ROPSTEN)
    assert(assetsDetection.isMainnet() === false)
  })

  it('should detect and add collectibles correctly', async () => {
    network.setProviderType(MAINNET)
    assetsDetection.selectedAddress = TEST_ADDRESS
    await assetsDetection.detectCollectibles()
    assert.deepStrictEqual(assets.state.collectibles, [
      {
        address: '0x1d963688FE2209A98db35c67A041524822CF04gg',
        tokenId: 2577,
        name: 'ID 2577',
        image: 'url GG',
        description: 'Description 2577'
      },
      {
        address: '0x1d963688FE2209A98db35c67A041524822CF04ii',
        tokenId: 2578,
        name: 'ID 2578',
        image: 'url II',
        description: 'Description 2578'
      },
      {
        address: '0x1d963688FE2209A98db35c67A041524822CF04hh',
        tokenId: 2574,
        name: 'ID 2574',
        image: 'url HH',
        description: 'Description 2574'
      }
    ])
  })

  it('should not detect and add collectibles if there is no selectedAddress', async () => {
    await assetsDetection.detectCollectibles()
    assert.deepStrictEqual(assets.state.collectibles, [])
  })
})
