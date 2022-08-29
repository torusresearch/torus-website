import randomId from '@chaitanyapotti/random-id'
import deepmerge from 'deepmerge'
import { BN, privateToAddress } from 'ethereumjs-util'
import { cloneDeep } from 'lodash'
// import jwtDecode from 'jwt-decode'
import log from 'loglevel'
import { isHexStrict } from 'web3-utils'

import config from '../config'
import { OpenLoginHandler, OpenLoginWindowHandler } from '../handlers/Auth'
import PopupHandler from '../handlers/Popup/PopupHandler'
import PopupWithBcHandler from '../handlers/Popup/PopupWithBcHandler'
// import vuetify from '../plugins/vuetify'
import router from '../router'
import torus from '../torus'
import accountImporter from '../utils/accountImporter'
import {
  ACCOUNT_TYPE,
  CHAIN_ID_TO_TYPE_MAP,
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
  unapprovedAssetMsgsHandler,
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
  watchAssetManager,
} = torusController || {}

// stream to send logged in status
const { communicationMux = { getStream: () => fakeStream } } = torus || {}
const statusStream = communicationMux.getStream('status')
const oauthStream = communicationMux.getStream('oauth')
const userInfoStream = communicationMux.getStream('user_info')
const providerChangeStream = communicationMux.getStream('provider_change')
const widgetStream = communicationMux.getStream('widget')
const windowStream = communicationMux.getStream('window')
const loginWithPrivateKeyStream = communicationMux.getStream('login_with_private_key')
const walletConnectStream = communicationMux.getStream('wallet_connect_stream')

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
  if (initState) store.putState(cloneDeep(initState))
  store.unsubscribe(handler)
}

