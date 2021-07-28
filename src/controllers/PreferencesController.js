import { ObservableStore } from '@metamask/obs-store'
import EventEmitter from '@metamask/safe-event-emitter'
import clone from 'clone'
import deepmerge from 'deepmerge'
import { hashPersonalMessage } from 'ethereumjs-util'
import log from 'loglevel'
import Web3 from 'web3'

import config from '../config'
import ApiHelpers from '../utils/apiHelpers'
import {
  ACCOUNT_TYPE,
  ACTIVITY_ACTION_RECEIVE,
  ACTIVITY_ACTION_SEND,
  ACTIVITY_ACTION_TOPUP,
  BADGES_COLLECTIBLE,
  BADGES_TOPUP,
  BADGES_TRANSACTION,
  ERROR_TIME,
  ETHERSCAN_SUPPORTED_NETWORKS,
  SUCCESS_TIME,
  THEME_LIGHT_BLUE_NAME,
} from '../utils/enums'
import { notifyUser } from '../utils/notifications'
import { setSentryEnabled } from '../utils/sentry'
import { formatPastTx, getEthTxStatus, getIFrameOrigin, getUserLanguage, isMain, storageAvailable } from '../utils/utils'
import { isErrorObject, prettyPrintData } from './utils/permissionUtils'

// By default, poll every 3 minutes
const DEFAULT_INTERVAL = 180 * 1000
const DEFAULT_BADGES_COMPLETION = {
  [BADGES_COLLECTIBLE]: false,
  [BADGES_TOPUP]: false,
  [BADGES_TRANSACTION]: false,
}

let themeGlobal = THEME_LIGHT_BLUE_NAME
if (storageAvailable('localStorage')) {
  const torusTheme = localStorage.getItem('torus-theme')
  if (torusTheme) {
    themeGlobal = torusTheme
  }
}

const overwriteMerge = (destinationArray, sourceArray, _) => sourceArray

const DEFAULT_ACCOUNT_STATE = {
  selectedCurrency: 'USD',
  theme: themeGlobal,
  locale: getUserLanguage(),
  contacts: [],
  permissions: [],
  badgesCompletion: {},
  jwtToken: '',
  fetchedPastTx: [],
  pastTransactions: [],
  paymentTx: [],
  tKeyOnboardingComplete: true,
  defaultPublicAddress: '',
  accountType: ACCOUNT_TYPE.NORMAL,
  customTokens: [],
}

class PreferencesController extends EventEmitter {
  /**
   *
   * @typedef {Object} PreferencesController
   * @param {Object} opts - Overrides the defaults for the initial state of this.store
   */
  constructor(options = {}) {
    super()

    const { network, provider, signMessage } = options

    this.network = network
    this.web3 = new Web3(provider)
    this.api = new ApiHelpers(options.storeDispatch)
    this.signMessage = signMessage

    this.interval = options.interval || DEFAULT_INTERVAL
    this.store = new ObservableStore({ selectedAddress: '' }) // Account specific object
    this.metadataStore = new ObservableStore({})
    this.errorStore = new ObservableStore('')
    this.successStore = new ObservableStore('')
    this.billboardStore = new ObservableStore({})
    this.announcementsStore = new ObservableStore({})
  }

  headers(address) {
    const selectedAddress = address || this.store.getState().selectedAddress
    return {
      headers: {
        Authorization: `Bearer ${this.state(selectedAddress)?.jwtToken || ''}`,
        'Content-Type': 'application/json; charset=utf-8',
      },
    }
  }

  state(address) {
    const selectedAddress = address || this.store.getState().selectedAddress
    return this.store.getState()[selectedAddress]
  }

