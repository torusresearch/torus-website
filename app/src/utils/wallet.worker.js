import ThirdPartyWallets from 'ethereumjs-wallet/thirdparty'
import Wallet from 'ethereumjs-wallet'

const fromMyEtherWalletV2 = json => {
  if (json.privKey.length !== 64) {
    throw new Error('Invalid private key length')
  }
  const privKey = Buffer.from(json.privKey, 'hex')
  return new Wallet(privKey)
}
const getWalletFromPrivKeyFile = (jsonfile, password) => {
  if (jsonfile.encseed != null) return Wallet.fromEthSale(jsonfile, password)
  else if (jsonfile.Crypto != null || jsonfile.crypto != null) return Wallet.fromV3(jsonfile, password, true)
  else if (jsonfile.hash != null) return ThirdPartyWallets.fromEtherWallet(jsonfile, password)
  else if (jsonfile.publisher === 'MyEtherWallet') return fromMyEtherWalletV2(jsonfile)
  throw new Error('Invalid Wallet file')
}

const unlock = (file, password) => {
  const newFile = {}
  // Small hack because non strict wasn't working..
  Object.keys(file).forEach(key => {
    newFile[key.toLowerCase()] = file[key]
  })

  return getWalletFromPrivKeyFile(newFile, password)
}

// onmessage breaks tests as it is undefined
if (!navigator.userAgent.includes('Node.js') && !navigator.userAgent.includes('jsdom')) {
  onmessage = event => {
    if (event.data.type === 'unlockWallet') {
      const workerResult = unlock(event.data.data[0], event.data.data[1])
      postMessage(workerResult)
    }
  }
}
