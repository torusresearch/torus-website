import BroadcastChannel from 'broadcast-channel'
import log from 'loglevel'
import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import config from '../config'
import torus from '../torus'
import { MAINNET, RPC } from '../utils/enums'
import { formatCurrencyNumber, getRandomNumber, hexToText, significantDigits, getEtherScanHashLink } from '../utils/utils'
import { post, get, patch } from '../utils/httpHelpers.js'
import jwtDecode from 'jwt-decode'
import { notifyUser } from '../utils/notifications'

const web3Utils = torus.web3.utils

function getCurrencyMultiplier() {
  const { selectedCurrency, currencyData } = VuexStore.state || {}
  let currencyMultiplier = 1
  if (selectedCurrency !== 'ETH') currencyMultiplier = currencyData[selectedCurrency.toLowerCase()] || 1
  return currencyMultiplier
}
const accountImporter = require('../utils/accountImporter')

const baseRoute = process.env.BASE_URL

let totalFailCount = 0

// stream to send logged in status
const statusStream = torus.communicationMux.getStream('status')

Vue.use(Vuex)

const vuexPersist = new VuexPersistence({
  key: 'my-app',
  storage: window.sessionStorage,
  reducer: state => {
    return {
      userInfo: state.userInfo,
      idToken: state.idToken,
      wallet: state.wallet,
      // weiBalance: state.weiBalance,
      selectedAddress: state.selectedAddress,
      networkId: state.networkId,
      currencyData: state.currencyData,
      // tokenData: state.tokenData,
      tokenRates: state.tokenRates,
      selectedCurrency: state.selectedCurrency,
      jwtToken: state.jwtToken,
      pastTransactions: state.pastTransactions
    }
  }
})

var walletWindow

