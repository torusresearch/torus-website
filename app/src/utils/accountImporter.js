const Wallet = require('ethereumjs-wallet')
const importers = require('ethereumjs-wallet/thirdparty')
const ethUtil = require('ethereumjs-util')
const log = require('loglevel')

const accountImporter = {
  importAccount(strategy, arguments_) {
    try {
      const importer = this.strategies[strategy]
      // eslint-disable-next-line prefer-spread
      const privateKeyHex = importer.apply(null, arguments_)
      return Promise.resolve(privateKeyHex)
    } catch (error) {
      return Promise.reject(error)
    }
  },

  strategies: {
    'Private Key': privateKey => {
      if (!privateKey) {
        throw new Error('Cannot import an empty key.')
      }

      const prefixed = ethUtil.addHexPrefix(privateKey)
      const buffer = ethUtil.toBuffer(prefixed)

      if (!ethUtil.isValidPrivate(buffer)) {
        throw new Error('Cannot import invalid private key.')
      }

      const stripped = ethUtil.stripHexPrefix(prefixed)
      return stripped
    },
    'JSON File': (input, password) => {
      let wallet
      try {
        wallet = importers.fromEtherWallet(input, password)
      } catch (error) {
        log.info('Attempt to import as EtherWallet format failed, trying V3...')
      }

      if (!wallet) {
        wallet = Wallet.fromV3(input, password, true)
      }

      return walletToPrivateKey(wallet)
    }
  }
}

function walletToPrivateKey(wallet) {
  const privateKeyBuffer = wallet.getPrivateKey()
  return ethUtil.stripHexPrefix(ethUtil.bufferToHex(privateKeyBuffer))
}

module.exports = accountImporter
