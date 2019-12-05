import config from '../config'
import { post, get } from '../utils/httpHelpers'
import log from 'loglevel'

const postQuote = (reqObj, headers) => {
  try {
    const options = {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...headers
      }
    }
    return post(`${config.coindirectHost}/api/v1/quote`, reqObj, options)
  } catch (e) {
    log.error(e)
  }
}

export { postQuote }
