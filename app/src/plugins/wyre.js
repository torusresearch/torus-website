import config from '../config'
import { get } from '../utils/httpHelpers'
import log from 'loglevel'

const getQuote = (params = {}, headers) => {
  try {
    const options = {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...headers
      }
    }
    const url = new URL(`${config.wyreApiHost}/quote`)
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
    return get(url, options)
  } catch (e) {
    log.error(e)
  }
}

export { getQuote }
