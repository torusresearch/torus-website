const https = require('https')
const fs = require('fs')
const path = require('path')
const log = require('loglevel')

const localeUrl = 'https://api.tor.us/locales'
// const localeUrl = 'http://localhost:2020'

getLocale()
  .then(result => {
    const locales = result.data
    const folder = './src/plugins/i18n/'
    const folderPath = path.resolve(folder)
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath)
    }
    // Create json files
    for (var localeKey in locales) {
      if (Object.prototype.hasOwnProperty.call(locales, localeKey)) {
        const filePath = path.resolve(`${folder}${localeKey}.json`)
        fs.writeFile(filePath, JSON.stringify(locales[localeKey], null, 2), { flag: 'w' }, function(err) {
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
