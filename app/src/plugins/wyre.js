import log from 'loglevel'

import config from '../config'
import { get, post } from '../utils/httpHelpers'

const getQuote = (parameters = {}, headers) => {
  try {
    const options = {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    }
    const url = new URL(`${config.wyreApiHost}/quote`)
    Object.keys(parameters).forEach((key) => url.searchParams.append(key, parameters[key]))
    return get(url.href, options)
  } catch (error) {
    log.error(error)
  }
  return undefined
}

const getWalletOrder = (payload, headers) => {
  try {
    const options = {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    }
    return post(`${config.wyreApiHost}/quote/reserve`, payload, options)
  } catch (error) {
    log.error(error)
  }
  return undefined
}

export { getQuote, getWalletOrder }
