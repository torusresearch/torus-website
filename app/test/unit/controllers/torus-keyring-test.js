/* eslint-disable */
import assert from 'assert'
import { recoverPersonalSignature, recoverTypedSignatureLegacy, recoverTypedSignature_v4, recoverTypedSignature, encrypt } from 'eth-sig-util'
import { Transaction as EthereumTx } from 'ethereumjs-tx'
import { bufferToHex, bufferToInt, ecrecover, pubToAddress, rlphash, toBuffer, stripHexPrefix } from 'ethereumjs-util'
import log from 'loglevel'

import TorusKeyring from '../../../src/controllers/TorusKeyring'

const TYPE_STR = 'Torus Keyring'

// Sample account:
const testAccount = {
  key: '08506248462eadf53f05b6c3577627071757644b3a0547315788357ec93e7b77',
  encryptionKey: 'Qc/2mEvflhT8Rs7RRrlyOiSBLsgkK+XveqmnVuZ5OCc=',
  address: '0xa12164fed66719297d2cf407bb314d07feb12c02',
}

const testAccount2 = {
  key: '357a5188cb0f748f62f59b6eac31b9d386b9f7f2c87f567f0dae5eed8b8a9d9c',
  address: '0x43ce12056aa1e8372ab4abf0c0cc658d2d41077f',
}

