import { post } from '@toruslabs/http-helpers'

import config from '../config'

export const getQuoteFromBackend = async (data) => {
  const response = await post(`${config.api}/uniswap/quote`, data)
  if (response.success) {
    return response.data
  }
  return null
}
