import sigUtil from 'eth-sig-util'
import * as ethUtil from 'ethereumjs-util'
import Wallet from 'ethereumjs-wallet'
import { EventEmitter } from 'events'
import log from 'loglevel'

const type = 'Torus Keyring'

export default class TorusKeyring extends EventEmitter {
  constructor(options) {
    super()
    this.type = type
    this.wallets = []
    this.deserialize(options)
      .then(() => {
        log.info('wallet initialised')
      })
      .catch(error => log.error('unable to deserialize', error))
  }

  serialize() {
    return new Promise((resolve, reject) => {
      try {
        const keys = this.wallets.map(TorusKeyring.generatePrivKey)
        resolve(keys)
      } catch (error) {
        reject(error)
      }
    })
  }

  static generatePrivKey(wallet) {
    return wallet.getPrivateKey().toString('hex')
  }

  static generateWallet(privateKey) {
    const stripped = ethUtil.stripHexPrefix(privateKey)
    const buffer = Buffer.from(stripped, 'hex')
    const wallet = Wallet.fromPrivateKey(buffer)
    return wallet
  }

  deserialize(privateKeys = []) {
    return new Promise((resolve, reject) => {
      try {
        this.wallets = privateKeys.map(TorusKeyring.generateWallet)
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }

  addAccount(privKey) {
    return new Promise((resolve, reject) => {
      try {
        for (let index = 0; index < this.wallets.length; index += 1) {
          const element = TorusKeyring.generatePrivKey(this.wallets[index])
          if (element === privKey) reject(new Error('Already added'))
        }
        this.wallets.push(TorusKeyring.generateWallet(privKey))
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }

  // Not using
  addRandomAccounts(n = 1) {
    const newWallets = []
    for (let i = 0; i < n; i += 1) {
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
    return new Promise((resolve, reject) => {
      try {
        const wallet = this._getWalletForAccount(address)
        const privKey = wallet.getPrivateKey()
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
        const privKey = wallet.getPrivateKey()
        const messageSig = ethUtil.ecsign(Buffer.from(message, 'hex'), privKey)
        const rawMessageSig = ethUtil.bufferToHex(sigUtil.concatSig(messageSig.v, messageSig.r, messageSig.s))
        resolve(rawMessageSig)
      } catch (error) {
        reject(error)
      }
    })
  }

  // For personal_sign, we need to prefix the message:
  signPersonalMessage(withAccount, messageHex) {
    return new Promise((resolve, reject) => {
      try {
        const wallet = this._getWalletForAccount(withAccount)
        const privKey = ethUtil.stripHexPrefix(wallet.getPrivateKey())
        const privKeyBuffer = Buffer.from(privKey, 'hex')
        const sig = sigUtil.personalSign(privKeyBuffer, { data: messageHex })
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
    const address = sigUtil.normalize(account)
    const wallet = this.wallets.find(w => ethUtil.bufferToHex(w.getAddress()) === address)
    if (!wallet) throw new Error('Torus Keyring - Unable to find matching address.')
    return wallet
  }
}
TorusKeyring.type = type
