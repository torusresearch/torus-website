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
  reducer: (state) => {
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
    loggedIn: false,
    selectedAddress: '',
    networkId: 0,
    popupVisible: false
  },
  getters: {},
  mutations: {
    setEmail (state, email) {
      state.email = email
    },
    setIdToken (state, idToken) {
      state.idToken = idToken
    },
    setWallet (state, wallet) {
      state.wallet = wallet
    },
    setBalance (state, balance) {
      state.balance = balance
    },
    setLoginStatus (state, loggedIn) {
      state.loggedIn = loggedIn
    },
    setSelectedAddress (state, selectedAddress) {
      state.selectedAddress = selectedAddress
    },
    setNetworkId (state, networkId) {
      state.networkId = networkId
    },
    setPopupVisibility (state, popupVisible) {
      state.popupVisible = popupVisible
    }
  },
  actions: {
    showPopup (context, payload) {
      console.log(payload);
      var origin = extractRootDomain(document.referrer);
      var isTransaction = isTorusTransaction();
      if (isTorusTransaction()) {
        var txParams = getTransactionParams();
        var value = parseInt(txParams.value, 16) / 1000000000000000000
        if (isNaN(value)) {
          value = 0;
        }
        window.open("https://localhost:3000/confirm/type/transaction/origin/" + origin + "/balance/0/value/" + value + "/receiver/" + txParams.to);
      } else {
        window.open("https://localhost:3000/confirm/type/message/origin/" + origin);
      }
    },
    hidePopup(context, payload) {
      // context.commit('setPopupVisibility', false)
      // window.parent.postMessage('hideTorusIframe', '*');
    },
    updateEmail (context, payload) {
      context.commit('setEmail', payload.email)
    },
    updateIdToken (context, payload) {
      context.commit('setIdToken', payload.idToken)
    },
    addWallet (context, payload) {
      if (payload.ethAddress) {
        context.commit('setWallet', { ...context.state.wallet, [payload.ethAddress]: payload.privKey })
      }
    },
    removeWallet (context, payload) {
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
    updateBalance (context, payload) {
      if (payload.ethAddress && context.state.wallet.ethAddress) {
        context.commit('setBalance', { ...context.state.balance, [payload.ethAddress]: payload.value })
      }
    },
    updateLoginStatus (context, payload) {
      context.commit('setLoginStatus', payload.loggedIn)
    },
    updateSelectedAddress (context, payload) {
      context.commit('setSelectedAddress', payload.selectedAddress)
      torusUtils.updateStaticData({ selectedAddress: payload.selectedAddress })
    },
    updateNetworkId (context, payload) {
      context.commit('setNetworkId', payload.networkId)
      torusUtils.updateStaticData({ networkId: payload.networkId })
    },
    triggerLogin: function () {
      if (window.auth2 === undefined) {
        log.error('Could not find window.auth2, might not be loaded yet')
        return
      }
      window.auth2.signIn().then(function (googleUser) {
        log.info('GOOGLE USER: ', googleUser)
        var profile = googleUser.getBasicProfile()
        // console.log(googleUser)
        log.info('ID: ' + profile.getId()) // Do not send to your backend! Use an ID token instead.
        log.info('Name: ' + profile.getName())
        log.info('Image URL: ' + profile.getImageUrl())
        log.info('Email: ' + profile.getEmail()) // This is null if the 'email' scope is not present.

        VuexStore.dispatch('updateIdToken', { idToken: googleUser.getAuthResponse().id_token })
        var email = profile.getEmail()
        VuexStore.dispatch('updateEmail', { email })
        window.gapi.auth2.getAuthInstance().disconnect().then(function () {
          torusUtils.getPubKeyAsync(torusUtils.web3, config.torusNodeEndpoints, email, function (err, res) {
            if (err) {
              log.error(err)
            } else {
              log.info('New private key assigned to user at address ', res)
              torusUtils.retrieveShares(
                config.torusNodeEndpoints,
                VuexStore.state.email,
                VuexStore.state.idToken,
                function (err, data) {
                  if (err) { log.error(err) }
                  VuexStore.dispatch('updateSelectedAddress', { selectedAddress: data.ethAddress })
                  VuexStore.dispatch('addWallet', data)
                  torusUtils.web3.eth.net.getId()
                    .then(res => {
                      VuexStore.dispatch('updateNetworkId', { networkId: res })
                    // publicConfigOutStream.write(JSON.stringify({networkVersion: res}))
                    })
                    .catch(e => log.error(e))
                }
              )
            }
          })
        }).catch(function (err) {
          log.error(err)
        })
      })
    }
  }
})