const initialState = {
  userInfo: {
    email: '',
    name: '',
    profileImage: ''
  },
  idToken: '',
  wallet: {}, // Account specific object
  weiBalance: {}, // Account specific object
  selectedAddress: '',
  selectedCurrency: 'USD',
  networkId: 0,
  networkType: localStorage.getItem('torus_network_type') || MAINNET,
  currencyData: {},
  tokenData: {}, // Account specific object
  tokenRates: {},
  transactions: [],
  unapprovedTypedMessages: {},
  unapprovedPersonalMsgs: {},
  unapprovedMsgs: {},
  loginInProgress: false,
  rpcDetails: JSON.parse(localStorage.getItem('torus_custom_rpc')) || {},
  jwtToken: '',
  pastTransactions: [],
  isNewUser: false
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
      let { weiBalance, tokenData, tokenRates, currencyData, selectedCurrency, networkType, selectedAddress } = state || {}
      if (networkType !== MAINNET) {
        tokenData = {}
        tokenRates = {}
      }
      let currencyMultiplier = 1
      if (selectedCurrency !== 'ETH') currencyMultiplier = currencyData[selectedCurrency.toLowerCase()] || 1
      let full = [
        {
          balance: weiBalance[selectedAddress],
          decimals: 18,
          erc20: false,
          logo: 'eth.svg',
          name: 'Ethereum',
          symbol: 'ETH',
          tokenAddress: '0x'
        }
      ]
      // because vue/babel is stupid
      if (tokenData && tokenData[selectedAddress] && Object.keys(tokenData[selectedAddress]).length > 0) {
        full = [...full, ...tokenData[selectedAddress]]
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
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
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
    setTypedMessages(state, unapprovedTypedMessages) {
      state.unapprovedTypedMessages = unapprovedTypedMessages
    },
    setPersonalMessages(state, unapprovedPersonalMsgs) {
      state.unapprovedPersonalMsgs = unapprovedPersonalMsgs
    },
    setMessages(state, unapprovedMsgs) {
      state.unapprovedMsgs = unapprovedMsgs
    },
    setJwtToken(state, payload) {
      state.jwtToken = payload
    },
    setNewUser(state, payload) {
      state.isNewUser = payload
    },
    setPastTransactions(state, payload) {
      state.pastTransactions = payload
    },
    patchPastTransactions(state, payload) {
      state.pastTransactions = [...state.pastTransactions, payload]
    },
    logOut(state, payload) {
      Object.keys(state).forEach(key => {
        state[key] = payload[key] // or = initialState[key]
      })
    }
  },
  actions: {
    logOut(context, payload) {
      context.commit('logOut', initialState)
      window.sessionStorage.clear()
      statusStream.write({ loggedIn: false })
    },
    loginInProgress(context, payload) {
      context.commit('setLoginInProgress', payload)
    },
    setSelectedCurrency({ commit, state }, payload) {
      commit('setCurrency', payload.selectedCurrency)
      if (payload.selectedCurrency !== 'ETH') {
        torus.torusController.setCurrentCurrency(payload.selectedCurrency.toLowerCase(), function(err, data) {
          if (err) console.error('currency fetch failed')
          commit('setCurrencyData', data)
        })
      }
      if (state.jwtToken !== '' && payload.origin && payload.origin !== 'store') {
        patch(
          `${config.api}/user`,
          {
            default_currency: payload.selectedCurrency
          },
          {
            headers: {
              Authorization: `Bearer ${state.jwtToken}`,
              'Content-Type': 'application/json; charset=utf-8'
            }
          }
        )
          .then(response => {
            log.info('successfully patched', response)
          })
          .catch(err => {
            log.error(err, 'unable to patch currency info')
          })
      }
    },
    async forceFetchTokens({ state }, payload) {
      torus.torusController.detectTokensController.refreshTokenBalances()
      try {
        const response = await get(`${config.api}/tokenbalances`, {
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            Authorization: `Bearer ${state.jwtToken}`
          }
        })
        const { data } = response
        data.forEach(obj => {
          torus.torusController.detectTokensController.detectEtherscanTokenBalance(obj.contractAddress, {
            decimals: obj.tokenDecimal,
            erc20: true,
            logo: '',
            name: obj.name,
            balance: obj.balance,
            symbol: obj.ticker
          })
        })
      } catch (error) {
        log.error('etherscan balance fetch failed')
      }
    },
    showPopup({ state, getters }, payload) {
      var bc = new BroadcastChannel(`torus_channel_${torus.instanceId}`)
      const isTx = isTorusTransaction()
      const width = 500
      const height = isTx ? 650 : 400
      // const width = 500
      // const height = 600
      window.open(
        `${baseRoute}confirm?instanceId=${torus.instanceId}`,
        '_blank',
        `directories=0,titlebar=0,toolbar=0,status=0,location=0,menubar=0,height=${height},width=${width}`
      )
      if (isTx) {
        var balance = torus.web3.utils.fromWei(this.state.weiBalance[this.state.selectedAddress].toString())
        bc.onmessage = ev => {
          if (ev.data === 'popup-loaded') {
            var txParams = getters.unApprovedTransactions[getters.unApprovedTransactions.length - 1]
            bc.postMessage({
              data: {
                origin: window.location.ancestorOrigins ? window.location.ancestorOrigins[0] : document.referrer,
                type: 'transaction',
                txParams: { ...txParams, network: state.networkType },
                balance
              }
            })
            bc.close()
          }
        }
      } else {
        var { msgParams, id } = getLatestMessageParams()
        bc.onmessage = function(ev) {
          if (ev.data === 'popup-loaded') {
            bc.postMessage({
              data: {
                origin: window.location.ancestorOrigins ? window.location.ancestorOrigins[0] : document.referrer,
                type: 'message',
                msgParams: { msgParams, id }
              }
            })
            bc.close()
          }
        }
      }
    },
    showProviderChangePopup(context, payload) {
      var bc = new BroadcastChannel('torus_provider_change_channel')
      window.open(`${baseRoute}providerchange`, '_blank', 'directories=0,titlebar=0,toolbar=0,status=0,location=0,menubar=0,height=450,width=600')
      bc.onmessage = function(ev) {
        if (ev.data === 'popup-loaded') {
          bc.postMessage({
            data: {
              origin: window.location.ancestorOrigins ? window.location.ancestorOrigins[0] : document.referrer,
              payload: payload
            }
          })
          bc.close()
        }
      }
    },
    showUserInfoRequestPopup(context, payload) {
      var bc = new BroadcastChannel(`user_info_request_channel_${torus.instanceId}`)
      window.open(
        `${baseRoute}userinforequest?instanceId=${torus.instanceId}`,
        '_blank',
        'directories=0,titlebar=0,toolbar=0,status=0,location=0,menubar=0,height=450,width=600'
      )
      bc.onmessage = function(ev) {
        if (ev.data === 'popup-loaded') {
          console.log('loaded popup')
          bc.postMessage({
            data: {
              origin: window.location.ancestorOrigins ? window.location.ancestorOrigins[0] : document.referrer,
              payload: payload
            }
          })
          bc.close()
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
    updateUserInfo(context, payload) {
      context.commit('setUserInfo', payload.userInfo)
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
        if (context.state.weiBalance[payload.ethAddress]) {
          var stateBalance = { ...context.state.weiBalance }
          delete stateBalance[payload.ethAddress]
          context.commit('setBalance', { ...stateBalance })
        }
      }
    },
    updateWeiBalance({ commit, state }, payload) {
      if (payload.address) {
        commit('setWeiBalance', { ...state.weiBalance, [payload.address]: payload.balance })
      }
    },
    importAccount({ dispatch }, payload) {
      return new Promise((resolve, reject) => {
        accountImporter
          .importAccount(payload.strategy, payload.keyData)
          .then(privKey => {
            dispatch('finishImportAccount', { privKey })
              .then(() => resolve())
              .catch(err => reject(err))
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    finishImportAccount({ dispatch }, payload) {
      return new Promise((resolve, reject) => {
        const { privKey } = payload
        const address = torus.generateAddressFromPrivKey(privKey)
        torus.torusController.setSelectedAccount(address)
        dispatch('addWallet', { ethAddress: address, privKey: privKey })
        dispatch('updateSelectedAddress', { selectedAddress: address })
        torus.torusController
          .addAccount(privKey, address)
          .then(response => resolve())
          .catch(err => reject(err))
      })
    },
    updateTransactions({ commit }, payload) {
      commit('setTransactions', payload.transactions)
    },
    updateTypedMessages({ commit }, payload) {
      commit('setTypedMessages', payload.unapprovedTypedMessages)
    },
    updatePersonalMessages({ commit }, payload) {
      commit('setPersonalMessages', payload.unapprovedPersonalMsgs)
    },
    updateMessages({ commit }, payload) {
      commit('setMessages', payload.unapprovedMsgs)
    },
    updateTokenData({ commit, state }, payload) {
      if (payload.tokenData) commit('setTokenData', { ...state.tokenData, [payload.address]: payload.tokenData })
    },
    updateTokenRates({ commit }, payload) {
      commit('setTokenRates', payload.tokenRates)
    },
    updateSelectedAddress(context, payload) {
      context.commit('setSelectedAddress', payload.selectedAddress)
      torus.updateStaticData({ selectedAddress: payload.selectedAddress })
      torus.torusController.setSelectedAccount(payload.selectedAddress)
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
    triggerLogin: function({ dispatch }, { calledFromEmbed }) {
      // log.error('Could not find window.auth2, might not be loaded yet')
      ;(function gapiLoadCall() {
        if (window.auth2) {
          window.auth2.signIn().then(function(googleUser) {
            log.info('GOOGLE USER: ', googleUser)
            let profile = googleUser.getBasicProfile()
            let domain = googleUser.getHostedDomain()
            log.info('Domain: ', domain)
            // console.log(googleUser)
            log.info('ID: ' + profile.getId()) // Do not send to your backend! Use an ID token instead.
            log.info('Name: ' + profile.getName())
            log.info('Image URL: ' + profile.getImageUrl())
            log.info('Email: ' + profile.getEmail()) // This is null if the 'email' scope is not present.
            dispatch('updateIdToken', { idToken: googleUser.getAuthResponse().id_token })
            let email = profile.getEmail()
            let name = profile.getName()
            let profileImage = profile.getImageUrl()
            dispatch('updateUserInfo', { userInfo: { profileImage, name, email } })
            const { torusNodeEndpoints } = config
            window.gapi.auth2
              .getAuthInstance()
              .disconnect()
              .then(() => {
                const endPointNumber = getRandomNumber(torusNodeEndpoints.length)
                dispatch('handleLogin', { calledFromEmbed, endPointNumber })
              })
              .catch(function(err) {
                log.error(err)
              })
          })
        } else {
          setTimeout(gapiLoadCall, 1000)
        }
      })()
    },
    subscribeToControllers({ dispatch, state }, payload) {
      torus.torusController.accountTracker.store.subscribe(function({ accounts }) {
        if (accounts) {
          for (const key in accounts) {
            if (Object.prototype.hasOwnProperty.call(accounts, key)) {
              const account = accounts[key]
              dispatch('updateWeiBalance', { address: account.address, balance: account.balance })
            }
          }
        }
      })
      torus.torusController.txController.store.subscribe(function({ transactions }) {
        if (transactions) {
          // these transactions have negative index
          const updatedTransactions = []
          for (let id in transactions) {
            if (transactions[id]) {
              updatedTransactions.push(transactions[id])
            }
          }
          // console.log(updatedTransactions, 'txs')
          dispatch('updateTransactions', { transactions: updatedTransactions })
        }
      })

      torus.torusController.typedMessageManager.store.subscribe(function({ unapprovedTypedMessages }) {
        dispatch('updateTypedMessages', { unapprovedTypedMessages: unapprovedTypedMessages })
      })

      torus.torusController.personalMessageManager.store.subscribe(function({ unapprovedPersonalMsgs }) {
        dispatch('updatePersonalMessages', { unapprovedPersonalMsgs: unapprovedPersonalMsgs })
      })

      torus.torusController.messageManager.store.subscribe(function({ unapprovedMsgs }) {
        dispatch('updateMessages', { unapprovedMsgs: unapprovedMsgs })
      })

      dispatch('setSelectedCurrency', { selectedCurrency: state.selectedCurrency, origin: 'store' })
      torus.torusController.detectTokensController.detectedTokensStore.subscribe(function({ tokens }) {
        if (tokens.length > 0) {
          dispatch('updateTokenData', {
            tokenData: tokens,
            address: torus.torusController.detectTokensController.selectedAddress
          })
        }
      })
      torus.torusController.tokenRatesController.store.subscribe(function({ contractExchangeRates }) {
        if (contractExchangeRates) {
          dispatch('updateTokenRates', { tokenRates: contractExchangeRates })
        }
      })
    },
    initTorusKeyring({ state, dispatch }, payload) {
      return torus.torusController.initTorusKeyring([payload.privKey], [payload.ethAddress])
    },
    handleLogin({ state, dispatch }, { endPointNumber, calledFromEmbed }) {
      const { torusNodeEndpoints, torusIndexes } = config
      const { idToken, userInfo } = state
      const { email } = userInfo
      dispatch('loginInProgress', true)
      torus
        .getPubKeyAsync(torusNodeEndpoints[endPointNumber], email)
        .then(res => {
          log.info('New private key assigned to user at address ', res)
          const p1 = torus.retrieveShares(torusNodeEndpoints, torusIndexes, email, idToken)
          const p2 = torus.getMessageForSigning(res)
          return Promise.all([p1, p2])
        })
        .then(async response => {
          const data = response[0]
          const message = response[1]
          dispatch('addWallet', data)
          dispatch('updateSelectedAddress', { selectedAddress: data.ethAddress })
          dispatch('subscribeToControllers')
          await dispatch('initTorusKeyring', data)
          await dispatch('processAuthMessage', { message: message, selectedAddress: data.ethAddress })
          // continue enable function
          var ethAddress = data.ethAddress
          if (calledFromEmbed) {
            setTimeout(function() {
              torus.continueEnable(ethAddress)
            }, 50)
          }
          statusStream.write({ loggedIn: true })
          dispatch('loginInProgress', false)
        })
        .catch(err => {
          totalFailCount += 1
          let newEndPointNumber = endPointNumber
          while (newEndPointNumber === endPointNumber) {
            newEndPointNumber = getRandomNumber(torusNodeEndpoints.length)
          }
          if (totalFailCount < 3) dispatch('handleLogin', { calledFromEmbed, endPointNumber: newEndPointNumber })
          log.error(err)
        })
    },
    processAuthMessage({ commit, dispatch }, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          // make this a promise and resolve it to dispatch loginInProgress as false
          const { message, selectedAddress } = payload
          const hashedMessage = torus.hashMessage(message)
          const signedMessage = await torus.torusController.keyringController.signMessage(selectedAddress, hashedMessage)
          const response = await post(`${config.api}/auth/verify`, {
            public_address: selectedAddress,
            signed_message: signedMessage
          })
          commit('setJwtToken', response.token)
          await dispatch('setUserInfo', response)
          resolve()
        } catch (error) {
          log.error('Failed Communication with backend', error)
          reject(error)
        }
      })
    },
    setUserInfo({ commit, dispatch, state }, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          get(`${config.api}/user`, {
            headers: {
              Authorization: `Bearer ${payload.token}`
            }
          })
            .then(user => {
              if (user.data) {
                const { transactions, default_currency } = user.data || {}
                commit('setPastTransactions', transactions)
                dispatch('setSelectedCurrency', { selectedCurrency: default_currency, origin: 'store' })
                resolve()
              }
            })
            .catch(async error => {
              await post(
                `${config.api}/user`,
                {
                  default_currency: state.selectedCurrency
                },
                {
                  headers: {
                    Authorization: `Bearer ${payload.token}`,
                    'Content-Type': 'application/json; charset=utf-8'
                  }
                }
              )
              commit('setNewUser', true)
              resolve()
            })
        } catch (error) {
          reject(error)
        }
      })
    },
    async rehydrate({ state, dispatch }, payload) {
      let { selectedAddress, wallet, networkType, rpcDetails, jwtToken } = state
      try {
        // if jwtToken expires, logout
        if (jwtToken) {
          const decoded = jwtDecode(jwtToken)
          if (Date.now() / 1000 > decoded.exp) {
            dispatch('logOut')
            return
          }
        }
        if (networkType && networkType !== RPC) {
          dispatch('setProviderType', { network: networkType })
        } else if (networkType && networkType === RPC && rpcDetails) {
          dispatch('setProviderType', { network: rpcDetails, type: RPC })
        }
        if (selectedAddress && wallet[selectedAddress]) {
          dispatch('updateSelectedAddress', { selectedAddress })
          setTimeout(() => dispatch('subscribeToControllers'), 50)
          await torus.torusController.initTorusKeyring(Object.values(wallet), Object.keys(wallet))
          await dispatch('setUserInfo', { token: jwtToken })
          statusStream.write({ loggedIn: true })
          log.info('rehydrated wallet')
          torus.web3.eth.net
            .getId()
            .then(res => {
              setTimeout(function() {
                dispatch('updateNetworkId', { networkId: res })
              })
              // publicConfigOutStream.write(JSON.stringify({networkVersion: res}))
            })
            .catch(e => log.error(e))
        }
      } catch (error) {
        log.error('Failed to rehydrate')
      }
    }
  }
})

