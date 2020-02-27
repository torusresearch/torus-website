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
    return post(`${config.simplexApiHost}/quote`, reqObj, options)
  } catch (e) {
    log.error(e)
  }
}
const postOrder = (reqObj, headers) => {
  try {
    const options = {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...headers
      }
    }
    return post(`${config.simplexApiHost}/order`, reqObj, options)
  } catch (e) {
    log.error(e)
  }
}

const getStatus = (userId, headers) => {
  try {
    return get(`${config.simplexApiHost}/status/${userId}`, {
      headers: headers
    })
  } catch (e) {
    log.error(e)
  }
}
export { postQuote, postOrder, getStatus }
