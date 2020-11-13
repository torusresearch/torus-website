import randomId from '@chaitanyapotti/random-id'
import log from 'loglevel'
import { keccak256 } from 'web3-utils'

import config from '../config'
import PopupWithBcHandler from '../handlers/Popup/PopupWithBcHandler'
import router from '../router'
import torus from '../torus'
import { ACCOUNT_TYPE, FEATURES_DEFAULT_POPUP_WINDOW, VERIFIER_IDENTIFIER } from '../utils/enums'
import { isMain } from '../utils/utils'

const { baseRoute } = config

const { torusController } = torus || {}
const { thresholdKeyController } = torusController || {}

export default {
  async addTKey({ dispatch, state }, { postboxKey, calledFromEmbed }) {
    try {
      let finalKey = postboxKey
      if (!finalKey) {
        const postboxWallet = Object.keys(state.wallet).find((x) => state.wallet[x].accountType === ACCOUNT_TYPE.NORMAL)
        const { privateKey, accountType } = state.wallet[postboxWallet]
        finalKey = {
          ethAddress: postboxWallet,
          privKey: privateKey,
          accountType,
        }
      }
      const thresholdKey = await thresholdKeyController.login(state.postboxKey.privKey)
      log.info('tkey 2', thresholdKey)
      return dispatch('initTorusKeyring', {
        keys: [{ ...thresholdKey, accountType: ACCOUNT_TYPE.THRESHOLD }],
        calledFromEmbed,
        rehydrate: false,
        postboxAddress: finalKey.ethAddress,
      })
    } catch (error) {
      // tkey login failed. Allow normal google one to proceed through
      log.error(error)
      return []
    }
  },
  async createNewTKey({ state, dispatch, commit }, payload) {
    const thresholdKey = await thresholdKeyController.createNewTKey({ postboxKey: state.postboxKey.privKey, ...payload })
    log.info('tkey 2', thresholdKey)
    await dispatch('initTorusKeyring', {
      keys: [{ ...thresholdKey, accountType: ACCOUNT_TYPE.THRESHOLD }],
      calledFromEmbed: false,
      rehydrate: false,
    })
    commit('setTkeyExists', true)
    dispatch('updateSelectedAddress', { selectedAddress: thresholdKey.ethAddress }) // synchronous
  },
  async getPostboxKey({ state, commit, dispatch }) {
    const { userInfo } = state
    const { idToken } = userInfo
    const aggregateVerifierParams = { verify_params: [], sub_verifier_ids: [], verifier_id: '' }
    const aggregateIdTokenSeeds = []
    let aggregateVerifierId = ''

    aggregateVerifierParams.verify_params.push({ verifier_id: userInfo.verifierId, idtoken: userInfo.idToken })
    aggregateVerifierParams.sub_verifier_ids.push('torus')
    aggregateIdTokenSeeds.push(idToken)
    aggregateVerifierId = userInfo.verifierId // using last because idk
    aggregateIdTokenSeeds.sort()
    const aggregateIdToken = keccak256(aggregateIdTokenSeeds.join(String.fromCharCode(29))).slice(2)
    aggregateVerifierParams.verifier_id = aggregateVerifierId
    const postboxKey = await dispatch('getTorusKey', {
      verifier: VERIFIER_IDENTIFIER,
      verifierId: aggregateVerifierId,
      verifierParams: aggregateVerifierParams,
      oAuthToken: aggregateIdToken,
    })
    commit('setTorusKey', postboxKey)
    return postboxKey
  },
  addPassword(_, payload) {
    return thresholdKeyController.addPassword(payload)
  },
  changePassword(_, payload) {
    return thresholdKeyController.changePassword(payload)
  },
  downloadShare(_, payload) {
    return thresholdKeyController.downloadShare(payload)
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
        const postboxWallet = Object.keys(state.wallet).find((x) => state.wallet[x].accountType === ACCOUNT_TYPE.NORMAL)
        const { loginConfig } = state.embedState
        const verifierName = loginConfig[state.userInfo.verifier].name
        const popupPayload = {
          verifierName,
          whiteLabel: state.whiteLabel,
          data: JSON.stringify(data),
          postboxKey: state.wallet[postboxWallet]?.privateKey,
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
    await dispatch('addTKey', payload)
    const thresholdWallet = Object.keys(state.wallet).find((x) => state.wallet[x].accountType === ACCOUNT_TYPE.THRESHOLD)
    return dispatch('updateSelectedAddress', { selectedAddress: thresholdWallet })
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
}
