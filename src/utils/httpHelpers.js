import { get } from '@toruslabs/http-helpers'
import log from 'loglevel'

export { get, patch, post, put, remove } from '@toruslabs/http-helpers'

export const promiseRace = (url, options, timeout) => {
  log.info('promise race', url)
  return Promise.race([
    get(url, options),
    new Promise((resolve, reject) => {
      const id = setTimeout(() => {
        clearTimeout(id)
        reject(new Error('timeout'))
      }, timeout)
    }),
  ])
}
