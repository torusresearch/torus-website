const express = require('express')
const compression = require('compression')

const app = express()
const fs = require('fs')
const path = require('path')
const https = require('https')
const http = require('http')
const log = require('loglevel')

const APP_PORT = process.env.PORT || 3000
const certOptions = {
  key: fs.readFileSync(path.resolve('../ssl/server.key')),
  cert: fs.readFileSync(path.resolve('../ssl/server.crt'))
}
// app.all(/^(?!(\/notsupported)).*$/, ensureCompatibleBrowser)
app.use(compression())
// Prevents cross-frame clickjacking attacks from external websites
const securityHeaderMiddleware = (request, response, next) => {
  // response.setHeader('Content-Security-Policy', 'default-src https: "unsafe-inline"')
  response.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  response.setHeader('X-XSS-Protection', '1; mode=block')
  response.setHeader('X-Content-Type-Options', 'nosniff')
  response.setHeader('Access-Control-Allow-Origin', '*')
  if (request.originalUrl.startsWith('/popup')) {
    // skip any /popup routes for x-frame-options for it to function properly
    next()
    return
  }
  response.setHeader('X-Frame-Options', 'sameorigin')
  next()
}

const cacheControlHeaderMiddleware = (request, repsonse, next) => {
  repsonse.setHeader('Cache-Control', 'max-age=3600')
  next()
}

app.use(securityHeaderMiddleware)
app.use(cacheControlHeaderMiddleware)

app.get('/service-worker.js', (request, response) => {
  response.setHeader('Content-Type', 'application/javascript')
  response.setHeader('Cache-Control', 'max-age=3600')
  response.setHeader('Service-Worker-Allowed', '/')
  response.sendFile(path.resolve('./dist/service-worker.js'))
})
app.use(express.static('dist'))

app.get('/redirect', (request, response) => {
  response.sendFile(path.join(__dirname, '/dist/redirect.html'))
})
app.get('*', (request, response) => {
  response.sendFile(path.join(__dirname, '/dist/index.html'))
})

https.createServer(certOptions, app).listen(APP_PORT)
// http.createServer(app).listen(APP_PORT)
// http.createServer(app).listen(APP_PORT)
log.info(`listening to port ${APP_PORT}`)

if (process.env.NODE_ENV === 'production') {
  const redirectApp = express()
  redirectApp.get('*', (request, response) => {
    response.redirect(301, 'https://app.tor.us')
  })
  log.info('listening to port 80')
  http.createServer(redirectApp).listen(80)
}
