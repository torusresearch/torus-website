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
      `${config.transakTestApiQuoteHost}/currencies/price?cryptoCurrency=${requestObject.digital_currency.toUpperCase()}` +
        `&partnerApiapiKey=${config.transakTestAPIKEY}` +
        `&fiatAmount=${requestObject.requested_amount}&fiatCurrency=${requestObject.fiat_currency.toUpperCase()}` +
        '&isBuyOrSell=BUY',
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
    return get(`${config.transakApiHost}/sign?url=${requestObject.url}`, options)
  } catch (error) {
    log.error(error)
  }
  return undefined
}

export { getQuote, getSignature }
