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
    return get(
      `${config.moonpayApiHost}/v3/currencies/${reqObj.digital_currency}/quote?apiKey=${config.moonpayLiveAPIKEY}` +
        `&baseCurrencyAmount=${reqObj.requested_amount}&baseCurrencyCode=${reqObj.fiat_currency}&areFeesIncluded=true`,
      options
    )
  } catch (e) {
    log.error(e)
  }
}

export { getQuote }
