/* eslint-disable */
// import pre-cache manifest

// workbox port
var precacheController
var listenerAdded = false
var _cacheNameDetails = {
  precache: 'precache-v2',
  prefix: 'workbox',
  suffix: registration.scope,
}
function getScope() {
  return self.registration.scope
}
function getIframeURL() {
  return getScope() + 'popup'
}
var serviceWorkerScriptPath = '/service-worker.js'
function isOrigin() {
  try {
    var newURL = new URL(getScope())
    return newURL.href === newURL.origin
  } catch (err) {
    return false
  }
}

function storeIframeResponseText(url) {
  return caches.open('torus' + getScope()).then(function (cache) {
    return cache.add(url)
  })
}

function getIframeResponseText() {
  return caches.open('torus' + getScope()).then(function (cache) {
    return cache.match(getIframeURL())
  })
}

function precacheAndRoute(entries, opts) {
  precache(entries)
  addRoute(opts)
}

function addRoute(opts) {
  if (!listenerAdded) {
    addFetchListener(opts)
    listenerAdded = true
  }
}
function addFetchListener(opts) {
  var ignoreURLParametersMatching = opts.ignoreURLParametersMatching || [/^utm_/]
  var directoryIndex = opts.directoryIndex || 'index.html'
  var cleanURLs = opts.cleanURLs === undefined ? true : opts.cleanURLs
  var urlManipulation = opts.urlManipulation
  var cacheName = _createCacheName(_cacheNameDetails.precache)
  addEventListener('fetch', function (event) {
    var precachedURL = getCacheKeyForURL(event.request.url, {
      cleanURLs: cleanURLs,
      directoryIndex: directoryIndex,
      ignoreURLParametersMatching: ignoreURLParametersMatching,
      urlManipulation: urlManipulation,
    })
    if (!precachedURL) {
      // console.log('Precacher did not find a match for', event.request.url)
      return
    }
    var responsePromise = caches
      .open(cacheName)
      .then(function (cache) {
        return cache.match(precachedURL)
      })
      .then(function (cachedResponse) {
        if (cachedResponse) {
          return cachedResponse
        }
        console.warn('Precached response not found ', precachedURL)
        return fetch(precachedURL)
      })
    event.respondWith(responsePromise)
  })
}

function _createCacheName(cacheName) {
  return [_cacheNameDetails.prefix, cacheName, _cacheNameDetails.suffix].filter((value) => value && value.length > 0).join('-')
}

function getCacheKeyForURL(url, opts) {
  var precacheController = getOrCreatePrecacheController()
  var urlsToCacheKeys = precacheController.getURLsToCacheKeys()
  var variations = generateURLVariations(url, opts)
  for (var i = 0; i < variations.length; i++) {
    var variation = variations[i]
    if (urlsToCacheKeys[variation]) {
      return urlsToCacheKeys[variation]
    }
  }
}

function generateURLVariations(url, opts) {
  var variations = []
  var ignoreURLParametersMatching = opts.ignoreURLParametersMatching
  var directoryIndex = opts.directoryIndex
  var cleanURLs = opts.cleanURLs
  var urlManipulation = opts.urlManipulation
  var urlObject = new URL(url, location.href)
  urlObject.hash = ''
  variations.push(urlObject.href)
  var urlWithoutIgnoredParams = removeIgnoredSearchParams(urlObject)
  variations.push(urlWithoutIgnoredParams.href)
  if (directoryIndex && urlWithoutIgnoredParams.pathname.endsWith('/')) {
    var directoryURL = new URL(urlWithoutIgnoredParams.href)
    directoryURL.pathname += directoryIndex
    variations.push(directoryURL.href)
  }
  if (cleanURLs) {
    var cleanURL = new URL(urlWithoutIgnoredParams.href)
    cleanURL.pathname += '.html'
    variations.push(cleanURL.href)
  }
  if (urlManipulation) {
    var additionalURLs = urlManipulation({ url: urlObject })
    additionalURLs.map(function (item) {
      variations.push(item)
    })
  }
  return variations
}

