/* eslint-disable */
import assert from 'assert'
import nock from 'nock'
import sinon from 'sinon'

import PreferencesController from '../../../src/controllers/PreferencesController'
import NetworkController from '../../../src/controllers/NetworkController'
import { ACCOUNT_TYPE, THEME_LIGHT_BLUE_NAME } from '../../../src/utils/enums'

const TORUS_API = `https://api.tor.us`
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

  const networkControllerProviderConfig = {
    getAccounts: noop,
  }

  beforeEach(() => {
    nock.cleanAll()
    nock.enableNetConnect()
    network = new NetworkController()
    network.initializeProvider(networkControllerProviderConfig)
    preferencesController = new PreferencesController({ signMessage: noop, network, provider: network.getProviderAndBlockTracker().provider })

    nock(TORUS_API)
      .post('/auth/message', (body) => body.public_address === testAccount.address || body.public_address === testAccount2.address)
      .reply(200, {
        message: 'Torus Signin - 1099860997997549',
        success: true,
      })
      .persist()

    nock(TORUS_API)
      .post('/auth/verify', (body) => body.public_address === testAccount.address)
      .reply(200, {
        token: 'hello',
        success: true,
      })

    nock(TORUS_API)
      .post('/auth/verify', (body) => body.public_address === testAccount2.address)
      .reply(200, {
        token: 'hello2',
        success: true,
      })

    nock(TORUS_API)
      .post('/user', (_) => true)
      .reply(200, {})
      .persist()
  })

  afterEach(() => {
    nock.cleanAll()
    sandbox.restore()
  })

  it('fresh init correctly', async () => {
    const storeUserLoginStub = sandbox.stub(preferencesController, 'storeUserLogin')
    const syncStub = sandbox.stub(preferencesController, 'sync')
    const defaultAddress = await preferencesController.init({ address: testAccount.address, dispatch: noop, commit: noop })
    const state = preferencesController.state(testAccount.address)
    sandbox.assert.calledOnce(storeUserLoginStub)
    sandbox.assert.calledOnce(syncStub)
    assert.strictEqual(defaultAddress, testAccount.address, 'Wrong default address')
    assert.deepStrictEqual(state, {
      theme: THEME_LIGHT_BLUE_NAME,
      tKeyOnboardingComplete: false,
      accountType: ACCOUNT_TYPE.NORMAL,
      defaultPublicAddress: testAccount.address,
      selectedCurrency: 'USD',
      locale: 'en',
      contacts: [],
      permissions: [],
      badgesCompletion: {},
      jwtToken: 'hello',
      fetchedPastTx: [],
      pastTransactions: [],
      paymentTx: [],
    })
  })

  it('fresh init twice correctly', async () => {
    const storeUserLoginStub = sandbox.stub(preferencesController, 'storeUserLogin')
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
      tKeyOnboardingComplete: false,
      accountType: ACCOUNT_TYPE.NORMAL,
      defaultPublicAddress: testAccount.address,
      selectedCurrency: 'USD',
      locale: 'en',
      contacts: [],
      permissions: [],
      badgesCompletion: {},
      jwtToken: 'hello',
      fetchedPastTx: [],
      pastTransactions: [],
      paymentTx: [],
    })
    assert.deepStrictEqual(state2, {
      theme: THEME_LIGHT_BLUE_NAME,
      tKeyOnboardingComplete: false,
      accountType: ACCOUNT_TYPE.NORMAL,
      defaultPublicAddress: testAccount2.address,
      selectedCurrency: 'USD',
      locale: 'en',
      contacts: [],
      permissions: [],
      badgesCompletion: {},
      jwtToken: 'hello2',
      fetchedPastTx: [],
      pastTransactions: [],
      paymentTx: [],
    })
  })

  it('init with jwt should set jwt correctly', async () => {
    const getMessageForSigningStub = sandbox.stub(preferencesController, 'getMessageForSigning')
    const storeUserLoginStub = sandbox.stub(preferencesController, 'storeUserLogin')
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
      tKeyOnboardingComplete: false,
      accountType: ACCOUNT_TYPE.NORMAL,
      defaultPublicAddress: testAccount.address,
      selectedCurrency: 'USD',
      locale: 'en',
      contacts: [],
      permissions: [],
      badgesCompletion: {},
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

  // describe('sync', () => {
  //   beforeEach(() => {
  //     sandbox.stub(preferencesController, 'calculatePaymentTx')
  //     sandbox.stub(preferencesController, 'calculatePastTx')
  //   })
  //   afterEach(() => {
  //     sandbox.restore()
  //   })
  //   it('user sync error', async () => {
  //     nock('https://api.tor.us').get(/.*/).replyWithError(new TypeError('Invalid request'))

  //     nock('https://common-api.tor.us').get('/transaction').reply(200, {
  //       data: {},
  //     })

  //     const successCallback = sinon.fake()
  //     const errorCallback = sinon.fake()
  //     await preferencesController.sync(successCallback, errorCallback)
  //     assert(errorCallback.calledOnce)
  //     assert(successCallback.notCalled)
  //   })

  //   it('payment sync error', async () => {
  //     sandbox.stub(preferencesController, 'setVerifier')

  //     nock('https://api.tor.us')
  //       .get(/transaction/)
  //       .reply(400)

  //     nock('https://api.tor.us')
  //       .get(/etherscan/)
  //       .reply(400)

  //     nock('https://api.tor.us').get(/user/).reply(200, { data: {} })

  //     nock('https://common-api.tor.us').get(/.*/).reply(400)

  //     const successCallback = sinon.fake()
  //     const errorCallback = sinon.fake()
  //     await preferencesController.sync(successCallback, errorCallback)
  //     assert(errorCallback.notCalled)
  //     assert(successCallback.calledOnce)
  //   })

  //   it('sync success', async () => {
  //     const userData = {
  //       transactions: [],
  //       default_currency: 'USD',
  //       contacts: [],
  //       theme: 'light',
  //       locale: 'en',
  //       verifier: 'google',
  //       verifier_id: 'hc@njv.com',
  //       permissions: {},
  //     }
  //     nock('https://api.tor.us').get(/user/).reply(200, {
  //       data: userData,
  //     })

  //     nock('https://api.tor.us')
  //       .get(/transaction/)
  //       .reply(200, {
  //         data: [],
  //       })

  //     nock('https://api.tor.us')
  //       .get(/etherscan/)
  //       .reply(200, {
  //         data: [],
  //       })

  //     nock('https://common-api.tor.us').get('/transaction').reply(200, {
  //       data: [],
  //     })

  //     await preferencesController.sync()
  //     assert.deepStrictEqual(preferencesController.pastTransactionsStore.getState(), userData.transactions)
  //     assert.deepStrictEqual(preferencesController.state.selectedCurrency, userData.default_currency)
  //     assert.deepStrictEqual(preferencesController.state.contacts, userData.contacts)
  //     assert.deepStrictEqual(preferencesController.state.theme, userData.theme)
  //     assert.deepStrictEqual(preferencesController.state.locale, userData.locale)
  //     assert.deepStrictEqual(preferencesController.state.theme, userData.theme)
  //     assert.deepStrictEqual(preferencesController.state.permissions, userData.permissions)
  //     assert.deepStrictEqual(preferencesController.paymentTxStore.getState(), [])
  //   })
  // })

  describe('theme, locale, currency, billboard, contact', () => {
    let handleSuccessStub
    beforeEach(async () => {
      await preferencesController.init({ address: testAccount.address, jwtToken: 'hello', dispatch: noop, commit: noop })
      preferencesController.setSelectedAddress(testAccount.address)
      nock('https://api.tor.us')
        .patch('/user/theme')
        .reply(201, { data: { theme: '' } })

      nock('https://api.tor.us')
        .patch('/user/locale')
        .reply(201, { data: { locale: '' } })

      nock('https://api.tor.us')
        .patch('/user')
        .reply(201, { data: { default_currency: '' } })

      nock('https://api.tor.us')
        .get('/billboard')
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

      nock('https://api.tor.us')
        .post('/contact')
        .reply(201, {
          data: {
            id: 1,
            verifier: 'google',
            contact: 'hello@tor.us',
            name: 'torus',
          },
          success: true,
        })

      nock('https://api.tor.us')
        .delete('/contact/1')
        .reply(200, {
          data: {
            id: 1,
          },
          success: true,
        })

      nock('https://api.tor.us').patch('/user/badge').reply(200, { success: true })

      handleSuccessStub = sandbox.stub(preferencesController, 'handleSuccess')
    })
    afterEach(() => {
      sandbox.restore()
      nock.cleanAll()
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

    it('sets default address correctly', async () => {
      await preferencesController.setDefaultPublicAddress(testAccount.address, testAccount2.address)
      assert.strictEqual(preferencesController.state(testAccount.address).defaultPublicAddress, testAccount2.address)
    })

    it('sets user badge', async () => {
      await preferencesController.setUserBadge('hello')
      assert.deepStrictEqual(preferencesController.state().badgesCompletion, { hello: true })
    })

    it('sets user onboarding status', async () => {
      await preferencesController.setTKeyOnboardingStatus(true, testAccount.address)
      assert.deepStrictEqual(preferencesController.state().tKeyOnboardingComplete, true)
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
    const prefsController = new PreferencesController({ interval: 100 })
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
