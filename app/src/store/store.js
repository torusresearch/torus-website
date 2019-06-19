import Vue from 'vue'
import Vuex from 'vuex'
import log from 'loglevel'
import torus from '../torus'
import config from '../config'
import VuexPersistence from 'vuex-persist'
import { hexToText, significantDigits, formatCurrencyNumber } from '../utils/utils'
import { MAINNET, RPC } from '../utils/enums'
import BroadcastChannel from 'broadcast-channel'

const baseRoute = process.env.BASE_URL

Vue.use(Vuex)

const vuexPersist = new VuexPersistence({
  key: 'my-app',
  storage: window.sessionStorage,
  reducer: state => {
    return {
      email: state.email,
      idToken: state.idToken,
      wallet: state.wallet,
      // weiBalance: state.weiBalance,
      selectedAddress: state.selectedAddress,
      networkId: state.networkId,
      currencyData: state.currencyData,
      // tokenData: state.tokenData,
      tokenRates: state.tokenRates,
      selectedCurrency: state.selectedCurrency
    }
  }
})

var walletWindow

const initialState = {
  email: '',
  idToken: '',
  wallet: {},
  weiBalance: 0,
  selectedAddress: '',
  selectedCurrency: 'USD',
  networkId: 0,
  networkType: localStorage.getItem('torus_network_type') || MAINNET,
  currencyData: {},
  tokenData: {},
  tokenRates: {},
  transactions: [],
  loginInProgress: false,
  rpcDetails: JSON.parse(localStorage.getItem('torus_custom_rpc')) || {}
}

