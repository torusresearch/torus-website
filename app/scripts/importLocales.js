const https = require('https')
var fs = require('fs')
var log = require('loglevel')

const localeUrl = 'https://api.tor.us/locales'
// const localeUrl = 'http://localhost:2020'

getLocale()
  .then(result => {
    const locales = result.data
    // Create json files
    for (var localeKey in locales) {
      if (Object.prototype.hasOwnProperty.call(locales, localeKey)) {
        fs.writeFile(`src/plugins/i18n/${localeKey}.json`, JSON.stringify(locales[localeKey], null, 2), function(err) {
          if (err) throw err
        })
      }
    }
  })
  .catch(e => {
    log.error(e)
  })

function getLocale() {
  return new Promise(function(resolve, reject) {
    let request = https.get(`${localeUrl}`, function(res) {
      var body = ''
      res.on('data', function(data) {
        body += data
      })
      res.on('end', function() {
        resolve(JSON.parse(body))
      })
    })

    request.on('error', e => {
      reject(e)
    })

    request.end()
  })
}
