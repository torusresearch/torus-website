import config from '../config'
import { get } from '../utils/httpHelpers'
import log from 'loglevel'

const getQuote = reqObj => {
  try {
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    }
    return get(`${config.rampInstantAssets}`, options)
  } catch (e) {
    log.error(e)
  }
}

export { getQuote }
