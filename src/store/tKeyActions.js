import randomId from '@chaitanyapotti/random-id'
import log from 'loglevel'
import { keccak256 } from 'web3-utils'

import config from '../config'
import PopupWithBcHandler from '../handlers/Popup/PopupWithBcHandler'
import router from '../router'
import torus from '../torus'
import { ACCOUNT_TYPE, FEATURES_DEFAULT_POPUP_WINDOW, LINKED_VERIFIER_SUBIDENTIFIER } from '../utils/enums'
import { generateAddressFromPrivateKey, isMain } from '../utils/utils'

const { baseRoute } = config

const { torusController } = torus || {}
const { thresholdKeyController } = torusController || {}

export default {
  async addTKey({ dispatch, state, commit }, { calledFromEmbed }) {
    try {
      const finalKey = state.postboxKey
      const normalAccountAddress = Object.keys(state.wallet).find((x) => state.wallet[x].accountType === ACCOUNT_TYPE.NORMAL)
      let allKeys = await thresholdKeyController.login(finalKey.privateKey)
      if (config.onlySeedPhraseAccounts && allKeys.length > 0) {
        // don't use the first key
        allKeys = allKeys.filter((x) => x.accountType !== ACCOUNT_TYPE.THRESHOLD)
      }
      if (allKeys.length === 0) {
        commit('setIsTkeySeedPhraseInputRequired', true)
        log.error('No usable keys found')
        throw new Error('User has no account')
      }
      const thresholdKeys = allKeys.map((x) => ({
        ethAddress: generateAddressFromPrivateKey(x.privKey),
        ...x,
      }))
      log.info('tkey 2', thresholdKeys)
      return dispatch('initTorusKeyring', {
        keys: thresholdKeys,
        calledFromEmbed,
        rehydrate: false,
        postboxAddress: normalAccountAddress || finalKey.ethAddress,
      })
    } catch (error) {
      // tkey login failed. Allow normal google one to proceed through
      log.error(error)
      return []
    }
  },
  async createNewTKey({ state, dispatch, commit }, payload) {
    const { postboxKey } = state
    const normalAccountAddress = Object.keys(state.wallet).find((x) => state.wallet[x].accountType === ACCOUNT_TYPE.NORMAL)
    let allKeys = await thresholdKeyController.createNewTKey({ postboxKey: postboxKey.privateKey, ...payload })
    if (config.onlySeedPhraseAccounts && allKeys.length > 1) {
      // don't use the first key
      allKeys = allKeys.filter((x) => x.accountType !== ACCOUNT_TYPE.THRESHOLD)
    }
    const thresholdKeys = allKeys.map((x) => ({
      ethAddress: generateAddressFromPrivateKey(x.privKey),
      ...x,
    }))
    log.info('tkey 2', thresholdKeys)
    await dispatch('initTorusKeyring', {
      keys: thresholdKeys,
      calledFromEmbed: false,
      rehydrate: false,
      postboxAddress: normalAccountAddress || postboxKey.ethAddress,
    })
    commit('setTkeyExists', true)
    dispatch('updateSelectedAddress', { selectedAddress: thresholdKeys[0].ethAddress }) // synchronous
  },
  addPassword(_, payload) {
    return thresholdKeyController.addPassword(payload)
  },
  changePassword(_, payload) {
    return thresholdKeyController.changePassword(payload)
  },
  exportShare(_, payload) {
    return thresholdKeyController.exportShare(payload)
  },
  async showThresholdKeyUi({ state, dispatch }, payload) {
    const { type, data } = payload
    // data is store of thresholdkeycontroller
    log.info(data, type)
    if (isMain) router.push({ name: 'tKeyInput' })
    else {
      const windowId = randomId()
      const handleDeny = (error) => {
        log.info('Tkey input denied', error)
        dispatch('setTkeyInputFlow', { rejected: true })
      }
      const handleSuccess = (successData) => {
        log.info('tkey input success', successData)
        dispatch('setTkeyInputFlow', { response: JSON.parse(successData) })
      }
      try {
        const { loginConfig } = state.embedState
        const verifierName = loginConfig[state.userInfo.verifier].name
        const popupPayload = {
          verifierName,
          whiteLabel: state.whiteLabel,
          data: JSON.stringify(data),
          postboxKey: state.postboxKey?.privateKey,
        }
        const finalUrl = `${baseRoute}tkey/dapp-input?integrity=true&instanceId=${windowId}`
        const tKeyInputWindow = new PopupWithBcHandler({
          url: finalUrl,
          target: '_blank',
          features: FEATURES_DEFAULT_POPUP_WINDOW,
          channelName: `tkey_channel_${windowId}`,
        })
        const result = await tKeyInputWindow.handleWithHandshake({
          payload: popupPayload, // send tkey store
        })
        const { approve = false, data: resultData, error } = result
        if (approve) handleSuccess(resultData)
        else handleDeny(error)
      } catch (error) {
        log.error(error)
        handleDeny(error)
      }
    }
  },
  // setSecurityQuestionShareFromUserInput(_, payload) {
  //   const { id, password, rejected } = payload
  //   thresholdKeyController.setSecurityQuestionShareFromUserInput(id, { password, rejected })
  // },
  // setStoreDeviceFlow(_, payload) {
  //   const { id, response, rejected } = payload
  //   log.info('payload', payload)
  //   // response is { isOld: Boolean, oldIndex: '' }
  //   thresholdKeyController.setStoreDeviceFlow(id, { response, rejected })
  // },
  // setShareTransferInput(_, payload) {
  //   const { id, success } = payload
  //   thresholdKeyController.setShareTransferStatus(id, { success })
  // },
  setTkeyInputFlow(_, payload) {
    thresholdKeyController.setTkeyInputFlow(payload)
  },
  clearTkeyError() {
    return thresholdKeyController.clearTkeyError()
  },
  clearTkeySuccess() {
    return thresholdKeyController.clearTkeySuccess()
  },
  async manualAddTKey({ dispatch, state }, payload) {
    dispatch('updateSelectedAddress', { selectedAddress: '' })
    const defaultAddresses = await dispatch('addTKey', payload)
    let finalWallet
    if (Object.keys(defaultAddresses).length > 0) {
      finalWallet = Object.keys(state.wallet).find((x) => state.wallet[x].accountType === ACCOUNT_TYPE.THRESHOLD)
    } else {
      finalWallet = Object.keys(state.wallet).find((x) => state.wallet[x].accountType === ACCOUNT_TYPE.NORMAL)
    }
    return dispatch('updateSelectedAddress', { selectedAddress: finalWallet })
  },
  approveShareTransferRequest(_, payload) {
    thresholdKeyController.approveShareTransferRequest(payload)
  },
  denyShareTransferRequest(_, payload) {
    thresholdKeyController.denyShareTransferRequest(payload)
  },
  setTkeySuccess(_, payload) {
    thresholdKeyController.setTkeySuccess(payload)
  },
  setTkeyError(_, payload) {
    thresholdKeyController.setTkeyError(payload)
  },
  async calculatePostboxKey({ state, commit, dispatch }, payload) {
    try {
      const { userInfo, embedState } = state
      const { oAuthToken: idToken } = payload
      const aggregateVerifierParams = { verify_params: [], sub_verifier_ids: [], verifier_id: '' }
      const aggregateIdTokenSeeds = []
      let aggregateVerifierId = ''

      aggregateVerifierParams.verify_params.push({ verifier_id: userInfo.verifierId, idtoken: idToken })
      aggregateVerifierParams.sub_verifier_ids.push(LINKED_VERIFIER_SUBIDENTIFIER)
      aggregateIdTokenSeeds.push(idToken)
      aggregateVerifierId = userInfo.verifierId // using last because idk
      aggregateIdTokenSeeds.sort()
      const aggregateIdToken = keccak256(aggregateIdTokenSeeds.join(String.fromCharCode(29))).slice(2)
      aggregateVerifierParams.verifier_id = aggregateVerifierId
      const currentVeriferConfig = embedState.loginConfig[userInfo.verifier]
      const postboxKey = await dispatch('getTorusKey', {
        verifier: currentVeriferConfig.linkedVerifier,
        verifierId: aggregateVerifierId,
        verifierParams: aggregateVerifierParams,
        oAuthToken: aggregateIdToken,
      })
      commit('setPostboxKey', { privateKey: postboxKey.privKey, ethAddress: postboxKey.ethAddress })
    } catch (error) {
      log.error(error, 'unable to get postbox key')
    }
  },
  deleteShare(_, payload) {
    return thresholdKeyController.deleteShare(payload)
  },
  addRecoveryShare(_, payload) {
    return thresholdKeyController.addRecoveryShare(payload)
  },
  async addSeedPhrase({ state, dispatch, commit }, payload) {
    const accounts = await thresholdKeyController.addSeedPhrase(payload)
    const normalAccountAddress = Object.keys(state.wallet).find((x) => state.wallet[x].accountType === ACCOUNT_TYPE.NORMAL)
    const thresholdKeys = accounts.map((x) => ({
      ethAddress: generateAddressFromPrivateKey(x.privKey),
      ...x,
    }))
    log.info('tkey 2', thresholdKeys)
    await dispatch('initTorusKeyring', {
      keys: thresholdKeys,
      calledFromEmbed: false,
      rehydrate: false,
      postboxAddress: normalAccountAddress || state.postboxKey.ethAddress,
    })
    commit('setTkeyExists', true)
    dispatch('updateSelectedAddress', { selectedAddress: thresholdKeys[0].ethAddress }) // synchronous
  },
  async addSeedPhraseAccount({ dispatch, state }, payload) {
    const accounts = await thresholdKeyController.addSeedPhraseAccount(payload)
    const normalAccountAddress = Object.keys(state.wallet).find((x) => state.wallet[x].accountType === ACCOUNT_TYPE.NORMAL)
    const thresholdKeys = accounts.map((x) => ({
      ethAddress: generateAddressFromPrivateKey(x.privKey),
      ...x,
    }))
    log.info('tkey 2', thresholdKeys)
    return dispatch('initTorusKeyring', {
      keys: thresholdKeys,
      calledFromEmbed: false,
      rehydrate: false,
      postboxAddress: normalAccountAddress || state.postboxKey.ethAddress,
    })
  },
}
