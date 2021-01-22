import { get, patch, post, remove } from '@toruslabs/http-helpers'
import log from 'loglevel'

export { get, patch, post, remove }

export const promiseRace = (url, options, timeout) => {
  log.info('promise race', url)
  return Promise.race([
    get(url, options),
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('timeout'))
      }, timeout)
    }),
  ])
}
