const https = require('https')
const fs = require('fs')
const path = require('path')
const log = require('loglevel')

const localeUrl = 'https://api.tor.us/locales'
// const localeUrl = 'http://localhost:2020'

function getLocale() {
  return new Promise((resolve, reject) => {
    const request = https.get(`${localeUrl}`, res => {
      let body = ''
      res.on('data', data => {
        body += data
      })
      res.on('end', () => {
        resolve(JSON.parse(body))
      })
    })

    request.on('error', e => {
      reject(e)
    })

    request.end()
  })
}

getLocale()
  .then(result => {
    const locales = result.data
    const folder = './src/plugins/i18n/'
    const folderPath = path.resolve(folder)
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath)
    }
    // Create json files
    const keys = Object.keys(locales)
    for (let i = 0; i < keys.length; i += 1) {
      const localeKey = keys[i]
      if (Object.prototype.hasOwnProperty.call(locales, localeKey)) {
        const filePath = path.resolve(`${folder}${localeKey}.json`)
        fs.writeFile(filePath, JSON.stringify(locales[localeKey], null, 2), { flag: 'w' }, err => {
          if (err) throw err
        })
      }
    }
  })
  .catch(e => {
    log.error(e)
  })
