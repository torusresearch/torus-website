import log from 'loglevel'

import torus from '../torus'

const { torusController } = torus || {}
const { prefsController } = torusController || {}

export default {
  setTKeyOnboardingStatus({ state }, payload) {
    return prefsController.setTKeyOnboardingStatus(payload, state.selectedAddress)
  },
  setUserBadge(_, payload) {
    prefsController.setUserBadge(payload)
  },
  getTwitterId(_, payload) {
    return prefsController.getTwitterId(payload)
  },
  sendEmail(_, payload) {
    return prefsController.sendEmail(payload)
  },
  getOpenseaCollectibles(_, payload) {
    return prefsController.getOpenSeaCollectibles(payload.tokenURI)
  },
  setSuccessMessage(context, payload) {
    prefsController.handleSuccess(payload)
  },
  setErrorMessage(context, payload) {
    prefsController.handleError(payload)
  },
  setUserTheme(context, payload) {
    return prefsController.setUserTheme(payload)
  },
  setUserLocale(context, payload) {
    prefsController.setUserLocale(payload)
  },
  addContact(_, payload) {
    return prefsController.addContact(payload)
  },
  deleteContact(_, payload) {
    return prefsController.deleteContact(payload)
  },
  async setDefaultPublicAddress({ state, dispatch }, payload) {
    const { wallet } = state
    await Promise.all(Object.keys(wallet).map((x) => prefsController.setDefaultPublicAddress(x, payload)))
    dispatch('updateSelectedAddress', { selectedAddress: payload })
  },
  async createNewTKey(_, payload) {
    log.info(payload, 'creating new tkey')
  },
}
