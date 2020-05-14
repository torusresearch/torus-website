const fs = require('fs')
const path = require('path')

const redirectHTML = fs.readFileSync(`${__dirname}/../public/redirect.html`)
const swBase = fs.readFileSync(`${__dirname}/../public/sw-base.js`)
let swReplaced = swBase.toString().replace('REDIRECT_HTML', redirectHTML.toString())
if (process.env.VUE_APP_TORUS_BUILD_ENV === 'production' || process.env.VUE_APP_TORUS_BUILD_ENV === 'staging') {
  const version = `v${JSON.parse(fs.readFileSync(path.resolve('../package.json'))).version}`
  swReplaced = swReplaced.replace('/js/app.js', `/${version}/js/app.js`)
}
fs.writeFileSync(`${__dirname}/../public/sw.js`, swReplaced)
