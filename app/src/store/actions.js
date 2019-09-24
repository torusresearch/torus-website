import BroadcastChannel from 'broadcast-channel'
import log from 'loglevel'
import config from '../config'
import torus from '../torus'
import {
  RPC,
  USER_INFO_REQUEST_APPROVED,
  USER_INFO_REQUEST_REJECTED,
  SUPPORTED_NETWORK_TYPES,
  FACEBOOK,
  GOOGLE,
  TELEGRAM,
  THEME_LIGHT_BLUE_NAME
} from '../utils/enums'
import { getRandomNumber, broadcastChannelOptions } from '../utils/utils'
import { post, get, patch } from '../utils/httpHelpers.js'
import jwtDecode from 'jwt-decode'
import initialState from './state'

import vuetify from '../plugins/vuetify'
import themes from '../plugins/themes'

const accountImporter = require('../utils/accountImporter')

const baseRoute = process.env.BASE_URL

let totalFailCount = 0

// stream to send logged in status
const statusStream = torus.communicationMux.getStream('status')
const oauthStream = torus.communicationMux.getStream('oauth')

var walletWindow

export default {
  logOut({ commit, dispatch }, payload) {
    commit('logOut', initialState)
    dispatch('setTheme', THEME_LIGHT_BLUE_NAME)
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
        if (err) log.error('currency fetch failed')
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
  showProviderChangePopup(context, payload) {
    var bc = new BroadcastChannel(`torus_provider_change_channel_${torus.instanceId}`, broadcastChannelOptions)
    window.open(
      `${baseRoute}providerchange?instanceId=${torus.instanceId}`,
      '_blank',
      'directories=0,titlebar=0,toolbar=0,status=0,location=0,menubar=0,height=450,width=600'
    )
    bc.onmessage = async ev => {
      if (ev.data === 'popup-loaded') {
        await bc.postMessage({
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
    var bc = new BroadcastChannel(`user_info_request_channel_${torus.instanceId}`, broadcastChannelOptions)
    window.open(
      `${baseRoute}userinforequest?instanceId=${torus.instanceId}`,
      '_blank',
      'directories=0,titlebar=0,toolbar=0,status=0,location=0,menubar=0,height=450,width=600'
    )
    bc.onmessage = async ev => {
      if (ev.data === 'popup-loaded') {
        await bc.postMessage({
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
      window.open(
        `${baseRoute}wallet${payload.path || ''}?instanceId=${torus.instanceId}`,
        '_blank',
        'directories=0,titlebar=0,toolbar=0,status=0,location=0,menubar=0,height=450,width=750'
      )
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
            .then(() => {
              const accountImportChannel = new BroadcastChannel(`account_import_channel_${torus.instanceId}`, broadcastChannelOptions)
              accountImportChannel
                .postMessage({
                  data: {
                    name: 'imported_account',
                    payload: { privKey }
                  }
                })
                .then(() => resolve())
                .catch(err => reject(err))
            })
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
  updateUserInfoAccess({ commit }, payload) {
    if (payload.approved) commit('setUserInfoAccess', USER_INFO_REQUEST_APPROVED)
    else commit('setUserInfoAccess', USER_INFO_REQUEST_REJECTED)
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
    let networkType = payload.network
    if (SUPPORTED_NETWORK_TYPES[networkType.host]) {
      networkType = SUPPORTED_NETWORK_TYPES[networkType.host]
    }
    context.commit('setNetworkType', networkType)
    if (payload.type && payload.type === RPC) {
      return torus.torusController.setCustomRpc(networkType.host, networkType.chainId, 'ETH', networkType.networkName)
    } else {
      return torus.torusController.networkController.setProviderType(networkType.host)
    }
  },
  triggerLogin({ dispatch }, { calledFromEmbed, verifier, userParams }) {
    const { torusNodeEndpoints } = config
    const endPointNumber = getRandomNumber(torusNodeEndpoints.length)

    log.info('Verifier: ', verifier)

    if (verifier === GOOGLE) {
      ;(function googleLogin() {
        if (window.auth2) {
          window.auth2
            .signIn()
            .then(function(googleUser) {
              log.info('GOOGLE USER: ', googleUser)

              let profile = googleUser.getBasicProfile()

              let email = profile.getEmail()
              let name = profile.getName()
              let profileImage = profile.getImageUrl()
              let idtoken = googleUser.getAuthResponse().id_token

              log.info('ID: ', profile.getId()) // Do not send to your backend! Use an ID token instead.
              log.info('ID Token:', idtoken)
              log.info('Email:', email)
              log.info('Name:', name)
              log.info('Image URL:', profileImage)
              // Set only idToken and userInfo into the state
              dispatch('updateIdToken', { idToken: idtoken })
              dispatch('updateUserInfo', {
                userInfo: { profileImage, name, verifierId: email, verifier: GOOGLE, verifierParams: { verifier_id: email } }
              })

              window.gapi.auth2
                .getAuthInstance()
                .disconnect()
                .then(() => {
                  dispatch('handleLogin', { calledFromEmbed, endPointNumber })
                })
                .catch(err => {
                  log.error(err)
                  oauthStream.write({ err: 'something went wrong' })
                })
            })
            .catch(err => {
              // called when something goes wrong like user closes popup
              log.error(err)
              oauthStream.write({ err: 'popup closed' })
            })
        } else {
          setTimeout(googleLogin, 1000)
        }
      })()
    } else if (verifier === FACEBOOK) {
      ;(function facebookLogin() {
        if (window.FB) {
          window.FB.login(response => {
            if (response.authResponse && response.status === 'connected') {
              let { accessToken } = response.authResponse || {}
              log.info('AccessToken:', accessToken)
              dispatch('updateIdToken', { idToken: accessToken })

              window.FB.api('/me?fields=name,email,picture.type(large)', response => {
                log.info('Email: ', response)
                log.info('Name: ', response.name)
                log.info('Id: ', response.id)
                const { name, id, picture } = response || {}
                dispatch('updateUserInfo', {
                  userInfo: {
                    profileImage: picture.data.url,
                    name,
                    verifierId: id,
                    verifier: FACEBOOK,
                    verifierParams: { verifier_id: id }
                  }
                })

                dispatch('handleLogin', { calledFromEmbed, endPointNumber })
              })
            } else {
              log.error('User cancelled login or did not fully authorize.')
              oauthStream.write({ err: 'User cancelled login or did not fully authorize.' })
            }
          })
        } else {
          setTimeout(facebookLogin, 1000)
        }
      })()
    } else if (verifier === TELEGRAM) {
      const { first_name, last_name, id, hash, username, photo_url, auth_date } = userParams || {}
      let name = first_name + ' ' + last_name

      log.info('Id: ', id)
      log.info('Hash: ', hash)
      log.info('Name: ', name)
      log.info('Username: ', username)
      log.info('Image URL: ', photo_url)
      log.info('Auth Date: ', auth_date)

      dispatch('updateIdToken', { idToken: id }) // works

      dispatch('updateUserInfo', {
        userInfo: {
          profileImage: photo_url,
          name,
          verifierId: username,
          verifier: TELEGRAM,
          verifierParams: {
            first_name,
            last_name,
            verifier_id: username,
            photo_url,
            auth_date,
            hash
          }
        }
      })

      dispatch('handleLogin', { calledFromEmbed, endPointNumber })
    }
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
        // log.info(updatedTransactions, 'txs')
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
    const {
      idToken,
      userInfo: { verifierId, verifier, verifierParams }
    } = state
    dispatch('loginInProgress', true)
    torus
      .getPubKeyAsync(torusNodeEndpoints[endPointNumber], { verifier, verifierId })
      .then(res => {
        log.info('New private key assigned to user at address ', res)
        const p1 = torus.retrieveShares(torusNodeEndpoints, torusIndexes, verifier, verifierParams, idToken)
        const p2 = torus.getMessageForSigning(res)
        return Promise.all([p1, p2])
      })
      .then(async response => {
        const data = response[0]
        const message = response[1]
        dispatch('addWallet', data) // synchronus
        dispatch('updateSelectedAddress', { selectedAddress: data.ethAddress }) //synchronus
        dispatch('subscribeToControllers')
        await Promise.all([
          dispatch('initTorusKeyring', data),
          dispatch('processAuthMessage', { message: message, selectedAddress: data.ethAddress, calledFromEmbed: calledFromEmbed })
        ])

        // continue enable function
        var ethAddress = data.ethAddress
        if (calledFromEmbed) {
          setTimeout(function() {
            torus.continueEnable(ethAddress)
          }, 50)
        }
        statusStream.write({ loggedIn: true, rehydrate: false })
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
        const { message, selectedAddress, calledFromEmbed } = payload
        const hashedMessage = torus.hashMessage(message)
        const signedMessage = await torus.torusController.keyringController.signMessage(selectedAddress, hashedMessage)
        const response = await post(`${config.api}/auth/verify`, {
          public_address: selectedAddress,
          signed_message: signedMessage
        })
        commit('setJwtToken', response.token)
        await dispatch('setUserInfoAction', { token: response.token, calledFromEmbed: calledFromEmbed })

        resolve()
      } catch (error) {
        log.error('Failed Communication with backend', error)
        reject(error)
      }
    })
  },
  storeUserLogin({ state }, payload) {
    let userOrigin = ''
    if (payload) {
      userOrigin = window.location.ancestorOrigins ? window.location.ancestorOrigins[0] : document.referrer
    } else userOrigin = window.location.origin
    post(
      `${config.api}/user/recordLogin`,
      {
        hostname: userOrigin
      },
      {
        headers: {
          Authorization: `Bearer ${state.jwtToken}`,
          'Content-Type': 'application/json; charset=utf-8'
        }
      }
    )
  },
  setTheme({ commit }, payload) {
    commit('setTheme', payload)

    // Update vuetify theme
    const theme = themes[payload || THEME_LIGHT_BLUE_NAME]
    vuetify.framework.theme.dark = theme.isDark
    vuetify.framework.theme.themes[theme.isDark ? 'dark' : 'light'] = theme.theme
  },
  setUserTheme({ state }, payload) {
    return new Promise((resolve, reject) => {
      patch(
        `${config.api}/user/theme`,
        {
          theme: state.theme
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
          resolve(response)
        })
        .catch(err => {
          log.error(err, 'unable to patch theme')
          reject('Unable to update theme')
        })
    })
  },
  setUserInfoAction({ commit, dispatch, state }, payload) {
    return new Promise(async (resolve, reject) => {
      const { token, calledFromEmbed } = payload
      try {
        get(`${config.api}/user`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
          .then(user => {
            if (user.data) {
              const { transactions, default_currency, theme } = user.data || {}
              commit('setPastTransactions', transactions)
              dispatch('setTheme', theme)
              dispatch('setSelectedCurrency', { selectedCurrency: default_currency, origin: 'store' })
              dispatch('storeUserLogin', calledFromEmbed)
              resolve()
            }
          })
          .catch(async error => {
            await post(
              `${config.api}/user`,
              {
                default_currency: state.selectedCurrency,
                theme: state.theme
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json; charset=utf-8'
                }
              }
            )
            commit('setNewUser', true)
            dispatch('storeUserLogin', calledFromEmbed)
            resolve()
          })
      } catch (error) {
        reject(error)
      }
    })
  },
  async rehydrate({ state, dispatch }, payload) {
    let { selectedAddress, wallet, networkType, jwtToken } = state
    try {
      // if jwtToken expires, logout
      if (jwtToken) {
        const decoded = jwtDecode(jwtToken)
        if (Date.now() / 1000 > decoded.exp) {
          dispatch('logOut')
          return
        }
      }
      if (SUPPORTED_NETWORK_TYPES[networkType.host]) await dispatch('setProviderType', { network: networkType })
      else await dispatch('setProviderType', { network: networkType, type: RPC })
      if (selectedAddress && wallet[selectedAddress]) {
        dispatch('updateSelectedAddress', { selectedAddress })
        setTimeout(() => dispatch('subscribeToControllers'), 50)
        await Promise.all([
          torus.torusController.initTorusKeyring(Object.values(wallet), Object.keys(wallet)),
          dispatch('setUserInfoAction', { token: jwtToken, calledFromEmbed: false })
        ])
        statusStream.write({ loggedIn: true, rehydrate: true })
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
      log.error('Failed to rehydrate', error)
    }
  }
}
