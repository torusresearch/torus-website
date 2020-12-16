import { addHexPrefix, isValidPrivate, stripHexPrefix, toBuffer } from 'ethereumjs-util'
import Wallet, { thirdparty as ThirdParty } from 'ethereumjs-wallet'
import log from 'loglevel'

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
      const buffer = toBuffer(prefixed)

      if (!isValidPrivate(buffer)) {
        throw new Error('Cannot import invalid private key.')
      }

      const stripped = stripHexPrefix(prefixed)
      return stripped
    },
    'JSON File': async (input, password) => {
      let wallet
      try {
        wallet = ThirdParty.fromEtherWallet(input, password)
      } catch (error) {
        log.info('Attempt to import as EtherWallet format failed, trying V3...', error)
      }

      if (!wallet) {
        wallet = await Wallet.fromV3(input, password, true)
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
