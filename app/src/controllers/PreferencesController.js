import ObservableStore from 'obs-store'
import log from 'loglevel'
import { addInternalMethodPrefix, addTorusMethodPrefix, prettyPrintData, isErrorObj } from '../utils/permissionUtils'
import config from '../config'
import { patch, get, post, getPastOrders } from '../utils/httpHelpers'
import { LOCALE_EN, THEME_LIGHT_BLUE_NAME, ERROR_TIME, SUCCESS_TIME } from '../utils/enums'

// By default, poll every 1 minute
const DEFAULT_INTERVAL = 60 * 1000

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
    this.errorStore = new ObservableStore('')
    this.successStore = new ObservableStore('')
  }

  set jwtToken(token) {
    this._jwtToken = token
    token && this.getBillboardContents()
  }

  get headers() {
    return {
      Authorization: `Bearer ${this._jwtToken}`,
      'Content-Type': 'application/json; charset=utf-8'
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

  handlePromise(promise, { successCb, successMsg }, { errorCb, errorMsg }) {
    promise
      .then(resp => {
        this.handleSuccess(successMsg || (resp && resp.data) || resp)
        successCb && successCb(resp)
      })
      .catch(err => {
        this.handleError(errorMsg || err)
        errorCb && errorCb()
      })
  }

  sync(cb, errorCb) {
    Promise.all([
      get(`${config.api}/user`, {
        headers: this.headers
      }).catch(_ => {
        errorCb && errorCb()
      }),
      getPastOrders({}, this.headers)
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
      {
        headers: this.headers
      }
    )
  }

  storeUserLogin(verifier, verifierId, payload) {
    let userOrigin = ''
    if (payload && payload.calledFromEmbed) {
      userOrigin = window.location.ancestorOrigins ? window.location.ancestorOrigins[0] : document.referrer
    } else userOrigin = window.location.origin
    if (!payload.rehydrate)
      post(
        `${config.api}/user/recordLogin`,
        {
          hostname: userOrigin,
          verifier,
          verifierId
        },
        {
          headers: this.headers
        }
      )
  }

  setUserTheme(payload) {
    if (payload !== this.store.getState().theme)
      this.handlePromise(
        patch(
          `${config.api}/user/theme`,
          {
            theme: payload
          },
          {
            headers: this.headers
          }
        ),
        {
          successCb: () => {
            this.store.updateState({ theme: payload })
          },
          successMsg: 'successfully updated theme'
        },
        {
          errorMsg: 'unable to update theme'
        }
      )
  }

  setPermissions(payload) {
    post(`${config.api}/permissions`, payload, {
      headers: this.headers
    })
      .then(response => {
        log.info('successfully set permissions', response)
      })
      .catch(err => {
        log.error(err, 'unable to patch permissions info')
      })
  }

  setUserLocale(payload) {
    if (payload !== this.store.getState().locale)
      this.handlePromise(
        patch(
          `${config.api}/user/locale`,
          {
            locale: payload
          },
          {
            headers: this.headers
          }
        ),
        {
          successCb: () => {
            this.store.updateState({ locale: payload })
          },
          successMsg: 'successfully updated locale'
        },
        {
          errorMsg: 'unable to update locale'
        }
      )
  }

  setSelectedCurrency(payload) {
    if (payload.selectedCurrency !== this.store.getState().selectedCurrency)
      this.handlePromise(
        patch(
          `${config.api}/user`,
          {
            default_currency: payload.selectedCurrency
          },
          {
            headers: this.headers
          }
        ),
        {
          successCb: () => {
            this.store.updateState({ selectedCurrency: payload.selectedCurrency })
          },
          successMsg: 'successfully patched currency info'
        },
        {
          errorMsg: 'unable to patch currency info'
        }
      )
  }

  setVerifier(verifier, verifierId) {
    patch(
      `${config.api}/user/verifier`,
      { verifier, verifierId },
      {
        headers: this.headers
      }
    )
      .then(response => {
        log.info('successfully patched', response)
      })
      .catch(err => {
        log.error(err, 'unable to patch verifier info')
      })
  }

  getEtherScanTokenBalances() {
    return get(`${config.api}/tokenbalances`, {
      headers: this.headers
    })
  }

  getBillboardContents() {
    get(`${config.api}/billboard`, {
      headers: this.headers
    })
      .then(resp => {
        const events = []
        resp.data.forEach(event => {
          if (!events[event.callToActionLink]) events[event.callToActionLink] = {}
          events[event.callToActionLink][event.locale] = event
        })

        if (events) this.store.updateState({ billboard: events })
      })
      .catch(err => log.error(err))
  }

  addContact(payload) {
    this.handlePromise(
      post(`${config.api}/contact`, payload, {
        headers: this.headers
      }),
      {
        successCb: response => {
          this.store.updateState({ contacts: [...this.store.getState().contacts, response.data] })
        },
        successMsg: 'successfully added contact'
      },
      {
        errorMsg: 'Unable to add contact'
      }
    )
  }

  deleteContact(payload) {
    this.handlePromise(
      remove(
        `${config.api}/contact/${payload}`,
        {},
        {
          headers: this.headers
        }
      ),
      {
        successCb: response => {
          const finalContacts = this.store.getState().contacts.filter(contact => contact.id !== response.data.id)
          this.store.updateState({ contacts: finalContacts })
        },
        successMsg: 'Successfully deleted contact'
      },
      {
        errorMsg: 'Unable to delete contact'
      }
    )
  }

  setSelectedAddress(address) {
    this.store.updateState({ selectedAddress: address })
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
