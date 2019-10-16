const express = require('express')
var compression = require('compression')
const app = express()
const fs = require('fs')
const path = require('path')
const https = require('https')
const http = require('http')
const log = require('loglevel')

// const UAParser = require('ua-parser-js')
const APP_PORT = process.env.PORT || 3000
var certOptions = {
  key: fs.readFileSync(path.resolve('../ssl/server.key')),
  cert: fs.readFileSync(path.resolve('../ssl/server.crt'))
}
// app.all(/^(?!(\/notsupported)).*$/, ensureCompatibleBrowser)
app.use(compression())
// Prevents cross-frame clickjacking attacks from external websites
const securityHeaderMiddleware = (req, res, next) => {
  // res.setHeader('Content-Security-Policy', 'default-src https: "unsafe-inline"')
  res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.originalUrl.startsWith('/popup')) {
    // skip any /popup routes for x-frame-options for it to function properly
    next()
    return
  }
  res.setHeader('X-Frame-Options', 'sameorigin')
  next()
}

const cacheControlHeaderMiddleware = (req, res, next) => {
  res.setHeader('Cache-Control', 'max-age=3600')
  next()
}

app.use(securityHeaderMiddleware)
app.use(cacheControlHeaderMiddleware)

app.get('/service-worker.js', function(req, res) {
  res.setHeader('Content-Type', 'application/javascript')
  res.setHeader('Cache-Control', 'max-age=3600')
  res.setHeader('Service-Worker-Allowed', '/')
  res.sendFile(path.resolve('./dist/service-worker.js'))
})
app.use(express.static('dist'))

// function ensureCompatibleBrowser(req, res, next) {
//   var parser = new UAParser()
//   var ua = req.headers['user-agent']
//   var browserName = parser.setUA(ua).getBrowser().name
//   if (browserName === 'IE' || browserName === 'Edge' || browserName === 'Safari') res.redirect('/notsupported/')
//   else return next()
// }

app.get('/notsupported/', (req, res) => {
  res.send('Broadcast channels are currently not supported on Edge and Safari browsers. Please check back for further updates')
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/dist/index.html'))
})

// app.use(express.static('public'))

https.createServer(certOptions, app).listen(APP_PORT)
// http.createServer(app).listen(APP_PORT)
log.info('listening to port ' + APP_PORT)

if (process.env.NODE_ENV === 'production') {
  var redirectApp = express()
  redirectApp.get('*', (req, res) => {
    res.redirect(301, 'https://app.tor.us')
  })
  log.info('listening to port 80')
  http.createServer(redirectApp).listen(80)
}
