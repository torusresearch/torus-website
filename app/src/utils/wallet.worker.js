import { stripHexPrefix } from 'ethereumjs-util'
import Wallet, { thirdparty as ThirdParty } from 'ethereumjs-wallet'
import log from 'loglevel'

const fromMyEtherWalletV2 = (json) => {
  if (json.privKey.length !== 64) {
    throw new Error('Invalid private key length')
  }
  const privKey = Buffer.from(json.privKey, 'hex')
  return new Wallet(privKey)
}
const getWalletFromPrivKeyFile = async (jsonfile, password) => {
  if (jsonfile.encseed != null) return Wallet.fromEthSale(jsonfile, password)
  if (jsonfile.Crypto != null || jsonfile.crypto != null) {
    const wallet = await Wallet.fromV3(jsonfile, password, true)
    return wallet
  }
  if (jsonfile.hash != null) return ThirdParty.fromEtherWallet(jsonfile, password)
  if (jsonfile.publisher === 'MyEtherWallet') return fromMyEtherWalletV2(jsonfile)
  throw new Error('Invalid Wallet file')
}

const generateWallet = (privateKey) => {
  const stripped = stripHexPrefix(privateKey)
  const buffer = Buffer.from(stripped, 'hex')
  const wallet = Wallet.fromPrivateKey(buffer)
  return wallet
}

const create = async (password, privateKey) => {
  const createdWallet = {}
  const wallet = generateWallet(privateKey)
  createdWallet.walletJson = await wallet.toV3(password)
  createdWallet.name = wallet.getV3Filename()
  return createdWallet
}

const unlock = async (file, password) => {
  const newFile = {}
  // Small hack because non strict wasn't working..
  Object.keys(file).forEach((key) => {
    newFile[key.toLowerCase()] = file[key]
  })

  const wallet = await getWalletFromPrivKeyFile(newFile, password)
  return wallet
}

// onmessage breaks tests as it is undefined
if (!navigator.userAgent.includes('Node.js') && !navigator.userAgent.includes('jsdom')) {
  onmessage = async (event) => {
    try {
      if (event.data.type === 'createWallet') {
        const workerResult = await create(event.data.data[0], event.data.data[1])
        postMessage(workerResult)
      } else if (event.data.type === 'unlockWallet') {
        const workerResult = await unlock(event.data.data[0], event.data.data[1])
        postMessage(workerResult)
      }
    } catch (error) {
      log.error(error)
      setTimeout(() => {
        throw error
      }, 0)
    }
  }
}