  /**
   * Initializes address in preferences controller
   *
   * @param   {[String]}  address  Ethereum address
   *
   * @return  {[void]}           void
   */
  async init({
    address,
    jwtToken,
    calledFromEmbed = false,
    userInfo = {},
    rehydrate = false,
    accountType = ACCOUNT_TYPE.NORMAL,
    postboxAddress,
    dispatch,
    commit,
  }) {
    let response = { token: jwtToken }
    if (this.state(address)) return this.state(address).defaultPublicAddress || address
    if (!jwtToken) {
      const messageToSign = await this.getMessageForSigning(address)
      if (!messageToSign.startsWith('Torus Signin')) throw new Error('Cannot sign on invalid message')
      const bufferedMessage = Buffer.from(messageToSign, 'utf-8')
      const hashedMessage = hashPersonalMessage(bufferedMessage).toString('hex')
      const signedMessage = await this.signMessage(address, hashedMessage)
      response = await this.api.post(
        `${config.api}/auth/verify`,
        {
          public_address: address,
          signed_message: signedMessage,
        },
        {},
        { useAPIKey: true }
      )
    }
    const currentState = this.updateStore({ jwtToken: response.token }, address)
    const { verifier, verifierId } = userInfo
    const user = await this.sync(address)
    let defaultPublicAddress = address
    if (user?.data) {
      const { default_currency: defaultCurrency, verifier: storedVerifier, verifier_id: storedVerifierId, default_public_address } = user.data || {}
      dispatch('setSelectedCurrency', { selectedCurrency: defaultCurrency, origin: 'store' })
      if (!storedVerifier || !storedVerifierId) this.setVerifier(verifier, verifierId, address)
      defaultPublicAddress = default_public_address
    } else {
      const accountState = this.store.getState()[postboxAddress] || currentState
      await this.createUser(accountState.selectedCurrency, accountState.theme, verifier, verifierId, accountType, address)
      commit('setNewUser', true)
      dispatch('setSelectedCurrency', { selectedCurrency: accountState.selectedCurrency, origin: 'store' })
    }
    if (!rehydrate) this.storeUserLogin(verifier, verifierId, { calledFromEmbed, rehydrate }, address)
    return defaultPublicAddress
  }

  handleError(error) {
    if (isErrorObject(error)) {
      this.errorStore.putState(`Oops, That didn't work. Pls reload and try again. \n${error.message}`)
    } else if (error && typeof error === 'string') {
      this.errorStore.putState(error)
    } else if (error && typeof error === 'object') {
      const prettyError = prettyPrintData(error)
      const payloadError = prettyError !== '' ? `Error: ${prettyError}` : 'Something went wrong. Pls try again'
      this.errorStore.putState(payloadError)
    } else {
      this.errorStore.putState(error || '')
    }
    setTimeout(() => this.errorStore.putState(''), ERROR_TIME)
  }

  handleSuccess(message) {
    if (message && typeof message === 'string') {
      this.successStore.putState(message)
    } else if (message && typeof message === 'object') {
      const prettyMessage = prettyPrintData(message)
      const payloadMessage = prettyMessage !== '' ? `Success: ${prettyMessage}` : 'Success'
      this.successStore.putState(payloadMessage)
    } else {
      this.successStore.putState(message || '')
    }
    setTimeout(() => this.successStore.putState(''), SUCCESS_TIME)
  }

