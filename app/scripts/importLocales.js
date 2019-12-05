const https = require('https')
var fs = require('fs')

const localGroups = [
  'locales-login',
  'locales-nav-bar',
  'locales-account-menu',
  'locales-wallet-home',
  'locales-wallet-transfer',
  'locales-wallet-top-up',
  'locales-wallet-activity',
  'locales-wallet-settings'
]
let promises = []

for (let i = 0; i < localGroups.length; i++) {
  promises.push(getLocale(localGroups[i]))
}

Promise.all(promises).then(function(results) {
  let locales = []
  for (let i = 0; i < results.length; i++) {
    processRecords(results[i], locales)
  }

  // Create json files
  for (var localeKey in locales) {
    if (Object.prototype.hasOwnProperty.call(locales, localeKey)) {
      fs.writeFile(`src/plugins/i18n/${localeKey}.json`, JSON.stringify(locales[localeKey], null, 2), function(err) {
        if (err) throw err
      })
    }
  }
})

function getLocale(localGroup) {
  return new Promise(function(resolve, reject) {
    let request = https.get(`https://api.airtable.com/v0/appL07XTwLGY3UBvF/${localGroup}?api_key=keyZ491mmTxAHPvMC`, function(res) {
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

function processRecords(data, locales) {
  var records = data.records

  // Map locales
  records.forEach(({ fields }) => {
    const name = fields.name
    delete fields['name']
    Object.keys(fields).forEach(key => {
      if (!Object.prototype.hasOwnProperty.call(locales, key)) locales[key] = {}
      const nameArr = name.split('.')
      nameKeyMap(locales[key], nameArr, fields[key])
    })
  })
}

function nameKeyMap(mainObject, keyLeft, value) {
  const key = keyLeft[0]
  keyLeft.splice(0, 1)
  if (key !== '' && !Object.prototype.hasOwnProperty.call(mainObject, key)) mainObject[key] = {}
  if (keyLeft.length === 0) {
    mainObject[key] = value
  } else {
    nameKeyMap(mainObject[key], keyLeft, value)
  }
}
