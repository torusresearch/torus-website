export default {
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  },
  setIdToken(state, idToken) {
    state.idToken = idToken
  },
  setWallet(state, wallet) {
    state.wallet = wallet
  },
  setWeiBalance(state, weiBalance) {
    state.weiBalance = weiBalance
  },
  setTokenData(state, tokenData) {
    state.tokenData = tokenData
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
    state.networkType = networkType
  },
  setTransactions(state, transactions) {
    state.transactions = transactions
  },
  setLoginInProgress(state, payload) {
    state.loginInProgress = payload
  },
  setCurrencyData(state, data) {
    state.currencyData = { ...state.currencyData, [data.currentCurrency]: data.conversionRate }
  },
  setCurrency(state, currency) {
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
    state.jwtToken = payload
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
  },
  setBillboard(state, payload) {
    state.billboard = payload
  },
  logOut(state, payload) {
    Object.keys(state).forEach(key => {
      state[key] = payload[key] // or = initialState[key]
    })
  }
}
