const express = require('express')
const app = express()
const port = 3000
const proxy = require('express-http-proxy');
const fs = require('fs')
const path = require('path')
const https = require('https')
var cors = require('cors')
const APP_PORT = process.env.PORT || 3000
const sslRedirect = require('heroku-ssl-redirect')

if (!!process.env.FORCE_USE_SSL) {
  app.use(sslRedirect(['production'], 301))
}

// var certOptions = {
//   key: fs.readFileSync(path.resolve('./ssl/server.key')),
//   cert: fs.readFileSync(path.resolve('./ssl/server.crt'))
// }

// app.use(cors())

app.use(express.static('public'))
app.use(express.static('dist'))

// app.get('/', (req, res) => res.send('Hello World!'))

// app.use('*', function(req, res, next) {
//   var urls = req.url.split("3000/")
//   var url = urls[urls.length - 1]
//   return proxy('https://www.cryptokitties.co' + url)(req, res, next)
// });

app.listen(APP_PORT, () => console.log(`server listening on port ${port}!`))
// var server = https.createServer(certOptions, app).listen(3000)
