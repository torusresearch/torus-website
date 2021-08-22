// import log from 'loglevel'

// const walletConnectStorageId = 'walletconnect'

class WalletConnectNoopStorage {
  getSession() {
    // let session = null
    // const storedSession = sessionStorage.getItem(walletConnectStorageId)
    // try {
    //   session = JSON.parse(storedSession)
    // } catch (error) {
    //   log.error(error)
    // }
    // return session
    return null
  }

  setSession() {
    // let session = null
    // try {
    //   session = JSON.stringify(sessionObj)
    // } catch (error) {
    //   log.error(error)
    // }
    // sessionStorage.setItem(walletConnectStorageId, session)
  }

  removeSession() {
    // sessionStorage.removeItem(walletConnectStorageId)
  }
}

export default WalletConnectNoopStorage
