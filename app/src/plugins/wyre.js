import config from '../config'
import { get } from '../utils/httpHelpers'
import log from 'loglevel'

const getQuote = reqObj => {
  try {
    const options = {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    }
    return get(`${config.wyreApiHost}/v3/rates?as=DIVISOR`, options)
  } catch (e) {
    log.error(e)
  }
}

export { getQuote }
