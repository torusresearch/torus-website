import log from 'loglevel'

import config from '../config'
import { get } from '../utils/httpHelpers'

export const getQuote = (requestObject, headers) => {
  try {
    const options = {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    }
    return get(
      `${config.mercuryoApiHost}/quote?widget_id=${config.mercuryoLiveAPIKEY}&type=buy` +
        `&amount=${requestObject.requested_amount}&from=${requestObject.fiat_currency}&to=${requestObject.digital_currency}`,
      options
    )
  } catch (error) {
    log.error(error)
  }
  return undefined
}

export const getSignature = (requestObject) => {
  try {
    const options = {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }
    return get(`${config.mercuryoApiHost}/sign?address=${requestObject.address}`, options)
  } catch (error) {
    log.error(error)
  }
  return undefined
}
