import randomId from '@chaitanyapotti/random-id'
import clone from 'clone'
import deepmerge from 'deepmerge'
import { BN } from 'ethereumjs-util'
// import jwtDecode from 'jwt-decode'
import log from 'loglevel'

import config from '../config'
import { HandlerFactory as createHandler } from '../handlers/Auth'
import PopupHandler from '../handlers/Popup/PopupHandler'
import PopupWithBcHandler from '../handlers/Popup/PopupWithBcHandler'
import { getOpenLoginInstance } from '../openlogin'
// import vuetify from '../plugins/vuetify'
import router from '../router'
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
  announcemenstHandler,
  assetControllerHandler,
  billboardHandler,
  detectTokensControllerHandler,
  encryptionPublicKeyHandler,
  errorMsgHandler as errorMessageHandler,
  etherscanTxHandler,
  messageManagerHandler,
  metadataHandler,
  personalMessageManagerHandler,
  prefsControllerHandler,
  successMsgHandler as successMessageHandler,
  tokenRatesControllerHandler,
  transactionControllerHandler,
  typedMessageManagerHandler,
  unapprovedDecryptMsgsHandler,
  walletConnectHandler,
} from './controllerSubscriptions'
import initialState from './state'

const { ec } = torus

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
  walletConnectController,
  encryptionPublicKeyManager,
  decryptMessageManager,
} = torusController || {}

