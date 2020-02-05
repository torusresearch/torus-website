import { BroadcastChannel } from 'broadcast-channel'
import log from 'loglevel'
import config from '../config'
import { toChecksumAddress } from 'web3-utils'
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
import { broadcastChannelOptions, storageAvailable } from '../utils/utils'
import { post, get } from '../utils/httpHelpers.js'
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
  tokenRatesControllerHandler,
  prefsControllerHandler,
  successMsgHandler,
  errorMsgHandler
} from './controllerSubscriptions'
import PopupHandler from '../utils/PopupHandler'

const accountImporter = require('../utils/accountImporter')

const baseRoute = config.baseRoute
const { torusController } = torus
const {
  accountTracker,
  txController,
  assetController,
  typedMessageManager,
  personalMessageManager,
  messageManager,
  detectTokensController,
  tokenRatesController,
  prefsController,
  networkController
} = torusController

// stream to send logged in status
const statusStream = torus.communicationMux.getStream('status')
const oauthStream = torus.communicationMux.getStream('oauth')
const userInfoStream = torus.communicationMux.getStream('user_info')
const providerChangeStream = torus.communicationMux.getStream('provider_change')

export default {
  logOut({ commit, dispatch }, payload) {
    commit('logOut', initialState)
    // commit('setTheme', THEME_LIGHT_BLUE_NAME)
    if (storageAvailable('sessionStorage')) window.sessionStorage.clear()
    statusStream.write({ loggedIn: false })
    accountTracker.store.unsubscribe(accountTrackerHandler)
    txController.store.unsubscribe(transactionControllerHandler)
    assetController.store.unsubscribe(assetControllerHandler)
    typedMessageManager.store.unsubscribe(typedMessageManagerHandler)
    personalMessageManager.store.unsubscribe(personalMessageManagerHandler)
    messageManager.store.unsubscribe(messageManagerHandler)
    detectTokensController.detectedTokensStore.unsubscribe(detectTokensControllerHandler)
    tokenRatesController.store.unsubscribe(tokenRatesControllerHandler)
    prefsController.store.unsubscribe(prefsControllerHandler)
    prefsController.successStore.unsubscribe(successMsgHandler)
    prefsController.errorStore.unsubscribe(errorMsgHandler)
    torus.updateStaticData({ isUnlocked: false })
  },
  setSelectedCurrency({ commit, state }, payload) {
    torusController.setCurrentCurrency(payload)
  },
  async forceFetchTokens({ state }, payload) {
    detectTokensController.refreshTokenBalances()
    assetDetectionController.restartAssetDetection()
    try {
      const response = await torusController.prefsController.getEtherScanTokenBalances()
      const { data } = response
      data.forEach(obj => {
        detectTokensController.detectEtherscanTokenBalance(toChecksumAddress(obj.contractAddress), {
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
      setTimeout(() => {
        dispatch('setProviderType', payload)
          .then(handleSuccess)
          .catch(handleDeny)
      }, 500)
      return
    }
    const bc = new BroadcastChannel(`torus_provider_change_channel_${torus.instanceId}`, broadcastChannelOptions)
    const finalUrl = `${baseRoute}providerchange?integrity=true&instanceId=${torus.instanceId}`
    const providerChangeWindow = new PopupHandler({
      url: finalUrl,
      preopenInstanceId,
      target: '_blank',
      features: 'directories=0,titlebar=0,toolbar=0,status=0,location=0,menubar=0,height=660,width=500'
    })
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
    providerChangeWindow.once('close', () => {
      bc.close()
      handleDeny(new Error('user denied provider change request'))
    })
  },
  showUserInfoRequestPopup({ dispatch, state }, payload) {
    const { preopenInstanceId } = payload
    log.info(preopenInstanceId, 'userinfo')
    var bc = new BroadcastChannel(`user_info_request_channel_${torus.instanceId}`, broadcastChannelOptions)
    const finalUrl = `${baseRoute}userinforequest?integrity=true&instanceId=${torus.instanceId}`
    const userInfoRequestWindow = new PopupHandler({
      url: finalUrl,
      preopenInstanceId,
      target: '_blank',
      features: 'directories=0,titlebar=0,toolbar=0,status=0,location=0,menubar=0,height=660,width=500'
    })

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
    userInfoRequestWindow.once('close', () => {
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
      torusController.setSelectedAccount(address, { jwtToken: state.jwtToken })
      dispatch('addWallet', { ethAddress: address, privKey: privKey })
      dispatch('updateSelectedAddress', { selectedAddress: address })
      torusController
        .addAccount(privKey, address)
        .then(response => resolve(privKey))
        .catch(err => reject(err))
    })
  },
  addWallet(context, payload) {
    if (payload.ethAddress) {
      context.commit('setWallet', { ...context.state.wallet, [payload.ethAddress]: payload.privKey })
    }
  },
  updateUserInfoAccess({ commit }, payload) {
    if (payload.approved) commit('setUserInfoAccess', USER_INFO_REQUEST_APPROVED)
    else commit('setUserInfoAccess', USER_INFO_REQUEST_REJECTED)
  },
  updateSelectedAddress({ commit, state }, payload) {
    commit('setSelectedAddress', payload.selectedAddress)
    torus.updateStaticData({ selectedAddress: payload.selectedAddress })
    torusController.setSelectedAccount(payload.selectedAddress, { jwtToken: state.jwtToken })
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
      return torusController.setCustomRpc(networkType.host, networkType.chainId, 'ETH', networkType.networkName)
    } else {
      return networkController.setProviderType(networkType.host)
    }
  },
  triggerLogin({ dispatch, commit }, { calledFromEmbed, verifier, preopenInstanceId }) {
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
        try {
          const {
            instanceParams: { verifier },
            hashParams: verifierParams
          } = ev.data || {}
          if (ev.error && ev.error !== '') {
            log.error(ev.error)
            oauthStream.write({ err: ev.error })
          } else if (ev.data && verifier === GOOGLE) {
            log.info(ev.data)
            const { access_token: accessToken, id_token: idToken } = verifierParams
            const userInfo = await get('https://www.googleapis.com/userinfo/v2/me', {
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            })
            const { picture: profileImage, email, name, id } = userInfo || {}
            commit('setIdToken', idToken)
            commit('setUserInfo', {
              profileImage,
              name,
              email,
              verifierId: email.toString().toLowerCase(),
              verifier: GOOGLE,
              verifierParams: { verifier_id: email.toString().toLowerCase() }
            })
            dispatch('handleLogin', { calledFromEmbed })
          }
        } catch (error) {
          log.error(error)
          oauthStream.write({ err: 'User cancelled login or something went wrong.' })
        } finally {
          bc.close()
          googleWindow.close()
        }
      }
      googleWindow.open()
      googleWindow.once('close', () => {
        bc.close()
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
        try {
          const {
            instanceParams: { verifier },
            hashParams: verifierParams
          } = ev.data || {}
          if (ev.error && ev.error !== '') {
            log.error(ev.error)
            oauthStream.write({ err: ev.error })
          } else if (ev.data && verifier === FACEBOOK) {
            log.info(ev.data)
            const { access_token: accessToken } = verifierParams
            const userInfo = await get('https://graph.facebook.com/me?fields=name,email,picture.type(large)', {
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            })
            const { name, id, picture, email } = userInfo || {}
            commit('setIdToken', accessToken)
            commit('setUserInfo', {
              profileImage: picture.data.url,
              name,
              email: email,
              verifierId: id.toString(),
              verifier: FACEBOOK,
              verifierParams: { verifier_id: id.toString() }
            })
            dispatch('handleLogin', { calledFromEmbed })
          }
        } catch (error) {
          log.error(error)
          oauthStream.write({ err: 'User cancelled login or something went wrong.' })
        } finally {
          bc.close()
          facebookWindow.close()
        }
      }
      facebookWindow.open()
      facebookWindow.once('close', () => {
        bc.close()
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
        try {
          const {
            instanceParams: { verifier },
            hashParams: verifierParams
          } = ev.data || {}
          if (ev.error && ev.error !== '') {
            log.error(ev.error)
            oauthStream.write({ err: ev.error })
          } else if (ev.data && verifier === TWITCH) {
            const { access_token: accessToken, id_token: idtoken } = verifierParams
            const userInfo = await get('https://id.twitch.tv/oauth2/userinfo', {
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            })
            const tokenInfo = jwtDecode(idtoken)
            const { picture: profileImage, preferred_username: name } = userInfo || {}
            const { email } = tokenInfo || {}
            commit('setIdToken', accessToken.toString())
            commit('setUserInfo', {
              profileImage,
              name,
              email,
              verifierId: userInfo.sub.toString(),
              verifier: TWITCH,
              verifierParams: { verifier_id: userInfo.sub.toString() }
            })
            dispatch('handleLogin', { calledFromEmbed })
          }
        } catch (error) {
          log.error(error)
          oauthStream.write({ err: 'something went wrong.' })
        } finally {
          bc.close()
          twitchWindow.close()
        }
      }
      twitchWindow.open()
      twitchWindow.once('close', () => {
        bc.close()
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
        try {
          const {
            instanceParams: { verifier },
            hashParams: verifierParams
          } = ev.data || {}
          if (ev.error && ev.error !== '') {
            log.error(ev.error)
            oauthStream.write({ err: ev.error })
          } else if (ev.data && verifier === REDDIT) {
            const { access_token: accessToken } = verifierParams
            const userInfo = await get('https://oauth.reddit.com/api/v1/me', {
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            })
            const { id, icon_img: profileImage, name } = userInfo || {}
            commit('setIdToken', accessToken)
            commit('setUserInfo', {
              profileImage: profileImage.split('?').length > 0 ? profileImage.split('?')[0] : profileImage,
              name,
              email: '',
              verifierId: name.toString().toLowerCase(),
              verifier: REDDIT,
              verifierParams: { verifier_id: name.toString().toLowerCase() }
            })
            dispatch('handleLogin', { calledFromEmbed })
          }
        } catch (error) {
          log.error(error)
          oauthStream.write({ err: 'User cancelled login or something went wrong.' })
        } finally {
          bc.close()
          redditWindow.close()
        }
      }
      redditWindow.open()
      redditWindow.once('close', () => {
        bc.close()
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
        try {
          const {
            instanceParams: { verifier },
            hashParams: verifierParams
          } = ev.data || {}
          if (ev.error && ev.error !== '') {
            log.error(ev.error)
            oauthStream.write({ err: ev.error })
          } else if (ev.data && verifier === DISCORD) {
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
            commit('setIdToken', accessToken)
            commit('setUserInfo', {
              profileImage,
              name: `${name}#${discriminator}`,
              email,
              verifierId: id.toString(),
              verifier: DISCORD,
              verifierParams: { verifier_id: id.toString() }
            })
            dispatch('handleLogin', { calledFromEmbed })
          }
        } catch (error) {
          log.error(error)
          oauthStream.write({ err: 'User cancelled login or something went wrong.' })
        } finally {
          bc.close()
          discordWindow.close()
        }
      }
      discordWindow.open()
      discordWindow.once('close', () => {
        bc.close()
        oauthStream.write({ err: 'user closed popup' })
      })
    }
  },
  subscribeToControllers(context, payload) {
    accountTracker.store.subscribe(accountTrackerHandler)
    txController.store.subscribe(transactionControllerHandler)
    assetController.store.subscribe(assetControllerHandler)
    typedMessageManager.store.subscribe(typedMessageManagerHandler)
    personalMessageManager.store.subscribe(personalMessageManagerHandler)
    messageManager.store.subscribe(messageManagerHandler)
    detectTokensController.detectedTokensStore.subscribe(detectTokensControllerHandler)
    tokenRatesController.store.subscribe(tokenRatesControllerHandler)
    prefsController.store.subscribe(prefsControllerHandler)
    prefsController.successStore.subscribe(successMsgHandler)
    prefsController.errorStore.subscribe(errorMsgHandler)
  },
  initTorusKeyring({ state, dispatch }, payload) {
    return torusController.initTorusKeyring([payload.privKey], [payload.ethAddress])
  },
  addContact({ commit, state }, payload) {
    prefsController.addContact(payload)
  },
  deleteContact({ commit, state }, payload) {
    prefsController.deleteContact(payload)
  },
  async handleLogin({ state, dispatch, commit }, { calledFromEmbed }) {
    commit('setLoginInProgress', true)
    const {
      idToken,
      userInfo: { verifierId, verifier, verifierParams }
    } = state
    let torusNodeEndpoints, torusIndexes
    return torus.nodeDetailManager
      .getNodeDetails()
      .then(({ torusNodeEndpoints: torusNodeEndpointsVal, torusNodePub, torusIndexes: torusIndexesVal }) => {
        torusNodeEndpoints = torusNodeEndpointsVal
        torusIndexes = torusIndexesVal
        return torus.getPublicAddress(torusNodeEndpoints, torusNodePub, { verifier, verifierId })
      })
      .then(res => {
        log.info('New private key assigned to user at address ', res)
        const p1 = torus.retrieveShares(torusNodeEndpoints, torusIndexes, verifier, verifierParams, idToken)
        const p2 = torus.getMessageForSigning(res)
        return Promise.all([p1, p2])
      })
      .then(async response => {
        const data = response[0]
        const message = response[1]
        dispatch('addWallet', data) // synchronous
        dispatch('subscribeToControllers')
        await Promise.all([
          dispatch('initTorusKeyring', data),
          dispatch('processAuthMessage', { message: message, selectedAddress: data.ethAddress, calledFromEmbed: calledFromEmbed })
        ])
        dispatch('updateSelectedAddress', { selectedAddress: data.ethAddress }) // synchronous
        prefsController.getBillboardContents()
        // continue enable function
        var ethAddress = data.ethAddress
        if (calledFromEmbed) {
          setTimeout(function() {
            torus.continueEnable(ethAddress)
          }, 50)
        }
        statusStream.write({ loggedIn: true, rehydrate: false, verifier: verifier })
        commit('setLoginInProgress', false)
        torus.updateStaticData({ isUnlocked: true })
      })
      .catch(err => {
        log.error(err)
      })
  },
  processAuthMessage({ commit, dispatch }, payload) {
    return new Promise(async (resolve, reject) => {
      try {
        const { message, selectedAddress, calledFromEmbed } = payload
        const hashedMessage = torus.hashMessage(message)
        const signedMessage = await torus.torusController.keyringController.signMessage(selectedAddress, hashedMessage)
        const response = await post(`${config.api}/auth/verify`, {
          public_address: selectedAddress,
          signed_message: signedMessage
        })
        commit('setJwtToken', response.token)
        prefsController.jwtToken = response.token
        if (response.token) {
          const decoded = jwtDecode(response.token)
          setTimeout(() => {
            dispatch('logOut')
          }, decoded.exp * 1000 - Date.now())
        }
        await dispatch('setUserInfoAction', { token: response.token, calledFromEmbed: calledFromEmbed, rehydrate: false })

        resolve()
      } catch (error) {
        log.error('Failed Communication with backend', error)
        reject(error)
      }
    })
  },
  setUserTheme({ state, commit }, payload) {
    prefsController.setUserTheme(payload)
  },
  setUserLocale({ state, commit }, payload) {
    prefsController.setUserLocale(payload)
  },
  setUserInfoAction({ commit, dispatch, state }, payload) {
    return new Promise(async (resolve, reject) => {
      // Fixes loading theme for too long
      commit('setTheme', state.theme)
      const { calledFromEmbed, rehydrate, token } = payload
      const { userInfo, selectedCurrency, theme, locale } = state
      const { verifier, verifierId } = userInfo
      prefsController.jwtToken = token
      prefsController.sync(
        user => {
          if (user.data) {
            const { default_currency } = user.data || {}
            dispatch('setSelectedCurrency', { selectedCurrency: default_currency, origin: 'store' })
            prefsController.storeUserLogin(verifier, verifierId, { calledFromEmbed, rehydrate })
            resolve()
          }
        },
        async () => {
          await prefsController.createUser(selectedCurrency, theme, verifier, verifierId, locale)
          commit('setNewUser', true)
          dispatch('setSelectedCurrency', { selectedCurrency: state.selectedCurrency, origin: 'store' })
          prefsController.storeUserLogin(verifier, verifierId, { calledFromEmbed, rehydrate })
          resolve()
        }
      )
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
        } else {
          setTimeout(() => {
            dispatch('logOut')
          }, decoded.exp * 1000 - Date.now())
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
        torus.updateStaticData({ isUnlocked: true })
      }
    } catch (error) {
      log.error('Failed to rehydrate', error)
    }
  }
}