function removeIgnoredSearchParams(urlObject, ignoreURLParametersMatching) {
  Object.keys(urlObject.searchParams).map(function (paramName) {
    if (
      ignoreURLParametersMatching.some(function (regExp) {
        regExp.test(paramName)
      })
    ) {
      urlObject.searchParams.delete(paramName)
    }
  })
  return urlObject
}

function precache(entries) {
  var precacheController = getOrCreatePrecacheController()
  precacheController.addToCacheList(entries)
  if (entries.length > 0) {
    addEventListener('install', function (event) {
      self.skipWaiting()
      var precacheController = getOrCreatePrecacheController()
      event.waitUntil(
        Promise.all([
          storeIframeResponseText(getIframeURL()),
          precacheController.install({ event: event }).catch(function (err) {
            console.error(err)
            throw err
          }),
        ])
      )
    })
    addEventListener('activate', function (event) {
      var precacheController = getOrCreatePrecacheController()
      event.waitUntil(precacheController.activate())
    })
  }
}

function createCacheKey(entry) {
  if (!entry) {
    throw new Error('entry undefined')
  }
  if (typeof entry === 'string') {
    var urlObject = new URL(entry, location.href)
    return {
      cacheKey: urlObject.href,
      url: urlObject.href,
    }
  }
  var revision = entry.revision
  var url = entry.url
  if (!url) {
    throw new Error('No url')
  }
  if (!revision) {
    var urlObject = new URL(url, location.href)
    return {
      cacheKey: urlObject.href,
      url: urlObject.href,
    }
  }
  var cacheKeyURL = new URL(url, location.href)
  var originalURL = new URL(url, location.href)
  cacheKeyURL.searchParams.set('__WB_REVISION__', revision)
  return {
    cacheKey: cacheKeyURL.href,
    url: originalURL.href,
  }
}

function PrecacheController() {
  this._cacheName = _createCacheName(_cacheNameDetails.precache)
  this._urlsToCacheKeys = {}
  this._urlsToCacheModes = {}
  this._cacheKeysToIntegrities = {}
}

PrecacheController.prototype.constructor = PrecacheController

PrecacheController.prototype.addToCacheList = function (entries) {
  var context = this
  try {
    entries.map(function (entry) {
      var obj = createCacheKey(entry)
      var cacheKey = obj.cacheKey
      var url = obj.url
      var cacheMode = typeof entry !== 'string' && entry.revision ? 'reload' : 'default'
      if (context._urlsToCacheKeys[url] && context._urlsToCacheKeys[url] !== cacheKey) {
        throw new Error('Conflicting cache key entries ', context._urlsToCacheKeys[url], cacheKey)
      }
      if (typeof entry !== 'string' && entry.integrity) {
        if (context._cacheKeysToIntegrities[cacheKey] && context._cacheKeysToIntegrities[cacheKey] !== entry.integrity) {
          throw new Error('Conflicting integrities ', context._cacheKeysToIntegrities[cacheKey], entry.integrity, url)
        }
        context._cacheKeysToIntegrities[cacheKey] = entry.integrity
      }
      context._urlsToCacheKeys[url] = cacheKey
      context._urlsToCacheModes[url] = cacheMode
    })
  } catch (e) {
    console.error(e)
  }
}

