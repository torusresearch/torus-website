/* eslint-disable */
import assert from 'assert'
import clone from 'clone'
import EthQuery from 'eth-query'
import nock from 'nock'
import sinon from 'sinon'
import { obj as createThoughStream } from 'through2'

import MetaMaskController from '../../../src/controllers/TorusController'
import firstTimeState from '../../localhostState'
// import createTxMeta from '../lib/createTxMeta'
import setupMultiplex from '../../../src/controllers/utils/setupMultiplex'

const TEST_ADDRESS = '0x0dcd5d886577d5081b0c52e242ef29e70be3e7bc'
const CUSTOM_RPC_URL = 'http://localhost:8545'

const testAccount = {
  key: '08506248462eadf53f05b6c3577627071757644b3a0547315788357ec93e7b77',
  address: '0xa12164fed66719297d2cf407bb314d07feb12c02',
}

describe('MetaMaskController', () => {
  let metamaskController
  const sandbox = sinon.createSandbox()
  const noop = () => {}

  beforeEach(async () => {
    nock.cleanAll()
    nock.enableNetConnect((host) => host.includes('localhost') || host.includes('mainnet.infura.io:443'))

    nock('https://min-api.cryptocompare.com')
      .get('/data/price')
      .query((url) => url['fsym'] === 'ETH' && url['tsyms'] === 'USD')
      .reply(
        200,
        '{"base": "ETH", "quote": "USD", "bid": 288.45, "ask": 288.46, "volume": 112888.17569277, "exchange": "bitfinex", "total_volume": 272175.00106721005, "num_exchanges": 8, "timestamp": 1506444677}'
      )

    nock('https://min-api.cryptocompare.com')
      .get('/data/price')
      .query((url) => url['fsym'] === 'ETH' && url['tsyms'] === 'JPY')
      .reply(
        200,
        '{"base": "ETH", "quote": "JPY", "bid": 32300.0, "ask": 32400.0, "volume": 247.4616071, "exchange": "kraken", "total_volume": 247.4616071, "num_exchanges": 1, "timestamp": 1506444676}'
      )

    nock('https://api.infura.io').persist().get(/.*/).reply(200)

    nock('https://min-api.cryptocompare.com').persist().get(/.*/).reply(200, '{"JPY":12415.9}')

    metamaskController = new MetaMaskController({
      sessionCachedNetwork: {
        host: 'mainnet',
        networkName: 'Main Ethereum Network',
        chainId: 1,
      },
      showUnapprovedTx: noop,
      showUnconfirmedMessage: noop,
      encryptor: {
        encrypt: function (_, object) {
          this.object = object
          return Promise.resolve('mock-encrypted')
        },
        decrypt: function () {
          return Promise.resolve(this.object)
        },
      },
      initState: clone(firstTimeState),
      platform: { showTransactionNotification: () => {} },
      requestTkeyInput: noop,
      requestTkeySeedPhraseInput: noop,
    })
    // disable diagnostics
    metamaskController.diagnostics = null
    // add sinon method stubs & spies
    sandbox.stub(metamaskController.prefsController, 'sync')
    sandbox.stub(metamaskController.prefsController, 'createUser')
    await metamaskController.prefsController.init({ address: testAccount.address, rehydrate: true, jwtToken: 'hello', dispatch: noop, commit: noop })
    metamaskController.prefsController.setSelectedAddress(testAccount.address)
    sandbox.spy(metamaskController.txController, 'newUnapprovedTransaction')
  })

  afterEach(() => {
    nock.cleanAll()
    sandbox.restore()
  })

  describe('#getAccounts', function () {
    it('returns first address when dapp calls web3.eth.getAccounts', async function () {
      await metamaskController.addAccount(testAccount.key, testAccount.address)
      await metamaskController.setSelectedAccount(testAccount.address)
      const res = await metamaskController.networkController._baseProviderParams.getAccounts()
      assert.strictEqual(res.length, 1)
      assert.strictEqual(res[0], testAccount.address)
    })
  })

  describe('#getBalance', () => {
    it('should return the balance known by accountTracker', async () => {
      const accounts = {}
      const balance = '0x14ced5122ce0a000'
      accounts[TEST_ADDRESS] = { balance }

      metamaskController.accountTracker.store.putState({ accounts })

      const gotten = await metamaskController.getBalance(TEST_ADDRESS)

      assert.strictEqual(balance, gotten)
    })

    it('should ask the network for a balance when not known by accountTracker', async function () {
      const accounts = {}
      const balance = '0x14ced5122ce0a000'
      const ethQuery = new EthQuery()
      sinon.stub(ethQuery, 'getBalance').callsFake((_, callback) => {
        callback(undefined, balance)
      })

      metamaskController.accountTracker.store.putState({ accounts: accounts })

      const gotten = await metamaskController.getBalance(TEST_ADDRESS, ethQuery)

      assert.strictEqual(balance, gotten)
    })
  })

  // Not implemented but referenced - ##fail
  describe('#getApi', () => {
    let getApi
    let state

    beforeEach(() => {
      getApi = metamaskController.getApi()
    })

    it('getState', (done) => {
      getApi.getState((error, res) => {
        if (error) {
          done(error)
        } else {
          state = res
        }
      })
      assert.deepStrictEqual(state, metamaskController.getState())
      done()
    })
  })

  describe('#setCustomRpc', function () {
    let rpcTarget

    beforeEach(function () {
      rpcTarget = metamaskController.setCustomRpc(CUSTOM_RPC_URL)
    })

    it('returns custom RPC that when called', async function () {
      assert.strictEqual(await rpcTarget, CUSTOM_RPC_URL)
    })

    it('changes the network controller rpc', function () {
      const networkControllerState = metamaskController.networkController.store.getState()
      assert.strictEqual(networkControllerState.provider.rpcTarget, CUSTOM_RPC_URL)
    })
  })

  describe('#setCurrentCurrency', () => {
    let defaultMetaMaskCurrency

    beforeEach(() => {
      defaultMetaMaskCurrency = metamaskController.currencyController.getCurrentCurrency()
    })

    it('defaults to usd', () => {
      assert.strictEqual(defaultMetaMaskCurrency, 'usd')
    })

    it('sets currency to JPY', () => {
      metamaskController.setCurrentCurrency({ selectedCurrency: 'JPY' }, noop)
      assert.strictEqual(metamaskController.currencyController.getCurrentCurrency(), 'jpy')
    })
  })

  describe('#addNewAccount', () => {
    let addNewAccount

    beforeEach(() => {
      addNewAccount = metamaskController.addAccount(testAccount.key, testAccount.address)
    })

    it('errors when an primary keyring is does not exist', async () => {
      await addNewAccount
      const state = metamaskController.accountTracker.store.getState()
      assert.deepStrictEqual(await metamaskController.keyringController.getAccounts(), [testAccount.address])
      assert.deepStrictEqual(await Object.keys(state.accounts), [testAccount.address])
    })
  })

  describe('#newUnsignedMessage', () => {
    let messageParameters
    let metamaskMsgs
    let messages
    let messageId

    const address = testAccount.address
    const data = '0x43727970746f6b697474696573'

    beforeEach(async () => {
      sandbox.stub(metamaskController, 'getBalance')
      metamaskController.getBalance.callsFake(() => Promise.resolve('0x0'))

      // await metamaskController.createNewVaultAndRestore('foobar1337', TEST_SEED_ALT)
      // await metamaskController.createNewVaultAndKeychain('password')
      // log.info(await metamaskController.keyringController.getAccounts())

      await metamaskController.addAccount(testAccount.key)

      messageParameters = {
        from: address,
        data,
      }

      const promise = metamaskController.newUnsignedMessage(messageParameters)
      // handle the promise so it doesn't throw an unhandledRejection
      promise.then(noop).catch(noop)

      metamaskMsgs = metamaskController.messageManager.getUnapprovedMsgs()
      messages = metamaskController.messageManager.messages
      messageId = Object.keys(metamaskMsgs)[0]
      messages[0].msgParams.metamaskId = parseInt(messageId)
    })

    it('persists address from msg params', () => {
      assert.strictEqual(metamaskMsgs[messageId].msgParams.from, address)
    })

    it('persists data from msg params', () => {
      assert.strictEqual(metamaskMsgs[messageId].msgParams.data, data)
    })

    it('sets the status to unapproved', () => {
      assert.strictEqual(metamaskMsgs[messageId].status, 'unapproved')
    })

    it('sets the type to eth_sign', () => {
      assert.strictEqual(metamaskMsgs[messageId].type, 'eth_sign')
    })

    it('rejects the message', () => {
      const messageIdInt = parseInt(messageId)
      metamaskController.cancelMessage(messageIdInt, noop)
      assert.strictEqual(messages[0].status, 'rejected')
    })

    it('errors when signing a message', async function () {
      try {
        await metamaskController.signMessage(messages[0].msgParams)
      } catch (error) {
        assert.strictEqual(error.message, 'Expected message to be an Uint8Array with length 32')
      }
    })
  })

  describe('#newUnsignedPersonalMessage', () => {
    it('errors with no from in msgParams', async () => {
      const messageParameters = {
        data,
      }
      try {
        await metamaskController.newUnsignedPersonalMessage(messageParameters)
        assert.fail('should have thrown')
      } catch (error) {
        assert.strictEqual(error.message, 'MetaMask Message Signature: from field is required.')
      }
    })

    let messageParameters
    let metamaskPersonalMsgs
    let personalMessages
    let messageId

    const address = testAccount.address
    const data = '0x43727970746f6b697474696573'

    beforeEach(async () => {
      sandbox.stub(metamaskController, 'getBalance')
      metamaskController.getBalance.callsFake(() => Promise.resolve('0x0'))

      // await metamaskController.createNewVaultAndRestore('foobar1337', TEST_SEED_ALT)
      await metamaskController.addAccount(testAccount.key)

      messageParameters = {
        from: address,
        data,
      }

      const promise = metamaskController.newUnsignedPersonalMessage(messageParameters)
      // handle the promise so it doesn't throw an unhandledRejection
      promise.then(noop).catch(noop)

      metamaskPersonalMsgs = metamaskController.personalMessageManager.getUnapprovedMsgs()
      personalMessages = metamaskController.personalMessageManager.messages
      messageId = Object.keys(metamaskPersonalMsgs)[0]
      personalMessages[0].msgParams.metamaskId = parseInt(messageId)
    })

    it('persists address from msg params', () => {
      assert.strictEqual(metamaskPersonalMsgs[messageId].msgParams.from, address)
    })

    it('persists data from msg params', () => {
      assert.strictEqual(metamaskPersonalMsgs[messageId].msgParams.data, data)
    })

    it('sets the status to unapproved', () => {
      assert.strictEqual(metamaskPersonalMsgs[messageId].status, 'unapproved')
    })

    it('sets the type to personal_sign', () => {
      assert.strictEqual(metamaskPersonalMsgs[messageId].type, 'personal_sign')
    })

    it('rejects the message', () => {
      const messageIdInt = parseInt(messageId)
      metamaskController.cancelPersonalMessage(messageIdInt, noop)
      assert.strictEqual(personalMessages[0].status, 'rejected')
    })

    it('errors when signing a message', async function () {
      await metamaskController.signPersonalMessage(personalMessages[0].msgParams)
      assert.strictEqual(metamaskPersonalMsgs[messageId].status, 'signed') // Not signed cause no keyringcontroller
      log.info(metamaskPersonalMsgs[messageId].rawSig)
      assert.strictEqual(
        metamaskPersonalMsgs[messageId].rawSig,
        '0x77e7a8abbeca5c3041aaf4502a09f3379f41ed3e0a64176d03bcc3061a624a1529e130b0d198da2c743b5344ab52efce4fca311c133302b75bd6b3131f4eccfb1b'
      )
    })
  })

  describe('#setupUntrustedCommunication', function () {
    it('adds an origin to requests with untrusted communication', function (done) {
      // debugger
      const messageSender = {
        url: 'https://mycrypto.com',
      }
      const streamTest = createThoughStream((chunk, _, cb) => {
        if (chunk.data && chunk.data.method) {
          cb(null, chunk)
        } else {
          cb()
        }
      })

      metamaskController.setupUntrustedCommunication(setupMultiplex(streamTest).createStream('provider'), messageSender.url)

      const message = {
        id: 1999133338649204,
        jsonrpc: '2.0',
        params: [{ from: testAccount.address }],
        method: 'eth_sendTransaction',
      }
      streamTest.write(
        {
          name: 'provider',
          data: message,
        },
        null,
        (err) => {
          if (err) done(err)
          setTimeout(() => {
            assert.deepStrictEqual(metamaskController.txController.newUnapprovedTransaction.getCall(0).args, [
              { from: testAccount.address },
              {
                ...message,
                origin: 'mycrypto.com',
              },
            ])
            done()
          })
        }
      )
    })
  })

  // describe('#setupTrustedCommunication', function() {
  //   it('sets up controller api for trusted communication', async function () {
  //     const messageSender = {
  //       url: 'http://mycrypto.com'
  //     }
  //     const { promise, resolve } = deferredPromise()
  //     const streamTest = createThoughStream((chunk, _, cb) => {
  //       assert.strictEqual(chunk.name, 'controller')
  //       resolve()
  //       cb()
  //     })

  //     metamaskController.setupTrustedCommunication(setupMultiplex(streamTest).createStream('controller'), messageSender.url)
  //     await promise
  //     streamTest.end()
  //   })
  // })

  describe('#_onKeyringControllerUpdate', () => {
    it('should update selected address if keyrings are provided', async () => {
      // const addAddresses = sinon.fake()
      // const getSelectedAddress = sinon.fake.returns('0x42')
      // const setSelectedAddress = sinon.fake()
      const syncWithAddresses = sinon.fake()
      const addAccounts = sinon.fake()
      const deserialize = sinon.fake.resolves()
      const addAccount = sinon.fake()
      sandbox.replace(metamaskController, 'keyringController', {
        deserialize,
        addAccount,
      })
      sandbox.replace(metamaskController, 'accountTracker', {
        syncWithAddresses,
        addAccounts,
      })

      const oldState = metamaskController.getState()
      await metamaskController.initTorusKeyring([testAccount.key], [testAccount.address])

      // assert.deepStrictEqual(addAddresses.args, [[['0x1', '0x2']]])
      assert.deepStrictEqual(syncWithAddresses.args, [[[testAccount.address]]])
      // assert.deepStrictEqual(setSelectedAddress.args, [['0x1']])
      assert.deepStrictEqual(metamaskController.getState(), oldState)
    })
  })
})

// function deferredPromise () {
//   let resolve
//   const promise = new Promise((_resolve) => {
//     resolve = _resolve
//   })
//   return { promise, resolve }
// }
