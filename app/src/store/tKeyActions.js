import randomId from '@chaitanyapotti/random-id'
import log from 'loglevel'

import config from '../config'
import PopupWithBcHandler from '../handlers/Popup/PopupWithBcHandler'
import router from '../router'
import torus from '../torus'
import { ACCOUNT_TYPE, FEATURES_DEFAULT_POPUP_WINDOW } from '../utils/enums'
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
      const thresholdKey = await thresholdKeyController.login(finalKey.privKey)
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
    const normalAccount = Object.values(state.wallet).find((x) => x.accountType === ACCOUNT_TYPE.NORMAL)
    const thresholdKey = await thresholdKeyController.createNewTKey({ postboxKey: normalAccount.privateKey, ...payload })
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
}
