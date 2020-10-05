import log from 'loglevel'

const walletConnectStorageId = 'walletconnect'

class WalletConnectSessionStorage {
  getSession() {
    let session = null
    const storedSession = sessionStorage.getItem(walletConnectStorageId)
    try {
      session = JSON.parse(storedSession)
    } catch (error) {
      log.error(error)
    }
    return session
  }

  setSession(sessionObj) {
    let session = null
    try {
      session = JSON.stringify(sessionObj)
    } catch (error) {
      log.error(error)
    }
    sessionStorage.setItem(walletConnectStorageId, session)
  }

  removeSession() {
    sessionStorage.removeItem(walletConnectStorageId)
  }
}

export default WalletConnectSessionStorage