var VuexStore = new Vuex.Store({
  plugins: [vuexPersist.plugin],
  state: {
    ...initialState
  },
  getters: {
    unApprovedTransactions: state => {
      const transactions = []
      for (let id in state.transactions) {
        if (state.transactions[id].status === 'unapproved') {
          transactions.push(state.transactions[id])
        }
      }
      return transactions
    },
    tokenBalances: state => {
      let { weiBalance, tokenData, tokenRates, currencyData, selectedCurrency, networkType } = state || {}
      if (networkType !== MAINNET) {
        tokenData = {}
        tokenRates = {}
      }
      let currencyMultiplier = 1
      if (selectedCurrency !== 'ETH') currencyMultiplier = currencyData[selectedCurrency.toLowerCase()] || 1
      let full = [{ balance: weiBalance, decimals: 18, erc20: false, logo: 'eth.svg', name: 'Ethereum', symbol: 'ETH', tokenAddress: '0x' }]
      // because vue/babel is stupid
      if (Object.keys(tokenData).length > 0) {
        full = [...full, ...tokenData]
      }
      let totalPortfolioValue = 0
      const finalBalancesArray = full.map(x => {
        const computedBalance = parseFloat(torus.web3.utils.hexToNumberString(x.balance)) / 10 ** parseFloat(x.decimals) || 0
        let tokenRateMultiplier = 1
        if (x.tokenAddress !== '0x') tokenRateMultiplier = tokenRates[x.tokenAddress.toLowerCase()] || 0
        const currencyRate = currencyMultiplier * tokenRateMultiplier
        let currencyBalance = significantDigits(computedBalance * currencyRate || 0, false, 3)
        totalPortfolioValue += currencyBalance
        if (selectedCurrency !== 'ETH') currencyBalance = formatCurrencyNumber(currencyBalance)
        return {
          ...x,
          id: x.symbol,
          computedBalance: computedBalance,
          formattedBalance: `${x.symbol} ${significantDigits(computedBalance || 0, false, 3)}`,
          currencyBalance: `${selectedCurrency} ${currencyBalance}`,
          currencyRateText: `1 ${x.symbol} = ${significantDigits(currencyRate || 0)} ${selectedCurrency}`
        }
      })
      totalPortfolioValue = significantDigits(totalPortfolioValue, false, 3) || 0
      if (selectedCurrency !== 'ETH') totalPortfolioValue = formatCurrencyNumber(totalPortfolioValue)
      return { finalBalancesArray, totalPortfolioValue }
    }
  },
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
    setWeiBalance(state, weiBalance) {
      state.weiBalance = weiBalance
    },
    setTokenData(state, tokenData) {
      state.tokenData = tokenData
    },
    setTokenRates(state, tokenRates) {
      state.tokenRates = tokenRates
    },
    setSelectedAddress(state, selectedAddress) {
      state.selectedAddress = selectedAddress
    },
    setNetworkId(state, networkId) {
      state.networkId = networkId
    },
    setNetworkType(state, networkType) {
      state.networkType = networkType
    },
    setTransactions(state, transactions) {
      state.transactions = transactions
    },
    setLoginInProgress(state, payload) {
      state.loginInProgress = payload
    },
    setCurrencyData(state, data) {
      state.currencyData = { ...state.currencyData, [data.currentCurrency]: data.conversionRate }
    },
    setCurrency(state, currency) {
      state.selectedCurrency = currency
    },
    setRPCDetails(state, rpcDetails) {
      state.rpcDetails = rpcDetails
    },
    resetStore(state, requiredState) {
      Object.keys(state).forEach(key => {
        state[key] = initialState[key] // or = initialState[key]
      })
    }
  },
  actions: {
    resetStore(context, payload) {
      context.commit('resetStore', initialState)
      window.sessionStorage.clear()
    },
    loginInProgress(context, payload) {
      context.commit('setLoginInProgress', payload)
    },
    setSelectedCurrency({ commit }, payload) {
      commit('setCurrency', payload)
      if (payload !== 'ETH') {
        torus.torusController.setCurrentCurrency(payload.toLowerCase(), function(err, data) {
          if (err) console.error('currency fetch failed')
          commit('setCurrencyData', data)
        })
      }
    },
    forceFetchTokens({ commit, state }, payload) {
      torus.torusController.detectTokensController.refreshTokenBalances()
      fetch(`https://api.tor.us/tokenbalances?address=${state.selectedAddress}`)
        .then(inter => inter.json())
        .then(response => {
          response.forEach(obj => {
            torus.torusController.detectTokensController.detectEtherscanTokenBalance(obj.contractAddress, {
              decimals: obj.tokenDecimal,
              erc20: true,
              logo: '',
              name: obj.name,
              balance: obj.balance,
              symbol: obj.ticker
            })
          })
        })
    },
    showPopup({ state, getters }, payload) {
      var bc = new BroadcastChannel(`torus_channel_${torus.instanceId}`)
      const isTx = isTorusTransaction()
      const width = isTx ? 650 : 600
      const height = isTx ? 470 : 350
      window.open(
        `${baseRoute}confirm?instanceId=${torus.instanceId}`,
        '_blank',
        `directories=0,titlebar=0,toolbar=0,status=0,location=0,menubar=0,height=${height},width=${width}`
      )
      if (isTx) {
        var balance = torus.web3.utils.fromWei(this.state.weiBalance.toString())
        let counter = 0
        let interval
        bc.onmessage = ev => {
          if (ev.data === 'popup-loaded') {
            // dispatch to store that popup has loaded
            // dispatch transactions when popup loaded
            // also dispatch transactions if popup loaded + transactions changes. Don't use interval
            interval = setInterval(() => {
              // console.log(getters)
              var txParams = getters.unApprovedTransactions[0]
              bc.postMessage({
                data: {
                  origin: window.location.ancestorOrigins ? window.location.ancestorOrigins[0] : document.referrer,
                  type: 'transaction',
                  txParams: { ...txParams, network: state.networkType },
                  balance
                }
              })
              if (txParams.txParams.gas || counter > 9) {
                bc.close()
                clearInterval(interval)
              }
              counter++
              // console.log(counter, txParams.txParams.gas)
            }, 500)
          }
        }
      } else {
        var msgParams = getLatestMessageParams()
        bc.onmessage = function(ev) {
          if (ev.data === 'popup-loaded') {
            bc.postMessage({
              data: {
                origin: window.location.ancestorOrigins ? window.location.ancestorOrigins[0] : document.referrer,
                type: 'message',
                msgParams
              }
            })
            bc.close()
          }
        }
      }
    },
    showWalletPopup(context, payload) {
      walletWindow =
        walletWindow ||
        window.open(`${baseRoute}wallet`, '_blank', 'directories=0,titlebar=0,toolbar=0,status=0,location=0,menubar=0,height=450,width=750')
      walletWindow.blur()
      setTimeout(walletWindow.focus(), 0)
      walletWindow.onbeforeunload = function() {
        walletWindow = undefined
      }
    },
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
    updateWeiBalance({ commit, state }, payload) {
      if (payload.address === state.selectedAddress) commit('setWeiBalance', payload.balance)
    },
    updateTransactions({ commit }, payload) {
      commit('setTransactions', payload.transactions)
    },
    updateTokenData({ commit }, payload) {
      commit('setTokenData', payload.tokenData)
    },
    updateTokenRates({ commit }, payload) {
      commit('setTokenRates', payload.tokenRates)
    },
    updateSelectedAddress(context, payload) {
      context.commit('setSelectedAddress', payload.selectedAddress)
      torus.updateStaticData({ selectedAddress: payload.selectedAddress })
    },
    updateNetworkId(context, payload) {
      context.commit('setNetworkId', payload.networkId)
      torus.updateStaticData({ networkId: payload.networkId })
    },
    setProviderType(context, payload) {
      if (payload.type && payload.type === RPC) {
        context.commit('setNetworkType', RPC)
        context.commit('setRPCDetails', payload.network)
        localStorage.setItem('torus_custom_rpc', JSON.stringify(payload.network))
        localStorage.setItem('torus_network_type', RPC)
        torus.torusController.setCustomRpc(payload.network.networkUrl, payload.network.chainId, 'ETH', payload.network.networkName)
      } else {
        context.commit('setNetworkType', payload.network)
        localStorage.setItem('torus_network_type', payload.network)
        torus.torusController.networkController.setProviderType(payload.network)
      }
    },
    triggerLogin: function(context, payload) {
      // log.error('Could not find window.auth2, might not be loaded yet')
      ;(function gapiLoadCall() {
        if (window.auth2) {
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
              .then(handleLogin(email, payload))
              .catch(function(err) {
                log.error(err)
              })
          })
        } else {
          setTimeout(gapiLoadCall, 1000)
        }
      })()
    }
  }
})

