/* eslint-disable no-console */

import { register } from 'register-service-worker'
import log from 'loglevel'
import sriToolbox from 'sri-toolbox'

const swIntegrity = 'SERVICE_WORKER_SHA_INTEGRITY' // string-replaced
const swUrl = `${process.env.BASE_URL}service-worker.js`
const expectedCacheControlHeader = 'max-age=3600'

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
  // if swIntegrity is not calculated
  if (swIntegrity === ['SERVICE', 'WORKER', 'SHA', 'INTEGRITY'].join('_')) {
    register(swUrl, {
      ready() {
        log.info('App is being served from cache by a service worker.\n' + 'For more details, visit https://goo.gl/AFskqB')
      },
      registered() {
        log.info('Service worker has been registered.')
      },
      cached() {
        log.info('Content has been cached for offline use.')
      },
      updatefound() {
        log.info('New content is downloading.')
      },
      updated() {
        log.info('New content is available; please refresh.')
      },
      offline() {
        log.info('No internet connection found. App is running in offline mode.')
      },
      error(error) {
        log.error('Error during service worker registration:', error)
      }
    })
  } else {
    // Check on existing service worker registration(s)
    // if there are errors, remove all service workers first
    navigator.serviceWorker
      .getRegistrations()
      .then(function(regs) {
        let resolve
        let response = {
          err: null,
          sw: null
        }
        let promise = new Promise(function(res, rej) {
          resolve = res
        })
        var removeRegsAndResolveWithError = function(errorMessage) {
          response.err = new Error(errorMessage)
          log.error(response.err)
          const promises = []
          navigator.serviceWorker.getRegistrations().then(function(arr) {
            arr.map(function(reg) {
              promises.push(reg.unregister())
            })
          })
          Promise.all(promises).finally(function() {
            resolve(response)
          })
        }
        if (regs.length === 0) {
          resolve({
            err: new Error('no service worker installed')
          })
        } else if (regs.length > 1) {
          removeRegsAndResolveWithError('Should only have one service worker registered')
        } else if (regs[0].updateViaCache !== 'all') {
          removeRegsAndResolveWithError('updateViaCache should be "all"')
        } else if (new URL(regs[0].active.scriptURL).pathname !== swUrl) {
          removeRegsAndResolveWithError(`unexpected scriptURL ${new URL(regs[0].active.scriptURL).pathname}, expected ${swUrl}`)
        } else {
          response.sw = regs[0]
          resolve(response)
        }
        return promise
      })
      .then(responseObj => {
        // if there were errors, we need to re-register the service worker
        if (responseObj.err) {
          return navigator.serviceWorker.register(swUrl, { updateViaCache: 'all', scope: '/' })
        } else {
          return Promise.resolve(responseObj.sw)
        }
      })
      .then(swReg => {
        // Although the service worker is registered, its integrity has not been checked.
        // This is impossible to circumvent, service worker initial registrations always
        // bypass HTML cache. Instead, we ensure that the service worker was already registered,
        // force-fetch the service worker file from the server and check that its cached
        // and then we use this cached file to *update* the service worker
        return fetch(swUrl, {
          cache: 'reload'
        })
          .then(async resp => {
            // if Cache-Control headers are not as expected, throw
            if (resp.headers.get('Cache-Control') !== expectedCacheControlHeader) {
              throw new Error('Unexpected Cache-Control headers, got ' + resp.headers.get('Cache-Control'))
            }
            // if response data fails integrity check, throw
            let text = await resp.text()
            let integrity = sriToolbox.generate(
              {
                algorithms: ['sha384']
              },
              text
            )
            if (integrity !== swIntegrity) {
              throw new Error(`Service worker integrity check failed, expected ${swIntegrity} got ${integrity}`)
            }
            // update the service worker, which should fetch the file from cache
            return swReg.update()
          })
          .catch(err => {
            // if failed to fetch, throw
            throw new Error('Could not fetch service worker from server, ' + err.toString())
          })
      })
      .then(updatedSwReg => {
        log.info('Successfully registered secure service worker', updatedSwReg)
      })
      .catch(err => {
        log.error('Could not complete service worker installation process, error: ', err)
        throw new Error('Could not install service worker')
      })
  }
}