PrecacheController.prototype.install = function (opts) {
  var resolve, reject
  var promise = new Promise(function (res, rej) {
    resolve = res
    reject = rej
  })
  var context = this
  var event = opts.event
  var toBePrecached = []
  var alreadyPrecached = []
  caches
    .open(context._cacheName)
    .then(function (cache) {
      return cache.keys()
    })
    .then(function (alreadyCachedRequests) {
      var existingCacheKeys = alreadyCachedRequests.map(function (req) {
        return req.url
      })
      for (var url in context._urlsToCacheKeys) {
        var cacheKey = context._urlsToCacheKeys[url]
        if (existingCacheKeys[cacheKey]) {
          alreadyPrecached.push(url)
        } else {
          toBePrecached.push({ cacheKey: cacheKey, url: url })
        }
      }
      var precacheRequests = toBePrecached.map(function (obj) {
        var cacheKey = obj.cacheKey
        var url = obj.url
        var integrity = context._cacheKeysToIntegrities[cacheKey]
        var cacheMode = context._urlsToCacheModes[url]
        return context._addURLToCache({
          cacheKey: cacheKey,
          cacheMode: cacheMode,
          event: event,
          integrity: integrity,
          url: url,
        })
      })

      Promise.all(precacheRequests).then(function () {
        var updatedURLs = toBePrecached.map(function (item) {
          return item.url
        })
        resolve({
          updatedURLs: updatedURLs,
          notUpdatedURLs: alreadyPrecached,
        })
      })
    })

  return promise
}

PrecacheController.prototype.activate = function () {
  var resolve, reject
  var promise = new Promise(function (res, rej) {
    resolve = res
    reject = rej
  })
  var context = this
  var c
  var deletedURLs = []
  caches
    .open(context._cacheName)
    .then(function (cache) {
      c = cache
      return cache.keys()
    })
    .then(function (currentlyCachedRequests) {
      var promises = []
      for (var req in currentlyCachedRequests) {
        if (!context._urlsToCacheKeys[req.url]) {
          promises.push(c.delete(req))
          deletedURLs.push(req.url)
        }
      }
      return Promise.all(promises)
    })
    .then(function () {
      resolve(deletedURLs)
    })

  return promise
}

PrecacheController.prototype._addURLToCache = function (opts) {
  var cacheKey = opts.cacheKey
  var url = opts.url
  var cacheMode = opts.cacheMode
  var event = opts.event
  var integrity = opts.integrity
  var context = this

  var request = new Request(url, {
    integrity: integrity,
    cache: cacheMode,
    credentials: 'same-origin',
  })

  wrappedFetch({
    event: event,
    request: request,
  })
    .then(function (response) {
      if (response.status >= 400) {
        throw new Error('Invalid response', url, response.status)
      }
      if (response.redirected) {
        return copyResponse(response)
      }
      return Promise.resolve(response)
    })
    .then(function (response) {
      putWrapper({
        event: event,
        response: response,
        request: cacheKey === url ? request : new Request(cacheKey),
        cacheName: context._cacheName,
        matchOptions: {
          ignoreSearch: true,
        },
      })
    })
}

PrecacheController.prototype.getURLsToCacheKeys = function () {
  return this._urlsToCacheKeys
}

PrecacheController.prototype.getCachedURLs = function () {
  return Object.keys(this._urlsToCacheKeys)
}

PrecacheController.prototype.getCacheKeyForURL = function (url) {
  var urlObject = new URL(url, location.href)
  return this._urlsToCacheKeys[urlObject.href]
}

PrecacheController.prototype.createHandlerForURL = function (url) {
  var resolve, reject
  var promies = new Promise(function (res, rej) {
    resolve = res
    reject = rej
  })
  var context = this
  var cacheKey = context.getCacheKeyForURL(url)
  if (!cacheKey) {
    throw new Error('Non-precached URL', url)
  }
  caches
    .open(context._cacheName)
    .then(function (cache) {
      return cache.match(cacheKey)
    })
    .then(function (response) {
      if (response) {
        resolve(response)
      } else {
        reject(new Error('The cache did not have this entry for cacheKey', cacheKey))
      }
    })
    .catch(function (err) {
      console.error('Failed to respond with cached response', err)
      fetch(cacheKey).then(resolve).catch(reject)
    })
  return promise
}

function wrappedFetch(opts) {
  var resolve, reject
  var promise = new Promise(function (res, rej) {
    resolve = res
    reject = rej
  })
  var request = opts.request
  var fetchOptions = opts.fetchOptions
  var event = opts.event
  if (typeof request === 'string') {
    request = new Request(request)
  }
  try {
    var fetchResponse
    if (request.mode === 'navigate') {
      fetch(request).then(resolve).catch(reject)
    } else {
      fetch(request, fetchOptions).then(resolve).catch(reject)
    }
  } catch (e) {
    throw e
  }
  return promise
}

