const assert = require('assert')
const ethUtil = require('ethereumjs-util')
const sigUtil = require('eth-sig-util')
const EthereumTx = require('ethereumjs-tx')
const TorusKeyring = require('../../../src/utils/TorusKeyring').default

const TYPE_STR = 'Torus Keyring'

// Sample account:
const testAccount = {
  key: '08506248462eadf53f05b6c3577627071757644b3a0547315788357ec93e7b77',
  address: '0xa12164fed66719297d2cf407bb314d07feb12c02'
}

describe('torus-keyring', () => {
  let keyring
  beforeEach(() => {
    keyring = new TorusKeyring()
  })

  describe('Keyring.type', () => {
    it('is a class property that returns the type string.', () => {
      const type = TorusKeyring.type
      assert.strictEqual(type, TYPE_STR)
    })
  })

  describe('#type', () => {
    it('returns the correct value', () => {
      const type = keyring.type
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
      assert.strictEqual(serialized[0], ethUtil.stripHexPrefix(testAccount.key))
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

  describe('#signTransaction', () => {
    const address = '0x9858e7d8b79fc3e6d989636721584498926da38a'
    const privateKey = '0x7dd98753d7b4394095de7d176c58128e2ed6ee600abe97c9f6d9fd65015d9b18'

    it('returns a signed tx object', async () => {
      await keyring.deserialize([privateKey])

      const txParams = {
        from: address,
        nonce: '0x00',
        gasPrice: '0x09184e72a000',
        gasLimit: '0x2710',
        to: address,
        value: '0x1000'
      }
      const tx = new EthereumTx(txParams)

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
      const msgHashHex = ethUtil.bufferToHex(ethUtil.rlphash(message))
      await keyring.deserialize([privateKey])
      await keyring.addAccounts(9)
      const addresses = await keyring.getAccounts()
      const signatures = await Promise.all(
        addresses.map(async address => {
          return keyring.signMessage(address, msgHashHex)
        })
      )
      signatures.forEach((sgn, index) => {
        const address = addresses[index]

        const r = ethUtil.toBuffer(sgn.slice(0, 66))
        const s = ethUtil.toBuffer('0x' + sgn.slice(66, 130))
        const v = ethUtil.bufferToInt(ethUtil.toBuffer('0x' + sgn.slice(130, 132)))
        const m = ethUtil.toBuffer(msgHashHex)
        const pub = ethUtil.ecrecover(m, v, r, s)
        const adr = '0x' + ethUtil.pubToAddress(pub).toString('hex')

        assert.strictEqual(adr, address, 'recovers address from signature correctly')
      })
    })
  })

  describe('#addAccounts', () => {
    describe('with no arguments', () => {
      it('creates a single wallet', async () => {
        await keyring.addAccounts()
        assert.strictEqual(keyring.wallets.length, 1)
      })
    })

    describe('with a numeric argument', () => {
      it('creates that number of wallets', async () => {
        await keyring.addAccounts(3)
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
          return ethUtil.toBuffer(desiredOutput)
        }
      })

      const output = await keyring.getAccounts()
      assert.strictEqual(output[0], desiredOutput)
      assert.strictEqual(output.length, 1)
    })
  })

  describe('#removeAccount', () => {
    describe('if the account exists', () => {
      it('should remove that account', async () => {
        await keyring.addAccounts()
        const addresses = await keyring.getAccounts()
        keyring.removeAccount(addresses[0])
        const addressesAfterRemoval = await keyring.getAccounts()
        assert.strictEqual(addressesAfterRemoval.length, addresses.length - 1)
      })
    })

    describe('if the account does not exist', () => {
      it('should throw an error', done => {
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

  describe('#signPersonalMessage', () => {
    it('returns the expected value', async () => {
      const address = '0xbe93f9bacbcffc8ee6663f2647917ed7a20a57bb'
      const privateKey = Buffer.from('6969696969696969696969696969696969696969696969696969696969696969', 'hex')
      const privKeyHex = ethUtil.bufferToHex(privateKey)
      const message = '0x68656c6c6f20776f726c64'
      const signature =
        '0xce909e8ea6851bc36c007a0072d0524b07a3ff8d4e623aca4c71ca8e57250c4d0a3fc38fa8fbaaa81ead4b9f6bd03356b6f8bf18bccad167d78891636e1d69561b'

      await keyring.deserialize([privKeyHex])
      const sig = await keyring.signPersonalMessage(address, message)
      assert.strictEqual(sig, signature, 'signature matches')

      const restored = sigUtil.recoverPersonalSignature({
        data: message,
        sig
      })

      assert.strictEqual(restored, address, 'recovered address')
    })
  })

  // describe('#signTypedData', () => {
  //   const address = '0x29c76e6ad8f28bb1004902578fb108c507be341b'
  //   const privKeyHex = '0x4af1bceebf7f3634ec3cff8a2c38e51178d5d4ce585c52d6043e5e2cc3418bb0'

  //   it('returns the expected value', async () => {
  //     const expectedSignature =
  //       '0xf2951a651df0a79b29a38215f9669b06499fa45d3b41c7acedd49c1050e8439f3283156a0797113c9c06c1df844495071aaa5721ea39198b46bf462f7417dfba1b'

  //     const typedData = {
  //       types: {
  //         EIP712Domain: []
  //       },
  //       domain: {},
  //       primaryType: 'EIP712Domain',
  //       message: {},
  //     }

  //     await keyring.deserialize([privKeyHex])
  //     console.log('working')
  //     const sig = await keyring.signTypedData(address, typedData)
  //     console.log('original sig ' + sig)
  //     console.log('expected sig ' + expectedSignature)
  //     assert.strictEqual(sig, expectedSignature, 'signature matches')
  //     const restored = sigUtil.recoverTypedSignature({ data: typedData, sig: sig })
  //     assert.strictEqual(restored, address, 'recovered address')
  //   })
  // })
})
