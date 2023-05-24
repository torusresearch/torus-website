import { stripHexPrefix } from '@ethereumjs/util'
import { Wallet } from 'ethers'
import log from 'loglevel'

const getV3Filename = (address) => {
  const ts = new Date()
  return ['UTC--', ts.toJSON().replace(/:/g, '-'), '--', address.toString('hex')].join('')
}

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
    const wallet = await Wallet.fromEncryptedJson(JSON.stringify(jsonfile), password)
    return wallet
  }
  if (jsonfile.publisher === 'MyEtherWallet') return fromMyEtherWalletV2(jsonfile)
  throw new Error('Invalid Wallet file')
}

const generateWallet = (privateKey) => {
  const stripped = stripHexPrefix(privateKey)
  const buffer = Buffer.from(stripped, 'hex')
  const wallet = new Wallet(buffer)
  return wallet
}

const create = async (password, privateKey) => {
  const createdWallet = {}
  const wallet = generateWallet(privateKey)
  createdWallet.walletJson = await wallet.encrypt(password)
  createdWallet.name = getV3Filename(wallet.address)
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
        const { privateKey } = await unlock(event.data.data[0], event.data.data[1])
        postMessage({ privateKey })
      }
    } catch (error) {
      log.error(error)
      setTimeout(() => {
        throw error
      }, 0)
    }
  }
}
