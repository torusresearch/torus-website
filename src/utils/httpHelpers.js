import { get, patch, post, remove } from '@toruslabs/http-helpers'
import log from 'loglevel'

import config from '../config'

export { get, patch, post, remove }

export const getWalletOrders = (parameters = {}, headers) => {
  try {
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
    return get(url.href, options)
  } catch (error) {
    log.error(error)
    return undefined
  }
}

export const getPastOrders = (parameters = {}, headers) => {
  try {
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
    return get(url.href, options)
  } catch (error) {
    log.error(error)
    return undefined
  }
}

export const promiseRace = (url, options, timeout) => {
  log.info('promise race', url)
  return Promise.race([
    get(url, options),
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('timeout'))
      }, timeout)
    }),
  ])
}

export const getEtherscanTransactions = (parameters = {}, headers) => {
  try {
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
    return get(url.href, options, { useAPIKey: true })
  } catch (error) {
    log.error(error)
    return undefined
  }
}
