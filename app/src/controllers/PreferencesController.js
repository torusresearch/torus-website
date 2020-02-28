import ObservableStore from 'obs-store'
import log from 'loglevel'
import { prettyPrintData, isErrorObj } from '../utils/permissionUtils'
import config from '../config'
import { patch, get, post, remove, getPastOrders } from '../utils/httpHelpers'
import { LOCALE_EN, THEME_LIGHT_BLUE_NAME, ERROR_TIME, SUCCESS_TIME } from '../utils/enums'
import { getIFrameOrigin } from '../utils/utils'

// By default, poll every 1 minute
const DEFAULT_INTERVAL = 180 * 1000

class PreferencesController {
  /**
   *
   * @typedef {Object} PreferencesController
   * @param {Object} opts - Overrides the defaults for the initial state of this.store
   * @property {object} store The stored object containing a users preferences, stored in torus-backend
   * @property {string} store.selectedAddress A hex string that matches the currently selected address in the app
   * @property {string} store.selectedCurrency A string showing the user selected currency
   * @property {Array} store.pastTransactions A list of past Transactions of user
   * @property {string} store.theme the user selected theme
   * @property {string} store.locale the user selected locale
   * @property {Array} store.billboard the contents of torus-billboard (depends on the locale)
   * @property {Array} store.contacts the contacts of the user
   * @property {object} store.permissions the stored permissions of the user for different domains
   * @property {string} store.jwtToken the token used to communicate with torus-backend
   */
  constructor(opts = {}) {
    const initState = {
      selectedAddress: '',
      selectedCurrency: 'USD',
      pastTransactions: [],
      theme: THEME_LIGHT_BLUE_NAME,
      locale: LOCALE_EN,
      billboard: [],
      contacts: [],
      permissions: [],
      paymentTx: [],
      ...opts.initState
    }

    this.interval = DEFAULT_INTERVAL
    this.jwtToken = ''
    this._jwtToken = ''
    this.store = new ObservableStore(initState)
    this.metadataStore = new ObservableStore({})
    this.errorStore = new ObservableStore('')
    this.successStore = new ObservableStore('')
  }

  set jwtToken(token) {
    this._jwtToken = token
    token && this.getBillboardContents()
  }

  get headers() {
    return {
      headers: {
        Authorization: `Bearer ${this._jwtToken}`,
        'Content-Type': 'application/json; charset=utf-8'
      }
    }
  }

  handleError(err) {
    if (isErrorObj(err)) {
      this.errorStore.putState(`Oops, That didn't work. Pls reload and try again. \n${error.message}`)
    } else if (err && typeof err === 'string') {
      this.errorStore.putState(err)
    } else if (err && typeof err === 'object') {
      const prettyError = prettyPrintData(err)
      const payloadError = prettyError !== '' ? `Error: ${prettyError}` : 'Something went wrong. Pls try again'
      this.errorStore.putState(payloadError)
    } else {
      this.errorStore.putState(payloadError || '')
    }
    setTimeout(() => this.errorStore.putState(''), ERROR_TIME)
  }

  handleSuccess(msg) {
    if (msg && typeof msg === 'string') {
      this.successStore.putState(msg)
    } else if (msg && typeof msg === 'object') {
      const prettyMsg = prettyPrintData(msg)
      const payloadMsg = prettyMsg !== '' ? `Error: ${prettyMsg}` : 'Something went wrong. Pls try again'
      this.successStore.putState(payloadMsg)
    } else {
      this.successStore.putState(msg || '')
    }
    setTimeout(() => this.successStore.putState(''), SUCCESS_TIME)
  }

  sync(cb, errorCb) {
    Promise.all([
      get(`${config.api}/user`, this.headers).catch(_ => {
        errorCb && errorCb()
      }),
      getPastOrders({}, this.headers.headers)
    ]).then(([user, paymentTx]) => {
      if (user && user.data) {
        const { transactions, contacts, theme, locale, verifier, verifier_id, permissions } = user.data || {}
        this.store.updateState({
          contacts,
          pastTransactions: transactions,
          theme,
          locale: locale || LOCALE_EN,
          paymentTx: paymentTx.data,
          permissions
        })
        if (!verifier || !verifier_id) this.setVerifier(verifier, verifier_id)
        cb && cb(user)
        // this.permissionsController._initializePermissions(permissions)
      }
    })
  }