  async sync(address) {
    try {
      const user = await this.api.get(`${config.api}/user?fetchTx=false`, this.headers(address), { useAPIKey: true })
      if (user?.data) {
        const {
          badge: userBadges,
          default_currency: defaultCurrency,
          contacts,
          theme,
          enable_crash_reporter,
          locale,
          permissions,
          public_address,
          tkey_onboarding_complete,
          account_type,
          default_public_address,
          customTokens,
        } = user.data || {}
        let whiteLabelLocale
        let badgesCompletion = DEFAULT_BADGES_COMPLETION

        // White Label override
        if (storageAvailable('sessionStorage')) {
          let torusWhiteLabel = sessionStorage.getItem('torus-white-label')
          if (torusWhiteLabel) {
            try {
              torusWhiteLabel = JSON.parse(torusWhiteLabel)
              whiteLabelLocale = torusWhiteLabel.defaultLanguage
            } catch (error) {
              log.error(error)
            }
          }
        }

        if (userBadges) {
          try {
            badgesCompletion = JSON.parse(userBadges)
          } catch (error) {
            log.error(error)
          }
        }

        this.updateStore(
          {
            contacts,
            theme,
            crashReport: Boolean(enable_crash_reporter),
            selectedCurrency: defaultCurrency,
            locale: whiteLabelLocale || locale || getUserLanguage(),
            permissions,
            badgesCompletion,
            tKeyOnboardingComplete: account_type !== ACCOUNT_TYPE.NORMAL ? true : !!tkey_onboarding_complete,
            accountType: account_type || ACCOUNT_TYPE.NORMAL,
            defaultPublicAddress: default_public_address || public_address,
            customTokens,
          },
          public_address
        )
        setSentryEnabled(Boolean(enable_crash_reporter))
        return user
      }
      return undefined
    } catch (error) {
      log.error(error)
      return undefined
    } finally {
      Promise.all([
        this.api.getWalletOrders({}, this.headers(address).headers).catch((error) => {
          log.error('unable to fetch wallet orders', error)
        }),
        this.api.getPastOrders({}, this.headers(address).headers).catch((error) => {
          log.error('unable to fetch past orders', error)
        }),
      ])
        .then((data) => {
          const [walletTx, paymentTx] = data
          if (paymentTx?.data) {
            this.calculatePaymentTx(paymentTx.data, address)
          }
          if (walletTx?.data) {
            this.updateStore({ fetchedPastTx: walletTx.data }, address)
            this.calculatePastTx(walletTx.data, address)
          }
        })
        .catch((error) => log.error(error))
    }
  }

  calculatePaymentTx(txs, address) {
    const accumulator = []
    for (const x of txs) {
      let action = ''
      const lowerCaseAction = x.action.toLowerCase()
      if (ACTIVITY_ACTION_TOPUP.includes(lowerCaseAction)) action = ACTIVITY_ACTION_TOPUP
      else if (ACTIVITY_ACTION_SEND.includes(lowerCaseAction)) action = ACTIVITY_ACTION_SEND
      else if (ACTIVITY_ACTION_RECEIVE.includes(lowerCaseAction)) action = ACTIVITY_ACTION_RECEIVE

      accumulator.push({
        id: x.id,
        date: new Date(x.date),
        from: x.from,
        slicedFrom: x.slicedFrom,
        action,
        to: x.to,
        slicedTo: x.slicedTo,
        totalAmount: x.totalAmount,
        totalAmountString: x.totalAmountString,
        currencyAmount: x.currencyAmount,
        currencyAmountString: x.currencyAmountString,
        amount: x.amount,
        ethRate: x.ethRate,
        status: x.status.toLowerCase(),
        etherscanLink: x.etherscanLink || '',
        currencyUsed: x.currencyUsed,
      })
    }
    this.updateStore({ paymentTx: accumulator }, address)
  }

  updateStore(newPartialState, address) {
    const selectedAddress = address || this.store.getState().selectedAddress
    const currentState = this.state(selectedAddress) || clone(DEFAULT_ACCOUNT_STATE)
    const mergedState = deepmerge(currentState, newPartialState, { arrayMerge: overwriteMerge })
    this.store.updateState({
      [selectedAddress]: mergedState,
    })
    return mergedState
  }