function getLatestMessageParams() {
  let time = 0
  let msg = null
  let finalId = 0
  for (let id in VuexStore.state.unapprovedMsgs) {
    const msgTime = VuexStore.state.unapprovedMsgs[id].time
    if (msgTime > time) {
      msg = VuexStore.state.unapprovedMsgs[id]
      time = msgTime
      finalId = id
    }
  }

  for (let id in VuexStore.state.unapprovedPersonalMsgs) {
    const msgTime = VuexStore.state.unapprovedPersonalMsgs[id].time
    if (msgTime > time) {
      msg = VuexStore.state.unapprovedPersonalMsgs[id]
      time = msgTime
      finalId = id
    }
  }

  // handle hex-based messages and convert to text
  if (msg) {
    msg.msgParams.message = hexToText(msg.msgParams.data)
  }

  // handle typed messages
  for (let id in VuexStore.state.unapprovedTypedMessages) {
    const msgTime = VuexStore.state.unapprovedTypedMessages[id].time
    if (msgTime > time) {
      time = msgTime
      msg = VuexStore.state.unapprovedTypedMessages[id]
      msg.msgParams.typedMessages = msg.msgParams.data // TODO: use for differentiating msgs later on
      finalId = id
    }
  }
  return msg ? { msgParams: msg.msgParams, id: finalId } : {}
}

