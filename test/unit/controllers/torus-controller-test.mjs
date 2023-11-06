/* eslint-disable */
import assert from 'assert'
import { cloneDeep } from 'lodash-es'
import EthQuery from 'eth-query'
import sinon from 'sinon'
import { obj as createThoughStream } from 'through2'
import { MockAgent, setGlobalDispatcher } from 'undici'

import config from '../../../src/config'
import MetaMaskController from '../../../src/controllers/TorusController'
// import createTxMeta from '../lib/createTxMeta'
import setupMultiplex from '../../../src/controllers/utils/setupMultiplex'
import firstTimeState from '../../localhostState'

const TORUS_API = config.api
const TEST_ADDRESS = '0x0dcd5d886577d5081b0c52e242ef29e70be3e7bc'
const CUSTOM_RPC_URL = 'http://localhost:8545'
const CUSTOM_CHAIN_ID = 1

const testAccount = {
  key: '08506248462eadf53f05b6c3577627071757644b3a0547315788357ec93e7b77',
  address: '0xa12164fed66719297d2cf407bb314d07feb12c02',
}

const TEST_GAS_FEE_API = 'https://mock-gas-server.herokuapp.com'
const TEST_LEGACY_FEE_API = 'https://test'

describe('MetaMaskController', () => {
  let metamaskController
  const sandbox = sinon.createSandbox()
  const noop = () => {}

  beforeEach(async () => {
    const mockAgent = new MockAgent()
    setGlobalDispatcher(mockAgent)

    const gasFeePool = mockAgent.get(TEST_GAS_FEE_API)
    const legacyGasFeePool = mockAgent.get(TEST_LEGACY_FEE_API)
    gasFeePool
      .intercept({ path: '/1', method: 'get' })
      .defaultReplyHeaders({ 'content-type': 'application/json' })
      .reply(200, {
        low: {
          minWaitTimeEstimate: 60_000,
          maxWaitTimeEstimate: 600_000,
          suggestedMaxPriorityFeePerGas: '1',
          suggestedMaxFeePerGas: '35',
        },
        medium: {
          minWaitTimeEstimate: 15_000,
          maxWaitTimeEstimate: 60_000,
          suggestedMaxPriorityFeePerGas: '1.8',
          suggestedMaxFeePerGas: '38',
        },
        high: {
          minWaitTimeEstimate: 0,
          maxWaitTimeEstimate: 15_000,
          suggestedMaxPriorityFeePerGas: '2',
          suggestedMaxFeePerGas: '50',
        },
        estimatedBaseFee: '28',
      })
      .persist()

    legacyGasFeePool
      .intercept({ path: '/1', method: 'get' })
      .defaultReplyHeaders({ 'content-type': 'application/json' })
      .reply(200, {
        SafeGasPrice: '22',
        ProposeGasPrice: '25',
        FastGasPrice: '30',
      })
      .persist()
    const cryptoAPI = mockAgent.get('https://min-api.cryptocompare.com')

    cryptoAPI
      .intercept({ path: '/data/price', method: 'get', query: { fsym: 'ETH', tsyms: 'USD' } })
      .defaultReplyHeaders({ 'content-type': 'application/json' })
      .reply(
        200,
        '{"base": "ETH", "quote": "USD", "bid": 288.45, "ask": 288.46, "volume": 112888.17569277, "exchange": "bitfinex", "total_volume": 272175.00106721005, "num_exchanges": 8, "timestamp": 1506444677}'
      )

    cryptoAPI
      .intercept({ path: '/data/price', method: 'get', query: { fsym: 'ETH', tsyms: 'JPY' } })
      .defaultReplyHeaders({ 'content-type': 'application/json' })
      .reply(
        200,
        '{"base": "ETH", "quote": "JPY", "bid": 32300.0, "ask": 32400.0, "volume": 247.4616071, "exchange": "kraken", "total_volume": 247.4616071, "num_exchanges": 1, "timestamp": 1506444676}'
      )

    const infuraAPI = mockAgent.get('https://api.infura.io')
    infuraAPI.intercept({ method: 'get', path: /.*/ }).reply(200).persist()

    cryptoAPI
      .intercept({ method: 'get', path: /.*/ })
      .defaultReplyHeaders({ 'content-type': 'application/json' })
      .reply(200, '{"JPY":12415.9}')
      .persist()

    const torusAPI = mockAgent.get(TORUS_API)
    torusAPI
      .intercept({ path: '/customnetwork/rpc', method: 'post' })
      .defaultReplyHeaders({ 'content-type': 'application/json' })
      .reply(201, {
        data: {
          network_name: '',
          chain_id: 1,
          symbol: 'ETH',
          rpc_url: 'http://localhost:8545',
          id: 1,
        },
        success: true,
      })

    metamaskController = new MetaMaskController({
      showUnapprovedTx: noop,
      showUnconfirmedMessage: noop,
      encryptor: {
        encrypt(_, object) {
          this.object = object
          return Promise.resolve('mock-encrypted')
        },
        decrypt() {
          return Promise.resolve(this.object)
        },
      },
      initState: cloneDeep(firstTimeState),
      platform: { showTransactionNotification: () => {} },
      requestTkeyInput: noop,
      requestTkeySeedPhraseInput: noop,
    })
    // disable diagnostics
    metamaskController.diagnostics = null
    // add sinon method stubs & spies
    sandbox.stub(metamaskController.prefsController, 'sync')
    sandbox.stub(metamaskController.prefsController, 'createUser')
    sandbox.stub(metamaskController.networkController, 'getLatestBlock').callsFake(() => Promise.resolve({}))
    sandbox.stub(metamaskController.gasFeeController, 'fetchEthGasPriceEstimate').callsFake(() =>
      Promise.resolve({
        gasPrice: '10',
      })
    )
    metamaskController.gasFeeController.legacyAPIEndpoint = TEST_LEGACY_FEE_API
    metamaskController.gasFeeController.EIP1559APIEndpoint = TEST_GAS_FEE_API
    await metamaskController.prefsController.init({ address: testAccount.address, rehydrate: true, jwtToken: 'hello', dispatch: noop, commit: noop })
    metamaskController.prefsController.setSelectedAddress(testAccount.address)
    sandbox.spy(metamaskController.txController, 'newUnapprovedTransaction')
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('#getAccounts', () => {
    it('returns first address when dapp calls web3.eth.getAccounts', async () => {
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

    it('should ask the network for a balance when not known by accountTracker', async () => {
      const accounts = {}
      const balance = '0x14ced5122ce0a000'
      const ethQuery = new EthQuery()
      sinon.stub(ethQuery, 'getBalance').callsFake((_, callback) => {
        callback(undefined, balance)
      })

      metamaskController.accountTracker.store.putState({ accounts })

      const gotten = await metamaskController.getBalance(TEST_ADDRESS, ethQuery)

      assert.strictEqual(balance, gotten)
    })
  })

  // Not implemented but referenced - ##fail
  // describe('#getApi', () => {
  //   let getApi
  //   let state

  //   beforeEach(() => {
  //     getApi = metamaskController.getApi()
  //   })

  //   it('getState', (done) => {
  //     getApi.getState((error, res) => {
  //       if (error) {
  //         done(error)
  //       } else {
  //         state = res
  //       }
  //     })
  //     assert.deepStrictEqual(state, metamaskController.getState())
  //     done()
  //   })
  // })

  describe('#setCustomRpc', () => {
    let rpcTarget

    beforeEach(async () => {
      rpcTarget = await metamaskController.setCustomRpc(CUSTOM_RPC_URL, CUSTOM_CHAIN_ID)
    })

    it('returns custom RPC that when called', async () => {
      assert.strictEqual(rpcTarget, 1)
    })

    it('changes the network controller rpc', () => {
      const networkControllerState = metamaskController.networkController.store.getState()
      assert.strictEqual(networkControllerState.provider.rpcUrl, CUSTOM_RPC_URL)
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
      const accounts = await metamaskController.keyringController.getAccounts()
      assert.deepStrictEqual(
        accounts.map((i) => i.toLowerCase()),
        [testAccount.address]
      )
      assert.deepStrictEqual(await Object.keys(state.accounts), [testAccount.address])
    })
  })

  describe('#newUnsignedMessage', () => {
    let messageParameters
    let metamaskMsgs
    let messages
    let messageId

    const { address } = testAccount
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
      messages[0].msgParams.metamaskId = Number.parseInt(messageId)
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
      const messageIdInt = Number.parseInt(messageId)
      metamaskController.cancelMessage(messageIdInt, noop)
      assert.strictEqual(messages[0].status, 'rejected')
    })

    it('errors when signing a message', async () => {
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

    const { address } = testAccount
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
      personalMessages[0].msgParams.metamaskId = Number.parseInt(messageId)
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
      const messageIdInt = Number.parseInt(messageId)
      metamaskController.cancelPersonalMessage(messageIdInt, noop)
      assert.strictEqual(personalMessages[0].status, 'rejected')
    })

    it('errors when signing a message', async () => {
      await metamaskController.signPersonalMessage(personalMessages[0].msgParams)
      assert.strictEqual(metamaskPersonalMsgs[messageId].status, 'signed') // Not signed cause no keyringcontroller
      log.info(metamaskPersonalMsgs[messageId].rawSig)
      assert.strictEqual(
        metamaskPersonalMsgs[messageId].rawSig,
        '0x77e7a8abbeca5c3041aaf4502a09f3379f41ed3e0a64176d03bcc3061a624a1529e130b0d198da2c743b5344ab52efce4fca311c133302b75bd6b3131f4eccfb1b'
      )
    })
  })

  describe('#setupUntrustedCommunication', () => {
    it('adds an origin to requests with untrusted communication', (done) => {
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
        id: 1_999_133_338_649_204,
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
