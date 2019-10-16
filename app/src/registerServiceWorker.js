/* eslint-disable no-console */

import { register } from 'register-service-worker'
import log from 'loglevel'

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      log.info('App is being served from cache by a service worker.\n' + 'For more details, visit https://goo.gl/AFskqB')
    },
    registered() {
      caches.keys().then(keys => keys.map(key => caches.delete(key)))
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
}
