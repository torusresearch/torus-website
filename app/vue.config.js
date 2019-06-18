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
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      const TerserPlugin = require('terser-webpack-plugin')
      // Get the current options from the Terser Plugin instance that vue-cli-service added:
      const options = config.optimization.minimizer[0].options
      // Set the options you want to set
      options.terserOptions.keep_fnames = true
      options.terserOptions.mangle.keep_fnames = true
      options.terserOptions.compress.keep_fnames = true
      // create a fresh pülugin instance with the new options and
      // replace the current one with it
      config.optimization.minimizer[0] = new TerserPlugin(options)
    }
  },
  chainWebpack: config => {
    config.plugin('pwa').tap(pwaPlugin => {
      pwaPlugin[0].name = 'Torus'
      pwaPlugin[0].short_name = 'Torus'
      pwaPlugin[0].start_url = process.env.TORUS_BUILD_ENV === 'production' ? `/${version}/index.html` : '/index.html'
      pwaPlugin[0].display = 'standalone'
      pwaPlugin[0].theme_color = '#3996ff'
      pwaPlugin[0].manifestOptions = {
        name: 'Torus',
        short_name: 'Torus',
        start_url: process.env.TORUS_BUILD_ENV === 'production' ? `/${version}/index.html` : '/index.html',
        display: 'standalone',
        theme_color: '#3996ff',
        icons: [
          {
            src:
              process.env.TORUS_BUILD_ENV === 'production'
                ? `/${version}/img/icons/android-chrome-192x192.png`
                : './img/icons/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src:
              process.env.TORUS_BUILD_ENV === 'production'
                ? `/${version}/img/icons/android-chrome-512x512.png`
                : './img/icons/android-chrome-192x192.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
      return pwaPlugin
    })
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
    }
  }
}
