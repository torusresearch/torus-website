import log from 'loglevel'

import config from '../config'
import { get, post } from '../utils/httpHelpers'

const postQuote = (requestObject, headers) => {
  try {
    const options = {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...headers,
      },
    }
    return post(`${config.simplexApiHost}/quote`, requestObject, options)
  } catch (error) {
    log.error(error)
  }
  return undefined
}
const postOrder = (requestObject, headers) => {
  try {
    const options = {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...headers,
      },
    }
    return post(`${config.simplexApiHost}/order`, requestObject, options)
  } catch (error) {
    log.error(error)
  }
  return undefined
}

const getStatus = (userId, headers) => {
  try {
    return get(`${config.simplexApiHost}/status/${userId}`, {
      headers,
    })
  } catch (error) {
    log.error(error)
  }
  return undefined
}
export { getStatus, postOrder, postQuote }
