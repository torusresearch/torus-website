import config from '../config'
import { post, get } from '../utils/httpHelpers'

const getQuote = reqObj => {
  try {
    const options = {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    }
    return post(`${config.simplexHost}/quote`, reqObj, options)
  } catch (e) {
    console.error(e)
  }
}
const getOrder = reqObj => {
  try {
    const options = {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    }
    return post(`${config.simplexHost}/order`, reqObj, options)
  } catch (e) {
    console.error(e)
  }
}

const getStatus = userId => {
  try {
    return get(`${config.simplexHost}/status/${userId}`)
  } catch (e) {
    console.error(e)
  }
}
export { getQuote, getOrder, getStatus }
