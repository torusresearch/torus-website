require('dotenv').config()
const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')
const https = require('https')
const http = require('http')
const APP_PORT = process.env.PORT || 3000
var certOptions = {
  key: fs.readFileSync(path.resolve('../ssl/server.key')),
  cert: fs.readFileSync(path.resolve('../ssl/server.crt'))
}

// app.get('/privacy', (req, res) => {
//   res.sendFile(path.join(__dirname, '/public/privacy.html'))
// })

// app.get('/demo', (req, res) => {
//   res.sendFile(path.join(__dirname, '/public/demo.html'))
// })

// app.get('/widget', (req, res) => {
//   res.sendFile(path.join(__dirname, '/public/widget.html'))
// })

// app.get('/widget-main', (req, res) => {
//   res.sendFile(path.join(__dirname, '/public/widget-main.html'))
// })

// app.get('/address', (req, res) => {
//   res.sendFile(path.join(__dirname, '/public/publickey.html'))
// })

// // app.get('/survey', async (req, res) => {
// //   res.redirect('https://goo.gl/forms/0gm46ERp1kLvCzmg2')
// // })

app.use(express.static('dist'))

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
