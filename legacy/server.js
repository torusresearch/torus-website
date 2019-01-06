require('dotenv').config()
const express = require('express')
const app = express()
const proxy = require('express-http-proxy');
const fs = require('fs')
const path = require('path')
const https = require('https')
var cors = require('cors')
const APP_PORT = process.env.PORT || 3000
const sslRedirect = require('heroku-ssl-redirect')
const bodyParser = require('body-parser')

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client('876733105116-i0hj3s53qiio5k95prpfmj0hp0gmgtor.apps.googleusercontent.com');

if (!!process.env.FORCE_USE_SSL) {
  app.use(sslRedirect(['production'], 301))
}

if (!process.env.DEMO) {
  var certOptions = {
    key: fs.readFileSync(path.resolve('./ssl/server.key')),
    cert: fs.readFileSync(path.resolve('./ssl/server.crt'))
  }
}

// app.use(cors())
app.use(bodyParser.json())

app.get('/privacy', (req, res) => {
  res.sendFile(__dirname + '/public/privacy.html')
})

app.get('/demo', (req, res) => {
  res.sendFile(__dirname + '/public/demo.html')
})

app.get('/widget', (req, res) => {
  res.sendFile(__dirname + '/public/widget.html')
})

app.get('/widget-main', (req, res) => {
  res.sendFile(__dirname + '/public/widget-main.html')
})

app.get('/address', (req, res) => {
  res.sendFile(__dirname + '/public/publickey.html')
})

async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '876733105116-i0hj3s53qiio5k95prpfmj0hp0gmgtor.apps.googleusercontent.com',  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  console.log(ticket, payload)
  const userid = payload['sub'];
  // If request specified a G Suite domain:
  //const domain = payload['hd'];
  return userid;
}

// app.get('/survey', async (req, res) => {
//   res.redirect('https://goo.gl/forms/0gm46ERp1kLvCzmg2')
// })

app.use(express.static('public'))
app.use(express.static('dist'))

// app.get('/', (req, res) => res.send('Hello World!'))

// app.use('*', function(req, res, next) {
//   var urls = req.url.split("3000/")
//   var url = urls[urls.length - 1]
//   return proxy('https://www.cryptokitties.co' + url)(req, res, next)
// });

if (process.env.DEMO) {
  app.listen(APP_PORT, () => console.log(`server listening on port ${APP_PORT}!`))
} else {
  var server = https.createServer(certOptions, app).listen(3000)
}