function copyResponse(response) {
  var resolve, reject
  var promise = new Promise(function (res, rej) {
    resolve = res
    reject = rej
  })
  var supportStatus
  function canConstructResponseFromBodyStream() {
    if (supportStatus === undefined) {
      const testResponse = new Response('')
      if ('body' in testResponse) {
        try {
          new Response(testResponse.body)
          supportStatus = true
        } catch (error) {
          supportStatus = false
        }
      }
      supportStatus = false
    }
    return supportStatus
  }
  var clonedResponse = response.clone()
  var responseInit = {
    headers: new Headers(clonedResponse.headers),
    status: clonedResponse.status,
    statusText: clonedResponse.statusText,
  }
  var body
  if (canConstructResponseFromBodyStream()) {
    body = clonedResponse.body
    resolve(new Response(body, responseInit))
  } else {
    clonedResponse
      .blob()
      .then(function (b) {
        body = b
        resolve(new Response(body, responseInit))
      })
      .catch(reject)
  }
  return promise
}

function putWrapper(opts) {
  var resolve, reject
  var promise = new Promise(function (res, rej) {
    resolve = res
    reject = rej
  })
  var cacheName = opts.cacheName
  var request = opts.request
  var response = opts.response
  if (response.status !== 200) {
    console.warn('Request not cached')
    resolve()
  }
  caches
    .open(cacheName)
    .then(function (cache) {
      cache.put(request, response).then(resolve)
    })
    .catch(reject)
  return promise
}

function matchWrapper(opts) {
  var resolve, reject
  var promise = new Promise(function (res, rej) {
    resolve = res
    reject = rej
  })
  var cacheName = opts.cacheName
  var request = opts.request
  var event = opts.event
  var matchOptions = opts.matchOptions
  caches
    .open(cacheName)
    .then(function (cache) {
      return cache.match(request, matchOptions)
    })
    .then(function (cachedResponse) {
      resolve(cachedResponse)
    })
    .catch(reject)
  return promise
}

function getOrCreatePrecacheController() {
  if (!precacheController) {
    precacheController = new PrecacheController()
  }
  return precacheController
}

// service worker logic

