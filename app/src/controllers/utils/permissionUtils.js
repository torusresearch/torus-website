import { TORUS_METHOD_PREFIX, WALLET_METHOD_PREFIX } from '../../utils/enums'

export const addInternalMethodPrefix = (method) => `${WALLET_METHOD_PREFIX}_${method}`

export const addTorusMethodPrefix = (method) => `${TORUS_METHOD_PREFIX}_${method}`

export const prettyPrintData = (data) => {
  let finalString = ''
  Object.keys(data).forEach((x) => {
    finalString = `${finalString}\n${x}: ${data[x]}`
  })
  return finalString
}

export const isErrorObject = (error) => error && error.stack && error.message
