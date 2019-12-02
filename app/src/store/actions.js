import { BroadcastChannel } from 'broadcast-channel'
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
  TWITCH,
  REDDIT,
  DISCORD,
  THEME_LIGHT_BLUE_NAME
} from '../utils/enums'
import { getRandomNumber, broadcastChannelOptions, storageAvailable } from '../utils/utils'
import { post, get, patch, remove } from '../utils/httpHelpers.js'
import jwtDecode from 'jwt-decode'
import initialState from './state'
import {
  accountTrackerHandler,
  assetControllerHandler,
  typedMessageManagerHandler,
  personalMessageManagerHandler,
  transactionControllerHandler,
  messageManagerHandler,
  detectTokensControllerHandler,
  tokenRatesControllerHandler
} from './controllerSubscriptions'
import vuetify from '../plugins/vuetify'
import themes from '../plugins/themes'
import PopupHandler from '../utils/PopupHandler'

const accountImporter = require('../utils/accountImporter')

const baseRoute = config.baseRoute

let totalFailCount = 0

// stream to send logged in status
const statusStream = torus.communicationMux.getStream('status')
const oauthStream = torus.communicationMux.getStream('oauth')
const userInfoStream = torus.communicationMux.getStream('user_info')
const providerChangeStream = torus.communicationMux.getStream('provider_change')