self.addEventListener('message', function (event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

self.addEventListener('fetch', function (event) {
  try {
    const url = new URL(event.request.url)
    const integrityParam = url.searchParams.get('integrity')
    if (url.pathname.includes('/redirect') && url.href.includes(getScope())) {
      event.respondWith(
        new Response(
          new Blob(
            [
              `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <title>Redirect</title>
    <style>
      * {
        box-sizing: border-box;
      }

      html,
      body {
        background: #fcfcfc;
        height: 100%;
        padding: 0;
        margin: 0;
      }

      .container {
        width: 100%;
        height: 100%;

        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      }

      h1.title {
        font-size: 14px;
        color: #0f1222;
        font-family: 'Roboto', sans-serif !important;
        margin: 0;
        text-align: center;
      }

      .spinner .beat {
        background-color: #0364ff;
        height: 12px;
        width: 12px;
        margin: 24px 2px 10px;
        border-radius: 100%;
        -webkit-animation: beatStretchDelay 0.7s infinite linear;
        animation: beatStretchDelay 0.7s infinite linear;
        -webkit-animation-fill-mode: both;
        animation-fill-mode: both;
        display: inline-block;
      }

      .spinner .beat-odd {
        animation-delay: 0s;
      }

      .spinner .beat-even {
        animation-delay: 0.35s;
      }

      @-webkit-keyframes beatStretchDelay {
        50% {
          -webkit-transform: scale(0.75);
          transform: scale(0.75);
          -webkit-opacity: 0.2;
          opacity: 0.2;
        }

        100% {
          -webkit-transform: scale(1);
          transform: scale(1);
          -webkit-opacity: 1;
          opacity: 1;
        }
      }

      @keyframes beatStretchDelay {
        50% {
          -webkit-transform: scale(0.75);
          transform: scale(0.75);
          -webkit-opacity: 0.2;
          opacity: 0.2;
        }

        100% {
          -webkit-transform: scale(1);
          transform: scale(1);
          -webkit-opacity: 1;
          opacity: 1;
        }
      }

      @media (min-width: 768px) {
        h1.title {
          font-size: 14px;
        }

        p.info {
          font-size: 28px;
        }

        .spinner .beat {
          height: 12px;
          width: 12px;
        }
      }
    </style>
  </head>

  <body>
    <div id="message" class="container">
      <div class="spinner content" id="spinner">
        <div class="beat beat-odd"></div>
        <div class="beat beat-even"></div>
        <div class="beat beat-odd"></div>
      </div>
      <h1 class="title content" id="closeText" style="display: none;">You can close this window now</h1>
    </div>
    <script
      src="https://scripts.toruswallet.io/broadcastChannel_3_5_3.js"
      integrity="sha384-skU9kn0NAhJbaUxr/WTkc56HLM8U6akUpv4H4WmR+ZYh9+ChxbuN7GnALGNFSPzq"
      crossorigin="anonymous"
    ></script>
    <script>
      function storageAvailable(type) {
        var storage
        try {
          storage = window[type]
          var x = '__storage_test__'
          storage.setItem(x, x)
          storage.removeItem(x)
          return true
        } catch (e) {
          return (
            e &&
            // everything except Firefox
            (e.code === 22 ||
              // Firefox
              e.code === 1014 ||
              // test name field too, because code might not be present
              // everything except Firefox
              e.name === 'QuotaExceededError' ||
              // Firefox
              e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage &&
            storage.length !== 0
          )
        }
      }
      function showCloseText() {
        var closeText = document.getElementById('closeText')
        var spinner = document.getElementById('spinner')
        if (closeText) {
          closeText.style.display = 'block'
        }
        if (spinner) {
          spinner.style.display = 'none'
        }
      }
      var isLocalStorageAvailable = storageAvailable('localStorage')
      var isSessionStorageAvailable = storageAvailable('sessionStorage')
      // set theme
      let theme = 'light'
      if (isLocalStorageAvailable) {
        var torusTheme = localStorage.getItem('torus-theme')
        if (torusTheme) {
          theme = torusTheme.split('-')[0]
        }
      }

      if (isSessionStorageAvailable) {
        const torusWhiteLabel = sessionStorage.getItem('torus-white-label')
        if (torusWhiteLabel !== null) {
          try {
            const whiteLabelData = JSON.parse(torusWhiteLabel)
            if (whiteLabelData.theme) {
              theme = whiteLabelData.theme.isDark ? 'dark' : 'light'
              if (whiteLabelData.theme.colors && whiteLabelData.theme.colors.torusBrand1) {
                const beats = document.querySelectorAll('.spinner .beat')
                beats.forEach((beat) => (beat.style.backgroundColor = whiteLabelData.theme.colors.torusBrand1))
              }
            }
          } catch (error) {
            console.error(error)
          }
        }
      }

      if (theme === 'dark') {
        document.querySelector('body').style.backgroundColor = '#24252A'
      }
      var bc
      var broadcastChannelOptions = {
        // type: 'localstorage', // (optional) enforce a type, oneOf['native', 'idb', 'localstorage', 'node'
        webWorkerSupport: false, // (optional) set this to false if you know that your channel will never be used in a WebWorker (increase performance)
      }
      var instanceParams = {}
      var preopenInstanceId = new URL(window.location.href).searchParams.get('preopenInstanceId')
      if (!preopenInstanceId) {
        document.getElementById('message').style.visibility = 'visible'
        // in general oauth redirect
        try {
          var url = new URL(location.href)
          var hash = url.hash.substr(1)
          var hashParams = {}
          if (hash) {
            hashParams = hash.split('&').reduce(function (result, item) {
              var parts = item.split('=')
              result[parts[0]] = parts[1]
              return result
            }, {})
          }
          var queryParams = {}
          for (var key of url.searchParams.keys()) {
            queryParams[key] = url.searchParams.get(key)
          }
          var error = ''
          try {
            if (Object.keys(hashParams).length > 0 && hashParams.state) {
              instanceParams = JSON.parse(window.atob(decodeURIComponent(decodeURIComponent(hashParams.state)))) || {}
              error = hashParams.error_description || hashParams.error || error
            } else if (Object.keys(queryParams).length > 0 && queryParams.state) {
              instanceParams = JSON.parse(window.atob(decodeURIComponent(decodeURIComponent(queryParams.state)))) || {}
              if (queryParams.error) error = queryParams.error
            }
          } catch (e) {
            console.error(e)
          }

          // communicate via broadcast channel
          bc = new broadcastChannelLib.BroadcastChannel('redirect_channel_' + instanceParams.instanceId, broadcastChannelOptions)
          bc.addEventListener('message', function (ev) {
            if (ev.success) {
              bc.close()
              console.log('posted', {
                queryParams,
                instanceParams,
                hashParams,
              })
            } else {
              window.close()
              showCloseText()
            }
          })
          bc.postMessage({
            data: {
              instanceParams: instanceParams,
              hashParams: hashParams,
              queryParams: queryParams,
            },
            error: error,
          }).then(function () {
            setTimeout(function () {
              window.location.href = url.origin + location.search + location.hash
            }, 5000)
          })
        } catch (err) {
          console.error(err, 'service worker error in redirect')
          bc && bc.close()
          window.close()
          showCloseText()
        }
      } else {
        // in preopen, awaiting redirect
        try {
          bc = new broadcastChannelLib.BroadcastChannel('preopen_channel_' + preopenInstanceId, broadcastChannelOptions)
          bc.onmessage = function (ev) {
            var { preopenInstanceId: oldId, payload, message } = ev.data
            if (oldId === preopenInstanceId && payload && payload.url) {
              window.location.href = payload.url
            } else if (oldId === preopenInstanceId && message === 'setup_complete') {
              bc.postMessage({
                data: {
                  preopenInstanceId: preopenInstanceId,
                  message: 'popup_loaded',
                },
              })
            }
            if (ev.error && ev.error !== '') {
              console.error(ev.error)
              bc.close()
            }
          }
        } catch (err) {
          console.error(err, 'service worker error in preopen')
          bc && bc.close()
          window.close()
          showCloseText()
        }
      }
    </script>
  </body>
</html>
${''}
  `,
            ],
            { type: 'text/html' }
          )
        )
      )
    } else if (integrityParam && integrityParam === 'true' && !isOrigin() && url.href.includes(getScope())) {
      var promRes
      var promRej
      var prom = new Promise(function (resolve, reject) {
        promRes = resolve
        promRej = reject
      })

      event.respondWith(prom)
      getIframeResponseText().then(function (cachedResponse) {
        if (cachedResponse !== undefined) {
          promRes(cachedResponse)
        } else {
          promRes(fetch(getIframeURL()))
        }
      })
    }
  } catch (error) {
    console.error(error)
  }
})

self.addEventListener('notificationclick', function (e) {
  var notification = e.notification
  var url = notification.data.url
  var action = e.action

  if (action === 'close') {
    notification.close()
  } else {
    url && clients.openWindow(url)
    notification.close()
  }
})

self.__precacheManifest = [
  {
    url: '/js/app.js',
  },
].concat(self.__precacheManifest || [])

try {
  const { pathname, hostname } = new URL(self.getScope())
  if (hostname === 'app.tor.us' || hostname === 'binance.tor.us') {
    if (pathname !== '/') precacheAndRoute(self.__precacheManifest, {})
  } else {
    precacheAndRoute(self.__precacheManifest, {})
  }
} catch (error) {
  console.error(error)
}
