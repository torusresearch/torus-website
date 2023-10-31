/* eslint-disable */
import assert from 'assert'
import sinon from 'sinon'
import { MockAgent, setGlobalDispatcher } from 'undici'

import PreferencesController from '../../../src/controllers/PreferencesController'
import NetworkController from '../../../src/controllers/network/NetworkController'
import { ACCOUNT_TYPE, THEME_LIGHT_BLUE_NAME } from '../../../src/utils/enums'
import config from '../../../src/config'

const TORUS_API = config.api
const noop = () => {}

const testAccount = {
  key: '08506248462eadf53f05b6c3577627071757644b3a0547315788357ec93e7b77',
  address: '0xa12164FeD66719297D2cF407bb314D07FEb12C02',
}

const testAccount2 = {
  key: '357a5188cb0f748f62f59b6eac31b9d386b9f7f2c87f567f0dae5eed8b8a9d9c',
  address: '0x43CE12056AA1E8372ab4aBF0C0cC658D2d41077f',
}

describe('Preferences Controller', () => {
  let preferencesController
  let network
  let sandbox = sinon.createSandbox()
  let storeUserLoginStub
  let mockAgent

  const networkControllerProviderConfig = {
    getAccounts: noop,
  }

  beforeEach(() => {
    network = new NetworkController()
    sandbox.stub(network, 'getLatestBlock').returns({})
    network.initializeProvider(networkControllerProviderConfig)
    preferencesController = new PreferencesController({ signMessage: noop, network, provider: network.getProviderAndBlockTracker().provider })
    storeUserLoginStub = sandbox.stub(preferencesController, 'storeUserLogin')
    mockAgent = new MockAgent()
    setGlobalDispatcher(mockAgent)

    const mockPool = mockAgent.get(TORUS_API)

    mockPool
      .intercept({
        path: '/auth/message',
        method: 'post',
        body: (body) => JSON.parse(body).public_address === testAccount.address || JSON.parse(body).public_address === testAccount2.address,
      })
      .defaultReplyHeaders({ 'content-type': 'application/json' })
      .reply(200, {
        message: 'Torus Signin - 1099860997997549',
        success: true,
      })

    mockPool
      .intercept({ path: '/auth/verify', method: 'post', body: (body) => JSON.parse(body).public_address === testAccount.address })
      .defaultReplyHeaders({ 'content-type': 'application/json' })
      .reply(200, {
        token: 'hello',
        success: true,
      })

    mockPool
      .intercept({ path: '/auth/verify', method: 'post', body: (body) => JSON.parse(body).public_address === testAccount2.address })
      .defaultReplyHeaders({ 'content-type': 'application/json' })
      .reply(200, {
        token: 'hello2',
        success: true,
      })

    mockPool
      .intercept({ path: '/user', method: 'post', body: (_) => true })
      .defaultReplyHeaders({ 'content-type': 'application/json' })
      .reply(200, {})
      .persist()
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('fresh init correctly', async () => {
    const syncStub = sandbox.stub(preferencesController, 'sync')
    const defaultAddress = await preferencesController.init({ address: testAccount.address, dispatch: noop, commit: noop })
    const state = preferencesController.state(testAccount.address)
    sandbox.assert.calledOnce(storeUserLoginStub)
    sandbox.assert.calledOnce(syncStub)
    assert.strictEqual(defaultAddress, testAccount.address, 'Wrong default address')
    assert.deepStrictEqual(state, {
      theme: THEME_LIGHT_BLUE_NAME,
      accountType: ACCOUNT_TYPE.NORMAL,
      defaultPublicAddress: testAccount.address,
      customTokens: [],
      customNfts: [],
      selectedCurrency: 'USD',
      locale: 'en',
      contacts: [],
      permissions: [],
      jwtToken: 'hello',
      fetchedPastTx: [],
      pastTransactions: [],
      paymentTx: [],
    })
  })

  it('fresh init twice correctly', async () => {
    const syncStub = sandbox.stub(preferencesController, 'sync')
    const defaultAddresses = await Promise.all([
      preferencesController.init({ address: testAccount.address, dispatch: noop, commit: noop }),
      preferencesController.init({ address: testAccount2.address, dispatch: noop, commit: noop }),
    ])
    const state1 = preferencesController.state(testAccount.address)
    const state2 = preferencesController.state(testAccount2.address)
    sandbox.assert.calledTwice(storeUserLoginStub)
    sandbox.assert.calledTwice(syncStub)
    assert.strictEqual(defaultAddresses[0], testAccount.address, 'Wrong default address')
    assert.strictEqual(defaultAddresses[1], testAccount2.address, 'Wrong default address 2')
    assert.deepStrictEqual(state1, {
      theme: THEME_LIGHT_BLUE_NAME,
      accountType: ACCOUNT_TYPE.NORMAL,
      defaultPublicAddress: testAccount.address,
      customTokens: [],
      customNfts: [],
      selectedCurrency: 'USD',
      locale: 'en',
      contacts: [],
      permissions: [],
      jwtToken: 'hello',
      fetchedPastTx: [],
      pastTransactions: [],
      paymentTx: [],
    })
    assert.deepStrictEqual(state2, {
      theme: THEME_LIGHT_BLUE_NAME,
      accountType: ACCOUNT_TYPE.NORMAL,
      defaultPublicAddress: testAccount2.address,
      customTokens: [],
      customNfts: [],
      selectedCurrency: 'USD',
      locale: 'en',
      contacts: [],
      permissions: [],
      jwtToken: 'hello2',
      fetchedPastTx: [],
      pastTransactions: [],
      paymentTx: [],
    })
  })

  it('init with jwt should set jwt correctly', async () => {
    const getMessageForSigningStub = sandbox.stub(preferencesController, 'getMessageForSigning')
    const syncStub = sandbox.stub(preferencesController, 'sync')
    const defaultAddress = await preferencesController.init({
      address: testAccount.address,
      jwtToken: 'hello3',
      rehydrate: true,
      dispatch: noop,
      commit: noop,
    })
    sandbox.assert.notCalled(getMessageForSigningStub)
    const state = preferencesController.state(testAccount.address)
    sandbox.assert.calledOnce(syncStub)
    sandbox.assert.notCalled(storeUserLoginStub)
    assert.strictEqual(defaultAddress, testAccount.address, 'Wrong default address')
    assert.deepStrictEqual(state, {
      theme: THEME_LIGHT_BLUE_NAME,
      accountType: ACCOUNT_TYPE.NORMAL,
      defaultPublicAddress: testAccount.address,
      customTokens: [],
      customNfts: [],
      selectedCurrency: 'USD',
      locale: 'en',
      contacts: [],
      permissions: [],
      jwtToken: 'hello3',
      fetchedPastTx: [],
      pastTransactions: [],
      paymentTx: [],
    })
    assert.deepStrictEqual(preferencesController.headers(testAccount.address), {
      headers: {
        Authorization: 'Bearer hello3',
        'Content-Type': 'application/json; charset=utf-8',
      },
    })
  })

  it('should handle success correctly', () => {
    const successMessage = 'YAY SUCCESS'
    const clock = sandbox.useFakeTimers()
    preferencesController.handleSuccess(successMessage)
    assert.strictEqual(preferencesController.successStore.getState(), successMessage)
    clock.tick(5 * 1000)
    assert.strictEqual(preferencesController.successStore.getState(), '')
  })

  it('should handle success object correctly', () => {
    const successMessage = { message: 'YAY SUCCESS' }
    const clock = sandbox.useFakeTimers()
    preferencesController.handleSuccess(successMessage)
    assert.strictEqual(preferencesController.successStore.getState(), 'Success: \nmessage: YAY SUCCESS')
    clock.tick(5 * 1000)
    assert.strictEqual(preferencesController.successStore.getState(), '')
  })

  it('should handle error correctly', () => {
    const errorMessage = 'NOO ERROR'
    const clock = sandbox.useFakeTimers()
    preferencesController.handleError(errorMessage)
    assert.strictEqual(preferencesController.errorStore.getState(), errorMessage)
    clock.tick(5 * 1000)
    assert.strictEqual(preferencesController.errorStore.getState(), '')
  })

  it('should handle error object correctly', () => {
    const errorMessage = { message: 'NOO ERROR' }
    const clock = sandbox.useFakeTimers()
    preferencesController.handleError(errorMessage)
    assert.strictEqual(preferencesController.errorStore.getState(), 'Error: \nmessage: NOO ERROR')
    clock.tick(5 * 1000)
    assert.strictEqual(preferencesController.errorStore.getState(), '')
  })

  describe('theme, locale, currency, billboard, contact', () => {
    let handleSuccessStub
    beforeEach(async () => {
      await preferencesController.init({ address: testAccount.address, jwtToken: 'hello', dispatch: noop, commit: noop })
      preferencesController.setSelectedAddress(testAccount.address)
      mockAgent = new MockAgent()
      setGlobalDispatcher(mockAgent)

      const mockPool = mockAgent.get(TORUS_API)

      mockPool
        .intercept({ path: '/user/theme', method: 'patch' })
        .defaultReplyHeaders({ 'content-type': 'application/json' })
        .reply(201, { data: { theme: '' } })

      mockPool
        .intercept({ path: '/user/locale', method: 'patch' })
        .defaultReplyHeaders({ 'content-type': 'application/json' })
        .reply(201, { data: { locale: '' } })

      mockPool
        .intercept({ path: '/user', method: 'patch' })
        .defaultReplyHeaders({ 'content-type': 'application/json' })
        .reply(201, { data: { default_currency: '' } })

      mockPool
        .intercept({ path: '/billboard', method: 'get' })
        .defaultReplyHeaders({ 'content-type': 'application/json' })
        .reply(200, {
          data: [
            {
              eventName: '여기 당신이 할 수있는 일이 있습니다',
              imageUrl: 'https://google.com/logo.png',
              description: '특집 앱 확인-DeFiZap',
              callToActionLink: 'https://google.com',
              callToActionText: 'DeFiZap 방문',
              locale: 'ko',
            },
          ],
          success: true,
        })

      mockPool
        .intercept({ path: '/contact', method: 'post' })
        .defaultReplyHeaders({ 'content-type': 'application/json' })
        .reply(201, {
          data: {
            id: 1,
            verifier: 'google',
            contact: 'hello@tor.us',
            name: 'torus',
          },
          success: true,
        })

      mockPool
        .intercept({ path: '/contact/1', method: 'delete' })
        .defaultReplyHeaders({ 'content-type': 'application/json' })
        .reply(200, {
          data: {
            id: 1,
          },
          success: true,
        })

      mockPool
        .intercept({ path: '/customtoken', method: 'post' })
        .defaultReplyHeaders({ 'content-type': 'application/json' })
        .reply(201, {
          data: {
            token_address: '0x',
            network: 'mainnet',
            token_symbol: 'KNC',
            decimals: 18,
            token_name: 'Kyber network token',
            id: 1,
          },
          success: true,
        })

      mockPool
        .intercept({ path: '/customtoken/1', method: 'delete' })
        .defaultReplyHeaders({ 'content-type': 'application/json' })
        .reply(200, {
          data: {
            id: 1,
          },
          success: true,
        })

      mockPool
        .intercept({ path: '/customnft', method: 'post' })
        .defaultReplyHeaders({ 'content-type': 'application/json' })
        .reply(201, {
          data: {
            nft_address: '0xf0ee6b27b759c9893ce4f094b49ad28fd15a23e4',
            network: 'goerli',
            nft_name: 'ETHERMON',
            nft_image_link: 'https://ethermon.ipfs.io/abcd.jpg',
            nft_id: '10019029019901',
            nft_contract_standard: 'ERC721',
            description: 'test desc',
            balance: 1,
          },
          success: true,
        })

      mockPool
        .intercept({ path: '/customnft/1', method: 'delete' })
        .defaultReplyHeaders({ 'content-type': 'application/json' })
        .reply(200, {
          data: {
            id: 1,
          },
          success: true,
        })

      mockPool.intercept({ path: '/user/badge', method: 'patch' }).defaultReplyHeaders({ 'content-type': 'application/json' }).reply(200, {
        success: true,
      })

      handleSuccessStub = sandbox.stub(preferencesController, 'handleSuccess')
    })
    afterEach(() => {
      sandbox.restore()
    })

    it('set user theme fail', async () => {
      preferencesController.updateStore({ theme: 'light' })
      await preferencesController.setUserTheme('light')
      assert(handleSuccessStub.notCalled)
      assert.strictEqual(preferencesController.state().theme, 'light')
    })

    it('set user theme success', async () => {
      preferencesController.updateStore({ theme: 'light' })
      await preferencesController.setUserTheme('dark')
      assert(handleSuccessStub.calledOnce)
      assert.strictEqual(preferencesController.state().theme, 'dark')
    })

    it('set user locale fail', async () => {
      preferencesController.updateStore({ locale: 'en' })
      await preferencesController.setUserLocale('en')
      assert(handleSuccessStub.notCalled)
      assert.strictEqual(preferencesController.state().locale, 'en')
    })

    it('set user locale success', async () => {
      preferencesController.updateStore({ locale: 'en' })
      await preferencesController.setUserLocale('jp')
      // assert(handleSuccessStub.calledOnce)
      assert.strictEqual(preferencesController.state().locale, 'jp')
    })

    it('set user currency fail', async () => {
      preferencesController.updateStore({ selectedCurrency: 'USD' })
      await preferencesController.setSelectedCurrency({ selectedCurrency: 'USD' })
      // assert(handleSuccessStub.notCalled)
      assert.strictEqual(preferencesController.state().selectedCurrency, 'USD')
    })

    it('set user currency success', async () => {
      preferencesController.updateStore({ selectedCurrency: 'USD' })
      await preferencesController.setSelectedCurrency({ selectedCurrency: 'YEN' })
      assert(handleSuccessStub.calledOnce)
      assert.strictEqual(preferencesController.state().selectedCurrency, 'YEN')
    })

    it('gets billboard data', async () => {
      await preferencesController.getBillboardContents()
      assert.strictEqual(Object.keys(preferencesController.billboardStore.getState()).length, 1)
    })

    it('add contact', async () => {
      await preferencesController.addContact({ verifier: 'google', contact: 'hello@tor.us', name: 'torus' })
      assert(handleSuccessStub.calledOnce)
      assert.deepStrictEqual(preferencesController.state().contacts, [{ verifier: 'google', contact: 'hello@tor.us', name: 'torus', id: 1 }])
    })

    it('delete contact', async () => {
      await preferencesController.deleteContact(1)
      assert(handleSuccessStub.calledOnce)
      assert.deepStrictEqual(preferencesController.state().contacts, [])
    })

    it('add custom token', async () => {
      await preferencesController.addCustomToken({
        token_address: '0x',
        network: 'mainnet',
        token_symbol: 'KNC',
        decimals: 18,
        token_name: 'Kyber network token',
      })
      assert(handleSuccessStub.calledOnce)
      assert.deepStrictEqual(preferencesController.state().customTokens, [
        { token_address: '0x', network: 'mainnet', token_symbol: 'KNC', decimals: 18, token_name: 'Kyber network token', id: 1 },
      ])
    })

    it('delete custom token', async () => {
      await preferencesController.deleteCustomToken(1)
      assert(handleSuccessStub.calledOnce)
      assert.deepStrictEqual(preferencesController.state().customTokens, [])
    })

    it('add custom nft', async () => {
      await preferencesController.addCustomNft({
        nft_address: '0xf0ee6b27b759c9893ce4f094b49ad28fd15a23e4',
        network: 'goerli',
        nft_name: 'ETHERMON',
        nft_image_link: 'https://ethermon.ipfs.io/abcd.jpg',
        nft_id: '10019029019901',
        nft_contract_standard: 'ERC721',
        description: 'test desc',
        balance: 1,
        id: 1,
      })
      assert(handleSuccessStub.calledOnce)
      assert.deepStrictEqual(preferencesController.state().customNfts, [
        {
          description: 'test desc',
          balance: 1,
          nft_address: '0xf0ee6b27b759c9893ce4f094b49ad28fd15a23e4',
          network: 'goerli',
          nft_name: 'ETHERMON',
          nft_image_link: 'https://ethermon.ipfs.io/abcd.jpg',
          nft_id: '10019029019901',
          nft_contract_standard: 'ERC721',
          id: 1,
        },
      ])
    })
    it('sets default address correctly', async () => {
      await preferencesController.setDefaultPublicAddress(testAccount.address, testAccount2.address)
      assert.strictEqual(preferencesController.state(testAccount.address).defaultPublicAddress, testAccount2.address)
    })

    it('setSelectedAddress', async () => {
      preferencesController.setSelectedAddress(testAccount.address)
      assert.strictEqual(preferencesController.store.getState().selectedAddress, testAccount.address)
    })
  })

  it('setSiteMetadata', async () => {
    preferencesController.setSiteMetadata('google.com', { name: 'google' })
    assert.deepStrictEqual(preferencesController.metadataStore.getState(), { 'google.com': { name: 'google' } })
  })

  it('should not poll user without selectedaddress', async () => {
    const clock = sandbox.useFakeTimers()
    const prefsController = new PreferencesController()
    sandbox.stub(prefsController, 'storeUserLogin')
    const mockSync = sandbox.stub(prefsController, 'sync')
    clock.tick(180000)
    sandbox.assert.notCalled(mockSync)
    clock.tick(180000)
    sandbox.assert.notCalled(mockSync)
    sandbox.restore()
  })

  it('should not poll user without jwt', async () => {
    const clock = sandbox.useFakeTimers()
    const prefsController = new PreferencesController()
    sandbox.stub(prefsController, 'storeUserLogin')
    prefsController.setSelectedAddress(testAccount.address)
    const mockSync = sandbox.stub(prefsController, 'sync')
    clock.tick(180000)
    sandbox.assert.notCalled(mockSync)
    clock.tick(180000)
    sandbox.assert.notCalled(mockSync)
    sandbox.restore()
  })

  it('should poll user with jwt & selected address', async () => {
    const clock = sandbox.useFakeTimers()
    network = new NetworkController()
    sandbox.stub(network, 'getLatestBlock').returns({})
    network.initializeProvider(networkControllerProviderConfig)
    const prefsController = new PreferencesController({ interval: 100, network })
    sandbox.stub(prefsController, 'storeUserLogin')
    await prefsController.init({ address: testAccount.address, jwtToken: 'hello', commit: noop, dispatch: noop })
    prefsController.setSelectedAddress(testAccount.address)
    const mockSync = sandbox.stub(prefsController, 'sync')
    clock.tick(100)
    sandbox.assert.calledOnce(mockSync)
    clock.tick(100)
    sandbox.assert.calledTwice(mockSync)
    sandbox.restore()
  })
})
