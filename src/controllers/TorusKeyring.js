import {
  concatSig,
  decrypt,
  getEncryptionPublicKey,
  normalize,
  personalSign,
  signTypedData,
  signTypedData_v4 as signTypedDataV4,
  signTypedDataLegacy,
} from 'eth-sig-util'
import { bufferToHex, ecsign, stripHexPrefix } from 'ethereumjs-util'
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
      .catch((error) => log.error('unable to deserialize', error))
  }

  serialize() {
    return new Promise((resolve, reject) => {
      try {
        const keys = this.wallets.map((x) => this.generatePrivKey(x))
        resolve(keys)
      } catch (error) {
        reject(error)
      }
    })
  }

  generatePrivKey(wallet) {
    return wallet.getPrivateKey().toString('hex')
  }

  generateWallet(privateKey) {
    const stripped = stripHexPrefix(privateKey)
    const buffer = Buffer.from(stripped, 'hex')
    const wallet = Wallet.fromPrivateKey(buffer)
    return wallet
  }

  deserialize(privateKeys = []) {
    return new Promise((resolve, reject) => {
      try {
        const existingKeys = this.wallets.map((x) => this.generatePrivKey(x))
        this.wallets = [...new Set([...existingKeys, ...privateKeys])].map((x) => this.generateWallet(x))
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
    const newWallets = []
    for (let i = 0; i < n; i += 1) {
      newWallets.push(Wallet.generate())
    }
    this.wallets = [...this.wallets, ...newWallets]
    const hexWallets = newWallets.map((w) => bufferToHex(w.getAddress()))
    return Promise.resolve(hexWallets)
  }

  // Not using
  getAccounts() {
    return Promise.resolve(this.wallets.map((w) => bufferToHex(w.getAddress())))
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
        const message = stripHexPrefix(data)
        const privKey = wallet.getPrivateKey()
        const messageSig = ecsign(Buffer.from(message, 'hex'), privKey)
        const rawMessageSig = concatSig(messageSig.v, messageSig.r, messageSig.s)
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
        const privKey = stripHexPrefix(wallet.getPrivateKeyString())
        const privKeyBuffer = Buffer.from(privKey, 'hex')
        const sig = personalSign(privKeyBuffer, { data: messageHex })
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
        const privKey = wallet.getPrivateKey()
        let parsedData = typedData
        if (typeof parsedData === 'string') {
          parsedData = JSON.parse(parsedData)
        }
        let signature
        if (version) {
          switch (version) {
            case 'V1':
              signature = signTypedDataLegacy(privKey, { data: typedData })
              break
            case 'V4':
              signature = signTypedDataV4(privKey, { data: parsedData })
              break
            case 'V3':
            default:
              signature = signTypedData(privKey, { data: parsedData })
              break
          }
        } else {
          signature = signTypedData(privKey, { data: parsedData })
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
    if (!this.wallets.map((w) => w.getAddressString().toLowerCase()).includes(address.toLowerCase())) {
      throw new Error(`Address ${address} not found in this keyring`)
    }
    this.wallets = this.wallets.filter((w) => w.getAddressString().toLowerCase() !== address.toLowerCase())
  }

  signEncryptionPublicKey(address) {
    const wallet = this._getWalletForAccount(address)
    const privKey = wallet.getPrivateKey()
    return getEncryptionPublicKey(privKey)
  }

  decryptMessage(msgParams, address) {
    const wallet = this._getWalletForAccount(address)
    const privKey = wallet.getPrivateKey()
    return decrypt(msgParams.data, privKey)
  }

  /* PRIVATE METHODS */

  _getWalletForAccount(account) {
    const address = normalize(account)
    const wallet = this.wallets.find((w) => w.getAddressString() === address)
    if (!wallet) throw new Error('Torus Keyring - Unable to find matching address.')
    return wallet
  }
}
TorusKeyring.type = type
