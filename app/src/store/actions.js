import { BroadcastChannel } from 'broadcast-channel'
import clone from 'clone'
import deepmerge from 'deepmerge'
// import jwtDecode from 'jwt-decode'
import log from 'loglevel'
import { toChecksumAddress } from 'web3-utils'

import config from '../config'
import vuetify from '../plugins/vuetify'
import torus from '../torus'
import accountImporter from '../utils/accountImporter'
import { ACCOUNT_TYPE, DISCORD, FACEBOOK, RPC, SUPPORTED_NETWORK_TYPES, USER_INFO_REQUEST_APPROVED, USER_INFO_REQUEST_REJECTED } from '../utils/enums'
import { remove } from '../utils/httpHelpers'
import PopupHandler from '../utils/PopupHandler'
import { broadcastChannelOptions, fakeStream, getIFrameOriginObject, isMain } from '../utils/utils'
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
} from './controllerSubscriptions'
import { HandlerFactory as createHandler } from './Handlers'
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
  logOut({ commit, state }, _) {
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
    resetStore(txController.etherscanTxStore, etherscanTxHandler, [])
    resetStore(thresholdKeyController.store, tKeyHandler, {})
    assetDetectionController.stopAssetDetection()
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
      const response = await prefsController.getEtherScanTokenBalances()
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
    } catch {
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
            whiteLabel: state.whiteLabel,
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
        } catch {
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
            payload: { ...payload, typeOfLogin: state.userInfo.typeOfLogin },
            whiteLabel: state.whiteLabel,
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
  },
  async initTorusKeyring({ dispatch, commit, state }, payload) {
    const { keys, calledFromEmbed, rehydrate } = payload
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
        })
      })
    )
  },
  async handleLogin({ state, dispatch, commit }, { calledFromEmbed, oAuthToken }) {
    // The error in this is caught above
    const {
      userInfo: { verifierId, verifier, verifierParams },
    } = state
    const { torusNodeEndpoints, torusNodePub, torusIndexes } = await torus.nodeDetailManager.getNodeDetails()
    const publicAddress = await torus.getPublicAddress(torusNodeEndpoints, torusNodePub, { verifier, verifierId })
    log.info('New private key assigned to user at address ', publicAddress)
    const postboxKey = await torus.retrieveShares(torusNodeEndpoints, torusIndexes, verifier, verifierParams, oAuthToken)
    if (publicAddress.toLowerCase() !== postboxKey.ethAddress.toLowerCase()) throw new Error('Invalid Key')
    log.info('key 1', postboxKey)
    dispatch('subscribeToControllers')
    const defaultAddresses = await dispatch('initTorusKeyring', {
      keys: [{ ...postboxKey, accountType: ACCOUNT_TYPE.NORMAL }],
      calledFromEmbed,
      rehydrate: false,
    })
    // Threshold Bak region
    // Check if tkey exists
    const keyExists = await thresholdKeyController.checkIfTKeyExists(postboxKey.privKey)
    // if in iframe && keyExists, initialize tkey only if it's set as default address
    // if not in iframe && keyExists, initialize tkey always
    // inside an iframe
    if (keyExists) {
      if (!isMain) {
        if (defaultAddresses[0] && defaultAddresses[0] !== postboxKey.ethAddress) {
          // Do tkey
          defaultAddresses.push(...(await dispatch('addTKey', { postboxKey, calledFromEmbed })))
        }
      } else {
        // In app.tor.us
        defaultAddresses.push(...(await dispatch('addTKey', { postboxKey, calledFromEmbed })))
      }
    }

    const selectedDefaultAddress = defaultAddresses[0] || defaultAddresses[1]
    const selectedAddress = Object.keys(state.wallet).includes(selectedDefaultAddress) ? selectedDefaultAddress : postboxKey.ethAddress
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
      if (selectedAddress && wallet[selectedAddress]) {
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
          const postboxWallet = walletKeys.find((x) => wallet[x].accountType === ACCOUNT_TYPE.NORMAL)
          await thresholdKeyController.rehydrate(wallet[postboxWallet]?.privateKey, tKeyStore.tKey)
        }
        dispatch('updateSelectedAddress', { selectedAddress }) // synchronous
        dispatch('updateNetworkId', { networkId })
        // TODO: deprecate rehydrate true for the next major version bump
        statusStream.write({ loggedIn: true, rehydrate: true, verifier })
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
}
