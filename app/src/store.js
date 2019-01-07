import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
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
    setWallet (state, payload) {
      state.wallet = { ...payload.wallet }
    },
    setBalance (state, payload) {
      state.balance = { ...payload.balance }
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
    },
    updateNetworkId (context, payload) {
      context.commit('setNetworkId', payload.networkId)
    }
  }
})
