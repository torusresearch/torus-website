import log from 'loglevel'

import config from '../config'
import { post } from '../utils/httpHelpers'

const postQuote = (requestObject, headers) => {
  try {
    const urlencoded = new URLSearchParams()
    Object.keys(requestObject).forEach((x) => {
      urlencoded.append(x, requestObject[x])
    })
    const options = {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...headers,
      },
    }
    return post(`${config.xanpoolApiQuoteHost}`, urlencoded, options, { isUrlEncodedData: true })
  } catch (error) {
    log.error(error)
  }
  return undefined
}
export default postQuote