var bc = new BroadcastChannel('torus_channel');
bc.onmessage = function (ev) { 
  if (ev.origin === 'https://localhost:3000' || 'https://tor.us') {
    if (ev.data === 'confirm-transaction') {
        let torusController = window.Vue.TorusUtils.torusController
        let state = torusController.getState()
        if (Object.keys(state.unapprovedPersonalMsgs).length > 0) {
          let unapprovedPersonalMsgs = []
          console.log(state)
          for (let id in state.unapprovedPersonalMsgs) {
            unapprovedPersonalMsgs.push(state.unapprovedPersonalMsgs[id])
          }
          unapprovedPersonalMsgs = unapprovedPersonalMsgs.sort((a, b) => { return a.time - b.time })
          console.log(unapprovedPersonalMsgs)
          let msgParams = unapprovedPersonalMsgs[0].msgParams
          msgParams.metamaskId = parseInt(unapprovedPersonalMsgs[0].id)
          torusController.signPersonalMessage(msgParams)
        } else if (Object.keys(state.unapprovedMsgs).length > 0) {
          let unapprovedMsgs = []
          console.log(state)
          for (let id in state.unapprovedMsgs) {
            unapprovedMsgs.push(state.unapprovedMsgs[id])
          }
          unapprovedMsgs = unapprovedMsgs.sort((a, b) => { return a.time - b.time })
          console.log(unapprovedMsgs)
          let msgParams = unapprovedMsgs[0].msgParams
          msgParams.metamaskId = parseInt(unapprovedMsgs[0].id)
          torusController.signPersonalMessage(msgParams)
        } else if (Object.keys(state.unapprovedTypedMessages).length > 0) {
          let unapprovedTypedMessages = []
          console.log(state)
          for (let id in state.unapprovedTypedMessages) {
            unapprovedTypedMessages.push(state.unapprovedTypedMessages[id])
          }
          unapprovedTypedMessages = unapprovedTypedMessages.sort((a, b) => { return a.time - b.time })
          console.log(unapprovedTypedMessages)
          let msgParams = unapprovedTypedMessages[0].msgParams
          msgParams.metamaskId = parseInt(unapprovedTypedMessages[0].id)
          torusController.signPersonalMessage(msgParams)
        } else if (Object.keys(state.transactions).length > 0) {
          let transactions = []
          console.log(state)
          for (let id in state.transactions) {
            if (state.transactions[id].status === "unapproved") {
              transactions.push(state.transactions[id])
            }
          }
          console.log(transactions)
          torusController.updateAndApproveTransaction(transactions[0])
        } else {
          throw new Error('NO NEW TRANSACTIONS!!!!')
        }
    }
  }
}

// setup handlers for communicationStream
var passthroughStream = new stream.PassThrough({ objectMode: true })
passthroughStream.on('data', function () {
  log.info('p data:', arguments)
})
torusUtils.communicationMux.getStream('oauth').on('data', function () {
  VuexStore.dispatch('triggerLogin')
})

pump(torusUtils.communicationMux.getStream('oauth'), passthroughStream, (err) => {
  if (err) log.error(err)
})

function getTransactionParams() {
  let torusController = window.Vue.TorusUtils.torusController
  let state = torusController.getState()
  let transactions = []
  for (let id in state.transactions) {
    if (state.transactions[id].status === "unapproved") {
      transactions.push(state.transactions[id])
    }
  }
  return transactions[0].txParams;
}

function isTorusTransaction() {
  let torusController = window.Vue.TorusUtils.torusController
  let state = torusController.getState()
  if (Object.keys(state.unapprovedPersonalMsgs).length > 0) {
    return false;
  } else if (Object.keys(state.unapprovedMsgs).length > 0) {
    return false;
  } else if (Object.keys(state.unapprovedTypedMessages).length > 0) {
    return false;
  } else if (Object.keys(state.transactions).length > 0) {
    let transactions = []
    for (let id in state.transactions) {
      if (state.transactions[id].status === "unapproved") {
        return true;
      }
    }
  } else {
    throw new Error('NO NEW TRANSACTIONS!!!!')
  }
}

function extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}

// To address those who want the "root domain," use this function:
function extractRootDomain(url) {
    var domain = extractHostname(url),
        splitArr = domain.split('.'),
        arrLen = splitArr.length;

    //extracting the root domain here
    //if there is a subdomain 
    if (arrLen > 2) {
        domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
        //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
        if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
            //this is using a ccTLD
            domain = splitArr[arrLen - 3] + '.' + domain;
        }
    }
    return domain;
}

export default VuexStore
