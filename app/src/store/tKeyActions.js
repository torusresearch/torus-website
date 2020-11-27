import randomId from '@chaitanyapotti/random-id'
import log from 'loglevel'
import { keccak256 } from 'web3-utils'

import config from '../config'
import PopupWithBcHandler from '../handlers/Popup/PopupWithBcHandler'
import router from '../router'
import torus from '../torus'
import { ACCOUNT_TYPE, FEATURES_DEFAULT_POPUP_WINDOW, LINKED_VERIFIER_SUBIDENTIFIER } from '../utils/enums'
import { isMain } from '../utils/utils'

const { baseRoute } = config

const { torusController } = torus || {}
const { thresholdKeyController } = torusController || {}

export default {
  async addTKey({ dispatch, state }, { calledFromEmbed }) {
    try {
      const finalKey = state.postboxKey
      const thresholdKey = await thresholdKeyController.login(finalKey.privateKey)
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
    const { postboxKey } = state
    const thresholdKey = await thresholdKeyController.createNewTKey({ postboxKey: postboxKey.privateKey, ...payload })
    log.info('tkey 2', thresholdKey)
    await dispatch('initTorusKeyring', {
      keys: [{ ...thresholdKey, accountType: ACCOUNT_TYPE.THRESHOLD }],
      calledFromEmbed: false,
      rehydrate: false,
    })
    commit('setTkeyExists', true)
    dispatch('updateSelectedAddress', { selectedAddress: thresholdKey.ethAddress }) // synchronous
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
}
