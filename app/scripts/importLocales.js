const https = require('https')
var fs = require('fs')

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

function processRecords(data) {
  var records = data.records

  // Map locales
  let locales = []
  records.forEach(({ fields }) => {
    const name = fields.name
    delete fields['name']
    Object.keys(fields).forEach(key => {
      if (!Object.prototype.hasOwnProperty.call(locales, key)) locales[key] = {}
      const nameArr = name.split('.')
      nameKeyMap(locales[key], nameArr, fields[key])
    })
  })

  // Create json files
  for (var localeKey in locales) {
    if (Object.prototype.hasOwnProperty.call(locales, localeKey)) {
      fs.writeFile(`src/plugins/i18n/${localeKey}.json`, JSON.stringify(locales[localeKey], null, 2), function(err) {
        if (err) throw err
      })
    }
  }
}

https.get('https://api.airtable.com/v0/appL07XTwLGY3UBvF/Locales?api_key=keyZ491mmTxAHPvMC', function(res) {
  var body = ''
  res.on('data', function(data) {
    body += data
  })
  res.on('end', function() {
    processRecords(JSON.parse(body))
  })
  res.on('error', function(e) {
    console.log('Got error: ' + e.message)
  })
})