// stream to send logged in status
const { communicationMux = { getStream: () => fakeStream } } = torus || {}
const statusStream = communicationMux.getStream('status')
const oauthStream = communicationMux.getStream('oauth')
const userInfoStream = communicationMux.getStream('user_info')
const providerChangeStream = communicationMux.getStream('provider_change')
const widgetStream = communicationMux.getStream('widget')
const windowStream = communicationMux.getStream('window')

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
    const { selectedAddress } = state
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
    resetStore(prefsController.announcementsStore, announcemenstHandler)
    await walletConnectController.disconnect()
    resetStore(walletConnectController.store, walletConnectHandler, {})
    resetStore(txController.etherscanTxStore, etherscanTxHandler, [])
    resetStore(encryptionPublicKeyManager.store, encryptionPublicKeyHandler)
    resetStore(decryptMessageManager.store, unapprovedDecryptMsgsHandler)
    assetDetectionController.stopAssetDetection()
    torus.updateStaticData({ isUnlocked: false })
    if (isMain && selectedAddress) {
      router.push({ path: '/logout' }).catch(() => {})
      try {
        const openLoginInstance = await getOpenLoginInstance()
        if (openLoginInstance.state.support3PC) {
          await openLoginInstance._syncState(await openLoginInstance._getData())
          await openLoginInstance.logout({ clientId: config.openLoginClientId })
        }
      } catch (error) {
        log.warn(error, 'unable to logout with openlogin')
        window.location.href = '/'
      }
    }
  },
  setSelectedCurrency({ commit }, payload) {
    torusController.setCurrentCurrency(payload, (error, data) => {
      if (error) log.error('currency fetch failed')
      else commit('setCurrencyData', data)
    })
  },
  async setTorusKey({ state }, { prevAddress, newKey }) {
    const prevWallet = state.wallet[`0x${prevAddress}`]
    if (!prevWallet) {
      throw new Error(`could not find Torus wallet with address 0x${prevAddress}`)
    }
    const prevKey = prevWallet.privateKey
    let oldDiff = new BN(0)
    // if metadataNonce was previously set
    if (prevWallet.metadataNonceHex) {
      oldDiff = new BN(prevWallet.metadataNonceHex, 16)
    }
    const originalKey = new BN(prevKey, 16).sub(oldDiff).umod(ec.curve.n)
    const newDiff = new BN(newKey, 16).sub(new BN(originalKey, 16)).umod(ec.curve.n)
    return torus.setMetadata(torus.generateMetadataParams(newDiff.toString(16), originalKey))
  },
  async forceFetchTokens({ state }) {
    detectTokensController.refreshTokenBalances()
    assetDetectionController.restartAssetDetection()
    const { selectedAddress, networkType } = state
    try {
      const response = await prefsController.getCovalentTokenBalances(selectedAddress, networkType.chainId)
      const data = response?.data?.data?.items || []
      detectTokensController.detectCovalentTokenBalance(data, selectedAddress, networkType)
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
    const url = payload.path.includes('tkey') ? `${baseRoute}${payload.path || ''}` : `${baseRoute}wallet${payload.path || ''}`
    const finalUrl = `${url}?integrity=true&instanceId=${torus.instanceId}`
    const walletWindow = new PopupHandler({ url: finalUrl, features: FEATURES_DEFAULT_WALLET_WINDOW })
    walletWindow.open()
    if (walletWindow.window.blur) walletWindow.window.blur()
    if (walletWindow.window.focus) setTimeout(walletWindow.window.focus(), 0)
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
        [payload.ethAddress]: {
          privateKey: payload.privKey,
          accountType: payload.accountType || ACCOUNT_TYPE.NORMAL,
          seedPhrase: payload.seedPhrase,
          metadataNonceHex: payload.metadataNonce?.toString(16),
        },
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
  async setProviderType({ commit, dispatch, state }, payload) {
    let networkType = payload.network
    let isSupportedNetwork = false
    if (SUPPORTED_NETWORK_TYPES[networkType.host]) {
      networkType = SUPPORTED_NETWORK_TYPES[networkType.host]
      isSupportedNetwork = true
    }
    const currentTicker = networkType.ticker || 'ETH'
    commit('setNetworkType', networkType)
    if ((payload.type && payload.type === RPC) || !isSupportedNetwork) {
      return torusController.setCustomRpc(networkType.host, networkType.chainId || 1, currentTicker, networkType.networkName || '', {
        blockExplorerUrl: networkType.blockExplorer,
      })
    }
    await networkController.setProviderType(networkType.host)
    if (!config.supportedCurrencies.includes(state.selectedCurrency) && networkType.ticker !== state.selectedCurrency)
      await dispatch('setSelectedCurrency', { selectedCurrency: networkType.ticker, origin: 'home' })
    else await dispatch('setSelectedCurrency', { selectedCurrency: state.selectedCurrency, origin: 'store' })
    return undefined
  },
  async triggerLogin({ dispatch, commit, state }, { calledFromEmbed, verifier, preopenInstanceId, login_hint }) {
    try {
      commit('setLoginInProgress', true)
      // This is to maintain backward compatibility
      const currentVeriferConfig = state.embedState.loginConfig[verifier]
      const { whiteLabel } = state
      // const locale = vuetify.framework.lang.current
      if (!currentVeriferConfig) throw new Error('Invalid verifier')
      const { typeOfLogin, clientId, jwtParameters } = currentVeriferConfig
      log.info('starting login', { calledFromEmbed, verifier, preopenInstanceId, login_hint })
      const loginHandler = createHandler({
        typeOfLogin,
        clientId,
        verifier,
        redirect_uri: config.redirect_uri,
        preopenInstanceId,
        jwtParameters: deepmerge(
          {
            login_hint,
            // ui_locales: locale,
            // languageDictionary: JSON.stringify({
            //   title: vuetify.framework.lang.t('$vuetify.walletHome.auth0Title') || '',
            //   error: {
            //     passwordless: {
            //       invalid_user_password: vuetify.framework.lang.t('$vuetify.login.invalid_user_password') || '',
            //     },
            //   },
            // }),
          },
          jwtParameters || {}
        ),
        skipTKey: state.embedState.skipTKey,
        whiteLabel,
      })
      const { keys, userInfo, postboxKey } = await loginHandler.handleLoginWindow()
      // Get all open login results
      userInfo.verifier = verifier
      commit('setUserInfo', userInfo)
      commit('setPostboxKey', postboxKey)
      await dispatch('handleLogin', {
        calledFromEmbed,
        oAuthToken: userInfo.idToken || userInfo.accessToken,
        keys,
      })
    } catch (error) {
      log.error(error)
      oauthStream.write({ err: { message: error.message } })
      commit('setOAuthModalStatus', false)
      if (preopenInstanceId)
        windowStream.write({
          preopenInstanceId,
          close: true,
        })
      throw error
    } finally {
      commit('setLoginInProgress', false)
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
    prefsController.announcementsStore.subscribe(announcemenstHandler)
    txController.etherscanTxStore.subscribe(etherscanTxHandler)
    walletConnectController.store.subscribe(walletConnectHandler)
    encryptionPublicKeyManager.store.subscribe(encryptionPublicKeyHandler)
    decryptMessageManager.store.subscribe(unapprovedDecryptMsgsHandler)
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
  async handleLogin({ state, dispatch, commit }, { calledFromEmbed, oAuthToken, keys }) {
    // The error in this is caught above
    const {
      userInfo: { verifier },
    } = state

    dispatch('subscribeToControllers')

    const defaultAddresses = await dispatch('initTorusKeyring', {
      keys,
      calledFromEmbed,
      rehydrate: false,
    })

    const selectedDefaultAddress = defaultAddresses[0] || defaultAddresses[1]
    const selectedAddress = Object.keys(state.wallet).includes(selectedDefaultAddress) ? selectedDefaultAddress : Object.keys(state.wallet)[0]

    if (!selectedAddress) {
      dispatch('logOut')
      throw new Error('No Accounts available')
    }
    dispatch('updateSelectedAddress', { selectedAddress }) // synchronous
    prefsController.getBillboardContents()
    prefsController.getAnnouncementsContents()
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
  cleanupOAuth({ state }, payload) {
    const {
      userInfo: { typeOfLogin },
    } = state
    const { oAuthToken } = payload
    if (oAuthToken) {
      if (typeOfLogin === FACEBOOK) {
        remove(`https://graph.facebook.com/me/permissions?access_token=${oAuthToken}`)
          .then((resp) => log.info(resp))
          .catch((error) => log.error(error))
      } else if (typeOfLogin === DISCORD) {
        prefsController.revokeDiscord(oAuthToken)
      }
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
      wcConnectorSession,
    } = state
    try {
      if (SUPPORTED_NETWORK_TYPES[networkType.host]) await dispatch('setProviderType', { network: networkType })
      else await dispatch('setProviderType', { network: networkType, type: RPC })
      const walletKeys = Object.keys(wallet)
      dispatch('subscribeToControllers')
      await dispatch('initTorusKeyring', {
        keys: walletKeys.map((x) => {
          const { privateKey, accountType, seedPhrase } = wallet[x]
          return {
            ethAddress: x,
            privKey: privateKey,
            accountType,
            jwtToken: jwtToken[x],
            seedPhrase,
          }
        }),
        calledFromEmbed: false,
        rehydrate: true,
      })
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
  decryptMessage(_, payload) {
    return torusController.decryptMessageInline(payload)
  },
}
