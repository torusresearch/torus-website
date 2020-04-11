const fs = require('fs')

// eslint-disable-next-line import/no-unresolved
const a = require('./opensea.json')

const array = a.collections
const finalArray = array.reduce((accumulator, current) => {
  accumulator.push(...current.primary_asset_contracts)
  return accumulator
}, [])
const finalJson = finalArray.reduce((accumulator, x) => {
  accumulator[x.address] = {
    name: x.name,
    logo: x.image_url,
    symbol: x.symbol,
  }
  return accumulator
}, {})

fs.writeFileSync('temp2.json', JSON.stringify(finalJson, null, 2))