  async calculatePastTx(txs, address) {
    const pastTx = []
    const pendingTx = []
    const lowerCaseSelectedAddress = address.toLowerCase()
    for (const x of txs) {
      if (
        x.network === this.network.getNetworkNameFromNetworkCode() &&
        x.to &&
        x.from &&
        (lowerCaseSelectedAddress === x.from.toLowerCase() || lowerCaseSelectedAddress === x.to.toLowerCase())
      ) {
        if (x.status !== 'confirmed') {
          pendingTx.push(x)
        } else {
          const finalObject = formatPastTx(x, lowerCaseSelectedAddress)
          pastTx.push(finalObject)
        }
      }
    }
    const pendingTxPromises = pendingTx.map((x) => getEthTxStatus(x.transaction_hash, this.web3).catch((error) => log.error(error)))
    const resolvedTxStatuses = await Promise.all(pendingTxPromises)
    for (const [index, element] of pendingTx.entries()) {
      const finalObject = formatPastTx(element, lowerCaseSelectedAddress)
      finalObject.status = resolvedTxStatuses[index]
      pastTx.push(finalObject)
      if (lowerCaseSelectedAddress === element.from.toLowerCase() && finalObject.status && finalObject.status !== element.status)
        this.patchPastTx({ id: element.id, status: finalObject.status }, address)
    }
    this.updateStore({ pastTransactions: pastTx }, address)
  }

  async fetchEtherscanTx(address, network) {
    try {
      const tx = await this.api.getEtherscanTransactions({ selectedAddress: address, selectedNetwork: network }, this.headers(address).headers)
      if (tx?.data) {
        this.emit('addEtherscanTransactions', tx.data, network)
      }
    } catch (error) {
      log.error('unable to fetch etherscan tx', error)
    }
  }

  async patchNewTx(tx, address) {
    const formattedTx = formatPastTx(tx)
    const storePastTx = this.state(address).pastTransactions
    const duplicateIndex = storePastTx.findIndex((x) => x.transaction_hash === tx.transaction_hash && x.networkType === tx.network)
    if (tx.status === 'submitted' || tx.status === 'confirmed') {
      if (duplicateIndex === -1 && tx.status === 'submitted') {
        // No duplicate found
        this.updateStore({ pastTransactions: [...storePastTx, formattedTx] }, address)
        this.postPastTx(tx, address)
        try {
          notifyUser(formattedTx.etherscanLink)
        } catch (error) {
          log.error(error)
        }
      } else {
        storePastTx[duplicateIndex] = formattedTx
        this.updateStore({ pastTransactions: [...storePastTx] }, address)
      }
    }
  }

  /* istanbul ignore next */
  async postPastTx(tx, address) {
    try {
      const response = await this.api.post(`${config.api}/transaction`, tx, this.headers(address), { useAPIKey: true })
      log.info('successfully added', response)
    } catch (error) {
      log.error(error, 'unable to insert transaction')
    }
  }

  /* istanbul ignore next */
  recalculatePastTx(address) {
    // This triggers store update which calculates past Tx status for that network
    const selectedAddress = address || this.store.getState().selectedAddress
    const state = this.state(selectedAddress)
    if (!state?.fetchedPastTx) return
    this.calculatePastTx(state.fetchedPastTx, selectedAddress)
  }

  refetchEtherscanTx(address) {
    const selectedAddress = address || this.store.getState().selectedAddress
    if (this.state(selectedAddress)?.jwtToken) {
      const selectedNetwork = this.network.getNetworkNameFromNetworkCode()
      if (ETHERSCAN_SUPPORTED_NETWORKS.has(selectedNetwork)) {
        this.fetchEtherscanTx(selectedAddress, selectedNetwork)
      }
    }
  }

  /* istanbul ignore next */
  async createUser(selectedCurrency, theme, verifier, verifierId, accountType, address) {
    await this.api.post(
      `${config.api}/user`,
      {
        default_currency: selectedCurrency,
        theme,
        verifier,
        verifierId,
        account_type: accountType,
      },
      this.headers(address),
      { useAPIKey: true }
    )
    this.updateStore(
      {
        theme,
        tKeyOnboardingComplete: false,
        accountType: ACCOUNT_TYPE.NORMAL,
        defaultPublicAddress: address,
      },
      address
    )
  }

