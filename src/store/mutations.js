import { setAPIKey } from '@toruslabs/http-helpers'
import merge from 'deepmerge'

import config from '../config'
import themes from '../plugins/themes'
import vuetify from '../plugins/vuetify'
import { LOCALES, THEME_DARK_BLACK_NAME, THEME_LIGHT_BLUE_NAME } from '../utils/enums'
import { storageAvailable } from '../utils/utils'

export default {
  setWCConnectorSession(state, wcConnectorSession) {
    state.wcConnectorSession = wcConnectorSession
  },
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  },
  setWallet(state, wallet) {
    state.wallet = wallet
  },
  setWeiBalance(state, weiBalance) {
    state.weiBalance = { ...state.weiBalance, ...weiBalance }
    state.weiBalanceLoaded = true
  },
  setTokenDataLoaded(state) {
    state.tokenDataLoaded = true
  },
  setTokenData(state, tokenData) {
    state.tokenData = { ...state.tokenData, ...tokenData }
  },
  setTokenRates(state, tokenRates) {
    state.tokenRates = tokenRates
  },
  setSelectedAddress(state, selectedAddress) {
    state.selectedAddress = selectedAddress
  },
  setNetworkId(state, networkId) {
    state.networkId = networkId
  },
  setNetworkType(state, networkType) {
    const currentHosts = Object.keys(state.supportedNetworks)
    if (!currentHosts.includes(networkType.host)) {
      state.supportedNetworks = {
        ...state.supportedNetworks,
        [networkType.host]: { ...networkType, networkName: networkType.networkName || networkType.host },
      }
    }
    state.networkType = { ...networkType, networkName: networkType.networkName || networkType.host }
  },
  setTransactions(state, transactions) {
    state.transactions = transactions
  },
  setCurrencyData(state, data) {
    state.currencyData = { ...state.currencyData, [data.currentCurrency]: data.conversionRate }
  },
  setSelectedCurrency(state, currency) {
    state.selectedCurrency = currency
  },
  setTypedMessages(state, unapprovedTypedMessages) {
    state.unapprovedTypedMessages = unapprovedTypedMessages
  },
  setPersonalMessages(state, unapprovedPersonalMsgs) {
    state.unapprovedPersonalMsgs = unapprovedPersonalMsgs
  },
  setMessages(state, unapprovedMsgs) {
    state.unapprovedMsgs = unapprovedMsgs
  },
  setJwtToken(state, payload) {
    state.jwtToken = { ...state.jwtToken, ...payload }
  },
  setUserInfoAccess(state, payload) {
    state.userInfoAccess = payload
  },
  setNewUser(state, payload) {
    state.isNewUser = payload
  },
  setPastTransactions(state, payload) {
    state.pastTransactions = payload
  },
  patchPastTransactions(state, payload) {
    state.pastTransactions = [...state.pastTransactions, payload]
  },
  setTheme(state, payload) {
    state.theme = payload
    // Update vuetify theme
    localThemeSet(payload, state)
  },
  setCrashReport(state, payload) {
    state.crashReport = payload
  },
  setLocale(state, payload) {
    updateDefaultLanguage(state, payload)
  },
  setAssets(state, payload) {
    state.assets = { ...state.assets, ...payload }
  },
  setBillboard(state, payload) {
    state.billboard = payload
  },
  setContacts(state, payload) {
    state.contacts = payload
  },
  logOut(state, payload) {
    Object.keys(state).forEach((key) => {
      state[key] = payload[key] // or = initialState[key]
    })
  },
  setPermissions(state, payload) {
    state.permissions = payload
  },
  setPaymentTx(state, payload) {
    state.paymentTx = payload
  },
  setErrorMsg(state, payload) {
    state.errorMsg = payload
  },
  setSuccessMsg(state, payload) {
    state.successMsg = payload
  },
  setMetaData(state, payload) {
    const keys = Object.keys(payload)
    const key = keys[keys.length - 1] || ''
    const value = payload[key] || { name: '', icon: '' }
    state.iframeMetadata = {
      origin: key,
      ...value,
    }
  },
  setLoginConfig(state, payload) {
    const { enabledVerifiers, loginConfig } = payload
    const finalLoginConfig = merge(config.loginConfig, loginConfig)
    Object.keys(enabledVerifiers).forEach((x) => {
      if (finalLoginConfig[x]) finalLoginConfig[x].showOnModal = !enabledVerifiers[x] ? false : finalLoginConfig[x].showOnModal
    })
    state.embedState = {
      ...state.embedState,
      loginConfig: finalLoginConfig,
    }
  },
  setAPIKey(state, payload) {
    setAPIKey(payload || 'torus-default')
    state.embedState = {
      ...state.embedState,
      apiKey: payload || 'torus-default',
    }
  },
  setSkipTKey(state, payload) {
    state.embedState = {
      ...state.embedState,
      skipTKey: payload || false,
    }
  },
  setButtonPosition(state, payload) {
    state.embedState = { ...state.embedState, buttonPosition: payload || 'bottom-left' }
  },
  setWhiteLabel(state, payload) {
    state.whiteLabel = {
      ...state.whiteLabel,
      isActive: true,
      ...payload,
    }
    localThemeSet(undefined, state)
    // Set locale here from defaultLanguage
    if (storageAvailable('sessionStorage') && payload) {
      // Checks if whitelabel defaultLanguage is supported
      const selectedLocale = LOCALES.find((localeInner) => localeInner.value === payload.defaultLanguage)
      if (selectedLocale) {
        payload.defaultLanguage = selectedLocale.value
        updateDefaultLanguage(state, payload.defaultLanguage)
      }

      if (payload.customTranslations) {
        vuetify.framework.lang.locales = merge(vuetify.framework.lang.locales, payload.customTranslations)
      }

      sessionStorage.setItem('torus-white-label', JSON.stringify(payload))
    }
  },
  setOAuthModalStatus(state, payload) {
    state.embedState = {
      ...state.embedState,
      isOAuthModalVisible: payload,
    }
  },
  setTorusWidgetVisibility(state, payload) {
    state.embedState = { ...state.embedState, torusWidgetVisibility: payload }
  },
  setEtherscanTx(state, payload) {
    state.etherscanTx = payload
  },
  setBadgesCompletion(state, payload) {
    state.badgesCompletion = payload
  },
  setRehydrationStatus(state, payload) {
    state.isRehydrationComplete = payload
  },
  setTKeyOnboardingComplete(state, payload) {
    state.tKeyOnboardingComplete = payload
  },
  setDefaultPublicAddress(state, payload) {
    state.defaultPublicAddress = payload
  },
  setTKey(state, payload) {
    state.tKeyStore = payload
  },
  addConfirmModal(state, payload) {
    state.confirmModals = [...state.confirmModals, payload]
  },
  deleteConfirmModal(state, payload) {
    state.confirmModals = state.confirmModals.filter((x) => x.id !== payload)
  },
  setUnapprovedEncryptionPublicKeyMsgs(state, unapprovedEncryptionPublicKeyMsgs) {
    state.unapprovedEncryptionPublicKeyMsgs = unapprovedEncryptionPublicKeyMsgs
  },
  setUnapprovedDecryptMsgs(state, unapprovedDecryptMsgs) {
    state.unapprovedDecryptMsgs = unapprovedDecryptMsgs
  },
  setPostboxKey(state, payload) {
    state.postboxKey = payload
  },
  setIsTkeySeedPhraseInputRequired(state, payload) {
    state.isTkeySeedPhraseInputRequired = payload
  },
  setLoginInProgress(state, payload) {
    state.embedState = { ...state.embedState, loginInProgress: payload }
  },
  setAnnouncements(state, payload) {
    state.announcements = payload
  },
}
function localThemeSet(payload, state) {
  let theme = themes[payload || THEME_LIGHT_BLUE_NAME]
  if (state.whiteLabel.isActive) {
    const { theme: whiteLabelTheme } = state.whiteLabel
    const localThemeEngine = whiteLabelTheme.isDark ? THEME_DARK_BLACK_NAME : THEME_LIGHT_BLUE_NAME
    theme = themes[localThemeEngine]
    if (whiteLabelTheme.colors) {
      theme.theme = { ...theme.theme, ...whiteLabelTheme.colors }
    }
    state.theme = localThemeEngine
  }
  if (payload || state.whiteLabel.isActive) {
    vuetify.framework.theme.dark = theme.isDark
    vuetify.framework.theme.themes[theme.isDark ? 'dark' : 'light'] = theme.theme
  }
  const isLocalStorageAvailable = storageAvailable('localStorage')
  if (isLocalStorageAvailable && payload) localStorage.setItem('torus-theme', payload)
  if (isLocalStorageAvailable && !localStorage.getItem('torus-theme')) localStorage.setItem('torus-theme', state.theme)
}
function updateDefaultLanguage(state, language) {
  state.locale = language
  vuetify.framework.lang.current = language
}
