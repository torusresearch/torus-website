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
  storage: window.sessionStorage
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
    networkId: 0
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
    }
  },
  actions: {
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

export default VuexStore
