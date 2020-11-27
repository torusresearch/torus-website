import randomId from '@chaitanyapotti/random-id'
import clone from 'clone'
import deepmerge from 'deepmerge'
// import jwtDecode from 'jwt-decode'
import log from 'loglevel'

import config from '../config'
import { HandlerFactory as createHandler } from '../handlers/Auth'
import PopupHandler from '../handlers/Popup/PopupHandler'
import PopupWithBcHandler from '../handlers/Popup/PopupWithBcHandler'
import vuetify from '../plugins/vuetify'
import torus from '../torus'
import accountImporter from '../utils/accountImporter'
import {
  ACCOUNT_TYPE,
  DISCORD,
  FACEBOOK,
  FEATURES_DEFAULT_WALLET_WINDOW,
  FEATURES_PROVIDER_CHANGE_WINDOW,
  RPC,
  SUPPORTED_NETWORK_TYPES,
  USER_INFO_REQUEST_APPROVED,
  USER_INFO_REQUEST_REJECTED,
} from '../utils/enums'
import { remove } from '../utils/httpHelpers'
import { fakeStream, getIFrameOriginObject, isMain } from '../utils/utils'
import {
  accountTrackerHandler,
  assetControllerHandler,
  billboardHandler,
  detectTokensControllerHandler,
  errorMsgHandler as errorMessageHandler,
  etherscanTxHandler,
  messageManagerHandler,
  metadataHandler,
  personalMessageManagerHandler,
  prefsControllerHandler,
  successMsgHandler as successMessageHandler,
  tKeyHandler,
  tokenRatesControllerHandler,
  transactionControllerHandler,
  typedMessageManagerHandler,
  walletConnectHandler,
} from './controllerSubscriptions'
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
  thresholdKeyController,
  walletConnectController,
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
      err: error.message || 'Provider change status error',
    },
  })
}
// Have to do this here cause embed calls on init
if (prefsController) {
  prefsController.metadataStore.subscribe(metadataHandler)
}
function resetStore(store, handler, initState) {
  if (initState) store.putState(clone(initState))
  store.unsubscribe(handler)
}

