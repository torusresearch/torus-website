import { bufferToHex, ecsign, stripHexPrefix } from '@ethereumjs/util'
import { concatSig, decrypt, getEncryptionPublicKey, normalize, personalSign, signTypedData } from '@metamask/eth-sig-util'
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

  async serialize() {
    const keys = this.wallets.map((x) => this.generatePrivKey(x))
    return keys
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

  async deserialize(privateKeys = []) {
    const existingKeys = this.wallets.map((x) => this.generatePrivKey(x))
    this.wallets = [...new Set([...existingKeys, ...privateKeys])].map((x) => this.generateWallet(x))
  }

  async addAccount(privKey) {
    for (let index = 0; index < this.wallets.length; index += 1) {
      const element = this.generatePrivKey(this.wallets[index])
      if (element === privKey) throw new Error('Already added')
    }
    this.wallets.push(this.generateWallet(privKey))
  }

  // Not using
  async addRandomAccounts(n = 1) {
    const newWallets = []
    for (let i = 0; i < n; i += 1) {
      newWallets.push(Wallet.generate())
    }
    this.wallets = [...this.wallets, ...newWallets]
    const hexWallets = newWallets.map((w) => bufferToHex(w.getAddress()))
    return hexWallets
  }

  // Not using
  async getAccounts() {
    return this.wallets.map((w) => bufferToHex(w.getAddress()))
  }

  // tx is an instance of the ethereumjs-transaction class.
  async signTransaction(tx, address) {
    const wallet = this._getWalletForAccount(address)
    const privKey = wallet.getPrivateKey()
    const signedTx = tx.sign(privKey)
    // Newer versions of Ethereumjs-tx are immutable and return a new tx object
    return signedTx === undefined ? tx : signedTx
  }

  // For eth_sign, we need to sign arbitrary data:
  async signMessage(address, data) {
    const wallet = this._getWalletForAccount(address)
    const message = stripHexPrefix(data)
    const privKey = wallet.getPrivateKey()
    const messageSig = ecsign(Buffer.from(message, 'hex'), privKey)
    const rawMessageSig = concatSig(messageSig.v, messageSig.r, messageSig.s)
    return rawMessageSig
  }

  // For personal_sign, we need to prefix the message:
  async signPersonalMessage(address, messageHex) {
    const wallet = this._getWalletForAccount(address)
    const privKey = stripHexPrefix(wallet.getPrivateKeyString())
    const privKeyBuffer = Buffer.from(privKey, 'hex')
    const sig = personalSign({ privateKey: privKeyBuffer, data: messageHex })
    return sig
  }

  // personal_signTypedData, signs data along with the schema
  async signTypedData(withAccount, typedData, version = 'V1') {
    const wallet = this._getWalletForAccount(withAccount)
    const privKey = wallet.getPrivateKey()
    return signTypedData({ privateKey: privKey, data: typedData, version })
  }

  // not using
  // exportAccount should return a hex-encoded private key:
  async exportAccount(address) {
    const wallet = this._getWalletForAccount(address)
    return wallet.getPrivateKey().toString('hex')
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

  decryptMessage(data, address) {
    const wallet = this._getWalletForAccount(address)
    const privKey = wallet.getPrivateKey()
    return decrypt({ encryptedData: data, privateKey: privKey })
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
