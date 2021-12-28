import log from 'loglevel'

import config from '../config'
import { get, post } from '../utils/httpHelpers'

const getQuote = (requestObject, headers) => {
  try {
    const options = {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    }

    const url = new URL(`${config.banxaApiHost}/quote`)
    Object.keys(requestObject).forEach((key) => url.searchParams.append(key, requestObject[key]))

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
    return post(`${config.banxaApiHost}/order`, payload, options)
  } catch (error) {
    log.error(error)
  }
  return undefined
}

export { getQuote, getWalletOrder }