describe('torus-keyring', () => {
  let keyring
  beforeEach(() => {
    keyring = new TorusKeyring()
  })

  describe('Keyring.type', () => {
    it('is a class property that returns the type string.', () => {
      const { type } = TorusKeyring
      assert.strictEqual(type, TYPE_STR)
    })
  })

  describe('#type', () => {
    it('returns the correct value', () => {
      const { type } = keyring
      assert.strictEqual(type, TYPE_STR)
    })
  })

  describe('#serialize default constructor.', () => {
    it('serializes default wallet with no keys', async () => {
      const output = await keyring.serialize()
      assert.deepStrictEqual(output, [])
    })
  })

  describe('#deserialize a private key', () => {
    it('serializes what it deserializes', async () => {
      await keyring.deserialize([testAccount.key])
      assert.strictEqual(keyring.wallets.length, 1, 'has one wallet')
      const serialized = await keyring.serialize()
      assert.strictEqual(serialized[0], stripHexPrefix(testAccount.key))
      const accounts = await keyring.getAccounts()
      assert.deepStrictEqual(accounts, [testAccount.address], 'accounts match expected')
    })
  })

  describe('#constructor with a private key', () => {
    it('has the correct addresses', async () => {
      const keyring = new TorusKeyring([testAccount.key])
      const accounts = await keyring.getAccounts()
      const expectedAccounts = [testAccount.address]
      assert.deepStrictEqual(accounts, expectedAccounts, 'accounts match expected')
    })
  })

  describe('#add account later', () => {
    it('has the correct addresses', async () => {
      const keyring = new TorusKeyring([testAccount.key])
      await keyring.addAccount(testAccount2.key)
      log.info(await keyring.getAccounts())
      const accounts = await keyring.getAccounts()
      const expectedAccounts = [testAccount.address, testAccount2.address]
      assert.deepStrictEqual(accounts, expectedAccounts, 'accounts match expected')
    })
  })

  describe('#signTransaction', () => {
    const address = '0x9858e7d8b79fc3e6d989636721584498926da38a'
    const privateKey = '0x7dd98753d7b4394095de7d176c58128e2ed6ee600abe97c9f6d9fd65015d9b18'

    it('returns a signed tx object', async () => {
      await keyring.deserialize([privateKey])

      const txParameters = {
        from: address,
        nonce: '0x00',
        gasPrice: '0x09184e72a000',
        gasLimit: '0x2710',
        to: address,
        value: '0x1000',
      }
      const tx = new EthereumTx(txParameters)

      const signed = await keyring.signTransaction(tx, address)
      assert.ok(signed.raw, 'has a raw signature')
    })
  })

  describe('#signMessage', () => {
    const address = '0x9858e7d8b79fc3e6d989636721584498926da38a'
    const message = '0x879a053d4800c6354e76c7985a865d2922c82fb5b3f4577b2fe08b998954f2e0'
    const privateKey = '0x7dd98753d7b4394095de7d176c58128e2ed6ee600abe97c9f6d9fd65015d9b18'
    const expectedResult =
      '0x28fcb6768e5110144a55b2e6ce9d1ea5a58103033632d272d2b5cf506906f7941a00b539383fd872109633d8c71c404e13dba87bc84166ee31b0e36061a69e161c'

    it('passes the dennis test', async () => {
      await keyring.deserialize([privateKey])
      const result = await keyring.signMessage(address, message)
      assert.strictEqual(result, expectedResult)
    })

    it('reliably can decode messages it signs', async () => {
      const message = 'hello there!'
      const messageHashHex = bufferToHex(rlphash(message))
      await keyring.deserialize([privateKey])
      await keyring.addRandomAccounts(9)
      const addresses = await keyring.getAccounts()
      const signatures = await Promise.all(addresses.map(async (address) => keyring.signMessage(address, messageHashHex)))
      signatures.forEach((sgn, index) => {
        const address = addresses[index]

        const r = toBuffer(sgn.slice(0, 66))
        const s = toBuffer(`0x${sgn.slice(66, 130)}`)
        const v = bufferToInt(toBuffer(`0x${sgn.slice(130, 132)}`))
        const m = toBuffer(messageHashHex)
        const pub = ecrecover(m, v, r, s)
        const adr = `0x${pubToAddress(pub).toString('hex')}`

        assert.strictEqual(adr, address, 'recovers address from signature correctly')
      })
    })
  })

  describe('#addAccounts', () => {
    describe('with no arguments', () => {
      it('creates a single wallet', async () => {
        await keyring.addRandomAccounts()
        assert.strictEqual(keyring.wallets.length, 1)
      })
    })

    describe('with a numeric argument', () => {
      it('creates that number of wallets', async () => {
        await keyring.addRandomAccounts(3)
        assert.strictEqual(keyring.wallets.length, 3)
      })
    })
  })

  describe('#getAccounts', () => {
    it('calls getAddress on each wallet', async () => {
      // Push a mock wallet
      const desiredOutput = '0xa12164fed66719297d2cf407bb314d07feb12c02'
      keyring.wallets.push({
        getAddress() {
          return toBuffer(desiredOutput)
        },
      })

      const output = await keyring.getAccounts()
      assert.strictEqual(output[0], desiredOutput)
      assert.strictEqual(output.length, 1)
    })
  })

  describe('#removeAccount', () => {
    describe('if the account exists', () => {
      it('should remove that account', async () => {
        await keyring.addRandomAccounts()
        const addresses = await keyring.getAccounts()
        keyring.removeAccount(addresses[0])
        const addressesAfterRemoval = await keyring.getAccounts()
        assert.strictEqual(addressesAfterRemoval.length, addresses.length - 1)
      })
    })

    describe('if the account does not exist', () => {
      it('should throw an error', (done) => {
        const unexistingAccount = '0x0000000000000000000000000000000000000000'
        assert.throws(
          () => {
            keyring.removeAccount(unexistingAccount)
          },
          Error,
          `Address ${unexistingAccount} not found in this keyring`
        )
        done()
      })
    })
  })

  it('should export account', async () => {
    const keyring = new TorusKeyring([testAccount.key])
    const newPrivateKey = await keyring.exportAccount(testAccount.address)
    assert(newPrivateKey !== '')
  })

  it('should remove account', async () => {
    const keyring = new TorusKeyring([testAccount.key])
    const finalState = await keyring.removeAccount(testAccount.address)
    assert(keyring.wallets.length === 0)
  })

  it('should sign message', async () => {
    const keyring = new TorusKeyring([testAccount.key])
    const data = '0x879a053d4800c6354e76c7985a865d2922c82fb5b3f4577b2fe08b998954f2e0'
    const signature = await keyring.signMessage(testAccount.address, data)
    assert(signature !== '')
  })

  it('should sign personal message', async () => {
    const keyringController = new TorusKeyring([testAccount.key])
    const data = bufferToHex(Buffer.from('Hello from test', 'utf8'))
    const signature = await keyringController.signPersonalMessage(testAccount.address, data)
    const recovered = recoverPersonalSignature({ data, sig: signature })
    assert(testAccount.address === recovered)
  })

  it('should sign typed message V1', async () => {
    const keyringController = new TorusKeyring([testAccount.key])
    const typedMessageParameters = [
      {
        name: 'Message',
        type: 'string',
        value: 'Hi, Alice!',
      },
      {
        name: 'A number',
        type: 'uint32',
        value: '1337',
      },
    ]
    const signature = await keyringController.signTypedData(testAccount.address, typedMessageParameters, 'V1')
    const recovered = recoverTypedSignatureLegacy({ data: typedMessageParameters, sig: signature })
    assert(testAccount.address === recovered)
  })

  it('should sign typed message V3', async () => {
    const keyringController = new TorusKeyring([testAccount.key])
    const messageParameters = {
      domain: {
        chainId: 1,
        name: 'Ether Mail',
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
        version: '1',
      },
      message: {
        contents: 'Hello, Bob!',
        from: { name: 'Cow', wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826' },
        to: { name: 'Bob', wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB' },
      },
      primaryType: 'Mail',
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        Mail: [
          { name: 'from', type: 'Person' },
          { name: 'to', type: 'Person' },
          { name: 'contents', type: 'string' },
        ],
        Person: [
          { name: 'name', type: 'string' },
          { name: 'wallet', type: 'address' },
        ],
      },
    }
    const signature = await keyringController.signTypedData(testAccount.address, JSON.stringify(messageParameters), 'V3')
    const recovered = recoverTypedSignature({ data: messageParameters, sig: signature })
    assert(testAccount.address === recovered)
  })

  it('should sign typed message V4', async () => {
    const keyringController = new TorusKeyring([testAccount.key])
    const messageParameters = {
      domain: {
        chainId: 1,
        name: 'Ether Mail',
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
        version: '1',
      },
      message: {
        contents: 'Hello, Bob!',
        from: {
          name: 'Cow',
          wallets: ['0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826', '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF'],
        },
        to: [
          {
            name: 'Bob',
            wallets: [
              '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
              '0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57',
              '0xB0B0b0b0b0b0B000000000000000000000000000',
            ],
          },
        ],
      },
      primaryType: 'Mail',
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        Group: [
          { name: 'name', type: 'string' },
          { name: 'members', type: 'Person[]' },
        ],
        Mail: [
          { name: 'from', type: 'Person' },
          { name: 'to', type: 'Person[]' },
          { name: 'contents', type: 'string' },
        ],
        Person: [
          { name: 'name', type: 'string' },
          { name: 'wallets', type: 'address[]' },
        ],
      },
    }

    const signature = await keyringController.signTypedData(testAccount.address, JSON.stringify(messageParameters), 'V4')
    const recovered = recoverTypedSignature_v4({ data: messageParameters, sig: signature })
    assert(testAccount.address === recovered)
  })

  it('should fail when sign typed message format is wrong', async () => {
    const keyringController = new TorusKeyring([testAccount.key])
    const messageParameters = [{}]
    let error1
    try {
      await keyringController.signTypedData(testAccount.address, messageParameters, 'V1')
    } catch (error) {
      error1 = error
    }
    let error2
    try {
      await keyringController.signTypedData(testAccount.address, messageParameters, 'V3')
    } catch (error) {
      error2 = error
    }
    assert(error1.message.includes('Expect argument to be non-empty array'))
    assert(error2.message.includes("Cannot read property 'EIP712Domain' of undefined"))
  })

  it('should sign transaction', async () => {
    const keyringController = new TorusKeyring([testAccount.key])
    const transaction = {
      chainId: 3,
      data: '0x1',
      from: testAccount.address,
      gasLimit: '0x5108',
      gasPrice: '0x5108',
      to: '0x51253087e6f8358b5f10c0a94315d69db3357859',
      value: '0x5208',
    }
    const ethTransaction = new EthereumTx(transaction, { chain: 'ropsten' })
    const signature = await keyringController.signTransaction(ethTransaction, testAccount.address)
    assert(signature !== '')
  })

  it('should get correct encryption key', async () => {
    const keyringController = new TorusKeyring([testAccount.key])
    const encryptionKey = keyringController.signEncryptionPublicKey(testAccount.address)
    assert.strictEqual(encryptionKey, testAccount.encryptionKey)
  })

  it('should decrypt correctly', async () => {
    const keyringController = new TorusKeyring([testAccount.key])
    const msg = 'Encryption works!!!'
    const encryptionKey = keyringController.signEncryptionPublicKey(testAccount.address)
    const messageEncrypted = encrypt(encryptionKey, { data: msg }, 'x25519-xsalsa20-poly1305')
    const decrypted = keyringController.decryptMessage({ data: messageEncrypted }, testAccount.address)
    assert.strictEqual(msg, decrypted)
  })
})
