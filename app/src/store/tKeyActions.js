import log from 'loglevel'

import torus from '../torus'
import { ACCOUNT_TYPE } from '../utils/enums'

const { torusController } = torus || {}
const { thresholdKeyController } = torusController || {}

export default {
  async addTKey({ dispatch }, { postboxKey, calledFromEmbed }) {
    const thresholdKey = await thresholdKeyController.login(postboxKey.privKey)
    log.info('tkey 2', thresholdKey)
    return dispatch('initTorusKeyring', { keys: [{ ...thresholdKey, accountType: ACCOUNT_TYPE.THRESHOLD }], calledFromEmbed, rehydrate: false })
  },
  async createNewTKey({ state, dispatch }, payload) {
    const thresholdKey = await thresholdKeyController.createNewTKey({ postboxKey: state.wallet[state.selectedAddress].privateKey, ...payload })
    log.info('tkey 2', thresholdKey)
    await dispatch('initTorusKeyring', {
      keys: [{ ...thresholdKey, accountType: ACCOUNT_TYPE.THRESHOLD }],
      calledFromEmbed: false,
      rehydrate: false,
    })
    dispatch('updateSelectedAddress', { selectedAddress: thresholdKey.ethAddress }) // synchronous
  },
  addPassword(_, payload) {
    return thresholdKeyController.addPassword(payload)
  },
  changePassword(_, payload) {
    return thresholdKeyController.changePassword(payload)
  },
}