function isTorusTransaction() {
  if (Object.keys(VuexStore.state.unapprovedPersonalMsgs).length > 0) {
    return false
  } else if (Object.keys(VuexStore.state.unapprovedMsgs).length > 0) {
    return false
  } else if (Object.keys(VuexStore.state.unapprovedTypedMessages).length > 0) {
    return false
  } else if (VuexStore.getters.unApprovedTransactions.length > 0) {
    return true
  } else {
    throw new Error('No new transactions.')
  }
}

VuexStore.subscribe((mutation, state) => {
  // will rewrite later
  if (mutation.type === 'setTransactions' && state.jwtToken) {
    const txs = mutation.payload
    for (let id in txs) {
      const txMeta = txs[id]
      if (txMeta.status === 'submitted' && id >= 0) {
        // insert into db here

        const txHash = txMeta.hash

        const totalAmount = web3Utils.fromWei(
          web3Utils.toBN(txMeta.txParams.value).add(web3Utils.toBN(txMeta.txParams.gas).mul(web3Utils.toBN(txMeta.txParams.gasPrice)))
        )
        const txObj = {
          created_at: new Date(txMeta.time),
          from: web3Utils.toChecksumAddress(txMeta.txParams.from),
          to: web3Utils.toChecksumAddress(txMeta.txParams.to),
          total_amount: totalAmount,
          currency_amount: (getCurrencyMultiplier() * totalAmount).toString(),
          selected_currency: state.selectedCurrency,
          status: 'submitted',
          network: state.networkType,
          transaction_hash: txMeta.hash
        }
        if (state.pastTransactions.findIndex(x => x.transaction_hash === txObj.transaction_hash && x.network === txObj.network) === -1) {
          // User notification
          notifyUser(getEtherScanHashLink(txHash, state.networkType))

          VuexStore.commit('patchPastTransactions', txObj)
          post(`${config.api}/transaction`, txObj, {
            headers: {
              Authorization: `Bearer ${state.jwtToken}`,
              'Content-Type': 'application/json; charset=utf-8'
            }
          })
            .then(response => {
              log.info('successfully added', response)
            })
            .catch(err => log.error(err, 'unable to insert transaction'))
        }
      }
    }
  }
})

export default VuexStore
