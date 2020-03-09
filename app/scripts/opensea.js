const fs = require('fs')

// eslint-disable-next-line import/no-unresolved
const a = require('./opensea.json')

const arr = a.collections
const finalArr = arr.reduce((acc, curr) => {
  acc.push(...curr.primary_asset_contracts)
  return acc
}, [])
const finalJson = finalArr.reduce((acc, x) => {
  acc[x.address] = {
    name: x.name,
    logo: x.image_url,
    symbol: x.symbol
  }
  return acc
}, {})

fs.writeFileSync('temp2.json', JSON.stringify(finalJson, null, 2))
