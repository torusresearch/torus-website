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
  setDefaultPublicAddress({ state }, payload) {
    const { wallets } = state
    return Promise.all(Object.keys(wallets).map((x) => prefsController.setDefaultPublicAddress(payload, x)))
  },
}
