import log from 'loglevel'

import config from '../config'
import { post } from '../utils/httpHelpers'

const postQuote = (body) => {
  let response
  try {
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }
    response = post(`${config.rampApiQuoteHost}`, body, options)
  } catch (error) {
    log.error(error)
  }
  return response
}

export default postQuote
