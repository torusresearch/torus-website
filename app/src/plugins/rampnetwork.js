import log from 'loglevel'

import config from '../config'
import { get } from '../utils/httpHelpers'

const getQuote = () => {
  let response
  try {
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }
    response = get(`${config.rampApiQuoteHost}`, options)
  } catch (error) {
    log.error(error)
  }
  return response
}

export default getQuote