  /* istanbul ignore next */
  storeUserLogin(verifier, verifierId, payload, address) {
    let userOrigin = ''
    if (payload && payload.calledFromEmbed) {
      userOrigin = getIFrameOrigin()
    } else userOrigin = window.location.origin
    if (!payload.rehydrate) {
      const interval = setInterval(() => {
        const urlParameters = new URLSearchParams(window.location.search)
        const referrer = urlParameters.get('referrer') || ''
        if (window.location.href.includes('referrer') && !referrer) return
        this.api.post(
          `${config.api}/user/recordLogin`,
          {
            hostname: userOrigin,
            verifier,
            verifierId,
            metadata: `referrer:${referrer}`,
          },
          this.headers(address),
          { useAPIKey: true }
        )
        clearInterval(interval)
      }, 1000)
    }
  }

  async setUserTheme(payload) {
    if (payload === this.state()?.theme) return
    try {
      await this.api.patch(`${config.api}/user/theme`, { theme: payload }, this.headers(), { useAPIKey: true })
      this.handleSuccess('navBar.snackSuccessTheme')
      this.updateStore({ theme: payload })
    } catch (error) {
      log.error(error)
      this.handleError('navBar.snackFailTheme')
    }
  }

  /* istanbul ignore next */
  async setCrashReport(payload) {
    if (payload === this.state()?.crashReport) return
    try {
      await this.api.patch(`${config.api}/user/crashreporter`, { enable_crash_reporter: payload }, this.headers(), { useAPIKey: true })
      if (storageAvailable('localStorage')) {
        localStorage.setItem('torus-enable-crash-reporter', String(payload))
      }
      setSentryEnabled(payload)
      this.handleSuccess('navBar.snackSuccessCrashReport')
      this.updateStore({ crashReport: payload })
    } catch (error) {
      log.error(error)
      this.handleError('navBar.snackFailCrashReport')
    }
  }

  /* istanbul ignore next */
  async setPermissions(payload) {
    try {
      const response = await this.api.post(`${config.api}/permissions`, payload, this.headers(), { useAPIKey: true })
      log.info('successfully set permissions', response)
    } catch (error) {
      log.error('unable to set permissions', error)
    }
  }

  async setUserLocale(payload) {
    if (payload === this.state()?.locale) return
    try {
      await this.api.patch(`${config.api}/user/locale`, { locale: payload }, this.headers(), { useAPIKey: true })
      this.updateStore({ locale: payload })
      // this.handleSuccess('navBar.snackSuccessLocale')
    } catch (error) {
      // this.handleError('navBar.snackFailLocale')
      log.error('unable to set locale', error)
    }
  }

  async setSelectedCurrency(payload) {
    if (payload.selectedCurrency === this.state()?.selectedCurrency) return
    try {
      await this.api.patch(`${config.api}/user`, { default_currency: payload.selectedCurrency }, this.headers(), { useAPIKey: true })
      this.updateStore({ selectedCurrency: payload.selectedCurrency })
      this.handleSuccess('navBar.snackSuccessCurrency')
    } catch (error) {
      log.error(error)
      this.handleError('navBar.snackFailCurrency')
    }
  }

  async setTKeyOnboardingStatus(payload, address) {
    // This is called before set selected address is assigned
    try {
      await this.api.patch(`${config.api}/user`, { tkey_onboarding_complete: payload }, this.headers(address), { useAPIKey: true })
      this.updateStore({ tKeyOnboardingComplete: payload }, address)
      log.info('successfully updated onboarding status')
    } catch (error) {
      log.error(error, 'unable to set onboarding status')
    }
  }

  /* istanbul ignore next */
  async setVerifier(verifier, verifierId, address) {
    try {
      const response = await this.api.patch(`${config.api}/user/verifier`, { verifier, verifierId }, this.headers(address), { useAPIKey: true })
      log.info('successfully updated verifier info', response)
    } catch (error) {
      log.error('unable to update verifier info', error)
    }
  }

