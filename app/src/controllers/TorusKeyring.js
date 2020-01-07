const EventEmitter = require('events').EventEmitter
const Wallet = require('ethereumjs-wallet')
const ethUtil = require('ethereumjs-util')
const sigUtil = require('eth-sig-util')
const log = require('loglevel')
const type = 'Torus Keyring'

export default class TorusKeyring extends EventEmitter {
  constructor(opts) {
    super()
    this.type = type
    this.wallets = []
    log.info('toruskeyring', opts)
    this.deserialize(opts)
      .then(() => {
        log.info('wallet initialised')
      })
      .catch(err => log.error('unable to deserialize', err))
  }

  serialize() {
    log.info('torusKeyRing, serialise', this.wallets)
    return new Promise((resolve, reject) => {
      try {
        const keys = this.wallets.map(this.generatePrivKey)
        resolve(keys)
      } catch (error) {
        reject(error)
      }
    })
  }

  generatePrivKey(wallet) {
    log.info('generatePrivKey')
    const test = wallet.privateKey.getPrivateKey().toString('hex')
    log.info('generatePrivKey', wallet, test)
    return test
  }

  generateWallet(privateKey) {
    const stripped = ethUtil.stripHexPrefix(privateKey)
    const buffer = Buffer.from(stripped, 'hex')
    const wallet = Wallet.fromPrivateKey(buffer)
    return wallet
  }

  deserialize(privateKeys = []) {
    return new Promise((resolve, reject) => {
      try {
        log.info('deserialize', privateKeys)
        this.wallets = privateKeys.map(this.generateWallet)
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  }

  addAccount(privKey) {
    return new Promise(async (resolve, reject) => {
      try {
        for (let index = 0; index < this.wallets.length; index++) {
          const element = this.generatePrivKey(this.wallets[index])
          if (element === privKey) reject(new Error('Already added'))
        }
        this.wallets.push(this.generateWallet(privKey))
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }

  // Not using
  addRandomAccounts(n = 1) {
    var newWallets = []
    for (var i = 0; i < n; i++) {
      newWallets.push(Wallet.generate())
    }
    this.wallets = this.wallets.concat(newWallets)
    const hexWallets = newWallets.map(w => ethUtil.bufferToHex(w.getAddress()))
    return Promise.resolve(hexWallets)
  }

  // Not using
  getAccounts() {
    return Promise.resolve(this.wallets.map(w => ethUtil.bufferToHex(w.getAddress())))
  }

  // tx is an instance of the ethereumjs-transaction class.
  signTransaction(tx, address) {
    log.info('signTransaction', tx, address)
    return new Promise((resolve, reject) => {
      try {
        const wallet = this._getWalletForAccount(address)
        var privKey = wallet.getPrivateKey()
        tx.sign(privKey)
        resolve(tx)
      } catch (error) {
        reject(error)
      }
    })
  }

  // For eth_sign, we need to sign arbitrary data:
  signMessage(withAccount, data) {
    return new Promise((resolve, reject) => {
      try {
        const wallet = this._getWalletForAccount(withAccount)
        const message = ethUtil.stripHexPrefix(data)
        var privKey = wallet.getPrivateKey()
        var msgSig = ethUtil.ecsign(Buffer.from(message, 'hex'), privKey)
        var rawMsgSig = ethUtil.bufferToHex(sigUtil.concatSig(msgSig.v, msgSig.r, msgSig.s))
        resolve(rawMsgSig)
      } catch (error) {
        reject(error)
      }
    })
  }

  // For personal_sign, we need to prefix the message:
  signPersonalMessage(withAccount, msgHex) {
    return new Promise((resolve, reject) => {
      try {
        const wallet = this._getWalletForAccount(withAccount)
        const privKey = ethUtil.stripHexPrefix(wallet.getPrivateKey())
        const privKeyBuffer = Buffer.from(privKey, 'hex')
        const sig = sigUtil.personalSign(privKeyBuffer, { data: msgHex })
        resolve(sig)
      } catch (error) {
        reject(error)
      }
    })
  }

  // personal_signTypedData, signs data along with the schema
  signTypedData(withAccount, typedData, version) {
    return new Promise((resolve, reject) => {
      try {
        const wallet = this._getWalletForAccount(withAccount)
        const privKey = ethUtil.toBuffer(wallet.getPrivateKey())
        let parsedData = typedData
        if (typeof parsedData === 'string') {
          parsedData = JSON.parse(parsedData)
        }
        let signature
        if (version) {
          switch (version) {
            case 'V1':
              signature = sigUtil.signTypedDataLegacy(privKey, { data: typedData })
              break
            case 'V4':
              signature = sigUtil.signTypedData_v4(privKey, { data: parsedData })
              break
            case 'V3':
            default:
              signature = sigUtil.signTypedData(privKey, { data: parsedData })
              break
          }
        } else {
          signature = sigUtil.signTypedData(privKey, { data: parsedData })
        }
        resolve(signature)
      } catch (error) {
        reject(error)
      }
    })
  }

  // not using
  // exportAccount should return a hex-encoded private key:
  exportAccount(address) {
    const wallet = this._getWalletForAccount(address)
    return Promise.resolve(wallet.getPrivateKey().toString('hex'))
  }
  // not using
  removeAccount(address) {
    if (!this.wallets.map(w => ethUtil.bufferToHex(w.getAddress()).toLowerCase()).includes(address.toLowerCase())) {
      throw new Error(`Address ${address} not found in this keyring`)
    }
    this.wallets = this.wallets.filter(w => ethUtil.bufferToHex(w.getAddress()).toLowerCase() !== address.toLowerCase())
  }

  /* PRIVATE METHODS */

  _getWalletForAccount(account) {
    console.log('_getWalletForAccount account', account)
    const address = sigUtil.normalize(account)

    let wallet = this.wallets.find(w => ethUtil.bufferToHex(w.getAddress()) === address)
    console.log('_getWalletForAccount wallet', this.wallets)
    if (!wallet) throw new Error('Torus Keyring - Unable to find matching address.')
    return wallet
  }
}
TorusKeyring.type = type
