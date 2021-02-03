import log from 'loglevel'

import config from '../config'
import { get, patch, post, remove } from './httpHelpers'

export default class ApiHelpers {
  constructor(getDispatch) {
    this.getDispatch = getDispatch
    this.get = this._wrap(get)
    this.patch = this._wrap(patch)
    this.post = this._wrap(post)
    this.remove = this._wrap(remove)
  }

  _wrap(fn) {
    return async (...args) => {
      try {
        const result = await fn(...args)
        return result
      } catch (error) {
        if (error.status === 401) {
          const body = await error.json()
          if (body.error === 'Token expired') {
            log.warn('Token expired')
            await this.logOut()
          }
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
    return this.getDispatch()('logOut')
  }
}
