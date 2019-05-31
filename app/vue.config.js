const fs = require('fs')
const path = require('path')

module.exports = {
  devServer: {
    // open: process.platform === 'darwin',
    https: true,
    host: 'localhost',
    port: 3000, // CHANGE YOUR PORT HERE!
    // https: {
    //   key: fs.readFileSync(path.resolve('../ssl/server.key')),
    //   cert: fs.readFileSync(path.resolve('../ssl/server.crt'))
    // },
    hotOnly: false,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  css: {
    extract: false
  },

  integrity: true,
  crossorigin: 'anonymous',

  transpileDependencies: ['eth-json-rpc-infura'],

  productionSourceMap: false,

  pluginOptions: {
    prerenderSpa: {
      registry: undefined,
      renderRoutes: [
        '/',
        '/popup',
        '/login',
        '/confirm',
        '/wallet',
        '/wallet/home',
        '/wallet/history',
        '/wallet/accounts',
        '/wallet/settings',
        '/wallet/transfer'
      ],
      useRenderEvent: true,
      headless: true,
      onlyProduction: true
    }
  }
}