export default {
  logOut({ commit, dispatch }, payload) {
    commit('logOut', initialState)
    dispatch('setTheme', THEME_LIGHT_BLUE_NAME)
    if (storageAvailable('sessionStorage')) window.sessionStorage.clear()
    statusStream.write({ loggedIn: false })
    torus.torusController.accountTracker.store.unsubscribe(accountTrackerHandler)
    torus.torusController.txController.store.unsubscribe(transactionControllerHandler)
    torus.torusController.assetController.store.unsubscribe(assetControllerHandler)
    torus.torusController.typedMessageManager.store.unsubscribe(typedMessageManagerHandler)
    torus.torusController.personalMessageManager.store.unsubscribe(personalMessageManagerHandler)
    torus.torusController.messageManager.store.unsubscribe(messageManagerHandler)
    torus.torusController.detectTokensController.detectedTokensStore.unsubscribe(detectTokensControllerHandler)
    torus.torusController.tokenRatesController.store.unsubscribe(tokenRatesControllerHandler)
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
    torus.torusController.assetDetectionController.restartAssetDetection()
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
          logo: 'eth.svg',
          name: obj.name,
          balance: obj.balance,
          symbol: obj.ticker
        })
      })
    } catch (error) {
      log.error('etherscan balance fetch failed')
    }
  },
  showProviderChangePopup({ dispatch }, payload) {
    const { override, preopenInstanceId } = payload
    const handleSuccess = () => {
      setTimeout(() => {
        providerChangeStream.write({
          name: 'provider_change_status',
          data: {
            success: true
          }
        })
      }, 100)
    }

    const handleDeny = err => {
      providerChangeStream.write({
        name: 'provider_change_status',
        data: {
          success: false,
          err: err
        }
      })
    }
    if (override) {
      return dispatch('setProviderType', payload)
        .then(handleSuccess)
        .catch(handleDeny)
    }
    const bc = new BroadcastChannel(`torus_provider_change_channel_${torus.instanceId}`, broadcastChannelOptions)
    const finalUrl = `${baseRoute}providerchange?integrity=true&instanceId=${torus.instanceId}`
    const providerChangeWindow = new PopupHandler({ url: finalUrl, preopenInstanceId })
    bc.onmessage = async ev => {
      if (ev.data === 'popup-loaded') {
        await bc.postMessage({
          data: {
            origin: window.location.ancestorOrigins ? window.location.ancestorOrigins[0] : document.referrer,
            payload: payload
          }
        })
      } else if (ev.data && ev.data.type === 'confirm-provider-change' && ev.data.approve) {
        log.info('Provider change approved', ev.data.payload)
        dispatch('setProviderType', ev.data.payload)
          .then(() => {
            handleSuccess()
            bc.close()
            providerChangeWindow.close()
          })
          .catch(err => {
            handleDeny(err)
            bc.close()
            providerChangeWindow.close()
          })
      } else if (ev.data && ev.data.type === 'deny-provider-change') {
        log.info('Provider change denied')
        handleDeny(new Error('user denied provider change request'))
        bc.close()
        providerChangeWindow.close()
      }
    }

    providerChangeWindow.open()
    providerChangeWindow.on('close', () => {
      bc.close()
      handleDeny(new Error('user denied provider change request'))
    })
  },
  showUserInfoRequestPopup({ dispatch, state }, payload) {
    const { preopenInstanceId } = payload
    log.info(preopenInstanceId, 'userinfo')
    var bc = new BroadcastChannel(`user_info_request_channel_${torus.instanceId}`, broadcastChannelOptions)
    const finalUrl = `${baseRoute}userinforequest?integrity=true&instanceId=${torus.instanceId}`
    const userInfoRequestWindow = new PopupHandler({ url: finalUrl, preopenInstanceId })

    const handleDeny = () => {
      log.info('User Info Request denied')
      dispatch('updateUserInfoAccess', { approved: false })
      userInfoStream.write({ name: 'user_info_response', data: { payload: {}, approved: false } })
      bc.close()
      userInfoRequestWindow.close()
    }
    const handleSuccess = () => {
      log.info('User Info Request approved')
      dispatch('updateUserInfoAccess', { approved: true })
      const returnObj = JSON.parse(JSON.stringify(state.userInfo))
      delete returnObj.verifierParams
      userInfoStream.write({ name: 'user_info_response', data: { payload: returnObj, approved: true } })
      bc.close()
      userInfoRequestWindow.close()
    }

    bc.onmessage = async ev => {
      if (ev.data === 'popup-loaded') {
        await bc.postMessage({
          data: {
            origin: window.location.ancestorOrigins ? window.location.ancestorOrigins[0] : document.referrer,
            payload: payload
          }
        })
      } else if (ev.data && ev.data.type === 'confirm-user-info-request' && ev.data.approve) {
        handleSuccess()
      } else if (ev.data && ev.data.type === 'deny-user-info-request') {
        handleDeny()
      }
    }

    userInfoRequestWindow.open()
    userInfoRequestWindow.on('close', () => {
      handleDeny()
    })
  },
  showWalletPopup(context, payload) {
    const finalUrl = `${baseRoute}wallet${payload.path || ''}?integrity=true&instanceId=${torus.instanceId}`
    const walletWindow = new PopupHandler({ url: finalUrl })
    walletWindow.open()
    walletWindow.window.blur()
    setTimeout(walletWindow.window.focus(), 0)
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
            .then(() => resolve(privKey))
            .catch(err => reject(err))
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  finishImportAccount({ dispatch, state }, payload) {
    return new Promise((resolve, reject) => {
      const { privKey } = payload
      const address = torus.generateAddressFromPrivKey(privKey)
      torus.torusController.setSelectedAccount(address, { jwtToken: state.jwtToken })
      dispatch('addWallet', { ethAddress: address, privKey: privKey })
      dispatch('updateSelectedAddress', { selectedAddress: address })
      torus.torusController
        .addAccount(privKey, address)
        .then(response => resolve(privKey))
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
  updateAssets({ commit }, payload) {
    const collectibles = payload.collectibleContracts.map(contract => {
      contract.assets = payload.collectibles.filter(asset => {
        return asset.address === contract.address
      })
      return contract
    })
    commit('setAssets', { [payload.selectedAddress]: collectibles })
  },
  updateTokenData({ commit, state }, payload) {
    if (payload.tokenData) commit('setTokenData', { [payload.address]: payload.tokenData })
  },
  updateTokenRates({ commit }, payload) {
    commit('setTokenRates', payload.tokenRates)
  },
  updateSelectedAddress({ commit, state }, payload) {
    commit('setSelectedAddress', payload.selectedAddress)
    torus.updateStaticData({ selectedAddress: payload.selectedAddress })
    torus.torusController.setSelectedAccount(payload.selectedAddress, { jwtToken: state.jwtToken })
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
  triggerLogin({ dispatch }, { calledFromEmbed, verifier, preopenInstanceId }) {
    const { torusNodeEndpoints } = config
    const endPointNumber = getRandomNumber(torusNodeEndpoints.length)

    log.info('Verifier: ', verifier)

    if (verifier === GOOGLE) {
      const state = encodeURIComponent(
        window.btoa(
          JSON.stringify({
            instanceId: torus.instanceId,
            verifier: GOOGLE
          })
        )
      )
      const scope = 'profile email openid'
      const response_type = 'token id_token'
      const finalUrl =
        `https://accounts.google.com/o/oauth2/v2/auth?response_type=${response_type}&client_id=${config.GOOGLE_CLIENT_ID}` +
        `&state=${state}&scope=${scope}&redirect_uri=${encodeURIComponent(config.redirect_uri)}&nonce=${torus.instanceId}`
      const googleWindow = new PopupHandler({ url: finalUrl, preopenInstanceId })
      const bc = new BroadcastChannel(`redirect_channel_${torus.instanceId}`, broadcastChannelOptions)
      bc.onmessage = async ev => {
        const {
          instanceParams: { verifier },
          hashParams: verifierParams
        } = ev.data || {}
        if (ev.error && ev.error !== '') {
          log.error(ev.error)
          oauthStream.write({ err: ev.error })
        } else if (ev.data && verifier === GOOGLE) {
          try {
            log.info(ev.data)
            const { access_token: accessToken, id_token: idToken } = verifierParams
            const userInfo = await get('https://www.googleapis.com/userinfo/v2/me', {
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            })
            const { picture: profileImage, email, name, id } = userInfo || {}
            dispatch('updateIdToken', { idToken })
            dispatch('updateUserInfo', {
              userInfo: {
                profileImage,
                name,
                email,
                verifierId: email.toString().toLowerCase(),
                verifier: GOOGLE,
                verifierParams: { verifier_id: email.toString().toLowerCase() }
              }
            })
            dispatch('handleLogin', { calledFromEmbed, endPointNumber })
          } catch (error) {
            log.error(error)
            oauthStream.write({ err: 'User cancelled login or something went wrong.' })
          } finally {
            bc.close()
            googleWindow.close()
          }
        }
      }
      googleWindow.open()
      googleWindow.once('close', () => {
        oauthStream.write({ err: 'user closed popup' })
      })
    } else if (verifier === FACEBOOK) {
      const state = encodeURIComponent(
        window.btoa(
          JSON.stringify({
            instanceId: torus.instanceId,
            verifier: FACEBOOK
          })
        )
      )
      const scope = 'public_profile email'
      const response_type = 'token'
      const finalUrl =
        `https://www.facebook.com/v5.0/dialog/oauth?response_type=${response_type}&client_id=${config.FACEBOOK_APP_ID}` +
        `&state=${state}&scope=${scope}&redirect_uri=${encodeURIComponent(config.redirect_uri)}`
      const facebookWindow = new PopupHandler({ url: finalUrl, preopenInstanceId })
      const bc = new BroadcastChannel(`redirect_channel_${torus.instanceId}`, broadcastChannelOptions)
      bc.onmessage = async ev => {
        const {
          instanceParams: { verifier },
          hashParams: verifierParams
        } = ev.data || {}
        if (ev.error && ev.error !== '') {
          log.error(ev.error)
          oauthStream.write({ err: ev.error })
        } else if (ev.data && verifier === FACEBOOK) {
          try {
            log.info(ev.data)
            const { access_token: accessToken } = verifierParams
            const userInfo = await get('https://graph.facebook.com/me?fields=name,email,picture.type(large)', {
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            })
            const { name, id, picture, email } = userInfo || {}
            dispatch('updateIdToken', { idToken: accessToken })
            dispatch('updateUserInfo', {
              userInfo: {
                profileImage: picture.data.url,
                name,
                email: email,
                verifierId: id.toString(),
                verifier: FACEBOOK,
                verifierParams: { verifier_id: id.toString() }
              }
            })
            dispatch('handleLogin', { calledFromEmbed, endPointNumber })
          } catch (error) {
            log.error(error)
            oauthStream.write({ err: 'User cancelled login or something went wrong.' })
          } finally {
            bc.close()
            facebookWindow.close()
          }
        }
      }
      facebookWindow.open()
      facebookWindow.once('close', () => {
        oauthStream.write({ err: 'user closed popup' })
      })
    } else if (verifier === TWITCH) {
      const state = encodeURIComponent(
        window.btoa(
          JSON.stringify({
            instanceId: torus.instanceId,
            verifier: TWITCH
          })
        )
      )
      const claims = JSON.stringify({
        id_token: {
          email: null
        },
        userinfo: {
          picture: null,
          preferred_username: null
        }
      })
      const finalUrl =
        `https://id.twitch.tv/oauth2/authorize?client_id=${config.TWITCH_CLIENT_ID}&redirect_uri=` +
        `${config.redirect_uri}&response_type=token%20id_token&scope=user:read:email+openid&claims=${claims}&state=${state}`
      const twitchWindow = new PopupHandler({ url: finalUrl, preopenInstanceId })
      const bc = new BroadcastChannel(`redirect_channel_${torus.instanceId}`, broadcastChannelOptions)
      bc.onmessage = async ev => {
        const {
          instanceParams: { verifier },
          hashParams: verifierParams
        } = ev.data || {}
        if (ev.error && ev.error !== '') {
          log.error(ev.error)
          oauthStream.write({ err: ev.error })
        } else if (ev.data && verifier === TWITCH) {
          try {
            const { access_token: accessToken, id_token: idtoken } = verifierParams
            const userInfo = await get('https://id.twitch.tv/oauth2/userinfo', {
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            })
            const tokenInfo = jwtDecode(idtoken)
            const { picture: profileImage, preferred_username: name } = userInfo || {}
            const { email } = tokenInfo || {}
            dispatch('updateIdToken', { idToken: accessToken.toString() })
            dispatch('updateUserInfo', {
              userInfo: {
                profileImage,
                name,
                email,
                verifierId: userInfo.sub.toString(),
                verifier: TWITCH,
                verifierParams: { verifier_id: userInfo.sub.toString() }
              }
            })
            dispatch('handleLogin', { calledFromEmbed, endPointNumber })
          } catch (error) {
            log.error(error)
            oauthStream.write({ err: 'something went wrong.' })
          } finally {
            bc.close()
            twitchWindow.close()
          }
        }
      }
      twitchWindow.open()
      twitchWindow.once('close', () => {
        oauthStream.write({ err: 'user closed popup' })
      })
    } else if (verifier === REDDIT) {
      const state = encodeURIComponent(
        window.btoa(
          JSON.stringify({
            instanceId: torus.instanceId,
            verifier: REDDIT
          })
        )
      )
      const finalUrl =
        `https://www.reddit.com/api/v1/authorize?client_id=${config.REDDIT_CLIENT_ID}&redirect_uri=` +
        `${config.redirect_uri}&response_type=token&scope=identity&state=${state}`
      const redditWindow = new PopupHandler({ url: finalUrl, preopenInstanceId })
      const bc = new BroadcastChannel(`redirect_channel_${torus.instanceId}`, broadcastChannelOptions)
      bc.onmessage = async ev => {
        const {
          instanceParams: { verifier },
          hashParams: verifierParams
        } = ev.data || {}
        if (ev.error && ev.error !== '') {
          log.error(ev.error)
          oauthStream.write({ err: ev.error })
        } else if (ev.data && verifier === REDDIT) {
          try {
            const { access_token: accessToken } = verifierParams
            const userInfo = await get('https://oauth.reddit.com/api/v1/me', {
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            })
            const { id, icon_img: profileImage, name } = userInfo || {}
            dispatch('updateIdToken', { idToken: accessToken })
            dispatch('updateUserInfo', {
              userInfo: {
                profileImage: profileImage.split('?').length > 0 ? profileImage.split('?')[0] : profileImage,
                name,
                email: '',
                verifierId: name.toString().toLowerCase(),
                verifier: REDDIT,
                verifierParams: { verifier_id: name.toString().toLowerCase() }
              }
            })
            dispatch('handleLogin', { calledFromEmbed, endPointNumber })
          } catch (error) {
            log.error(error)
            oauthStream.write({ err: 'User cancelled login or something went wrong.' })
          } finally {
            bc.close()
            redditWindow.close()
          }
        }
      }
      redditWindow.open()
      redditWindow.once('close', () => {
        oauthStream.write({ err: 'user closed popup' })
      })
    } else if (verifier === DISCORD) {
      const state = encodeURIComponent(
        window.btoa(
          JSON.stringify({
            instanceId: torus.instanceId,
            verifier: DISCORD
          })
        )
      )
      const scope = encodeURIComponent('identify email')
      const finalUrl =
        `https://discordapp.com/api/oauth2/authorize?response_type=token&client_id=${config.DISCORD_CLIENT_ID}` +
        `&state=${state}&scope=${scope}&redirect_uri=${encodeURIComponent(config.redirect_uri)}`
      const discordWindow = new PopupHandler({ url: finalUrl, preopenInstanceId })
      const bc = new BroadcastChannel(`redirect_channel_${torus.instanceId}`, broadcastChannelOptions)
      bc.onmessage = async ev => {
        const {
          instanceParams: { verifier },
          hashParams: verifierParams
        } = ev.data || {}
        if (ev.error && ev.error !== '') {
          log.error(ev.error)
          oauthStream.write({ err: ev.error })
        } else if (ev.data && verifier === DISCORD) {
          try {
            const { access_token: accessToken } = verifierParams
            const userInfo = await get('https://discordapp.com/api/users/@me', {
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            })
            const { id, avatar, email, username: name, discriminator } = userInfo || {}
            const profileImage =
              avatar === null
                ? `https://cdn.discordapp.com/embed/avatars/${discriminator % 5}.png`
                : `https://cdn.discordapp.com/avatars/${id}/${avatar}.png?size=2048`
            dispatch('updateIdToken', { idToken: accessToken })
            dispatch('updateUserInfo', {
              userInfo: {
                profileImage,
                name: `${name}#${discriminator}`,
                email,
                verifierId: id.toString(),
                verifier: DISCORD,
                verifierParams: { verifier_id: id.toString() }
              }
            })
            dispatch('handleLogin', { calledFromEmbed, endPointNumber })
          } catch (error) {
            log.error(error)
            oauthStream.write({ err: 'User cancelled login or something went wrong.' })
          } finally {
            bc.close()
            discordWindow.close()
          }
        }
      }
      discordWindow.open()
      discordWindow.once('close', () => {
        oauthStream.write({ err: 'user closed popup' })
      })
    }
  },
  subscribeToControllers(context, payload) {
    torus.torusController.accountTracker.store.subscribe(accountTrackerHandler)
    torus.torusController.txController.store.subscribe(transactionControllerHandler)
    torus.torusController.assetController.store.subscribe(assetControllerHandler)
    torus.torusController.typedMessageManager.store.subscribe(typedMessageManagerHandler)
    torus.torusController.personalMessageManager.store.subscribe(personalMessageManagerHandler)
    torus.torusController.messageManager.store.subscribe(messageManagerHandler)
    torus.torusController.detectTokensController.detectedTokensStore.subscribe(detectTokensControllerHandler)
    torus.torusController.tokenRatesController.store.subscribe(tokenRatesControllerHandler)
  },
  initTorusKeyring({ state, dispatch }, payload) {
    return torus.torusController.initTorusKeyring([payload.privKey], [payload.ethAddress])
  },
  setBillboard({ commit, state }) {
    try {
      get(`${config.api}/billboard`, {
        headers: {
          Authorization: `Bearer ${state.jwtToken}`
        }
      }).then(resp => {
        if (resp.data) commit('setBillboard', resp.data)
      })
    } catch (error) {
      reject(error)
    }
  },
  setContacts({ commit, state }) {
    try {
      get(`${config.api}/contact`, {
        headers: {
          Authorization: `Bearer ${state.jwtToken}`
        }
      }).then(resp => {
        if (resp.data) commit('setContacts', resp.data)
      })
    } catch (error) {
      reject(error)
    }
  },
  addContact({ commit, state }, payload) {
    return new Promise((resolve, reject) => {
      post(`${config.api}/contact`, payload, {
        headers: {
          Authorization: `Bearer ${state.jwtToken}`,
          'Content-Type': 'application/json; charset=utf-8'
        }
      })
        .then(response => {
          commit('addContacts', [response.data])
          log.info('successfully added contact', response)
          resolve(response)
        })
        .catch(err => {
          log.error(err, 'unable to add contact')
          reject('Unable to add contact')
        })
    })
  },
  deleteContact({ commit, state }, payload) {
    return new Promise((resolve, reject) => {
      remove(
        `${config.api}/contact/${payload}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${state.jwtToken}`
          }
        }
      )
        .then(response => {
          const contactIndex = state.contacts.findIndex(contact => contact.id === response.data.id)
          if (contactIndex !== -1) {
            commit('deleteContact', contactIndex)
            log.info('successfully deleted contact', response)
            resolve(response)
          }
        })
        .catch(err => {
          log.error(err, 'unable to delete contact')
          reject('Unable to delete contact')
        })
    })
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
        dispatch('subscribeToControllers')
        await Promise.all([
          dispatch('initTorusKeyring', data),
          dispatch('processAuthMessage', { message: message, selectedAddress: data.ethAddress, calledFromEmbed: calledFromEmbed })
        ])
        dispatch('updateSelectedAddress', { selectedAddress: data.ethAddress }) //synchronus
        dispatch('setBillboard')
        // continue enable function
        var ethAddress = data.ethAddress
        if (calledFromEmbed) {
          setTimeout(function() {
            torus.continueEnable(ethAddress)
          }, 50)
        }
        statusStream.write({ loggedIn: true, rehydrate: false, verifier: verifier })
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
        await dispatch('setUserInfoAction', { token: response.token, calledFromEmbed: calledFromEmbed, rehydrate: false })

        resolve()
      } catch (error) {
        log.error('Failed Communication with backend', error)
        reject(error)
      }
    })
  },
  storeUserLogin({ state }, payload) {
    let userOrigin = ''
    if (payload && payload.calledFromEmbed) {
      userOrigin = window.location.ancestorOrigins ? window.location.ancestorOrigins[0] : document.referrer
    } else userOrigin = window.location.origin
    if (!payload.rehydrate)
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
  setUserTheme({ state, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      patch(
        `${config.api}/user/theme`,
        {
          theme: payload
        },
        {
          headers: {
            Authorization: `Bearer ${state.jwtToken}`,
            'Content-Type': 'application/json; charset=utf-8'
          }
        }
      )
        .then(response => {
          dispatch('setTheme', payload)
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
    // Fixes loading theme for too long
    dispatch('setTheme', state.theme)

    return new Promise(async (resolve, reject) => {
      const { token, calledFromEmbed, rehydrate } = payload
      try {
        get(`${config.api}/user`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
          .then(user => {
            if (user.data) {
              const { transactions, contacts, default_currency, theme } = user.data || {}
              commit('setPastTransactions', transactions)
              commit('setContacts', contacts)
              dispatch('setTheme', theme)
              dispatch('setSelectedCurrency', { selectedCurrency: default_currency, origin: 'store' })
              dispatch('storeUserLogin', { calledFromEmbed, rehydrate })
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
            dispatch('storeUserLogin', { calledFromEmbed, rehydrate })
            resolve()
          })
      } catch (error) {
        reject(error)
      }
    })
  },
  async rehydrate({ state, dispatch }, payload) {
    let {
      selectedAddress,
      wallet,
      networkType,
      networkId,
      jwtToken,
      userInfo: { verifier }
    } = state
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
        setTimeout(() => dispatch('subscribeToControllers'), 50)
        await Promise.all([
          torus.torusController.initTorusKeyring(Object.values(wallet), Object.keys(wallet)),
          dispatch('setUserInfoAction', { token: jwtToken, calledFromEmbed: false, rehydrate: true })
        ])
        dispatch('updateSelectedAddress', { selectedAddress })
        dispatch('updateNetworkId', { networkId: networkId })
        statusStream.write({ loggedIn: true, rehydrate: true, verifier: verifier })
        log.info('rehydrated wallet')
        // torus.web3.eth.net
        //   .getId()
        //   .then(res => {
        //     console.log(res)
        //     setTimeout(function() {
        //       dispatch('updateNetworkId', { networkId: toHex(res) })
        //     })
        //     // publicConfigOutStream.write(JSON.stringify({networkVersion: res}))
        //   })
        //   .catch(e => log.error(e))
      }
    } catch (error) {
      log.error('Failed to rehydrate', error)
    }
  }
}
