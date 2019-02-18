require('dotenv').config()
const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')
const https = require('https')
const http = require('http')
const UAParser = require('ua-parser-js')
const APP_PORT = process.env.PORT || 3000
var certOptions = {
  key: fs.readFileSync(path.resolve('../ssl/server.key')),
  cert: fs.readFileSync(path.resolve('../ssl/server.crt'))
}
app.all(/^(?!(\/notsupported)).*$/, ensureCompatibleBrowser)

app.use(express.static('dist'))

function ensureCompatibleBrowser(req, res, next) {
  var parser = new UAParser()
  var ua = req.headers['user-agent']
  var browserName = parser.setUA(ua).getBrowser().name
  if (browserName === 'IE' || browserName === 'Edge' || browserName === 'Safari') res.redirect('/notsupported/')
  else return next()
}

app.get('/notsupported/', (req, res) => {
  res.send('Broadcast channels are currently not supported on Edge and Safari browsers. Please check back for further updates')
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/dist/index.html'))
})

app.use(express.static('public'))

https.createServer(certOptions, app).listen(APP_PORT)
console.log('listening to port ' + APP_PORT)

if (process.env.NODE_ENV === 'production') {
  var redirectApp = express()
  redirectApp.get('*', (req, res) => {
    res.redirect(301, 'https://tor.us')
  })
  console.log('listening to port 80')
  http.createServer(redirectApp).listen(80)
}
