import randomId from '@chaitanyapotti/random-id'
import { PublicKey } from '@solana/web3.js'
import { BroadcastChannel } from 'broadcast-channel'
import clone from 'clone'
import deepmerge from 'deepmerge'
import jwtDecode from 'jwt-decode'
import log from 'loglevel'
import nacl from 'tweetnacl'
import { fromWei, isAddress, toBN, toChecksumAddress } from 'web3-utils'

import config from '../config'
import vuetify from '../plugins/vuetify'
import torus from '../torus'
import accountImporter from '../utils/accountImporter'
import {
  COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM,
  DISCORD,
  FACEBOOK,
  RPC,
  SUPPORTED_NETWORK_TYPES,
  TOKEN_METHOD_TRANSFER_FROM,
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
  etherscanTxHandler,
  messageManagerHandler,
  metadataHandler,
  pastTransactionsHandler,
  paymentTxHandler,
  personalMessageManagerHandler,
  prefsControllerHandler,
  successMsgHandler as successMessageHandler,
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
    resetStore(prefsController.store, prefsControllerHandler, prefsController.initState)
    resetStore(prefsController.successStore, successMessageHandler)
    resetStore(prefsController.errorStore, errorMessageHandler)
    resetStore(prefsController.paymentTxStore, paymentTxHandler, [])
    resetStore(prefsController.pastTransactionsStore, pastTransactionsHandler, [])
    resetStore(txController.etherscanTxStore, etherscanTxHandler, [])
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
  showSolanaPopup({ state }, payload) {
    return new Promise((resolve, reject) => {
      const { preopenInstanceId = randomId() } = payload
      log.info(payload, 'solana payload')
      const bc = new BroadcastChannel(`torus_solana_channel_${preopenInstanceId}`, broadcastChannelOptions)
      const finalUrl = `${baseRoute}solanaapprove?integrity=true&instanceId=${preopenInstanceId}`
      const solanaWindow = new PopupHandler({
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
            },
          })
        } else if (type === 'solana-result') {
          try {
            log.info('solana result', approve)
            if (approve) {
              // await dispatch('setProviderType', payload)
              const signature = nacl.sign.detached(payload, Buffer.from(state.wallet[state.selectedAddress], 'hex'))
              resolve({
                success: true,
                signature,
                publicKey: state.solanaPublicKey,
              })
            } else {
              reject(new Error('user denied solana request'))
            }
          } catch (error) {
            reject(error)
          } finally {
            bc.close()
            solanaWindow.close()
          }
        }
      })

      solanaWindow.open()
      solanaWindow.once('close', () => {
        bc.close()
        reject(new Error('user denied solana request'))
      })
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
    context.commit('setSolanaPublicKey', new PublicKey(Buffer.from(payload.privKey, 'hex')).toString())
  },
  updateUserInfoAccess({ commit }, payload) {
    if (payload.approved) commit('setUserInfoAccess', USER_INFO_REQUEST_APPROVED)
    else commit('setUserInfoAccess', USER_INFO_REQUEST_REJECTED)
  },
  updateSelectedAddress({ state }, payload) {
    torus.updateStaticData({ selectedAddress: payload.selectedAddress })
    torus.updateStaticData({ solanaPublicAddress: state.solanaPublicKey })
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
    prefsController.store.subscribe(prefsControllerHandler)
    prefsController.successStore.subscribe(successMessageHandler)
    prefsController.errorStore.subscribe(errorMessageHandler)
    prefsController.paymentTxStore.subscribe(paymentTxHandler)
    prefsController.pastTransactionsStore.subscribe(pastTransactionsHandler)
    txController.etherscanTxStore.subscribe(etherscanTxHandler)
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
  async processAuthMessage({ commit, dispatch }, payload) {
    try {
      const { message, selectedAddress, calledFromEmbed } = payload
      const hashedMessage = torus.hashMessage(message)
      const signedMessage = await torus.torusController.keyringController.signMessage(selectedAddress, hashedMessage)
      const response = await post(
        `${config.api}/auth/verify`,
        {
          public_address: selectedAddress,
          signed_message: signedMessage,
        },
        {},
        { useAPIKey: true }
      )
      commit('setJwtToken', response.token)
      // prefsController.jwtToken = response.token
      if (response.token) {
        const decoded = jwtDecode(response.token)
        setTimeout(() => {
          dispatch('logOut')
        }, decoded.exp * 1000 - Date.now())
      }
      await dispatch('setUserInfoAction', { token: response.token, calledFromEmbed, rehydrate: false, selectedAddress })
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
      const { userInfo, selectedCurrency, theme } = state
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
            dispatch('updateSelectedAddress', { selectedAddress: payload.selectedAddress }) // synchronous
            resolve()
          }
        },
        async () => {
          await prefsController.createUser(selectedCurrency, theme, verifier, verifierId)
          commit('setNewUser', true)
          dispatch('setSelectedCurrency', { selectedCurrency: state.selectedCurrency, origin: 'store' })
          prefsController.storeUserLogin(verifier, verifierId, { calledFromEmbed, rehydrate })
          dispatch('updateSelectedAddress', { selectedAddress: payload.selectedAddress }) // synchronous
          resolve()
        }
      )
    })
  },
  async rehydrate({ state, dispatch, commit }) {
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
        await dispatch('setUserInfoAction', { token: jwtToken, calledFromEmbed: false, rehydrate: true, selectedAddress })
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
  updateCalculatedTx({ state, getters }, payload) {
    for (const id in payload) {
      const txOld = payload[id]
      if (txOld.metamaskNetworkId.toString() === state.networkId.toString() && txOld.status === 'submitted' && id >= 0) {
        const { methodParams, contractParams, txParams, transactionCategory, time, hash, status } = txOld
        let amountTo
        let amountValue
        let assetName
        let totalAmount
        let finalTo
        let tokenRate = 1
        let type
        let typeName
        let typeImageLink
        let symbol

        if (contractParams.erc721) {
          // Handling cryptokitties
          if (contractParams.isSpecial) {
            ;[amountTo, amountValue] = methodParams || []
          } else {
            // Rest of the 721s
            ;[, amountTo, amountValue] = methodParams || []
          }
          const { name = '', logo } = contractParams
          // Get asset name of the 721
          const selectedAddressAssets = state.assets[state.selectedAddress]
          if (selectedAddressAssets) {
            const contract = selectedAddressAssets.find((x) => x.name.toLowerCase() === name.toLowerCase()) || {}
            log.info(contract, amountValue)
            if (contract) {
              const { name: foundAssetName } = contract.assets.find((x) => x.tokenId.toString() === amountValue.value.toString()) || {}
              assetName = foundAssetName || ''
              symbol = assetName
              type = 'erc721'
              typeName = name
              typeImageLink = logo
              totalAmount = fromWei(toBN(txParams.value || 0))
              finalTo = amountTo && isAddress(amountTo.value) && toChecksumAddress(amountTo.value)
            }
          } else {
            tokenRate = 1
            symbol = 'ETH'
            type = 'eth'
            typeName = 'eth'
            typeImageLink = 'n/a'
            totalAmount = fromWei(toBN(txParams.value || 0))
            finalTo = toChecksumAddress(txParams.to)
          }
        } else if (contractParams.erc20) {
          // ERC20 transfer
          tokenRate = state.tokenRates[txParams.to]
          if (methodParams && Array.isArray(methodParams)) {
            if (transactionCategory === TOKEN_METHOD_TRANSFER_FROM || transactionCategory === COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM) {
              ;[, amountTo, amountValue] = methodParams || []
            } else {
              ;[amountTo, amountValue] = methodParams || []
            }
          }
          const { symbol: contractSymbol, name, logo } = contractParams
          symbol = contractSymbol
          type = 'erc20'
          typeName = name
          typeImageLink = logo
          totalAmount = fromWei(toBN(amountValue && amountValue.value ? amountValue.value : txParams.value || 0))
          finalTo = amountTo && isAddress(amountTo.value) && toChecksumAddress(amountTo.value)
        } else {
          tokenRate = 1
          symbol = 'ETH'
          type = 'eth'
          typeName = 'eth'
          typeImageLink = 'n/a'
          totalAmount = fromWei(toBN(txParams.value || 0))
          finalTo = toChecksumAddress(txParams.to)
        }
        // Goes to db
        const txObject = {
          created_at: new Date(time),
          from: toChecksumAddress(txParams.from),
          to: finalTo,
          total_amount: totalAmount,
          gas: txParams.gas,
          gasPrice: txParams.gasPrice,
          symbol,
          nonce: txParams.nonce,
          type,
          type_name: typeName,
          type_image_link: typeImageLink,
          currency_amount: (getters.currencyMultiplier * Number.parseFloat(totalAmount) * tokenRate).toString(),
          selected_currency: state.selectedCurrency,
          status,
          network: state.networkType.host,
          transaction_hash: hash,
          transaction_category: transactionCategory,
        }
        prefsController.patchNewTx(txObject)
      }
    }
  },
  setUserBadge(context, payload) {
    prefsController.setUserBadge(payload)
  },
}
