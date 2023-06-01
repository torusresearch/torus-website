import log from 'loglevel'

import { isMain } from './utils'

function initNotifications() {
  document.addEventListener('DOMContentLoaded', () => {
    if (Notification.permission !== 'granted') Notification.requestPermission()
  })
}

function notifyUser(url) {
  if (!Notification || !navigator.serviceWorker) {
    log.info('Desktop notifications not available')
    return
  }
  if (!isMain && Notification.permission !== 'granted') return
  if (Notification.permission === 'granted') {
    notifyUrl(url)
    return
  }
  // for safari
  try {
    Notification.requestPermission()
      .then((result) => {
        // do sth
        if (result !== 'granted') {
          return
        }
        notifyUrl(url)
      })
      .catch((error) => log.error(error))
  } catch (error) {
    log.error(error)
    if (error instanceof TypeError) {
      Notification.requestPermission((result) => {
        // do sth
        if (result !== 'granted') {
          return
        }
        notifyUrl(url)
      })
    }
  }
}

function notifyUrl(url) {
  navigator.serviceWorker
    .getRegistration()
    .then((registration) => {
      if (registration) {
        registration.showNotification('Sent Transaction', {
          body: 'Check Tx Status',
          icon: 'favicon.png',
          actions: [{ action: 'close', title: 'Close Notification', icon: 'images/close.svg' }],
          vibrate: [100, 50, 100],
          tag: 'transaction-status',
          data: {
            dateOfArrival: Date.now(),
            url,
          },
        })
      }
    })
    .catch((error) => log.error(error))
}

export { initNotifications, notifyUser }
