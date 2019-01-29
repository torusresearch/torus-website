import Vue from 'vue'
import Vuex from 'vuex'
import log from 'loglevel'
import torusUtils from './utils/torusUtils'
import stream from 'stream'
import pump from 'pump'
import config from './config'
import VuexPersist from 'vuex-persist'

Vue.use(Vuex)

const vuexPersist = new VuexPersist({
  key: 'my-app',
  storage: window.sessionStorage,
  reducer: state => {
    return { ...state, popupVisible: false }
  }
})

var VuexStore = new Vuex.Store({
  plugins: [vuexPersist.plugin],
  state: {
    email: '',
    idToken: '',
    wallet: {},
    balance: {},
    weiBalance: 0,
    loggedIn: false,
    selectedAddress: '',
    networkId: 0,
    popupVisible: false
  },
  getters: {},
  mutations: {
    setEmail(state, email) {
      state.email = email
    },
    setIdToken(state, idToken) {
      state.idToken = idToken
    },
    setWallet(state, wallet) {
      state.wallet = wallet
    },
    setBalance(state, balance) {
      state.balance = balance
    },
    setWeiBalance(state, weiBalance) {
      state.weiBalance = weiBalance
    },
    setLoginStatus(state, loggedIn) {
      state.loggedIn = loggedIn
    },
    setSelectedAddress(state, selectedAddress) {
      state.selectedAddress = selectedAddress
    },
    setNetworkId(state, networkId) {
      state.networkId = networkId
    },
    setPopupVisibility(state, popupVisible) {
      state.popupVisible = popupVisible
    }
  },
  actions: {
    showPopup(context, payload) {
      var bc = new BroadcastChannel('torus_channel')
      window.open('/confirm', '_blank', 'toolbar=0,location=0,menubar=0,height=400,width=600')
      if (isTorusTransaction()) {
        var txParams = getTransactionParams()
        var value
        if (txParams.value) {
          value = torusUtils.web3.utils.fromWei(txParams.value.toString())
        } else {
          value = 0
        }
        var balance = torusUtils.web3.utils.fromWei(this.state.weiBalance.toString())
        bc.onmessage = function(ev) {
          if (ev.origin === 'https://localhost:3000' || ev.origin === 'https://tor.us') {
            if (ev.data === 'popup-loaded') {
              bc.postMessage({ origin: document.referrer, type: 'transaction', balance: balance, value: value, receiver: txParams.to })
              bc.close()
            }
          }
        }
      } else {
        bc.onmessage = function(ev) {
          if (ev.origin === 'https://localhost:3000' || ev.origin === 'https://tor.us') {
            if (ev.data === 'popup-loaded') {
              bc.postMessage({ origin: document.referrer, type: 'message' })
              bc.close()
            }
          }
        }
      }
    },
    hidePopup(context, payload) {},
    updateEmail(context, payload) {
      context.commit('setEmail', payload.email)
    },
    updateIdToken(context, payload) {
      context.commit('setIdToken', payload.idToken)
    },
    addWallet(context, payload) {
      if (payload.ethAddress) {
        context.commit('setWallet', { ...context.state.wallet, [payload.ethAddress]: payload.privKey })
      }
    },
    removeWallet(context, payload) {
      if (payload.ethAddress) {
        var stateWallet = { ...context.state.wallet }
        delete stateWallet[payload.ethAddress]
        context.commit('setWallet', { ...stateWallet })
        if (context.state.balance[payload.ethAddress]) {
          var stateBalance = { ...context.state.balance }
          delete stateBalance[payload.ethAddress]
          context.commit('setBalance', { ...stateBalance })
        }
      }
    },
    updateBalance(context, payload) {
      if (payload.ethAddress && context.state.wallet.ethAddress) {
        context.commit('setBalance', { ...context.state.balance, [payload.ethAddress]: payload.value })
      }
    },
    updateWeiBalance(context, payload) {
      if (this.state.selectedAddress) {
        torusUtils.web3.eth.getBalance(this.state.selectedAddress, function(err, res) {
          if (err) {
            log.error(err)
          }
          context.commit('setWeiBalance', res)
        })
      }
    },
    updateLoginStatus(context, payload) {
      context.commit('setLoginStatus', payload.loggedIn)
    },
    updateSelectedAddress(context, payload) {
      context.commit('setSelectedAddress', payload.selectedAddress)
      torusUtils.updateStaticData({ selectedAddress: payload.selectedAddress })
    },
    updateNetworkId(context, payload) {
      context.commit('setNetworkId', payload.networkId)
      torusUtils.updateStaticData({ networkId: payload.networkId })
    },
    triggerLogin: function() {
      if (window.auth2 === undefined) {
        log.error('Could not find window.auth2, might not be loaded yet')
        return
      }
      window.auth2.signIn().then(function(googleUser) {
        log.info('GOOGLE USER: ', googleUser)
        let profile = googleUser.getBasicProfile()
        // console.log(googleUser)
        log.info('ID: ' + profile.getId()) // Do not send to your backend! Use an ID token instead.
        log.info('Name: ' + profile.getName())
        log.info('Image URL: ' + profile.getImageUrl())
        log.info('Email: ' + profile.getEmail()) // This is null if the 'email' scope is not present.

        VuexStore.dispatch('updateIdToken', { idToken: googleUser.getAuthResponse().id_token })
        let email = profile.getEmail()
        VuexStore.dispatch('updateEmail', { email })
        window.gapi.auth2
          .getAuthInstance()
          .disconnect()
          .then(function() {
            torusUtils.getPubKeyAsync(torusUtils.web3, config.torusNodeEndpoints, email, function(err, res) {
              if (err) {
                log.error(err)
              } else {
                log.info('New private key assigned to user at address ', res)
                torusUtils.retrieveShares(config.torusNodeEndpoints, VuexStore.state.email, VuexStore.state.idToken, function(err, data) {
                  if (err) {
                    log.error(err)
                  }
                  VuexStore.dispatch('updateSelectedAddress', { selectedAddress: data.ethAddress })
                  VuexStore.dispatch('addWallet', data)
                  let torusController = window.Vue.TorusUtils.torusController
                  torusController.createNewVaultAndKeychain(VuexStore.state.idToken).then(() => torusController.addNewKeyring('Torus Keyring'))
                  torusUtils.web3.eth.net
                    .getId()
                    .then(res => {
                      VuexStore.dispatch('updateNetworkId', { networkId: res })
                      // publicConfigOutStream.write(JSON.stringify({networkVersion: res}))
                    })
                    .catch(e => log.error(e))
                })
              }
            })
          })
          .catch(function(err) {
            log.error(err)
          })
      })
    }
  }
})

