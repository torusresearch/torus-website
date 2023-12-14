import { setAPIKey } from '@toruslabs/http-helpers'
import merge from 'deepmerge'

import config from '../config'
import i18n, { loadLanguageAsync } from '../plugins/i18n-setup'
import themes from '../plugins/themes'
import vuetify from '../plugins/vuetify'
import { LOCALES, THEME_DARK_BLACK_NAME, THEME_LIGHT_BLUE_NAME } from '../utils/enums'

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
    state.networkType = { ...networkType, networkName: networkType.networkName || networkType.host }
  },
  setCustomNetworks(state, networks) {
    const customNetworks = {}
    Object.values(networks).forEach((i) => {
      customNetworks[i.host] = { ...i, networkName: i.networkName || i.host }
    })

    state.customNetworks = {
      ...customNetworks,
    }
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
  setCustomCurrency(state, currency) {
    state.customCurrency = currency
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
    const key = keys.at(-1) || ''
    const value = payload[key] || { name: '', icon: '' }
    state.iframeMetadata = {
      origin: key,
      ...value,
    }
  },
  setLoginConfig(state, payload) {
    const { loginConfig } = payload
    if (loginConfig) {
      const finalLoginConfig = merge(config.loginConfig, loginConfig)
      Object.keys(finalLoginConfig).forEach((x) => {
        // Fallback to verifier name as login provider if not set
        if (!finalLoginConfig[x].loginProvider) finalLoginConfig[x].loginProvider = x
      })
      state.embedState = {
        ...state.embedState,
        loginConfig: finalLoginConfig,
      }
    }
  },
  setAPIKey(state, payload) {
    setAPIKey(payload || 'torus-default')
    state.embedState = {
      ...state.embedState,
      apiKey: payload || 'torus-default',
    }
  },
  setMfaLevel(state, payload) {
    state.embedState = {
      ...state.embedState,
      mfaLevel: payload || 'default',
    }
  },
  setShowWalletConnect(state, payload) {
    state.embedState = {
      ...state.embedState,
      showWalletConnect: payload || false,
    }
  },
  setButtonPosition(state, payload) {
    state.embedState = { ...state.embedState, buttonPosition: payload || 'bottom-left' }
  },
  setButtonSize(state, payload) {
    state.embedState = { ...state.embedState, buttonSize: payload || 56 }
  },
  async setWhiteLabel(state, payload) {
    if (!payload) {
      state.whiteLabel = {
        isActive: false,
      }
      localThemeSet(THEME_LIGHT_BLUE_NAME, state)
      return
    }
    state.whiteLabel = {
      ...state.whiteLabel,
      isActive: true,
      ...payload,
    }
    localThemeSet(undefined, state)
    // Set locale here from defaultLanguage
    if (payload) {
      // Checks if whitelabel defaultLanguage is supported
      const selectedLocale = LOCALES.find((localeInner) => localeInner.value === payload.defaultLanguage)
      if (selectedLocale) {
        payload.defaultLanguage = selectedLocale.value
        await updateDefaultLanguage(state, payload.defaultLanguage)
      }

      if (payload.customTranslations) {
        Object.keys(payload.customTranslations).forEach((key) => {
          i18n.mergeLocaleMessage(key, payload.customTranslations[key])
        })
      }
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
  setRehydrationStatus(state, payload) {
    state.isRehydrationComplete = payload
  },
  setDefaultPublicAddress(state, payload) {
    state.defaultPublicAddress = payload
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
  setUnapprovedAssets(state, unApprovedAssets) {
    state.unApprovedAssets = unApprovedAssets
  },
  setUnapprovedAddChainRequests(state, unapprovedAddChainRequests) {
    state.unapprovedAddChainRequests = unapprovedAddChainRequests
  },
  setUnapprovedSwitchChainRequests(state, unapprovedSwitchChainRequests) {
    state.unapprovedSwitchChainRequests = unapprovedSwitchChainRequests
  },
  setPostboxKey(state, payload) {
    state.postboxKey = payload
  },
  setLoginInProgress(state, payload) {
    if (typeof window != 'undefined') {
      window.loginInProgress = payload
    }
    state.embedState = { ...state.embedState, loginInProgress: payload }
  },
  setAnnouncements(state, payload) {
    state.announcements = payload
  },
  setNetworkDetails(state, payload) {
    state.networkDetails = payload
  },
  setGasFees(state, payload) {
    state.gasFees = payload
  },
  setLastLoginInfo(state, payload) {
    state.lastLoginInfo = { ...state.lastLoginInfo, ...payload }
  },
  setUserDapps(state, payload) {
    state.userDapps = payload
  },
  setIsPlugin(state, payload) {
    state.isPlugin = payload
    config.isPlugin = payload
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
  if (config.storageAvailability.local && payload) localStorage.setItem('torus-theme', payload)
  if (config.storageAvailability.local && !localStorage.getItem('torus-theme')) localStorage.setItem('torus-theme', state.theme)
}
async function updateDefaultLanguage(state, language) {
  state.locale = language
  await loadLanguageAsync(language)
}