  async setDefaultPublicAddress(ofAddress, address) {
    try {
      const response = await this.api.patch(`${config.api}/user`, { default_public_address: address }, this.headers(ofAddress), { useAPIKey: true })
      this.updateStore({ defaultPublicAddress: address }, ofAddress)
      log.info('successfully updated default public address', response)
    } catch (error) {
      log.error('unable to update default public address', error)
    }
  }

  /* istanbul ignore next */
  getEtherScanTokenBalances(address) {
    return this.api.get(`${config.api}/tokenbalances`, this.headers(address), { useAPIKey: true })
  }

  async getCovalentTokenBalances(address, chainId) {
    const api = `https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/`
    return this.api.get(`${config.api}/covalent?url=${api}`, this.headers(), { useAPIKey: true })
  }

  async getBillboardContents() {
    try {
      const { selectedAddress } = this.store.getState()
      if (!selectedAddress) return
      const resp = await this.api.get(`${config.api}/billboard`, this.headers(), { useAPIKey: true })
      const events = resp.data.reduce((accumulator, event) => {
        if (!accumulator[event.callToActionLink]) accumulator[event.callToActionLink] = {}
        accumulator[event.callToActionLink][event.locale] = event
        return accumulator
      }, {})

      if (events) this.billboardStore.putState(events)
    } catch (error) {
      log.error(error)
    }
  }

  async addContact(payload) {
    try {
      const response = await this.api.post(`${config.api}/contact`, payload, this.headers(), { useAPIKey: true })
      this.updateStore({ contacts: [...this.state().contacts, response.data] })
      this.handleSuccess('navBar.snackSuccessContactAdd')
    } catch {
      this.handleError('navBar.snackFailContactAdd')
    }
  }

  async deleteContact(payload) {
    try {
      const response = await this.api.remove(`${config.api}/contact/${payload}`, {}, this.headers(), { useAPIKey: true })
      const finalContacts = this.state().contacts.filter((contact) => contact.id !== response.data.id)
      this.updateStore({ contacts: finalContacts })
      this.handleSuccess('navBar.snackSuccessContactDelete')
    } catch {
      this.handleError('navBar.snackFailContactDelete')
    }
  }

  async addCustomToken(payload) {
    try {
      // payload is { token_address, network, token_symbol, decimals, token_name }
      const response = await this.api.post(`${config.api}/customtoken`, payload, this.headers(), { useAPIKey: true })
      this.updateStore({ customTokens: [...this.state().customTokens, response.data] })
      this.handleSuccess('navBar.snackSuccessCustomTokenAdd')
    } catch {
      this.handleError('navBar.snackFailCustomTokenAdd')
    }
  }

  async deleteCustomToken(payload) {
    try {
      // payload is id
      const response = await this.api.remove(`${config.api}/customtoken/${payload}`, {}, this.headers(), { useAPIKey: true })
      const customTokens = this.state().customTokens.filter((x) => x.id.toString() !== response.data.id.toString())
      this.updateStore({ customTokens })
      this.handleSuccess('navBar.snackSuccessCustomTokenDelete')
    } catch {
      this.handleError('navBar.snackFailCustomTokenDelete')
    }
  }

  /* istanbul ignore next */
  async revokeDiscord(idToken) {
    try {
      const resp = await this.api.post(`${config.api}/revoke/discord`, { token: idToken }, this.headers(), { useAPIKey: true })
      log.info(resp)
    } catch (error) {
      log.error(error)
    }
  }

  /* istanbul ignore next */
  async patchPastTx(body, address) {
    try {
      const response = await this.api.patch(`${config.api}/transaction`, body, this.headers(address), { useAPIKey: true })
      log.info('successfully patched', response)
    } catch (error) {
      log.error('unable to patch tx', error)
    }
  }

