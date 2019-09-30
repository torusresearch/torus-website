importScripts('/workbox.min.js')
importScripts('/precache-manifest.js')

workbox.core.setCacheNameDetails({ prefix: 'app' })

self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

self.__precacheManifest = [].concat(self.__precacheManifest || [])
workbox.precaching.precacheAndRoute(self.__precacheManifest, {})
