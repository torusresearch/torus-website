// request permission on page load
const log = require('loglevel')

function initNotifications() {
  document.addEventListener('DOMContentLoaded', function() {
    if (Notification.permission !== 'granted') Notification.requestPermission()
  })
}

function notifyUser(url) {
  if (!Notification) {
    alert('Desktop notifications not available in your browser. Try Chromium.')
    return
  }

  if (Notification.permission !== 'granted') {
    log.info('Notification permission not granted.')
    Notification.requestPermission()
  } else {
    //log.info(url)
    log.info('notification permission granted.')
    var notification = new Notification('Confirmed Transaction', {
      body: 'View on Etherscan'
    })

    notification.onclick = function() {
      window.open(url)
    }
  }
}

export { initNotifications, notifyUser }
