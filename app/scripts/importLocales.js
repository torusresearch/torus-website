const https = require('https')
const fs = require('fs')
const path = require('path')
const log = require('loglevel')

const localeUrl = 'https://api.tor.us/locales'
// const localeUrl = 'http://localhost:2020'

function getLocale() {
  return new Promise((resolve, reject) => {
    const request = https.get(`${localeUrl}`, (response) => {
      let body = ''
      response.on('data', (data) => {
        body += data
      })
      response.on('end', () => {
        resolve(JSON.parse(body))
      })
    })

    request.on('error', (error) => {
      reject(error)
    })

    request.end()
  })
}

getLocale()
  .then((result) => {
    const locales = result.data
    const folder = './src/plugins/i18n/'
    const folderPath = path.resolve(folder)
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath)
    }
    // Create json files
    const keys = Object.keys(locales)
    for (const localeKey of keys) {
      if (Object.prototype.hasOwnProperty.call(locales, localeKey)) {
        const filePath = path.resolve(`${folder}${localeKey}.json`)
        fs.writeFile(filePath, JSON.stringify(locales[localeKey], null, 2), { flag: 'w' }, (error) => {
          if (error) throw error
        })
      }
    }
  })
  .catch((error) => {
    log.error(error)
  })