  setSiteMetadata(origin, domainMetadata) {
    this.metadataStore.updateState({ [origin]: domainMetadata })
  }

  setSelectedAddress(address) {
    // if (this.store.getState().selectedAddress === address) return
    this.store.updateState({ selectedAddress: address })
    if (!Object.keys(this.store.getState()).includes(address)) return
    this.recalculatePastTx(address)
    const selectedNetwork = this.network.getNetworkNameFromNetworkCode()
    if (ETHERSCAN_SUPPORTED_NETWORKS.has(selectedNetwork)) {
      this.fetchEtherscanTx(address, selectedNetwork)
    }
    // this.sync()
  }

  /**
   * @param {number} interval
   */
  set interval(interval) {
    if (this._handle) clearInterval(this._handle)
    if (!interval) {
      return
    }
    if (isMain)
      this._handle = setInterval(() => {
        // call here
        const storeSelectedAddress = this.store.getState().selectedAddress
        if (!storeSelectedAddress) return
        if (!this.state(storeSelectedAddress)?.jwtToken) return
        this.sync(storeSelectedAddress)
      }, interval)
  }

  async setUserBadge(payload) {
    const newBadgeCompletion = { ...this.state().badgesCompletion, ...{ [payload]: true } }
    this.updateStore({ badgesCompletion: newBadgeCompletion })
    try {
      await this.api.patch(`${config.api}/user/badge`, { badge: JSON.stringify(newBadgeCompletion) }, this.headers(), { useAPIKey: true })
    } catch (error) {
      log.error('unable to set badge', error)
    }
  }

  async getMessageForSigning(publicAddress) {
    try {
      const response = await this.api.post(
        `${config.api}/auth/message`,
        {
          public_address: publicAddress,
        },
        {},
        { useAPIKey: true }
      )
      return response.message
    } catch (error) {
      log.error(error)
      return undefined
    }
  }

  /* istanbul ignore next */
  async getCovalentNfts(api) {
    return this.api.get(`${config.api}/covalent?url=${api}`, this.headers(), { useAPIKey: true })
  }

  async getNftMetadata(api) {
    return this.api.get(`${config.api}/covalent?url=${api}`, this.headers(), { useAPIKey: true })
  }

  /* istanbul ignore next */
  async getOpenSeaCollectibles(api) {
    return this.api.get(`${config.api}/opensea?url=${api}`, this.headers(), { useAPIKey: true })
  }

  /* istanbul ignore next */
  async getTwitterId(payload) {
    const userId = await this.api.get(`${config.api}/twitter?screen_name=${payload.nick}`, this.headers(), { useAPIKey: true })
    return `${payload.typeOfLogin.toLowerCase()}|${userId.data.toString()}`
  }

  /* istanbul ignore next */
  async sendEmail(payload) {
    return this.api.post(`${config.api}/transaction/sendemail`, payload.emailObject, this.headers(), { useAPIKey: true })
  }

  async getAnnouncementsContents() {
    try {
      const { selectedAddress } = this.store.getState()
      if (!selectedAddress) return
      const resp = await this.api.get(`${config.api}/announcements`, this.headers(), { useAPIKey: true })
      const announcements = resp.data.reduce((accumulator, announcement) => {
        if (!accumulator[announcement.locale]) accumulator[announcement.locale] = []
        accumulator[announcement.locale].push(announcement)
        return accumulator
      }, {})

      if (announcements) this.announcementsStore.putState(announcements)
    } catch (error) {
      log.error(error)
    }
  }

  hideAnnouncement(payload, announcements) {
    const { id } = payload
    const newAnnouncements = Object.keys(announcements).reduce((accumulator, key) => {
      const filtered = announcements[key].filter((x) => x.id !== id)
      accumulator[key] = filtered
      return accumulator
    }, {})

    if (newAnnouncements) this.announcementsStore.putState(newAnnouncements)
  }
}

export default PreferencesController
