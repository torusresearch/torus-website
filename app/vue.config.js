const fs = require('fs')
const path = require('path')

let routes = ['/', '/popup', '/confirm', '/wallet', '/wallet/home', '/wallet/history', '/wallet/accounts', '/wallet/settings', '/wallet/transfer']

if (process.env.TORUS_BUILD_ENV !== 'production') {
  routes.push('/login')
}

const version = JSON.parse(fs.readFileSync(path.resolve('./package.json'))).buildVersion

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

  publicPath: process.env.TORUS_BUILD_ENV === 'production' ? `/${version}/` : '/',

  integrity: true,
  crossorigin: 'anonymous',

  transpileDependencies: ['eth-json-rpc-infura'],

  productionSourceMap: false,

  pluginOptions: {
    prerenderSpa: {
      registry: undefined,
      renderRoutes: routes,
      useRenderEvent: true,
      headless: true,
      onlyProduction: true
    }
  }
}
