/* eslint-disable unicorn/prefer-add-event-listener */
/* eslint-disable unicorn/prefer-top-level-await */

import Bowser, { BROWSER_MAP, OS_MAP } from 'bowser'
import log from 'loglevel'

import { isMain } from './utils/utils'

const serviceWorkerUrl = `${process.env.BASE_URL}service-worker.js`

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
    .register(swUrl, { updateViaCache: 'imports', scope: process.env.BASE_URL })
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
      log.warn('Error during service worker registration:', error)
    })
}

function checkValidServiceWorker(swUrl, config) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl, {
    cache: 'no-cache',
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      // Ensure service worker exists, and that we really are getting a JS file.
      const contentType = response.headers.get('content-type')
      if (response.status === 404 || (contentType != null && !contentType.includes('javascript'))) {
        // No service worker found. Probably a different app. Reload the page.

        navigator.serviceWorker.ready
          .then((registration) => registration.unregister())
          .then(() => {
            if (isMain && !window.loginInProgress) {
              log.info('can reload now to update app')
            }
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

const browserInfo = Bowser.parse(navigator.userAgent)
log.info(JSON.stringify(browserInfo), 'current browser info')

// Firefox and iOS Chrome
const canExcludeSw =
  browserInfo.browser.name === BROWSER_MAP.firefox || (browserInfo.os.name === OS_MAP.iOS && browserInfo.browser.name === BROWSER_MAP.chrome)

if (canExcludeSw && 'serviceWorker' in navigator) {
  // remove service worker for firefox
  navigator.serviceWorker
    .getRegistrations()
    .then((x) => x.map((y) => y.unregister()))
    .catch((error) => log.error(error))
} else {
  swregister()
}

function swregister() {
  if ('serviceWorker' in navigator && ['production', 'binance', 'testing', 'lrc', 'bnb', 'polygon'].includes(process.env.VUE_APP_TORUS_BUILD_ENV)) {
    log.info('non-integrity sw')
    // if swIntegrity is not calculated
    register({
      onUpdate: (registration) => {
        const waitingServiceWorker = registration.waiting

        if (waitingServiceWorker) {
          waitingServiceWorker.addEventListener('statechange', (event) => {
            if (event?.target?.state === 'activated' && isMain) {
              log.info('can reload now to update app')
            }
          })
          waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' })
        }
      },
    })
  }
}
