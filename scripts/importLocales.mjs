/* eslint-disable unicorn/prefer-top-level-await */

import fs from 'fs'
import path from 'path'

const args = process.argv.slice(2)
const branch = args[0] || 'main'
const repoUrl = `https://raw.githubusercontent.com/Web3Auth/web3auth-locales/${branch}/Torus-locale`
const localeGroups = [
  'locales-account-menu',
  'locales-email-phone-login',
  'locales-login',
  'locales-nav-bar',
  'locales-wallet-activity',
  'locales-wallet-dapp',
  'locales-wallet-discover',
  'locales-wallet-home',
  'locales-wallet-settings',
  'locales-wallet-swap',
  'locales-wallet-top-up',
  'locales-wallet-transfer',
]

const promises = []
const locales = {}

localeGroups.forEach((group) => {
  const urlFetch = `${repoUrl}/${group}.json`
  promises.push(fetch(urlFetch).then((res) => res.json()))
})

function processRecords(items) {
  Object.keys(items).forEach((groupKey) => {
    Object.keys(items[groupKey]).forEach((wordKey) => {
      Object.keys(items[groupKey][wordKey]).forEach((localeKey) => {
        if (!locales[localeKey]) locales[localeKey] = {}
        if (!locales[localeKey][groupKey]) locales[localeKey][groupKey] = {}
        locales[localeKey][groupKey][wordKey] = items[groupKey][wordKey][localeKey]
      })
    })
  })
}

Promise.all(promises)
  .then((results) => {
    results.forEach((set) => {
      processRecords(set)
    })

    // Create json files
    const folder = './src/plugins/i18n/'
    const folderPath = path.resolve(folder)
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath)
    }

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
    // eslint-disable-next-line no-console
    console.error(error)
  })