// setup handlers for communicationStream
var passthroughStream = new stream.PassThrough({ objectMode: true })
passthroughStream.on('data', function() {
  log.info('p data:', arguments)
})
torusUtils.communicationMux.getStream('oauth').on('data', function() {
  VuexStore.dispatch('triggerLogin')
})

pump(torusUtils.communicationMux.getStream('oauth'), passthroughStream, err => {
  if (err) log.error(err)
})

var bc = new BroadcastChannel('torus_channel')
bc.onmessage = function(ev) {
  if (ev.origin === 'https://localhost:3000' || ev.origin === 'https://tor.us') {
    if (ev.data === 'confirm-transaction') {
      let torusController = window.Vue.TorusUtils.torusController
      let state = torusController.getState()
      if (Object.keys(state.unapprovedPersonalMsgs).length > 0) {
        let unapprovedPersonalMsgs = []
        for (let id in state.unapprovedPersonalMsgs) {
          unapprovedPersonalMsgs.push(state.unapprovedPersonalMsgs[id])
        }
        unapprovedPersonalMsgs = unapprovedPersonalMsgs.sort((a, b) => {
          return a.time - b.time
        })
        let msgParams = unapprovedPersonalMsgs[0].msgParams
        msgParams.metamaskId = parseInt(unapprovedPersonalMsgs[0].id)
        torusController.signPersonalMessage(msgParams)
      } else if (Object.keys(state.unapprovedMsgs).length > 0) {
        let unapprovedMsgs = []
        for (let id in state.unapprovedMsgs) {
          unapprovedMsgs.push(state.unapprovedMsgs[id])
        }
        unapprovedMsgs = unapprovedMsgs.sort((a, b) => {
          return a.time - b.time
        })
        let msgParams = unapprovedMsgs[0].msgParams
        msgParams.metamaskId = parseInt(unapprovedMsgs[0].id)
        torusController.signPersonalMessage(msgParams)
      } else if (Object.keys(state.unapprovedTypedMessages).length > 0) {
        let unapprovedTypedMessages = []
        for (let id in state.unapprovedTypedMessages) {
          unapprovedTypedMessages.push(state.unapprovedTypedMessages[id])
        }
        unapprovedTypedMessages = unapprovedTypedMessages.sort((a, b) => {
          return a.time - b.time
        })
        let msgParams = unapprovedTypedMessages[0].msgParams
        msgParams.metamaskId = parseInt(unapprovedTypedMessages[0].id)
        torusController.signPersonalMessage(msgParams)
      } else if (Object.keys(state.transactions).length > 0) {
        let transactions = []
        for (let id in state.transactions) {
          if (state.transactions[id].status === 'unapproved') {
            transactions.push(state.transactions[id])
          }
        }
        torusController.updateAndApproveTransaction(transactions[0])
      } else {
        throw new Error('No new transactions.')
      }
    } else if (ev.data === 'deny-transaction') {
      let torusController = window.Vue.TorusUtils.torusController
      let state = torusController.getState()
      if (Object.keys(state.unapprovedPersonalMsgs).length > 0) {
        let unapprovedPersonalMsgs = []
        for (let id in state.unapprovedPersonalMsgs) {
          unapprovedPersonalMsgs.push(state.unapprovedPersonalMsgs[id])
        }
        unapprovedPersonalMsgs = unapprovedPersonalMsgs.sort((a, b) => {
          return a.time - b.time
        })
        let msgParams = unapprovedPersonalMsgs[0].msgParams
        msgParams.metamaskId = parseInt(unapprovedPersonalMsgs[0].id)
        torusController.cancelPersonalMessage(msgParams.metamaskId)
      } else if (Object.keys(state.unapprovedMsgs).length > 0) {
        let unapprovedMsgs = []
        for (let id in state.unapprovedMsgs) {
          unapprovedMsgs.push(state.unapprovedMsgs[id])
        }
        unapprovedMsgs = unapprovedMsgs.sort((a, b) => {
          return a.time - b.time
        })
        let msgParams = unapprovedMsgs[0].msgParams
        msgParams.metamaskId = parseInt(unapprovedMsgs[0].id)
        torusController.cancelPersonalMessage(msgParams.metamaskId)
      } else if (Object.keys(state.unapprovedTypedMessages).length > 0) {
        let unapprovedTypedMessages = []
        for (let id in state.unapprovedTypedMessages) {
          unapprovedTypedMessages.push(state.unapprovedTypedMessages[id])
        }
        unapprovedTypedMessages = unapprovedTypedMessages.sort((a, b) => {
          return a.time - b.time
        })
        let msgParams = unapprovedTypedMessages[0].msgParams
        msgParams.metamaskId = parseInt(unapprovedTypedMessages[0].id)
        torusController.cancelPersonalMessage(msgParams.metamaskId)
      } else if (Object.keys(state.transactions).length > 0) {
        let transactions = []
        for (let id in state.transactions) {
          if (state.transactions[id].status === 'unapproved') {
            transactions.push(state.transactions[id])
          }
        }
        torusController.updateAndCancelTransaction(transactions[0])
      }
    }
  }
}

function getTransactionParams() {
  let torusController = window.Vue.TorusUtils.torusController
  let state = torusController.getState()
  let transactions = []
  for (let id in state.transactions) {
    if (state.transactions[id].status === 'unapproved') {
      transactions.push(state.transactions[id])
    }
  }
  return transactions[0].txParams
}

function isTorusTransaction() {
  let torusController = window.Vue.TorusUtils.torusController
  let state = torusController.getState()
  if (Object.keys(state.unapprovedPersonalMsgs).length > 0) {
    return false
  } else if (Object.keys(state.unapprovedMsgs).length > 0) {
    return false
  } else if (Object.keys(state.unapprovedTypedMessages).length > 0) {
    return false
  } else if (Object.keys(state.transactions).length > 0) {
    for (let id in state.transactions) {
      if (state.transactions[id].status === 'unapproved') {
        return true
      }
    }
  } else {
    throw new Error('No new transactions.')
  }
}

export default VuexStore
