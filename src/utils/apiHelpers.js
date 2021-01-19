import config from '../config'
import router from '../router'
import * as httpHelpers from './httpHelpers'

export default class ApiHelpers {
  constructor({ dispatch }) {
    this.dispatch = dispatch
    this.get = this._wrap(httpHelpers.get)
    this.post = this._wrap(httpHelpers.post)
    this.patch = this._wrap(httpHelpers.patch)
    this.remove = this._wrap(httpHelpers.remove)
  }

  _wrap(fn) {
    return async (...args) => {
      try {
        return await fn(...args)
      } catch (error) {
        if (error.status === 401) {
          const body = await error.json()
          if (body.error === 'Token expired') return this.logOut()
        }
        throw error
      }
    }
  }

  async getWalletOrders(parameters = {}, headers) {
    const options = {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...headers,
      },
    }
    const url = new URL(`${config.api}/transaction`)
    Object.keys(parameters).forEach((key) => url.searchParams.append(key, parameters[key]))
    return this.get(url.href, options)
  }

  async getPastOrders(parameters = {}, headers) {
    const options = {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...headers,
      },
    }
    const url = new URL(`${config.commonApiHost}/transaction`)
    Object.keys(parameters).forEach((key) => url.searchParams.append(key, parameters[key]))
    return this.get(url.href, options)
  }

  async getEtherscanTransactions(parameters = {}, headers) {
    const options = {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...headers,
      },
    }
    const url = new URL(`${config.api}/etherscan`)
    Object.keys(parameters).forEach((key) => url.searchParams.append(key, parameters[key]))
    return this.get(url.href, options, { useAPIKey: true })
  }

  async logOut() {
    await this.dispatch('logOut')
    await router.push({ name: 'logout' })
  }
}
