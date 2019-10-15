// import pre-cache manifest

// workbox port
var precacheController
var listenerAdded = false
var _cacheNameDetails = {
  precache: 'precache-v2',
  prefix: 'workbox',
  suffix: registration.scope
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
  addEventListener('fetch', function(event) {
    var precachedURL = getCacheKeyForURL(event.request.url, {
      cleanURLs: cleanURLs,
      directoryIndex: directoryIndex,
      ignoreURLParametersMatching: ignoreURLParametersMatching,
      urlManipulation: urlManipulation
    })
    if (!precachedURL) {
      // console.log('Precacher did not find a match for', event.request.url)
      return
    }
    var responsePromise = caches
      .open(cacheName)
      .then(function(cache) {
        return cache.match(precachedURL)
      })
      .then(function(cachedResponse) {
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
  return [_cacheNameDetails.prefix, cacheName, _cacheNameDetails.suffix].filter(value => value && value.length > 0).join('-')
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
    additionalURLs.map(function(item) {
      variations.push(item)
    })
  }
  return variations
}

function removeIgnoredSearchParams(urlObject, ignoreURLParametersMatching) {
  Object.keys(urlObject.searchParams).map(function(paramName) {
    if (
      ignoreURLParametersMatching.some(function(regExp) {
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
    addEventListener('install', function(event) {
      var precacheController = getOrCreatePrecacheController()
      event.waitUntil(
        precacheController.install({ event: event }).catch(function(err) {
          console.error(err)
          throw err
        })
      )
    })
    addEventListener('activate', function(event) {
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
      url: urlObject.href
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
      url: urlObject.href
    }
  }
  var cacheKeyURL = new URL(url, location.href)
  var originalURL = new URL(url, location.href)
  cacheKeyURL.searchParams.set('__WB_REVISION__', revision)
  return {
    cacheKey: cacheKeyURL.href,
    url: originalURL.href
  }
}

function PrecacheController() {
  this._cacheName = _createCacheName(_cacheNameDetails.precache)
  this._urlsToCacheKeys = {}
  this._urlsToCacheModes = {}
  this._cacheKeysToIntegrities = {}
}

PrecacheController.prototype.constructor = PrecacheController

PrecacheController.prototype.addToCacheList = function(entries) {
  var context = this
  try {
    entries.map(function(entry) {
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

PrecacheController.prototype.install = function(opts) {
  var resolve, reject
  var promise = new Promise(function(res, rej) {
    resolve = res
    reject = rej
  })
  var context = this
  var event = opts.event
  var toBePrecached = []
  var alreadyPrecached = []
  caches
    .open(context._cacheName)
    .then(function(cache) {
      return cache.keys()
    })
    .then(function(alreadyCachedRequests) {
      var existingCacheKeys = alreadyCachedRequests.map(function(req) {
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
      var precacheRequests = toBePrecached.map(function(obj) {
        var cacheKey = obj.cacheKey
        var url = obj.url
        var integrity = context._cacheKeysToIntegrities[cacheKey]
        var cacheMode = context._urlsToCacheModes[url]
        return context._addURLToCache({
          cacheKey: cacheKey,
          cacheMode: cacheMode,
          event: event,
          integrity: integrity,
          url: url
        })
      })

      Promise.all(precacheRequests).then(function() {
        var updatedURLs = toBePrecached.map(function(item) {
          return item.url
        })
        resolve({
          updatedURLs: updatedURLs,
          notUpdatedURLs: alreadyPrecached
        })
      })
    })

  return promise
}

PrecacheController.prototype.activate = function() {
  var resolve, reject
  var promise = new Promise(function(res, rej) {
    resolve = res
    reject = rej
  })
  var context = this
  var c
  var deletedURLs = []
  caches
    .open(context._cacheName)
    .then(function(cache) {
      c = cache
      return cache.keys()
    })
    .then(function(currentlyCachedRequests) {
      var promises = []
      for (var req in currentlyCachedRequests) {
        if (!context._urlsToCacheKeys[req.url]) {
          promises.push(c.delete(req))
          deletedURLs.push(req.url)
        }
      }
      return Promise.all(promises)
    })
    .then(function() {
      resolve(deletedURLs)
    })

  return promise
}

PrecacheController.prototype._addURLToCache = function(opts) {
  var cacheKey = opts.cacheKey
  var url = opts.url
  var cacheMode = opts.cacheMode
  var event = opts.event
  var integrity = opts.integrity
  var context = this

  var request = new Request(url, {
    integrity: integrity,
    cache: cacheMode,
    credentials: 'same-origin'
  })

  wrappedFetch({
    event: event,
    request: request
  })
    .then(function(response) {
      if (response.status >= 400) {
        throw new Error('Invalid response', url, response.status)
      }
      if (response.redirected) {
        return copyResponse(response)
      }
      return Promise.resolve(response)
    })
    .then(function(response) {
      putWrapper({
        event: event,
        response: response,
        request: cacheKey === url ? request : new Request(cacheKey),
        cacheName: context._cacheName,
        matchOptions: {
          ignoreSearch: true
        }
      })
    })
}

PrecacheController.prototype.getURLsToCacheKeys = function() {
  return this._urlsToCacheKeys
}

PrecacheController.prototype.getCachedURLs = function() {
  return Object.keys(this._urlsToCacheKeys)
}

PrecacheController.prototype.getCacheKeyForURL = function(url) {
  var urlObject = new URL(url, location.href)
  return this._urlsToCacheKeys[urlObject.href]
}

PrecacheController.prototype.createHandlerForURL = function(url) {
  var resolve, reject
  var promies = new Promise(function(res, rej) {
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
    .then(function(cache) {
      return cache.match(cacheKey)
    })
    .then(function(response) {
      if (response) {
        resolve(response)
      } else {
        reject(new Error('The cache did not have this entry for cacheKey', cacheKey))
      }
    })
    .catch(function(err) {
      console.error('Failed to respond with cached response', err)
      fetch(cacheKey)
        .then(resolve)
        .catch(reject)
    })
  return promise
}

function wrappedFetch(opts) {
  var resolve, reject
  var promise = new Promise(function(res, rej) {
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
      fetch(request)
        .then(resolve)
        .catch(reject)
    } else {
      fetch(request, fetchOptions)
        .then(resolve)
        .catch(reject)
    }
  } catch (e) {
    throw e
  }
  return promise
}

function copyResponse(response) {
  var resolve, reject
  var promise = new Promise(function(res, rej) {
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
    statusText: clonedResponse.statusText
  }
  var body
  if (canConstructResponseFromBodyStream()) {
    body = clonedResponse.body
    resolve(new Response(body, responseInit))
  } else {
    clonedResponse
      .blob()
      .then(function(b) {
        body = b
        resolve(new Response(body, responseInit))
      })
      .catch(reject)
  }
  return promise
}

function putWrapper(opts) {
  var resolve, reject
  var promise = new Promise(function(res, rej) {
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
    .then(function(cache) {
      cache.put(request, response).then(resolve)
    })
    .catch(reject)
  return promise
}

function matchWrapper(opts) {
  var resolve, reject
  var promise = new Promise(function(res, rej) {
    resolve = res
    reject = rej
  })
  var cacheName = opts.cacheName
  var request = opts.request
  var event = opts.event
  var matchOptions = opts.matchOptions
  caches
    .open(cacheName)
    .then(function(cache) {
      return cache.match(request, matchOptions)
    })
    .then(function(cachedResponse) {
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

self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

self.__precacheManifest = [].concat(self.__precacheManifest || [])
precacheAndRoute(self.__precacheManifest, {})
