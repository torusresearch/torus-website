require('dotenv').config()
const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')
const https = require('https')
const http = require('http')
const APP_PORT = process.env.PORT || 3000
const bodyParser = require('body-parser')
var certOptions

if (process.env.PRODUCTION) {
  certOptions = {
    key: fs.readFileSync(path.resolve('../ssl/privkey.pem')),
    cert: fs.readFileSync(path.resolve('../ssl/fullchain.pem'))
  }
} else {
  certOptions = {
    key: fs.readFileSync(path.resolve('../ssl/server.key')),
    cert: fs.readFileSync(path.resolve('../ssl/server.crt'))
  }
}
app.use(bodyParser.json())

app.get('/privacy', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/privacy.html'))
})

app.get('/demo', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/demo.html'))
})

app.get('/widget', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/widget.html'))
})

app.get('/widget-main', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/widget-main.html'))
})

app.get('/address', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/publickey.html'))
})

// app.get('/survey', async (req, res) => {
//   res.redirect('https://goo.gl/forms/0gm46ERp1kLvCzmg2')
// })

app.use(express.static('dist'))
app.use(express.static('public'))

https.createServer(certOptions, app).listen(APP_PORT)

if (process.env.PORT) {
  var redirectApp = express()
  redirectApp.get('*', (req, res) => {
    res.redirect(301, 'https://tor.us')
  })
  http.createServer(redirectApp).listen(80)
}
