import { addHexPrefix, hexToBytes, isValidPrivate, stripHexPrefix } from '@ethereumjs/util'
import { Wallet } from 'ethers'

const accountImporter = {
  async importAccount(strategy, arguments_) {
    const importer = this.strategies[strategy]
    const privateKeyHex = await importer(...arguments_)
    return privateKeyHex
  },

  strategies: {
    'Private Key': async (privateKey) => {
      if (!privateKey) {
        throw new Error('Cannot import an empty key.')
      }

      const prefixed = addHexPrefix(privateKey)
      const buffer = hexToBytes(prefixed)

      if (!isValidPrivate(buffer)) {
        throw new Error('Cannot import invalid private key.')
      }

      const stripped = stripHexPrefix(prefixed)
      return stripped
    },
    'JSON File': async (input, password) => {
      let wallet
      try {
        wallet = await Wallet.fromEncryptedJson(JSON.stringify(input), password)
      } catch (error) {
        // eslint-disable-next-line no-undef
        log.info('Attempt to import as EtherWallet format failed, trying V3...', error)
        throw error
      }

      return walletToPrivateKey(wallet)
    },
  },
}

function walletToPrivateKey(wallet) {
  const privateKeyString = wallet.privateKey
  return stripHexPrefix(privateKeyString)
}

export default accountImporter
