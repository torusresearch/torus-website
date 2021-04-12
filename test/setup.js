require('@babel/register')({
  ignore: [(name) => name.includes('node_modules')],
})

require('dotenv').config({ path: '.env' })

require('./helper')

window.fetch =
  window.fetch ||
  function fetch() {
    return Promise.resolve()
  }
global.indexedDB = {}
global.fetch =
  global.fetch ||
  function fetch() {
    return Promise.resolve()
  }
