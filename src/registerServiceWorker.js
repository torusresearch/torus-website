import log from 'loglevel'

import generateIntegrity from './utils/integrity'
import { isMain } from './utils/utils'

const swIntegrity = 'SERVICE_WORKER_SHA_INTEGRITY' // string-replaced
const serviceWorkerUrl = `${process.env.BASE_URL}service-worker.js`
const expectedCacheControlHeader = 'max-age=3600'

// This optional code is used to register a service worker.
// register() is not called by default.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

// To learn more about the benefits of this model and instructions on how to
// opt-in, read https://cra.link/PWA

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4]\d|[01]?\d{1,2})){3}$/)
)

export function register(config) {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    // The URL constructor is available in all browsers that support SW.
    const publicUrl = new URL(process.env.BASE_URL || '/', window.location.href)
    if (publicUrl.origin !== window.location.origin) {
      // Our service worker won't work if BASE_URL is on a different origin
      // from what our page is served on. This might happen if a CDN is used to
      // serve assets; see https://github.com/facebook/create-react-app/issues/2374
      return
    }

    window.addEventListener('load', () => {
      const swUrl = serviceWorkerUrl
      if (isLocalhost) {
        // This is running on localhost. Let's check if a service worker still exists or not.
        checkValidServiceWorker(swUrl, config)

        // Add some additional logging to localhost, pointing developers to the
        // service worker/PWA documentation.
        navigator.serviceWorker.ready
          .then(() => {
            log.info('This web app is being served cache-first by a service worker')
          })
          .catch(log.error)
      } else {
        // Is not localhost. Just register service worker
        registerValidSW(swUrl, config)
      }
    })
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl, { updateViaCache: 'all', scope: process.env.BASE_URL })
    .then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing
        if (installingWorker == null) {
          return
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // At this point, the updated precached content has been fetched,
              // but the previous service worker will still serve the older
              // content until all client tabs are closed.
              log.info('New content is available and will be used when all tabs for this page are closed.')

              // Execute callback
              if (config && config.onUpdate) {
                config.onUpdate(registration)
              }
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a
              // "Content is cached for offline use." message.
              log.info('Content is cached for offline use.')

              // Execute callback
              if (config && config.onSuccess) {
                config.onSuccess(registration)
              }
            }
          }
        }
      }
    })
    .catch((error) => {
      log.error('Error during service worker registration:', error)
    })
}

function checkValidServiceWorker(swUrl, config) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      // Ensure service worker exists, and that we really are getting a JS file.
      const contentType = response.headers.get('content-type')
      if (response.status === 404 || (contentType != null && !contentType.includes('javascript'))) {
        // No service worker found. Probably a different app. Reload the page.
        // eslint-disable-next-line promise/no-nesting
        navigator.serviceWorker.ready
          .then((registration) => registration.unregister())
          .then(() => {
            if (isMain) window.location.reload()
          })
          .catch(log.error)
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl, config)
      }
    })
    .catch(() => {
      log.info('No internet connection found. App is running in offline mode.')
    })
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister()
      })
      .catch((error) => {
        log.error(error.message)
      })
  }
}

if (
  'serviceWorker' in navigator &&
  (process.env.VUE_APP_TORUS_BUILD_ENV === 'production' ||
    process.env.VUE_APP_TORUS_BUILD_ENV === 'binance' ||
    process.env.VUE_APP_TORUS_BUILD_ENV === 'testing' ||
    process.env.VUE_APP_TORUS_BUILD_ENV === 'lrc')
) {
  log.info('non-integrity sw')
  // if swIntegrity is not calculated
  if (swIntegrity === ['SERVICE', 'WORKER', 'SHA', 'INTEGRITY'].join('_')) {
    register({
      onUpdate: (registration) => {
        const waitingServiceWorker = registration.waiting

        if (waitingServiceWorker) {
          waitingServiceWorker.addEventListener('statechange', (event) => {
            if (event?.target?.state === 'activated' && isMain) window.location.reload()
          })
          waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' })
        }
      },
    })
  } else {
    log.info('full integrity sw')
    // Check on existing service worker registration(s)
    // if there are errors, remove all service workers first
    let swRegistrations
    navigator.serviceWorker
      .getRegistration()
      .then((reg) => {
        log.info('checking existing service worker registration')
        return new Promise((resolve) => {
          const response = {
            err: null,
            sw: null,
          }
          if (reg === undefined) {
            response.err = new Error('no service worker installed')
          } else if (reg.updateViaCache !== 'all') {
            response.err = new Error('updateViaCache should be "all"')
          } else if (new URL(reg.active.scriptURL).pathname !== serviceWorkerUrl) {
            response.err = new Error(`unexpected scriptURL ${new URL(reg.active.scriptURL).pathname}, expected ${serviceWorkerUrl}`)
          } else {
            response.sw = reg
          }
          resolve(response)
        })
      })
      .then((responseObject) => {
        // if there were errors, we need to re-register the service worker
        if (responseObject.err) {
          const finalArray = []
          finalArray.push(navigator.serviceWorker.register(serviceWorkerUrl, { updateViaCache: 'all', scope: process.env.BASE_URL }))
          return Promise.all(finalArray)
        }
        return Promise.all([Promise.resolve(responseObject.sw)])
      })
      .then((swRegs) => {
        log.info(swRegs, 'final regs')
        swRegistrations = swRegs
        // Although the service worker is registered, its integrity has not been checked.
        // This is impossible to circumvent, service worker initial registrations always
        // bypass HTML cache. Instead, we ensure that the service worker was already registered,
        // force-fetch the service worker file from the server and check that its cached
        // and then we use this cached file to *update* the service worker
        return fetch(serviceWorkerUrl, {
          cache: 'reload',
        })
      })
      .then(async (resp) => {
        // if Cache-Control headers are not as expected, throw
        if (resp.headers.get('Cache-Control') !== expectedCacheControlHeader) {
          throw new Error(`Unexpected Cache-Control headers, got ${resp.headers.get('Cache-Control')}`)
        }
        // if response data fails integrity check, throw
        const text = await resp.text()
        const integrity = generateIntegrity(
          {
            algorithms: ['sha384'],
          },
          text
        )
        if (integrity !== swIntegrity) {
          throw new Error(`Service worker integrity check failed, expected ${swIntegrity} got ${integrity}`)
        }
        // update the service worker, which should fetch the file from cache
        return swRegistrations && swRegistrations.forEach((x) => x.update())
      })
      .catch((error) => {
        // if failed to fetch, throw
        throw new Error(`Could not fetch service worker from server, ${error.toString()}`)
      })
      .then((updatedSwRegs) => {
        log.info('Successfully registered secure service worker', updatedSwRegs)
      })
      .catch((error) => {
        log.warn('Could not complete service worker installation process, error: ', error)
        // throw new Error('Could not install service worker')
      })
  }
}
