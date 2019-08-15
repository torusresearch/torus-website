// request permission on page load

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
    console.log('Notification permission not granted.')
    Notification.requestPermission()
  } else {
    //console.log(url)
    console.log('notification permission granted.')
    var notification = new Notification('Confirmed trasaction', {
      body: 'View of etherscan'
    })

    notification.onclick = function() {
      window.open(url)
    }
  }
}

export { initNotifications, notifyUser }
