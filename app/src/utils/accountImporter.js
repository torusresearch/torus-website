import { addHexPrefix, isValidPrivate, stripHexPrefix, toBuffer } from 'ethereumjs-util'
import { fromV3 } from 'ethereumjs-wallet'
import { fromEtherWallet } from 'ethereumjs-wallet/thirdparty'
import log from 'loglevel'

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
    'Private Key': (privateKey) => {
      if (!privateKey) {
        throw new Error('Cannot import an empty key.')
      }

      const prefixed = addHexPrefix(privateKey)
      const buffer = toBuffer(prefixed)

      if (!isValidPrivate(buffer)) {
        throw new Error('Cannot import invalid private key.')
      }

      const stripped = stripHexPrefix(prefixed)
      return stripped
    },
    'JSON File': (input, password) => {
      let wallet
      try {
        wallet = fromEtherWallet(input, password)
      } catch (error) {
        log.info('Attempt to import as EtherWallet format failed, trying V3...')
      }

      if (!wallet) {
        wallet = fromV3(input, password, true)
      }

      return walletToPrivateKey(wallet)
    },
  },
}

function walletToPrivateKey(wallet) {
  const privateKeyString = wallet.getPrivateKeyString()
  return stripHexPrefix(privateKeyString)
}

export default accountImporter
