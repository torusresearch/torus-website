import { BroadcastChannel } from 'broadcast-channel'
import jwtDecode from 'jwt-decode'
import log from 'loglevel'
import { toChecksumAddress } from 'web3-utils'

import config from '../config'
import torus from '../torus'
import accountImporter from '../utils/accountImporter'
import {
  DISCORD,
  FACEBOOK,
  GOOGLE,
  REDDIT,
  RPC,
  SUPPORTED_NETWORK_TYPES,
  TWITCH,
  USER_INFO_REQUEST_APPROVED,
  USER_INFO_REQUEST_REJECTED,
} from '../utils/enums'
import { post, remove } from '../utils/httpHelpers'
import PopupHandler from '../utils/PopupHandler'
import { broadcastChannelOptions, fakeStream, getIFrameOriginObject } from '../utils/utils'
import {
  accountTrackerHandler,
  assetControllerHandler,
  detectTokensControllerHandler,
  errorMsgHandler as errorMessageHandler,
  messageManagerHandler,
  metadataHandler,
  personalMessageManagerHandler,
  prefsControllerHandler,
  successMsgHandler as successMessageHandler,
  tokenRatesControllerHandler,
  transactionControllerHandler,
  typedMessageManagerHandler,
} from './controllerSubscriptions'
import { discordHandler, facebookHandler, googleHandler, handleLoginWindow, redditHandler, twitchHandler } from './loginHandlers'
import initialState from './state'

const { baseRoute } = config
const { torusController } = torus || {}
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
  networkController,
  assetDetectionController,
} = torusController || {}

// stream to send logged in status
const { communicationMux = { getStream: () => fakeStream } } = torus || {}
const statusStream = communicationMux.getStream('status')
const oauthStream = communicationMux.getStream('oauth')
const userInfoStream = communicationMux.getStream('user_info')
const providerChangeStream = communicationMux.getStream('provider_change')
const widgetStream = communicationMux.getStream('widget')

const handleProviderChangeSuccess = () => {
  setTimeout(() => {
    providerChangeStream.write({
      name: 'provider_change_status',
      data: {
        success: true,
      },
    })
  }, 100)
}

const handleProviderChangeDeny = (error) => {
  providerChangeStream.write({
    name: 'provider_change_status',
    data: {
      success: false,
      err: error,
    },
  })
}
// Have to do this here cause embed calls on init
if (prefsController) {
  prefsController.metadataStore.subscribe(metadataHandler)
}