  createUser(selectedCurrency, theme, verifier, verifierId, locale) {
    return post(
      `${config.api}/user`,
      {
        default_currency: selectedCurrency,
        theme,
        verifier,
        verifierId,
        locale
      },
      this.headers
    )
  }

  storeUserLogin(verifier, verifierId, payload) {
    let userOrigin = ''
    if (payload && payload.calledFromEmbed) {
      userOrigin = getIFrameOrigin()
    } else userOrigin = window.location.origin
    if (!payload.rehydrate)
      post(
        `${config.api}/user/recordLogin`,
        {
          hostname: userOrigin,
          verifier,
          verifierId
        },
        this.headers
      )
  }

  async setUserTheme(payload) {
    if (payload === this.store.getState().theme) return
    try {
      const resp = await patch(`${config.api}/user/theme`, { theme: payload }, this.headers)
      this.handleSuccess('navBar.snackSuccessTheme' || (resp && resp.data) || resp)
      this.store.updateState({ theme: payload })
    } catch (error) {
      this.handleError('navBar.snackFailTheme')
    }
  }

  async setPermissions(payload) {
    try {
      const response = await post(`${config.api}/permissions`, payload, this.headers)
      log.info('successfully set permissions', response)
    } catch (error) {
      log.error('unable to set permissions', error)
    }
  }

  async setUserLocale(payload) {
    if (payload === this.store.getState().locale) return
    try {
      await patch(`${config.api}/user/locale`, { locale: payload }, this.headers)
      this.store.updateState({ locale: payload })
      this.handleSuccess('navBar.snackSuccessLocale')
    } catch (error) {
      this.handleError('navBar.snackFailLocale')
    }
  }

  async setSelectedCurrency(payload) {
    if (payload.selectedCurrency === this.store.getState().selectedCurrency) return
    try {
      await patch(`${config.api}/user`, { default_currency: payload.selectedCurrency }, this.headers)
      this.store.updateState({ selectedCurrency: payload.selectedCurrency })
      this.handleSuccess('navBar.snackSuccessCurrency')
    } catch (error) {
      this.handleError('navBar.snackFailCurrency')
    }
  }

  async setVerifier(verifier, verifierId) {
    try {
      await patch(`${config.api}/user/verifier`, { verifier, verifierId }, this.headers)
      log.info('successfully updated verifier info', response)
    } catch (error) {
      log.error('unable to update verifier info', error)
    }
  }

  getEtherScanTokenBalances() {
    return get(`${config.api}/tokenbalances`, this.headers)
  }

  async getBillboardContents() {
    try {
      const resp = await get(`${config.api}/billboard`, this.headers)
      const events = resp.data.reduce((acc, event) => {
        if (!acc[event.callToActionLink]) acc[event.callToActionLink] = {}
        acc[event.callToActionLink][event.locale] = event
        return acc
      }, [])

      if (events) this.store.updateState({ billboard: events })
    } catch (error) {
      log.error(error)
    }
  }

  async addContact(payload) {
    try {
      const response = await post(`${config.api}/contact`, payload, this.headers)
      this.store.updateState({ contacts: [...this.store.getState().contacts, response.data] })
      this.handleSuccess('navBar.snackSuccessContactAdd')
    } catch (error) {
      this.handleError('navBar.snackFailContactAdd')
    }
  }

  async deleteContact(payload) {
    try {
      const response = await remove(`${config.api}/contact/${payload}`, {}, this.headers)
      const finalContacts = this.store.getState().contacts.filter(contact => contact.id !== response.data.id)
      this.store.updateState({ contacts: finalContacts })
      this.handleSuccess('navBar.snackSuccessContactDelete')
    } catch (error) {
      this.handleError('navBar.snackFailContactDelete')
    }
  }

  async revokeDiscord(idToken) {
    try {
      const resp = await post(`${config.api}/revoke/discord`, { token: idToken }, this.headers)
      log.info(resp)
    } catch (error) {
      log.error(error)
    }
  }

  setSiteMetadata(origin, domainMetadata) {
    this.metadataStore.updateState({ [origin]: domainMetadata })
  }

  setSelectedAddress(address) {
    this.store.updateState({ selectedAddress: address })
    this.sync()
  }

  /**
   * @param {number} interval
   */
  set interval(interval) {
    this._handle && clearInterval(this._handle)
    if (!interval) {
      return
    }
    this._handle = setInterval(() => {
      // call here
      if (!this._jwtToken) return
      this.sync()
    }, interval)
  }
}

export default PreferencesController