export default {
  async logOut({ commit, state }, _) {
    commit('logOut', { ...initialState, networkType: state.networkType, networkId: state.networkId })
    // commit('setTheme', THEME_LIGHT_BLUE_NAME)
    // if (storageAvailable('sessionStorage')) window.sessionStorage.clear()
    statusStream.write({ loggedIn: false })
    resetStore(accountTracker.store, accountTrackerHandler)
    resetStore(txController.store, transactionControllerHandler)
    resetStore(assetController.store, assetControllerHandler)
    resetStore(typedMessageManager.store, typedMessageManagerHandler)
    resetStore(personalMessageManager.store, personalMessageManagerHandler)
    resetStore(messageManager.store, messageManagerHandler)
    resetStore(detectTokensController.detectedTokensStore, detectTokensControllerHandler, detectTokensController.initState)
    resetStore(tokenRatesController.store, tokenRatesControllerHandler)
    resetStore(prefsController.billboardStore, billboardHandler)
    resetStore(prefsController.store, prefsControllerHandler, { selectedAddress: '' })
    resetStore(prefsController.successStore, successMessageHandler)
    resetStore(prefsController.errorStore, errorMessageHandler)
    await walletConnectController.disconnect()
    resetStore(walletConnectController.store, walletConnectHandler, {})
    resetStore(txController.etherscanTxStore, etherscanTxHandler, [])
    resetStore(thresholdKeyController.store, tKeyHandler, {})
    clearInterval(thresholdKeyController.requestStatusCheckId)
    assetDetectionController.stopAssetDetection()
    torus.updateStaticData({ isUnlocked: false })
  },
  setSelectedCurrency({ commit }, payload) {
    torusController.setCurrentCurrency(payload, (error, data) => {
      if (error) log.error('currency fetch failed')
      else commit('setCurrencyData', data)
    })
  },
  async forceFetchTokens({ state }) {
    detectTokensController.refreshTokenBalances()
    assetDetectionController.restartAssetDetection()
    const { selectedAddress } = state
    try {
      const response = await prefsController.getEtherScanTokenBalances(selectedAddress)
      const { data } = response
      detectTokensController.detectEtherscanTokenBalance(data, selectedAddress)
    } catch {
      log.error('etherscan balance fetch failed')
    }
  },
  async showProviderChangePopup({ dispatch, state }, payload) {
    const { override, preopenInstanceId } = payload

    if (override) {
      setTimeout(() => {
        dispatch('setProviderType', payload).then(handleProviderChangeSuccess).catch(handleProviderChangeDeny)
      }, 500)
      return
    }
    try {
      const windowId = randomId()
      const channelName = `torus_provider_change_channel_${windowId}`
      const finalUrl = `${baseRoute}providerchange?integrity=true&instanceId=${windowId}`
      const providerChangeWindow = new PopupWithBcHandler({
        url: finalUrl,
        preopenInstanceId,
        target: '_blank',
        features: FEATURES_PROVIDER_CHANGE_WINDOW,
        channelName,
      })
      const result = await providerChangeWindow.handleWithHandshake({
        payload: {
          origin: getIFrameOriginObject(),
          payload,
          currentNetwork: state.networkType,
          whiteLabel: state.whiteLabel,
          tKeyExists: state.tKeyExists,
        },
      })
      const { approve = false } = result
      if (approve) {
        await dispatch('setProviderType', payload)
        handleProviderChangeSuccess()
      } else {
        handleProviderChangeDeny('user denied provider change request')
      }
    } catch (error) {
      log.error(error)
      handleProviderChangeDeny('user denied provider change request')
    }
  },
  async showUserInfoRequestPopup({ dispatch, state }, payload) {
    const { preopenInstanceId } = payload
    log.info(preopenInstanceId, 'userinfo')
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
    try {
      const windowId = randomId()
      const channelName = `user_info_request_channel_${windowId}`
      const finalUrl = `${baseRoute}userinforequest?integrity=true&instanceId=${windowId}`
      const userInfoRequestWindow = new PopupWithBcHandler({
        url: finalUrl,
        preopenInstanceId,
        target: '_blank',
        features: FEATURES_PROVIDER_CHANGE_WINDOW,
        channelName,
      })
      const result = await userInfoRequestWindow.handleWithHandshake({
        payload: {
          origin: getIFrameOriginObject(),
          payload: { ...payload, typeOfLogin: state.userInfo.typeOfLogin },
          whiteLabel: state.whiteLabel,
        },
      })
      const { approve = false } = result
      if (approve) {
        handleSuccess()
      } else {
        handleDeny()
      }
    } catch (error) {
      log.error(error)
      handleDeny()
    }
  },
  showWalletPopup(context, payload) {
    const finalUrl = `${baseRoute}wallet${payload.path || ''}?integrity=true&instanceId=${torus.instanceId}`
    const walletWindow = new PopupHandler({ url: finalUrl, features: FEATURES_DEFAULT_WALLET_WINDOW })
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
  async finishImportAccount({ dispatch }, payload) {
    const { privKey } = payload
    const address = torus.generateAddressFromPrivKey(privKey)
    await dispatch('initTorusKeyring', {
      keys: [{ ethAddress: address, privKey, accountType: ACCOUNT_TYPE.IMPORTED }],
      calledFromEmbed: false,
      rehydrate: false,
    })
    dispatch('updateSelectedAddress', { selectedAddress: address })
    return privKey
  },
  addWallet(context, payload) {
    if (payload.ethAddress) {
      context.commit('setWallet', {
        ...context.state.wallet,
        [payload.ethAddress]: { privateKey: payload.privKey, accountType: payload.accountType || ACCOUNT_TYPE.NORMAL },
      })
    }
  },
  updateUserInfoAccess({ commit }, payload) {
    if (payload.approved) commit('setUserInfoAccess', USER_INFO_REQUEST_APPROVED)
    else commit('setUserInfoAccess', USER_INFO_REQUEST_REJECTED)
  },
  updateSelectedAddress(_, payload) {
    torus.updateStaticData({ selectedAddress: payload.selectedAddress })
    torusController.setSelectedAccount(payload.selectedAddress)
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
  async triggerLogin({ dispatch, commit, state }, { calledFromEmbed, verifier, preopenInstanceId }) {
    try {
      // This is to maintain backward compatibility
      const currentVeriferConfig = state.embedState.loginConfig[verifier]
      const locale = vuetify.framework.lang.current
      if (!currentVeriferConfig) throw new Error('Invalid verifier')
      const { typeOfLogin, clientId, jwtParameters } = currentVeriferConfig
      const loginHandler = createHandler({
        typeOfLogin,
        clientId,
        verifier,
        redirect_uri: config.redirect_uri,
        preopenInstanceId,
        jwtParameters: deepmerge(
          {
            ui_locales: locale,
            languageDictionary: JSON.stringify({
              title: vuetify.framework.lang.t('$vuetify.walletHome.auth0Title') || '',
              error: {
                passwordless: {
                  invalid_user_password: vuetify.framework.lang.t('$vuetify.login.invalid_user_password') || '',
                },
              },
            }),
          },
          jwtParameters || {}
        ),
      })
      const loginParameters = await loginHandler.handleLoginWindow()
      const { accessToken, idToken } = loginParameters
      const userInfo = await loginHandler.getUserInfo(loginParameters)
      const { profileImage, name, email, verifierId, typeOfLogin: returnTypeOfLogin } = userInfo
      commit('setUserInfo', {
        profileImage,
        name,
        email,
        verifierId,
        verifier,
        verifierParams: { verifier_id: verifierId },
        typeOfLogin: returnTypeOfLogin,
      })
      await dispatch('handleLogin', { calledFromEmbed, oAuthToken: idToken || accessToken })
    } catch (error) {
      log.error(error)
      oauthStream.write({ err: { message: error.message } })
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

    prefsController.successStore.subscribe(successMessageHandler)
    prefsController.errorStore.subscribe(errorMessageHandler)
    prefsController.billboardStore.subscribe(billboardHandler)
    prefsController.store.subscribe(prefsControllerHandler)
    txController.etherscanTxStore.subscribe(etherscanTxHandler)
    thresholdKeyController.store.subscribe(tKeyHandler)
    walletConnectController.store.subscribe(walletConnectHandler)
  },
  async initTorusKeyring({ dispatch, commit, state }, payload) {
    const { keys, calledFromEmbed, rehydrate, postboxAddress } = payload
    await torusController.initTorusKeyring(
      keys.map((x) => x.privKey),
      keys.map((x) => x.ethAddress)
    )

    return Promise.all(
      keys.map((x) => {
        dispatch('addWallet', x) // synchronous
        return prefsController.init({
          address: x.ethAddress,
          calledFromEmbed,
          userInfo: state.userInfo,
          rehydrate,
          dispatch,
          commit,
          jwtToken: x.jwtToken,
          accountType: x.accountType,
          postboxAddress,
        })
      })
    )
  },
  async handleLogin({ state, dispatch, commit }, { calledFromEmbed, oAuthToken }) {
    // The error in this is caught above
    const {
      userInfo: { verifierId, verifier, verifierParams },
    } = state
    const oAuthKey = await dispatch('getTorusKey', { verifier, verifierId, verifierParams, oAuthToken })
    log.info('key 1', oAuthKey)
    dispatch('subscribeToControllers')
    const defaultAddresses = await dispatch('initTorusKeyring', {
      keys: [{ ...oAuthKey, accountType: ACCOUNT_TYPE.NORMAL }],
      calledFromEmbed,
      rehydrate: false,
    })

    await dispatch('calculatePostboxKey', { oAuthToken })
    // Threshold Bak region
    // Check if tkey exists
    const keyExists = await thresholdKeyController.checkIfTKeyExists(state.postboxKey.privateKey)
    // if in iframe && keyExists, initialize tkey only if it's set as default address
    // if not in iframe && keyExists, initialize tkey always
    // inside an iframe
    commit('setTkeyExists', keyExists)
    if (keyExists) {
      if (!isMain) {
        if (defaultAddresses[0] && defaultAddresses[0] !== oAuthKey.ethAddress) {
          // Do tkey
          defaultAddresses.push(...(await dispatch('addTKey', { calledFromEmbed })))
        }
      } else {
        // In app.tor.us
        defaultAddresses.push(...(await dispatch('addTKey', { calledFromEmbed })))
      }
    }

    const selectedDefaultAddress = defaultAddresses[0] || defaultAddresses[1]
    const selectedAddress = Object.keys(state.wallet).includes(selectedDefaultAddress) ? selectedDefaultAddress : oAuthKey.ethAddress
    dispatch('updateSelectedAddress', { selectedAddress }) // synchronous
    prefsController.getBillboardContents()
    // continue enable function
    if (calledFromEmbed) {
      setTimeout(() => {
        oauthStream.write({ selectedAddress })
        commit('setOAuthModalStatus', false)
      }, 50)
    }
    // TODO: deprecate rehydrate false for the next major version bump
    statusStream.write({ loggedIn: true, rehydrate: false, verifier })
    torus.updateStaticData({ isUnlocked: true })
    dispatch('cleanupOAuth', { oAuthToken })
  },
  async getTorusKey(_, { verifier, verifierId, verifierParams, oAuthToken }) {
    if (!verifier) throw new Error('Verifier is required')
    const { torusNodeEndpoints, torusNodePub, torusIndexes } = await torus.nodeDetailManager.getNodeDetails()
    const publicAddress = await torus.getPublicAddress(torusNodeEndpoints, torusNodePub, { verifier, verifierId })
    log.info('New private key assigned to user at address ', publicAddress)
    const torusKey = await torus.retrieveShares(torusNodeEndpoints, torusIndexes, verifier, verifierParams, oAuthToken)
    if (publicAddress.toLowerCase() !== torusKey.ethAddress.toLowerCase()) throw new Error('Invalid Key')
    return torusKey
  },
  cleanupOAuth({ state }, payload) {
    const {
      userInfo: { typeOfLogin },
    } = state
    const { oAuthToken } = payload
    if (typeOfLogin === FACEBOOK) {
      remove(`https://graph.facebook.com/me/permissions?access_token=${oAuthToken}`)
        .then((resp) => log.info(resp))
        .catch((error) => log.error(error))
    } else if (typeOfLogin === DISCORD) {
      prefsController.revokeDiscord(oAuthToken)
    }
  },
  async rehydrate({ state, dispatch, commit }) {
    const {
      selectedAddress,
      wallet,
      networkType,
      networkId,
      jwtToken,
      userInfo: { verifier },
      tKeyStore,
      wcConnectorSession,
    } = state
    try {
      // if jwtToken expires, logout
      // if (jwtToken) {
      //   const decoded = jwtDecode(jwtToken)
      //   if (Date.now() / 1000 > decoded.exp) {
      //     dispatch('logOut')
      //     return
      //   }
      //   setTimeout(() => {
      //     dispatch('logOut')
      //   }, decoded.exp * 1000 - Date.now())
      // }
      if (SUPPORTED_NETWORK_TYPES[networkType.host]) await dispatch('setProviderType', { network: networkType })
      else await dispatch('setProviderType', { network: networkType, type: RPC })
      const walletKeys = Object.keys(wallet)
      dispatch('subscribeToControllers')
      await dispatch('initTorusKeyring', {
        keys: walletKeys.map((x) => {
          const { privateKey, accountType } = wallet[x]
          return {
            ethAddress: x,
            privKey: privateKey,
            accountType,
            jwtToken: jwtToken[x],
          }
        }),
        calledFromEmbed: false,
        rehydrate: true,
      })
      if (Object.keys(tKeyStore).length > 0) {
        const postboxWallet = state.postboxKey
        if (postboxWallet && tKeyStore.tKey) await thresholdKeyController.rehydrate(postboxWallet?.privateKey, tKeyStore.tKey)
      }
      if (selectedAddress && wallet[selectedAddress]) {
        dispatch('updateSelectedAddress', { selectedAddress }) // synchronous
        dispatch('updateNetworkId', { networkId })
        // TODO: deprecate rehydrate true for the next major version bump
        statusStream.write({ loggedIn: true, rehydrate: true, verifier })
        if (Object.keys(wcConnectorSession).length > 0) dispatch('initWalletConnect', { session: wcConnectorSession })
        log.info('rehydrated wallet')
        torus.updateStaticData({ isUnlocked: true })
      }
      commit('setRehydrationStatus', true)
    } catch (error) {
      log.error('Failed to rehydrate', error)
    }
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
  initWalletConnect(_, payload) {
    return walletConnectController.init(payload)
  },
  disconnectWalletConnect(_, __) {
    return walletConnectController.disconnect()
  },
}
