/* eslint-disable */
import assert from 'assert'
import nock from 'nock'
import { createSandbox } from 'sinon'

import AssetsContractController from '../../../src/controllers/AssetsContractController'
import AssetsController from '../../../src/controllers/AssetsController'
import NetworkController from '../../../src/controllers/NetworkController'
import PreferencesController from '../../../src/controllers/PreferencesController'

const noop = () => {}
const KUDOSADDRESS = '0x2aea4add166ebf38b63d09a75de1a7b94aa24163'
const TEST_ADDRESS = '0x0DCD5D886577d5081B0c52e242Ef29E70Be3E7bc'
const TEST_ADDRESS_2 = '0xec1adf982415d2ef5ec55899b9bfb8bc0f29251b'
const TEST_ADDRESS_3 = '0xeb9e64b93097bc15f01f13eae97015c57ab64823'
const OPEN_SEA_API = `https://api.tor.us`

const testAccount = {
  key: '08506248462eadf53f05b6c3577627071757644b3a0547315788357ec93e7b77',
  address: '0xa12164FeD66719297D2cF407bb314D07FEb12C02',
}
describe('AssetsController', () => {
  let assetsController
  let network
  let assetsContract
  let prefsController
  const sandbox = createSandbox()

  beforeEach(async () => {
    network = new NetworkController()
    prefsController = new PreferencesController()
    sandbox.stub(prefsController, 'sync')
    sandbox.stub(prefsController, 'createUser')
    await prefsController.init({ address: testAccount.address, rehydrate: true, jwtToken: 'hello', dispatch: noop, commit: noop })
    prefsController.setSelectedAddress(testAccount.address)
    const networkControllerProviderConfig = {
      getAccounts: noop,
    }
    network.initializeProvider(networkControllerProviderConfig)
    network.setProviderType('mainnet')
    assetsContract = new AssetsContractController({
      provider: network._providerProxy,
    })
    assetsController = new AssetsController({
      selectedAddress: TEST_ADDRESS,
      assetContractController: assetsContract,
      network,
      getOpenSeaCollectibles: prefsController.getOpenSeaCollectibles.bind(prefsController),
    })
    nock(OPEN_SEA_API)
      .get('/opensea?url=https://api.opensea.io/api/v1/asset_contract/foo')
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
      .get('/opensea?url=https://api.opensea.io/api/v1/asset_contract/fou')
      .reply(200, {
        data: {
          description: 'Description',
          image_url: 'url',
          name: 'Name',
          symbol: 'FOU',
          total_supply: 10,
        },
      })

    nock(OPEN_SEA_API)
      .get('/opensea?url=https://api.opensea.io/api/v1/asset/foo/1')
      .reply(200, {
        data: {
          description: 'Description',
          image_original_url: 'url',
          name: 'Name',
        },
      })
    nock(OPEN_SEA_API)
      .get('/opensea?url=https://api.opensea.io/api/v1/asset/0x2aEa4Add166EBf38b63d09a75dE1a7b94Aa24163/1203')
      .reply(200, {
        data: {
          description: 'Kudos Description',
          image_original_url: 'Kudos url',
          name: 'Kudos Name',
        },
      })
    nock('https://ipfs.gitcoin.co:443').get('/api/v0/cat/QmPmt6EAaioN78ECnW5oCL8v2YvVSpoBjLCjrXhhsAvoov').reply(200, {
      image: 'Kudos Image',
      name: 'Kudos Name',
    })
    nock(OPEN_SEA_API)
      .get('/opensea?url=https://api.opensea.io/api/v1/asset/0x6EbeAf8e8E946F0716E6533A6f2cefc83f60e8Ab/798958393')
      .replyWithError(new TypeError('failed to fetch'))

    nock(OPEN_SEA_API)
      .get('/opensea?url=https://api.opensea.io/api/v1/asset_contract/0x6EbeAf8e8E946F0716E6533A6f2cefc83f60e8Ab')
      .replyWithError(new TypeError('failed to fetch'))

    nock(OPEN_SEA_API)
      .get('/opensea?url=https://api.opensea.io/api/v1/asset_contract/0x2aEa4Add166EBf38b63d09a75dE1a7b94Aa24163')
      .reply(200, {
        data: {
          description: 'Kudos Description',
          image_url: 'Kudos url',
          name: 'Kudos',
          symbol: 'KDO',
          total_supply: 10,
        },
      })
  })

  afterEach(() => {
    sandbox.reset()
    nock.cleanAll()
  })

  it('should set default state', () => {
    const { state } = assetsController
    assert.deepStrictEqual(state, {
      allCollectibleContracts: {},
      allCollectibles: {},
      allTokens: {},
      collectibleContracts: [],
      collectibles: [],
      tokens: [],
    })
  })

  it('should add token', async () => {
    await assetsController.addToken('foo', 'bar', 2, '')
    assert.deepStrictEqual(assetsController.state.tokens[0], {
      address: 'foo',
      decimals: 2,
      symbol: 'bar',
      image: '',
    })
    await assetsController.addToken('foo', 'baz', 2, '')
    assert.deepStrictEqual(assetsController.state.tokens[0], {
      address: 'foo',
      decimals: 2,
      symbol: 'baz',
      image: '',
    })
  })

  it('should add token by selected address', async () => {
    assetsController.setSelectedAddress(TEST_ADDRESS_2)
    await assetsController.addToken('foo', 'bar', 2, '')
    assetsController.setSelectedAddress(TEST_ADDRESS_3)
    assert(assetsController.state.tokens.length === 0)
    assetsController.setSelectedAddress(TEST_ADDRESS_2)
    assert.deepStrictEqual(assetsController.state.tokens[0], {
      address: 'foo',
      decimals: 2,
      symbol: 'bar',
      image: '',
    })
  })

  it('should add token by provider type', async () => {
    const firstNetworkType = 'rinkeby'
    const secondNetworkType = 'ropsten'
    network.setProviderType(firstNetworkType)
    await assetsController.addToken('foo', 'bar', 2, '')
    network.setProviderType(secondNetworkType)
    assert(assetsController.state.tokens.length === 0)
    network.setProviderType(firstNetworkType)
    assert.deepStrictEqual(assetsController.state.tokens[0], {
      address: 'foo',
      decimals: 2,
      symbol: 'bar',
      image: '',
    })
  })

  it('should add collectible and collectible contract', async () => {
    await assetsController.addCollectible('foo', '1', { name: 'name', image: 'image', description: 'description' }, false)
    assert.deepStrictEqual(assetsController.state.collectibles[0], {
      address: 'foo',
      description: 'description',
      image: 'image',
      name: 'name',
      tokenId: '1',
    })
    assert.deepStrictEqual(assetsController.state.collectibleContracts[0], {
      address: 'foo',
      description: 'Description',
      logo: 'url',
      name: 'Name',
      symbol: 'FOO',
      totalSupply: 0,
    })
  })

  it('should not duplicate collectible nor collectible contract if already added', async () => {
    await assetsController.addCollectible('foo', '1', { name: 'name', image: 'image', description: 'description' })
    await assetsController.addCollectible('foo', '1', { name: 'name', image: 'image', description: 'description' })
    assert(assetsController.state.collectibles.length === 1)
    assert(assetsController.state.collectibleContracts.length === 1)
  })

  it('should not add collectible contract if collectible contract already exists', async () => {
    await assetsController.addCollectible('foo', '1', { name: 'name', image: 'image', description: 'description' })
    await assetsController.addCollectible('foo', '2', { name: 'name', image: 'image', description: 'description' })
    assert(assetsController.state.collectibles.length === 2)
    assert(assetsController.state.collectibleContracts.length === 1)
  })

  it('should add collectible and get information from OpenSea', async () => {
    await assetsController.addCollectible('foo', '1')
    assert.deepStrictEqual(assetsController.state.collectibles[0], {
      address: 'foo',
      description: 'Description',
      image: 'url',
      name: 'Name',
      tokenId: '1',
    })
  })

  // it('should add collectible and get collectible contract information from contract', async () => {
  //   sandbox.stub(assetsController, 'getCollectibleContractInformationFromApi').returns(undefined)
  //   sandbox.stub(assetsController, 'getCollectibleInformationFromApi').returns(undefined)
  //   nock.enableNetConnect()
  //   await assetsController.addCollectible(KUDOSADDRESS, 1203)
  //   assert.deepStrictEqual(assetsController.state.collectibles[0], {
  //     address: '0x2aea4add166ebf38b63d09a75de1a7b94aa24163',
  //     description: undefined,
  //     image: 'Kudos Image',
  //     name: 'Kudos Name',
  //     tokenId: 1203
  //   })
  //   assert.deepStrictEqual(assetsController.state.collectibleContracts[0], {
  //     address: '0x2aea4add166ebf38b63d09a75de1a7b94aa24163',
  //     description: undefined,
  //     logo: undefined,
  //     name: 'KudosToken',
  //     symbol: 'KDO',
  //     totalSupply: undefined
  //   })
  //   nock.disableNetConnect()
  //   nock.enableNetConnect(host => host.includes('localhost') || host.includes('mainnet.infura.io:443'))
  // })

  it('should add collectible by selected address', async () => {
    const firstAddress = TEST_ADDRESS_2
    const secondAddress = TEST_ADDRESS_3
    sandbox.stub(assetsController, 'getCollectibleInformation').returns({ name: 'name', image: 'url', description: 'description' })
    assetsController.setSelectedAddress(firstAddress)
    await assetsController.addCollectible('foo', '1234')
    assetsController.setSelectedAddress(secondAddress)
    await assetsController.addCollectible('fou', '4321')
    assetsController.setSelectedAddress(firstAddress)
    assert.deepStrictEqual(assetsController.state.collectibles[0], {
      address: 'foo',
      description: 'description',
      image: 'url',
      name: 'name',
      tokenId: '1234',
    })
  })

  it('should add collectible by provider type', async () => {
    const firstNetworkType = 'rinkeby'
    const secondNetworkType = 'ropsten'
    sandbox.stub(assetsController, 'getCollectibleInformation').returns({ name: 'name', image: 'url', description: 'description' })
    network.setProviderType(firstNetworkType)
    await assetsController.addCollectible('foo', '1234')
    network.setProviderType(secondNetworkType)
    assert(assetsController.state.collectibles.length === 0)
    network.setProviderType(firstNetworkType)
    assert.deepStrictEqual(assetsController.state.collectibles[0], {
      address: 'foo',
      description: 'description',
      image: 'url',
      name: 'name',
      tokenId: '1234',
    })
  })

  it('should not add collectibles with no contract information when auto detecting', async () => {
    await assetsController.addCollectible('0x6EbeAf8e8E946F0716E6533A6f2cefc83f60e8Ab', '123', undefined, true)
    assert.deepStrictEqual(assetsController.state.collectibles, [])
    assert.deepStrictEqual(assetsController.state.collectibleContracts, [])
    await assetsController.addCollectible('0x2aEa4Add166EBf38b63d09a75dE1a7b94Aa24163', '1203', undefined, true)
    assert.deepStrictEqual(assetsController.state.collectibles, [
      {
        address: '0x2aEa4Add166EBf38b63d09a75dE1a7b94Aa24163',
        description: 'Kudos Description',
        image: 'Kudos url',
        name: 'Kudos Name',
        tokenId: '1203',
      },
    ])
    assert.deepStrictEqual(assetsController.state.collectibleContracts, [
      {
        address: '0x2aEa4Add166EBf38b63d09a75dE1a7b94Aa24163',
        description: 'Kudos Description',
        logo: 'Kudos url',
        name: 'Kudos',
        symbol: 'KDO',
        totalSupply: 10,
      },
    ])
  })
})
