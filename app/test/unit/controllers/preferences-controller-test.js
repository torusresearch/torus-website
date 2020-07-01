/* eslint-disable */
import assert from 'assert'
import nock from 'nock'
import sinon from 'sinon'

import PreferencesController from '../../../src/controllers/PreferencesController'

const noop = () => {}

describe('Preferences Controller', () => {
  let preferencesController
  let sandbox = sinon.createSandbox()

  beforeEach(() => {
    preferencesController = new PreferencesController()
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    nock.cleanAll()
    sandbox.restore()
  })

  it('get headers correctly', () => {
    const billboardStub = sandbox.stub(preferencesController, 'getBillboardContents')
    preferencesController.jwtToken = 'hello'

    sandbox.assert.calledOnce(billboardStub)
    assert.equal(preferencesController._jwtToken, 'hello')
    assert.deepStrictEqual(preferencesController.headers, {
      headers: {
        Authorization: 'Bearer hello',
        'Content-Type': 'application/json; charset=utf-8',
      },
    })
  })

  it('should handle success correctly', () => {
    const successMessage = 'YAY SUCCESS'
    const clock = sandbox.useFakeTimers()
    preferencesController.handleSuccess(successMessage)
    assert.equal(preferencesController.successStore.getState(), successMessage)
    clock.tick(5 * 1000)
    assert.equal(preferencesController.successStore.getState(), '')
  })

  it('should handle success object correctly', () => {
    const successMessage = { message: 'YAY SUCCESS' }
    const clock = sandbox.useFakeTimers()
    preferencesController.handleSuccess(successMessage)
    assert.equal(preferencesController.successStore.getState(), 'Success: \nmessage: YAY SUCCESS')
    clock.tick(5 * 1000)
    assert.equal(preferencesController.successStore.getState(), '')
  })

  it('should handle error correctly', () => {
    const errorMessage = 'NOO ERROR'
    const clock = sandbox.useFakeTimers()
    preferencesController.handleError(errorMessage)
    assert.equal(preferencesController.errorStore.getState(), errorMessage)
    clock.tick(5 * 1000)
    assert.equal(preferencesController.errorStore.getState(), '')
  })

  it('should handle error object correctly', () => {
    const errorMessage = { message: 'NOO ERROR' }
    const clock = sandbox.useFakeTimers()
    preferencesController.handleError(errorMessage)
    assert.equal(preferencesController.errorStore.getState(), 'Error: \nmessage: NOO ERROR')
    clock.tick(5 * 1000)
    assert.equal(preferencesController.errorStore.getState(), '')
  })

  describe('sync', () => {
    beforeEach(() => {
      sandbox.stub(preferencesController, 'calculatePaymentTx')
      sandbox.stub(preferencesController, 'calculatePastTx')
      sandbox.stub(preferencesController, 'calculateEtherscanTx')
    })
    afterEach(() => {
      sandbox.restore()
    })
    it('user sync error', async () => {
      nock('https://api.tor.us').get(/.*/).replyWithError(new TypeError('Invalid request')).log(noop)
      nock('https://common-api.tor.us')
        .get('/transaction')
        .reply(200, {
          data: {},
        })
        .log(noop)
      const successCallback = sinon.fake()
      const errorCallback = sinon.fake()
      await preferencesController.sync(successCallback, errorCallback)
      assert(errorCallback.calledOnce)
      assert(successCallback.notCalled)
    })

    it('payment sync error', async () => {
      sandbox.stub(preferencesController, 'setVerifier')

      nock('https://api.tor.us')
        .get(/transaction/)
        .reply(400)
        .log(noop)

      nock('https://api.tor.us')
        .get(/etherscan/)
        .reply(400)
        .log(noop)

      nock('https://api.tor.us').get(/user/).reply(200, { data: {} }).log(noop)

      nock('https://common-api.tor.us').get(/.*/).reply(400).log(noop)
      const successCallback = sinon.fake()
      const errorCallback = sinon.fake()
      await preferencesController.sync(successCallback, errorCallback)
      assert(errorCallback.notCalled)
      assert(successCallback.calledOnce)
    })

    it('sync success', async () => {
      const userData = {
        transactions: [],
        default_currency: 'USD',
        contacts: [],
        theme: 'light',
        locale: 'en',
        verifier: 'google',
        verifier_id: 'hc@njv.com',
        permissions: {},
      }
      nock('https://api.tor.us')
        .get(/user/)
        .reply(200, {
          data: userData,
        })
        .log(noop)

      nock('https://api.tor.us')
        .get(/transaction/)
        .reply(200, {
          data: [],
        })
        .log(noop)

      nock('https://api.tor.us')
        .get(/etherscan/)
        .reply(200, {
          data: [],
        })
        .log(noop)

      nock('https://common-api.tor.us')
        .get('/transaction')
        .reply(200, {
          data: [],
        })
        .log(noop)
      await preferencesController.sync()
      assert.deepStrictEqual(preferencesController.pastTransactionsStore.getState(), userData.transactions)
      assert.deepStrictEqual(preferencesController.state.selectedCurrency, userData.default_currency)
      assert.deepStrictEqual(preferencesController.state.contacts, userData.contacts)
      assert.deepStrictEqual(preferencesController.state.theme, userData.theme)
      assert.deepStrictEqual(preferencesController.state.locale, userData.locale)
      assert.deepStrictEqual(preferencesController.state.theme, userData.theme)
      assert.deepStrictEqual(preferencesController.state.permissions, userData.permissions)
      assert.deepStrictEqual(preferencesController.paymentTxStore.getState(), [])
    })
  })

  describe('theme, locale, currency, billboard, contact', () => {
    let handleSuccessStub
    beforeEach(() => {
      nock('https://api.tor.us')
        .patch('/user/theme')
        .reply(201, { data: { theme: '' } })
        .log(noop)
      nock('https://api.tor.us')
        .patch('/user/locale')
        .reply(201, { data: { locale: '' } })
        .log(noop)
      nock('https://api.tor.us')
        .patch('/user')
        .reply(201, { data: { default_currency: '' } })
        .log(noop)
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
        .log(noop)
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
        .log(noop)
      nock('https://api.tor.us')
        .delete('/contact/1')
        .reply(200, {
          data: {
            id: 1,
          },
          success: true,
        })
        .log(noop)
      handleSuccessStub = sandbox.stub(preferencesController, 'handleSuccess')
    })
    afterEach(() => {
      sandbox.restore()
      nock.cleanAll()
    })

    it('set user theme fail', async () => {
      preferencesController.store.updateState({ theme: 'light' })
      await preferencesController.setUserTheme('light')
      assert(handleSuccessStub.notCalled)
      assert.equal(preferencesController.state.theme, 'light')
    })

    it('set user theme success', async () => {
      preferencesController.store.updateState({ theme: 'light' })
      await preferencesController.setUserTheme('dark')
      assert(handleSuccessStub.calledOnce)
      assert.equal(preferencesController.state.theme, 'dark')
    })

    it('set user locale fail', async () => {
      preferencesController.store.updateState({ locale: 'en' })
      await preferencesController.setUserLocale('en')
      assert(handleSuccessStub.notCalled)
      assert.equal(preferencesController.state.locale, 'en')
    })

    it('set user locale success', async () => {
      preferencesController.store.updateState({ locale: 'en' })
      await preferencesController.setUserLocale('jp')
      // assert(handleSuccessStub.calledOnce)
      assert.equal(preferencesController.state.locale, 'jp')
    })

    it('set user currency fail', async () => {
      preferencesController.store.updateState({ selectedCurrency: 'USD' })
      await preferencesController.setSelectedCurrency({ selectedCurrency: 'USD' })
      // assert(handleSuccessStub.notCalled)
      assert.equal(preferencesController.state.selectedCurrency, 'USD')
    })

    it('set user currency success', async () => {
      preferencesController.store.updateState({ selectedCurrency: 'USD' })
      await preferencesController.setSelectedCurrency({ selectedCurrency: 'YEN' })
      assert(handleSuccessStub.calledOnce)
      assert.equal(preferencesController.state.selectedCurrency, 'YEN')
    })

    it('gets billboard data', async () => {
      await preferencesController.getBillboardContents()
      assert.equal(Object.keys(preferencesController.state.billboard).length, 1)
    })

    it('add contact', async () => {
      await preferencesController.addContact({ verifier: 'google', contact: 'hello@tor.us', name: 'torus' })
      assert(handleSuccessStub.calledOnce)
      assert.deepStrictEqual(preferencesController.state.contacts, [{ verifier: 'google', contact: 'hello@tor.us', name: 'torus', id: 1 }])
    })

    it('delete contact', async () => {
      await preferencesController.deleteContact(1)
      assert(handleSuccessStub.calledOnce)
      assert.deepStrictEqual(preferencesController.state.contacts, [])
    })
  })

  it('setSiteMetadata', async () => {
    preferencesController.setSiteMetadata('google.com', { name: 'google' })
    assert.deepStrictEqual(preferencesController.metadataStore.getState(), { 'google.com': { name: 'google' } })
  })

  it('setSelectedAddress', async () => {
    preferencesController.setSelectedAddress('0x')
    assert.equal(preferencesController.state.selectedAddress, '0x')
  })

  it('should not poll user without jwt', () =>
    new Promise((resolve) => {
      const clock = sandbox.useFakeTimers()
      const prefsController = new PreferencesController()
      const mockSync = sandbox.stub(prefsController, 'sync')
      clock.tick(180000)
      sandbox.assert.notCalled(mockSync)
      clock.tick(180000)
      sandbox.assert.notCalled(mockSync)
      sandbox.restore()
      resolve()
    }))

  it('should poll user with jwt', () =>
    new Promise((resolve) => {
      const clock = sandbox.useFakeTimers()
      const prefsController = new PreferencesController({ interval: 100 })
      const mockSync = sandbox.stub(prefsController, 'sync')
      const billboardStub = sandbox.stub(prefsController, 'getBillboardContents')
      prefsController.jwtToken = 'hello'
      clock.tick(100)
      sandbox.assert.calledOnce(mockSync)
      clock.tick(100)
      sandbox.assert.calledTwice(mockSync)
      sandbox.assert.calledOnce(billboardStub)
      sandbox.restore()
      resolve()
    }))
})