export default {
  logOut({ commit, state }, _) {
    commit('logOut', { ...initialState, networkType: state.networkType, networkId: state.networkId })
    // commit('setTheme', THEME_LIGHT_BLUE_NAME)
    // if (storageAvailable('sessionStorage')) window.sessionStorage.clear()
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
    prefsController.successStore.unsubscribe(successMessageHandler)
    prefsController.errorStore.unsubscribe(errorMessageHandler)
    torus.updateStaticData({ isUnlocked: false })
  },
  setSelectedCurrency({ commit }, payload) {
    torusController.setCurrentCurrency(payload, (error, data) => {
      if (error) log.error('currency fetch failed')
      else commit('setCurrencyData', data)
    })
  },
  async forceFetchTokens() {
    detectTokensController.refreshTokenBalances()
    assetDetectionController.restartAssetDetection()
    try {
      const response = await torusController.prefsController.getEtherScanTokenBalances()
      const { data } = response
      data.forEach((object) => {
        detectTokensController.detectEtherscanTokenBalance(toChecksumAddress(object.contractAddress), {
          decimals: object.tokenDecimal,
          erc20: true,
          logo: 'eth.svg',
          name: object.name,
          balance: object.balance,
          symbol: object.ticker,
        })
      })
    } catch (error) {
      log.error('etherscan balance fetch failed')
    }
  },
  showProviderChangePopup({ dispatch, state }, payload) {
    const { override, preopenInstanceId } = payload

    if (override) {
      setTimeout(() => {
        dispatch('setProviderType', payload).then(handleProviderChangeSuccess).catch(handleProviderChangeDeny)
      }, 500)
      return
    }
    const bc = new BroadcastChannel(`torus_provider_change_channel_${torus.instanceId}`, broadcastChannelOptions)
    const finalUrl = `${baseRoute}providerchange?integrity=true&instanceId=${torus.instanceId}`
    const providerChangeWindow = new PopupHandler({
      url: finalUrl,
      preopenInstanceId,
      target: '_blank',
      features: 'directories=0,titlebar=0,toolbar=0,status=0,location=0,menubar=0,height=660,width=375',
    })
    bc.addEventListener('message', async (ev) => {
      const { type = '', approve = false } = ev.data
      if (type === 'popup-loaded') {
        await bc.postMessage({
          data: {
            origin: getIFrameOriginObject(),
            payload,
            currentNetwork: state.networkType,
          },
        })
      } else if (type === 'provider-change-result') {
        try {
          log.info('Provider change', approve)
          if (approve) {
            await dispatch('setProviderType', payload)
            handleProviderChangeSuccess()
          } else {
            handleProviderChangeDeny('user denied provider change request')
          }
        } catch (error) {
          handleProviderChangeDeny('Internal error occured')
        } finally {
          bc.close()
          providerChangeWindow.close()
        }
      }
    })

    providerChangeWindow.open()
    providerChangeWindow.once('close', () => {
      bc.close()
      handleProviderChangeDeny('user denied provider change request')
    })
  },
  showUserInfoRequestPopup({ dispatch, state }, payload) {
    const { preopenInstanceId } = payload
    log.info(preopenInstanceId, 'userinfo')
    const bc = new BroadcastChannel(`user_info_request_channel_${torus.instanceId}`, broadcastChannelOptions)
    const finalUrl = `${baseRoute}userinforequest?integrity=true&instanceId=${torus.instanceId}`
    const userInfoRequestWindow = new PopupHandler({
      url: finalUrl,
      preopenInstanceId,
      target: '_blank',
      features: 'directories=0,titlebar=0,toolbar=0,status=0,location=0,menubar=0,height=660,width=500',
    })

    const handleDeny = () => {
      log.info('User Info Request denied')
      dispatch('updateUserInfoAccess', { approved: false })
      userInfoStream.write({ name: 'user_info_response', data: { payload: {}, approved: false } })
    }
    const handleSuccess = () => {
      log.info('User Info Request approved')
      dispatch('updateUserInfoAccess', { approved: true })
      const returnObject = JSON.parse(JSON.stringify(state.userInfo))
      delete returnObject.verifierParams
      userInfoStream.write({ name: 'user_info_response', data: { payload: returnObject, approved: true } })
    }

    bc.addEventListener('message', async (ev) => {
      const { type = '', approve = false } = ev.data
      if (type === 'popup-loaded') {
        await bc.postMessage({
          data: {
            origin: getIFrameOriginObject(),
            payload: { ...payload, verifier: state.userInfo.verifier },
          },
        })
      } else if (type === 'user-info-request-result') {
        try {
          if (approve) handleSuccess()
          else handleDeny()
        } catch (error) {
          log.error(error)
          handleDeny()
        } finally {
          bc.close()
          userInfoRequestWindow.close()
        }
      }
    })

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
        .then((privKey) => dispatch('finishImportAccount', { privKey }))
        .then((privKey) => resolve(privKey))
        .catch((error) => {
          reject(error)
        })
    })
  },
  finishImportAccount({ dispatch, state }, payload) {
    return new Promise((resolve, reject) => {
      const { privKey } = payload
      const address = torus.generateAddressFromPrivKey(privKey)
      torusController.setSelectedAccount(address, { jwtToken: state.jwtToken })
      dispatch('addWallet', { ethAddress: address, privKey })
      dispatch('updateSelectedAddress', { selectedAddress: address })
      torusController
        .addAccount(privKey, address)
        .then(() => resolve(privKey))
        .catch((error) => reject(error))
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
  setProviderType({ commit }, payload) {
    let networkType = payload.network
    let isSupportedNetwork = false
    if (SUPPORTED_NETWORK_TYPES[networkType.host]) {
      networkType = SUPPORTED_NETWORK_TYPES[networkType.host]
      isSupportedNetwork = true
    }
    commit('setNetworkType', networkType)
    if ((payload.type && payload.type === RPC) || !isSupportedNetwork) {
      return torusController.setCustomRpc(networkType.host, networkType.chainId || 1, 'ETH', networkType.networkName || '')
    }
    return networkController.setProviderType(networkType.host)
  },
  async triggerLogin({ dispatch, commit }, { calledFromEmbed, verifier, preopenInstanceId }) {
    try {
      log.info('Verifier: ', verifier)
      const state = encodeURIComponent(
        window.btoa(
          JSON.stringify({
            instanceId: torus.instanceId,
            verifier,
          })
        )
      )
      let verifierHandler
      let finalUrl
      if (verifier === GOOGLE) {
        const scope = 'profile email openid'
        const responseType = 'token id_token'
        const prompt = 'consent select_account'
        finalUrl =
          `https://accounts.google.com/o/oauth2/v2/auth?response_type=${responseType}&client_id=${config.GOOGLE_CLIENT_ID}` +
          `&state=${state}&scope=${scope}&redirect_uri=${encodeURIComponent(config.redirect_uri)}&nonce=${torus.instanceId}&prompt=${prompt}`
        verifierHandler = googleHandler
      } else if (verifier === FACEBOOK) {
        const scope = 'public_profile email'
        const responseType = 'token'
        finalUrl =
          `https://www.facebook.com/v6.0/dialog/oauth?response_type=${responseType}&client_id=${config.FACEBOOK_CLIENT_ID}` +
          `&state=${state}&scope=${scope}&redirect_uri=${encodeURIComponent(config.redirect_uri)}`
        verifierHandler = facebookHandler
      } else if (verifier === TWITCH) {
        finalUrl =
          `https://id.twitch.tv/oauth2/authorize?client_id=${config.TWITCH_CLIENT_ID}&redirect_uri=` +
          `${config.redirect_uri}&response_type=token&scope=user:read:email&state=${state}&force_verify=true`
        verifierHandler = twitchHandler
      } else if (verifier === REDDIT) {
        finalUrl =
          `https://www.reddit.com/api/v1/authorize?client_id=${config.REDDIT_CLIENT_ID}&redirect_uri=` +
          `${config.redirect_uri}&response_type=token&scope=identity&state=${state}`
        verifierHandler = redditHandler
      } else if (verifier === DISCORD) {
        const scope = encodeURIComponent('identify email')
        finalUrl =
          `https://discordapp.com/api/oauth2/authorize?response_type=token&client_id=${config.DISCORD_CLIENT_ID}` +
          `&state=${state}&scope=${scope}&redirect_uri=${encodeURIComponent(config.redirect_uri)}`
        verifierHandler = discordHandler
      }
      const { profileImage, name, email, verifierId, verifierParams, token } = await handleLoginWindow(
        verifier,
        finalUrl,
        verifierHandler,
        preopenInstanceId
      )
      commit('setUserInfo', {
        profileImage,
        name,
        email,
        verifierId,
        verifier,
        verifierParams,
      })
      await dispatch('handleLogin', { calledFromEmbed, oAuthToken: token })
    } catch (error) {
      log.error(error)
      oauthStream.write({ err: error })
      commit('setOAuthModalStatus', false)
      throw error
    }
  },
  subscribeToControllers() {
    accountTracker.store.subscribe(accountTrackerHandler)
    txController.store.subscribe(transactionControllerHandler)
    assetController.store.subscribe(assetControllerHandler)
    typedMessageManager.store.subscribe(typedMessageManagerHandler)
    personalMessageManager.store.subscribe(personalMessageManagerHandler)
    messageManager.store.subscribe(messageManagerHandler)
    detectTokensController.detectedTokensStore.subscribe(detectTokensControllerHandler)
    tokenRatesController.store.subscribe(tokenRatesControllerHandler)
    prefsController.store.subscribe(prefsControllerHandler)
    prefsController.successStore.subscribe(successMessageHandler)
    prefsController.errorStore.subscribe(errorMessageHandler)
  },
  initTorusKeyring(_, payload) {
    return torusController.initTorusKeyring([payload.privKey], [payload.ethAddress])
  },
  addContact(_, payload) {
    return prefsController.addContact(payload)
  },
  deleteContact(_, payload) {
    return prefsController.deleteContact(payload)
  },
  async handleLogin({ state, dispatch, commit }, { calledFromEmbed, oAuthToken }) {
    // The error in this is caught above
    const {
      userInfo: { verifierId, verifier, verifierParams },
    } = state
    const { torusNodeEndpoints, torusNodePub, torusIndexes } = await torus.nodeDetailManager.getNodeDetails()
    const publicAddress = await torus.getPublicAddress(torusNodeEndpoints, torusNodePub, { verifier, verifierId })
    log.info('New private key assigned to user at address ', publicAddress)
    const p1 = torus.retrieveShares(torusNodeEndpoints, torusIndexes, verifier, verifierParams, oAuthToken)
    const p2 = torus.getMessageForSigning(publicAddress)
    const response = await Promise.all([p1, p2])
    const data = response[0]
    const message = response[1]
    if (publicAddress.toLowerCase() !== data.ethAddress.toLowerCase()) throw new Error('Invalid Key')
    dispatch('addWallet', data) // synchronous
    dispatch('subscribeToControllers')
    await dispatch('initTorusKeyring', data)
    await dispatch('processAuthMessage', { message, selectedAddress: data.ethAddress, calledFromEmbed })
    dispatch('updateSelectedAddress', { selectedAddress: data.ethAddress }) // synchronous
    // continue enable function
    const { ethAddress } = data
    if (calledFromEmbed) {
      setTimeout(() => {
        oauthStream.write({ selectedAddress: ethAddress })
        commit('setOAuthModalStatus', false)
      }, 50)
    }
    // TODO: deprercate rehydrate false for the next major version bump
    statusStream.write({ loggedIn: true, rehydrate: false, verifier })
    torus.updateStaticData({ isUnlocked: true })
    dispatch('cleanupOAuth', { oAuthToken })
  },
  cleanupOAuth({ state }, payload) {
    const {
      userInfo: { verifier },
    } = state
    const { oAuthToken } = payload
    if (verifier === FACEBOOK) {
      remove(`https://graph.facebook.com/me/permissions?access_token=${oAuthToken}`)
        .then((resp) => log.info(resp))
        .catch((error) => log.error(error))
    } else if (verifier === DISCORD) {
      prefsController.revokeDiscord(oAuthToken)
    }
  },
  async processAuthMessage({ commit, dispatch }, payload) {
    try {
      const { message, selectedAddress, calledFromEmbed } = payload
      const hashedMessage = torus.hashMessage(message)
      const signedMessage = await torus.torusController.keyringController.signMessage(selectedAddress, hashedMessage)
      const response = await post(`${config.api}/auth/verify`, {
        public_address: selectedAddress,
        signed_message: signedMessage,
      })
      commit('setJwtToken', response.token)
      // prefsController.jwtToken = response.token
      if (response.token) {
        const decoded = jwtDecode(response.token)
        setTimeout(() => {
          dispatch('logOut')
        }, decoded.exp * 1000 - Date.now())
      }
      await dispatch('setUserInfoAction', { token: response.token, calledFromEmbed, rehydrate: false })
      return Promise.resolve()
    } catch (error) {
      log.error('Failed Communication with backend', error)
      return Promise.reject(error)
    }
  },
  setUserTheme(context, payload) {
    return prefsController.setUserTheme(payload)
  },
  setUserLocale(context, payload) {
    prefsController.setUserLocale(payload)
  },
  setUserInfoAction({ commit, dispatch, state }, payload) {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
      // Fixes loading theme for too long
      commit('setTheme', state.theme)

      const { calledFromEmbed, rehydrate, token } = payload
      const { userInfo, selectedCurrency, theme, locale } = state
      log.info(selectedCurrency)
      const { verifier, verifierId } = userInfo

      prefsController.jwtToken = token
      prefsController.sync(
        (user) => {
          if (user.data) {
            const { default_currency: defaultCurrency, verifier: storedVerifier, verifier_id: storedVerifierId } = user.data || {}
            dispatch('setSelectedCurrency', { selectedCurrency: defaultCurrency, origin: 'store' })
            prefsController.storeUserLogin(verifier, verifierId, { calledFromEmbed, rehydrate })
            if (!storedVerifier || !storedVerifierId) prefsController.setVerifier(verifier, verifierId)
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
  async rehydrate({ state, dispatch }) {
    const {
      selectedAddress,
      wallet,
      networkType,
      networkId,
      jwtToken,
      userInfo: { verifier },
    } = state
    try {
      // if jwtToken expires, logout
      if (jwtToken) {
        const decoded = jwtDecode(jwtToken)
        if (Date.now() / 1000 > decoded.exp) {
          dispatch('logOut')
          return
        }
        setTimeout(() => {
          dispatch('logOut')
        }, decoded.exp * 1000 - Date.now())
      }
      if (SUPPORTED_NETWORK_TYPES[networkType.host]) await dispatch('setProviderType', { network: networkType })
      else await dispatch('setProviderType', { network: networkType, type: RPC })
      if (selectedAddress && wallet[selectedAddress]) {
        setTimeout(() => dispatch('subscribeToControllers'), 50)
        await torus.torusController.initTorusKeyring(Object.values(wallet), Object.keys(wallet))
        await dispatch('setUserInfoAction', { token: jwtToken, calledFromEmbed: false, rehydrate: true })
        dispatch('updateSelectedAddress', { selectedAddress })
        dispatch('updateNetworkId', { networkId })
        // TODO: deprercate rehydrate true for the next major version bump
        statusStream.write({ loggedIn: true, rehydrate: true, verifier })
        log.info('rehydrated wallet')
        torus.updateStaticData({ isUnlocked: true })
      }
    } catch (error) {
      log.error('Failed to rehydrate', error)
    }
  },
  setSuccessMessage(context, payload) {
    prefsController.handleSuccess(payload)
  },
  setErrorMessage(context, payload) {
    prefsController.handleError(payload)
  },
  cancelLogin({ commit, dispatch }) {
    oauthStream.write({ err: { message: 'User cancelled login' } })
    commit('setOAuthModalStatus', false)
    dispatch('toggleWidgetVisibility', false)
  },
  startLogin({ commit, dispatch }) {
    commit('setOAuthModalStatus', true)
    dispatch('toggleWidgetVisibility', true)
  },
  toggleWidgetVisibility(context, payload) {
    widgetStream.write({
      data: payload,
    })
  },
}
