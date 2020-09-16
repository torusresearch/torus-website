/* eslint-disable no-unused-vars */
import log from 'loglevel'

import config from '../config'
import router from '../router'
import torus from '../torus'
import { ACCOUNT_TYPE, THRESHOLD_KEY_INPUT_ROUTE_MAPPING, THRESHOLD_KEY_QUESTION_INPUT, THRESHOLD_KEY_STORE_DEVICE_FLOW } from '../utils/enums'
import PopupHandler from '../utils/PopupHandler'
import { broadcastChannelOptions, isMain } from '../utils/utils'

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
  showThresholdKeyUi({ dispatch }, payload) {
    const { type, data: { id } = {} } = payload
    log.info(id, type)
    if (isMain) router.push({ name: THRESHOLD_KEY_INPUT_ROUTE_MAPPING[type].name, query: { ...router.currentRoute.query, id } })
    else {
      const bc = new BroadcastChannel(`tkey_channel_${id}`, broadcastChannelOptions)
      const finalUrl = `${baseRoute}wallet/tkey/${THRESHOLD_KEY_INPUT_ROUTE_MAPPING[type].path}?integrity=true&instanceId=${id}&id=${id}`
      const tKeyInputWindow = new PopupHandler({
        url: finalUrl,
        target: '_blank',
        features: 'directories=0,titlebar=0,toolbar=0,status=0,location=0,menubar=0,height=660,width=500',
      })

      const handleDeny = () => {
        log.info('Tkey input denied')
        if (type === THRESHOLD_KEY_QUESTION_INPUT) {
          dispatch('setSecurityQuestionShareFromUserInput', { id, password: '', rejected: true })
        } else if (type === THRESHOLD_KEY_STORE_DEVICE_FLOW) {
          dispatch('setStoreDeviceFlow', { id, response: '', rejected: true })
        }
      }
      const handleSuccess = () => {
        log.info('tkey input success')
      }

      bc.addEventListener('message', async (ev) => {
        const { eventType = '', details } = ev.data
        if (eventType === 'device_login_password') {
          const { id: keyId, password, rejected } = details
          dispatch('setSecurityQuestionShareFromUserInput', { id: keyId, password, rejected })
        } else if (eventType === 'set_store_device_flow') {
          const { id: keyId, response, rejected } = details
          dispatch('setStoreDeviceFlow', { id: keyId, response, rejected })
        }

        tKeyInputWindow.close()
        // if (type === 'popup-loaded') {
        //   await bc.postMessage({
        //     data: {
        //       origin: getIFrameOriginObject(),
        //       payload: { ...payload, typeOfLogin: state.userInfo.typeOfLogin },
        //       whiteLabel: state.whiteLabel,
        //     },
        //   })
        // } else if (type === 'user-info-request-result') {
        //   try {
        //     if (approve) handleSuccess()
        //     else handleDeny()
        //   } catch (error) {
        //     log.error(error)
        //     handleDeny()
        //   } finally {
        //     bc.close()
        //     userInfoRequestWindow.close()
        //   }
        // }
      })

      tKeyInputWindow.open()
      tKeyInputWindow.once('close', () => {
        handleDeny()
      })
    }
  },
  setSecurityQuestionShareFromUserInput(_, payload) {
    const { id, password, rejected } = payload
    thresholdKeyController.setSecurityQuestionShareFromUserInput(id, { password, rejected })
  },
  setStoreDeviceFlow(_, payload) {
    const { id, response, rejected } = payload
    log.info('payload', payload)
    // response is { isOld: Boolean, oldIndex: '' }
    thresholdKeyController.setStoreDeviceFlow(id, { response, rejected })
  },
  clearTkeyError() {
    return thresholdKeyController.clearTkeyError()
  },
  async manualAddTKey({ dispatch, state }, payload) {
    await dispatch('addTKey', payload)
    const thresholdWallet = Object.keys(state.wallet).find((x) => state.wallet[x].accountType === ACCOUNT_TYPE.THRESHOLD)
    return dispatch('updateSelectedAddress', { selectedAddress: thresholdWallet })
  },
}