export default {
  async logOut({ commit, state }, _) {
    const { selectedAddress } = state
    commit('logOut', {
      ...initialState,
      networkType: state.networkType,
      customNetworks: state.customNetworks,
      networkId: state.networkId,
      whiteLabel: state.whiteLabel,
      theme: state.theme,
      embedState: cloneDeep(state.embedState || {}),
    })

    resetStore(prefsController.store, prefsControllerHandler, { selectedAddress: '' })
    torusController.lock()

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
    resetStore(prefsController.successStore, successMessageHandler)
    resetStore(prefsController.errorStore, errorMessageHandler)
    resetStore(prefsController.announcementsStore, announcemenstHandler)
    await walletConnectController.disconnect()
    resetStore(walletConnectController.store, walletConnectHandler, {})
    resetStore(txController.etherscanTxStore, etherscanTxHandler, [])
    resetStore(encryptionPublicKeyManager.store, encryptionPublicKeyHandler)
    resetStore(decryptMessageManager.store, unapprovedDecryptMsgsHandler)
    resetStore(watchAssetManager.store, unapprovedAssetMsgsHandler)
    assetDetectionController.stopAssetDetection()
    // torus.updateStaticData({ isUnlocked: false })
    if (isMain && selectedAddress) {
      router.push({ path: '/logout' }).catch(() => {})
      try {
        const openLoginHandler = OpenLoginHandler.getInstance()
        await openLoginHandler.invalidateSession()
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
  async handleLoginWithPrivateKey({ dispatch, commit }, { privateKey, userInfo }) {
    dispatch('subscribeToControllers')
    commit('setUserInfo', userInfo)

    const defaultAddresses = await dispatch('initTorusKeyring', {
      keys: [
        {
          privKey: privateKey,
          ethAddress: `0x${privateToAddress(Buffer.from(privateKey, 'hex')).toString('hex')}`,
        },
      ],
    })

    const selectedAddress = defaultAddresses[0]

    if (!selectedAddress) {
      loginWithPrivateKeyStream.write({
        name: 'login_with_private_key_response',
        data: {
          success: false,
          error: 'No Accounts available',
        },
      })
      dispatch('logOut')
      throw new Error('No Accounts available')
    }

    dispatch('updateSelectedAddress', { selectedAddress }) // synchronous
    prefsController.getBillboardContents()
    prefsController.getAnnouncementsContents()
    // TODO: deprecate rehydrate false for the next major version bump
    statusStream.write({ loggedIn: true, rehydrate: false, verifier: userInfo.verifier })
    loginWithPrivateKeyStream.write({
      name: 'login_with_private_key_response',
      data: {
        success: true,
      },
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
    // torus.updateStaticData({ selectedAddress: payload.selectedAddress })
    torusController.setSelectedAccount(payload.selectedAddress)
  },
  updateNetworkId(context, payload) {
    context.commit('setNetworkId', payload.networkId)
    // torus.updateStaticData({ networkId: payload.networkId })
  },
  async setProviderType({ commit, dispatch, getters, state }, payload) {
    let networkType = payload.network
    let isSupportedNetwork = false
    const activeChainId = networkType.chainId && (isHexStrict(networkType.chainId) ? networkType.chainId : `0x${networkType.chainId.toString(16)}`)
    const chainIdConfig = CHAIN_ID_TO_TYPE_MAP[activeChainId]
    if (chainIdConfig) {
      const networkConfig = getters.supportedNetworks[chainIdConfig.name]
      networkType = { ...networkConfig, ...networkType }
    }
    if (getters.supportedNetworks[networkType.host]) {
      networkType = { ...getters.supportedNetworks[networkType.host], ...networkType }
      isSupportedNetwork = true
    }
    const currentTicker = networkType.ticker || 'ETH'
    if (payload.type && payload.type === RPC && !isSupportedNetwork) {
      const networkId = await torusController.setCustomRpc(networkType.host, networkType.chainId || 1, currentTicker, networkType.networkName || '', {
        blockExplorerUrl: networkType.blockExplorer,
      })
      if (networkId) {
        networkType.id = networkId
        commit('setNetworkType', networkType)
      }
      return null
    }
    commit('setNetworkType', networkType)
    await networkController.setProviderType(networkType.host, networkType.rpcUrl || networkType.host, networkType.ticker, networkType.networkName)
    if (!config.supportedCurrencies.includes(state.selectedCurrency) && networkType.ticker !== state.selectedCurrency)
      await dispatch('setSelectedCurrency', { selectedCurrency: networkType.ticker, origin: 'home' })
    else await dispatch('setSelectedCurrency', { selectedCurrency: state.selectedCurrency, origin: 'store' })

    // Set custom currency
    if (getters.supportedCurrencies.includes(networkType.ticker) && networkType.ticker !== state.selectedCurrency)
      await commit('setCustomCurrency', networkType.ticker)
    return undefined
  },
  async deleteCustomNetwork({ _commit }, id) {
    if (id) {
      return torusController.deleteCustomRpc(id)
    }
    return undefined
  },
  async updateCustomNetwork({ state, commit }, network) {
    if (network) {
      if (state.networkType.id === network.id) {
        commit('setNetworkType', network)
      }
      return torusController.updateCustomRpc(network)
    }
    return undefined
  },
  async triggerLogin({ dispatch, commit, state }, { calledFromEmbed, verifier, preopenInstanceId, login_hint }) {
    try {
      commit('setLoginInProgress', true)
      // This is to maintain backward compatibility
      const currentVerifierConfig = state.embedState.loginConfig[verifier]
      const { whiteLabel } = state
      // const locale = vuetify.framework.lang.current
      if (!currentVerifierConfig) throw new Error('Invalid verifier config')
      const { jwtParameters } = currentVerifierConfig
      log.info('starting login', { calledFromEmbed, verifier, preopenInstanceId, login_hint })
      const loginHandler = new OpenLoginWindowHandler({
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
        mfaLevel: state.embedState.mfaLevel,
        loginConfigItem: currentVerifierConfig,
        origin: getIFrameOriginObject(),
      })
      const { keys, userInfo, postboxKey, userDapps, error, sessionId } = await loginHandler.handleLoginWindow()
      if (error) {
        throw new Error(error)
      }
      // Get all open login results
      userInfo.verifier = verifier
      if (sessionId && config.localStorageAvailable) {
        const openLoginStore = localStorage.getItem('openlogin_store')
        const finalStore = { ...(openLoginStore ? JSON.parse(openLoginStore) : {}), sessionId }
        localStorage.setItem('openlogin_store', JSON.stringify(finalStore))
      }
      commit('setUserInfo', userInfo)
      commit('setPostboxKey', postboxKey)
      commit('setUserDapps', userDapps)
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
  async autoLogin({ commit, dispatch, state }, { calledFromEmbed }) {
    const openLoginHandler = OpenLoginHandler.getInstance()
    const { keys, postboxKey } = openLoginHandler.getKeysInfo()
    const userInfo = openLoginHandler.getUserInfo()
    commit('setUserInfo', userInfo)
    commit('setPostboxKey', postboxKey)
    dispatch('getUserDapps', { postboxKey, calledFromEmbed })
    await dispatch('initTorusKeyring', {
      calledFromEmbed,
      oAuthToken: userInfo.idToken || userInfo.accessToken,
      keys: keys.map((x) => ({
        ethAddress: x.ethAddress,
        privKey: x.privKey,
        accountType: x.accountType,
        jwtToken: state.jwtToken[x.ethAddress],
      })),
      rehydrate: true,
    })
  },
  async getUserDapps({ commit, dispatch, state }, { postboxKey, calledFromEmbed }) {
    const openLoginHandler = OpenLoginHandler.getInstance()
    const { userDapps, keys } = await openLoginHandler.getUserDapps(postboxKey)
    commit('setUserDapps', userDapps)
    await dispatch('initTorusKeyring', {
      calledFromEmbed,
      rehydrate: true,
      keys: keys.map((x) => ({
        ethAddress: x.ethAddress,
        privKey: x.privKey,
        accountType: x.accountType,
        jwtToken: state.jwtToken[x.ethAddress],
      })),
    })
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
    watchAssetManager.store.subscribe(unapprovedAssetMsgsHandler)
  },
  async initTorusKeyring({ dispatch, commit, getters, state }, payload) {
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
          customCurrency: state.customCurrency,
          supportedCurrencies: getters.supportedCurrencies,
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
    // torus.updateStaticData({ isUnlocked: true })
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
    const { networkType, networkId, wcConnectorSession, selectedAddress } = state
    try {
      const currentRoute = router.match(window.location.pathname)
      if (!currentRoute.meta.skipOpenLoginCheck) {
        const openLoginHandler = OpenLoginHandler.getInstance()
        const sessionInfo = await openLoginHandler.getActiveSession()
        // log.info(sessionInfo, 'current session info')
        if (sessionInfo && (sessionInfo.walletKey || sessionInfo.tKey)) {
          // already logged in
          // call autoLogin
          log.info('auto-login with openlogin session')
          await dispatch('autoLogin', { calledFromEmbed: !isMain })
          if (currentRoute.name !== 'popup' && currentRoute.meta.requiresAuth === false) {
            const noRedirectQuery = Object.fromEntries(new URLSearchParams(window.location.search))
            const { redirect } = noRedirectQuery
            delete noRedirectQuery.redirect
            router.push({ path: redirect || '/wallet', query: noRedirectQuery, hash: window.location.hash }).catch((_) => {})
          }
        } else {
          log.info('no openlogin session')
        }
      }

      if (SUPPORTED_NETWORK_TYPES[networkType.host]) await dispatch('setProviderType', { network: networkType })
      else await dispatch('setProviderType', { network: networkType, type: RPC })
      dispatch('subscribeToControllers')

      if (selectedAddress && state.wallet[selectedAddress]) {
        dispatch('updateSelectedAddress', { selectedAddress }) // synchronous
        dispatch('updateNetworkId', { networkId })
        // TODO: deprecate rehydrate true for the next major version bump
        statusStream.write({ loggedIn: true, rehydrate: true, verifier: state.userInfo.verifier })
        if (Object.keys(wcConnectorSession).length > 0) dispatch('initWalletConnect', { session: wcConnectorSession })
        log.info('rehydrated wallet')
        // torus.updateStaticData({ isUnlocked: true })
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
  getWalletConnectedApp(_, __) {
    return walletConnectController.getPeerMetaURL()
  },
  decryptMessage(_, payload) {
    return torusController.decryptMessageInline(payload)
  },
  updateNetworkDetails(context, payload) {
    context.commit('setNetworkDetails', payload.networkDetails)
  },
  updateGasFees(context, payload) {
    context.commit('setGasFees', payload.gasFees)
  },
  handleShowWalletConnectReq({ commit }) {
    log.debug('handleShowWalletConnectReq')
    commit('setShowWalletConnect', true)
  },
  sendWalletConnectResponse({ commit }, { success, errorMessage }) {
    commit('setShowWalletConnect', false)
    if (success) {
      walletConnectStream.write({
        name: 'wallet_connect_stream_res',
        data: {
          success,
        },
      })
    } else {
      walletConnectStream.write({
        name: 'wallet_connect_stream_res',
        data: {
          success,
          error: errorMessage || 'Something went wrong',
        },
      })
    }
  },
}
