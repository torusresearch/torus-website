// request permission on page load
const log = require('loglevel')

function initNotifications() {
  document.addEventListener('DOMContentLoaded', function() {
    if (Notification.permission !== 'granted') Notification.requestPermission()
  })
}

function notifyUser(url) {
  if (!Notification || !navigator.serviceWorker) {
    log.info('Desktop notifications not available')
    return
  }
  Notification.requestPermission().then(result => {
    // do sth
    if (result !== 'granted') {
      return
    }
    navigator.serviceWorker.getRegistration().then(registration => {
      registration.showNotification('Sent Transaction', {
        body: 'Check Tx Status',
        icon: 'favicon.png',
        actions: [{ action: 'close', title: 'Close Notification', icon: 'img/icons/close.svg' }],
        vibrate: [100, 50, 100],
        tag: 'transaction-status',
        data: {
          dateOfArrival: Date.now(),
          url: url
        }
      })
    })
  })
}

export { initNotifications, notifyUser }
