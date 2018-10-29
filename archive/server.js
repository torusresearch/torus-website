// const sslRedirect = require('heroku-ssl-redirect')
const express = require('express')
const app = express()
const APP_PORT = process.env.PORT || 3000
console.log(`FORCE_USE_SSL: ${!!process.env.FORCE_USE_SSL}`)
if (!!process.env.FORCE_USE_SSL) {
//   app.use(sslRedirect())
}
app.use(express.static('public'))
app.listen(APP_PORT)