function handleLogin(email, payload) {
  VuexStore.dispatch('loginInProgress', true)
  torus.getPubKeyAsync(torus.web3, config.torusNodeEndpoints, email, function(err, res) {
    if (err) {
      log.error(err)
    } else {
      log.info('New private key assigned to user at address ', res)
      torus.retrieveShares(config.torusNodeEndpoints, config.torusIndexes, VuexStore.state.email, VuexStore.state.idToken, function(err, data) {
        if (err) {
          log.error(err)
        }
        VuexStore.dispatch('updateSelectedAddress', { selectedAddress: data.ethAddress })
        VuexStore.dispatch('addWallet', data)
        torus.torusController.accountTracker.store.subscribe(function({ accounts }) {
          if (accounts) {
            for (const key in accounts) {
              if (accounts.hasOwnProperty(key)) {
                const account = accounts[key]
                if (VuexStore.state.weiBalance !== account.balance)
                  VuexStore.dispatch('updateWeiBalance', { address: account.address, balance: account.balance })
              }
            }
          }
        })

        torus.torusController.txController.store.subscribe(function({ transactions }) {
          if (transactions) {
            VuexStore.dispatch('updateTransactions', { transactions })
          }
        })

        VuexStore.dispatch('setSelectedCurrency', 'USD')

        torus.torusController.detectTokensController.detectedTokensStore.subscribe(function({ tokens }) {
          if (tokens.length > 0) {
            VuexStore.dispatch('updateTokenData', { tokenData: tokens })
          }
        })

        torus.torusController.tokenRatesController.store.subscribe(function({ contractExchangeRates }) {
          if (contractExchangeRates) {
            VuexStore.dispatch('updateTokenRates', { tokenRates: contractExchangeRates })
          }
        })

        // continue enable function
        var ethAddress = data.ethAddress
        if (payload.calledFromEmbed) {
          setTimeout(function() {
            torus.continueEnable(ethAddress)
          }, 50)
        }
        torus.torusController.initTorusKeyring([data.privKey], [data.ethAddress])
        const statusStream = torus.communicationMux.getStream('status')
        statusStream.write({ loggedIn: true })
        VuexStore.dispatch('loginInProgress', false)
        // torus.web3.eth.net
        //   .getId()
        //   .then(res => {
        //     VuexStore.dispatch('updateNetworkId', { networkId: res })
        //     // publicConfigOutStream.write(JSON.stringify({networkVersion: res}))
        //   })
        //   .catch(e => log.error(e))
      })
    }
  })
}

// function getTransactionParams() {
//   const { torusController } = torus
//   const state = torusController.getState()
//   console.log(torusController.getState(), 'torus state')
//   const transactions = []
//   for (let id in state.transactions) {
//     if (state.transactions[id].status === 'unapproved') {
//       transactions.push(state.transactions[id])
//     }
//   }
//   const { txParams, simulationFails } = transactions[0] || {}
//   return { txParams, simulationFails }
// }

function getLatestMessageParams() {
  const { torusController } = torus
  const state = torusController.getState()
  let time = 0
  let msg = null
  for (let id in state.unapprovedMsgs) {
    const msgTime = state.unapprovedMsgs[id].time
    if (msgTime > time) {
      msg = state.unapprovedMsgs[id]
      time = msgTime
    }
  }

  for (let id in state.unapprovedPersonalMsgs) {
    const msgTime = state.unapprovedPersonalMsgs[id].time
    if (msgTime > time) {
      msg = state.unapprovedPersonalMsgs[id]
      time = msgTime
    }
  }

  // handle hex-based messages and convert to text
  if (msg) {
    msg.msgParams.message = hexToText(msg.msgParams.data)
  }

  // handle typed messages
  for (let id in state.unapprovedTypedMessages) {
    const msgTime = state.unapprovedTypedMessages[id].time
    if (msgTime > time) {
      time = msgTime
      msg = state.unapprovedTypedMessages[id]
      msg.msgParams.typedMessages = msg.msgParams.data // TODO: use for differentiating msgs later on
    }
  }
  return msg ? msg.msgParams : {}
}

function isTorusTransaction() {
  let { torusController } = torus
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
