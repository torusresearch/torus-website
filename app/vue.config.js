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
  },

  pwa: {
    name: 'Torus',
    themeColor: '#3996ff',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    workboxPluginMode: 'GenerateSW',
    mainfestPath: process.env.TORUS_BUILD_ENV === 'production' ? `/${version}/manifest.json` : '/manifest.json',
    manifestOptions: {
      name: 'Torus',
      short_name: 'Torus',
      start_url: process.env.TORUS_BUILD_ENV === 'production' ? `/${version}/index.html` : '/index.html',
      display: 'standalone',
      theme_color: '#3996ff'
    },
    iconPaths: {
      favicon32: process.env.TORUS_BUILD_ENV === 'production' ? `/${version}/img/icons/favicon-32x32.png` : 'img/icons/favicon-32x32.png',
      favicon16: process.env.TORUS_BUILD_ENV === 'production' ? `/${version}/img/icons/favicon-16x16.png` : 'img/icons/favicon-16x16.png',
      appleTouchIcon:
        process.env.TORUS_BUILD_ENV === 'production'
          ? `/${version}/img/icons/apple-touch-icon-152x152.png`
          : 'img/icons/apple-touch-icon-152x152.png',
      maskIcon: process.env.TORUS_BUILD_ENV === 'production' ? `/${version}/img/icons/safari-pinned-tab.svg` : 'img/icons/safari-pinned-tab.svg',
      msTileImage:
        process.env.TORUS_BUILD_ENV === 'production'
          ? `/${version}/img/icons/msapplication-icon-144x144.png`
          : 'img/icons/msapplication-icon-144x144.png'
    }
  }
}
