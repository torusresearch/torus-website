import { WALLET_METHOD_PREFIX, TORUS_METHOD_PREFIX } from './enums'

export const addInternalMethodPrefix = method => {
  return `${WALLET_METHOD_PREFIX}_${method}`
}

export const addTorusMethodPrefix = method => {
  return `${TORUS_METHOD_PREFIX}_${method}`
}

export const prettyPrintData = data => {
  let finalString = ''
  Object.keys(data).forEach(x => {
    finalString = `${finalString}\n${x}: ${data[x]}`
  })
  return finalString
}

export const isErrorObj = err => err && err.stack && err.message
