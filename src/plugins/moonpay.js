import log from 'loglevel'

import config from '../config'
import { get } from '../utils/httpHelpers'

const getQuote = (requestObject) => {
  try {
    const options = {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }
    return get(
      `${config.moonpayApiQuoteHost}/v3/currencies/${requestObject.digital_currency}/quote?apiKey=${config.moonpayLiveAPIKEY}` +
        `&baseCurrencyAmount=${requestObject.requested_amount}&baseCurrencyCode=${requestObject.fiat_currency}&areFeesIncluded=true`,
      options
    )
  } catch (error) {
    log.error(error)
  }
  return undefined
}

const getSignature = (requestObject) => {
  try {
    const options = {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${requestObject.token}`,
      },
    }
    return get(`${config.moonpayApiHost}/sign?url=${requestObject.url}`, options)
  } catch (error) {
    log.error(error)
  }
  return undefined
}

export { getQuote, getSignature }
